export type GuestStatus = 'pending' | 'approved' | 'rejected'

export interface Guest {
  id: string
  full_name: string
  phone: string
  code: string
  status: GuestStatus
  created_at: string
  reviewed_at: string | null
  checked_in_at: string | null
  checked_in_by: string | null
  revoked: boolean
  revoked_at: string | null
  revoked_by: string | null
}

export type CheckInResult =
  | 'checked_in'
  | 'already_checked_in'
  | 'revoked'
  | 'not_approved'
  | 'not_found'

export interface CheckInResponse {
  result: CheckInResult
  guest_id: string | null
  full_name: string | null
  checked_in_at: string | null
  checked_in_by: string | null
}
