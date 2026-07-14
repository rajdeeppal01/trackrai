import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import {
  Sparkles, Briefcase, BarChart2, Mail, Check,
  ArrowRight, Play, ArrowUpRight, Zap
} from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useEffect, useRef } from 'react'

// 3D Tilt Card Component
function TiltCard({ children, className }) {
  const ref = useRef(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    
    const width = rect.width
    const height = rect.height
    
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative h-full w-full ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  )
}

const LinePath = ({ scrollYProgress, className }) => {
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <svg
      width="1278"
      height="2319"
      viewBox="0 0 1278 2319"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1186.29 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655C947.587 755.413 1197.56 941.828 936.039 1140.66C745.771 1285.32 321.926 950.737 134.536 1202.19C-6.68295 1391.68 -53.4837 1655.38 131.935 1760.5C478.381 1956.91 1124.19 1515 1201.28 1997.83C1273.66 2451.23 100.805 1864.7 303.794 2668.89"
        stroke="#4f46e5"
        strokeWidth="12"
        style={{
          pathLength,
          strokeDashoffset: useTransform(pathLength, (value) => 1 - value),
          opacity: 0.2
        }}
      />
    </svg>
  );
};

export default function Landing() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })
  
  // Parallax transform for the mock UI
  const mockY = useTransform(scrollYProgress, [0, 1], [0, 300])
  
  // Mouse tracking for global spotlight
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

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

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020205] text-white font-sans overflow-x-hidden relative selection:bg-indigo-500/30">
      <Helmet>
        <title>TrackrAI — AI-Powered Job Search & Application Tracker</title>
        <meta name="description" content="Ditch spreadsheets. TrackrAI automatically syncs with your inbox, organizes your job applications, and drafts personalized cold outreach using AI." />
        <meta name="keywords" content="job tracker, AI job search, application tracker, resume AI, cold email generator, kanban job board" />
        <meta property="og:title" content="TrackrAI — AI-Powered Job Search & Application Tracker" />
        <meta property="og:description" content="Ditch spreadsheets. TrackrAI automatically syncs with your inbox, organizes your job applications, and drafts personalized cold outreach using AI." />
        <meta property="og:type" content="website" />
      </Helmet>
      
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

      {/* Dynamic Grid Background with Animated Scroll Stroke */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#020205] overflow-hidden">
        {/* Scroll-Driven Stroke Animation */}
        <LinePath scrollYProgress={scrollYProgress} className="absolute -right-[20%] top-0 z-0 mix-blend-screen w-[80%] h-auto opacity-50" />
        
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-32 md:pb-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Next-Gen Job Tracking
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 animate-[shimmer_4s_linear_infinite] bg-[length:200%_auto]">intelligent</span> way to land your next role.
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

          {/* Interactive Floating Mockup with Parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y: mockY }}
            className="relative lg:h-[500px] flex items-center justify-center mt-12 lg:mt-0 perspective-1000"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 blur-[100px] rounded-full" />
            
            <TiltCard>
              <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#0a0a0f]/60 backdrop-blur-2xl border border-white/10 shadow-2xl">
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
                    className="p-4 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
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
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* Bento Box Feature Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Everything you need. <br className="hidden md:block"/>Nothing you don't.</h2>
          <p className="text-white/50 text-base max-w-xl">A complete operating system for your career progression, designed to keep you focused on interviews, not data entry.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
          
          <TiltCard className="md:col-span-2">
            <div className="h-full rounded-3xl bg-[#0a0a0f]/80 backdrop-blur border border-white/5 p-8 flex flex-col justify-between group hover:border-indigo-500/30 transition-colors overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-colors" />
              
              <div className="absolute -right-4 top-8 w-64 h-48 bg-gradient-to-br from-indigo-900/40 to-transparent rounded-l-2xl border-y border-l border-indigo-500/20 p-4 hidden md:flex flex-col gap-3 opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:-translate-x-2">
                <div className="h-2 w-1/3 bg-indigo-400/20 rounded-full" />
                <div className="h-12 w-full bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center px-3 gap-3">
                   <div className="w-6 h-6 rounded-full bg-indigo-400/20 flex items-center justify-center">
                      <Mail size={12} className="text-indigo-400" />
                   </div>
                   <div className="flex-1 space-y-1.5">
                      <div className="h-1.5 w-3/4 bg-indigo-400/40 rounded-full" />
                      <div className="h-1.5 w-1/2 bg-indigo-400/20 rounded-full" />
                   </div>
                </div>
                <div className="h-12 w-full bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center px-3 gap-3 mt-2 translate-x-4">
                   <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center">
                      <Check size={12} className="text-emerald-400" />
                   </div>
                   <div className="flex-1 space-y-1.5">
                      <div className="h-1.5 w-1/2 bg-emerald-400/40 rounded-full" />
                      <div className="h-1.5 w-1/3 bg-emerald-400/20 rounded-full" />
                   </div>
                </div>
              </div>

              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Mail size={24} className="text-indigo-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Automated Inbox Parsing</h3>
                <p className="text-sm text-white/50 max-w-sm leading-relaxed">Connect your Gmail securely. Our AI scans for recruiter emails and automatically updates your pipeline stages without lifting a finger.</p>
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="h-full rounded-3xl bg-[#0a0a0f]/80 backdrop-blur border border-white/5 p-8 flex flex-col justify-between group hover:border-cyan-500/30 transition-colors relative overflow-hidden shadow-2xl">
              <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/5 blur-[50px] rounded-full group-hover:bg-cyan-500/20 transition-colors" />
              <div className="absolute top-6 right-6 opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="w-20 h-20 border border-cyan-500/20 rounded-lg bg-cyan-900/10 flex flex-col items-center justify-center gap-2 transform rotate-12 group-hover:rotate-6 transition-transform">
                  <div className="h-1 w-10 bg-cyan-400/30 rounded-full" />
                  <div className="h-1 w-14 bg-cyan-400/30 rounded-full" />
                  <div className="h-1 w-8 bg-cyan-400/30 rounded-full" />
                  <div className="mt-2 w-12 h-4 bg-cyan-500/20 rounded flex items-center justify-center">
                     <Zap size={8} className="text-cyan-400" />
                  </div>
                </div>
              </div>

              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <Zap size={24} className="text-cyan-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">AI Cold Emails</h3>
                <p className="text-sm text-white/50 leading-relaxed">Draft highly personalized outreach messages in seconds using your resume context.</p>
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="h-full rounded-3xl bg-[#0a0a0f]/80 backdrop-blur border border-white/5 p-8 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors relative overflow-hidden shadow-2xl">
               <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
               <div className="absolute top-10 right-6 opacity-40 group-hover:opacity-100 transition-opacity flex items-end gap-1.5 h-16">
                  <div className="w-3 bg-emerald-500/20 rounded-t h-4 group-hover:h-6 transition-all duration-500" />
                  <div className="w-3 bg-emerald-500/40 rounded-t h-8 group-hover:h-10 transition-all duration-500 delay-75" />
                  <div className="w-3 bg-emerald-500/60 rounded-t h-6 group-hover:h-8 transition-all duration-500 delay-100" />
                  <div className="w-3 bg-emerald-400 rounded-t h-12 group-hover:h-16 transition-all duration-500 delay-150 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
               </div>

              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                <BarChart2 size={24} className="text-emerald-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Search Analytics</h3>
                <p className="text-sm text-white/50 leading-relaxed">Visualize your conversion rates from application to offer in real-time.</p>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="md:col-span-2">
            <div className="h-full rounded-3xl bg-[#0a0a0f]/80 backdrop-blur border border-white/5 p-8 flex flex-col justify-between group hover:border-purple-500/30 transition-colors relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
              
               <div className="absolute -right-10 bottom-6 w-72 h-40 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10 hidden md:block" />
               <div className="absolute right-4 bottom-4 w-72 h-48 border border-white/10 rounded-xl bg-white/5 hidden md:flex gap-2 p-3 opacity-60 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-2">
                  <div className="flex-1 rounded bg-white/5 border border-white/5 p-2 space-y-2">
                     <div className="w-full h-8 rounded bg-white/10" />
                     <div className="w-full h-12 rounded bg-white/5" />
                  </div>
                  <div className="flex-1 rounded bg-purple-500/10 border border-purple-500/20 p-2 space-y-2">
                     <div className="w-full h-12 rounded bg-purple-500/20 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]" />
                     <div className="w-full h-8 rounded bg-white/5" />
                  </div>
                  <div className="flex-1 rounded bg-white/5 border border-white/5 p-2 space-y-2">
                     <div className="w-full h-8 rounded bg-white/10" />
                  </div>
               </div>

              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Briefcase size={24} className="text-purple-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Visual Pipeline Board</h3>
                <p className="text-sm text-white/50 max-w-sm leading-relaxed">Drag and drop applications across customizable stages. Keep track of upcoming interviews, salaries, and specific job links in one unified view.</p>
              </div>
            </div>
          </TiltCard>

        </div>
      </section>

      {/* Minimalist CTA */}
      <section className="max-w-4xl mx-auto px-6 py-32 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Ready to get organized?</h2>
        <p className="text-white/50 text-base mb-10 max-w-xl mx-auto">Join the job seekers who are treating their career search like a serious sales pipeline.</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black hover:bg-gray-200 text-sm font-bold transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
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
