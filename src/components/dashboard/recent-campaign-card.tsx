'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  // TODO: Fetch real data
  const mockCampaign = campaign || {
    id: '1',
    subject: 'January Market Update Newsletter',
    sentAt: new Date('2024-01-15'),
    openRate: 24.8,
    clickRate: 3.2,
    totalRecipients: 2847,
  }

  return (
    <Card className="bg-white border border-neutral-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-heading text-black">
            Latest Campaign
          </CardTitle>
          <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
            Sent
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium text-black">{mockCampaign.subject}</h3>
          <p className="text-sm text-neutral-500 mt-1">
            {format(mockCampaign.sentAt, 'MMMM d, yyyy')}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y border-neutral-100">
          <div>
            <p className="text-2xl font-heading text-black">
              {mockCampaign.totalRecipients.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Sent</p>
          </div>
          <div>
            <p className="text-2xl font-heading text-black">
              {mockCampaign.openRate}%
            </p>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Open Rate</p>
          </div>
          <div>
            <p className="text-2xl font-heading text-black">
              {mockCampaign.clickRate}%
            </p>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Click Rate</p>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          className="w-full justify-center text-black hover:text-black hover:bg-neutral-50 font-medium"
        >
          <Link href={`/campaigns/${mockCampaign.id}`}>
            View Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
