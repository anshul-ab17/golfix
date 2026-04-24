import { NextResponse } from 'next/server'
import { prisma } from '@golfix/database'
import { getUser } from '@/lib/auth'

export async function GET() {
  const session = await getUser()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      role: true,
      subscriptionStatus: true,
      charityId: true,
      charityPercentage: true,
      charity: { select: { id: true, name: true } },
      scores: { orderBy: { date: 'desc' }, take: 5 },
      winners: {
        include: { draw: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user })
}
