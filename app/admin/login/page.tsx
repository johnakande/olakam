'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Invalid credentials.')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-5">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#eef2e8] border border-[#b5c99a] flex items-center justify-center mx-auto mb-4">
            <span className="font-cormorant text-lg font-semibold text-[#4a5e34] leading-none">OK</span>
          </div>
          <h1 className="font-cormorant text-2xl font-semibold text-[#2c3a1e]">Admin Login</h1>
          <p className="font-cormorant italic text-[#9b7355] text-sm mt-1">Olaitan &amp; Kam · 8.8.2026</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block font-jost text-[10px] tracking-[0.12em] uppercase text-[#7a8c5e] font-medium mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-white border border-[#ddd6c5] rounded-lg px-3.5 py-2.5 font-jost text-sm text-[#2c3a1e] placeholder:text-[#b8b5ae] focus:outline-none focus:border-[#5e7048] transition-colors disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-jost text-[10px] tracking-[0.12em] uppercase text-[#7a8c5e] font-medium mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-white border border-[#ddd6c5] rounded-lg px-3.5 py-2.5 font-jost text-sm text-[#2c3a1e] placeholder:text-[#b8b5ae] focus:outline-none focus:border-[#5e7048] transition-colors disabled:opacity-60"
            />
          </div>

          {error && (
            <p className="font-jost text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2c3a1e] text-[#f5f0e8] font-cormorant text-lg font-semibold tracking-[0.14em] uppercase rounded-lg py-3 hover:bg-[#3d4f2c] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}
