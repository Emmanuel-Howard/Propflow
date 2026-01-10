'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Edit } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

interface NextCampaignCardProps {
  campaign?: {
    id: string
    subject: string
    scheduledAt: Date
    status: 'pending_approval' | 'approved' | 'scheduled'
    recipientCount: number
  } | null
}

export function NextCampaignCard({ campaign }: NextCampaignCardProps) {
  const mockCampaign = campaign || {
    id: '2',
    subject: 'February Property Showcase',
    scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'pending_approval' as const,
    recipientCount: 2847,
  }

  const statusConfig = {
    pending_approval: { label: 'Pending Approval', className: 'text-amber-600' },
    approved: { label: 'Approved', className: 'text-green-600' },
    scheduled: { label: 'Scheduled', className: 'text-black/60' },
  }

  const status = statusConfig[mockCampaign.status]

  return (
    <div className="border border-[#E0E0E0] rounded p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-label font-semibold text-black">Next Campaign</h3>
        <span className={`text-xs font-medium uppercase tracking-wide ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="mb-6">
        <p className="font-medium text-black">{mockCampaign.subject}</p>
        <p className="text-muted-sm mt-1">
          {format(mockCampaign.scheduledAt, 'MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-t border-[#E0E0E0]">
        <div>
          <p className="text-xl font-semibold text-black">
            {formatDistanceToNow(mockCampaign.scheduledAt)}
          </p>
          <p className="text-xs text-black/50 mt-1 uppercase tracking-wide">Until Send</p>
        </div>
        <div>
          <p className="text-xl font-semibold text-black tabular-nums">
            {mockCampaign.recipientCount.toLocaleString()}
          </p>
          <p className="text-xs text-black/50 mt-1 uppercase tracking-wide">Recipients</p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        {mockCampaign.status === 'pending_approval' && (
          <>
            <Button className="flex-1 bg-[#083E33] hover:bg-[#062d25] text-white font-medium transition-smooth">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-[#E0E0E0] text-black hover:bg-black/5 font-medium transition-smooth"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </>
        )}
        {mockCampaign.status !== 'pending_approval' && (
          <Button
            asChild
            variant="ghost"
            className="w-full text-black hover:bg-black/5 font-medium transition-smooth"
          >
            <Link href={`/campaigns/${mockCampaign.id}`}>
              View Campaign
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
