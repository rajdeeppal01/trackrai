import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * Reusable StatCard for the dashboard stats row.
 */
export default function StatCard({ title, value, icon: Icon, color = 'brand', subtitle, trend }) {
  const colorMap = {
    brand: {
      icon: 'text-brand-400',
      bg: 'bg-brand-500/10',
      glow: 'hover:shadow-brand-500/10',
      border: 'hover:border-brand-500/20',
    },
    emerald: {
      icon: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      glow: 'hover:shadow-emerald-500/10',
      border: 'hover:border-emerald-500/20',
    },
    purple: {
      icon: 'text-purple-400',
      bg: 'bg-purple-500/10',
      glow: 'hover:shadow-purple-500/10',
      border: 'hover:border-purple-500/20',
    },
    red: {
      icon: 'text-red-400',
      bg: 'bg-red-500/10',
      glow: 'hover:shadow-red-500/10',
      border: 'hover:border-red-500/20',
    },
    yellow: {
      icon: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      glow: 'hover:shadow-yellow-500/10',
      border: 'hover:border-yellow-500/20',
    },
    cyan: {
      icon: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      glow: 'hover:shadow-cyan-500/10',
      border: 'hover:border-cyan-500/20',
    },
  }

  const c = colorMap[color] || colorMap.brand

  const TrendIcon =
    trend === undefined || trend === null ? Minus
    : trend > 0 ? TrendingUp
    : TrendingDown

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`glass rounded-2xl p-5 hover:shadow-xl ${c.glow} hover:border-opacity-50 ${c.border} transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-white/40 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
          {Icon && <Icon size={20} className={c.icon} />}
        </div>
      </div>

      {trend !== undefined && trend !== null && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${
          trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-white/30'
        }`}>
          <TrendIcon size={12} />
          <span>{trend > 0 ? `+${trend}` : trend} from last month</span>
        </div>
      )}
    </motion.div>
  )
}
