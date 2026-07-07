import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, Briefcase, Cpu, BarChart2, Mail, Check,
  ArrowRight, Users, Play, HelpCircle, Shield
} from 'lucide-react'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function Landing() {
  useDocumentTitle('TrackrAI — AI-Powered Job Tracker')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  }

  const features = [
    {
      icon: Briefcase,
      title: 'Job Pipeline Board',
      desc: 'Ditch the spreadsheets. Track status, interviews, and offers in a gorgeous Kanban board with instant drag-and-drop mechanics.',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    {
      icon: Cpu,
      title: 'AI Copilot Review',
      desc: 'Upload your resume and get immediate feedback, alignment scoring, and personalized optimization suggestions powered by Gemini.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      icon: Mail,
      title: 'AI Cold Email Drafts',
      desc: 'Enter any founder or hiring manager email to instantly write highly personalized outreach pitches aligned with your background.',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    },
    {
      icon: BarChart2,
      title: 'Visual Analytics',
      desc: 'Watch your search performance grow. Monitor conversion rates, response metrics, and acquisition over time in real time.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    }
  ]

  const faqs = [
    { q: 'Is TrackrAI completely free?', a: 'Yes! The core platform, including application tracking, pipeline updates, and metrics, is 100% free with no limits.' },
    { q: 'How does the AI Cold Emailer work?', a: 'It analyzes the recipient\'s role and company along with your pitch highlights to draft a tailored outreach email, which you can edit and launch directly in your email client.' },
    { q: 'Is my data secure?', a: 'Absolutely. We encrypt all passwords, do not sell your personal data, and allow you to permanently export or purge your data at any time from your Settings panel.' }
  ]

  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans overflow-x-hidden relative">
      
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-indigo-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-purple-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-950">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Trackr<span className="text-indigo-400">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/resources/cold-email-templates" className="text-xs font-semibold text-white/50 hover:text-white transition-colors">
            Templates
          </Link>
          <Link to="/resources/resume-guide" className="text-xs font-semibold text-white/50 hover:text-white transition-colors mr-2">
            Guides
          </Link>
          <Link to="/login" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 hover:text-white transition-all">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold"
          >
            <Sparkles size={12} className="animate-pulse" />
            <span>The Smart Way to Manage Your Job Search</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-white"
          >
            Track your job hunt with <span className="gradient-text">Artificial Intelligence</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-white/45 text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed"
          >
            Ditch spreadsheets. Track applications, scoring match factors, draft personalized outreach, and watch your conversion metrics fly.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-950/40 hover:scale-[1.02]"
            >
              <span>Get Started for Free</span>
              <ArrowRight size={14} />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/3 border border-white/10 hover:bg-white/6 text-white/70 hover:text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Play size={12} className="text-indigo-400 fill-indigo-400/20" />
              <span>Explore Features</span>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Everything you need to land your next role</h2>
          <p className="text-white/40 text-sm">Automate the boring parts of the job search so you can focus on acing your interview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/5 space-y-4 hover:border-white/15 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${feat.bg} ${feat.color} flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
                <h3 className="font-bold text-white text-base">{feat.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed font-medium">{feat.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Pricing / CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <div className="glass rounded-3xl p-8 md:p-12 border border-white/10 bg-gradient-to-r from-indigo-950/20 via-purple-950/10 to-[#080820] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider inline-block">
              Free Access
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Focus on your craft, not tracking.</h2>
            <p className="text-xs text-white/40 leading-relaxed font-medium">
              Join thousands of job hunters organizing their workflows. Take control of your interview funnels today.
            </p>
            <div className="space-y-2 pt-2">
              {['Unlimited Application Tracking', 'Instant AI Cold Email Templates', 'Sleek Interactive Analytics'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-white/60">
                  <Check size={12} className="text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/3 border border-white/5 text-center w-full md:w-80 space-y-4">
            <span className="text-xs font-semibold text-white/50">TrackrAI Standard Plan</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-black text-white">$0</span>
              <span className="text-xs text-white/30">/ month</span>
            </div>
            <p className="text-[10px] text-white/40">Free forever. No credit card required.</p>
            <Link
              to="/login"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-950/25 block"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <HelpCircle size={32} className="text-indigo-400 mx-auto opacity-70" />
          <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass rounded-xl p-5 border border-white/5 space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                {faq.q}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed font-medium pl-3.5">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 relative z-10 text-xs text-white/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles size={12} className="text-indigo-400" />
            </div>
            <span className="font-bold text-white/50">TrackrAI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/resources/cold-email-templates" className="hover:text-white/60 transition-colors">Cold Email Templates</Link>
            <Link to="/resources/resume-guide" className="hover:text-white/60 transition-colors">ATS Resume Guide</Link>
            <Link to="/login" className="hover:text-white/60 transition-colors">Sign In</Link>
            <a href="https://github.com/rajdeeppal01/trackrai" target="_blank" rel="noreferrer" className="hover:text-white/60 transition-colors">GitHub Code</a>
          </div>
          <p>© 2026 TrackrAI. Deployed under MIT License.</p>
        </div>
      </footer>
      
    </div>
  )
}
