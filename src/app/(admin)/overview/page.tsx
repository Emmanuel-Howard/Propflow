'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import {
  Users,
  Mail,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  FileText,
  Clock,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Stats {
  totalClients: number
  totalCampaigns: number
  avgOpenRate: number
  monthlyRevenue: number
  changes: {
    clients: number
    campaigns: number
    openRate: number
    revenue: number
  }
  recentActivity: {
    id: string
    action: string
    client: string
    detail: string
    time: string
  }[]
  upcomingCampaigns: {
    id: string
    subject: string
    client: string
    scheduledAt: string
    status: string
  }[]
}

const statusConfig: Record<string, { label: string; className: string }> = {
  scheduled: { label: 'Scheduled', className: 'text-blue-600 bg-blue-50' },
  pending_approval: { label: 'Pending', className: 'text-amber-600 bg-amber-50' },
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Failed to load dashboard data')
        // Use placeholder data if API fails
        setStats({
          totalClients: 0,
          totalCampaigns: 0,
          avgOpenRate: 0,
          monthlyRevenue: 0,
          changes: { clients: 0, campaigns: 0, openRate: 0, revenue: 0 },
          recentActivity: [],
          upcomingCampaigns: [],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const metrics = stats
    ? [
        {
          title: 'Total Clients',
          value: stats.totalClients.toString(),
          change: stats.changes.clients,
          icon: Users,
        },
        {
          title: 'Campaigns Sent',
          value: stats.totalCampaigns.toString(),
          change: stats.changes.campaigns,
          icon: Mail,
        },
        {
          title: 'Avg. Open Rate',
          value: `${stats.avgOpenRate}%`,
          change: stats.changes.openRate,
          icon: TrendingUp,
        },
        {
          title: 'Monthly Revenue',
          value: `$${stats.monthlyRevenue.toLocaleString()}`,
          change: stats.changes.revenue,
          icon: DollarSign,
        },
      ]
    : []

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Overview" />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-black/30" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="Overview" />

      <div className="px-6 py-6 space-y-8">
        {error && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
            {error}. Showing placeholder data. Make sure your database is set up.
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth"
          >
            <Link href="/clients">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Link>
          </Button>
          <Button
            asChild
            className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth"
          >
            <Link href="/templates">
              <FileText className="h-4 w-4 mr-2" />
              Create Template
            </Link>
          </Button>
        </div>

        {/* Metrics */}
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
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{Math.abs(metric.change)}% from last month</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Recent Activity</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-black/50 hover:text-black hover:bg-black/5"
              >
                View all
              </Button>
            </div>
            <div className="border border-[#E0E0E0] rounded divide-y divide-[#E0E0E0]">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 hover:bg-black/[0.01] transition-smooth"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-black">{activity.action}</p>
                        <p className="text-sm text-black/70 mt-0.5">
                          {activity.client}
                        </p>
                        {activity.detail && (
                          <p className="text-sm text-black/50">{activity.detail}</p>
                        )}
                      </div>
                      <span className="text-xs text-black/40 whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-black/40">
                  <p>No recent activity</p>
                  <p className="text-sm mt-1">Activity will appear here as you use the platform</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Campaigns */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Upcoming Campaigns</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-black/50 hover:text-black hover:bg-black/5"
              >
                View all
              </Button>
            </div>
            <div className="border border-[#E0E0E0] rounded divide-y divide-[#E0E0E0]">
              {stats?.upcomingCampaigns && stats.upcomingCampaigns.length > 0 ? (
                stats.upcomingCampaigns.map((campaign) => {
                  const status = statusConfig[campaign.status] || {
                    label: campaign.status,
                    className: 'text-black/60 bg-black/5',
                  }
                  return (
                    <div
                      key={campaign.id}
                      className="p-4 hover:bg-black/[0.01] transition-smooth"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-black">{campaign.subject}</p>
                          <p className="text-sm text-black/70 mt-0.5">
                            {campaign.client}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 text-black/40" />
                            <span className="text-xs text-black/50">
                              {campaign.scheduledAt}
                            </span>
                          </div>
                        </div>
                        <span
                          className={cn(
                            'text-xs font-medium px-2 py-1 rounded',
                            status.className
                          )}
                        >
                          {status.label}
                        </span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-8 text-center text-black/40">
                  <p>No upcoming campaigns</p>
                  <p className="text-sm mt-1">Scheduled campaigns will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
