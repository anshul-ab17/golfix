'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Score {
  score: number
  date: string
}

interface WinnerEntry {
  id: string
  matchType: number
  status: string
}

interface User {
  id: string
  email: string
  role: string
  subscriptionStatus: string
  charityPercentage: number
  createdAt: string
  charity: { name: string } | null
  scores: Score[]
  winners: WinnerEntry[]
}

interface DrawResult {
  draw: { id: string; numbers: number[]; month: string }
  winners: { userId: string; matchType: number; user: { email: string } }[]
}

const MATCH_LABEL: Record<number, string> = {
  3: 'Small Prize',
  4: 'Medium Prize',
  5: 'Jackpot',
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [runningDraw, setRunningDraw] = useState(false)
  const [drawResult, setDrawResult] = useState<DrawResult | null>(null)
  const [drawError, setDrawError] = useState('')

  useEffect(() => {
    fetch('/api/admin/users').then(r => {
      if (r.status === 403) {
        router.push('/dashboard')
        return null
      }
      return r.json()
    }).then(data => {
      if (data) {
        setUsers(data.users)
        setLoading(false)
      }
    })
  }, [router])

  async function runDraw() {
    setRunningDraw(true)
    setDrawError('')
    setDrawResult(null)

    const res = await fetch('/api/draw/run', { method: 'POST' })
    const data = await res.json()
    setRunningDraw(false)

    if (!res.ok) {
      setDrawError(data.error)
      return
    }

    setDrawResult(data)
    fetchUsers()
  }

  async function fetchUsers() {
    const res = await fetch('/api/admin/users')
    if (res.ok) {
      const data = await res.json()
      setUsers(data.users)
    }
  }

  async function verifyWinner(winnerId: string, status: 'APPROVED' | 'REJECTED') {
    await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winnerId, status }),
    })
    fetchUsers()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-emerald-400 animate-pulse">Loading…</div>
      </div>
    )
  }

  const allWinners = users.flatMap(u =>
    u.winners.map(w => ({ ...w, userEmail: u.email }))
  )
  const pendingWinners = allWinners.filter(w => w.status === 'PENDING')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <div className="text-xl font-black tracking-tighter text-emerald-400">GOLFIX</div>
          <span className="text-slate-600 text-sm font-medium bg-slate-800 px-2 py-0.5 rounded-md">Admin</span>
        </div>
        <a href="/dashboard" className="text-slate-400 text-sm hover:text-slate-100 transition-colors">
          ← Dashboard
        </a>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-3xl font-black">Admin Panel</h1>

        {/* Draw Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold mb-4">Monthly Draw</h2>

          <button
            onClick={runDraw}
            disabled={runningDraw}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50 text-sm"
          >
            {runningDraw ? 'Running Draw…' : 'Run Monthly Draw'}
          </button>

          {drawError && <p className="text-red-400 text-sm mt-3">{drawError}</p>}

          {drawResult && (
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Draw Numbers</p>
                <div className="flex gap-2 flex-wrap">
                  {drawResult.draw.numbers.map((n, i) => (
                    <div
                      key={i}
                      className="w-11 h-11 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-center text-emerald-400 font-black"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>

              {drawResult.winners.length > 0 ? (
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">
                    Winners ({drawResult.winners.length})
                  </p>
                  <div className="space-y-2">
                    {drawResult.winners.map((w, i) => (
                      <div
                        key={i}
                        className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-emerald-400 font-semibold text-sm">{w.user.email}</p>
                          <p className="text-slate-400 text-xs mt-0.5">
                            {w.matchType} matches · {MATCH_LABEL[w.matchType] ?? 'Prize'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No winners this month.</p>
              )}
            </div>
          )}
        </div>

        {/* Pending Verifications */}
        {pendingWinners.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold mb-4">
              Pending Verifications{' '}
              <span className="text-emerald-400 text-sm">({pendingWinners.length})</span>
            </h2>
            <div className="space-y-3">
              {pendingWinners.map(w => (
                <div
                  key={w.id}
                  className="flex items-center justify-between bg-slate-800/50 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="text-slate-100 text-sm font-medium">{w.userEmail}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {w.matchType} matches · {MATCH_LABEL[w.matchType] ?? 'Prize'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => verifyWinner(w.id, 'APPROVED')}
                      className="text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => verifyWinner(w.id, 'REJECTED')}
                      className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold mb-4">
            Users{' '}
            <span className="text-slate-500 font-normal text-sm">({users.length})</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-800">
                  <th className="pb-3 text-xs uppercase tracking-wider text-slate-500 font-medium pr-4">Email</th>
                  <th className="pb-3 text-xs uppercase tracking-wider text-slate-500 font-medium pr-4">Status</th>
                  <th className="pb-3 text-xs uppercase tracking-wider text-slate-500 font-medium pr-4">Scores</th>
                  <th className="pb-3 text-xs uppercase tracking-wider text-slate-500 font-medium pr-4">Charity</th>
                  <th className="pb-3 text-xs uppercase tracking-wider text-slate-500 font-medium pr-4">Wins</th>
                  <th className="pb-3 text-xs uppercase tracking-wider text-slate-500 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="py-3 pr-4 text-slate-100">{u.email}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.subscriptionStatus === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-700/60 text-slate-400'
                        }`}
                      >
                        {u.subscriptionStatus}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-300">{u.scores.length}</td>
                    <td className="py-3 pr-4 text-slate-400 text-xs">{u.charity?.name ?? '—'}</td>
                    <td className="py-3 pr-4">
                      {u.winners.length > 0 ? (
                        <span className="text-xs text-emerald-400">{u.winners.length} win(s)</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3 text-slate-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
