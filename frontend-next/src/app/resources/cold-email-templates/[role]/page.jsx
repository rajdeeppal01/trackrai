import Link from 'next/link'
import { Sparkles, Mail, ArrowLeft, ArrowRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import CopyButton from './CopyButton'

const templateData = {
  "software-engineer": {
    role: "Software Engineer",
    title: "Cold Email Template for Software Engineers",
    description: "Get noticed by engineering managers with this battle-tested SWE cold email template. Designed to highlight your tech stack and shipped projects.",
    subject: "SWE Inquiry — [Your Name] / [Notable Project/Skill]",
    body: `Hi [Recipient Name],

I hope you're having a great week.

I've been closely following [Company Name]'s recent work in [specific industry/niche], and I wanted to reach out. I'm a software engineer with strong hands-on experience in [Core Skill, e.g., React & Python] and recently built [Brief description of one impressive project].

I'm incredibly interested in joining [Company Name] as a Software Engineer. If you have 5 minutes, I would love to ask you a couple of questions about the engineering culture and what you look for in new team members.

I've attached my resume for reference. Thank you so much for your time!

Best regards,
[Your Name]
[LinkedIn / GitHub Link]`
  },
  "product-manager": {
    role: "Product Manager",
    title: "Cold Email Template for Product Managers",
    description: "A data-driven cold email template specifically designed for PMs to land interviews by highlighting user-centric thinking and metrics.",
    subject: "Connecting regarding Product Management at [Company Name] — [Your Name]",
    body: `Hi [Recipient Name],

I hope you're having a great day.

I'm reaching out because I'm a huge fan of [Company Name] and love your user-centric approach to [industry problem]. 

I'm a Product Manager with a background in [Software engineering / data analysis] where I previously launched [notable product], resulting in [notable metric, e.g., +20% engagement]. I love shipping products that solve real customer problems and believe my analytical background would match the product goals for [specific product line].

I'd love to grab 5 minutes to learn about your path to Product Management and what makes a PM successful at [Company Name].

Warmly,
[Your Name]
[LinkedIn Profile]`
  },
  "data-scientist": {
    role: "Data Scientist",
    title: "Cold Email Template for Data Scientists",
    description: "Land your next Data Science role with this cold email template that highlights your modeling experience and business impact.",
    subject: "Data Science Opportunities — [Your Name] / [Key ML Skill]",
    body: `Hi [Recipient Name],

Hope you're doing well!

I noticed [Company Name] is scaling its data team, and I wanted to introduce myself. I am a Data Scientist specializing in [Machine Learning / NLP / Data Engineering], and I recently [mention a specific model or analysis you built that drove business value, e.g., built a churn prediction model that saved $50k].

I really admire how your team leverages data to [Company's mission or specific feature]. 

Would you be open to a brief 5-minute chat? I'd love to learn more about the data infrastructure at [Company Name] and see if my background is a fit for your upcoming projects.

Best,
[Your Name]
[Portfolio / GitHub Link]`
  },
  "marketing-manager": {
    role: "Marketing Manager",
    title: "Cold Email Template for Marketing Managers",
    description: "A proven cold email template for Growth and Marketing Managers to highlight their campaign ROI and strategic thinking.",
    subject: "Marketing / Growth at [Company Name] — [Your Name]",
    body: `Hi [Recipient Name],

Hope your week is off to a great start.

I've been following [Company Name]'s recent campaigns, particularly the [mention a specific campaign or launch], and I was incredibly impressed by the execution. 

I'm a Marketing Manager with a track record of driving growth. Most recently at [Previous Company], I led a campaign that [mention specific metric, e.g., lowered CAC by 30% while scaling lead volume]. 

I'm very interested in the Marketing Manager role at [Company Name] and would love to hear your thoughts on where the growth team is heading next quarter. Are you free for a quick chat later this week?

Thanks for your time,
[Your Name]
[LinkedIn Profile]`
  },
  "sales-sdr": {
    role: "Sales / SDR",
    title: "Cold Email Template for Sales & SDRs",
    description: "Show off your prospecting skills. Use this cold email template to pitch yourself to Sales Managers and VPs of Sales.",
    subject: "Prospecting for [Company Name] — [Your Name]",
    body: `Hi [Recipient Name],

I'll keep this brief since I know you're busy hitting targets.

I'm reaching out because I want to sell for [Company Name]. I've been tracking your growth in the [Industry] space, and your product solves a massive pain point for [Target Audience].

In my last role, I consistently hit [X]% of quota and generated $[X] in new pipeline by executing outbound campaigns. I know how to prospect, I know how to handle objections, and I'm hungry to bring that to your team.

Are you open to a 5-minute call on [Day] at [Time] to discuss how I can help [Company Name] accelerate revenue?

Best,
[Your Name]
[LinkedIn Profile]`
  }
}

export function generateStaticParams() {
  return Object.keys(templateData).map((role) => ({
    role: role,
  }))
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const template = templateData[resolvedParams.role]
  
  if (!template) return { title: 'Cold Email Template' }
  
  return {
    title: template.title + " | TrackrAI Resources",
    description: template.description,
  }
}

export default async function TemplatePage({ params }) {
  const resolvedParams = await params;
  const template = templateData[resolvedParams.role];
  
  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans py-12 relative overflow-hidden selection:bg-indigo-500/30">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-12">
        <header className="space-y-6">
          <Link href="/resources/cold-email-templates" className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-indigo-400 transition-colors">
            <ArrowLeft size={12} />
            Back to All Templates
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-black gradient-text mb-4">{template.title}</h1>
            <p className="text-white/60 text-lg">{template.description}</p>
          </div>
        </header>

        <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="px-6 py-5 border-b border-white/10 bg-white/5 flex items-center justify-between gap-4">
            <h3 className="font-bold text-sm text-white/90 flex items-center gap-2">
              <Mail size={16} className="text-indigo-400" />
              {template.role} Template
            </h3>
            <CopyButton subject={template.subject} body={template.body} />
          </div>

          <div className="p-8 space-y-6 text-sm font-mono leading-relaxed bg-[#020208]/60">
            <div className="pb-4 border-b border-white/5 flex flex-col md:flex-row md:items-center gap-2">
              <span className="text-white/30 select-none">Subject:</span>
              <span className="text-indigo-300 font-semibold">{template.subject}</span>
            </div>
            <pre className="whitespace-pre-wrap text-white/80 font-sans tracking-wide leading-loose text-sm">{template.body}</pre>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 bg-gradient-to-r from-indigo-950/20 to-[#080820] text-center space-y-5 border border-indigo-500/20">
          <Sparkles size={28} className="text-indigo-400 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold">Tired of copying and pasting?</h2>
          <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
            Create a free TrackrAI account to automatically generate highly-personalized cold emails based on your exact resume and target job.
          </p>
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
          >
            <span>Automate My Outreach</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
