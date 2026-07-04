import React from 'react'
import { Bell, Menu, Sparkles } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/':             'Dashboard',
  '/applications': 'Applications',
  '/pipeline':     'Pipeline',
  '/analytics':    'Analytics',
  '/copilot':      'AI Copilot',
  '/settings':     'Settings',
}

export default function Navbar({ onMenuOpen }) {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'TrackrAI'

  return (
    <header className="h-16 px-4 md:px-8 flex items-center justify-between bg-[#080820]/80 backdrop-blur-xl border-b border-white/8 sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuOpen}
          className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all md:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {/* Page title on mobile */}
        <span className="text-sm font-semibold text-white/70 md:hidden">{title}</span>
      </div>

      {/* Desktop: search bar placeholder */}
      <div className="hidden md:flex flex-1 max-w-md">
        {/* Reserved for a global search — can be wired up later */}
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 border border-white/8 transition-all"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>

        <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-900/30">
          <Sparkles size={14} />
          AI Assistant
        </button>
      </div>
    </header>
  )
}