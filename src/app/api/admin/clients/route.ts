import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/admin/clients - List all clients (admin only)
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    // TODO: Check if user is admin
    // const { data: user } = await supabase
    //   .from('users')
    //   .select('role')
    //   .eq('clerk_id', userId)
    //   .single()
    // if (user?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    // Fetch all clients with related stats
    const { data: clients, error } = await supabase
      .from('clients')
      .select(`
        *,
        users (
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching clients:', error)
      return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
    }

    // Get contact counts and campaign stats for each client
    const clientsWithStats = await Promise.all(
      (clients || []).map(async (client) => {
        // Get contact count
        const { count: contactsCount } = await supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', client.id)

        // Get campaign count and last campaign
        const { data: campaigns, count: campaignsCount } = await supabase
          .from('campaigns')
          .select('*', { count: 'exact' })
          .eq('client_id', client.id)
          .eq('status', 'sent')
          .order('sent_at', { ascending: false })
          .limit(1)

        // Get average open rate from campaign analytics
        const { data: analytics } = await supabase
          .from('campaign_analytics')
          .select('open_rate')
          .in(
            'campaign_id',
            (
              await supabase
                .from('campaigns')
                .select('id')
                .eq('client_id', client.id)
            ).data?.map((c) => c.id) || []
          )

        const avgOpenRate =
          analytics && analytics.length > 0
            ? analytics.reduce((sum, a) => sum + (a.open_rate || 0), 0) / analytics.length
            : 0

        return {
          ...client,
          contacts_count: contactsCount || 0,
          campaigns_sent: campaignsCount || 0,
          last_campaign: campaigns?.[0]?.sent_at || null,
          avg_open_rate: Math.round(avgOpenRate * 10) / 10,
        }
      })
    )

    return NextResponse.json(clientsWithStats)
  } catch (error) {
    console.error('Error in GET /api/admin/clients:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/clients - Create a new client (admin only)
export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, company_name, company_address, website } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        name,
        email,
        phone,
        company_name,
        company_address,
        website,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating client:', error)
      return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      client_id: client.id,
      action: 'client_created',
      entity_type: 'client',
      entity_id: client.id,
      metadata: { name, email },
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/clients:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
