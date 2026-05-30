import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServiceClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

async function getAuthUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function POST(request: Request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, action } = await request.json()

  if (!id || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('guests')
    .update({
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Server error.' }, { status: 500 })

  return NextResponse.json({ success: true })
}
