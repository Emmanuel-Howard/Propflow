import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { CampaignUpdate } from '@/types/database'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/campaigns/[id] - Get a single campaign
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const supabase = createAdminClient()

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        campaign_analytics (
          total_recipients,
          total_sent,
          total_opened,
          total_clicked,
          open_rate,
          click_rate,
          bounce_rate
        ),
        templates (
          id,
          name
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
      }
      console.error('Error fetching campaign:', error)
      return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Error in GET /api/campaigns/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/campaigns/[id] - Update a campaign
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()
    const supabase = createAdminClient()

    // Get current campaign to check status
    const { data: existingCampaign } = await supabase
      .from('campaigns')
      .select('status, client_id')
      .eq('id', id)
      .single()

    if (!existingCampaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Prevent editing sent campaigns
    if (existingCampaign.status === 'sent' || existingCampaign.status === 'sending') {
      return NextResponse.json(
        { error: 'Cannot edit a campaign that has been sent or is sending' },
        { status: 400 }
      )
    }

    const updateData: CampaignUpdate = {
      updated_at: new Date().toISOString(),
    }

    // Only include fields that were provided
    if (body.subject !== undefined) updateData.subject = body.subject
    if (body.preview_text !== undefined) updateData.preview_text = body.preview_text
    if (body.content_html !== undefined) updateData.content_html = body.content_html
    if (body.template_id !== undefined) updateData.template_id = body.template_id
    if (body.scheduled_at !== undefined) updateData.scheduled_at = body.scheduled_at
    if (body.status !== undefined) updateData.status = body.status
    if (body.audience_type !== undefined) updateData.audience_type = body.audience_type
    if (body.audience_list_id !== undefined) updateData.audience_list_id = body.audience_list_id
    if (body.audience_contact_ids !== undefined) updateData.audience_contact_ids = body.audience_contact_ids

    // Handle approval
    if (body.status === 'approved' && existingCampaign.status !== 'approved') {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', userId)
        .single()

      updateData.approved_at = new Date().toISOString()
      updateData.approved_by = user?.id || null
    }

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating campaign:', error)
      return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
    }

    // Log activity
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    await supabase.from('activity_logs').insert({
      client_id: existingCampaign.client_id,
      user_id: user?.id,
      action: 'campaign_updated',
      entity_type: 'campaign',
      entity_id: id,
      metadata: { changes: Object.keys(updateData) },
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Error in PATCH /api/campaigns/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/campaigns/[id] - Delete a campaign
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const supabase = createAdminClient()

    // Get campaign info before deletion for logging
    const { data: existingCampaign } = await supabase
      .from('campaigns')
      .select('subject, client_id, status')
      .eq('id', id)
      .single()

    if (!existingCampaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Prevent deleting sent campaigns
    if (existingCampaign.status === 'sent' || existingCampaign.status === 'sending') {
      return NextResponse.json(
        { error: 'Cannot delete a campaign that has been sent or is sending' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting campaign:', error)
      return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 })
    }

    // Log activity
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    await supabase.from('activity_logs').insert({
      client_id: existingCampaign.client_id,
      user_id: user?.id,
      action: 'campaign_deleted',
      entity_type: 'campaign',
      entity_id: id,
      metadata: { subject: existingCampaign.subject },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/campaigns/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
