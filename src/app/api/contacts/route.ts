import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ContactInsert } from '@/types/database'

// GET /api/contacts - List contacts for a client
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('client_id')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    if (!clientId) {
      return NextResponse.json({ error: 'client_id is required' }, { status: 400 })
    }

    // Build query
    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Search by email or name
    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
    }

    const { data: contacts, error, count } = await query

    if (error) {
      console.error('Error fetching contacts:', error)
      return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
    }

    // Get stats for this client
    const { count: totalCount } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)

    const { count: activeCount } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .eq('status', 'active')

    const { count: unsubscribedCount } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .eq('status', 'unsubscribed')

    // Get new contacts this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: newThisMonth } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .gte('created_at', startOfMonth.toISOString())

    return NextResponse.json({
      contacts: contacts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      stats: {
        total: totalCount || 0,
        active: activeCount || 0,
        unsubscribed: unsubscribedCount || 0,
        newThisMonth: newThisMonth || 0,
      },
    })
  } catch (error) {
    console.error('Error in GET /api/contacts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/contacts - Create a single contact
export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { client_id, email, first_name, last_name, phone, tags, source } = body

    if (!client_id || !email) {
      return NextResponse.json(
        { error: 'client_id and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Check if contact already exists
    const { data: existing } = await supabase
      .from('contacts')
      .select('id')
      .eq('client_id', client_id)
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'A contact with this email already exists' },
        { status: 409 }
      )
    }

    const contactData: ContactInsert = {
      client_id,
      email: email.toLowerCase(),
      first_name: first_name || null,
      last_name: last_name || null,
      phone: phone || null,
      tags: tags || [],
      source: source || 'manual',
      status: 'active',
    }

    const { data: contact, error } = await supabase
      .from('contacts')
      .insert(contactData)
      .select()
      .single()

    if (error) {
      console.error('Error creating contact:', error)
      return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
    }

    // Log activity
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    await supabase.from('activity_logs').insert({
      client_id,
      user_id: user?.id,
      action: 'contact_created',
      entity_type: 'contact',
      entity_id: contact.id,
      metadata: { email },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/contacts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
