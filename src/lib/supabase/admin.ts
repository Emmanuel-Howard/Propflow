import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Admin client with service role - bypasses RLS
// Use only for server-side operations that need elevated permissions
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
