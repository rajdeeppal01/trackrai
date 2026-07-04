import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Plus, Pencil, Trash2 } from 'lucide-react'
import { formatDistanceToNow, parseISO, isValid } from 'date-fns'
import { getStatusConfig } from '../../utils/statusConfig'

const TYPE_CONFIG = {
  created: { icon: Plus,   color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  updated: { icon: Pencil, color: 'text-indigo-400',  bg: 'bg-indigo-500/10'  },
  deleted: { icon: Trash2, color: 'text-red-400',     bg: 'bg-red-500/10'     },
}

function timeAgo(isoStr) {
  if (!isoStr) return 'just now'
  try {
    const d = parseISO(isoStr)
    if (!isValid(d)) return 'just now'
    return formatDistanceToNow(d, { addSuffix: true })
  } catch {
    return 'just now'
  }
}

export default function ActivityFeed({ activity = [] }) {
  const displayLogs = (activity || []).slice(0, 8)

  return (
    <div className="glass rounded-2xl p-5 h-full">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <Clock size={14} className="text-indigo-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white text-sm">Recent Activity</h3>
          {displayLogs.length > 0 && (
            <p className="text-[10px] text-white/30">{displayLogs.length} recent action{displayLogs.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {displayLogs.length > 0 ? (
            displayLogs.map((log, index) => {
              const typeConf = TYPE_CONFIG[log.type] || TYPE_CONFIG.updated
              const IconComp = typeConf.icon
              const statusConf = log.status ? getStatusConfig(log.status) : null

              return (
                <motion.div
                  key={log.id || index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors duration-200"
                >
                  <div className={`w-7 h-7 rounded-lg ${typeConf.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <IconComp size={12} className={typeConf.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/80 leading-snug line-clamp-2">
                      {log.label || log.message || log.action}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {statusConf && (
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${statusConf.bg} ${statusConf.color}`}>
                          {statusConf.label}
                        </span>
                      )}
                      <span className="text-[10px] text-white/25">
                        {timeAgo(log.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-10 text-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                <Clock size={18} className="text-white/20" />
              </div>
              <p className="text-sm text-white/35">No activity yet</p>
              <p className="text-xs text-white/20 mt-1">Actions will appear here</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}