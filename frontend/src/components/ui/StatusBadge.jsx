import { getStatusConfig } from '../../utils/statusConfig'

/**
 * Reusable Status Badge component.
 * Usage: <StatusBadge status="Interview" />
 */
export default function StatusBadge({ status, size = 'md' }) {
  const cfg = getStatusConfig(status)

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
    lg: 'px-4 py-1.5 text-sm gap-2',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border
        ${cfg.color} ${cfg.bg} ${cfg.border}
        ${sizeClasses[size] || sizeClasses.md}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}
