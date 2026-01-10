import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Mail,
  Eye,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  Users,
  UserMinus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data
const metrics = [
  {
    title: 'Total Emails Sent',
    value: '12,847',
    change: 15.2,
    icon: Mail,
  },
  {
    title: 'Average Open Rate',
    value: '24.8%',
    change: 4.2,
    icon: Eye,
  },
  {
    title: 'Average Click Rate',
    value: '3.2%',
    change: -1.1,
    icon: MousePointerClick,
  },
  {
    title: 'Total Contacts',
    value: '2,847',
    change: 12.5,
    icon: Users,
  },
  {
    title: 'Unsubscribe Rate',
    value: '0.3%',
    change: -0.1,
    icon: UserMinus,
  },
]

const monthlyData = [
  { month: 'Jul', openRate: 22.1, clickRate: 2.8, sent: 1200 },
  { month: 'Aug', openRate: 23.5, clickRate: 3.1, sent: 1350 },
  { month: 'Sep', openRate: 21.8, clickRate: 2.9, sent: 1180 },
  { month: 'Oct', openRate: 24.2, clickRate: 3.4, sent: 1420 },
  { month: 'Nov', openRate: 25.1, clickRate: 3.2, sent: 1550 },
  { month: 'Dec', openRate: 24.8, clickRate: 3.2, sent: 1480 },
]

const topCampaigns = [
  {
    subject: 'Holiday Special: Year-End Property Deals',
    sent: 2847,
    openRate: 32.4,
    clickRate: 5.2,
  },
  {
    subject: 'January Market Update Newsletter',
    sent: 2847,
    openRate: 24.8,
    clickRate: 3.2,
  },
  {
    subject: 'New Listings Alert - November',
    sent: 2650,
    openRate: 28.1,
    clickRate: 4.1,
  },
  {
    subject: 'Mortgage Rate Update',
    sent: 2400,
    openRate: 26.5,
    clickRate: 3.8,
  },
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <Header title="Analytics" />

      <div className="p-6 space-y-6">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {metrics.map((metric) => {
            const isPositive = metric.change >= 0
            const Icon = metric.icon
            return (
              <Card key={metric.title} className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <Icon className="h-4 w-4 text-[#d4af37]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400 truncate">
                        {metric.title}
                      </p>
                      <p className="text-lg font-bold text-white">
                        {metric.value}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'flex items-center gap-0.5 text-xs font-medium',
                        isPositive ? 'text-emerald-400' : 'text-red-400'
                      )}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">{data.month}</span>
                      <span className="text-white">{data.openRate}% open</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1e3a5f] to-[#2a4a6f] rounded-full"
                        style={{ width: `${data.openRate * 3}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Breakdown */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Engagement Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[250px]">
                <div className="relative w-48 h-48">
                  {/* Simple donut chart */}
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="15"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#1e3a5f"
                      strokeWidth="15"
                      strokeDasharray="251.2"
                      strokeDashoffset="188.4"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#d4af37"
                      strokeWidth="15"
                      strokeDasharray="251.2"
                      strokeDashoffset="243.4"
                      className="rotate-[90deg] origin-center"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">78</span>
                    <span className="text-sm text-slate-400">Score</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1e3a5f]" />
                  <span className="text-sm text-slate-400">Opened (24.8%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#d4af37]" />
                  <span className="text-sm text-slate-400">Clicked (3.2%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Campaigns */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCampaigns.map((campaign, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e3a5f] text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-white">{campaign.subject}</p>
                      <p className="text-sm text-slate-400">
                        {campaign.sent.toLocaleString()} sent
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-white">
                        {campaign.openRate}%
                      </p>
                      <p className="text-slate-400">Opens</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-[#d4af37]">
                        {campaign.clickRate}%
                      </p>
                      <p className="text-slate-400">Clicks</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
