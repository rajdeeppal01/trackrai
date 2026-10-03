import Link from 'next/link'
import { Sparkles, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { notFound } from 'next/navigation'

export const competitorsData = {
  teal: {
    name: "Teal",
    title: "TrackrAI vs Teal",
    description: "Compare TrackrAI and Teal to see which is the best AI job tracker for your career.",
    pros: ["Good Chrome Extension", "Built-in Resume Builder"],
    cons: ["Manual data entry often required", "Limited automated cold emails", "Complex UI for simple tasks"],
    trackrAiPros: ["100% Automated Inbox Parsing", "Semantic AI Resume Grader", "AI Cold Email Drafts"],
    whoShouldUseThem: "Job seekers who want a standalone resume builder and don't mind manually updating their pipeline.",
    whoShouldUseUs: "Job seekers who want their recruiter emails parsed automatically and a visual, sales-pipeline approach to their job hunt."
  },
  huntr: {
    name: "Huntr",
    title: "TrackrAI vs Huntr",
    description: "Is Huntr the right job tracker for you? See how it compares to TrackrAI's automated inbox parsing.",
    pros: ["Visual Kanban Board", "Chrome Extension"],
    cons: ["Lacks AI cold outreach", "Basic ATS resume keyword matching", "Manual pipeline management"],
    trackrAiPros: ["Automated Inbox Parsing", "Contextual Semantic Resume Grading", "Generative AI Cold Emails"],
    whoShouldUseThem: "People who strictly want a digital spreadsheet alternative without AI automation.",
    whoShouldUseUs: "People treating their job hunt like a sales pipeline, needing AI to automate the busywork."
  },
  simplify: {
    name: "Simplify",
    title: "TrackrAI vs Simplify",
    description: "TrackrAI vs Simplify. Compare the top AI job search tools.",
    pros: ["Autofill applications", "Large job database"],
    cons: ["Heavy focus on junior/intern roles", "Weak pipeline tracking", "No automated cold outreach"],
    trackrAiPros: ["Automated Recruiter Email Parsing", "Cold Email Vault & AI Drafts", "Semantic Resume Feedback"],
    whoShouldUseThem: "Students and new grads looking to autofill hundreds of internship applications.",
    whoShouldUseUs: "Experienced professionals focusing on high-quality applications and cold outreach."
  }
};

export function generateStaticParams() {
  return [
    { competitor: 'teal' },
    { competitor: 'huntr' },
    { competitor: 'simplify' },
  ]
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const comp = competitorsData[resolvedParams.competitor]
  if (!comp) return { title: 'Compare' }
  return {
    title: comp.title + " | TrackrAI Alternative",
    description: comp.description,
  }
}

export default async function ComparePage({ params }) {
  const resolvedParams = await params;
  const competitor = competitorsData[resolvedParams.competitor];
  
  if (!competitor) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#020205] text-slate-50 font-sans selection:bg-indigo-500/30">
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-50/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
            <Sparkles size={16} className="text-slate-50" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">Trackr<span className="text-indigo-400">AI</span></span>
        </Link>
        <Link href="/signin" className="px-5 py-2 rounded-full bg-slate-50 text-black hover:bg-slate-50/90 text-xs font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Sign In
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            Alternative to {competitor.name}
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            TrackrAI vs {competitor.name}
          </h1>
          <p className="text-slate-50/50 text-lg max-w-2xl mx-auto">
            {competitor.description} Here is an honest, head-to-head comparison to help you decide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Competitor Card */}
          <div className="bg-[#0a0a0f]/80 backdrop-blur rounded-3xl p-8 border border-slate-50/10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-300">{competitor.name}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-50/40 uppercase tracking-wider mb-3">Where they shine</h3>
                <ul className="space-y-2">
                  {competitor.pros.map((pro, i) => (
                    <li key={i} className="flex gap-2 text-slate-300 text-sm">
                      <CheckCircle2 size={16} className="text-slate-500 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-50/40 uppercase tracking-wider mb-3">Where they fall short</h3>
                <ul className="space-y-2">
                  {competitor.cons.map((con, i) => (
                    <li key={i} className="flex gap-2 text-slate-300 text-sm">
                      <XCircle size={16} className="text-red-400/50 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* TrackrAI Card */}
          <div className="bg-gradient-to-b from-indigo-900/20 to-[#0a0a0f] backdrop-blur rounded-3xl p-8 border border-indigo-500/30 relative overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.1)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-400" />
              TrackrAI
            </h2>
            <div className="space-y-6 relative z-10">
              <div>
                <h3 className="text-sm font-semibold text-indigo-300/60 uppercase tracking-wider mb-3">Why users switch</h3>
                <ul className="space-y-3">
                  {competitor.trackrAiPros.map((pro, i) => (
                    <li key={i} className="flex gap-2 text-white text-sm">
                      <CheckCircle2 size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                      <span className="font-medium">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div className="bg-slate-50/5 rounded-3xl p-8 md:p-12 border border-slate-50/10 text-center mb-16">
          <h2 className="text-2xl font-bold mb-8">The Final Verdict</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="font-bold text-slate-300 mb-2">Use {competitor.name} if...</h3>
              <p className="text-sm text-slate-50/60 leading-relaxed">{competitor.whoShouldUseThem}</p>
            </div>
            <div>
              <h3 className="font-bold text-indigo-300 mb-2">Use TrackrAI if...</h3>
              <p className="text-sm text-slate-50/60 leading-relaxed">{competitor.whoShouldUseUs}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/free-resume-grader"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-400 hover:to-cyan-400 text-sm font-bold transition-transform hover:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.5)]"
          >
            <Sparkles size={16} />
            <span>Try TrackrAI for Free</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  )
}
