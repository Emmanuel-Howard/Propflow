'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

// Sample data - TODO: Replace with real data
const chartData = [
  { date: 'Jan', opens: 186, clicks: 24 },
  { date: 'Feb', opens: 305, clicks: 41 },
  { date: 'Mar', opens: 237, clicks: 32 },
  { date: 'Apr', opens: 273, clicks: 38 },
  { date: 'May', opens: 209, clicks: 28 },
  { date: 'Jun', opens: 314, clicks: 45 },
]

const chartConfig = {
  opens: {
    label: 'Opens',
    color: '#083E33',
  },
  clicks: {
    label: 'Clicks',
    color: '#D4AF37',
  },
} satisfies ChartConfig

export function PerformanceChart() {
  return (
    <Card className="bg-white border border-gray-100 shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading font-semibold text-[#083E33]">
          Performance Trends
        </CardTitle>
        <p className="text-sm text-gray-500">Monthly email engagement overview</p>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#083E33" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#083E33" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="opens"
              stroke="#083E33"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOpens)"
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#D4AF37"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorClicks)"
            />
          </AreaChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#083E33]" />
            <span className="text-sm text-gray-600">Opens</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
            <span className="text-sm text-gray-600">Clicks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
