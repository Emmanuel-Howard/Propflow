'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, MoreHorizontal, Loader2, Pencil, Copy, Trash2, Search, Check, X, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Campaign, AudienceType } from '@/types/database'

interface CampaignWithDetails extends Campaign {
  recipients: number
  openRate: number
  clickRate: number
  client_name?: string
  list_name?: string
}

function getAudienceDisplay(campaign: CampaignWithDetails): string {
  if (campaign.audience_type === 'all' || !campaign.audience_type) return 'Everyone'
  if (campaign.audience_type === 'list') return `List: ${campaign.list_name || 'Unknown'}`
  if (campaign.audience_type === 'custom') {
    const count = campaign.audience_contact_ids?.length || 0
    return `${count} contact${count === 1 ? '' : 's'}`
  }
  return 'Everyone'
}

interface Client {
  id: string
  name: string
  email: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'text-black/40' },
  pending_approval: { label: 'Review Request', className: 'text-amber-600' },
  approved: { label: 'Ready', className: 'text-blue-600' },
  scheduled: { label: 'Scheduled', className: 'text-purple-600' },
  sending: { label: 'Sending', className: 'text-purple-600' },
  sent: { label: 'Sent', className: 'text-green-600' },
  failed: { label: 'Failed', className: 'text-red-600' },
  cancelled: { label: 'Cancelled', className: 'text-black/40' },
}

const statusFilters = [
  { value: 'all', label: 'All Campaigns' },
  { value: 'draft', label: 'Drafts' },
  { value: 'pending_approval', label: 'Review Requests' },
  { value: 'approved', label: 'Ready' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'sent', label: 'Sent' },
]

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignWithDetails[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedClientId, setSelectedClientId] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    fetchCampaigns()
  }, [activeFilter, selectedClientId])

  async function fetchClients() {
    try {
      const response = await fetch('/api/admin/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  async function fetchCampaigns() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedClientId !== 'all') params.set('client_id', selectedClientId)
      if (activeFilter !== 'all') params.set('status', activeFilter)

      const response = await fetch(`/api/campaigns?${params}`)
      if (response.ok) {
        const data = await response.json()
        // Enrich with client names
        const enrichedData = data.map((campaign: CampaignWithDetails) => ({
          ...campaign,
          client_name: clients.find(c => c.id === campaign.client_id)?.name || 'Unknown'
        }))
        setCampaigns(enrichedData)
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

  async function handleReject(campaignId: string) {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'draft' }),
      })

      if (response.ok) {
        toast.success('Campaign sent back for revision')
        fetchCampaigns()
      } else {
        toast.error('Failed to reject campaign')
      }
    } catch (error) {
      console.error('Error rejecting campaign:', error)
      toast.error('Failed to reject campaign')
    }
  }

  async function handleDelete(campaignId: string) {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Campaign deleted')
        fetchCampaigns()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete campaign')
      }
    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast.error('Failed to delete campaign')
    }
  }

  async function handleDuplicate(campaign: CampaignWithDetails) {
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: campaign.client_id,
          subject: `${campaign.subject} (Copy)`,
          preview_text: campaign.preview_text,
          content_html: campaign.content_html,
          template_id: campaign.template_id,
          status: 'draft',
        }),
      })

      if (response.ok) {
        toast.success('Campaign duplicated')
        fetchCampaigns()
      } else {
        toast.error('Failed to duplicate campaign')
      }
    } catch (error) {
      console.error('Error duplicating campaign:', error)
      toast.error('Failed to duplicate campaign')
    }
  }

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      <Header title="Campaigns" />

      <div className="px-6 py-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-[#E0E0E0] text-black placeholder:text-black/40 focus:border-[#083E33] focus:ring-[#083E33]/20"
              />
            </div>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="w-[200px] bg-white border-[#E0E0E0]">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            asChild
            className="bg-[#083E33] hover:bg-[#062d25] text-white font-medium transition-smooth"
          >
            <Link href="/admin-campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded transition-smooth whitespace-nowrap',
                activeFilter === filter.value
                  ? 'bg-black text-white'
                  : 'bg-[#FAFAFA] text-black/60 hover:bg-black/5 hover:text-black'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Campaigns Table */}
        <div className="border border-[#E0E0E0] rounded overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-black/40" />
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-black/40">
              <p className="mb-4">No campaigns found</p>
              <Button asChild className="bg-[#083E33] hover:bg-[#062d25] text-white">
                <Link href="/admin-campaigns/new">
                  Create your first campaign
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAFAFA] hover:bg-[#FAFAFA]">
                  <TableHead className="text-black/60 font-medium">Campaign</TableHead>
                  <TableHead className="text-black/60 font-medium">Client</TableHead>
                  <TableHead className="text-black/60 font-medium">Audience</TableHead>
                  <TableHead className="text-black/60 font-medium">Status</TableHead>
                  <TableHead className="text-black/60 font-medium">Scheduled</TableHead>
                  <TableHead className="text-black/60 font-medium">Sent</TableHead>
                  <TableHead className="text-black/60 font-medium text-right">Opens</TableHead>
                  <TableHead className="text-black/60 font-medium text-right">Clicks</TableHead>
                  <TableHead className="text-black/60 font-medium w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => {
                  const status = statusConfig[campaign.status] || statusConfig.draft
                  const isPending = campaign.status === 'pending_approval'
                  return (
                    <TableRow
                      key={campaign.id}
                      className="hover:bg-black/[0.02] transition-smooth"
                    >
                      <TableCell>
                        <Link
                          href={`/admin-campaigns/${campaign.id}`}
                          className="text-black hover:text-black/70 font-medium transition-smooth"
                        >
                          {campaign.subject}
                        </Link>
                      </TableCell>
                      <TableCell className="text-black/60">
                        {campaign.client_name}
                      </TableCell>
                      <TableCell className="text-black/60">
                        {getAudienceDisplay(campaign)}
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-black/60">
                        {campaign.scheduled_at
                          ? format(new Date(campaign.scheduled_at), 'MMM d, yyyy')
                          : '—'}
                      </TableCell>
                      <TableCell className="text-black/60">
                        {campaign.sent_at
                          ? format(new Date(campaign.sent_at), 'MMM d, yyyy')
                          : '—'}
                      </TableCell>
                      <TableCell className="text-right text-black tabular-nums">
                        {campaign.openRate ? `${campaign.openRate.toFixed(1)}%` : '—'}
                      </TableCell>
                      <TableCell className="text-right text-black tabular-nums">
                        {campaign.clickRate ? `${campaign.clickRate.toFixed(1)}%` : '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {isPending && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApprove(campaign.id)}
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleReject(campaign.id)}
                                title="Send back for revision"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-black/40 hover:text-black"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin-campaigns/${campaign.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin-campaigns/${campaign.id}/edit`}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(campaign)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(campaign.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
