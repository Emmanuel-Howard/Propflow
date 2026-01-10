import { Header } from '@/components/layout/header'
import { MetricsCards } from '@/components/dashboard/metrics-cards'
import { PerformanceChart } from '@/components/dashboard/performance-chart'
import { RecentCampaignCard } from '@/components/dashboard/recent-campaign-card'
import { NextCampaignCard } from '@/components/dashboard/next-campaign-card'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header title="Dashboard" />

      <div className="px-6 py-6 space-y-8">
        {/* Metrics Overview */}
        <MetricsCards />

        {/* Charts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <PerformanceChart />
          </div>
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
