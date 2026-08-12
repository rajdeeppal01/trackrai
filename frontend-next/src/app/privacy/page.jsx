"use client";

import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export default function PrivacyPolicy() {
 return (
 <div className="min-h-screen bg-[#050510] text-white font-sans overflow-x-hidden relative py-16 px-6">
 
 {/* Background Glow */}
 <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-indigo-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
 
 <div className="max-w-3xl mx-auto relative z-10">
 
 <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors mb-12">
 <ArrowLeft size={14} />
 Back to Home
 </Link>
 
 <header className="mb-12">
 <div className="w-12 h-12 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-6">
 <Shield size={24} className="text-indigo-400" />
 </div>
 <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Privacy Policy</h1>
 <p className="text-white/50 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
 </header>

 <div className="space-y-10 text-white/70 text-sm leading-relaxed">
 
 <section className="space-y-4">
 <h2 className="text-xl font-bold text-white">1. Introduction</h2>
 <p>
 Welcome to TrackrAI. We are committed to protecting your personal information and your right to privacy. 
 If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
 </p>
 </section>

 <section className="space-y-4">
 <h2 className="text-xl font-bold text-white">2. Google API Data Usage (Gmail Sync)</h2>
 <p>
 TrackrAI uses Google APIs to provide the "AI Gmail Sync" feature. TrackrAI's use and transfer to any other app of information received from Google APIs will adhere to <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements.
 </p>
 <ul className="list-disc pl-5 space-y-2 text-white/60">
 <li><strong>Scope of Access:</strong> We request read-only access to your Gmail messages solely to identify job application status updates from recruiters.</li>
 <li><strong>No Data Sharing:</strong> We do not sell, rent, or trade your email data with third parties.</li>
 <li><strong>AI Processing:</strong> Emails identified as job-related are processed by our secure AI engine to extract status updates (e.g., "Interview", "Offer").</li>
 </ul>
 </section>

 <section className="space-y-4">
 <h2 className="text-xl font-bold text-white">3. Information We Collect</h2>
 <p>
 We collect personal information that you voluntarily provide to us when registering on the application, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us.
 </p>
 <p>
 The personal information that we collect depends on the context of your interactions with us and the application, the choices you make and the products and features you use. The personal information we collect can include the following:
 </p>
 <ul className="list-disc pl-5 space-y-2 text-white/60">
 <li>Email Addresses</li>
 <li>Passwords</li>
 <li>Resume Text (if provided)</li>
 <li>Job Application tracking data (companies, roles, statuses)</li>
 </ul>
 </section>

 <section className="space-y-4">
 <h2 className="text-xl font-bold text-white">4. How We Use Your Information</h2>
 <p>
 We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
 </p>
 <ul className="list-disc pl-5 space-y-2 text-white/60">
 <li>To facilitate account creation and logon process.</li>
 <li>To provide the core functionality of the job tracking application.</li>
 <li>To generate AI-driven insights and draft cold emails using your provided resume and context.</li>
 </ul>
 </section>

 <section className="space-y-4">
 <h2 className="text-xl font-bold text-white">5. How We Keep Your Information Safe</h2>
 <p>
 We aim to protect your personal information through a system of organizational and technical security measures. Your passwords are encrypted, and we have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
 </p>
 </section>

 <section className="space-y-4">
 <h2 className="text-xl font-bold text-white">6. Your Privacy Rights</h2>
 <p>
 In some regions, you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.
 </p>
 <p>
 You can review, change, or terminate your account at any time by navigating to your Account Settings panel and selecting "Delete Account Data".
 </p>
 </section>

 </div>
 </div>
 </div>
 )
}
