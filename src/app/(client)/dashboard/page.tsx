'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { useClient } from '@/contexts/client-context'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  MousePointer,
  Eye,
  ArrowRight,
  Calendar,
  Loader2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface DashboardData {
  client: {
    id: string
    name: string
    email: string
  }
  metrics: {
    openRate: number
    clickRate: number
    totalContacts: number
    campaignsSent: number
    changes: {
      openRate: number
      clickRate: number
      contacts: number
      campaigns: number
    }
  }
  recentCampaign: {
    id: string
    subject: string
    sentAt: string
    recipients: number
    openRate: number
    clickRate: number
  } | null
  nextCampaign: {
    id: string
    subject: string
    scheduledAt: string
    status: string
  } | null
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const { selectedClient, isViewingAsClient, setSelectedClient } = useClient()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clientId = searchParams.get('client_id') || selectedClient?.id

  useEffect(() => {
    if (clientId) {
      fetchDashboardData(clientId)
    } else {
      setLoading(false)
      setError('No client selected')
    }
  }, [clientId])

  async function fetchDashboardData(id: string) {
    try {
      setLoading(true)
      const response = await fetch(`/api/clients/${id}/dashboard`)
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      const dashboardData = await response.json()
      setData(dashboardData)
      setError(null)
    } catch (err) {
      console.error('Error fetching dashboard:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Dashboard" />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-black/30" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Dashboard" />
        <div className="px-6 py-6">
          <div className="border border-[#E0E0E0] rounded p-12 text-center">
            <Users className="h-12 w-12 text-black/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black">No client selected</h3>
            <p className="text-sm text-black/50 mt-1 mb-4">
              Select a client from the dropdown to view their dashboard
            </p>
            <Button asChild className="bg-[#083E33] hover:bg-[#062d25] text-white">
              <Link href="/clients">View Clients</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const metrics = [
    {
      title: 'Open Rate',
      value: `${data.metrics.openRate}%`,
      change: data.metrics.changes.openRate,
      icon: Eye,
    },
    {
      title: 'Click Rate',
      value: `${data.metrics.clickRate}%`,
      change: data.metrics.changes.clickRate,
      icon: MousePointer,
    },
    {
      title: 'Total Contacts',
      value: data.metrics.totalContacts.toLocaleString(),
      change: data.metrics.changes.contacts,
      icon: Users,
    },
    {
      title: 'Campaigns Sent',
      value: data.metrics.campaignsSent.toString(),
      change: data.metrics.changes.campaigns,
      icon: Mail,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Viewing as client banner */}
      {isViewingAsClient && (
        <div className="bg-[#083E33] text-white px-6 py-2 flex items-center justify-between">
          <p className="text-sm">
            Viewing as <span className="font-medium">{data.client.name}</span>
          </p>
          <button
            onClick={() => setSelectedClient(null)}
            className="flex items-center gap-1 text-sm text-white/80 hover:text-white transition-smooth"
          >
            <X className="h-4 w-4" />
            Exit
          </button>
        </div>
      )}

      <Header title="Dashboard" />

      <div className="px-6 py-6 space-y-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon
            const isPositive = metric.change >= 0
            return (
              <div
                key={metric.title}
                className="p-5 border border-[#E0E0E0] rounded hover:border-black/20 transition-smooth"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-black/50 uppercase tracking-wider font-medium">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-semibold text-black mt-1 tabular-nums">
                      {metric.value}
                    </p>
                  </div>
                  <div className="p-2 bg-[#FAFAFA] rounded">
                    <Icon className="h-5 w-5 text-black/40" />
                  </div>
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium mt-3',
                    isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {metric.change}% from last month
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Campaign Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Campaign */}
          <div className="border border-[#E0E0E0] rounded p-6">
            <h3 className="text-lg font-semibold text-black mb-4">
              Recent Campaign
            </h3>
            {data.recentCampaign ? (
              <div>
                <p className="font-medium text-black">
                  {data.recentCampaign.subject}
                </p>
                <p className="text-sm text-black/50 mt-1">
                  Sent{' '}
                  {new Date(data.recentCampaign.sentAt).toLocaleDateString(
                    'en-US',
                    { month: 'short', day: 'numeric', year: 'numeric' }
                  )}
                </p>
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#E0E0E0]">
                  <div>
                    <p className="text-xs text-black/50 uppercase">Recipients</p>
                    <p className="text-lg font-semibold text-black tabular-nums">
                      {data.recentCampaign.recipients.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 uppercase">Open Rate</p>
                    <p className="text-lg font-semibold text-black tabular-nums">
                      {data.recentCampaign.openRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 uppercase">Click Rate</p>
                    <p className="text-lg font-semibold text-[#D4AF37] tabular-nums">
                      {data.recentCampaign.clickRate}%
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="mt-4 text-black/60 hover:text-black hover:bg-black/5 p-0"
                >
                  <Link href={`/campaigns/${data.recentCampaign.id}`}>
                    View details <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-black/40">
                <Mail className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No campaigns sent yet</p>
              </div>
            )}
          </div>

          {/* Next Campaign */}
          <div className="border border-[#E0E0E0] rounded p-6">
            <h3 className="text-lg font-semibold text-black mb-4">
              Next Campaign
            </h3>
            {data.nextCampaign ? (
              <div>
                <p className="font-medium text-black">
                  {data.nextCampaign.subject}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4 text-black/40" />
                  <p className="text-sm text-black/50">
                    {data.nextCampaign.scheduledAt
                      ? new Date(data.nextCampaign.scheduledAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          }
                        )
                      : 'Not scheduled'}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#E0E0E0]">
                  <span
                    className={cn(
                      'text-xs font-medium px-2 py-1 rounded',
                      data.nextCampaign.status === 'scheduled'
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-amber-600 bg-amber-50'
                    )}
                  >
                    {data.nextCampaign.status === 'scheduled'
                      ? 'Scheduled'
                      : 'Pending Approval'}
                  </span>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="mt-4 text-black/60 hover:text-black hover:bg-black/5 p-0"
                >
                  <Link href={`/campaigns/${data.nextCampaign.id}`}>
                    View details <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-black/40">
                <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No upcoming campaigns</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border border-[#E0E0E0] rounded p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth"
            >
              <Link href={`/campaigns?client_id=${clientId}`}>View Campaigns</Link>
            </Button>
            <Button
              asChild
              className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth"
            >
              <Link href={`/contacts?client_id=${clientId}`}>Manage Contacts</Link>
            </Button>
            <Button
              asChild
              className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth"
            >
              <Link href={`/analytics?client_id=${clientId}`}>View Analytics</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
