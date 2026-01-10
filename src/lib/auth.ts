import { auth, currentUser } from '@clerk/nextjs/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { User, Client, UserRole } from '@/types'

export interface CurrentUser extends User {
  client: Client | null
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = await createSupabaseServerClient()

  const { data: user, error } = await supabase
    .from('users')
    .select(`
      *,
      clients (*)
    `)
    .eq('clerk_id', userId)
    .single()

  if (error || !user) return null

  return {
    ...user,
    client: user.clients?.[0] || null,
  } as CurrentUser
}

export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(allowedRoles: UserRole[]): Promise<CurrentUser> {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden')
  }
  return user
}

export async function requireAdmin(): Promise<CurrentUser> {
  return requireRole(['admin'])
}

export async function requireClient(): Promise<CurrentUser> {
  return requireRole(['client', 'admin'])
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'admin'
}

export async function getClerkUser() {
  return currentUser()
}
