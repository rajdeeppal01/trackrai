import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, BarChart2, Cpu,
  Settings, KanbanSquare, X, LogOut, Mail, Terminal, Zap, Pencil, Target, FileText
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { path: '/',            label: 'Dashboard',    icon: LayoutDashboard },
  { path: '/applications',label: 'Applications', icon: Briefcase       },
  { path: '/analytics',   label: 'Analytics',    icon: BarChart2       },
  { path: '/copilot',     label: 'AI Copilot',   icon: Cpu             },
  { path: '/ats-matcher', label: 'ATS Matcher',  icon: Target          },
  { path: '/cold-email',  label: 'Cold Emailer', icon: Mail            },
  { path: '/resumes',     label: 'Resumes',      icon: FileText        },
  { path: '/premium',     label: 'Premium',      icon: Zap             },
  { path: 'https://trackrai.hashnode.dev', label: 'Guides', icon: Pencil, isExternal: true },
  { path: '/settings',    label: 'Settings',     icon: Settings        },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()
  const displayName = user?.email ? user.email.split('@')[0] : 'User'
  const avatarInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'US'
  const isAdmin = user?.email && (user.email.split('@')[0].trim().toLowerCase() === 'rajdeep.pal2004' || user.email.split('@')[0].trim().toLowerCase() === 'rajdeeppalwork')
  const visibleNavItems = isAdmin 
    ? [...NAV_ITEMS, { path: '/admin', label: 'Creator Portal', icon: Terminal }]
    : NAV_ITEMS

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

      <nav className="flex-1 px-3 space-y-1">
        {visibleNavItems.map(({ path, label, icon: Icon, isExternal }) => {
          const content = (
            <>
              <Icon size={18} />
              <span>{label}</span>
            </>
          );
          
          if (isExternal) {
            return (
              <a
                key={path}
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-white/40 hover:text-white hover:bg-white/6"
              >
                {content}
              </a>
            );
          }

          return (
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
          );
        })}
      </nav>

      {/* User card */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-2 glass rounded-2xl p-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {avatarInitials}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{displayName}</p>
              <p className={`text-[10px] ${user?.is_premium ? 'text-indigo-400' : 'text-white/40'}`}>
                {user?.is_premium ? 'Premium User' : 'Free User'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <LogOut size={14} />
          </button>
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