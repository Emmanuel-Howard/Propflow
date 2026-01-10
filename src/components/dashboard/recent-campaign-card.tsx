'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

interface RecentCampaignCardProps {
  campaign?: {
    id: string
    subject: string
    sentAt: Date
    openRate: number
    clickRate: number
    totalRecipients: number
  }
}

export function RecentCampaignCard({ campaign }: RecentCampaignCardProps) {
  const mockCampaign = campaign || {
    id: '1',
    subject: 'January Market Update Newsletter',
    sentAt: new Date('2024-01-15'),
    openRate: 24.8,
    clickRate: 3.2,
    totalRecipients: 2847,
  }

  return (
    <div className="border border-[#E0E0E0] rounded p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-label font-semibold text-black">Latest Campaign</h3>
        <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
          Sent
        </span>
      </div>

      <div className="mb-6">
        <p className="font-medium text-black">{mockCampaign.subject}</p>
        <p className="text-muted-sm mt-1">
          {format(mockCampaign.sentAt, 'MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 py-4 border-t border-[#E0E0E0]">
        <div>
          <p className="text-xl font-semibold text-black tabular-nums">
            {mockCampaign.totalRecipients.toLocaleString()}
          </p>
          <p className="text-xs text-black/50 mt-1 uppercase tracking-wide">Sent</p>
        </div>
        <div>
          <p className="text-xl font-semibold text-black tabular-nums">
            {mockCampaign.openRate}%
          </p>
          <p className="text-xs text-black/50 mt-1 uppercase tracking-wide">Opens</p>
        </div>
        <div>
          <p className="text-xl font-semibold text-black tabular-nums">
            {mockCampaign.clickRate}%
          </p>
          <p className="text-xs text-black/50 mt-1 uppercase tracking-wide">Clicks</p>
        </div>
      </div>

      <Button
        asChild
        variant="ghost"
        className="w-full mt-4 text-black hover:bg-black/5 font-medium transition-smooth"
      >
        <Link href={`/campaigns/${mockCampaign.id}`}>
          View Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </div>
  )
}
