import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/user - Get current user info including role
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        clients (*)
      `)
      .eq('clerk_id', userId)
      .single()

    if (error) {
      // User might not exist yet (webhook hasn't fired)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found', needsSync: true }, { status: 404 })
      }
      console.error('Error fetching user:', error)
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in GET /api/user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/user - Update current user's role (admin only, for promoting users)
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { targetUserId, role } = body

    const supabase = createAdminClient()

    // Check if current user is admin
    const { data: currentUser } = await supabase
      .from('users')
      .select('role')
      .eq('clerk_id', userId)
      .single()

    if (currentUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update target user's role
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', targetUserId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user role:', error)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error in PATCH /api/user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
