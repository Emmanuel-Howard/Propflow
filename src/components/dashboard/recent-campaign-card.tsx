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
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Mail className="h-5 w-5 text-[#d4af37]" />
          Latest Campaign
        </CardTitle>
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0">
          Sent
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-white">{mockCampaign.subject}</h3>
          <p className="text-sm text-slate-400">
            Sent on {format(mockCampaign.sentAt, 'MMM d, yyyy')}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-800 rounded-lg">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <Mail className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-white">
              {mockCampaign.totalRecipients.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">Sent</p>
          </div>
          <div className="text-center p-3 bg-slate-800 rounded-lg">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <Eye className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-white">
              {mockCampaign.openRate}%
            </p>
            <p className="text-xs text-slate-400">Open Rate</p>
          </div>
          <div className="text-center p-3 bg-slate-800 rounded-lg">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <MousePointerClick className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-white">
              {mockCampaign.clickRate}%
            </p>
            <p className="text-xs text-slate-400">Click Rate</p>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          className="w-full text-[#d4af37] hover:text-[#e5c048] hover:bg-slate-800"
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
