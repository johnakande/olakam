import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { getAuthUser } from '@/lib/auth-server'

function csvField(value: string | null): string {
  const s = value ?? ''
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data: guests, error } = await supabase
    .from('guests')
    .select('full_name, phone, code, reviewed_at, checked_in_at, checked_in_by, revoked, revoked_at, revoked_by')
    .eq('status', 'approved')
    .order('full_name', { ascending: true })

  if (error) return NextResponse.json({ error: 'Server error.' }, { status: 500 })

  const header = [
    'Full Name',
    'Phone',
    'Access Code',
    'Approved At',
    'Checked In At',
    'Checked In By',
    'Revoked',
    'Revoked At',
    'Revoked By',
  ]

  const rows = (guests ?? []).map((g) => [
    csvField(g.full_name),
    csvField(g.phone),
    csvField(g.code),
    csvField(g.reviewed_at),
    csvField(g.checked_in_at),
    csvField(g.checked_in_by),
    g.revoked ? 'Yes' : 'No',
    csvField(g.revoked_at),
    csvField(g.revoked_by),
  ])

  const csv = [header, ...rows].map((r) => r.join(',')).join('\r\n')
  const date = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="olakam-approved-guests-${date}.csv"`,
    },
  })
}
