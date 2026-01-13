import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/admin/stats - Get admin dashboard stats
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Get total clients
    const { count: totalClients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get total campaigns sent
    const { count: totalCampaigns } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent')

    // Get average open rate across all campaigns
    const { data: analytics } = await supabase
      .from('campaign_analytics')
      .select('open_rate')

    const avgOpenRate =
      analytics && analytics.length > 0
        ? analytics.reduce((sum, a) => sum + (a.open_rate || 0), 0) / analytics.length
        : 0

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('activity_logs')
      .select(`
        *,
        clients (name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get upcoming campaigns
    const { data: upcomingCampaigns } = await supabase
      .from('campaigns')
      .select(`
        *,
        clients (name)
      `)
      .in('status', ['scheduled', 'pending_approval'])
      .order('scheduled_at', { ascending: true })
      .limit(5)

    // Calculate month-over-month changes (placeholder - would need historical data)
    const stats = {
      totalClients: totalClients || 0,
      totalCampaigns: totalCampaigns || 0,
      avgOpenRate: Math.round(avgOpenRate * 10) / 10,
      monthlyRevenue: 0, // Placeholder - integrate with Stripe
      changes: {
        clients: 12.5,
        campaigns: 8.2,
        openRate: 2.4,
        revenue: -3.1,
      },
      recentActivity: (recentActivity || []).map((activity) => ({
        id: activity.id,
        action: formatAction(activity.action),
        client: activity.clients?.name || 'Unknown',
        detail: (activity.metadata as Record<string, string> | null)?.detail || '',
        time: formatTimeAgo(activity.created_at),
      })),
      upcomingCampaigns: (upcomingCampaigns || []).map((campaign) => ({
        id: campaign.id,
        subject: campaign.subject,
        client: campaign.clients?.name || 'Unknown',
        scheduledAt: campaign.scheduled_at
          ? new Date(campaign.scheduled_at).toLocaleString()
          : 'Not scheduled',
        status: campaign.status,
      })),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error in GET /api/admin/stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function formatAction(action: string): string {
  const actionMap: Record<string, string> = {
    client_created: 'New client added',
    campaign_sent: 'Campaign sent',
    campaign_approved: 'Campaign approved',
    contacts_imported: 'Contacts imported',
    campaign_created: 'Campaign created',
  }
  return actionMap[action] || action
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
  return date.toLocaleDateString()
}
