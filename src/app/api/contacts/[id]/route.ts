import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ContactUpdate } from '@/types/database'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/contacts/[id] - Get a single contact
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const supabase = createAdminClient()

    const { data: contact, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
      }
      console.error('Error fetching contact:', error)
      return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error in GET /api/contacts/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/contacts/[id] - Update a contact
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()
    const supabase = createAdminClient()

    // Get existing contact
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('client_id, email')
      .eq('id', id)
      .single()

    if (!existingContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    const updateData: ContactUpdate = {
      updated_at: new Date().toISOString(),
    }

    // Only include fields that were provided
    if (body.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
      }
      updateData.email = body.email.toLowerCase()
    }
    if (body.first_name !== undefined) updateData.first_name = body.first_name
    if (body.last_name !== undefined) updateData.last_name = body.last_name
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.status !== undefined) {
      updateData.status = body.status
      if (body.status === 'unsubscribed') {
        updateData.unsubscribed_at = new Date().toISOString()
      }
    }

    const { data: contact, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating contact:', error)
      return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
    }

    // Log activity
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    await supabase.from('activity_logs').insert({
      client_id: existingContact.client_id,
      user_id: user?.id,
      action: 'contact_updated',
      entity_type: 'contact',
      entity_id: id,
      metadata: { changes: Object.keys(updateData) },
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error in PATCH /api/contacts/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/contacts/[id] - Delete a contact
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const supabase = createAdminClient()

    // Get contact info before deletion
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('client_id, email')
      .eq('id', id)
      .single()

    if (!existingContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting contact:', error)
      return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
    }

    // Log activity
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    await supabase.from('activity_logs').insert({
      client_id: existingContact.client_id,
      user_id: user?.id,
      action: 'contact_deleted',
      entity_type: 'contact',
      entity_id: id,
      metadata: { email: existingContact.email },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/contacts/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
