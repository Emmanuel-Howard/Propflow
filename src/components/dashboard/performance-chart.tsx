'use client'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-h3 text-black">Performance Trends</h3>
          <p className="text-muted-sm mt-1">Monthly engagement overview</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-[2px] bg-black" />
            <span className="text-sm text-black/60">Opens</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-[2px] bg-[#D4AF37]" />
            <span className="text-sm text-black/60">Clicks</span>
          </div>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000000" stopOpacity={0.08} />
              <stop offset="95%" stopColor="#000000" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#999"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            stroke="#999"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ stroke: '#E0E0E0', strokeWidth: 1 }}
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
    </div>
  )
}
