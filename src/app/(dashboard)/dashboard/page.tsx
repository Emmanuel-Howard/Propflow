import { Header } from '@/components/layout/header'
import { MetricsCards } from '@/components/dashboard/metrics-cards'
import { PerformanceChart } from '@/components/dashboard/performance-chart'
import { RecentCampaignCard } from '@/components/dashboard/recent-campaign-card'
import { NextCampaignCard } from '@/components/dashboard/next-campaign-card'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header title="Dashboard" />

      <div className="p-6 lg:p-8 space-y-6">
        {/* Metrics Overview */}
        <section>
          <MetricsCards />
        </section>

        {/* Charts and Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>

          {/* Quick Actions */}
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
