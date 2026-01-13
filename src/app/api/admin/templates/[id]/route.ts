import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { TemplateUpdate } from '@/types/database'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/admin/templates/[id] - Get a single template
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const supabase = createAdminClient()

    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
      }
      console.error('Error fetching template:', error)
      return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 })
    }

    // Get usage count
    const { count } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('template_id', id)

    return NextResponse.json({
      ...template,
      usage_count: count || 0,
    })
  } catch (error) {
    console.error('Error in GET /api/admin/templates/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/admin/templates/[id] - Update a template
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()
    const supabase = createAdminClient()

    // Verify template exists
    const { data: existing } = await supabase
      .from('templates')
      .select('id')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    const updateData: TemplateUpdate = {
      updated_at: new Date().toISOString(),
    }

    // Only include fields that were provided
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.content_html !== undefined) updateData.content_html = body.content_html
    if (body.category !== undefined) updateData.category = body.category
    if (body.is_active !== undefined) updateData.is_active = body.is_active
    if (body.preview_image_url !== undefined) updateData.preview_image_url = body.preview_image_url

    const { data: template, error } = await supabase
      .from('templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating template:', error)
      return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
    }

    // Log activity
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    await supabase.from('activity_logs').insert({
      user_id: user?.id,
      action: 'template_updated',
      entity_type: 'template',
      entity_id: id,
      metadata: { changes: Object.keys(updateData) },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error in PATCH /api/admin/templates/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/templates/[id] - Soft delete a template
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const supabase = createAdminClient()

    // Get template info
    const { data: template } = await supabase
      .from('templates')
      .select('id, name')
      .eq('id', id)
      .single()

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Check if template is in use by any campaigns
    const { count: usageCount } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('template_id', id)

    // Soft delete by setting is_active = false
    const { error } = await supabase
      .from('templates')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error deleting template:', error)
      return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
    }

    // Log activity
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    await supabase.from('activity_logs').insert({
      user_id: user?.id,
      action: 'template_deleted',
      entity_type: 'template',
      entity_id: id,
      metadata: { name: template.name, was_in_use: (usageCount || 0) > 0 },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/templates/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
