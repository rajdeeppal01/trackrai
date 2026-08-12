"use client";

import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export default function TermsOfService() {
 return (
 <div className="min-h-screen bg-[#050510] text-white font-sans overflow-x-hidden relative py-16 px-6">
 
 {/* Background Glow */}
 <div className="fixed top-[20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-purple-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
 
 <div className="max-w-3xl mx-auto relative z-10">
 
 <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors mb-12">
 <ArrowLeft size={14} />
 Back to Home
 </Link>
 
 <header className="mb-12">
 <div className="w-12 h-12 rounded-3xl bg-purple-500/10 flex items-center justify-center mb-6">
 <FileText size={24} className="text-purple-400" />
 </div>
 <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Terms of Service</h1>
 <p className="text-white/50 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
 </header>

 <div className="space-y-10 text-white/70 text-sm leading-relaxed">
 
 <section className="space-y-4">
 <h2 className="text-xl font-bold text-white">1. Agreement to Terms</h2>
 <p>
 By viewing or using TrackrAI ("the Platform"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
 </p>
 </section>

 <section className="space-y-4">
 <h2 className="text-xl font-bold text-white">2. Use License</h2>
 <p>
 TrackrAI grants you a personal, non-exclusive, non-transferable, revocable license to access and use the Platform for tracking job applications and generating career materials (like cold emails or resume insights) for your personal use.
 </p>
 <ul className="list-disc pl-5 space-y-2 text-white/60">
 <li>You must not use the Platform for any illegal or unauthorized purpose.</li>
 <li>You must not violate any laws in your jurisdiction (including but not limited to copyright laws).</li>
 <li>You must not attempt to hack, destabilize, or inject malicious code into the Platform.</li>
 </ul>
 </section>

 <section className="space-y-4">
 <h2 className="text-xl font-bold text-white">3. User Accounts</h2>
 <p>
 When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
 </p>
 <p>
 You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
 </p>
 </section>

 <section className="space-y-4">
 <h2 className="text-xl font-bold text-white">4. API and AI Services</h2>
 <p>
 TrackrAI utilizes external APIs, including Google Workspace APIs (for Gmail Sync) and Google Gemini (for AI inference). Your use of these specific features is subject to the availability and terms of those external providers. We do not guarantee 100% uptime or accuracy of AI-generated content.
 </p>
 </section>

 <section className="space-y-4">
 <h2 className="text-xl font-bold text-white">5. Intellectual Property</h2>
 <p>
 The Service and its original content, features, and functionality are and will remain the exclusive property of TrackrAI and its licensors.
 </p>
 </section>

 <section className="space-y-4">
 <h2 className="text-xl font-bold text-white">6. Termination</h2>
 <p>
 We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
 </p>
 <p>
 All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
 </p>
 </section>

 <section className="space-y-4">
 <h2 className="text-xl font-bold text-white">7. Changes</h2>
 <p>
 We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
 </p>
 </section>

 </div>
 </div>
 </div>
 )
}
