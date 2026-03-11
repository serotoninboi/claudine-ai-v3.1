import { NextRequest, NextResponse } from 'next/server'
import { comparePassword, signToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email?.trim() || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, email: user.email })
    const { passwordHash: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser, token })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
