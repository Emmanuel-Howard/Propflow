import { Header } from '@/components/layout/header'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const metrics = [
  { title: 'Total Sent', value: '12,847', change: 15.2 },
  { title: 'Avg. Open Rate', value: '24.8%', change: 4.2 },
  { title: 'Avg. Click Rate', value: '3.2%', change: -1.1 },
  { title: 'Total Contacts', value: '2,847', change: 12.5 },
  { title: 'Unsubscribe Rate', value: '0.3%', change: -0.1 },
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
  { subject: 'Holiday Special: Year-End Property Deals', sent: 2847, openRate: 32.4, clickRate: 5.2 },
  { subject: 'January Market Update Newsletter', sent: 2847, openRate: 24.8, clickRate: 3.2 },
  { subject: 'New Listings Alert - November', sent: 2650, openRate: 28.1, clickRate: 4.1 },
  { subject: 'Mortgage Rate Update', sent: 2400, openRate: 26.5, clickRate: 3.8 },
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header title="Analytics" />

      <div className="px-6 py-6 space-y-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pb-6 border-b border-[#E0E0E0]">
          {metrics.map((metric) => {
            const isPositive = metric.change >= 0
            return (
              <div key={metric.title}>
                <p className="text-xs text-black/50 uppercase tracking-wider font-medium">
                  {metric.title}
                </p>
                <p className="text-2xl font-semibold text-black mt-1 tabular-nums">
                  {metric.value}
                </p>
                <div className={cn(
                  'flex items-center gap-1 text-sm font-medium mt-1',
                  isPositive ? 'text-green-600' : 'text-red-600'
                )}>
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Monthly Trends */}
        <div>
          <h3 className="text-h3 text-black mb-6">Monthly Performance</h3>
          <div className="border border-[#E0E0E0] rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA]">
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60">Month</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-black/60">Sent</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-black/60">Open Rate</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-black/60">Click Rate</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 w-1/3">Performance</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data) => (
                  <tr key={data.month} className="border-t border-[#E0E0E0] hover:bg-black/[0.01] transition-smooth">
                    <td className="px-4 py-3 font-medium text-black">{data.month}</td>
                    <td className="px-4 py-3 text-right text-black tabular-nums">{data.sent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-black tabular-nums">{data.openRate}%</td>
                    <td className="px-4 py-3 text-right text-black tabular-nums">{data.clickRate}%</td>
                    <td className="px-4 py-3">
                      <div className="h-2 bg-[#F0F0F0] rounded overflow-hidden">
                        <div
                          className="h-full bg-black rounded"
                          style={{ width: `${data.openRate * 3}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Campaigns */}
        <div>
          <h3 className="text-h3 text-black mb-6">Top Performing Campaigns</h3>
          <div className="space-y-3">
            {topCampaigns.map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-[#E0E0E0] rounded hover:bg-black/[0.01] transition-smooth"
              >
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 flex items-center justify-center text-sm font-semibold text-black/40">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-black">{campaign.subject}</p>
                    <p className="text-sm text-black/50">{campaign.sent.toLocaleString()} sent</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="text-right">
                    <p className="font-semibold text-black tabular-nums">{campaign.openRate}%</p>
                    <p className="text-xs text-black/50">Opens</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#D4AF37] tabular-nums">{campaign.clickRate}%</p>
                    <p className="text-xs text-black/50">Clicks</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
