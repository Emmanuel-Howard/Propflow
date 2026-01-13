'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Copy,
  Trash2,
  Monitor,
  Smartphone,
  Calendar,
  Clock,
  Users,
  Mail,
  MousePointer,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { format } from 'date-fns'
import type { Campaign, CampaignAnalytics } from '@/types/database'

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-black/10 text-black/60' },
  pending_approval: { label: 'Review Request', className: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Ready', className: 'bg-blue-100 text-blue-700' },
  scheduled: { label: 'Scheduled', className: 'bg-purple-100 text-purple-700' },
  sending: { label: 'Sending', className: 'bg-purple-100 text-purple-700' },
  sent: { label: 'Sent', className: 'bg-green-100 text-green-700' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', className: 'bg-black/10 text-black/60' },
}

interface CampaignWithDetails extends Campaign {
  campaign_analytics: CampaignAnalytics | null
  client_name?: string
}

interface ViewCampaignPageProps {
  params: Promise<{ id: string }>
}

export default function ViewCampaignPage({ params }: ViewCampaignPageProps) {
  const { id } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [campaign, setCampaign] = useState<CampaignWithDetails | null>(null)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchCampaign()
  }, [id])

  async function fetchCampaign() {
    try {
      const response = await fetch(`/api/campaigns/${id}`)
      if (response.ok) {
        const data = await response.json()
        // Fetch client name
        const clientResponse = await fetch('/api/admin/clients')
        if (clientResponse.ok) {
          const clients = await clientResponse.json()
          const client = clients.find((c: { id: string }) => c.id === data.client_id)
          data.client_name = client?.name || 'Unknown'
        }
        setCampaign(data)
      } else if (response.status === 404) {
        toast.error('Campaign not found')
        router.push('/admin-campaigns')
      } else {
        toast.error('Failed to load campaign')
      }
    } catch (error) {
      console.error('Error fetching campaign:', error)
      toast.error('Failed to load campaign')
    } finally {
      setLoading(false)
    }
  }

  async function handleDuplicate() {
    if (!campaign) return

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
          audience_type: campaign.audience_type,
          audience_list_id: campaign.audience_list_id,
          audience_contact_ids: campaign.audience_contact_ids,
        }),
      })

      if (response.ok) {
        toast.success('Campaign duplicated')
        router.push('/admin-campaigns')
      } else {
        toast.error('Failed to duplicate campaign')
      }
    } catch (error) {
      console.error('Error duplicating campaign:', error)
      toast.error('Failed to duplicate campaign')
    }
  }

  async function handleDelete() {
    if (!campaign) return
    if (!confirm('Are you sure you want to delete this campaign?')) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Campaign deleted')
        router.push('/admin-campaigns')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete campaign')
      }
    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast.error('Failed to delete campaign')
    } finally {
      setDeleting(false)
    }
  }

  function getAudienceDisplay(): string {
    if (!campaign) return ''
    if (campaign.audience_type === 'all' || !campaign.audience_type) return 'Everyone'
    if (campaign.audience_type === 'list') return 'Custom List'
    if (campaign.audience_type === 'custom') {
      const count = campaign.audience_contact_ids?.length || 0
      return `${count} contact${count === 1 ? '' : 's'} selected`
    }
    return 'Everyone'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Campaign Details" />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-black/30" />
        </div>
      </div>
    )
  }

  if (!campaign) {
    return null
  }

  const status = statusConfig[campaign.status] || statusConfig.draft
  const canEdit = !['sent', 'sending'].includes(campaign.status)
  const canDelete = !['sent', 'sending'].includes(campaign.status)
  const analytics = campaign.campaign_analytics

  return (
    <div className="min-h-screen bg-white">
      <Header title="Campaign Details" />

      <div className="px-6 py-6 space-y-6">
        {/* Back Button & Actions */}
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            className="text-black/50 hover:text-black hover:bg-black/5 -ml-2"
          >
            <Link href="/admin-campaigns">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Link>
          </Button>

          <div className="flex gap-2">
            {canEdit && (
              <Button asChild variant="outline" className="border-[#E0E0E0]">
                <Link href={`/admin-campaigns/${id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
            )}
            <Button
              onClick={handleDuplicate}
              variant="outline"
              className="border-[#E0E0E0]"
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            {canDelete && (
              <Button
                onClick={handleDelete}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status & Client */}
            <div className="border border-[#E0E0E0] rounded p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-black">Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
                  {status.label}
                </span>
              </div>

              <div className="pt-4 border-t border-[#E0E0E0] space-y-3">
                <div>
                  <p className="text-xs text-black/50 uppercase tracking-wide">Client</p>
                  <p className="font-medium text-black">{campaign.client_name}</p>
                </div>

                <div>
                  <p className="text-xs text-black/50 uppercase tracking-wide">Subject</p>
                  <p className="font-medium text-black">{campaign.subject}</p>
                </div>

                {campaign.preview_text && (
                  <div>
                    <p className="text-xs text-black/50 uppercase tracking-wide">Preview Text</p>
                    <p className="text-black/70">{campaign.preview_text}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Audience */}
            <div className="border border-[#E0E0E0] rounded p-6 space-y-4">
              <h3 className="font-semibold text-black">Audience</h3>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-black/40" />
                <span className="text-black">{getAudienceDisplay()}</span>
              </div>
            </div>

            {/* Dates */}
            <div className="border border-[#E0E0E0] rounded p-6 space-y-4">
              <h3 className="font-semibold text-black">Dates</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-black/40" />
                  <span className="text-sm text-black/50">Created:</span>
                  <span className="text-sm text-black">
                    {format(new Date(campaign.created_at), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>

                {campaign.scheduled_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-black/40" />
                    <span className="text-sm text-black/50">Scheduled:</span>
                    <span className="text-sm text-black">
                      {format(new Date(campaign.scheduled_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                )}

                {campaign.sent_at && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-black/40" />
                    <span className="text-sm text-black/50">Sent:</span>
                    <span className="text-sm text-black">
                      {format(new Date(campaign.sent_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Analytics (if sent) */}
            {campaign.status === 'sent' && analytics && (
              <div className="border border-[#E0E0E0] rounded p-6 space-y-4">
                <h3 className="font-semibold text-black">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-[#FAFAFA] rounded">
                    <div className="flex items-center justify-center gap-1 text-black/50 mb-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">Opens</span>
                    </div>
                    <p className="text-2xl font-semibold text-black">
                      {analytics.open_rate?.toFixed(1) || 0}%
                    </p>
                    <p className="text-xs text-black/50">
                      {analytics.total_opened || 0} of {analytics.total_recipients || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-[#FAFAFA] rounded">
                    <div className="flex items-center justify-center gap-1 text-black/50 mb-1">
                      <MousePointer className="h-4 w-4" />
                      <span className="text-xs">Clicks</span>
                    </div>
                    <p className="text-2xl font-semibold text-black">
                      {analytics.click_rate?.toFixed(1) || 0}%
                    </p>
                    <p className="text-xs text-black/50">
                      {analytics.total_clicked || 0} of {analytics.total_recipients || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2">
            <div className="border border-[#E0E0E0] rounded overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <h3 className="font-semibold text-black">Email Preview</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={cn(
                      'p-2 rounded transition-all',
                      previewMode === 'desktop'
                        ? 'bg-black text-white'
                        : 'text-black/40 hover:text-black hover:bg-black/5'
                    )}
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={cn(
                      'p-2 rounded transition-all',
                      previewMode === 'mobile'
                        ? 'bg-black text-white'
                        : 'text-black/40 hover:text-black hover:bg-black/5'
                    )}
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#F5F5F5] min-h-[600px] flex items-start justify-center">
                <div
                  className={cn(
                    'bg-white rounded shadow-sm overflow-hidden transition-all',
                    previewMode === 'desktop' ? 'w-full max-w-[700px]' : 'w-[375px]'
                  )}
                >
                  {campaign.content_html ? (
                    <iframe
                      srcDoc={campaign.content_html}
                      className="w-full h-[560px] border-0"
                      title="Email Preview"
                      sandbox="allow-same-origin"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[560px] text-black/30">
                      <p>No content</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
