import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@golfix/database'
import { getUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { charityId, charityPercentage } = await request.json()

  if (!charityId) {
    return NextResponse.json({ error: 'Charity ID is required' }, { status: 400 })
  }

  if (typeof charityPercentage !== 'number' || charityPercentage < 10) {
    return NextResponse.json({ error: 'Charity percentage must be at least 10%' }, { status: 400 })
  }

  const charity = await prisma.charity.findUnique({ where: { id: charityId } })
  if (!charity) {
    return NextResponse.json({ error: 'Charity not found' }, { status: 404 })
  }

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: { charityId, charityPercentage },
    select: {
      charityId: true,
      charityPercentage: true,
      charity: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json({ user })
}
