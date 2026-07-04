import { useMemo } from 'react'
import {
  Briefcase,
  MessageSquare,
  Trophy,
  XCircle,
  TrendingUp,
  Clock,
} from 'lucide-react'
import StatCard from '../ui/StatCard'
import { StatCardSkeleton } from '../ui/Skeletons'
import { isThisMonth, parseISO, isValid } from 'date-fns'

export default function StatsRow({ applications, loading }) {
  const stats = useMemo(() => {
    if (!applications.length) {
      return {
        total: 0,
        interviews: 0,
        offers: 0,
        rejected: 0,
        thisMonth: 0,
        active: 0,
      }
    }

    const total = applications.length
    const interviews = applications.filter((a) =>
      ['Interview', 'HR'].includes(a.status)
    ).length
    const offers = applications.filter((a) => a.status === 'Offer').length
    const rejected = applications.filter((a) => a.status === 'Rejected').length
    const active = applications.filter((a) =>
      ['Applied', 'OA', 'Interview', 'HR'].includes(a.status)
    ).length

    const thisMonth = applications.filter((a) => {
      const d = a.applied_date ? parseISO(a.applied_date) : parseISO(a.created_at)
      return isValid(d) && isThisMonth(d)
    }).length

    return { total, interviews, offers, rejected, thisMonth, active }
  }, [applications])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard
        title="Total"
        value={stats.total}
        icon={Briefcase}
        color="brand"
        subtitle="applications"
      />
      <StatCard
        title="Active"
        value={stats.active}
        icon={TrendingUp}
        color="cyan"
        subtitle="in pipeline"
      />
      <StatCard
        title="Interviews"
        value={stats.interviews}
        icon={MessageSquare}
        color="purple"
        subtitle="active rounds"
      />
      <StatCard
        title="Offers"
        value={stats.offers}
        icon={Trophy}
        color="emerald"
        subtitle={stats.total > 0 ? `${((stats.offers / stats.total) * 100).toFixed(0)}% rate` : 'received'}
      />
      <StatCard
        title="Rejected"
        value={stats.rejected}
        icon={XCircle}
        color="red"
        subtitle="keep going!"
      />
      <StatCard
        title="This Month"
        value={stats.thisMonth}
        icon={Clock}
        color="yellow"
        subtitle="applied"
      />
    </div>
  )
}
