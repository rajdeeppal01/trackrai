import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, Briefcase, Cpu, BarChart2, Mail, Check,
  ArrowRight, Play, HelpCircle, Shield, ArrowUpRight, Zap
} from 'lucide-react'
import { Helmet } from 'react-helmet-async'

export default function Landing() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans overflow-x-hidden relative selection:bg-indigo-500/30">
      <Helmet>
        <title>TrackrAI — AI-Powered Job Search & Application Tracker</title>
        <meta name="description" content="Ditch spreadsheets. TrackrAI automatically syncs with your inbox, organizes your job applications, and drafts personalized cold outreach using AI." />
        <meta name="keywords" content="job tracker, AI job search, application tracker, resume AI, cold email generator, kanban job board" />
        <meta property="og:title" content="TrackrAI — AI-Powered Job Search & Application Tracker" />
        <meta property="og:description" content="Ditch spreadsheets. TrackrAI automatically syncs with your inbox, organizes your job applications, and drafts personalized cold outreach using AI." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      {/* Refined Ambient Glow & Graphic Patterns */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/10 via-[#020205] to-[#020205] pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Subtle Dot Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">Trackr<span className="text-indigo-400">AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/resources/cold-email-templates" className="text-xs font-medium text-white/50 hover:text-white transition-colors hidden sm:block">
            Templates
          </Link>
          <Link to="/resources/resume-guide" className="text-xs font-medium text-white/50 hover:text-white transition-colors hidden sm:block">
            Guides
          </Link>
          <Link to="/login" className="px-5 py-2 rounded-full bg-white text-black hover:bg-white/90 text-xs font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-32 md:pb-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Next-Gen Job Tracking
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">intelligent</span> way to land your next role.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-white/50 text-base md:text-lg max-w-lg font-medium leading-relaxed">
              Ditch the spreadsheets. TrackrAI automatically syncs with your inbox to parse recruiter emails, update your kanban board, and draft personalized cold outreach.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black hover:bg-gray-100 text-sm font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <span>Get Started — Free</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Play size={14} className="fill-current" />
                <span>See how it works</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Interactive Floating Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[500px] flex items-center justify-center mt-12 lg:mt-0"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 blur-[100px] rounded-full" />
            
            <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
              </div>
              
              <div className="space-y-4">
                {/* Mock Email Card */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Mail size={16} className="text-white/40" />
                    <span className="text-xs font-bold text-white/70">Incoming Email</span>
                  </div>
                  <p className="text-sm font-semibold">"Invitation to Interview: Software Engineer"</p>
                  <p className="text-xs text-white/40 mt-1">From: Stripe Recruiting</p>
                </motion.div>

                {/* Animated Connection */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{ height: [0, 40], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-0.5 bg-gradient-to-b from-indigo-500 to-transparent"
                  />
                </div>

                {/* Mock Kanban Card */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/30"
                >
                   <div className="flex justify-between items-start mb-4">
                     <span className="text-[10px] font-bold px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 uppercase tracking-wider">Interviewing</span>
                     <Sparkles size={14} className="text-indigo-400" />
                   </div>
                   <h3 className="font-bold text-lg">Stripe</h3>
                   <p className="text-xs text-white/50 mt-1">Software Engineer</p>
                   <div className="mt-4 text-[10px] text-white/40 flex items-center gap-1 font-medium">
                     <Check size={12} className="text-emerald-400" /> Automatically updated via Gmail Sync
                   </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Box Feature Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Everything you need. <br className="hidden md:block"/>Nothing you don't.</h2>
          <p className="text-white/50 text-base max-w-xl">A complete operating system for your career progression, designed to keep you focused on interviews, not data entry.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          
          {/* Bento 1: Large - Gmail Sync */}
          <div className="md:col-span-2 rounded-3xl bg-[#0a0a0f] border border-white/5 p-8 flex flex-col justify-between group hover:border-indigo-500/30 transition-colors overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
              <Mail size={24} className="text-indigo-400" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Automated Inbox Parsing</h3>
              <p className="text-sm text-white/50 max-w-md leading-relaxed">Connect your Gmail securely. Our AI scans for recruiter emails and automatically updates your pipeline stages without lifting a finger.</p>
            </div>
          </div>

          {/* Bento 2: Standard - Cold Email */}
          <div className="rounded-3xl bg-[#0a0a0f] border border-white/5 p-8 flex flex-col justify-between group hover:border-cyan-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6">
              <Zap size={24} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">AI Cold Emails</h3>
              <p className="text-sm text-white/50 leading-relaxed">Draft highly personalized outreach messages in seconds using your resume context.</p>
            </div>
          </div>

          {/* Bento 3: Standard - Analytics */}
          <div className="rounded-3xl bg-[#0a0a0f] border border-white/5 p-8 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
              <BarChart2 size={24} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Search Analytics</h3>
              <p className="text-sm text-white/50 leading-relaxed">Visualize your conversion rates from application to offer in real-time.</p>
            </div>
          </div>

          {/* Bento 4: Large - Kanban */}
          <div className="md:col-span-2 rounded-3xl bg-[#0a0a0f] border border-white/5 p-8 flex flex-col justify-between group hover:border-purple-500/30 transition-colors relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full group-hover:bg-purple-500/10 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
              <Briefcase size={24} className="text-purple-400" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Visual Pipeline Board</h3>
              <p className="text-sm text-white/50 max-w-md leading-relaxed">Drag and drop applications across customizable stages. Keep track of upcoming interviews, salaries, and specific job links in one unified view.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Minimalist CTA */}
      <section className="max-w-4xl mx-auto px-6 py-32 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Ready to get organized?</h2>
        <p className="text-white/50 text-base mb-10 max-w-xl mx-auto">Join the job seekers who are treating their career search like a serious sales pipeline.</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black hover:bg-gray-200 text-sm font-bold transition-transform hover:scale-105 shadow-xl shadow-white/5"
        >
          <span>Create Free Account</span>
          <ArrowUpRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#020205] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/40">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-400" />
            <span className="font-bold text-white/70">TrackrAI</span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="https://github.com/rajdeeppal01/trackrai" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
      
    </div>
  )
}
