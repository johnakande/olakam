export type GuestStatus = 'pending' | 'approved' | 'rejected'

export interface Guest {
  id: string
  full_name: string
  phone: string
  code: string
  status: GuestStatus
  created_at: string
  reviewed_at: string | null
}
