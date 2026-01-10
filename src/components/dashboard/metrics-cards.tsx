'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Mail, MousePointerClick, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  delay?: number
}

function MetricCard({ title, value, change, icon, delay = 0 }: MetricCardProps) {
  const isPositive = change >= 0

  return (
    <Card
      className="bg-white border border-gray-100 shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="p-2.5 bg-[#083E33]/5 rounded-xl group-hover:bg-[#083E33]/10 transition-colors">
            {icon}
          </div>
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full',
              isPositive
                ? 'text-emerald-700 bg-emerald-50'
                : 'text-red-700 bg-red-50'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-heading font-bold text-[#083E33] tracking-tight">
            {value}
          </p>
          <p className="text-sm text-gray-500 mt-1 font-medium">{title}</p>
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
      icon: <Mail className="h-5 w-5 text-[#083E33]" />,
    },
    {
      title: 'Click Rate',
      value: '3.2%',
      change: -1.1,
      icon: <MousePointerClick className="h-5 w-5 text-[#083E33]" />,
    },
    {
      title: 'Total Contacts',
      value: '2,847',
      change: 12.5,
      icon: <Users className="h-5 w-5 text-[#083E33]" />,
    },
    {
      title: 'Engagement Score',
      value: '78',
      change: 2.8,
      icon: <Zap className="h-5 w-5 text-[#D4AF37]" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.title}
          {...metric}
          delay={index * 100}
        />
      ))}
    </div>
  )
}
