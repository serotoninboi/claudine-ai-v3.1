import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        createdAt: true,
      }
    })

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

    return NextResponse.json({ user })
  } catch (err) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}
