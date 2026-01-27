import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { validateFilterCriteria, applyFilterCriteria } from '@/lib/filter-utils'
import type { ContactListUpdate, FilterCriteria } from '@/types/database'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/contact-lists/[id] - Get a single contact list
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const supabase = createAdminClient()

    const { data: list, error } = await supabase
      .from('contact_lists')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Contact list not found' }, { status: 404 })
      }
      console.error('Error fetching contact list:', error)
      return NextResponse.json({ error: 'Failed to fetch contact list' }, { status: 500 })
    }

    // Calculate current contact count
    const criteria = list.filter_criteria as unknown as FilterCriteria
    let countQuery = supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', list.client_id)
      .eq('status', 'active')

    if (criteria && criteria.conditions && criteria.conditions.length > 0) {
      countQuery = applyFilterCriteria(countQuery, criteria)
    }

    const { count } = await countQuery

    return NextResponse.json({
      ...list,
      contact_count: count || 0,
    })
  } catch (error) {
    console.error('Error in GET /api/contact-lists/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/contact-lists/[id] - Update a contact list
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()
    const supabase = createAdminClient()

    // Get existing list
    const { data: existingList } = await supabase
      .from('contact_lists')
      .select('client_id, name')
      .eq('id', id)
      .single()

    if (!existingList) {
      return NextResponse.json({ error: 'Contact list not found' }, { status: 404 })
    }

    const updateData: ContactListUpdate = {
      updated_at: new Date().toISOString(),
    }

    // Only include fields that were provided
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description

    if (body.filter_criteria !== undefined) {
      if (!validateFilterCriteria(body.filter_criteria)) {
        return NextResponse.json(
          { error: 'Invalid filter criteria format' },
          { status: 400 }
        )
      }
      updateData.filter_criteria = body.filter_criteria

      // Recalculate contact count when filter changes
      const criteria = body.filter_criteria as FilterCriteria
      let countQuery = supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', existingList.client_id)
        .eq('status', 'active')

      if (criteria && criteria.conditions && criteria.conditions.length > 0) {
        countQuery = applyFilterCriteria(countQuery, criteria)
      }

      const { count } = await countQuery
      updateData.contact_count = count || 0
    }

    const { data: list, error } = await supabase
      .from('contact_lists')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating contact list:', error)
      return NextResponse.json({ error: 'Failed to update contact list' }, { status: 500 })
    }

    // Log activity
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    await supabase.from('activity_logs').insert({
      client_id: existingList.client_id,
      user_id: user?.id,
      action: 'contact_list_updated',
      entity_type: 'contact_list',
      entity_id: id,
      metadata: { changes: Object.keys(updateData) },
    })

    return NextResponse.json(list)
  } catch (error) {
    console.error('Error in PATCH /api/contact-lists/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/contact-lists/[id] - Delete a contact list
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const supabase = createAdminClient()

    // Get list info before deletion
    const { data: existingList } = await supabase
      .from('contact_lists')
      .select('client_id, name')
      .eq('id', id)
      .single()

    if (!existingList) {
      return NextResponse.json({ error: 'Contact list not found' }, { status: 404 })
    }

    // Check if the list is being used by any campaigns
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id')
      .eq('audience_list_id', id)
      .limit(1)

    if (campaigns && campaigns.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete list that is used by campaigns' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('contact_lists')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting contact list:', error)
      return NextResponse.json({ error: 'Failed to delete contact list' }, { status: 500 })
    }

    // Log activity
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    await supabase.from('activity_logs').insert({
      client_id: existingList.client_id,
      user_id: user?.id,
      action: 'contact_list_deleted',
      entity_type: 'contact_list',
      entity_id: id,
      metadata: { name: existingList.name },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/contact-lists/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
