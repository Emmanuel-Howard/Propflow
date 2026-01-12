'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, Eye, Check, X, Clock, Mail } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Campaign } from '@/types/database'

interface CampaignWithAnalytics extends Campaign {
  recipients: number
  openRate: number
  clickRate: number
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  draft: { label: 'Draft', className: 'text-black/40', icon: Clock },
  pending_approval: { label: 'Awaiting Your Review', className: 'text-amber-600', icon: Eye },
  approved: { label: 'Approved', className: 'text-blue-600', icon: Check },
  scheduled: { label: 'Scheduled', className: 'text-blue-600', icon: Clock },
  sending: { label: 'Sending', className: 'text-purple-600', icon: Mail },
  sent: { label: 'Sent', className: 'text-green-600', icon: Check },
  failed: { label: 'Failed', className: 'text-red-600', icon: X },
  cancelled: { label: 'Cancelled', className: 'text-black/40', icon: X },
}

const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'pending_approval', label: 'Needs Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'sent', label: 'Sent' },
]

export default function ClientCampaignsPage() {
  const searchParams = useSearchParams()
  const clientId = searchParams.get('client_id')

  const [campaigns, setCampaigns] = useState<CampaignWithAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    if (clientId) {
      fetchCampaigns()
    }
  }, [clientId, activeFilter])

  async function fetchCampaigns() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (clientId) params.set('client_id', clientId)
      if (activeFilter !== 'all') params.set('status', activeFilter)

      const response = await fetch(`/api/campaigns?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data)
      } else {
        toast.error('Failed to load campaigns')
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      toast.error('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(campaignId: string) {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      })

      if (response.ok) {
        toast.success('Campaign approved')
        fetchCampaigns()
      } else {
        toast.error('Failed to approve campaign')
      }
    } catch (error) {
      console.error('Error approving campaign:', error)
      toast.error('Failed to approve campaign')
    }
  }

  async function handleRequestRevision(campaignId: string) {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'draft' }),
      })

      if (response.ok) {
        toast.success('Revision requested - campaign sent back to admin')
        fetchCampaigns()
      } else {
        toast.error('Failed to request revision')
      }
    } catch (error) {
      console.error('Error requesting revision:', error)
      toast.error('Failed to request revision')
    }
  }

  // Count campaigns needing review
  const pendingCount = campaigns.filter(c => c.status === 'pending_approval').length

  return (
    <div className="min-h-screen bg-white">
      <Header title="Campaigns" />

      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-sm">
              Review and approve campaigns created for your account
            </p>
            {pendingCount > 0 && (
              <p className="text-sm text-amber-600 mt-1">
                {pendingCount} campaign{pendingCount > 1 ? 's' : ''} awaiting your review
              </p>
            )}
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mb-6">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded transition-smooth',
                activeFilter === filter.value
                  ? 'bg-black text-white'
                  : 'bg-[#FAFAFA] text-black/60 hover:bg-black/5 hover:text-black'
              )}
            >
              {filter.label}
              {filter.value === 'pending_approval' && pendingCount > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Campaigns Table */}
        <div className="border border-[#E0E0E0] rounded overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-black/40" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-black/40">
              <Mail className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium text-black/60">No campaigns yet</p>
              <p className="text-sm mt-1">
                Campaigns created by your account manager will appear here
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAFAFA] hover:bg-[#FAFAFA]">
                  <TableHead className="text-black/60 font-medium">Campaign</TableHead>
                  <TableHead className="text-black/60 font-medium">Status</TableHead>
                  <TableHead className="text-black/60 font-medium">Date</TableHead>
                  <TableHead className="text-black/60 font-medium text-right">Opens</TableHead>
                  <TableHead className="text-black/60 font-medium text-right">Clicks</TableHead>
                  <TableHead className="text-black/60 font-medium w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const status = statusConfig[campaign.status] || statusConfig.draft
                  const StatusIcon = status.icon
                  const isPending = campaign.status === 'pending_approval'

                  return (
                    <TableRow
                      key={campaign.id}
                      className={cn(
                        'hover:bg-black/[0.02] transition-smooth',
                        isPending && 'bg-amber-50/50'
                      )}
                    >
                      <TableCell>
                        <Link
                          href={`/campaigns/${campaign.id}${clientId ? `?client_id=${clientId}` : ''}`}
                          className="text-black hover:text-black/70 font-medium transition-smooth"
                        >
                          {campaign.subject}
                        </Link>
                        {campaign.preview_text && (
                          <p className="text-xs text-black/40 mt-0.5 truncate max-w-[300px]">
                            {campaign.preview_text}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-4 w-4 ${status.className}`} />
                          <span className={`text-sm font-medium ${status.className}`}>
                            {status.label}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-black/60">
                        {campaign.sent_at
                          ? format(new Date(campaign.sent_at), 'MMM d, yyyy')
                          : campaign.scheduled_at
                          ? format(new Date(campaign.scheduled_at), 'MMM d, yyyy')
                          : format(new Date(campaign.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right text-black tabular-nums">
                        {campaign.openRate ? `${campaign.openRate.toFixed(1)}%` : '—'}
                      </TableCell>
                      <TableCell className="text-right text-black tabular-nums">
                        {campaign.clickRate ? `${campaign.clickRate.toFixed(1)}%` : '—'}
                      </TableCell>
                      <TableCell>
                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-[#083E33] hover:bg-[#062d25] text-white"
                              onClick={() => handleApprove(campaign.id)}
                            >
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#E0E0E0] text-black/60 hover:text-black"
                              onClick={() => handleRequestRevision(campaign.id)}
                            >
                              Request Revision
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-black/40 hover:text-black"
                            asChild
                          >
                            <Link href={`/campaigns/${campaign.id}${clientId ? `?client_id=${clientId}` : ''}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
