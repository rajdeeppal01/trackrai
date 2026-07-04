import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../ui/GlassCard";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function ActivityChart({ applications }) {
  const monthlyCounts = new Array(12).fill(0);

  applications.forEach((app) => {
    if (!app.applied_date) return;

    const month = new Date(app.applied_date).getMonth();
    monthlyCounts[month]++;
  });

  const data = months.map((month, index) => ({
    month,
    applications: monthlyCounts[index],
  }));

  return (
    <Card className="h-[400px]">
      <div className="mb-8">
        <h2 className="text-xl font-semibold">
          Application Activity
        </h2>

        <p className="text-sm text-gray-500">
          Monthly applications
        </p>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="color"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#2563eb"
                stopOpacity={0.4}
              />

              <stop
                offset="95%"
                stopColor="#2563eb"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis dataKey="month" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="applications"
            stroke="#2563eb"
            strokeWidth={3}
            fill="url(#color)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}