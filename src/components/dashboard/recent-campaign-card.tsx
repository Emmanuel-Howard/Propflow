'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Eye, MousePointerClick, ArrowRight } from 'lucide-react'
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
    <Card className="bg-white border border-gray-100 shadow-card hover:shadow-elevated transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-heading font-semibold text-[#083E33] flex items-center gap-2">
          <div className="p-1.5 bg-[#083E33]/5 rounded-lg">
            <Mail className="h-4 w-4 text-[#083E33]" />
          </div>
          Latest Campaign
        </CardTitle>
        <Badge className="bg-emerald-50 text-emerald-700 border-0 font-medium">
          Sent
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-900">{mockCampaign.subject}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Sent on {format(mockCampaign.sentAt, 'MMM d, yyyy')}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-center text-gray-400 mb-1.5">
              <Mail className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-[#083E33]">
              {mockCampaign.totalRecipients.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Sent</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-center text-gray-400 mb-1.5">
              <Eye className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-[#083E33]">
              {mockCampaign.openRate}%
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Open Rate</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-center text-gray-400 mb-1.5">
              <MousePointerClick className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-[#083E33]">
              {mockCampaign.clickRate}%
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Click Rate</p>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          className="w-full text-[#083E33] hover:text-[#083E33] hover:bg-[#083E33]/5 font-medium"
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
