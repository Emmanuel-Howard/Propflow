import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Mail, Eye, MousePointerClick } from 'lucide-react'
import { format } from 'date-fns'

// Mock data - TODO: Replace with real data
const campaigns = [
  {
    id: '1',
    subject: 'January Market Update Newsletter',
    status: 'sent',
    sentAt: new Date('2024-01-15'),
    recipients: 2847,
    openRate: 24.8,
    clickRate: 3.2,
  },
  {
    id: '2',
    subject: 'February Property Showcase',
    status: 'scheduled',
    scheduledAt: new Date('2024-02-01'),
    recipients: 2847,
  },
  {
    id: '3',
    subject: 'Spring Real Estate Tips',
    status: 'draft',
    recipients: 0,
  },
  {
    id: '4',
    subject: 'Monthly Market Insights',
    status: 'pending_approval',
    scheduledAt: new Date('2024-02-15'),
    recipients: 2847,
  },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-slate-500/10 text-slate-400' },
  pending_approval: {
    label: 'Pending Approval',
    className: 'bg-amber-500/10 text-amber-400',
  },
  approved: { label: 'Approved', className: 'bg-blue-500/10 text-blue-400' },
  scheduled: { label: 'Scheduled', className: 'bg-blue-500/10 text-blue-400' },
  sending: { label: 'Sending', className: 'bg-purple-500/10 text-purple-400' },
  sent: { label: 'Sent', className: 'bg-emerald-500/10 text-emerald-400' },
  failed: { label: 'Failed', className: 'bg-red-500/10 text-red-400' },
}

export default function CampaignsPage() {
  return (
    <div className="min-h-screen">
      <Header title="Campaigns" />

      <div className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400">
              Manage and track your email campaigns
            </p>
          </div>
          <Button
            asChild
            className="bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white"
          >
            <Link href="/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>

        {/* Campaigns Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">All Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Campaign</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Date</TableHead>
                  <TableHead className="text-slate-400 text-center">
                    <Mail className="h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="text-slate-400 text-center">
                    <Eye className="h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="text-slate-400 text-center">
                    <MousePointerClick className="h-4 w-4 inline" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const status = statusConfig[campaign.status]
                  return (
                    <TableRow
                      key={campaign.id}
                      className="border-slate-800 hover:bg-slate-800/50"
                    >
                      <TableCell>
                        <Link
                          href={`/campaigns/${campaign.id}`}
                          className="text-white hover:text-[#d4af37] font-medium"
                        >
                          {campaign.subject}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${status.className} border-0`}
                        >
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {campaign.sentAt
                          ? format(campaign.sentAt, 'MMM d, yyyy')
                          : campaign.scheduledAt
                          ? format(campaign.scheduledAt, 'MMM d, yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell className="text-center text-slate-300">
                        {campaign.recipients.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center text-slate-300">
                        {campaign.openRate ? `${campaign.openRate}%` : '-'}
                      </TableCell>
                      <TableCell className="text-center text-slate-300">
                        {campaign.clickRate ? `${campaign.clickRate}%` : '-'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
