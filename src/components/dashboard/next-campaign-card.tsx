'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  // TODO: Fetch real data
  const mockCampaign = campaign || {
    id: '2',
    subject: 'February Property Showcase',
    scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'pending_approval' as const,
    recipientCount: 2847,
  }

  const statusConfig = {
    pending_approval: {
      label: 'Pending Approval',
      className: 'text-amber-600',
    },
    approved: {
      label: 'Approved',
      className: 'text-green-600',
    },
    scheduled: {
      label: 'Scheduled',
      className: 'text-neutral-600',
    },
  }

  const status = statusConfig[mockCampaign.status]

  return (
    <Card className="bg-white border border-neutral-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-heading text-black">
            Next Campaign
          </CardTitle>
          <span className={`text-xs font-medium uppercase tracking-wide ${status.className}`}>
            {status.label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium text-black">{mockCampaign.subject}</h3>
          <p className="text-sm text-neutral-500 mt-1">
            {format(mockCampaign.scheduledAt, 'MMMM d, yyyy')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-100">
          <div>
            <p className="text-2xl font-heading text-black">
              {formatDistanceToNow(mockCampaign.scheduledAt)}
            </p>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Until Send</p>
          </div>
          <div>
            <p className="text-2xl font-heading text-black">
              {mockCampaign.recipientCount.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Recipients</p>
          </div>
        </div>

        <div className="flex gap-3">
          {mockCampaign.status === 'pending_approval' && (
            <>
              <Button className="flex-1 bg-[#083E33] hover:bg-[#062d25] text-white font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-neutral-200 text-black hover:bg-neutral-50 font-medium"
              >
                <Edit className="h-4 w-4 mr-2" />
                Request Changes
              </Button>
            </>
          )}
          {mockCampaign.status !== 'pending_approval' && (
            <Button
              asChild
              variant="ghost"
              className="w-full text-black hover:text-black hover:bg-neutral-50 font-medium"
            >
              <Link href={`/campaigns/${mockCampaign.id}`}>
                View Campaign
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
