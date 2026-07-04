/**
 * Skeleton loaders — reusable shimmer placeholders
 */

// Single skeleton line
export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton h-4 rounded-lg ${className}`} />
}

// Skeleton for a stat card
export function StatCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-20 h-3" />
          <SkeletonLine className="w-12 h-8" />
          <SkeletonLine className="w-24 h-3" />
        </div>
        <div className="skeleton w-10 h-10 rounded-xl" />
      </div>
    </div>
  )
}

// Skeleton for an application card
export function ApplicationCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <SkeletonLine className="w-32 h-5" />
          <SkeletonLine className="w-48 h-4" />
        </div>
        <SkeletonLine className="w-20 h-6 rounded-full" />
      </div>
      <div className="skeleton h-1.5 rounded-full" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <SkeletonLine key={i} className="w-16 h-6 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

// Skeleton for insight card
export function InsightSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <SkeletonLine className="w-32 h-4" />
      </div>
      <SkeletonLine className="w-full h-3" />
      <SkeletonLine className="w-4/5 h-3" />
    </div>
  )
}

// Skeleton for the chart area
export function ChartSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <SkeletonLine className="w-40 h-5" />
      <div className="flex items-end gap-3 h-40 mt-4">
        {[60, 40, 80, 55, 70, 45].map((h, i) => (
          <div
            key={i}
            className="skeleton flex-1 rounded-t-lg"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  )
}
