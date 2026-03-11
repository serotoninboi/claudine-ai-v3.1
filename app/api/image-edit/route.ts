import { NextRequest, NextResponse } from "next/server"
import { verifyToken, getTokenFromHeader } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getHFToken, fileToDataUrl, bufferToDataUrl, HFConfigError } from "@/lib/hf"

import { InferenceClient } from "@huggingface/inference"

export async function POST(req: NextRequest) {

  // ── Auth & Credits Check ─────────────────────────────
  let userId: string

  try {
    const token = getTokenFromHeader(req.headers.get("authorization"))
    // if (!token)
      // return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    userId = payload.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || user.credits < 1) {
      return NextResponse.json(
        { message: "Insufficient credits. Please top up." },
        { status: 402 }
      )
    }
  } catch {
    // return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // ── Parse form ───────────────────────────────────────
  const formData = await req.formData()

  const image = formData.get("image") as File | null
  const prompt = formData.get("prompt") as string | null

  if (!image || !prompt?.trim()) {
    return NextResponse.json(
      { message: "Image and prompt are required" },
      { status: 400 }
    )
  }

  // ── HF Token ─────────────────────────────────────────
  let hfToken: string

  try {
    hfToken = getHFToken()
  } catch (err) {
    if (err instanceof HFConfigError) {
      return NextResponse.json({ message: err.message }, { status: 503 })
    }
    throw err
  }

  // ── Init Inference Client ────────────────────────────
  const hf = new InferenceClient(hfToken)

  try {
    const imageDataUrl = await fileToDataUrl(image)

    // Call model through inference providers
    const blob = await hf.imageToImage({
	model: "Qwen/Qwen-Image-Edit-2511",
        inputs: image,
      parameters: {
        prompt: prompt.trim(),
        
        guidance_scale: 7, // Adjust as needed
      },
    })

    const resultBuf = await blob.arrayBuffer()
    const resultDataUrl = bufferToDataUrl(resultBuf, "image/png")

    // ── Update DB ──────────────────────────────────────
    // await prisma.$transaction([
    //   prisma.user.update({
    //     where: { id: userId },
    //     data: { credits: { decrement: 1 } },
    //   }),

    //   prisma.generation.create({
    //     data: {
    //       userId,
    //       prompt: prompt.trim(),
    //       outputUrl: resultDataUrl,
    //       modelUsed: "Qwen2-VL-7B-Instruct",
    //     },
    //   }),
    // ])

    return NextResponse.json({ result: resultDataUrl })

  } catch (err) {
    console.error("[image-edit] Unexpected error:", err)

    return NextResponse.json(
      { message: "Failed to process image" },
      { status: 500 }
    )
  }
}