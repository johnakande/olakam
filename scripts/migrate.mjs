/**
 * OlaKam Wedding — Database Migration
 * Run: node scripts/migrate.mjs
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

dotenv.config({ path: path.join(ROOT, '.env.local') })

const SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ACCESS_TOKEN     = process.env.SUPABASE_ACCESS_TOKEN
const DATABASE_URL     = process.env.DATABASE_URL

const PROJECT_REF = SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
const MIGRATION_SQL = readFileSync(path.join(ROOT, 'supabase', 'schema.sql'), 'utf8')

function hr()   { console.log('─'.repeat(56)) }
function ok(m)  { console.log(`  ✓  ${m}`) }
function fail(m){ console.log(`  ✗  ${m}`) }
function info(m){ console.log(`  ·  ${m}`) }

// PostgREST error codes that mean "table doesn't exist" (connection IS alive)
function isTableMissing(error) {
  if (!error) return false
  return (
    error.code === '42P01' ||
    error.code === 'PGRST116' ||
    error.message?.includes('does not exist') ||
    error.message?.includes('schema cache') ||
    error.message?.includes('relation')
  )
}

// Any PostgREST error (even table-not-found) proves the connection is alive
function isConnectionAlive(error) {
  if (!error) return true        // no error = definitely alive
  if (isTableMissing(error)) return true   // PGRST response = alive
  // HTTP/network errors have no code or have fetch-level codes
  const networkCodes = ['ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT']
  return !networkCodes.some(c => error.message?.includes(c))
}

// ─── step 1: verify connection ───────────────────────────────────────────────

async function checkConnection() {
  hr()
  console.log('  STEP 1 — Test Supabase connection')
  hr()

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    fail('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env.local')
    return null
  }

  info(`URL : ${SUPABASE_URL}`)
  info(`Ref : ${PROJECT_REF}`)

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  const { error } = await supabase.from('guests').select('id').limit(1)

  if (!isConnectionAlive(error)) {
    fail(`Cannot reach Supabase: ${error?.message}`)
    return null
  }

  ok('Supabase connection OK')
  return supabase
}

// ─── step 2: check table state ───────────────────────────────────────────────

async function checkTable(supabase) {
  hr()
  console.log('  STEP 2 — Check "guests" table')
  hr()

  const { data, error } = await supabase.from('guests').select('id').limit(1)

  if (!error) {
    const { count } = await supabase
      .from('guests')
      .select('*', { count: 'exact', head: true })
    ok('"guests" table exists and is ready')
    info(`Current rows: ${count ?? 0}`)
    return true
  }

  if (isTableMissing(error)) {
    info('"guests" table does not exist — migration needed')
    return false
  }

  fail(`Unexpected error: ${error.message}`)
  return false
}

// ─── step 3a: Management API ─────────────────────────────────────────────────

async function tryManagementAPI() {
  info('Trying Supabase Management API…')
  const tokens = [ACCESS_TOKEN, SERVICE_ROLE_KEY].filter(Boolean)

  for (const token of tokens) {
    const label = token === ACCESS_TOKEN ? 'SUPABASE_ACCESS_TOKEN' : 'service role key'
    info(`  Using ${label}`)

    const res = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: MIGRATION_SQL }),
      }
    )

    if (res.ok) {
      ok(`Applied via Management API (${label})`)
      return true
    }

    const body = await res.text().catch(() => '')
    info(`  → HTTP ${res.status}: ${body.slice(0, 100)}`)
  }

  return false
}

// ─── step 3b: direct pg connection ───────────────────────────────────────────

async function tryPgDirect() {
  if (!DATABASE_URL) {
    info('DATABASE_URL not set — skipping direct pg')
    return false
  }

  info('Trying direct PostgreSQL (DATABASE_URL)…')

  let pg
  try { pg = await import('pg') } catch {
    info('`pg` not installed — run: npm install pg')
    return false
  }

  const { default: { Client } } = pg
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })

  try {
    await client.connect()
    ok('PostgreSQL connected')
    await client.query(MIGRATION_SQL)
    ok('Applied via direct pg connection')
    await client.end()
    return true
  } catch (e) {
    fail(`pg error: ${e.message}`)
    try { await client.end() } catch { /* ignore */ }
    return false
  }
}

// ─── step 3c: exec_sql RPC ───────────────────────────────────────────────────

async function tryExecRpc(supabase) {
  info('Trying supabase.rpc("exec_sql")…')
  const { error } = await supabase.rpc('exec_sql', { sql: MIGRATION_SQL })
  if (!error) { ok('Applied via exec_sql RPC'); return true }
  info(`exec_sql not available: ${error.message}`)
  return false
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  let exitCode = 0

  console.log('\n  ● OlaKam Wedding — Database Migration\n')

  const supabase = await checkConnection()
  if (!supabase) { process.exitCode = 1; return }

  const exists = await checkTable(supabase)

  if (exists) {
    hr()
    ok('Database is ready — nothing to migrate.')
    hr()
    console.log()
    return
  }

  hr()
  console.log('  STEP 3 — Run migration')
  hr()

  const applied =
    (await tryManagementAPI()) ||
    (await tryPgDirect())      ||
    (await tryExecRpc(supabase))

  if (applied) {
    // Confirm table is live
    await new Promise(r => setTimeout(r, 1000))  // brief pause for schema cache refresh
    const { error } = await supabase.from('guests').select('id').limit(1)
    hr()
    if (!error) ok('Verified: "guests" table is live')
    ok('Migration complete.')
    hr()
    console.log()
    return
  }

  hr()
  fail('Automatic migration blocked — no privileged connection available.')
  console.log(`
  ┌─ Option A: Paste SQL into the Supabase dashboard ─────────────────────┐
  │  Dashboard → SQL Editor → New Query → paste → Run                     │
  └───────────────────────────────────────────────────────────────────────┘

${MIGRATION_SQL.trim()}

  ┌─ Option B: Add to .env.local and re-run ──────────────────────────────┐
  │  DATABASE_URL=postgresql://postgres.[ref]:[password]@...              │
  │    → Dashboard → Settings → Database → Connection string (URI mode)   │
  │                                                                        │
  │  SUPABASE_ACCESS_TOKEN=sbp_xxxx                                       │
  │    → supabase.com → Account → Access Tokens → Generate new token      │
  └───────────────────────────────────────────────────────────────────────┘
`)
  hr()
  exitCode = 1

  process.exitCode = exitCode
}

main().catch((e) => {
  console.error('Fatal:', e.message)
  process.exitCode = 1
})
