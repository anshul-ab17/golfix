import { NextResponse } from 'next/server'
import { prisma } from '@golfix/database'
import { getUser } from '@/lib/auth'

export async function GET() {
  const session = await getUser()
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      subscriptionStatus: true,
      charityPercentage: true,
      createdAt: true,
      charity: { select: { name: true } },
      scores: { select: { score: true, date: true } },
      winners: { select: { id: true, matchType: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ users })
}
