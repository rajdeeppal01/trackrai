"use client";

import { useMemo } from 'react'
import { useApplications } from '../../hooks/useApplications'
import {
 BarChart, Bar, AreaChart, Area,
 XAxis, YAxis, CartesianGrid, Tooltip,
 ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts'
import { groupByMonth } from '../../utils/formatters'
import { ALL_STATUSES } from '../../utils/statusConfig'
import { TrendingUp, Target, Trophy, XCircle, BarChart2, Zap, ArrowRight } from 'lucide-react'
import { differenceInDays, parseISO, isValid, format, subDays } from 'date-fns'
import { StatCardSkeleton } from '../../components/ui/Skeletons'

const STATUS_COLORS = {
 Applied: '#60a5fa',
 OA: '#facc15',
 Interview:'#a78bfa',
 HR: '#22d3ee',
 Offer: '#34d399',
 Rejected: '#f87171',
}

function CustomTooltip({ active, payload, label }) {
 if (!active || !payload?.length) return null
 return (
 <div className="glass-strong rounded-3xl px-3 py-2 shadow-xl text-xs">
 <p className="font-semibold text-white mb-1">{label}</p>
 {payload.map(p => (
 <p key={p.name} style={{ color: p.color || p.fill }}>
 {p.name}: <span className="font-bold">{p.value}</span>
 </p>
 ))}
 </div>
 )
}

export default function Analytics() {
 const { applications, loading } = useApplications()

 const stats = useMemo(() => {
 const total = applications.length
 const offers = applications.filter(a => a.status === 'Offer').length
 const rejected = applications.filter(a => a.status === 'Rejected').length
 const responded = applications.filter(a => ['OA', 'Interview', 'HR', 'Offer'].includes(a.status)).length
 const active = applications.filter(a => ['Applied', 'OA', 'Interview', 'HR'].includes(a.status)).length

 // Average days to first response
 const responseTimes = applications
 .filter(a => a.status !== 'Applied' && a.applied_date)
 .map(a => {
 const start = parseISO(a.applied_date)
 const end = parseISO(a.updated_at || a.created_at)
 return isValid(start) && isValid(end) ? differenceInDays(end, start) : null
 })
 .filter(n => n !== null && n >= 0)
 const avgResponse = responseTimes.length
 ? Math.round(responseTimes.reduce((s, n) => s + n, 0) / responseTimes.length)
 : null

 return { total, offers, rejected, responded, active, avgResponse }
 }, [applications])

 // Status funnel data
 const funnelData = useMemo(() =>
 ALL_STATUSES.map(s => ({
 status: s,
 count: applications.filter(a => a.status === s).length,
 color: STATUS_COLORS[s],
 })).filter(d => d.count > 0),
 [applications]
 )

 // Applications per month (last 6)
 const monthlyData = useMemo(() => groupByMonth(applications, 6), [applications])

 // Daily applications last 14 days
 const dailyData = useMemo(() => {
 const days = []
 for (let i = 13; i >= 0; i--) {
 const day = subDays(new Date(), i)
 const label = format(day, 'MMM d')
 const dayStr = format(day, 'yyyy-MM-dd')
 const count = applications.filter(a => {
 const d = a.applied_date || (a.created_at ? a.created_at.split('T')[0] : null)
 return d === dayStr
 }).length
 days.push({ day: label, count })
 }
 return days
 }, [applications])

 // Pipeline stage distribution (pie)
 const pieData = useMemo(() =>
 funnelData.map(d => ({ name: d.status, value: d.count, fill: d.color })),
 [funnelData]
 )

 if (loading) {
 return (
 <div className="min-h-screen p-4 md:p-8">
 <div className="max-w-7xl mx-auto space-y-8">
 <div className="skeleton h-10 w-64 rounded-3xl" />
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <div className="skeleton h-64 rounded-2xl" />
 <div className="skeleton h-64 rounded-2xl" />
 </div>
 </div>
 </div>
 )
 }

 return (
 <div className="min-h-screen p-4 md:p-8 font-sans">
 <div className="max-w-7xl mx-auto space-y-8">

 {/* Header */}
 <header>
 <div className="flex items-center gap-3 mb-1">
 <div className="w-9 h-9 rounded-3xl bg-indigo-500/15 flex items-center justify-center">
 <BarChart2 size={18} className="text-indigo-400" />
 </div>
 <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
 </div>
 <p className="text-white/40 text-sm ml-12">Deep insights into your job search performance.</p>
 </header>

 {/* Key metrics */}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
 {[
 { label: 'Total Applied', value: stats.total, icon: <BarChart2 size={16} />, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
 { label: 'Active', value: stats.active, icon: <Zap size={16} />, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
 { label: 'Responded', value: stats.responded, icon: <TrendingUp size={16} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
 {
 label: 'Response Rate',
 value: stats.total > 0 ? `${((stats.responded / stats.total) * 100).toFixed(0)}%` : '—',
 icon: <Target size={16} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10'
 },
 { label: 'Offers', value: stats.offers, icon: <Trophy size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
 {
 label: 'Avg Response',
 value: stats.avgResponse !== null ? `${stats.avgResponse}d` : '—',
 icon: <XCircle size={16} />, color: 'text-red-400', bg: 'bg-red-500/10'
 },
 ].map(({ label, value, icon, color, bg }) => (
 <div key={label} className="glass rounded-2xl p-4">
 <div className={`w-8 h-8 rounded-3xl ${bg} ${color} flex items-center justify-center mb-3`}>
 {icon}
 </div>
 <p className="text-2xl font-bold text-white">{value}</p>
 <p className="text-xs text-white/40 mt-0.5">{label}</p>
 </div>
 ))}
 </div>

 {/* Charts row 1 */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Monthly trend */}
 <div className="lg:col-span-2 glass rounded-2xl p-6">
 <h2 className="text-base font-semibold text-white mb-1">Monthly Applications</h2>
 <p className="text-xs text-white/35 mb-4">Applications submitted per month (last 6 months)</p>
 <ResponsiveContainer width="100%" height={200}>
 <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
 <defs>
 <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
 <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
 <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
 <Tooltip content={<CustomTooltip />} />
 <Area type="monotone" dataKey="count" name="Applications" stroke="#6366f1" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: '#6366f1', r: 3 }} />
 </AreaChart>
 </ResponsiveContainer>
 </div>

 {/* Pie chart */}
 <div className="glass rounded-2xl p-6">
 <h2 className="text-base font-semibold text-white mb-1">Status Distribution</h2>
 <p className="text-xs text-white/35 mb-2">Current breakdown of all applications</p>
 {pieData.length > 0 ? (
 <ResponsiveContainer width="100%" height={200}>
 <PieChart>
 <Pie
 data={pieData}
 dataKey="value"
 nameKey="name"
 cx="50%"
 cy="50%"
 outerRadius={70}
 innerRadius={40}
 strokeWidth={0}
 >
 {pieData.map((entry, i) => (
 <Cell key={i} fill={entry.fill} />
 ))}
 </Pie>
 <Tooltip content={<CustomTooltip />} />
 <Legend
 iconType="circle"
 iconSize={8}
 formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{value}</span>}
 />
 </PieChart>
 </ResponsiveContainer>
 ) : (
 <div className="flex items-center justify-center h-48 text-white/25 text-sm">No data yet</div>
 )}
 </div>
 </div>

 {/* Custom Sankey Funnel Diagram */}
 <div className="glass rounded-2xl p-6 relative overflow-hidden">
 <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
 <Target size={120} />
 </div>
 <h2 className="text-xl font-bold text-white mb-2">Job Search Funnel</h2>
 <p className="text-sm text-white/40 mb-8">Conversion rates across your application pipeline.</p>
 
 <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-2 w-full mt-4">
 {funnelData.map((stage, i) => {
 const nextStage = funnelData[i + 1]
 const dropOff = nextStage ? ((nextStage.count / stage.count) * 100).toFixed(0) : null
 const hasData = stage.count > 0

 return (
 <div key={stage.status} className="flex-1 flex flex-col md:flex-row items-center">
 
 {/* Stage Card */}
 <div 
 className="flex-1 w-full bg-white/5 rounded-3xl p-4 flex flex-col items-center justify-center relative shadow-lg transition-transform hover:-translate-y-1"
 style={{ 
 borderTopColor: hasData ? stage.color : 'rgba(255,255,255,0.1)',
 borderTopWidth: '4px' 
 }}
 >
 <span className="text-3xl font-black mb-1" style={{ color: hasData ? stage.color : 'rgba(255,255,255,0.2)' }}>
 {stage.count}
 </span>
 <span className="text-xs font-semibold uppercase tracking-wider text-white/50">{stage.status}</span>
 </div>

 {/* Connector / Conversion Rate */}
 {i < funnelData.length - 1 && (
 <div className="flex flex-col items-center justify-center w-full md:w-20 my-2 md:my-0 relative">
 <div className="hidden md:block absolute w-full h-[2px] bg-gradient-to-r from-white/20 to-white/5 top-1/2 -translate-y-1/2 -z-10" />
 <div className="md:hidden absolute h-full w-[2px] bg-gradient-to-b from-white/20 to-white/5 left-1/2 -translate-x-1/2 -z-10" />
 
 {stage.count > 0 && nextStage && nextStage.count > 0 ? (
 <div className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
 {dropOff}% <ArrowRight size={10} className="hidden md:block" />
 </div>
 ) : (
 <div className="w-2 h-2 rounded-full bg-white/10" />
 )}
 </div>
 )}
 </div>
 )
 })}
 </div>
 </div>

 {/* Charts row 2 */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Daily last 14 days */}
 <div className="glass rounded-2xl p-6">
 <h2 className="text-base font-semibold text-white mb-1">Daily Activity (Last 14 Days)</h2>
 <p className="text-xs text-white/35 mb-4">Applications added per day</p>
 <ResponsiveContainer width="100%" height={180}>
 <BarChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
 <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
 <Tooltip content={<CustomTooltip />} />
 <Bar dataKey="count" name="Added" radius={[4, 4, 0, 0]}>
 {dailyData.map((_, i) => (
 <Cell key={i} fill={`rgba(99,102,241,${0.4 + (i / dailyData.length) * 0.6})`} />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>

 {/* Status bar chart */}
 <div className="glass rounded-2xl p-6">
 <h2 className="text-base font-semibold text-white mb-1">Applications by Status</h2>
 <p className="text-xs text-white/35 mb-4">Count of applications in each pipeline stage</p>
 <ResponsiveContainer width="100%" height={180}>
 <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
 <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
 <YAxis type="category" dataKey="status" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
 <Tooltip content={<CustomTooltip />} />
 <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
 {funnelData.map((entry, i) => (
 <Cell key={i} fill={entry.color} />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 </div>
 </div>
 )
}
