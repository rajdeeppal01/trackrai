import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'

export default function PremiumPromo() {
 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.2 }}
 className="relative glass flex-1 flex flex-col justify-center rounded-2xl overflow-hidden border border-indigo-500/20 group"
 >
 {/* Background Gradients & Glows */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-700" />
 <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-colors duration-700" />
 
 {/* Animated Gradient Border Top */}
 <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

 <div className="relative p-6 flex flex-col md:flex-row items-center gap-8">
 
 {/* Left Side: Copy */}
 <div className="flex-1 space-y-4">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
 <Sparkles size={12} className="animate-pulse" />
 Premium
 </div>
 
 <h3 className="text-2xl font-bold text-white leading-tight">
 Put your job hunt on <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Autopilot</span>.
 </h3>
 
 <p className="text-sm text-white/50 leading-relaxed max-w-md">
 Connect your Gmail and let our AI instantly scan your inbox for interview invites, rejections, and status updates. It automatically syncs your pipeline so you never miss a beat.
 </p>
 
 <ul className="space-y-2 mt-2">
 {[
 'Unlimited multi-resume manager',
 'Zero manual data entry',
 'Instant notifications for interview invites',
 'Automatic status syncing'
 ].map((feature, i) => (
 <li key={i} className="flex items-center gap-2 text-xs text-white/60">
 <CheckCircle2 size={14} className="text-emerald-400" />
 {feature}
 </li>
 ))}
 </ul>
 
 <div className="pt-2">
 <Link
 to="/premium"
 className="inline-flex items-center gap-2 px-6 py-2.5 rounded-3xl bg-white text-indigo-950 font-bold text-sm hover:bg-indigo-50 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95"
 >
 Unlock AI Sync
 <ArrowRight size={14} />
 </Link>
 </div>
 </div>
 
 {/* Right Side: Visual Mockup */}
 <div className="hidden md:flex flex-col items-center justify-center relative w-64 shrink-0">
 
 {/* Email Mock */}
 <motion.div 
 initial={{ y: 0 }}
 animate={{ y: [0, -5, 0] }}
 transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
 className="w-full glass-strong rounded-3xl p-3 shadow-2xl relative z-10"
 >
 <div className="flex items-center gap-2 mb-2">
 <div className="w-6 h-6 rounded-3xl bg-red-500/20 flex items-center justify-center">
 <Mail size={12} className="text-red-400" />
 </div>
 <div>
 <p className="text-[10px] text-white/40">From: recruiters@google.com</p>
 <p className="text-xs font-semibold text-white/90">Interview Invitation</p>
 </div>
 </div>
 <div className="h-1.5 w-3/4 bg-white/10 rounded-full mb-1.5" />
 <div className="h-1.5 w-1/2 bg-white/10 rounded-full" />
 </motion.div>
 
 {/* Connector Line */}
 <div className="h-6 w-0.5 bg-gradient-to-b from-indigo-500/50 to-emerald-500/50" />
 
 {/* Action Mock */}
 <motion.div 
 initial={{ y: 0 }}
 animate={{ y: [0, 5, 0] }}
 transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
 className="w-11/12 bg-[#0a0a1a] rounded-3xl p-3 border border-emerald-500/30 shadow-2xl relative z-10 flex items-center gap-3"
 >
 <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
 <Zap size={12} className="text-emerald-400" />
 </div>
 <div>
 <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide mb-0.5">Auto-Updated</p>
 <p className="text-xs font-medium text-white/80">Moved to Interview stage</p>
 </div>
 </motion.div>

 </div>
 </div>
 </motion.div>
 )
}
