import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  getHFToken,
  hfInference,
  fileToDataUrl,
  bufferToDataUrl,
  HFConfigError,
  HFModelError,
} from '@/lib/hf'

export async function POST(req: NextRequest) {
  // ── Auth & Credits Check ────────────────────────────────────────────────────
  let userId: string
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    userId = payload.userId

    // Check credits
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || user.credits < 1) {
      return NextResponse.json({ message: 'Insufficient credits. Please top up.' }, { status: 402 })
    }
  } catch (err) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // ── Parse form ──────────────────────────────────────────────────────────────
  const formData = await req.formData()
  const image = formData.get('image') as File | null
  const prompt = formData.get('prompt') as string | null

  if (!image || !prompt?.trim()) {
    return NextResponse.json({ message: 'Image and prompt are required' }, { status: 400 })
  }

  // ── HF token ────────────────────────────────────────────────────────────────
  let hfToken: string
  try {
    hfToken = getHFToken()
  } catch (err) {
    if (err instanceof HFConfigError) {
      return NextResponse.json({ message: err.message }, { status: 503 })
    }
    throw err
  }

  // ── Call model ──────────────────────────────────────────────────────────────
  try {
    const imageDataUrl = await fileToDataUrl(image)

    const res = await hfInference({
      model: 'Qwen/Qwen2-VL-7B-Instruct',
      token: hfToken,
      body: {
        inputs: {
          image: imageDataUrl,
          text: prompt.trim(),
        },
      },
      maxRetries: 3,
      timeoutMs: 120_000,
    })

    const resultBuf = await res.arrayBuffer()
    const mime = res.headers.get('content-type') || 'image/png'
    const resultDataUrl = bufferToDataUrl(resultBuf, mime)

    // ── Update DB: Deduct credit & Log generation ─────────────────────────────
    // Note: For production, upload resultDataUrl to a blob store (S3, R2) 
    // and save the URL instead of the full base64 string.
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } }
      }),
      prisma.generation.create({
        data: {
          userId,
          prompt: prompt.trim(),
          outputUrl: resultDataUrl, 
          modelUsed: 'Qwen2-VL-7B-Instruct'
        }
      })
    ])

    return NextResponse.json({ result: resultDataUrl })
  } catch (err) {
    if (err instanceof HFModelError) {
      if (err.status === 503) {
        return NextResponse.json(
          { message: 'Model is still loading after retries — please try again in a moment' },
          { status: 503 }
        )
      }
      return NextResponse.json({ message: err.message }, { status: 502 })
    }
    console.error('[image-edit] Unexpected error:', err)
    return NextResponse.json({ message: 'Failed to process image' }, { status: 500 })
  }
}
