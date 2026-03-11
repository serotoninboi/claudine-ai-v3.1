import { NextRequest, NextResponse } from "next/server"
import { verifyToken, getTokenFromHeader } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getHFToken, fileToDataUrl, bufferToDataUrl, HFConfigError } from "@/lib/hf"

import { InferenceClient } from "@huggingface/inference"

export async function POST(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"))
  if (!token) {
    return NextResponse.json({ message: "Authorization token missing" }, { status: 401 })
  }

  let payload
  try {
    payload = verifyToken(token)
  } catch (err) {
    console.warn("[image-edit] Invalid token", err)
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  })

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (user.credits < 1) {
    return NextResponse.json(
      { message: "Insufficient credits. Please top up." },
      { status: 402 }
    )
  }

  const formData = await req.formData()
  const image = formData.get("image") as File | null
  const prompt = formData.get("prompt") as string | null

  if (!image || !prompt?.trim()) {
    return NextResponse.json(
      { message: "Image and prompt are required" },
      { status: 400 }
    )
  }

  let hfToken: string
  try {
    hfToken = getHFToken()
  } catch (err) {
    if (err instanceof HFConfigError) {
      return NextResponse.json({ message: err.message }, { status: 503 })
    }
    throw err
  }

  const hf = new InferenceClient(hfToken)

  try {
    const imageDataUrl = await fileToDataUrl(image)

    const blob = await hf.imageToImage({
      model: "Qwen/Qwen-Image-Edit-2511",
      inputs: image,
      parameters: {
        prompt: prompt.trim(),
        guidance_scale: 7,
      },
    })

    const resultBuf = await blob.arrayBuffer()
    const resultDataUrl = bufferToDataUrl(resultBuf, "image/png")

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      }),
      prisma.generation.create({
        data: {
          userId: user.id,
          prompt: prompt.trim(),
          inputUrl: imageDataUrl,
          outputUrl: resultDataUrl,
          modelUsed: "Qwen/Qwen-Image-Edit-2511",
        },
      }),
    ])

    return NextResponse.json({ result: resultDataUrl })
  } catch (err) {
    console.error("[image-edit] Unexpected error:", err)
    return NextResponse.json(
      { message: "Failed to process image" },
      { status: 500 }
    )
  }
}
