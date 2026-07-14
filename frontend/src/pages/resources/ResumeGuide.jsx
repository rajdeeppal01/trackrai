import { Link } from 'react-router-dom'
import { FileText, CheckCircle, XCircle, ArrowLeft, Star, ArrowRight, Shield, AlertCircle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

export default function ResumeGuide() {


  const tips = [
    {
      title: 'Use Single-Column Layouts',
      desc: 'ATS parsers read from left-to-right, top-to-bottom. Multi-column templates often cause the scanner to misread text or merge separate sections together.'
    },
    {
      title: 'Stick to Standard Section Headings',
      desc: 'Use simple headings like "Work Experience", "Education", and "Skills". Creative titles like "Where I\'ve Been" or "My Superpowers" confuse the parser.'
    },
    {
      title: 'Integrate Keywords Contextually',
      desc: 'Don\'t just list keywords in a block. Weave them naturally into your bullet points (e.g., "Developed responsive layouts using React and styled-components, improving core web vitals by 18%").'
    },
    {
      title: 'Export as Clean PDF or DOCX',
      desc: 'Avoid using Canva templates where text is rendered as SVG vectors or images. If you cannot highlight and copy the text in your PDF, the ATS scanner cannot read it either.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans py-12 relative overflow-hidden">
      <Helmet>
        <title>ATS Resume Guide & Best Practices | TrackrAI</title>
        <meta name="description" content="Learn how to beat the ATS and get your resume read by human recruiters. Follow our step-by-step resume guide for job hunters." />
        <meta property="og:title" content="ATS Resume Guide & Best Practices | TrackrAI" />
        <meta property="og:description" content="Learn how to beat the ATS and get your resume read by human recruiters. Follow our step-by-step resume guide for job hunters." />
      </Helmet>
      
      {/* Background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-8">
        
        {/* Header */}
        <header className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-indigo-400 transition-colors">
            <ArrowLeft size={12} />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <FileText size={18} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black gradient-text">ATS Resume Guide</h1>
              <p className="text-white/40 text-sm">Learn how to format and optimize your resume to pass automated scanner checks.</p>
            </div>
          </div>
        </header>

        {/* Content Guide */}
        <article className="glass rounded-2xl p-6 border border-white/5 space-y-6 leading-relaxed text-sm text-white/70">
          <h2 className="text-lg font-bold text-white">What is an Applicant Tracking System (ATS)?</h2>
          <p>
            Most mid-to-large companies use Applicant Tracking Systems (like Workday, Greenhouse, or Lever) to store, search, and rank candidate profiles. When you apply, the system extracts text from your resume. If it fails to parse the text correctly due to columns, images, or odd formatting, your profile may get filtered out before a human recruiter ever sees it.
          </p>

          <div className="h-px bg-white/5" />

          <h2 className="text-lg font-bold text-white">Core Formatting Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-2">
                <h4 className="font-bold text-xs text-white/90 flex items-center gap-2">
                  <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                  {tip.title}
                </h4>
                <p className="text-xs text-white/40 leading-relaxed font-medium">{tip.desc}</p>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/5" />

          <h2 className="text-lg font-bold text-white">Keyword Matching</h2>
          <p>
            When recruiters search the ATS database, they filter candidates by specific keywords (e.g., "Python", "Kubernetes", "Agile Product Management"). 
            Ensure your bullet points contain these exact terms. For example, do not abbreviate "Project Management" if the job description spells it out.
          </p>

          {/* Alert block */}
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
            <AlertCircle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-yellow-400">Avoid White Text Keyword Stuffing</h4>
              <p className="text-xs text-white/40 leading-relaxed font-medium">
                Do not copy-paste job descriptions in white text at the bottom of your page. Modern ATS scanners flag invisible text overlays as system manipulation, which leads to immediate rejections.
              </p>
            </div>
          </div>
        </article>

        {/* CTA section */}
        <div className="glass rounded-3xl p-8 border border-white/5 bg-gradient-to-r from-purple-950/10 to-[#080820] text-center space-y-4 max-w-2xl mx-auto">
          <Shield size={24} className="text-purple-400 mx-auto animate-pulse" />
          <h2 className="text-lg font-bold">Let TrackrAI scan your resume alignment</h2>
          <p className="text-xs text-white/40 max-w-md mx-auto leading-relaxed">
            Register a free account to upload your resume text directly. Our AI Copilot checks keyword matches, parses structures, and scores alignment parameters automatically!
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-950"
          >
            <span>Scan Resume Free</span>
            <ArrowRight size={12} />
          </Link>
        </div>

      </div>
    </div>
  )
}
