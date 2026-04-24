import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@golfix/database'
import { getUser } from '@/lib/auth'

export async function GET() {
  const session = await getUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const scores = await prisma.score.findMany({
    where: { userId: session.userId },
    orderBy: { date: 'desc' },
    take: 5,
  })

  return NextResponse.json({ scores })
}

export async function POST(request: NextRequest) {
  const session = await getUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { subscriptionStatus: true },
  })
  if (user?.subscriptionStatus !== 'ACTIVE') {
    return NextResponse.json({ error: 'Active subscription required to add scores' }, { status: 403 })
  }

  const { score, date } = await request.json()

  if (typeof score !== 'number' || score < 1 || score > 45) {
    return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 })
  }

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 })
  }

  const scoreDate = new Date(date)
  if (isNaN(scoreDate.getTime())) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  }
  scoreDate.setUTCHours(0, 0, 0, 0)

  const duplicate = await prisma.score.findUnique({
    where: { userId_date: { userId: session.userId, date: scoreDate } },
  })
  if (duplicate) {
    return NextResponse.json({ error: 'A score for this date already exists' }, { status: 409 })
  }

  const count = await prisma.score.count({ where: { userId: session.userId } })
  if (count >= 5) {
    const oldest = await prisma.score.findFirst({
      where: { userId: session.userId },
      orderBy: { date: 'asc' },
    })
    if (oldest) await prisma.score.delete({ where: { id: oldest.id } })
  }

  const newScore = await prisma.score.create({
    data: { userId: session.userId, score, date: scoreDate },
  })

  return NextResponse.json({ score: newScore }, { status: 201 })
}
