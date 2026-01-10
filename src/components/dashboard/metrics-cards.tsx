'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Mail, MousePointerClick, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
}

function MetricCard({ title, value, change, icon }: MetricCardProps) {
  const isPositive = change >= 0

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-slate-800 rounded-lg">{icon}</div>
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              isPositive ? 'text-emerald-400' : 'text-red-400'
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
        <div className="mt-4">
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className="text-sm text-slate-400 mt-1">{title}</p>
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
      icon: <Mail className="h-5 w-5 text-[#d4af37]" />,
    },
    {
      title: 'Click Rate',
      value: '3.2%',
      change: -1.1,
      icon: <MousePointerClick className="h-5 w-5 text-[#d4af37]" />,
    },
    {
      title: 'Total Contacts',
      value: '2,847',
      change: 12.5,
      icon: <Users className="h-5 w-5 text-[#d4af37]" />,
    },
    {
      title: 'Engagement Score',
      value: '78',
      change: 2.8,
      icon: <Zap className="h-5 w-5 text-[#d4af37]" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  )
}
