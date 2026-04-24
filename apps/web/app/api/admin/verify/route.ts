import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@golfix/database'
import { getUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getUser()
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const { winnerId, status, proofUrl } = await request.json()

  if (!winnerId || !['APPROVED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const winner = await prisma.winner.update({
    where: { id: winnerId },
    data: { status, ...(proofUrl && { proofUrl }) },
  })

  return NextResponse.json({ winner })
}
