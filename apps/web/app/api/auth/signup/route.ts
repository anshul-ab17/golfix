import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@golfix/database'
import { hashPassword } from '@/lib/password'
import { signToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, charityId, charityPercentage = 10 } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    if (typeof charityPercentage === 'number' && charityPercentage < 10) {
      return NextResponse.json({ error: 'Charity percentage must be at least 10%' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        charityId: charityId || null,
        charityPercentage: charityPercentage ?? 10,
      },
      select: {
        id: true,
        email: true,
        role: true,
        subscriptionStatus: true,
        charityId: true,
        charityPercentage: true,
      },
    })

    const token = await signToken({ userId: user.id, role: user.role })
    const response = NextResponse.json({ user }, { status: 201 })
    response.cookies.set(setAuthCookie(token))
    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
