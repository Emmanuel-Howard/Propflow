import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { applyFilterCriteria } from '@/lib/filter-utils'
import type { FilterCriteria } from '@/types/database'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/contact-lists/[id]/preview - Preview contacts matching list criteria
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createAdminClient()

    // Get the contact list
    const { data: list, error: listError } = await supabase
      .from('contact_lists')
      .select('*')
      .eq('id', id)
      .single()

    if (listError) {
      if (listError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Contact list not found' }, { status: 404 })
      }
      console.error('Error fetching contact list:', listError)
      return NextResponse.json({ error: 'Failed to fetch contact list' }, { status: 500 })
    }

    // Build query for matching contacts
    let query = supabase
      .from('contacts')
      .select('id, email, first_name, last_name, status, tags, source, created_at', { count: 'exact' })
      .eq('client_id', list.client_id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filter criteria
    const criteria = list.filter_criteria as unknown as FilterCriteria
    if (criteria && criteria.conditions && criteria.conditions.length > 0) {
      query = applyFilterCriteria(query, criteria)
    }

    const { data: contacts, error, count } = await query

    if (error) {
      console.error('Error fetching preview contacts:', error)
      return NextResponse.json({ error: 'Failed to fetch preview contacts' }, { status: 500 })
    }

    return NextResponse.json({
      contacts: contacts || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error in GET /api/contact-lists/[id]/preview:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
