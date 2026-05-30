'use client'

import { useState } from 'react'
import Link from 'next/link'

type Result =
  | { status: 'approved'; code: string; full_name: string }
  | { status: 'pending'; full_name: string }
  | { status: 'rejected'; full_name: string }
  | { status: 'not_found' }
  | null

export default function CheckPage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result>(null)
  const [error, setError] = useState('')

  async function check(e: React.FormEvent) {
    e.preventDefault()
    if (!phone.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      })
      const data = await res.json()
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

  const waShareText = result?.status === 'approved'
    ? encodeURIComponent(`My access card for Olaitan & Kam's wedding: ${result.code} 🌸 8.8.2026`)
    : ''

  return (
    <main className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-xs">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="font-cormorant italic text-[#9b7355] text-sm hover:text-[#7a5c35] transition-colors">
            ← Back
          </Link>
          <h1 className="font-cormorant text-3xl font-semibold text-[#2c3a1e] mt-3 mb-1">
            Access Card
          </h1>
          <p className="font-cormorant italic text-[#9b7355] text-sm">
            Enter your phone number to check your status
          </p>
        </div>

        {/* Form */}
        {!result && (
          <form onSubmit={check} className="space-y-4">
            <div>
              <label className="block font-jost text-[10px] tracking-[0.12em] uppercase text-[#7a8c5e] font-medium mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 800 000 0000"
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
              disabled={loading || !phone.trim()}
              className="w-full bg-[#2c3a1e] text-[#f5f0e8] font-cormorant text-lg font-semibold tracking-[0.14em] uppercase rounded-lg py-3 hover:bg-[#3d4f2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking…' : 'Check Status'}
            </button>
          </form>
        )}

        {/* Result */}
        {result && result.status === 'approved' && (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#eef2e8] border border-[#b5c99a] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#5e7048]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <p className="font-cormorant italic text-[#9b7355] text-base mb-1">Welcome,</p>
            <p className="font-cormorant text-xl font-semibold text-[#2c3a1e] mb-5">{result.full_name}</p>

            {/* Access card */}
            <div className="bg-white border border-[#ddd6c5] rounded-2xl p-5 mb-5 shadow-sm">
              <p className="font-jost text-[9px] tracking-[0.18em] uppercase text-[#7a8c5e] mb-3">Your Access Card</p>
              <p className="font-mono text-3xl font-bold text-[#4a5e34] tracking-[0.12em] mb-2">{result.code}</p>
              <p className="font-cormorant italic text-[#9b7355] text-sm">Olaitan &amp; Kam · 8.8.2026</p>
            </div>

            <a
              href={`https://wa.me/?text=${waShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full border border-[#5e7048] rounded-lg py-3 font-jost text-sm text-[#5e7048] hover:bg-[#eef2e8] transition-colors mb-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Share via WhatsApp
            </a>

            <button
              onClick={() => { setResult(null); setPhone('') }}
              className="font-jost text-xs text-[#9b9b8a] hover:text-[#5a6a4a] transition-colors"
            >
              Check another number
            </button>
          </div>
        )}

        {result && result.status === 'pending' && (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#fdf5e8] border border-[#dfc89a] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#8c6e3e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12,7 12,12 15,15" />
              </svg>
            </div>
            <p className="font-cormorant text-xl font-semibold text-[#2c3a1e] mb-2">{result.full_name}</p>
            <p className="font-cormorant italic text-[#9b7355] text-base mb-4">Still reviewing — check back soon.</p>
            <button
              onClick={() => { setResult(null); setPhone('') }}
              className="font-jost text-xs text-[#9b9b8a] hover:text-[#5a6a4a] transition-colors"
            >
              Check another number
            </button>
          </div>
        )}

        {result && result.status === 'rejected' && (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#f5f0ec] border border-[#d4c4b5] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#9b7355]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
            <p className="font-cormorant text-xl font-semibold text-[#2c3a1e] mb-2">{result.full_name}</p>
            <p className="font-cormorant italic text-[#9b7355] text-base mb-4">
              Sorry, we couldn&apos;t accommodate your request.
            </p>
            <button
              onClick={() => { setResult(null); setPhone('') }}
              className="font-jost text-xs text-[#9b9b8a] hover:text-[#5a6a4a] transition-colors"
            >
              Check another number
            </button>
          </div>
        )}

        {result && result.status === 'not_found' && (
          <div className="text-center">
            <p className="font-cormorant italic text-[#9b7355] text-base mb-4">
              No request found for that number.
            </p>
            <button
              onClick={() => { setResult(null); setPhone('') }}
              className="w-full border border-[#2c3a1e] rounded-lg py-3 font-cormorant text-lg tracking-[0.14em] uppercase text-[#2c3a1e] hover:bg-[#2c3a1e] hover:text-[#f5f0e8] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

      </div>
    </main>
  )
}
