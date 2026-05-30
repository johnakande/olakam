import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let suffix = ''
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)]
  }
  return `OLA-KAM-${suffix}`
}

export async function POST(request: Request) {
  try {
    const { full_name, phone } = await request.json()

    if (!full_name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Check phone uniqueness
    const { data: existing } = await supabase
      .from('guests')
      .select('id')
      .eq('phone', phone.trim())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'This number already has a request. Visit /check to see your status.' },
        { status: 409 }
      )
    }

    // Generate a unique code (retry on collision — extremely unlikely)
    let code = generateCode()
    let attempts = 0
    while (attempts < 5) {
      const { data: codeExists } = await supabase
        .from('guests')
        .select('id')
        .eq('code', code)
        .maybeSingle()
      if (!codeExists) break
      code = generateCode()
      attempts++
    }

    const { error } = await supabase.from('guests').insert({
      full_name: full_name.trim(),
      phone: phone.trim(),
      code,
      status: 'pending',
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('/api/reserve error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
