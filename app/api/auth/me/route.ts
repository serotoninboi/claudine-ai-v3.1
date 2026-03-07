import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'
import { UserStore } from '@/lib/userStore'

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { userId } = verifyToken(token)
    const user = UserStore.findById(userId)
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

    return NextResponse.json({ user: UserStore.safe(user) })
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}
