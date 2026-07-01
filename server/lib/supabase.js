/**
 * Backend Supabase client using the service-role key.
 * Bypasses RLS — use only in server code, never expose this key.
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.warn('Supabase admin client not initialized — missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseAdmin = url && serviceKey
  ? createClient(url, serviceKey, { auth: { persistSession: false } })
  : null
