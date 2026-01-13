import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/contacts/search - Search contacts for contact picker
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('client_id')
    const q = searchParams.get('q') || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const excludeIds = searchParams.get('exclude')?.split(',').filter(Boolean) || []

    if (!clientId) {
      return NextResponse.json({ error: 'client_id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Build query for active contacts only
    let query = supabase
      .from('contacts')
      .select('id, email, first_name, last_name')
      .eq('client_id', clientId)
      .eq('status', 'active')
      .order('first_name', { ascending: true })
      .limit(limit)

    // Search by email or name if query provided
    if (q.trim()) {
      query = query.or(
        `email.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%`
      )
    }

    // Exclude already selected contacts
    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`)
    }

    const { data: contacts, error } = await query

    if (error) {
      console.error('Error searching contacts:', error)
      return NextResponse.json({ error: 'Failed to search contacts' }, { status: 500 })
    }

    // Format response with display name
    const formattedContacts = (contacts || []).map((contact) => ({
      id: contact.id,
      email: contact.email,
      first_name: contact.first_name,
      last_name: contact.last_name,
      display_name: contact.first_name && contact.last_name
        ? `${contact.first_name} ${contact.last_name}`
        : contact.first_name || contact.last_name || contact.email,
    }))

    return NextResponse.json(formattedContacts)
  } catch (error) {
    console.error('Error in GET /api/contacts/search:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
