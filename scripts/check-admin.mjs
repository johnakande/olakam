import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

const { data, error } = await supabase.auth.admin.listUsers()

if (error) {
  console.log('Error:', error.message)
} else if (!data.users.length) {
  console.log('No admin users found — you need to run the migration SQL first.')
} else {
  console.log(`Found ${data.users.length} user(s):`)
  data.users.forEach(u => {
    console.log(`  • ${u.email}  (created ${new Date(u.created_at).toLocaleDateString()})`)
  })
}
