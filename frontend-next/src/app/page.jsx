"use client";

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import {
 Sparkles, Briefcase, BarChart2, Mail, Check,
 ArrowRight, Play, ArrowUpRight, Zap, GripHorizontal
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import confetti from 'canvas-confetti'

const LinePath = ({ scrollYProgress, className }) => {
 return (
 <svg
 width="1440"
 height="2500"
 viewBox="0 0 1440 2500"
 fill="none"
 overflow="visible"
 xmlns="http://www.w3.org/2000/svg"
 className={className}
 >
 <motion.path
 d="M 1100 350 
 C 1100 750, 400 750, 400 1100 
 C 400 1300, 1100 1300, 1100 1100 
 C 1100 900, 350 1150, 350 1500 
 C 350 1800, 1050 1200, 1050 1500 
 C 1050 1800, 720 1800, 720 2200"
 stroke="#6366f1"
 strokeWidth="10"
 strokeLinecap="round"
 pathLength={scrollYProgress}
 style={{
 opacity: 0.5,
 filter: "drop-shadow(0 0 10px rgba(99,102,241,0.5))"
 }}
 />
 </svg>
 );
};

export default function Landing() {
 const { scrollYProgress } = useScroll()
 const mockY = useTransform(scrollYProgress, [0, 1], [0, 300])
 
 const mouseX = useMotionValue(0)
 const mouseY = useMotionValue(0)

 const { isAuthenticated, loading } = useAuth()
 const router = useRouter()

 // Removed auto-redirect so users can view the landing page even when logged in.

 useEffect(() => {
 const handleMouseMove = (e) => {
 mouseX.set(e.clientX)
 mouseY.set(e.clientY)
 }
 window.addEventListener("mousemove", handleMouseMove)
 
 return () => window.removeEventListener("mousemove", handleMouseMove)
 }, [mouseX, mouseY])

 const containerVariants = {
 hidden: { opacity: 0 },
 visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
 }

 const itemVariants = {
 hidden: { y: 25, opacity: 0 },
 visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
 }

 const [demoState, setDemoState] = useState(0); // 0: Applied, 1: Interview, 2: Offer
 const confettiCanvasRef = useRef(null);

 useEffect(() => {
   const interval = setInterval(() => {
     setDemoState((prev) => {
       const next = (prev + 1) % 4; // 0, 1, 2, 3 (3 is reset delay)
       if (next === 2) {
         if (confettiCanvasRef.current) {
           const myConfetti = confetti.create(confettiCanvasRef.current, { resize: true });
           myConfetti({
             particleCount: 80,
             spread: 60,
             origin: { y: 0.8, x: 0.8 },
             colors: ['#6366f1', '#34d399', '#a855f7']
           });
         }
       }
       return next;
     });
   }, 2500);
   return () => clearInterval(interval);
 }, []);

 return (
 <div className="min-h-screen bg-[#020205] text-slate-50 font-sans overflow-x-hidden relative selection:bg-indigo-500/30">
 <script
   type="application/ld+json"
   dangerouslySetInnerHTML={{
     __html: JSON.stringify({
       "@context": "https://schema.org",
       "@type": "FAQPage",
       "mainEntity": [
         {
           "@type": "Question",
           "name": "Is my email data safe?",
           "acceptedAnswer": {
             "@type": "Answer",
             "text": "Yes. We use secure OAuth to connect to your Gmail. We only scan for emails containing interview or application keywords, and we never sell your data or read personal emails."
           }
         },
         {
           "@type": "Question",
           "name": "Is the Resume Grader actually free?",
           "acceptedAnswer": {
             "@type": "Answer",
             "text": "100% free. You can grade your resume against as many job descriptions as you want before you apply."
           }
         },
         {
           "@type": "Question",
           "name": "How accurate is the ATS AI?",
           "acceptedAnswer": {
             "@type": "Answer",
             "text": "Our AI uses semantic parsing to mimic modern Applicant Tracking Systems. This means it reads your resume for context and actual experience, not just outdated keyword stuffing."
           }
         }
       ]
     })
   }}
 />
 
 {/* Global Interactive Spotlight */}
 <motion.div
 className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden lg:block"
 style={{
 background: useMotionTemplate`
 radial-gradient(
 600px circle at ${mouseX}px ${mouseY}px,
 rgba(99, 102, 241, 0.08),
 transparent 80%
 )
 `,
 }}
 />

 {/* Dynamic Grid Background */}
 <div className="fixed inset-0 z-0 pointer-events-none bg-[#020205] overflow-hidden">
 <div 
 className="absolute inset-0 opacity-[0.15]" 
 style={{ 
 backgroundImage: `linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)`,
 backgroundSize: '4rem 4rem',
 maskImage: 'radial-gradient(ellipse 80% 60% at 50% -20%, #000 50%, transparent 100%)',
 WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% -20%, #000 50%, transparent 100%)'
 }} 
 />
 <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] md:w-[60%] h-[600px] bg-indigo-600/20 blur-[140px] rounded-[100%] mix-blend-screen" />
 <div className="absolute top-[20%] -left-20 w-[400px] h-[400px] bg-purple-600/15 blur-[120px] rounded-full mix-blend-screen" />
 <div className="absolute top-[30%] -right-20 w-[400px] h-[400px] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen" />
 </div>

 {/* Scroll-Driven Stroke Animation */}
 <div className="absolute inset-x-0 top-0 w-full h-[2500px] flex justify-center z-0 opacity-70 pointer-events-none hidden lg:flex">
 <LinePath scrollYProgress={scrollYProgress} className="mix-blend-screen max-w-none w-[1440px] h-[2500px] pointer-events-none" />
 </div>

 {/* Navigation */}
 <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10 border-b border-slate-50/5">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-900/50">
 <Sparkles size={16} className="text-slate-50" />
 </div>
 <span className="font-extrabold text-lg tracking-tight">Trackr<span className="text-indigo-400">AI</span></span>
 </div>
 <div className="flex items-center gap-6">
 <Link href="/resources/cold-email-templates" className="text-xs font-medium text-slate-50/50 hover:text-slate-50 transition-colors hidden sm:block">
 Templates
 </Link>
 <Link href="/resources/resume-guide" className="text-xs font-medium text-slate-50/50 hover:text-slate-50 transition-colors hidden sm:block">
 Guides
 </Link>
 {isAuthenticated ? (
  <Link href="/dashboard" className="px-5 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-400 text-xs font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
  Dashboard
  </Link>
 ) : (
  <Link href="/signin" className="px-5 py-2 rounded-full bg-slate-50 text-black hover:bg-slate-50/90 text-xs font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
  Sign In
  </Link>
 )}
 </div>
 </nav>

 {/* Hero Section */}
 <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-32 md:pb-40 relative z-10">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 
 <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
 <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50/5 border border-slate-50/10 text-slate-50/70 text-xs font-semibold backdrop-blur-md">
 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
 Next-Gen Job Tracking
 </motion.div>

 <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-slate-50">
 The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 animate-[shimmer_4s_linear_infinite] bg-[length:200%_auto]">intelligent</span> way to land your next role.
 </motion.h1>

 <motion.p variants={itemVariants} className="text-slate-50/50 text-base md:text-lg max-w-lg font-medium leading-relaxed">
 Ditch the spreadsheets. TrackrAI automatically parses your recruiter emails, updates your Kanban board, and drafts personalized cold outreach—so you can focus on interviewing.
 </motion.p>

 <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
 <Link
 href="/free-resume-grader"
 className="w-full sm:w-auto px-8 py-4 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400 text-sm font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.5)]"
 >
 <Sparkles size={16} />
 <span>Grade Your Resume for Free</span>
 </Link>
 <a
 href="#features"
 className="w-full sm:w-auto px-8 py-4 rounded-3xl bg-slate-50/5 border border-slate-50/10 hover:bg-slate-50/10 text-slate-50 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
 >
 <Play size={14} className="fill-current" />
 <span>See how it works</span>
 </a>
 </motion.div>
 </motion.div>

 {/* Auto-Playing Coded Kanban Demo */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.8, delay: 0.2 }}
 style={{ y: mockY }}
 className="relative lg:h-[500px] flex items-center justify-center mt-12 lg:mt-0"
 >
   <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-[100px] rounded-full" />
   
   <div className="relative w-full max-w-lg p-6 rounded-3xl bg-[#0a0a0f]/80 backdrop-blur-2xl border border-slate-50/10 shadow-2xl overflow-hidden">
     <canvas ref={confettiCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-50" />
     {/* Browser/Window Header */}
     <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
       <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
       <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
       <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
       <div className="ml-4 text-xs font-semibold text-white/30 tracking-widest uppercase">TrackrAI Board</div>
     </div>
     
     {/* Kanban Board Mockup */}
     <div className="flex gap-4 h-[300px]">
       
       {/* Column 1: Applied */}
       <div className="flex-1 bg-white/[0.02] rounded-2xl p-3 border border-white/5">
         <div className="text-[10px] font-bold text-white/40 uppercase mb-3 px-1">Applied</div>
         <div className="relative h-full">
           <motion.div 
             animate={{ 
               x: demoState === 0 || demoState === 3 ? 0 : (demoState === 1 ? 160 : 320),
               y: demoState === 0 || demoState === 3 ? 0 : (demoState === 1 ? 10 : 20),
               scale: demoState === 0 || demoState === 3 ? 1 : 1.05,
               rotate: demoState === 0 || demoState === 3 ? 0 : (demoState === 1 ? 2 : -2),
               opacity: demoState === 3 ? 0 : 1
             }}
             transition={{ type: "spring", stiffness: 120, damping: 15 }}
             className="absolute top-0 left-0 w-full z-10 p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-grab"
           >
             <div className="flex justify-between items-start mb-2">
               <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${demoState >= 2 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'} uppercase tracking-wider transition-colors`}>
                 {demoState >= 2 ? 'Offer' : 'Active'}
               </span>
               <GripHorizontal size={14} className="text-white/20" />
             </div>
             <h3 className="font-bold text-sm text-white">Stripe</h3>
             <p className="text-[10px] text-slate-50/50 mt-1">Software Engineer</p>
             
             <motion.div 
               animate={{ opacity: demoState >= 2 ? 1 : 0 }}
               className="mt-3 flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded"
             >
               <Sparkles size={12} /> $180k/yr Confirmed!
             </motion.div>
           </motion.div>
         </div>
       </div>

       {/* Column 2: Interviewing */}
       <div className="flex-1 bg-white/[0.02] rounded-2xl p-3 border border-white/5">
         <div className="text-[10px] font-bold text-white/40 uppercase mb-3 px-1">Interview</div>
         {/* Drop Zone Highlight */}
         <motion.div 
           animate={{ opacity: demoState === 1 ? 1 : 0 }} 
           className="w-full h-24 rounded-xl border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 transition-opacity"
         />
       </div>

       {/* Column 3: Offer */}
       <div className="flex-1 bg-white/[0.02] rounded-2xl p-3 border border-emerald-500/10">
         <div className="text-[10px] font-bold text-emerald-400/60 uppercase mb-3 px-1">Offer</div>
         {/* Drop Zone Highlight */}
         <motion.div 
           animate={{ opacity: demoState === 2 ? 1 : 0 }} 
           className="w-full h-32 rounded-xl border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 transition-opacity"
         />
       </div>
       
     </div>
   </div>
 </motion.div>
 </div>
 </section>

 {/* Bento Box Feature Grid */}
 <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative z-10">
 <div className="mb-16">
 <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Everything you need. <br className="hidden md:block"/>Nothing you don't.</h2>
 <p className="text-slate-50/50 text-base max-w-xl">A complete operating system for your career progression, designed to keep you focused on interviews, not data entry.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
 
 <div className="md:col-span-2">
 <div className="h-full rounded-3xl bg-[#0a0a0f]/80 backdrop-blur border border-slate-50/5 p-8 flex flex-col justify-between group hover:border-indigo-500/30 transition-colors overflow-hidden relative shadow-2xl">
 <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-colors" />
 
 <div className="absolute -right-4 top-8 w-64 h-48 bg-gradient-to-br from-indigo-900/40 to-transparent rounded-l-2xl border-y border-l border-indigo-500/20 p-4 hidden md:flex flex-col gap-3 opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:-translate-x-2">
 <div className="h-2 w-1/3 bg-indigo-400/20 rounded-full" />
 <div className="h-12 w-full bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center px-3 gap-3">
 <div className="w-6 h-6 rounded-full bg-indigo-400/20 flex items-center justify-center">
 <Mail size={12} className="text-indigo-400" />
 </div>
 <div className="flex-1 space-y-1.5">
 <div className="h-1.5 w-3/4 bg-indigo-400/40 rounded-full" />
 <div className="h-1.5 w-1/2 bg-indigo-400/20 rounded-full" />
 </div>
 </div>
 <div className="h-12 w-full bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center px-3 gap-3 mt-2 translate-x-4">
 <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center">
 <Check size={12} className="text-emerald-400" />
 </div>
 <div className="flex-1 space-y-1.5">
 <div className="h-1.5 w-1/2 bg-emerald-400/40 rounded-full" />
 <div className="h-1.5 w-1/3 bg-emerald-400/20 rounded-full" />
 </div>
 </div>
 </div>

 <div className="w-12 h-12 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
 <Mail size={24} className="text-indigo-400" />
 </div>
 <div className="relative z-10">
 <h3 className="text-2xl font-bold mb-2">Automated Inbox Parsing</h3>
 <p className="text-sm text-slate-50/50 max-w-sm leading-relaxed">Connect your Gmail securely. Our AI scans for recruiter emails and automatically updates your pipeline stages without lifting a finger.</p>
 </div>
 </div>
 </div>

 <div>
 <div className="h-full rounded-3xl bg-[#0a0a0f]/80 backdrop-blur border border-slate-50/5 p-8 flex flex-col justify-between group hover:border-cyan-500/30 transition-colors relative overflow-hidden shadow-2xl">
 <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/5 blur-[50px] rounded-full group-hover:bg-cyan-500/20 transition-colors" />
 <div className="absolute top-6 right-6 opacity-40 group-hover:opacity-100 transition-opacity">
 <div className="w-20 h-20 border border-cyan-500/20 rounded-2xl bg-cyan-900/10 flex flex-col items-center justify-center gap-2 transform rotate-12 group-hover:rotate-6 transition-transform">
 <div className="h-1 w-10 bg-cyan-400/30 rounded-full" />
 <div className="h-1 w-14 bg-cyan-400/30 rounded-full" />
 <div className="h-1 w-8 bg-cyan-400/30 rounded-full" />
 <div className="mt-2 w-12 h-4 bg-cyan-500/20 rounded flex items-center justify-center">
 <Zap size={8} className="text-cyan-400" />
 </div>
 </div>
 </div>

 <div className="w-12 h-12 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
 <Zap size={24} className="text-cyan-400" />
 </div>
 <div className="relative z-10">
 <h3 className="text-xl font-bold mb-2">AI Cold Emails</h3>
 <p className="text-sm text-slate-50/50 leading-relaxed">Draft highly personalized outreach messages in seconds using your resume context.</p>
 </div>
 </div>
 </div>

 <div>
 <div className="h-full rounded-3xl bg-[#0a0a0f]/80 backdrop-blur border border-slate-50/5 p-8 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors relative overflow-hidden shadow-2xl">
 <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
 <div className="absolute top-10 right-6 opacity-40 group-hover:opacity-100 transition-opacity flex items-end gap-1.5 h-16">
 <div className="w-3 bg-emerald-500/20 rounded-t h-4 group-hover:h-6 transition-all duration-500" />
 <div className="w-3 bg-emerald-500/40 rounded-t h-8 group-hover:h-10 transition-all duration-500 delay-75" />
 <div className="w-3 bg-emerald-500/60 rounded-t h-6 group-hover:h-8 transition-all duration-500 delay-100" />
 <div className="w-3 bg-emerald-400 rounded-t h-12 group-hover:h-16 transition-all duration-500 delay-150 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
 </div>

 <div className="w-12 h-12 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
 <BarChart2 size={24} className="text-emerald-400" />
 </div>
 <div className="relative z-10">
 <h3 className="text-xl font-bold mb-2">Search Analytics</h3>
 <p className="text-sm text-slate-50/50 leading-relaxed">Visualize your conversion rates from application to offer in real-time.</p>
 </div>
 </div>
 </div>

 <div className="md:col-span-2">
 <div className="h-full rounded-3xl bg-[#0a0a0f]/80 backdrop-blur border border-slate-50/5 p-8 flex flex-col justify-between group hover:border-purple-500/30 transition-colors relative overflow-hidden shadow-2xl">
 <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
 
 <div className="absolute -right-10 bottom-6 w-72 h-40 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10 hidden md:block" />
 <div className="absolute right-4 bottom-4 w-72 h-48 border border-slate-50/10 rounded-3xl bg-slate-50/5 hidden md:flex gap-2 p-3 opacity-60 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-2">
 <div className="flex-1 rounded bg-slate-50/5 border border-slate-50/5 p-2 space-y-2">
 <div className="w-full h-8 rounded bg-slate-50/10" />
 <div className="w-full h-12 rounded bg-slate-50/5" />
 </div>
 <div className="flex-1 rounded bg-purple-500/10 border border-purple-500/20 p-2 space-y-2">
 <div className="w-full h-12 rounded bg-purple-500/20 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]" />
 <div className="w-full h-8 rounded bg-slate-50/5" />
 </div>
 <div className="flex-1 rounded bg-slate-50/5 border border-slate-50/5 p-2 space-y-2">
 <div className="w-full h-8 rounded bg-slate-50/10" />
 </div>
 </div>

 <div className="w-12 h-12 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
 <Briefcase size={24} className="text-purple-400" />
 </div>
 <div className="relative z-10">
 <h3 className="text-2xl font-bold mb-2">Visual Pipeline Board</h3>
 <p className="text-sm text-slate-50/50 max-w-sm leading-relaxed">Drag and drop applications across customizable stages. Keep track of upcoming interviews, salaries, and specific job links in one unified view.</p>
 </div>
 </div>
 </div>

 </div>
 </section>

 {/* Objection Handling (FAQ) */}
 <section className="max-w-4xl mx-auto px-6 py-24 relative z-10">
 <div className="text-center mb-16">
 <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Frequently Asked Questions</h2>
 <p className="text-slate-50/50 text-base">Everything you need to know about how TrackrAI works.</p>
 </div>
 <div className="space-y-4">
 {[
   {
     q: "Is my email data safe?",
     a: "Yes. We use secure OAuth to connect to your Gmail. We only scan for emails containing interview or application keywords, and we never sell your data or read personal emails."
   },
   {
     q: "Is the Resume Grader actually free?",
     a: "100% free. You can grade your resume against as many job descriptions as you want before you apply."
   },
   {
     q: "How accurate is the ATS AI?",
     a: "Our AI uses semantic parsing to mimic modern Applicant Tracking Systems. This means it reads your resume for context and actual experience, not just outdated keyword stuffing."
   }
 ].map((faq, i) => (
   <details key={i} className="group border border-slate-50/10 bg-[#0a0a0f]/80 backdrop-blur rounded-2xl p-6 [&_summary::-webkit-details-marker]:hidden">
     <summary className="flex justify-between items-center font-bold cursor-pointer text-slate-50">
       {faq.q}
       <span className="transition-transform group-open:rotate-180">
         <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
       </span>
     </summary>
     <p className="text-slate-50/60 mt-4 text-sm leading-relaxed">
       {faq.a}
     </p>
   </details>
 ))}
 </div>
 </section>

 {/* Minimalist CTA */}
 <section className="max-w-4xl mx-auto px-6 py-32 text-center relative z-10">
 <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Ready to get organized?</h2>
 <p className="text-slate-50/50 text-base mb-10 max-w-xl mx-auto">Join the job seekers who are treating their career search like a serious sales pipeline.</p>
 <Link
 href="/free-resume-grader"
 className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-400 hover:to-cyan-400 text-sm font-bold transition-transform hover:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.5)]"
 >
 <Sparkles size={16} />
 <span>Grade Your Resume for Free</span>
 </Link>
 </section>

 {/* Footer */}
 <footer className="border-t border-slate-50/5 bg-[#020205] relative z-10">
 <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-50/40">
 <div className="flex items-center gap-2">
 <Sparkles size={16} className="text-indigo-400" />
 <span className="font-bold text-slate-50/70">TrackrAI</span>
 </div>
 
 <div className="hidden lg:block text-xs text-slate-50/20 italic">
 Whether you call us Trak AI, Track AI, or a Rai Tracker, we're here to help you get hired.
 </div>

 <div className="flex flex-wrap justify-center md:justify-end items-center gap-6">
 <Link href="/privacy" className="hover:text-slate-50 transition-colors">Privacy</Link>
 <Link href="/terms" className="hover:text-slate-50 transition-colors">Terms</Link>
 <a href="https://github.com/rajdeeppal01/trackrai" target="_blank" rel="noreferrer" className="hover:text-slate-50 transition-colors">GitHub</a>
 </div>
 </div>
 </footer>
 
 </div>
 )
}
