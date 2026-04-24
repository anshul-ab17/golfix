import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@golfix/database'
import { getUser } from '@/lib/auth'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const score = await prisma.score.findUnique({ where: { id } })
  if (!score || score.userId !== session.userId) {
    return NextResponse.json({ error: 'Score not found' }, { status: 404 })
  }

  await prisma.score.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
