import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'

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
  draft: { label: 'Draft', className: 'text-black/40' },
  pending_approval: { label: 'Pending', className: 'text-amber-600' },
  approved: { label: 'Approved', className: 'text-blue-600' },
  scheduled: { label: 'Scheduled', className: 'text-blue-600' },
  sending: { label: 'Sending', className: 'text-purple-600' },
  sent: { label: 'Sent', className: 'text-green-600' },
  failed: { label: 'Failed', className: 'text-red-600' },
}

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header title="Campaigns" />

      <div className="px-6 py-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-sm">
            Manage and track your email campaigns
          </p>
          <Button
            asChild
            className="bg-white border border-[#E0E0E0] text-black hover:bg-black/5 hover:shadow-sm font-medium transition-smooth"
          >
            <Link href="/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>

        {/* Campaigns Table - integrated, no card */}
        <div className="border border-[#E0E0E0] rounded overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAFAFA] hover:bg-[#FAFAFA]">
                <TableHead className="text-black/60 font-medium">Campaign</TableHead>
                <TableHead className="text-black/60 font-medium">Status</TableHead>
                <TableHead className="text-black/60 font-medium">Date</TableHead>
                <TableHead className="text-black/60 font-medium text-right">Recipients</TableHead>
                <TableHead className="text-black/60 font-medium text-right">Opens</TableHead>
                <TableHead className="text-black/60 font-medium text-right">Clicks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => {
                const status = statusConfig[campaign.status]
                return (
                  <TableRow
                    key={campaign.id}
                    className="hover:bg-black/[0.02] transition-smooth"
                  >
                    <TableCell>
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="text-black hover:text-black/70 font-medium transition-smooth"
                      >
                        {campaign.subject}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-black/60">
                      {campaign.sentAt
                        ? format(campaign.sentAt, 'MMM d, yyyy')
                        : campaign.scheduledAt
                        ? format(campaign.scheduledAt, 'MMM d, yyyy')
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right text-black tabular-nums">
                      {campaign.recipients.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-black tabular-nums">
                      {campaign.openRate ? `${campaign.openRate}%` : '—'}
                    </TableCell>
                    <TableCell className="text-right text-black tabular-nums">
                      {campaign.clickRate ? `${campaign.clickRate}%` : '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
