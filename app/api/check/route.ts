import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const { phone } = await request.json()

    if (!phone?.trim()) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: guest, error } = await supabase
      .from('guests')
      .select('full_name, status, code')
      .eq('phone', phone.trim())
      .maybeSingle()

    if (error) throw error

    if (!guest) {
      return NextResponse.json({ status: 'not_found' })
    }

    if (guest.status === 'approved') {
      return NextResponse.json({ status: 'approved', full_name: guest.full_name, code: guest.code })
    }

    return NextResponse.json({ status: guest.status, full_name: guest.full_name })
  } catch (err) {
    console.error('/api/check error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
