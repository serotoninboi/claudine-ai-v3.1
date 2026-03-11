import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { userId } = verifyToken(token)
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

    const { passwordHash: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}
