import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Target, Star, ArrowUpRight } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import { formatDate } from '../../utils/formatters'

const UPCOMING_STATUSES = ['Interview', 'HR', 'OA', 'Offer']

export default function UpcomingSection({ applications, loading, onEdit }) {
 const upcoming = applications
 .filter((a) => UPCOMING_STATUSES.includes(a.status))
 .sort((a, b) => {
 // Sort by pipeline priority
 const priority = { Offer: 0, HR: 1, Interview: 2, OA: 3 }
 return (priority[a.status] ?? 99) - (priority[b.status] ?? 99)
 })
 .slice(0, 5)

 return (
 <div className="glass rounded-2xl p-5">
 <div className="flex items-center gap-2 mb-5">
 <div className="w-7 h-7 rounded-2xl bg-purple-500/10 flex items-center justify-center">
 <Target size={14} className="text-purple-400" />
 </div>
 <div>
 <h3 className="font-semibold text-white text-sm">Upcoming</h3>
 <p className="text-[10px] text-white/30">Active pipeline stages</p>
 </div>
 </div>

 {loading ? (
 <div className="space-y-3">
 {[1, 2, 3].map((i) => (
 <div key={i} className="skeleton h-14 rounded-3xl" />
 ))}
 </div>
 ) : upcoming.length === 0 ? (
 <div className="flex flex-col items-center py-8 text-center">
 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
 <Calendar size={20} className="text-white/20" />
 </div>
 <p className="text-sm text-white/40">No active stages</p>
 <p className="text-xs text-white/25 mt-1">
 Applications in Interview, HR, OA, or Offer stage appear here
 </p>
 </div>
 ) : (
 <div className="space-y-2">
 <AnimatePresence>
 {upcoming.map((app, i) => (
 <motion.div
 key={app.id}
 initial={{ opacity: 0, x: -8 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: 8 }}
 transition={{ delay: i * 0.05 }}
 onClick={() => onEdit(app)}
 className="flex items-center gap-3 p-3 rounded-3xl bg-white/3 hover:bg-white/6 hover: cursor-pointer transition-all duration-200 group"
 >
 {/* Status icon */}
 <div className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 ${
 app.status === 'Offer' ? 'bg-emerald-500/15' :
 app.status === 'HR' ? 'bg-cyan-500/15' :
 app.status === 'Interview' ? 'bg-purple-500/15' :
 'bg-yellow-500/15'
 }`}>
 <Star size={14} className={
 app.status === 'Offer' ? 'text-emerald-400' :
 app.status === 'HR' ? 'text-cyan-400' :
 app.status === 'Interview' ? 'text-purple-400' :
 'text-yellow-400'
 } />
 </div>

 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-white truncate">{app.company}</p>
 <p className="text-xs text-white/40 truncate">{app.role}</p>
 {app.applied_date && (
 <p className="text-[10px] text-white/25 mt-0.5">Applied {formatDate(app.applied_date)}</p>
 )}
 </div>

 <div className="flex items-center gap-2">
 <StatusBadge status={app.status} size="sm" />
 <ArrowUpRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
 </div>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 )}
 </div>
 )
}
