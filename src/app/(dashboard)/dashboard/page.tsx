import { Header } from '@/components/layout/header'
import { MetricsCards } from '@/components/dashboard/metrics-cards'
import { PerformanceChart } from '@/components/dashboard/performance-chart'
import { RecentCampaignCard } from '@/components/dashboard/recent-campaign-card'
import { NextCampaignCard } from '@/components/dashboard/next-campaign-card'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header title="Dashboard" />

      <div className="p-6 space-y-6">
        {/* Metrics Overview */}
        <MetricsCards />

        {/* Charts and Campaign Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Campaign Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentCampaignCard />
          <NextCampaignCard />
        </div>
      </div>
    </div>
  )
}
