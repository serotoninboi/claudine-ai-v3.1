import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, signToken } from '@/lib/auth'
import { UserStore } from '@/lib/userStore'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 })
    }
    if (UserStore.findByEmail(email)) {
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const user = UserStore.create({ name: name.trim(), email, passwordHash })
    const token = signToken({ userId: user.id, email: user.email })

    return NextResponse.json({ user: UserStore.safe(user), token }, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
