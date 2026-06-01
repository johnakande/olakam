'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Guest, GuestStatus } from '@/types'

type Filter = 'all' | GuestStatus

const STATUS_LABEL: Record<GuestStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

const STATUS_COLORS: Record<GuestStatus, string> = {
  pending: 'bg-[#fdf5e8] text-[#8c6e3e] border-[#dfc89a]',
  approved: 'bg-[#eef2e8] text-[#4a5e34] border-[#b5c99a]',
  rejected: 'bg-[#f5f0ec] text-[#7a5c35] border-[#d4c4b5]',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [guests, setGuests] = useState<Guest[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchGuests = useCallback(async () => {
    const params = new URLSearchParams()
    if (filter !== 'all') params.set('status', filter)
    if (search.trim()) params.set('q', search.trim())
    const res = await fetch(`/api/admin/guests?${params}`)
    if (res.status === 401) { router.push('/admin/login'); return }
    const data = await res.json()
    setGuests(data.guests ?? [])
    setLoading(false)
  }, [filter, search, router])

  useEffect(() => {
    fetchGuests()
  }, [fetchGuests])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  async function review(id: string, action: 'approve' | 'reject', guest?: Guest) {
    // Optimistic update
    setGuests((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: action === 'approve' ? 'approved' : 'rejected', reviewed_at: new Date().toISOString() }
          : g
      )
    )

    const res = await fetch('/api/admin/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })

    // On successful approval open a pre-filled WhatsApp message to the guest
    if (action === 'approve' && res.ok && guest) {
      const phone = guest.phone.replace(/\D/g, '') // strip +, spaces, dashes
      const message = encodeURIComponent(
        `Hi ${guest.full_name}! 🎉\n\n` +
        `Your reservation for Olaitan & Kam's Wedding has been approved.\n\n` +
        `Your Access Card: *${guest.code}*\n\n` +
        `Please show this at the venue on Saturday, 8th August 2026.\n\n` +
        `With love — Kam & Olaitan 🌸`
      )
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    }
  }

  const all = guests
  const stats = {
    total: all.length,
    approved: all.filter((g) => g.status === 'approved').length,
    pending: all.filter((g) => g.status === 'pending').length,
    rejected: all.filter((g) => g.status === 'rejected').length,
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-16">

      {/* Top bar */}
      <header className="bg-white border-b border-[#e8e0d2] px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-cormorant text-xl font-semibold text-[#2c3a1e]">Guest List</h1>
          <p className="font-cormorant italic text-xs text-[#9b7355]">Olaitan &amp; Kam · 8.8.2026</p>
        </div>
        <button
          onClick={signOut}
          className="font-jost text-xs text-[#9b9b8a] hover:text-[#5a6a4a] transition-colors"
        >
          Sign out
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { label: 'Total', value: stats.total, color: 'text-[#2c3a1e]' },
            { label: 'Approved', value: stats.approved, color: 'text-[#4a5e34]' },
            { label: 'Pending', value: stats.pending, color: 'text-[#8c6e3e]' },
            { label: 'Rejected', value: stats.rejected, color: 'text-[#7a5c35]' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[#e8e0d2] rounded-xl p-3 text-center">
              <p className={`font-cormorant text-2xl font-semibold ${s.color}`}>{s.value}</p>
              <p className="font-jost text-[9px] tracking-[0.10em] uppercase text-[#9b9b8a] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b9b8a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or phone…"
            className="w-full bg-white border border-[#ddd6c5] rounded-lg pl-9 pr-3.5 py-2.5 font-jost text-sm text-[#2c3a1e] placeholder:text-[#b8b5ae] focus:outline-none focus:border-[#5e7048] transition-colors"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-jost text-[11px] tracking-[0.10em] uppercase px-3 py-1.5 rounded-full border transition-colors ${
                filter === f
                  ? 'bg-[#2c3a1e] text-[#f5f0e8] border-[#2c3a1e]'
                  : 'bg-white text-[#7a8c5e] border-[#ddd6c5] hover:border-[#5e7048]'
              }`}
            >
              {f === 'all' ? 'All' : STATUS_LABEL[f]}
            </button>
          ))}
        </div>

        {/* Guest list */}
        {loading ? (
          <p className="font-cormorant italic text-[#9b7355] text-center py-10">Loading…</p>
        ) : guests.length === 0 ? (
          <p className="font-cormorant italic text-[#9b9b8a] text-center py-10">No guests found.</p>
        ) : (
          <div className="space-y-2">
            {guests.map((guest) => (
              <GuestRow key={guest.id} guest={guest} onReview={review} />
            ))}
          </div>
        )}

      </div>
    </main>
  )
}

function GuestRow({ guest, onReview }: { guest: Guest; onReview: (id: string, action: 'approve' | 'reject', guest?: Guest) => void }) {
  const date = new Date(guest.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return (
    <div className="bg-white border border-[#e8e0d2] rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-jost text-sm font-medium text-[#2c3a1e] truncate">{guest.full_name}</p>
          <p className="font-mono text-xs text-[#7a8c5e] mt-0.5">{guest.phone}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="font-mono text-xs text-[#4a5e34] font-semibold tracking-wider">{guest.code}</span>
            <span className={`font-jost text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[guest.status]}`}>
              {STATUS_LABEL[guest.status]}
            </span>
            <span className="font-jost text-[10px] text-[#9b9b8a]">{date}</span>
          </div>
        </div>

        {guest.status === 'pending' && (
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              onClick={() => onReview(guest.id, 'approve', guest)}
              className="font-jost text-[11px] bg-[#eef2e8] text-[#4a5e34] border border-[#b5c99a] rounded-lg px-2.5 py-1.5 hover:bg-[#dde8d0] transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onReview(guest.id, 'reject')}
              className="font-jost text-[11px] bg-[#f5f0ec] text-[#7a5c35] border border-[#d4c4b5] rounded-lg px-2.5 py-1.5 hover:bg-[#ede4dc] transition-colors"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
