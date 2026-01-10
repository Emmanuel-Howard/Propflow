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

      <div className="p-8 space-y-8">
        {/* Metrics Overview */}
        <section>
          <MetricsCards />
        </section>

        {/* Charts and Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
          <div>
            <QuickActions />
          </div>
        </section>

        {/* Campaign Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentCampaignCard />
          <NextCampaignCard />
        </section>
      </div>
    </div>
  )
}
