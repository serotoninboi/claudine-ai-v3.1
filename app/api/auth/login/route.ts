import { NextRequest, NextResponse } from 'next/server'
import { comparePassword, signToken } from '@/lib/auth'
import { UserStore } from '@/lib/userStore'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email?.trim() || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
    }

    const user = UserStore.findByEmail(email)
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, email: user.email })
    return NextResponse.json({ user: UserStore.safe(user), token })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
