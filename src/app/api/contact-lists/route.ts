import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { validateFilterCriteria, applyFilterCriteria } from '@/lib/filter-utils'
import type { ContactListInsert, FilterCriteria } from '@/types/database'

// GET /api/contact-lists - List all contact lists for a client
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('client_id')
    const search = searchParams.get('search')

    if (!clientId) {
      return NextResponse.json({ error: 'client_id is required' }, { status: 400 })
    }

    // Build query
    let query = supabase
      .from('contact_lists')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    // Search by name or description
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: lists, error } = await query

    if (error) {
      console.error('Error fetching contact lists:', error)
      return NextResponse.json({ error: 'Failed to fetch contact lists' }, { status: 500 })
    }

    // For each list, compute the current contact count based on filter criteria
    const listsWithCounts = await Promise.all(
      (lists || []).map(async (list) => {
        const criteria = list.filter_criteria as unknown as FilterCriteria
        let countQuery = supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', clientId)
          .eq('status', 'active')

        if (criteria && criteria.conditions && criteria.conditions.length > 0) {
          countQuery = applyFilterCriteria(countQuery, criteria)
        }

        const { count } = await countQuery
        return {
          ...list,
          contact_count: count || 0,
        }
      })
    )

    return NextResponse.json({ lists: listsWithCounts })
  } catch (error) {
    console.error('Error in GET /api/contact-lists:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/contact-lists - Create a new contact list
export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { client_id, name, description, filter_criteria } = body

    if (!client_id || !name) {
      return NextResponse.json(
        { error: 'client_id and name are required' },
        { status: 400 }
      )
    }

    // Validate filter criteria if provided
    if (filter_criteria && !validateFilterCriteria(filter_criteria)) {
      return NextResponse.json(
        { error: 'Invalid filter criteria format' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Get user ID from clerk_id
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    // Calculate initial contact count
    const criteria = filter_criteria as FilterCriteria
    let countQuery = supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', client_id)
      .eq('status', 'active')

    if (criteria && criteria.conditions && criteria.conditions.length > 0) {
      countQuery = applyFilterCriteria(countQuery, criteria)
    }

    const { count: contactCount } = await countQuery

    const listData: ContactListInsert = {
      client_id,
      name,
      description: description || null,
      filter_criteria: filter_criteria || { operator: 'AND', conditions: [] },
      contact_count: contactCount || 0,
      created_by: user?.id || null,
    }

    const { data: list, error } = await supabase
      .from('contact_lists')
      .insert(listData)
      .select()
      .single()

    if (error) {
      console.error('Error creating contact list:', error)
      return NextResponse.json({ error: 'Failed to create contact list' }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      client_id,
      user_id: user?.id,
      action: 'contact_list_created',
      entity_type: 'contact_list',
      entity_id: list.id,
      metadata: { name },
    })

    return NextResponse.json(list, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/contact-lists:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
