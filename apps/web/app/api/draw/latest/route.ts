import { NextResponse } from 'next/server'
import { prisma } from '@golfix/database'
import { getUser } from '@/lib/auth'

export async function GET() {
  const session = await getUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const draw = await prisma.draw.findFirst({
    orderBy: { month: 'desc' },
    include: {
      winners: {
        where: { userId: session.userId },
        select: { matchType: true, status: true },
      },
    },
  })

  return NextResponse.json({ draw })
}
