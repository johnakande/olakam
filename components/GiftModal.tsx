'use client'

import { useState } from 'react'

interface Props {
  onClose: () => void
}

export default function GiftModal({ onClose }: Props) {
  const [copied, setCopied] = useState<'naira' | 'dollar' | null>(null)

  function copy(text: string, which: 'naira' | 'dollar') {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(which)
      setTimeout(() => setCopied(null), 2000)
    })
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
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-cormorant text-2xl font-semibold text-[#2c3a1e]">Cash Gift</h2>
            <p className="font-jost text-xs text-[#9b7355] mt-0.5 italic font-cormorant">
              We only request cash gifts
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

        {/* Naira account */}
        <div className="bg-white border border-[#e8e0d2] rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-jost text-[10px] tracking-[0.12em] uppercase text-[#7a8c5e] font-medium">
              ₦ Naira · GTB
            </span>
            <button
              onClick={() => copy('0753426178', 'naira')}
              className="font-jost text-[10px] text-[#5e7048] hover:text-[#2c3a1e] transition-colors flex items-center gap-1"
            >
              {copied === 'naira' ? (
                <span className="text-[#5e7048]">Copied ✓</span>
              ) : (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <p className="font-mono text-2xl font-bold text-[#4a5e34] tracking-widest">0753426178</p>
          <p className="font-jost text-sm text-[#2c3a1e] mt-1 font-medium">Guaranty Trust Bank</p>
          <p className="font-jost text-xs text-[#7a8c5e] mt-0.5">Olaitan Ajao</p>
        </div>

        {/* Dollar account */}
        <div className="bg-white border border-[#e8e0d2] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-jost text-[10px] tracking-[0.12em] uppercase text-[#7a8c5e] font-medium">
              $ Dollar · GTB
            </span>
            <button
              onClick={() => copy('0750498060', 'dollar')}
              className="font-jost text-[10px] text-[#5e7048] hover:text-[#2c3a1e] transition-colors flex items-center gap-1"
            >
              {copied === 'dollar' ? (
                <span className="text-[#5e7048]">Copied ✓</span>
              ) : (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <p className="font-mono text-2xl font-bold text-[#4a5e34] tracking-widest">0750498060</p>
          <p className="font-jost text-sm text-[#2c3a1e] mt-1 font-medium">Guaranty Trust Bank</p>
          <p className="font-jost text-xs text-[#7a8c5e] mt-0.5">Olaitan Ajao</p>
          <p className="font-mono text-xs text-[#9b7355] mt-2 leading-relaxed">
            Swift: GTBINGLA · Sort: 058-199028
          </p>
        </div>
      </div>
    </div>
  )
}
