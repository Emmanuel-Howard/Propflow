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
    color: '#000000',
  },
  clicks: {
    label: 'Clicks',
    color: '#D4AF37',
  },
} satisfies ChartConfig

export function PerformanceChart() {
  return (
    <Card className="bg-white border border-neutral-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading text-black">
          Performance Trends
        </CardTitle>
        <p className="text-sm text-neutral-500">Monthly email engagement</p>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#000000" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#A3A3A3"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              stroke="#A3A3A3"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ stroke: '#E5E5E5', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="opens"
              stroke="#000000"
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
        <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-black" />
            <span className="text-sm text-neutral-600">Opens</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[#D4AF37]" />
            <span className="text-sm text-neutral-600">Clicks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
