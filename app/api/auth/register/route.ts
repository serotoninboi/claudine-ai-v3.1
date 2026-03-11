import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, signToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 })
    }
    const normalizedEmail = email.trim().toLowerCase()
    if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) {
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        email: normalizedEmail,
        passwordHash,
      },
    })
    const token = signToken({ userId: user.id, email: user.email })

    const { passwordHash: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser, token }, { status: 201 })
  } catch(e) {
    console.error('Error during registration', e)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
