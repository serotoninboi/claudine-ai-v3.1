import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'
import {
  getHFToken,
  gradioPredict,
  fileToDataUrl,
  HFConfigError,
  HFModelError,
} from '@/lib/hf'

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
  // ── Auth ──────────────────────────────────────────────────────────────────
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    verifyToken(token)
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // ── Parse form ────────────────────────────────────────────────────────────
  const formData = await req.formData()
  const image = formData.get('image') as File | null
  const pose = formData.get('pose') as string | null

  if (!image || !pose?.trim()) {
    return NextResponse.json({ message: 'Image and pose description are required' }, { status: 400 })
  }

  // ── HF token ──────────────────────────────────────────────────────────────
  let hfToken: string
  try {
    hfToken = getHFToken()
  } catch (err) {
    if (err instanceof HFConfigError) {
      return NextResponse.json({ message: err.message }, { status: 503 })
    }
    throw err
  }

  // ── Call Gradio Space ─────────────────────────────────────────────────────
  try {
    const imageDataUrl = await fileToDataUrl(image)

    const data = await gradioPredict({
      spaceUrl: 'https://linoyts-qwen-image-edit-2511-anypose.hf.space',
      data: [imageDataUrl, pose.trim()],
      token: hfToken,
      maxRetries: 3,
      timeoutMs: 120_000,
    })

    const result = data[0]
    if (!result) {
      return NextResponse.json({ message: 'No result returned from pose model' }, { status: 500 })
    }

    return NextResponse.json({ result })
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
