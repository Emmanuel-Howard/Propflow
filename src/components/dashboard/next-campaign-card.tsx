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
      className: 'bg-amber-50 text-amber-700',
    },
    approved: {
      label: 'Approved',
      className: 'bg-emerald-50 text-emerald-700',
    },
    scheduled: {
      label: 'Scheduled',
      className: 'bg-blue-50 text-blue-700',
    },
  }

  const status = statusConfig[mockCampaign.status]

  return (
    <Card className="bg-white border border-gray-100 shadow-card hover:shadow-elevated transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-heading font-semibold text-[#083E33] flex items-center gap-2">
          <div className="p-1.5 bg-[#D4AF37]/10 rounded-lg">
            <Calendar className="h-4 w-4 text-[#D4AF37]" />
          </div>
          Next Campaign
        </CardTitle>
        <Badge className={`${status.className} border-0 font-medium`}>
          {status.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-900">{mockCampaign.subject}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Scheduled for {format(mockCampaign.scheduledAt, 'MMM d, yyyy')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Clock className="h-4 w-4 text-[#083E33]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#083E33]">
                {formatDistanceToNow(mockCampaign.scheduledAt, { addSuffix: true })}
              </p>
              <p className="text-xs text-gray-500">Time until send</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Users className="h-4 w-4 text-[#083E33]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#083E33]">
                {mockCampaign.recipientCount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Recipients</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {mockCampaign.status === 'pending_approval' && (
            <>
              <Button
                className="flex-1 bg-[#083E33] hover:bg-[#062d25] text-white font-medium shadow-sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
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
              className="w-full text-[#083E33] hover:text-[#083E33] hover:bg-[#083E33]/5 font-medium"
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
