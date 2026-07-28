'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { CheckInResponse } from '@/types'

export default function UsherCheckIn() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckInResponse | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [result])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/usher/login')
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/usher/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })
      const data = await res.json()
      if (res.status === 401) { router.push('/usher/login'); return }
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        setResult(data)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function scanNext() {
    setResult(null)
    setError('')
    setCode('')
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] flex flex-col">

      {/* Top bar */}
      <header className="bg-white border-b border-[#e8e0d2] px-5 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-cormorant text-xl font-semibold text-[#2c3a1e]">Guest Check-In</h1>
          <p className="font-cormorant italic text-xs text-[#9b7355]">Olaitan &amp; Kam · 8.8.2026</p>
        </div>
        <button
          onClick={signOut}
          className="font-jost text-xs text-[#9b9b8a] hover:text-[#5a6a4a] transition-colors"
        >
          Sign out
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-xs">

          {!result && (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block font-jost text-[10px] tracking-[0.12em] uppercase text-[#7a8c5e] font-medium mb-1.5">
                  Access Code
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="OLA-KAM-XXXX"
                  autoCapitalize="characters"
                  autoComplete="off"
                  required
                  disabled={loading}
                  className="w-full bg-white border border-[#ddd6c5] rounded-lg px-3.5 py-3.5 font-mono text-lg tracking-wider text-center text-[#2c3a1e] placeholder:text-[#b8b5ae] focus:outline-none focus:border-[#5e7048] transition-colors disabled:opacity-60"
                />
              </div>
              {error && (
                <p className="font-jost text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full bg-[#2c3a1e] text-[#f5f0e8] font-cormorant text-lg font-semibold tracking-[0.14em] uppercase rounded-lg py-3.5 hover:bg-[#3d4f2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Checking…' : 'Check In'}
              </button>
            </form>
          )}

          {result && result.result === 'checked_in' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#eef2e8] border border-[#b5c99a] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#5e7048]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              </div>
              <p className="font-cormorant text-2xl font-semibold text-[#2c3a1e] mb-1">✅ Approved</p>
              <p className="font-cormorant italic text-[#9b7355] text-base mb-1">Entry granted</p>
              <p className="font-jost text-sm text-[#4a5e34] font-medium mt-3">{result.full_name}</p>
            </div>
          )}

          {result && result.result === 'already_checked_in' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#fdf5e8] border border-[#dfc89a] flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="font-cormorant text-2xl font-semibold text-[#2c3a1e] mb-1">Already checked in</p>
              <p className="font-jost text-sm text-[#4a5e34] font-medium mt-2">{result.full_name}</p>
              <p className="font-cormorant italic text-[#9b7355] text-sm mt-2">
                {result.checked_in_at && new Date(result.checked_in_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                {result.checked_in_by && ` by ${result.checked_in_by}`}
              </p>
            </div>
          )}

          {result && result.result === 'revoked' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚫</span>
              </div>
              <p className="font-cormorant text-2xl font-semibold text-red-700 mb-1">Access revoked</p>
              <p className="font-jost text-sm text-[#4a5e34] font-medium mt-2">{result.full_name}</p>
            </div>
          )}

          {result && result.result === 'not_approved' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#f5f0ec] border border-[#d4c4b5] flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⛔</span>
              </div>
              <p className="font-cormorant text-2xl font-semibold text-[#2c3a1e] mb-1">Not approved</p>
              <p className="font-jost text-sm text-[#4a5e34] font-medium mt-2">{result.full_name}</p>
              <p className="font-cormorant italic text-[#9b7355] text-sm mt-2">This guest&apos;s request was never approved.</p>
            </div>
          )}

          {result && result.result === 'not_found' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#f5f0ec] border border-[#d4c4b5] flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❓</span>
              </div>
              <p className="font-cormorant text-2xl font-semibold text-[#2c3a1e] mb-1">No match</p>
              <p className="font-cormorant italic text-[#9b7355] text-sm mt-2">No guest found with that code.</p>
            </div>
          )}

          {result && (
            <button
              onClick={scanNext}
              className="w-full border border-[#2c3a1e] rounded-lg py-3 mt-6 font-cormorant text-lg tracking-[0.14em] uppercase text-[#2c3a1e] hover:bg-[#2c3a1e] hover:text-[#f5f0e8] transition-colors"
            >
              Scan Next
            </button>
          )}

        </div>
      </div>
    </main>
  )
}
