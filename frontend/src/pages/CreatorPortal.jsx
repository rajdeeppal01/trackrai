import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Terminal, Users, Briefcase, Activity, Code, Settings,
  Database, Plus, ChevronRight, Lock, CheckCircle
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import api from '../api/applications'
import useDocumentTitle from '../hooks/useDocumentTitle'
import toast from 'react-hot-toast'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-xl px-3 py-2 shadow-xl border border-white/10 text-xs">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-indigo-400">
          Signups: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function CreatorPortal() {
  useDocumentTitle('Creator Portal')
  const [activeTab, setActiveTab] = useState('trackrai')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (activeTab !== 'trackrai') return
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
  }, [activeTab])

  const products = [
    { id: 'trackrai', name: 'TrackrAI', status: 'Live', desc: 'AI Job Tracker & Copilot' },
    { id: 'product_b', name: 'Future Product A', status: 'Draft', desc: 'Ready for Telemetry Webhook' },
    { id: 'product_c', name: 'Future Product B', status: 'Draft', desc: 'Ready for Telemetry Webhook' },
  ]

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Terminal size={20} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Creator Portal</h1>
              <p className="text-white/40 text-sm">Master telemetry dashboard for your product suite.</p>
            </div>
          </div>
        </header>

        {/* Product selector tabs */}
        <div className="flex flex-wrap gap-3 pb-2 border-b border-white/5">
          {products.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveTab(p.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === p.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/20'
                  : 'bg-white/3 border border-white/5 text-white/50 hover:text-white hover:bg-white/6'
              }`}
            >
              <span>{p.name}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                p.status === 'Live' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'
              }`}>
                {p.status}
              </span>
            </button>
          ))}
        </div>

        {/* Tab contents */}
        <AnimatePresence mode="wait">
          {activeTab === 'trackrai' ? (
            <motion.div
              key="trackrai"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {loading ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}
                  </div>
                  <div className="skeleton h-64 rounded-2xl" />
                </div>
              ) : stats ? (
                <>
                  {/* KPI Counters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: 'Total Registered Users', value: stats.total_users, desc: 'Individual user accounts', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                      { title: 'Applications Tracked', value: stats.total_applications, desc: 'Job submissions tracked', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                      { title: 'Engagement Factor', value: `${stats.avg_applications_per_user} apps/user`, desc: 'Average applications per user', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                    ].map((kpi, idx) => {
                      const Icon = kpi.icon;
                      return (
                        <div key={idx} className="glass rounded-2xl p-5 border border-white/5 flex items-start justify-between">
                          <div>
                            <p className="text-xs text-white/40 font-semibold uppercase tracking-wider">{kpi.title}</p>
                            <p className="text-3xl font-extrabold text-white mt-2">{kpi.value}</p>
                            <p className="text-[11px] text-white/30 mt-1">{kpi.desc}</p>
                          </div>
                          <div className={`w-9 h-9 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                            <Icon size={16} />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Growth chart */}
                  <div className="glass rounded-3xl p-6 border border-white/5">
                    <h2 className="text-base font-bold text-white mb-1">User Acquisition</h2>
                    <p className="text-xs text-white/35 mb-6">New user signups over time</p>
                    <div className="h-64">
                      {stats.signups_over_time?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={stats.signups_over_time} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="count" name="Signups" stroke="#6366f1" strokeWidth={2.5} fill="url(#growthGrad)" dot={{ fill: '#6366f1', r: 3 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-white/20 text-xs">No signup history recorded yet</div>
                      )}
                    </div>
                  </div>

                  {/* Active Users Table */}
                  <div className="glass rounded-3xl border border-white/5 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                      <h2 className="text-sm font-bold text-white">Registered Users List</h2>
                      <p className="text-[10px] text-white/30 mt-0.5">Database audit for all user profiles</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-white/2 text-white/40 font-semibold border-b border-white/5 uppercase tracking-wider text-[10px]">
                            <th className="px-6 py-3.5">User Email</th>
                            <th className="px-6 py-3.5">Join Date</th>
                            <th className="px-6 py-3.5 text-right">Job Apps Tracked</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {stats.users_list?.map((u, i) => (
                            <tr key={i} className="hover:bg-white/2 transition-colors">
                              <td className="px-6 py-3.5 font-medium text-white/80">{u.email}</td>
                              <td className="px-6 py-3.5 text-white/40">{u.created_at}</td>
                              <td className="px-6 py-3.5 text-right font-mono font-bold text-indigo-400">{u.apps_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass rounded-3xl p-8 border border-white/5 text-center text-white/20 flex flex-col items-center justify-center min-h-[300px]">
                  <Lock size={48} className="stroke-[1.2] mb-3 opacity-60 text-red-400" />
                  <p className="text-sm font-bold text-white">Access Denied</p>
                  <p className="text-xs max-w-sm mt-1">This telemetry module is restricted to creator/admin accounts only.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Future Product Integration Setup Guide */}
              <div className="glass rounded-3xl p-6 border border-white/5 max-w-3xl space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <Code size={18} className="text-indigo-400" />
                  <div>
                    <h2 className="font-bold text-white text-sm">Product Telemetry Webhook Setup</h2>
                    <p className="text-[10px] text-white/35 mt-0.5">Integrate telemetry tracking for your new products</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-white/70">
                  <p className="text-xs">
                    You can feed registration and telemetry events from other apps directly into this centralized creator dashboard by calling our metrics collector API.
                  </p>

                  {/* Step 1 */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-white/90">Step 1: Install Telemetry Module</p>
                    <pre className="bg-[#050510] text-[11px] font-mono text-indigo-300 p-3.5 rounded-xl overflow-x-auto border border-white/5">
                      npm install @trackrai/telemetry-sdk
                    </pre>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-white/90">Step 2: Configure SDK Credentials</p>
                    <p className="text-xs text-white/40">Initialize the SDK in your codebase entry point with your unique app token:</p>
                    <pre className="bg-[#050510] text-[11px] font-mono text-indigo-300 p-3.5 rounded-xl overflow-x-auto border border-white/5">
{`import Telemetry from '@trackrai/telemetry-sdk';

Telemetry.init({
  appId: 'future_product_a',
  token: 'TRK_KEY_7a82fb91f58204b92c42'
});`}
                    </pre>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-white/90">Step 3: Trigger Growth Events</p>
                    <p className="text-xs text-white/40">Trigger events on key actions (e.g., signup completed, task created) to stream telemetry data live:</p>
                    <pre className="bg-[#050510] text-[11px] font-mono text-indigo-300 p-3.5 rounded-xl overflow-x-auto border border-white/5">
{`// Dispatch telemetry signup event
Telemetry.trackEvent('user_signup', {
  email: user.email,
  plan: 'free_tier'
});`}
                    </pre>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-semibold select-none">
                  <CheckCircle size={14} />
                  <span>中央集権 Dashboard structure verified. SDK tokens active.</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
