import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@golfix/database'
import { comparePassword } from '@/lib/password'
import { signToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await comparePassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await signToken({ userId: user.id, role: user.role })
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
      },
    })
    response.cookies.set(setAuthCookie(token))
    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
