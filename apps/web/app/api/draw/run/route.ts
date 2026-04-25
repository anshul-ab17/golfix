import { NextResponse } from 'next/server'
import { prisma } from '@golfix/database'
import { getUser } from '@/lib/auth'

function generateUniqueNumbers(count: number, min: number, max: number): number[] {
  const numbers = new Set<number>()
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * (max - min + 1)) + min)
  }
  return Array.from(numbers)
}

export async function POST() {
  const session = await getUser()
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const now = new Date()
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))

  const existingDraw = await prisma.draw.findUnique({ where: { month: monthStart } })
  if (existingDraw) {
    return NextResponse.json({ error: 'Draw already ran for this month' }, { status: 409 })
  }

  const drawNumbers = generateUniqueNumbers(5, 1, 45)

  const draw = await prisma.draw.create({
    data: { month: monthStart, numbers: drawNumbers },
  })

  const activeUsers = await prisma.user.findMany({
    where: { subscriptionStatus: 'ACTIVE' },
    include: { scores: true },
  })

  const winners = []
  for (const user of activeUsers) {
    if (user.scores.length === 0) continue

    const userValues = new Set(user.scores.map((s: { score: number }) => s.score))
    const drawSet = new Set(drawNumbers)
    const matchCount = [...userValues].filter(v => drawSet.has(v)).length

    if (matchCount >= 3) {
      const winner = await prisma.winner.create({
        data: { userId: user.id, drawId: draw.id, matchType: matchCount },
      })
      winners.push({ ...winner, user: { email: user.email } })
    }
  }

  return NextResponse.json({ draw, winners })
}
