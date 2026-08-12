"use client";

import { useState, useEffect, useRef } from 'react'
import { Bell, Menu, Sparkles, Plus, Pencil, Trash2, X, CheckCheck } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { formatDistanceToNow, parseISO, isValid } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '../ui/ThemeToggle'
import { useApplications } from '../../hooks/useApplications'

const PAGE_TITLES = {
 '/': 'Dashboard',
 '/applications': 'Applications',
 '/pipeline': 'Pipeline',
 '/analytics': 'Analytics',
 '/copilot': 'AI Copilot',
 '/settings': 'Settings',
}

const TYPE_ICON = {
 created: { Icon: Plus, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
 updated: { Icon: Pencil, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
 deleted: { Icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/10' },
}

function timeAgo(isoStr) {
 try {
 const d = parseISO(isoStr)
 return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : 'just now'
 } catch {
 return 'just now'
 }
}



export default function Navbar({ onMenuOpen }) {
 const pathname = usePathname()
 const router = useRouter()
 const title = PAGE_TITLES[pathname] || 'TrackrAI'

 const { activity = [], clearActivity } = useApplications() || {}
 const [notifOpen, setNotifOpen] = useState(false)
 const notifRef = useRef(null)

 // Close on outside click
 useEffect(() => {
 if (!notifOpen) return
 function handleClick(e) {
 if (notifRef.current && !notifRef.current.contains(e.target)) {
 setNotifOpen(false)
 }
 }
 document.addEventListener('mousedown', handleClick)
 return () => document.removeEventListener('mousedown', handleClick)
 }, [notifOpen])

 // Close on Escape
 useEffect(() => {
 if (!notifOpen) return
 function handleKey(e) { if (e.key === 'Escape') setNotifOpen(false) }
 document.addEventListener('keydown', handleKey)
 return () => document.removeEventListener('keydown', handleKey)
 }, [notifOpen])

 function toggleNotifications() {
 setNotifOpen((v) => !v)
 }

 function clearNotifications() {
 if (clearActivity) clearActivity()
 }

 const unreadCount = Math.min(activity.length, 9)

 return (
 <header className="h-16 px-4 md:px-8 flex items-center justify-between bg-[#080820]/80 backdrop-blur-xl border-b border-white/8 sticky top-0 z-30 shrink-0">

 {/* Left — hamburger (mobile) + page title */}
 <div className="flex items-center gap-3">
 <button
 onClick={onMenuOpen}
 className="w-9 h-9 rounded-3xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all md:hidden"
 aria-label="Open menu"
 >
 <Menu size={18} />
 </button>
 <span className="text-sm font-semibold text-white/70 md:hidden">{title}</span>
 </div>

 {/* Center — spacer on desktop */}
 <div className="hidden md:flex flex-1" />

 {/* Right — notifications + AI assistant */}
 <div className="flex items-center gap-3">

 {/* ── Notifications bell ─────────────────────────────── */}
 <div className="relative" ref={notifRef}>
 <button
 onClick={toggleNotifications}
 className="relative w-9 h-9 rounded-3xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 border border-white/8 transition-all duration-200"
 aria-label="Notifications"
 >
 <Bell size={16} />
 {unreadCount > 0 && (
 <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white px-0.5">
 {unreadCount}
 </span>
 )}
 </button>

 {/* Dropdown panel */}
 <AnimatePresence>
 {notifOpen && (
 <motion.div
 initial={{ opacity: 0, y: 8, scale: 0.97 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 8, scale: 0.97 }}
 transition={{ duration: 0.15 }}
 className="absolute right-0 top-12 w-80 glass-strong rounded-2xl shadow-2xl overflow-hidden z-50"
 >
 {/* Header */}
 <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
 <div className="flex items-center gap-2">
 <Bell size={14} className="text-indigo-400" />
 <span className="text-sm font-semibold text-white">Notifications</span>
 {unreadCount > 0 && (
 <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full font-semibold">
 {unreadCount}
 </span>
 )}
 </div>
 <div className="flex items-center gap-1">
 {activity.length > 0 && (
 <button
 onClick={clearNotifications}
 className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded-2xl hover:bg-white/5"
 >
 <CheckCheck size={11} />
 Clear all
 </button>
 )}
 <button
 onClick={() => setNotifOpen(false)}
 className="w-6 h-6 rounded-2xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
 >
 <X size={12} />
 </button>
 </div>
 </div>

 {/* List */}
 <div className="max-h-72 overflow-y-auto">
 {activity.length > 0 ? (
 activity.slice(0, 10).map((item, i) => {
 const conf = TYPE_ICON[item.type] || TYPE_ICON.updated
 const { Icon, color, bg } = conf
 return (
 <div
 key={item.id || i}
 className="flex items-start gap-3 px-4 py-3 hover:bg-white/4 border-b border-white/4 last:border-0 transition-colors"
 >
 <div className={`w-7 h-7 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
 <Icon size={12} className={color} />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-xs text-white/80 leading-snug line-clamp-2">
 {item.label || item.message || 'Activity'}
 </p>
 <p className="text-[10px] text-white/25 mt-1">
 {timeAgo(item.timestamp)}
 </p>
 </div>
 </div>
 )
 })
 ) : (
 <div className="flex flex-col items-center py-10 text-center">
 <Bell size={24} className="text-white/15 mb-2" />
 <p className="text-sm text-white/30">No notifications yet</p>
 <p className="text-xs text-white/15 mt-1">Actions will appear here</p>
 </div>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* ── Theme toggle ───────────────────────────────────── */}
 <ThemeToggle />

 {/* ── AI Assistant button ────────────────────────────── */}
 <button
 onClick={() => { router.push('/copilot'); setNotifOpen(false) }}
 className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-3xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-900/30 active:scale-95"
 >
 <Sparkles size={14} />
 AI Assistant
 </button>

 </div>
 </header>
 )
}