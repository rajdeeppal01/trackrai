import { useMemo } from 'react'
import { useApplications } from '../hooks/useApplications'
import { generateInsights, INSIGHT_STYLES } from '../utils/insightEngine'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu, Sparkles, Brain, TrendingUp, Target, Lightbulb,
  CheckCircle, AlertCircle, BookOpen, MessageSquare, Zap
} from 'lucide-react'
import { InsightSkeleton } from '../components/ui/Skeletons'

function InsightCard({ insight, index }) {
  const style = INSIGHT_STYLES[insight.type] || INSIGHT_STYLES.stat
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`glass rounded-2xl p-5 border ${style.border} hover:scale-[1.01] transition-transform duration-200`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-2xl ${style.iconBg} flex items-center justify-center flex-shrink-0 text-xl`}>
          {insight.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="font-semibold text-white">{insight.title}</p>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${style.badge}`}>
              {style.badgeLabel}
            </span>
          </div>
          <p className="text-sm text-white/50 leading-relaxed">{insight.body}</p>
        </div>
      </div>
    </motion.div>
  )
}

function TipCard({ icon: Icon, title, body, color, border }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass rounded-2xl p-5 border ${border}`}
    >
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon size={18} className="text-white" />
      </div>
      <h3 className="font-semibold text-white mb-1 text-sm">{title}</h3>
      <p className="text-xs text-white/45 leading-relaxed">{body}</p>
    </motion.div>
  )
}

export default function AICopilot() {
  const { applications, loading } = useApplications()
  const insights = useMemo(() => generateInsights(applications), [applications])

  const tips = [
    {
      icon: Target,
      title: 'Optimize Your Resume per Role',
      body: 'Tailor your resume keywords to match each job description. ATS systems scan for exact matches — generic resumes get filtered out.',
      color: 'bg-indigo-500/80',
      border: 'border-indigo-500/20',
    },
    {
      icon: MessageSquare,
      title: 'Follow Up After 7 Days',
      body: 'Send a short, polite follow-up email one week after applying. Candidates who follow up are 2× more likely to get a response.',
      color: 'bg-purple-500/80',
      border: 'border-purple-500/20',
    },
    {
      icon: BookOpen,
      title: 'Research Before Interviews',
      body: 'Read recent news about the company, understand their product, and prepare questions. Interviewers can tell who has done their homework.',
      color: 'bg-cyan-500/80',
      border: 'border-cyan-500/20',
    },
    {
      icon: Zap,
      title: 'Apply in Bulk, Iterate Fast',
      body: 'The first 10 applications are your calibration period. Track response patterns to learn what works — then double down.',
      color: 'bg-yellow-500/80',
      border: 'border-yellow-500/20',
    },
    {
      icon: Brain,
      title: 'Use STAR Method for Answers',
      body: 'Structure behavioral answers with Situation, Task, Action, Result. This keeps answers concise and impactful every time.',
      color: 'bg-emerald-500/80',
      border: 'border-emerald-500/20',
    },
    {
      icon: TrendingUp,
      title: 'Network While Applying',
      body: 'Connect with engineers or employees at target companies on LinkedIn. Internal referrals increase interview chances by 5–10×.',
      color: 'bg-rose-500/80',
      border: 'border-rose-500/20',
    },
  ]

  // Pipeline health score
  const healthScore = useMemo(() => {
    if (!applications.length) return 0
    const weights = { Applied: 1, OA: 2, Interview: 3, HR: 4, Offer: 5, Rejected: 0 }
    const score = applications.reduce((s, a) => s + (weights[a.status] || 0), 0)
    const maxScore = applications.length * 5
    return Math.round((score / maxScore) * 100)
  }, [applications])

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <header>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Cpu size={18} className="text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">AI Copilot</h1>
          </div>
          <p className="text-white/40 text-sm ml-12">Smart recommendations powered by your application data.</p>
        </header>

        {/* Pipeline Health Score */}
        <div className="glass rounded-2xl p-6 border border-indigo-500/15">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                <Sparkles size={18} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="font-bold text-white">Pipeline Health Score</h2>
                <p className="text-xs text-white/35">Based on current application statuses</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold gradient-text">{healthScore}<span className="text-xl text-white/30">/100</span></p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-3 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthScore}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              className={`h-full rounded-full ${
                healthScore >= 60 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
                healthScore >= 30 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                'bg-gradient-to-r from-red-500 to-rose-500'
              }`}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-white/25">Low</span>
            <span className="text-xs text-white/25">
              {healthScore >= 60 ? '🎯 Great momentum' : healthScore >= 30 ? '⚡ Keep pushing' : '🚀 Just getting started'}
            </span>
            <span className="text-xs text-white/25">High</span>
          </div>
        </div>

        {/* Personalized Insights */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={16} className="text-yellow-400" />
            <h2 className="font-bold text-white">Personalized Insights</h2>
            <span className="text-xs text-white/30">— based on your {applications.length} application{applications.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <InsightSkeleton key={i} />)}
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {insights.map((insight, i) => (
                  <InsightCard key={insight.title} insight={insight} index={i} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Job Search Tips */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-emerald-400" />
            <h2 className="font-bold text-white">Job Search Playbook</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((tip) => (
              <TipCard key={tip.title} {...tip} />
            ))}
          </div>
        </section>

        {/* Coming Soon banner */}
        <div className="glass rounded-2xl p-6 border border-purple-500/20 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={22} className="text-purple-400" />
          </div>
          <h3 className="font-bold text-white mb-1">AI Chat Coming Soon</h3>
          <p className="text-sm text-white/40 max-w-sm mx-auto">
            Ask TrackrAI anything — "How do I prepare for a Google interview?" or "Review my resume?" — powered by Gemini.
          </p>
        </div>

      </div>
    </div>
  )
}
