'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Guest } from '@/types'

function fmt(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function ExportGuestList() {
  const router = useRouter()
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/guests?status=approved')
      .then((res) => {
        if (res.status === 401) { router.push('/admin/login'); return null }
        return res.json()
      })
      .then((data) => {
        if (data) setGuests(data.guests ?? [])
        setLoading(false)
      })
  }, [router])

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-16 print:bg-white">
      <style>{`
        @media print {
          @page { margin: 16mm; }
          .no-print { display: none !important; }
        }
      `}</style>

      <header className="no-print bg-white border-b border-[#e8e0d2] px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <Link href="/admin" className="font-cormorant italic text-[#9b7355] text-sm hover:text-[#7a5c35] transition-colors">
            ← Back to dashboard
          </Link>
          <h1 className="font-cormorant text-xl font-semibold text-[#2c3a1e] mt-1">Approved Guest List</h1>
        </div>
        <div className="flex gap-2">
          <a
            href="/api/admin/export"
            className="font-jost text-[11px] bg-[#eef2e8] text-[#4a5e34] border border-[#b5c99a] rounded-lg px-3 py-2 hover:bg-[#dde8d0] transition-colors"
          >
            Download CSV
          </a>
          <button
            onClick={() => window.print()}
            className="font-jost text-[11px] bg-[#2c3a1e] text-[#f5f0e8] rounded-lg px-3 py-2 hover:bg-[#3d4f2c] transition-colors"
          >
            Print / Save as PDF
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-6 print:pt-0 print:px-0">
        <div className="hidden print:block mb-4 text-center">
          <p className="font-cormorant italic text-lg">Olaitan &amp; Kam · 8.8.2026</p>
          <p className="font-cormorant text-2xl font-semibold">Approved Guest List</p>
          <p className="font-jost text-xs text-gray-500">Generated {new Date().toLocaleString('en-GB')}</p>
        </div>

        {loading ? (
          <p className="font-cormorant italic text-[#9b7355] text-center py-10 no-print">Loading…</p>
        ) : guests.length === 0 ? (
          <p className="font-cormorant italic text-[#9b9b8a] text-center py-10">No approved guests yet.</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-[#2c3a1e] print:border-black">
                <th className="font-jost text-[10px] tracking-[0.10em] uppercase text-[#5a6a4a] print:text-black py-2 pr-2">Name</th>
                <th className="font-jost text-[10px] tracking-[0.10em] uppercase text-[#5a6a4a] print:text-black py-2 pr-2">Phone</th>
                <th className="font-jost text-[10px] tracking-[0.10em] uppercase text-[#5a6a4a] print:text-black py-2 pr-2">Code</th>
                <th className="font-jost text-[10px] tracking-[0.10em] uppercase text-[#5a6a4a] print:text-black py-2 pr-2">Checked In</th>
                <th className="font-jost text-[10px] tracking-[0.10em] uppercase text-[#5a6a4a] print:text-black py-2">Revoked</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g) => (
                <tr key={g.id} className="border-b border-[#e8e0d2] print:border-gray-300">
                  <td className="font-jost text-sm text-[#2c3a1e] py-2 pr-2">{g.full_name}</td>
                  <td className="font-mono text-xs text-[#7a8c5e] print:text-black py-2 pr-2">{g.phone}</td>
                  <td className="font-mono text-xs text-[#4a5e34] print:text-black font-semibold py-2 pr-2">{g.code}</td>
                  <td className="font-jost text-xs text-[#5a6a4a] print:text-black py-2 pr-2">{fmt(g.checked_in_at)}</td>
                  <td className="font-jost text-xs py-2">{g.revoked ? 'Yes' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && guests.length > 0 && (
          <p className="font-jost text-[11px] text-[#9b9b8a] mt-4 no-print">{guests.length} approved guest{guests.length === 1 ? '' : 's'}</p>
        )}
      </div>
    </main>
  )
}
