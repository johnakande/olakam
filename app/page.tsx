'use client'

import { useState } from 'react'
import Countdown from '@/components/Countdown'
import ReservationModal from '@/components/ReservationModal'
import GiftModal from '@/components/GiftModal'

const CHURCH_MAP = 'https://maps.google.com/maps/place//data=!4m2!3m1!1s0x104e0d676e6776b3:0x6f74d528dfe431b?entry=s'
const RECEPTION_MAP = 'https://maps.google.com/maps/place//data=!4m2!3m1!1s0x104e750fcb20c143:0xedd8b612f838b8a4?entry=s'
// TODO: Replace with actual aso-ebi contact number before launch
const ASOEBI_WA = 'https://wa.me/2348000000000'

function FloralCorner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      {/* Soft glow backdrops */}
      <circle cx="210" cy="35" r="95" fill="rgba(250,210,195,0.14)" />
      <circle cx="175" cy="75" r="65" fill="rgba(245,200,185,0.11)" />

      {/* Leaf — sweeping left */}
      <path d="M 156 112 Q 126 84 136 57" stroke="rgba(130,158,105,0.38)" strokeWidth="10" strokeLinecap="round" />
      <path d="M 160 115 Q 130 88 140 60 Q 150 35 172 48" stroke="rgba(130,158,105,0.58)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Leaf — sweeping right */}
      <path d="M 188 120 Q 224 105 229 74" stroke="rgba(130,158,105,0.33)" strokeWidth="9" strokeLinecap="round" />
      <path d="M 190 122 Q 228 106 232 75 Q 236 48 213 40" stroke="rgba(130,158,105,0.53)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Small trailing stem */}
      <path d="M 174 118 Q 188 140 212 136" stroke="rgba(130,158,105,0.43)" strokeWidth="2" strokeLinecap="round" />

      {/* Main flower — (198, 48) */}
      <g transform="translate(198,48)">
        <ellipse cx="0" cy="-28" rx="12" ry="26" fill="rgba(238,182,165,0.72)" />
        <ellipse cx="0" cy="-28" rx="12" ry="26" fill="rgba(242,188,172,0.68)" transform="rotate(72)" />
        <ellipse cx="0" cy="-28" rx="12" ry="26" fill="rgba(235,175,160,0.70)" transform="rotate(144)" />
        <ellipse cx="0" cy="-28" rx="12" ry="26" fill="rgba(240,185,168,0.68)" transform="rotate(216)" />
        <ellipse cx="0" cy="-28" rx="12" ry="26" fill="rgba(237,180,163,0.70)" transform="rotate(288)" />
        <circle r="11" fill="rgba(250,222,205,0.90)" />
        <circle r="5.5" fill="rgba(222,185,160,0.78)" />
      </g>

      {/* Medium flower — (158, 92) */}
      <g transform="translate(158,92)">
        <ellipse cx="0" cy="-21" rx="9" ry="19" fill="rgba(242,190,175,0.70)" />
        <ellipse cx="0" cy="-21" rx="9" ry="19" fill="rgba(235,178,162,0.66)" transform="rotate(72)" />
        <ellipse cx="0" cy="-21" rx="9" ry="19" fill="rgba(245,195,180,0.68)" transform="rotate(144)" />
        <ellipse cx="0" cy="-21" rx="9" ry="19" fill="rgba(238,182,166,0.66)" transform="rotate(216)" />
        <ellipse cx="0" cy="-21" rx="9" ry="19" fill="rgba(241,187,171,0.68)" transform="rotate(288)" />
        <circle r="8" fill="rgba(250,218,202,0.88)" />
        <circle r="4" fill="rgba(218,182,158,0.75)" />
      </g>

      {/* Small bud — (228, 100) */}
      <g transform="translate(228,100)">
        <ellipse cx="0" cy="-14" rx="6.5" ry="12" fill="rgba(245,198,182,0.68)" />
        <ellipse cx="0" cy="-14" rx="6.5" ry="12" fill="rgba(238,188,172,0.64)" transform="rotate(72)" />
        <ellipse cx="0" cy="-14" rx="6.5" ry="12" fill="rgba(248,202,186,0.66)" transform="rotate(144)" />
        <ellipse cx="0" cy="-14" rx="6.5" ry="12" fill="rgba(241,192,176,0.64)" transform="rotate(216)" />
        <ellipse cx="0" cy="-14" rx="6.5" ry="12" fill="rgba(245,196,180,0.66)" transform="rotate(288)" />
        <circle r="5.5" fill="rgba(252,225,210,0.86)" />
        <circle r="2.8" fill="rgba(225,188,165,0.72)" />
      </g>

      {/* Tiny accent — (242, 58) */}
      <g transform="translate(242,58)">
        <ellipse cx="0" cy="-9" rx="4.5" ry="8" fill="rgba(245,200,185,0.55)" />
        <ellipse cx="0" cy="-9" rx="4.5" ry="8" fill="rgba(245,200,185,0.50)" transform="rotate(90)" />
        <circle r="3.5" fill="rgba(252,225,210,0.72)" />
      </g>

      {/* Scattered accent dots */}
      <circle cx="135" cy="105" r="2.5" fill="rgba(238,182,165,0.42)" />
      <circle cx="148" cy="118" r="2"   fill="rgba(130,158,105,0.36)" />
      <circle cx="208" cy="118" r="2"   fill="rgba(238,182,165,0.38)" />
      <circle cx="242" cy="80"  r="1.5" fill="rgba(238,182,165,0.33)" />
      <circle cx="218" cy="128" r="1.5" fill="rgba(130,158,105,0.31)" />
    </svg>
  )
}

export default function WeddingPage() {
  const [showGift, setShowGift] = useState(false)
  const [showReservation, setShowReservation] = useState(false)

  return (
    <main className="min-h-screen bg-[#faf7f2] flex flex-col items-center relative overflow-hidden">

      {/* Top-right floral */}
      <FloralCorner className="absolute top-0 right-0 w-52 h-44 md:w-64 md:h-56 pointer-events-none select-none" />

      {/* Page content */}
      <div className="w-full max-w-xs mx-auto px-5 pt-10 pb-20 text-center relative z-10">

        {/* Opening tagline */}
        <p className="font-cormorant italic text-[#9b7355] text-base leading-relaxed mb-5">
          With praise to God and joyful hearts,<br />
          We invite you to witness the union of
        </p>

        {/* Wreath accent above names */}
        <div className="flex justify-center mb-1">
          <svg viewBox="0 0 130 50" className="w-28 h-11 opacity-65" fill="none" aria-hidden="true">
            <path d="M 8 25 Q 32 8 58 20 Q 65 23 72 20 Q 98 8 122 25" stroke="rgba(130,158,105,0.62)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <circle cx="65" cy="17" r="4.5" fill="rgba(245,195,180,0.70)" />
            <circle cx="52" cy="21" r="2.8" fill="rgba(130,158,105,0.52)" />
            <circle cx="78" cy="21" r="2.8" fill="rgba(130,158,105,0.52)" />
            <circle cx="40" cy="20" r="2.2" fill="rgba(245,195,180,0.55)" />
            <circle cx="90" cy="20" r="2.2" fill="rgba(245,195,180,0.55)" />
            <circle cx="28" cy="22" r="1.6" fill="rgba(130,158,105,0.42)" />
            <circle cx="102" cy="22" r="1.6" fill="rgba(130,158,105,0.42)" />
          </svg>
        </div>

        {/* Couple names — calligraphic */}
        <h1 className="font-cormorant italic text-[#7a5c35] leading-[0.92] tracking-wide">
          <span className="text-[72px] block">Olaitan</span>
          <span className="text-[72px] block">&amp; Kam</span>
        </h1>

        {/* Full names in small caps */}
        <div className="flex justify-between items-start mt-4 mb-1 px-1">
          <span className="font-jost text-[10px] tracking-[0.14em] uppercase text-[#5a6a4a] text-left leading-relaxed">
            Olaitan<br />Margaret Ajao
          </span>
          <span className="font-jost text-[10px] tracking-[0.14em] uppercase text-[#5a6a4a] text-right leading-relaxed">
            Kam Barinodum<br />Wiwuga
          </span>
        </div>

        {/* Tagline */}
        <p className="font-cormorant italic text-[#9b7355] text-sm mt-3 mb-6">
          as they begin their life together in Christ
        </p>

        {/* Date divider */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-[#c9aa7c] opacity-50" />
          <span className="font-jost text-[10px] tracking-[0.20em] uppercase text-[#9b7355]">Saturday</span>
          <div className="flex-1 h-px bg-[#c9aa7c] opacity-50" />
        </div>

        {/* Date */}
        <p className="font-cormorant text-[34px] font-semibold text-[#2c3a1e] tracking-wide leading-tight mb-1">
          8<sup className="text-2xl align-super">TH</sup> August, 2026
        </p>

        {/* Event name */}
        <p className="font-jost text-[10px] tracking-[0.16em] uppercase text-[#5a6a4a] mb-5">
          Thanksgiving &amp; Wedding Ceremony
        </p>

        {/* Time */}
        <div className="flex items-center justify-center gap-2 text-[#5a6a4a] mb-2">
          <svg className="w-4 h-4 opacity-65" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <polyline points="12,7 12,12 15,15" />
          </svg>
          <span className="font-jost text-sm">10:00 AM prompt</span>
        </div>

        {/* Venue */}
        <div className="flex items-start justify-center gap-2 text-[#5a6a4a] mb-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-65" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3L4 8v13h5v-5h6v5h5V8L12 3z" />
            <line x1="12" y1="3" x2="12" y2="7" />
            <rect x="10.5" y="3" width="3" height="4" rx="0.5" />
          </svg>
          <span className="font-jost text-sm text-center">Living Faith Church (LFC) Sunnyvale</span>
        </div>

        {/* Countdown */}
        <Countdown />

        {/* Action buttons */}
        <div className="flex justify-center gap-7 mb-4">

          {/* Church */}
          <a href={CHURCH_MAP} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group">
            <div className="w-[56px] h-[56px] rounded-full bg-[#2c3a1e] flex items-center justify-center shadow group-active:scale-95 transition-transform">
              <svg className="w-6 h-6 text-white opacity-85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10.5L12 4l9 6.5V21H3V10.5z" />
                <path d="M9 21v-7h6v7" />
                <line x1="12" y1="4" x2="12" y2="1" />
                <line x1="10.5" y1="2.5" x2="13.5" y2="2.5" />
              </svg>
            </div>
            <span className="font-jost text-[11px] text-[#5a6a4a] tracking-wide">Church</span>
          </a>

          {/* Reception */}
          <a href={RECEPTION_MAP} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group">
            <div className="w-[56px] h-[56px] rounded-full bg-[#2c3a1e] flex items-center justify-center shadow group-active:scale-95 transition-transform">
              <svg className="w-6 h-6 text-white opacity-85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12L12 5l9 7v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9z" />
                <circle cx="9" cy="14" r="1.5" />
                <circle cx="15" cy="14" r="1.5" />
                <path d="M9 18v-2.5M15 18v-2.5" />
              </svg>
            </div>
            <span className="font-jost text-[11px] text-[#5a6a4a] tracking-wide">Reception</span>
          </a>

          {/* Gift */}
          <button onClick={() => setShowGift(true)} className="flex flex-col items-center gap-1.5 group">
            <div className="w-[56px] h-[56px] rounded-full bg-[#2c3a1e] flex items-center justify-center shadow group-active:scale-95 transition-transform">
              <svg className="w-6 h-6 text-white opacity-85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <rect x="4" y="12" width="16" height="9" rx="1" />
                <line x1="12" y1="8" x2="12" y2="21" />
                <path d="M12 8C12 8 9 5 7.5 5a2.5 2.5 0 010 5" />
                <path d="M12 8c0 0 3-3 4.5-3a2.5 2.5 0 010 5" />
              </svg>
            </div>
            <span className="font-jost text-[11px] text-[#5a6a4a] tracking-wide">Gift</span>
          </button>
        </div>

        {/* Aso-ebi */}
        <a
          href={ASOEBI_WA}
          target="_blank"
          rel="noopener noreferrer"
          className="block font-cormorant italic text-[#9b7355] text-sm mb-5 hover:text-[#7a5c35] transition-colors"
        >
          Aso-ebi available — contact us
        </a>

        {/* Reservation button */}
        <button
          onClick={() => setShowReservation(true)}
          className="w-full border border-[#2c3a1e] rounded-lg py-3.5 font-cormorant text-lg font-semibold tracking-[0.20em] uppercase text-[#2c3a1e] hover:bg-[#2c3a1e] hover:text-[#f5f0e8] active:bg-[#2c3a1e] active:text-[#f5f0e8] transition-colors duration-200"
        >
          Reservation
        </button>

        {/* Check link */}
        <a
          href="/check"
          className="block mt-3 font-jost text-[11px] text-[#9b9b8a] hover:text-[#5a6a4a] transition-colors"
        >
          Already submitted? Check your access card →
        </a>

      </div>

      {/* Bottom-left floral (mirrored) */}
      <FloralCorner
        className="absolute bottom-0 left-0 w-52 h-44 md:w-64 md:h-56 pointer-events-none select-none"
        style={{ transform: 'rotate(180deg)' }}
      />

      {/* Footer */}
      <div className="w-full text-center pb-5 relative z-10">
        <p className="font-cormorant italic text-[#9b7355] text-base">
          With love — Kam &amp; Olaitan · 8.8.2026
        </p>
      </div>

      {/* Modals */}
      {showGift && <GiftModal onClose={() => setShowGift(false)} />}
      {showReservation && <ReservationModal onClose={() => setShowReservation(false)} />}
    </main>
  )
}
