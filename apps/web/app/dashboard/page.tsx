'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface Score {
  id: string
  score: number
  date: string
}

interface Winner {
  matchType: number
  status: string
  draw: { numbers: number[]; month: string }
}

interface User {
  id: string
  email: string
  role: string
  subscriptionStatus: string
  charityId: string | null
  charityPercentage: number
  charity: { id: string; name: string } | null
  scores: Score[]
  winners: Winner[]
}

interface Draw {
  id: string
  numbers: number[]
  month: string
  winners: { matchType: number; status: string }[]
}

const MATCH_LABELS: Record<number, string> = {
  3: 'Small Prize',
  4: 'Medium Prize',
  5: 'Jackpot',
}

const MATCH_EMOJI: Record<number, string> = {
  3: '🥉',
  4: '🥈',
  5: '🥇',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [latestDraw, setLatestDraw] = useState<Draw | null>(null)
  const [loading, setLoading] = useState(true)
  const [scoreValue, setScoreValue] = useState('')
  const [scoreDate, setScoreDate] = useState('')
  const [scoreError, setScoreError] = useState('')
  const [addingScore, setAddingScore] = useState(false)
  const [togglingSubscription, setTogglingSubscription] = useState(false)

  useEffect(() => {
    fetchUser()
    fetchDraw()
  }, [])

  async function fetchUser() {
    const res = await fetch('/api/auth/me')
    if (res.status === 401) {
      router.push('/auth/login')
      return
    }
    const data = await res.json()
    setUser(data.user)
    setLoading(false)
  }

  async function fetchDraw() {
    const res = await fetch('/api/draw/latest')
    if (res.ok) {
      const data = await res.json()
      setLatestDraw(data.draw)
    }
  }

  async function toggleSubscription() {
    setTogglingSubscription(true)
    const res = await fetch('/api/subscription', { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setUser(u => (u ? { ...u, subscriptionStatus: data.subscriptionStatus } : u))
    }
    setTogglingSubscription(false)
  }

  async function addScore(e: FormEvent) {
    e.preventDefault()
    setScoreError('')
    setAddingScore(true)

    const res = await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: Number(scoreValue), date: scoreDate }),
    })

    const data = await res.json()
    setAddingScore(false)

    if (!res.ok) {
      setScoreError(data.error)
      return
    }

    setScoreValue('')
    setScoreDate('')
    fetchUser()
  }

  async function deleteScore(id: string) {
    await fetch(`/api/scores/${id}`, { method: 'DELETE' })
    fetchUser()
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-emerald-400 animate-pulse">Loading…</div>
      </div>
    )
  }

  if (!user) return null

  const isActive = user.subscriptionStatus === 'ACTIVE'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-xl z-10">
        <div className="text-xl font-black tracking-tighter text-emerald-400">GOLFIX</div>
        <div className="flex items-center gap-5">
          <span className="text-slate-500 text-sm hidden sm:block">{user.email}</span>
          {user.role === 'ADMIN' && (
            <a href="/admin" className="text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
              Admin
            </a>
          )}
          <button
            onClick={logout}
            className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-3xl font-black">Dashboard</h1>

        {/* Subscription */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold mb-2">Subscription</h2>
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-700/60 text-slate-400'
              }`}
            >
              {user.subscriptionStatus}
            </span>
          </div>
          <button
            onClick={toggleSubscription}
            disabled={togglingSubscription}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${
              isActive
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-100'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>

        {/* Scores */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold mb-4">My Scores</h2>

          {isActive && (
            <form onSubmit={addScore} className="flex gap-2 mb-5 flex-wrap">
              <input
                type="number"
                value={scoreValue}
                onChange={e => setScoreValue(e.target.value)}
                min={1}
                max={45}
                required
                placeholder="Score (1–45)"
                className="flex-1 min-w-[110px] bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
              />
              <input
                type="date"
                value={scoreDate}
                onChange={e => setScoreDate(e.target.value)}
                required
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
              />
              <button
                type="submit"
                disabled={addingScore}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
              >
                {addingScore ? '…' : 'Add'}
              </button>
            </form>
          )}

          {scoreError && <p className="text-red-400 text-sm mb-3">{scoreError}</p>}

          {!isActive && (
            <p className="text-slate-500 text-sm mb-4">Activate your subscription to add scores.</p>
          )}

          {user.scores.length === 0 ? (
            <p className="text-slate-600 text-sm">No scores yet.</p>
          ) : (
            <div className="space-y-2">
              {user.scores.map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between bg-slate-800/50 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-emerald-400 w-8 text-center">
                      {s.score}
                    </span>
                    <span className="text-slate-400 text-sm">
                      {new Date(s.date).toLocaleDateString('en', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteScore(s.id)}
                    className="text-slate-600 hover:text-red-400 text-xs transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <p className="text-slate-600 text-xs pt-1">
                {user.scores.length}/5 scores · Adding a 6th replaces the oldest
              </p>
            </div>
          )}
        </div>

        {/* Charity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold mb-3">Charity Contribution</h2>
          {user.charity ? (
            <div>
              <p className="text-slate-100 font-medium">{user.charity.name}</p>
              <p className="text-slate-400 text-sm mt-1">{user.charityPercentage}% of subscription</p>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">
              No charity selected. You can update this in your profile settings.
            </p>
          )}
        </div>

        {/* Latest Draw */}
        {latestDraw && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold mb-4">
              Latest Draw{' '}
              <span className="text-slate-500 font-normal text-sm">
                {new Date(latestDraw.month).toLocaleDateString('en', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </h2>

            <div className="flex gap-2 mb-4 flex-wrap">
              {latestDraw.numbers.map((n, i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 font-black text-lg"
                >
                  {n}
                </div>
              ))}
            </div>

            {latestDraw.winners && latestDraw.winners.length > 0 ? (
              <div className="space-y-2">
                {latestDraw.winners.map((w, i) => (
                  <div
                    key={i}
                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3"
                  >
                    <p className="text-emerald-400 font-bold">
                      {MATCH_EMOJI[w.matchType]} {MATCH_LABELS[w.matchType] ?? `${w.matchType} matches`}
                    </p>
                    <p className="text-slate-400 text-sm mt-0.5">Status: {w.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-sm">No wins this month. Keep playing!</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
