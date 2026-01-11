import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/clients/[id]/dashboard - Get client dashboard data
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: clientId } = await params
    const supabase = createAdminClient()

    // Get client info
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Get contact count
    const { count: contactsCount } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .eq('status', 'active')

    // Get campaigns stats
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    const sentCampaigns = campaigns?.filter(c => c.status === 'sent') || []
    const scheduledCampaigns = campaigns?.filter(c => c.status === 'scheduled') || []
    const pendingCampaigns = campaigns?.filter(c => c.status === 'pending_approval') || []

    // Get campaign analytics
    const campaignIds = sentCampaigns.map(c => c.id)
    const { data: analytics } = await supabase
      .from('campaign_analytics')
      .select('*')
      .in('campaign_id', campaignIds.length > 0 ? campaignIds : ['none'])

    // Calculate averages
    const avgOpenRate = analytics && analytics.length > 0
      ? analytics.reduce((sum, a) => sum + (a.open_rate || 0), 0) / analytics.length
      : 0
    const avgClickRate = analytics && analytics.length > 0
      ? analytics.reduce((sum, a) => sum + (a.click_rate || 0), 0) / analytics.length
      : 0

    // Get recent campaign
    const recentCampaign = sentCampaigns[0] || null
    const recentAnalytics = recentCampaign
      ? analytics?.find(a => a.campaign_id === recentCampaign.id)
      : null

    // Get next scheduled campaign
    const nextCampaign = scheduledCampaigns[0] || pendingCampaigns[0] || null

    const dashboardData = {
      client,
      metrics: {
        openRate: Math.round(avgOpenRate * 10) / 10,
        clickRate: Math.round(avgClickRate * 10) / 10,
        totalContacts: contactsCount || 0,
        campaignsSent: sentCampaigns.length,
        // Placeholder changes - would calculate from monthly_analytics
        changes: {
          openRate: 2.4,
          clickRate: -0.5,
          contacts: 12,
          campaigns: 1,
        },
      },
      recentCampaign: recentCampaign
        ? {
            id: recentCampaign.id,
            subject: recentCampaign.subject,
            sentAt: recentCampaign.sent_at,
            recipients: recentAnalytics?.total_recipients || 0,
            openRate: recentAnalytics?.open_rate || 0,
            clickRate: recentAnalytics?.click_rate || 0,
          }
        : null,
      nextCampaign: nextCampaign
        ? {
            id: nextCampaign.id,
            subject: nextCampaign.subject,
            scheduledAt: nextCampaign.scheduled_at,
            status: nextCampaign.status,
          }
        : null,
      // Monthly performance data for chart
      monthlyPerformance: [], // TODO: Pull from monthly_analytics
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching client dashboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
