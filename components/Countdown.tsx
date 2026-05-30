'use client'

import { useState, useEffect } from 'react'

// 10:00 AM WAT (UTC+1) on 8 August 2026 = 09:00:00 UTC
const TARGET = new Date('2026-08-08T09:00:00.000Z')

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    function tick() {
      const diff = TARGET.getTime() - Date.now()
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTime({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (!mounted) return <div className="h-20" />

  return (
    <div className="flex items-end justify-center gap-1 my-5">
      <Unit value={pad(time.days)} label="Days" />
      <Sep />
      <Unit value={pad(time.hours)} label="Hrs" />
      <Sep />
      <Unit value={pad(time.minutes)} label="Min" />
      <Sep />
      <Unit value={pad(time.seconds)} label="Sec" />
    </div>
  )
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center w-12">
      <span className="font-cormorant text-5xl font-semibold text-[#4a5e34] leading-none tabular-nums">
        {value}
      </span>
      <span className="font-jost text-[9px] tracking-[0.14em] uppercase text-[#9b9b8a] mt-1">
        {label}
      </span>
    </div>
  )
}

function Sep() {
  return (
    <span className="font-cormorant text-4xl text-[#c9aa7c] leading-none mb-5 mx-0.5">:</span>
  )
}
