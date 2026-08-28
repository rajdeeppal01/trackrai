"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Copy, Check, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EmailTemplates() {

  const [copiedId, setCopiedId] = useState(null)

  const templates = [
    {
      id: 'swe_intern',
      role: 'Software Engineer (Intern/Entry Level)',
      subject: 'SWE Intern Inquiry — [Your Name] / [Notable Project/Skill]',
      body: `Hi [Recipient Name],

I hope you're having a great week.

I've been closely following [Company Name]'s recent work in [specific industry/niche, e.g., generative AI tools], and I wanted to reach out. I'm a software engineering student at [University] with strong hands-on experience in [Core Skill, e.g., React & FastAPI] and built [Brief description of one impressive project or contribution].

I'm incredibly interested in joining [Company Name] as a Software Engineer Intern. If you have 5 minutes, I would love to ask you a couple of questions about the engineering culture and what you look for in new team members.

I've attached my resume for reference. Thank you so much for your time!

Best regards,
[Your Name]
[LinkedIn Profile / Portfolio Link]`
    },
    {
      id: 'swe_fulltime',
      role: 'Full-Stack Software Engineer (Experienced)',
      subject: 'Full-Stack Engineer opportunity — [Your Name]',
      body: `Hi [Recipient Name],

I hope you're doing well.

I came across your profile and noticed [Company Name] is expanding its engineering team. I wanted to reach out because I have [N] years of experience building scalable web architectures with [Tech Stack, e.g., Python, Docker, and AWS]. 

At my previous role, I led [specific project/accomplishment, e.g., migration to microservices, reducing load times by 35%]. I've played around with [Company Name] and love the user experience, particularly [specific feature/product].

I would love to learn more about the team's engineering goals this quarter and see if my background aligns. Are you free for a brief chat sometime this week?

Thanks for your consideration,
[Your Name]
[Portfolio Link]`
    },
    {
      id: 'product_manager',
      role: 'Product Manager (Associate / PM)',
      subject: 'Connecting regarding Product Management at [Company Name] — [Your Name]',
      body: `Hi [Recipient Name],

I hope you're having a great day.

I'm reaching out because I'm a huge fan of [Company Name] and love your user-centric approach to [industry problem, e.g., task tracking]. 

I'm an incoming / transitioning Product Manager with a background in [Software engineering / data analysis / marketing] where I previously launched [notable product or project, highlighting metrics like +20% engagement]. I love shipping products that solve real customer problems and believe my analytical background would match the product goals for [specific company product line].

I'd love to grab 5 minutes to learn about your path to Product Management and what makes a PM successful at [Company Name].

Warmly,
[Your Name]
[LinkedIn Profile]`
    }
  ]

  function handleCopy(id, text) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Template copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans py-12 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-8">
        
        {/* Header */}
        <header className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-indigo-400 transition-colors">
            <ArrowLeft size={12} />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-3xl bg-indigo-500/15 flex items-center justify-center">
              <Mail size={18} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black gradient-text">Cold Email Templates</h1>
              <p className="text-white/40 text-sm">Copy-pasteable cold outreach drafts designed to get founder responses.</p>
            </div>
          </div>
        </header>

        {/* Templates container */}
        <div className="space-y-8">
          {templates.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl overflow-hidden"
            >
              {/* Template Header */}
              <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between gap-4">
                <h3 className="font-bold text-sm text-white/90">{t.role}</h3>
                <button
                  onClick={() => handleCopy(t.id, `Subject: ${t.subject}\n\n${t.body}`)}
                  className="px-3 py-1.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-[10px] font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === t.id ? (
                    <>
                      <Check size={10} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={10} />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>

              {/* Template Body */}
              <div className="p-6 space-y-4 text-xs font-mono leading-relaxed bg-[#020208]/40">
                <div className="pb-3 border-b border-white/5">
                  <span className="text-white/30 mr-2 select-none">Subject:</span>
                  <span className="text-indigo-300 font-semibold">{t.subject}</span>
                </div>
                <pre className="whitespace-pre-wrap text-white/70 font-sans tracking-wide leading-relaxed text-[11px]">{t.body}</pre>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA section */}
        <div className="glass rounded-3xl p-8 bg-gradient-to-r from-indigo-950/10 to-[#080820] text-center space-y-4 max-w-2xl mx-auto border border-indigo-500/10">
          <Sparkles size={24} className="text-indigo-400 mx-auto animate-pulse" />
          <h2 className="text-lg font-bold">Want to write templates customized to you?</h2>
          <p className="text-xs text-white/40 max-w-md mx-auto leading-relaxed">
            Register for a free TrackrAI account to utilize Gemini models. Input recruiter names and bio parameters to auto-generate fully personalized cold emails!
          </p>
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-3xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-950"
          >
            <span>Draft Custom Emails Free</span>
            <ArrowRight size={12} />
          </Link>
        </div>

      </div>
    </div>
  )
}
