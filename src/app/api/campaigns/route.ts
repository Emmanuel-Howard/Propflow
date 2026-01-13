import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { CampaignInsert, CampaignStatus } from '@/types/database'

// GET /api/campaigns - List campaigns for a client
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

    // Build query
    let query = supabase
      .from('campaigns')
      .select(`
        *,
        campaign_analytics (
          total_recipients,
          total_sent,
          total_opened,
          total_clicked,
          open_rate,
          click_rate
        )
      `)
      .order('created_at', { ascending: false })

    // Filter by client if provided
    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('status', status as CampaignStatus)
    }

    const { data: campaigns, error } = await query

    if (error) {
      console.error('Error fetching campaigns:', error)
      return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
    }

    // Format the response
    const formattedCampaigns = (campaigns || []).map((campaign) => ({
      ...campaign,
      recipients: campaign.campaign_analytics?.total_recipients || 0,
      openRate: campaign.campaign_analytics?.open_rate || 0,
      clickRate: campaign.campaign_analytics?.click_rate || 0,
    }))

    return NextResponse.json(formattedCampaigns)
  } catch (error) {
    console.error('Error in GET /api/campaigns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/campaigns - Create a new campaign
export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { client_id, subject, preview_text, content_html, template_id, scheduled_at, status } = body

    if (!client_id || !subject || !content_html) {
      return NextResponse.json(
        { error: 'client_id, subject, and content_html are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Get the user's internal ID
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    const campaignData: CampaignInsert = {
      client_id,
      subject,
      preview_text: preview_text || null,
      content_html,
      template_id: template_id || null,
      scheduled_at: scheduled_at || null,
      status: status || 'draft',
      created_by: user?.id || null,
    }

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert(campaignData)
      .select()
      .single()

    if (error) {
      console.error('Error creating campaign:', error)
      return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      client_id,
      user_id: user?.id,
      action: 'campaign_created',
      entity_type: 'campaign',
      entity_id: campaign.id,
      metadata: { subject, status: campaignData.status },
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/campaigns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
