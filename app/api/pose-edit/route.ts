import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'
import {
  getHFToken,
  gradioPredict,
  fileToDataUrl,
  HFConfigError,
  HFModelError,
  bufferToDataUrl,
} from '@/lib/hf'
import { InferenceClient } from '@huggingface/inference'

/**
 * POST /api/pose-edit
 *
 * Uses the AnyPose Gradio Space on HuggingFace.
 * Space: linoyts/Qwen-Image-Edit-2511-AnyPose
 *
 * Body: multipart/form-data
 *   image — File (PNG / JPG / WEBP)
 *   pose  — string (preset description or custom instruction)
 */
export async function POST(req: NextRequest) {
  // ── Auth & Credits Check ─────────────────────────────
  let userId: string

  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    // if (!token)
    // return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    userId = payload.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || user.credits < 1) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
  } catch {
    // return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // ── Parse form ───────────────────────────────────
  const formData = await req.formData()
console.log('Received form data:', formData) // Debug log
  const image = formData.get('image') as File | null
  const prompt = formData.get('pose') as string | null

  if (!image || !prompt?.trim()) {
    return NextResponse.json(
      { message: 'Image and prompt are required' },
      { status: 400 }
    )
  }

  // ── HF Token ──────────────────────────────────
  let hfToken: string

  try {
    hfToken = getHFToken()
  } catch (err) {
    if (err instanceof HFConfigError) {
      return NextResponse.json({ message: 'HF Token is not valid' }, { status: 400 })
    }
    throw err
  }

  // ── Init Inference Client ────────────────────
  const hf = new InferenceClient(hfToken)

  try {
    const imageDataUrl = await fileToDataUrl(image)

        const blob = await hf.imageToImage({
	model: "Qwen/Qwen-Image-Edit-2511",
        inputs: image,
      parameters: {
        prompt: prompt.trim(),

                guidance_scale: 7, // Adjust as needed

      },
    })
    // const data = await gradioPredict({
    //   spaceUrl: 'https://linoyts-qwen-image-edit-2511-anypose.hf.space',
    //   data: [imageDataUrl, prompt.trim()],
    //   token: hfToken,
    //   maxRetries: 3,
    //   timeoutMs: 120_000,
    // })


    const resultBuf = await blob.arrayBuffer()
    const resultDataUrl = bufferToDataUrl(resultBuf, "image/png")
    if (!resultDataUrl) {
      return NextResponse.json({ message: 'No result returned from pose model' }, { status: 500 })
    }

    return NextResponse.json({ result: resultDataUrl })
  } catch (err) {
    if (err instanceof HFModelError) {
      if (err.status === 503) {
        return NextResponse.json(
          { message: 'Pose model is still loading after retries — please try again in a moment' },
          { status: 503 }
        )
      }
      return NextResponse.json({ message: err.message }, { status: 502 })
    }
    console.error('[pose-edit] Unexpected error:', err)
    return NextResponse.json({ message: 'Failed to process pose' }, { status: 500 })
  }
}
