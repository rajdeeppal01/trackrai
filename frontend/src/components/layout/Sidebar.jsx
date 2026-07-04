import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, BarChart2, Cpu,
  Settings, KanbanSquare, X,
} from 'lucide-react'

const NAV_ITEMS = [
  { path: '/',            label: 'Dashboard',    icon: LayoutDashboard },
  { path: '/applications',label: 'Applications', icon: Briefcase       },
  { path: '/pipeline',    label: 'Pipeline',     icon: KanbanSquare    },
  { path: '/analytics',   label: 'Analytics',    icon: BarChart2       },
  { path: '/copilot',     label: 'AI Copilot',   icon: Cpu             },
  { path: '/settings',    label: 'Settings',     icon: Settings        },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const content = (
    <aside className="w-64 h-full bg-[#080820] border-r border-white/8 flex flex-col shrink-0">
      {/* Brand */}
      <div className="flex items-center justify-between p-6">
        <Link
          to="/"
          onClick={onClose}
          className="block hover:opacity-80 transition-opacity duration-200"
        >
          <h1 className="text-2xl font-bold gradient-text">TrackrAI</h1>
        </Link>
        {/* Close button — only shown in mobile drawer */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all md:hidden"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/60 text-white shadow-lg shadow-indigo-900/30 border border-indigo-500/20'
                  : 'text-white/40 hover:text-white hover:bg-white/6'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-white' : 'text-white/40'} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className="p-4">
        <div className="flex items-center gap-3 glass rounded-2xl p-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            RP
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">Rajdeep Pal</p>
            <p className="text-[11px] text-indigo-400">Premium User</p>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden md:flex h-screen">{content}</div>

      {/* Mobile: drawer overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 h-full md:hidden">
            {content}
          </div>
        </>
      )}
    </>
  )
}