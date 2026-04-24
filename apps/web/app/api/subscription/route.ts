import { NextResponse } from 'next/server'
import { prisma } from '@golfix/database'
import { getUser } from '@/lib/auth'

export async function POST() {
  const session = await getUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { subscriptionStatus: true },
  })

  const newStatus = user?.subscriptionStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

  const updated = await prisma.user.update({
    where: { id: session.userId },
    data: { subscriptionStatus: newStatus },
    select: { subscriptionStatus: true },
  })

  return NextResponse.json({ subscriptionStatus: updated.subscriptionStatus })
}
