import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { getAuthUser } from '@/lib/auth-server'
import type { CheckInResponse } from '@/types'

export async function POST(request: Request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await request.json()
  if (!code?.trim()) {
    return NextResponse.json({ error: 'Access code is required.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .rpc('check_in_guest', { p_code: code.trim().toUpperCase(), p_actor: user.email ?? user.id })
    .single<CheckInResponse>()

  if (error) return NextResponse.json({ error: 'Server error.' }, { status: 500 })

  return NextResponse.json(data)
}
