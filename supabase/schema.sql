-- Run this in your Supabase SQL editor to create the guests table.

create type guest_status as enum ('pending', 'approved', 'rejected');

create table guests (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  phone        text not null unique,
  code         text not null unique,
  status       guest_status not null default 'pending',
  created_at   timestamptz not null default now(),
  reviewed_at  timestamptz
);

-- Index for fast phone lookups (used by /api/check)
create index guests_phone_idx on guests (phone);

-- Index for status filtering (used by admin dashboard)
create index guests_status_idx on guests (status);

-- Disable row-level security — all access goes through service role key via API routes.
-- If you prefer RLS, enable it and add appropriate policies.
alter table guests disable row level security;
