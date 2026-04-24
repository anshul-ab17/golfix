'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Charity {
  id: string
  name: string
  description: string
}

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [charityId, setCharityId] = useState('')
  const [charityPercentage, setCharityPercentage] = useState(10)
  const [charities, setCharities] = useState<Charity[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/charities')
      .then(r => r.json())
      .then(d => setCharities(d.charities ?? []))
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        charityId: charityId || undefined,
        charityPercentage,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Signup failed')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-black tracking-tighter text-emerald-400">
            GOLFIX
          </Link>
          <p className="text-slate-400 mt-3 text-sm">Create your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Min 8 characters"
            />
          </div>

          {charities.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Charity{' '}
                <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <select
                value={charityId}
                onChange={e => setCharityId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">Choose a charity…</option>
                {charities.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {charityId && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contribution %{' '}
                <span className="text-slate-500 font-normal">(min 10%)</span>
              </label>
              <input
                type="number"
                value={charityPercentage}
                onChange={e => setCharityPercentage(Number(e.target.value))}
                min={10}
                max={100}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          <p className="text-center text-slate-500 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
