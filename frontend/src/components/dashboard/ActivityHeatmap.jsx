import { useMemo } from 'react';
import { format, startOfDay, addDays, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function ActivityHeatmap({ applications = [] }) {
  const { days, totalCount, streak } = useMemo(() => {
    const map = {};
    let total = 0;
    
    applications.forEach(app => {
      const dateObj = new Date(app.applied_date || app.created_at);
      const dateStr = format(dateObj, 'yyyy-MM-dd');
      map[dateStr] = (map[dateStr] || 0) + 1;
      total++;
    });

    const today = startOfDay(new Date());
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Calculate streak
    let currentStreak = 0;
    for (let i = 0; i < 365; i++) {
      const d = subDays(today, i);
      const dateStr = format(d, 'yyyy-MM-dd');
      if (map[dateStr]) {
        currentStreak++;
      } else if (i !== 0) {
        // Break streak, but ignore if today is empty (since day isn't over)
        break;
      }
    }

    const weeks = 28; // showing about 6.5 months
    const totalDays = weeks * 7;
    const daysArr = [];
    
    // We want the grid to end exactly on the current day's week Saturday.
    // So if today is Wednesday (3), we add (6-3)=3 days to get to Saturday.
    const daysToAlign = 6 - dayOfWeek; 
    const endDate = addDays(today, daysToAlign);

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = subDays(endDate, i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const isFuture = d > today;
      
      daysArr.push({
        date: d,
        dateStr,
        isFuture,
        count: isFuture ? -1 : (map[dateStr] || 0)
      });
    }

    const weeksArr = [];
    for (let i = 0; i < daysArr.length; i += 7) {
      weeksArr.push(daysArr.slice(i, i + 7));
    }

    const monthLabels = [];
    let currentMonth = -1;
    let currentYear = -1;
    weeksArr.forEach((week, index) => {
      const month = week[0].date.getMonth();
      const year = week[0].date.getFullYear();
      if (month !== currentMonth || year !== currentYear) {
        // Only show year if it's the first month shown or January
        const label = (monthLabels.length === 0 || month === 0) 
            ? format(week[0].date, 'MMM yyyy') 
            : format(week[0].date, 'MMM');
            
        // Don't overlap labels if they are too close
        if (monthLabels.length === 0 || index - monthLabels[monthLabels.length - 1].index > 2) {
          monthLabels.push({ index, label });
        }
        currentMonth = month;
        currentYear = year;
      }
    });

    return { days: daysArr, monthLabels, totalCount: total, streak: currentStreak };
  }, [applications]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Application Heatmap</h2>
          <p className="text-sm text-white/50">{totalCount} total applications submitted</p>
        </div>
        {streak >= 3 && (
          <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-full border border-orange-500/20 text-sm font-medium">
            <Flame size={16} className="fill-orange-400" />
            {streak} Day Streak!
          </div>
        )}
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="relative mb-2 h-4 min-w-max">
          {monthLabels.map((m, i) => (
            <span 
              key={i} 
              className="absolute text-[10px] text-white/40 font-medium"
              style={{ left: `calc(${m.index} * (0.875rem + 0.375rem))` }}
            >
              {m.label}
            </span>
          ))}
        </div>
        <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-max">
          {days.map((day, i) => {
            let colorClass = 'bg-white/5 border border-white/5'; // empty
            
            if (day.isFuture) {
              colorClass = 'bg-transparent';
            } else if (day.count === 1) {
              colorClass = 'bg-indigo-500/30 border border-indigo-500/40 shadow-[0_0_8px_rgba(99,102,241,0.2)]';
            } else if (day.count === 2) {
              colorClass = 'bg-indigo-500/60 border border-indigo-500/70 shadow-[0_0_12px_rgba(99,102,241,0.4)]';
            } else if (day.count >= 3) {
              colorClass = 'bg-indigo-500 border border-indigo-400 shadow-[0_0_16px_rgba(99,102,241,0.6)]';
            }

            return (
              <div 
                key={day.dateStr}
                className={`w-3.5 h-3.5 rounded-[3px] transition-all hover:scale-125 hover:z-10 cursor-help ${colorClass}`}
                title={day.isFuture ? null : `${day.count} applications on ${format(day.date, 'MMM d, yyyy')}`}
              />
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-end items-center gap-2 mt-4 text-xs text-white/40 font-medium">
        <span>Less</span>
        <div className="w-3 h-3 rounded-[2px] bg-white/5 border border-white/5" />
        <div className="w-3 h-3 rounded-[2px] bg-indigo-500/30 border border-indigo-500/40" />
        <div className="w-3 h-3 rounded-[2px] bg-indigo-500/60 border border-indigo-500/70" />
        <div className="w-3 h-3 rounded-[2px] bg-indigo-500 border border-indigo-400" />
        <span>More</span>
      </div>
    </motion.div>
  );
}
