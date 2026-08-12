"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
 Terminal, Users, Briefcase, Activity, Target, Lock, Shield
} from 'lucide-react'
import {
 AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import api from '../../api/applications'
import toast from 'react-hot-toast'

function CustomTooltip({ active, payload, label }) {
 if (!active || !payload?.length) return null
 return (
 <div className="glass-strong rounded-3xl px-3 py-2 shadow-xl text-xs space-y-1">
 <p className="font-semibold text-white mb-1">{label}</p>
 {payload.map(p => (
 <p key={p.name} style={{ color: p.color }}>
 {p.name}: <span className="font-bold text-white">{p.value}</span>
 </p>
 ))}
 </div>
 )
}

export default function CreatorPortal() {
 const [stats, setStats] = useState(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 async function fetchStats() {
 setLoading(true)
 try {
 const res = await api.get('/admin/stats')
 setStats(res.data)
 } catch (err) {
 console.error('Failed to fetch admin stats', err)
 const errMsg = err.response?.data?.detail || 'Access denied: You must be the product administrator.'
 toast.error(errMsg)
 } finally {
 setLoading(false)
 }
 }
 fetchStats()
 }, [])

 return (
 <div className="min-h-screen p-4 md:p-8 font-sans">
 <div className="max-w-6xl mx-auto space-y-8">
 
 {/* Header */}
 <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-3xl bg-purple-500/15 flex items-center justify-center">
 <Terminal size={20} className="text-purple-400" />
 </div>
 <div>
 <h1 className="text-3xl font-bold gradient-text">Creator Portal</h1>
 <p className="text-white/40 text-sm">Master telemetry dashboard for TrackrAI.</p>
 </div>
 </div>
 </header>

 {loading ? (
 <div className="space-y-6">
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
 {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
 </div>
 <div className="skeleton h-64 rounded-2xl" />
 </div>
 ) : stats ? (
 <div className="space-y-8">
 
 {/* KPI Counters Grid */}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
 {[
 { title: 'Total Visits', value: stats.total_visits, desc: 'Total page views', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
 { title: 'Unique Visitors', value: stats.unique_visitors, desc: 'Unique IPs logged', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
 { title: 'Total Users', value: stats.total_users, desc: 'Accounts created', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
 { title: 'Premium Users', value: stats.premium_users, desc: 'Upgraded accounts', icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10' },
 { title: 'Apps Tracked', value: stats.total_applications, desc: 'Job roles tracked', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
 { title: 'Engagement', value: `${stats.avg_applications_per_user} apps/u`, desc: 'Avg apps per user', icon: Activity, color: 'text-pink-400', bg: 'bg-pink-500/10' },
 ].map((kpi, idx) => {
 const Icon = kpi.icon;
 return (
 <div key={idx} className="glass rounded-2xl p-4 flex flex-col justify-between h-28">
 <div className="flex items-start justify-between">
 <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{kpi.title}</p>
 <div className={`w-6 h-6 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
 <Icon size={12} />
 </div>
 </div>
 <div>
 <p className="text-xl font-extrabold text-white">{kpi.value}</p>
 <p className="text-[9px] text-white/30 truncate mt-0.5">{kpi.desc}</p>
 </div>
 </div>
 )
 })}
 </div>

 {/* Growth & Traffic chart */}
 <div className="glass rounded-3xl p-6 ">
 <h2 className="text-base font-bold text-white mb-1">User Growth & Web Traffic</h2>
 <p className="text-xs text-white/35 mb-6">Comparison of total signups vs page traffic views</p>
 <div className="h-72">
 {stats.traffic_and_signups?.length > 0 ? (
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={stats.traffic_and_signups} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
 <defs>
 <linearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
 <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
 </linearGradient>
 <linearGradient id="signupsGrad" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
 <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
 <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
 <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
 <Tooltip content={<CustomTooltip />} />
 <Area type="monotone" dataKey="visits" name="Page Traffic" stroke="#10b981" strokeWidth={2} fill="url(#visitsGrad)" dot={{ fill: '#10b981', r: 2.5 }} />
 <Area type="monotone" dataKey="signups" name="User Signups" stroke="#6366f1" strokeWidth={2} fill="url(#signupsGrad)" dot={{ fill: '#6366f1', r: 2.5 }} />
 </AreaChart>
 </ResponsiveContainer>
 ) : (
 <div className="h-full flex items-center justify-center text-white/20 text-xs">No activity recorded yet</div>
 )}
 </div>
 </div>

 {/* Demographics and Organization distributions */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 
 {/* Classification Cards */}
 <div className="glass rounded-3xl p-6 flex flex-col justify-between h-44">
 <div>
 <h3 className="text-sm font-bold text-white mb-0.5">Intern vs Employee Users</h3>
 <p className="text-[10px] text-white/30">User profile classifications</p>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
 <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Interns</p>
 <p className="text-2xl font-black text-white mt-1">{stats.intern_count || 0}</p>
 </div>
 <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/10">
 <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Employees</p>
 <p className="text-2xl font-black text-white mt-1">{stats.employee_count || 0}</p>
 </div>
 </div>
 </div>

 {/* Top Employers Organization List */}
 <div className="glass rounded-3xl p-6 md:col-span-2 flex flex-col justify-between min-h-[11rem]">
 <div>
 <h3 className="text-sm font-bold text-white mb-0.5">Top User Organizations</h3>
 <p className="text-[10px] text-white/30 font-medium">Where your user base currently works/studies</p>
 </div>
 <div className="flex flex-wrap gap-2 mt-3">
 {stats.company_distribution?.length > 0 ? (
 stats.company_distribution.map((dist, idx) => (
 <div key={idx} className="px-3 py-1.5 rounded-3xl bg-white/3 flex items-center gap-2 text-xs">
 <span className="font-semibold text-white/80">{dist.company}</span>
 <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[10px]">{dist.user_count}</span>
 </div>
 ))
 ) : (
 <p className="text-xs text-white/20 italic">No organization data logged yet</p>
 )}
 </div>
 </div>

 </div>

 {/* Active Users Table */}
 <div className="glass rounded-3xl overflow-hidden">
 <div className="px-6 py-4 border-b ">
 <h2 className="text-sm font-bold text-white">Registered Users List</h2>
 <p className="text-[10px] text-white/30 mt-0.5">Database audit for all user profiles</p>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse text-xs">
 <thead>
 <tr className="bg-white/2 text-white/40 font-semibold border-b uppercase tracking-wider text-[10px]">
 <th className="px-6 py-3.5">User Email</th>
 <th className="px-6 py-3.5">Current Role</th>
 <th className="px-6 py-3.5">Company / Org</th>
 <th className="px-6 py-3.5">Join Date</th>
 <th className="px-6 py-3.5 text-right">Job Apps Tracked</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 {stats.users_list?.map((u, i) => (
 <tr key={i} className="hover:bg-white/2 transition-colors">
 <td className="px-6 py-3.5 font-medium text-white/80">{u.email}</td>
 <td className="px-6 py-3.5 text-white/50">{u.current_position || <span className="text-white/20 italic">Not set</span>}</td>
 <td className="px-6 py-3.5 text-white/50">{u.current_company || <span className="text-white/20 italic">Not set</span>}</td>
 <td className="px-6 py-3.5 text-white/40">{u.created_at}</td>
 <td className="px-6 py-3.5 text-right font-mono font-bold text-indigo-400">{u.apps_count}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 ) : (
 <div className="glass rounded-3xl p-8 text-center text-white/20 flex flex-col items-center justify-center min-h-[300px]">
 <Lock size={48} className="stroke-[1.2] mb-3 opacity-60 text-red-400" />
 <p className="text-sm font-bold text-white">Access Denied</p>
 <p className="text-xs max-w-sm mt-1">This telemetry module is restricted to creator/admin accounts only.</p>
 </div>
 )}

 </div>
 </div>
 )
}
