import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { getAuthUser } from '@/lib/auth-server'
import type { Guest } from '@/types'

export async function POST(request: Request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, revoked } = await request.json()
  if (!id || typeof revoked !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .rpc('set_guest_revoked', { p_guest_id: id, p_revoked: revoked, p_actor: user.email ?? user.id })
    .single<Guest>()

  if (error) return NextResponse.json({ error: 'Server error.' }, { status: 500 })

  return NextResponse.json({ guest: data })
}
