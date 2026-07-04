// Status configuration — single source of truth
export const STATUS_CONFIG = {
  Applied: {
    label: 'Applied',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
    ring: 'ring-blue-500/20',
    pipelineIndex: 0,
  },
  OA: {
    label: 'OA',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/15',
    border: 'border-yellow-500/30',
    dot: 'bg-yellow-400',
    ring: 'ring-yellow-500/20',
    pipelineIndex: 1,
  },
  Interview: {
    label: 'Interview',
    color: 'text-purple-400',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/30',
    dot: 'bg-purple-400',
    ring: 'ring-purple-500/20',
    pipelineIndex: 2,
  },
  HR: {
    label: 'HR Round',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
    border: 'border-cyan-500/30',
    dot: 'bg-cyan-400',
    ring: 'ring-cyan-500/20',
    pipelineIndex: 3,
  },
  Offer: {
    label: 'Offer 🎉',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-500/20',
    pipelineIndex: 4,
  },
  Rejected: {
    label: 'Rejected',
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
    ring: 'ring-red-500/20',
    pipelineIndex: -1,
  },
}

export const PIPELINE_STAGES = ['Applied', 'OA', 'Interview', 'HR', 'Offer']
export const ALL_STATUSES = Object.keys(STATUS_CONFIG)

export function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG['Applied']
}
