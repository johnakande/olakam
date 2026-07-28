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

-- ============================================================================
-- Migration: one-time entry enforcement + revoke access
-- Safe to re-run — every statement is idempotent (IF NOT EXISTS / OR REPLACE).
-- ============================================================================

-- Venue check-in tracking, independent of the pre-event approval status above.
alter table guests
  add column if not exists checked_in_at timestamptz,
  add column if not exists checked_in_by text,
  add column if not exists revoked       boolean not null default false,
  add column if not exists revoked_at    timestamptz,
  add column if not exists revoked_by    text;

-- Ushers look guests up by their access code, not phone.
create index if not exists guests_code_idx on guests (code);

-- Audit trail for check-in attempts and revoke/un-revoke actions.
create table if not exists guest_status_log (
  id         uuid primary key default gen_random_uuid(),
  guest_id   uuid not null references guests(id) on delete cascade,
  action     text not null, -- 'checked_in' | 'check_in_denied_already' | 'check_in_denied_revoked' | 'check_in_denied_not_approved' | 'revoked' | 'unrevoked'
  actor      text,          -- usher/admin email
  created_at timestamptz not null default now()
);

create index if not exists guest_status_log_guest_id_idx on guest_status_log (guest_id);

alter table guest_status_log disable row level security;

-- Atomic, race-safe check-in. `select ... for update` locks the guest row so
-- two ushers scanning the same code at the same instant serialize: whichever
-- transaction commits first wins, and the second always sees the updated row
-- and returns 'already_checked_in' instead of double-approving entry.
create or replace function check_in_guest(p_code text, p_actor text)
returns table (
  result        text,
  guest_id      uuid,
  full_name     text,
  checked_in_at timestamptz,
  checked_in_by text
) language plpgsql as $$
declare
  g guests%rowtype;
begin
  select * into g from guests where code = p_code for update;

  if not found then
    return query select 'not_found'::text, null::uuid, null::text, null::timestamptz, null::text;
    return;
  end if;

  if g.revoked then
    insert into guest_status_log (guest_id, action, actor) values (g.id, 'check_in_denied_revoked', p_actor);
    return query select 'revoked'::text, g.id, g.full_name, g.checked_in_at, g.checked_in_by;
    return;
  end if;

  if g.status <> 'approved' then
    insert into guest_status_log (guest_id, action, actor) values (g.id, 'check_in_denied_not_approved', p_actor);
    return query select 'not_approved'::text, g.id, g.full_name, g.checked_in_at, g.checked_in_by;
    return;
  end if;

  if g.checked_in_at is not null then
    insert into guest_status_log (guest_id, action, actor) values (g.id, 'check_in_denied_already', p_actor);
    return query select 'already_checked_in'::text, g.id, g.full_name, g.checked_in_at, g.checked_in_by;
    return;
  end if;

  update guests
    set checked_in_at = now(), checked_in_by = p_actor
    where id = g.id
    returning * into g;

  insert into guest_status_log (guest_id, action, actor) values (g.id, 'checked_in', p_actor);

  return query select 'checked_in'::text, g.id, g.full_name, g.checked_in_at, g.checked_in_by;
end;
$$;

-- Atomic revoke / un-revoke, with audit log entry.
create or replace function set_guest_revoked(p_guest_id uuid, p_revoked boolean, p_actor text)
returns guests language plpgsql as $$
declare
  g guests%rowtype;
begin
  update guests
    set revoked    = p_revoked,
        revoked_at = case when p_revoked then now() else null end,
        revoked_by = case when p_revoked then p_actor else null end
    where id = p_guest_id
    returning * into g;

  if not found then
    raise exception 'Guest not found';
  end if;

  insert into guest_status_log (guest_id, action, actor)
    values (p_guest_id, case when p_revoked then 'revoked' else 'unrevoked' end, p_actor);

  return g;
end;
$$;
