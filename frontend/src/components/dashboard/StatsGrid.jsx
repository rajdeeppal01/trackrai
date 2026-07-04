import {
  Briefcase,
  CalendarDays,
  Trophy,
  XCircle,
} from "lucide-react";

import StatCard from "./StatCard";

export default function StatsGrid({ applications }) {
  const totalApplications = applications.length;

  const interviews = applications.filter(
    (app) => app.status?.toLowerCase() === "interview"
  ).length;

  const offers = applications.filter(
    (app) => app.status?.toLowerCase() === "offer"
  ).length;

  const rejected = applications.filter(
    (app) => app.status?.toLowerCase() === "rejected"
  ).length;

  const stats = [
    {
      title: "Applications",
      value: totalApplications,
      icon: <Briefcase size={20} />,
      color: "from-blue-500 to-indigo-600",
      change: `${totalApplications} Total`,
    },
    {
      title: "Interviews",
      value: interviews,
      icon: <CalendarDays size={20} />,
      color: "from-emerald-500 to-green-600",
      change: `${interviews} Active`,
    },
    {
      title: "Offers",
      value: offers,
      icon: <Trophy size={20} />,
      color: "from-yellow-500 to-orange-500",
      change: `${offers} Received`,
    },
    {
      title: "Rejected",
      value: rejected,
      icon: <XCircle size={20} />,
      color: "from-red-500 to-rose-600",
      change: `${rejected} Closed`,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}