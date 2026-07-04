import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { groupByMonth } from '../../utils/formatters'
import { ChartSkeleton } from '../ui/Skeletons'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl px-4 py-2.5 shadow-xl">
        <p className="text-xs text-white/50 mb-1">{label}</p>
        <p className="text-lg font-bold text-brand-400">
          {payload[0].value}{' '}
          <span className="text-xs font-normal text-white/40">application{payload[0].value !== 1 ? 's' : ''}</span>
        </p>
      </div>
    )
  }
  return null
}

export default function ApplicationChart({ applications, loading }) {
  const chartData = useMemo(() => groupByMonth(applications, 6), [applications])

  const total = chartData.reduce((s, d) => s + d.count, 0)
  const peak = chartData.reduce((max, d) => (d.count > max.count ? d : max), chartData[0] || { month: '—', count: 0 })

  if (loading) return <ChartSkeleton />

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <TrendingUp size={14} className="text-brand-400" />
            </div>
            <h3 className="font-semibold text-white">Applications Over Time</h3>
          </div>
          <p className="text-xs text-white/30 mt-1 ml-9">Last 6 months</p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-white">{total}</p>
          <p className="text-xs text-white/30">
            Peak: {peak.month} ({peak.count})
          </p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="month"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99,102,241,0.3)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#chartGrad)"
              dot={{ fill: '#818cf8', strokeWidth: 2, r: 3 }}
              activeDot={{ fill: '#818cf8', strokeWidth: 2, r: 5, stroke: 'rgba(129,140,248,0.3)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Month dots summary */}
      <div className="flex justify-between mt-4 pt-4 border-t border-white/5">
        {chartData.map((d) => (
          <div key={d.month} className="flex flex-col items-center gap-1">
            <span className="text-sm font-bold text-white">{d.count}</span>
            <div
              className={`w-1.5 h-1.5 rounded-full ${d.count > 0 ? 'bg-brand-400' : 'bg-white/15'}`}
            />
            <span className="text-[10px] text-white/30">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
