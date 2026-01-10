'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Clock, CheckCircle, Edit } from 'lucide-react'
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
      className: 'bg-amber-500/10 text-amber-400',
    },
    approved: {
      label: 'Approved',
      className: 'bg-emerald-500/10 text-emerald-400',
    },
    scheduled: {
      label: 'Scheduled',
      className: 'bg-blue-500/10 text-blue-400',
    },
  }

  const status = statusConfig[mockCampaign.status]

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#d4af37]" />
          Next Campaign
        </CardTitle>
        <Badge variant="secondary" className={`${status.className} border-0`}>
          {status.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-white">{mockCampaign.subject}</h3>
          <p className="text-sm text-slate-400">
            Scheduled for {format(mockCampaign.scheduledAt, 'MMM d, yyyy')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
            <Clock className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-white">
                {formatDistanceToNow(mockCampaign.scheduledAt, { addSuffix: true })}
              </p>
              <p className="text-xs text-slate-400">Time until send</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
            <Users className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-white">
                {mockCampaign.recipientCount.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">Recipients</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {mockCampaign.status === 'pending_approval' && (
            <>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
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
              className="w-full text-[#d4af37] hover:text-[#e5c048] hover:bg-slate-800"
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
