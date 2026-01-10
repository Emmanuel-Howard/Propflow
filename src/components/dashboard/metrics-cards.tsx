'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string
  change: number
}

function MetricCard({ title, value, change }: MetricCardProps) {
  const isPositive = change >= 0

  return (
    <Card className="bg-white border border-neutral-200 hover:border-neutral-300 transition-colors">
      <CardContent className="p-6">
        <p className="text-sm text-neutral-500 font-medium uppercase tracking-wide">
          {title}
        </p>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-3xl font-heading text-black">
            {value}
          </p>
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricsCards() {
  // TODO: Fetch real data
  const metrics = [
    {
      title: 'Open Rate',
      value: '24.8%',
      change: 4.2,
    },
    {
      title: 'Click Rate',
      value: '3.2%',
      change: -1.1,
    },
    {
      title: 'Total Contacts',
      value: '2,847',
      change: 12.5,
    },
    {
      title: 'Engagement Score',
      value: '78',
      change: 2.8,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  )
}
