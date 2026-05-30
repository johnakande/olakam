'use client'

import { useState } from 'react'

interface Props {
  onClose: () => void
}

type State = 'idle' | 'loading' | 'success' | 'error'

export default function ReservationModal({ onClose }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return

    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name.trim(), phone: phone.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setState('error')
      } else {
        setState('success')
      }
    } catch {
      setErrorMsg('Network error. Please check your connection.')
      setState('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-6 sm:pb-0"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#faf7f2] rounded-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {state === 'success' ? (
          <SuccessState onClose={onClose} />
        ) : (
          <>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-cormorant text-2xl font-semibold text-[#2c3a1e]">Reservation</h2>
                <p className="font-cormorant italic text-sm text-[#9b7355] mt-0.5">
                  Reserve your seat at our celebration
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[#9b9b8a] hover:text-[#2c3a1e] transition-colors mt-1"
                aria-label="Close"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block font-jost text-[10px] tracking-[0.12em] uppercase text-[#7a8c5e] font-medium mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  disabled={state === 'loading'}
                  className="w-full bg-white border border-[#ddd6c5] rounded-lg px-3.5 py-2.5 font-jost text-sm text-[#2c3a1e] placeholder:text-[#b8b5ae] focus:outline-none focus:border-[#5e7048] transition-colors disabled:opacity-60"
                />
              </div>

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
                  disabled={state === 'loading'}
                  className="w-full bg-white border border-[#ddd6c5] rounded-lg px-3.5 py-2.5 font-jost text-sm text-[#2c3a1e] placeholder:text-[#b8b5ae] focus:outline-none focus:border-[#5e7048] transition-colors disabled:opacity-60"
                />
                <p className="font-jost text-[10px] text-[#9b9b8a] mt-1">Include country code, e.g. +234…</p>
              </div>

              {state === 'error' && (
                <p className="font-jost text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'loading' || !name.trim() || !phone.trim()}
                className="w-full bg-[#2c3a1e] text-[#f5f0e8] font-cormorant text-lg font-semibold tracking-[0.14em] uppercase rounded-lg py-3 hover:bg-[#3d4f2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state === 'loading' ? 'Submitting…' : 'Submit Request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center py-4">
      <div className="w-14 h-14 rounded-full bg-[#eef2e8] border border-[#b5c99a] flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-[#5e7048]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      </div>
      <h2 className="font-cormorant text-2xl font-semibold text-[#2c3a1e] mb-2">Request Received</h2>
      <p className="font-cormorant italic text-[#9b7355] text-base mb-1">
        We&apos;ll be in touch soon.
      </p>
      <p className="font-jost text-xs text-[#7a8c5e] mb-6 leading-relaxed">
        Visit the <strong>/check</strong> page and enter your phone number to see your access card once approved.
      </p>
      <button
        onClick={onClose}
        className="w-full border border-[#2c3a1e] rounded-lg py-3 font-cormorant text-lg tracking-[0.14em] uppercase text-[#2c3a1e] hover:bg-[#2c3a1e] hover:text-[#f5f0e8] transition-colors"
      >
        Close
      </button>
    </div>
  )
}
