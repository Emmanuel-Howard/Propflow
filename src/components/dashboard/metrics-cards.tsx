'use client'

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
    <div className="py-4">
      <p className="text-label text-black/50 uppercase tracking-wider text-xs">
        {title}
      </p>
      <div className="mt-1 flex items-end justify-between">
        <p className="text-3xl font-semibold text-black tabular-nums">
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
    </div>
  )
}

export function MetricsCards() {
  const metrics = [
    { title: 'Open Rate', value: '24.8%', change: 4.2 },
    { title: 'Click Rate', value: '3.2%', change: -1.1 },
    { title: 'Total Contacts', value: '2,847', change: 12.5 },
    { title: 'Engagement', value: '78', change: 2.8 },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 border-b border-[#E0E0E0] pb-6">
      {metrics.map((metric, index) => (
        <div
          key={metric.title}
          className={cn(
            index < metrics.length - 1 && 'lg:border-r lg:border-[#E0E0E0] lg:pr-8'
          )}
        >
          <MetricCard {...metric} />
        </div>
      ))}
    </div>
  )
}
