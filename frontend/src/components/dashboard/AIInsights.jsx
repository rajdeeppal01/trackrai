import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { generateInsights, INSIGHT_STYLES } from '../../utils/insightEngine'
import { InsightSkeleton } from '../ui/Skeletons'
import { useMemo } from 'react'

export default function AIInsights({ applications, loading }) {
 const insights = useMemo(() => generateInsights(applications), [applications])

 if (loading) {
 return (
 <div className="space-y-3">
 <InsightHeader />
 {[1, 2, 3].map((i) => (<InsightSkeleton key={i} />))}
 </div>
 )
 }

 return (
 <div className="space-y-3">
 <InsightHeader count={insights.length} />
 <AnimatePresence>
 {insights.map((insight, i) => (
 <InsightCard key={insight.title} insight={insight} index={i} />
 ))}
 </AnimatePresence>
 </div>
 )
}

function InsightHeader({ count }) {
 return (
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-7 h-7 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center">
 <Sparkles size={14} className="text-brand-400" />
 </div>
 <div>
 <h3 className="font-semibold text-white text-sm">AI Insights</h3>
 {count !== undefined && (
 <p className="text-[10px] text-white/30">{count} active insight{count !== 1 ? 's' : ''}</p>
 )}
 </div>
 </div>
 </div>
 )
}

function InsightCard({ insight, index }) {
 const style = INSIGHT_STYLES[insight.type] || INSIGHT_STYLES.stat
 return (
 <motion.div
 initial={{ opacity: 0, x: -8 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: index * 0.05 }}
 className={`glass rounded-2xl p-4 border ${style.border} hover:border-opacity-50 transition-all duration-300`}
 >
 <div className="flex items-start gap-3">
 <div className={`w-9 h-9 rounded-3xl ${style.iconBg} flex items-center justify-center flex-shrink-0 text-lg`}>
 {insight.icon}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <p className="text-sm font-semibold text-white leading-tight">{insight.title}</p>
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.badge}`}>
 {style.badgeLabel}
 </span>
 </div>
 <p className="text-xs text-white/45 leading-relaxed">{insight.body}</p>
 </div>
 </div>
 </motion.div>
 )
}