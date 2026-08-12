"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Mail, FileText } from 'lucide-react'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'
import api from '../../api/applications'

function SettingRow({ label, description, children }) {
 return (
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3">
 <div>
 <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{label}</h4>
 {description && <p className="text-xs text-gray-900 dark:text-gray-500 dark:text-white/50 leading-relaxed mt-1 max-w-md">{description}</p>}
 </div>
 <div className="shrink-0">{children}</div>
 </div>
 )
}

function Section({ title, description, icon: Icon, children }) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 className="glass bg-white/50 dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden"
 >
 <div className="px-6 py-5 border-b flex items-center gap-3">
 <div className="w-8 h-8 rounded-2xl bg-amber-500/10 flex items-center justify-center">
 <Icon size={16} className="text-amber-400" />
 </div>
 <div>
 <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
 {description && <p className="text-xs text-gray-900 dark:text-gray-500 dark:text-white/40 mt-0.5">{description}</p>}
 </div>
 </div>
 <div className="p-6">{children}</div>
 </motion.div>
 )
}

export default function PremiumFeatures() {
 const [profileLoading, setProfileLoading] = useState(true)
 const [gmailConnected, setGmailConnected] = useState(false)
 const [gmailSyncEnabled, setGmailSyncEnabled] = useState(false)
 const [lastGmailSync, setLastGmailSync] = useState('')
 const [isPremium, setIsPremium] = useState(false)
 const [gmailScansUsed, setGmailScansUsed] = useState(0)
 const [syncingGmail, setSyncingGmail] = useState(false)

 useEffect(() => {
 async function fetchProfile() {
 try {
 const res = await api.get('/auth/profile')
 setGmailConnected(res.data.gmail_connected || false)
 setGmailSyncEnabled(res.data.gmail_sync_enabled || false)
 setLastGmailSync(res.data.last_gmail_sync || '')
 setIsPremium(res.data.is_premium || false)
 setGmailScansUsed(res.data.gmail_scans_used || 0)
 } catch (err) {
 console.error('Failed to load profile for premium page', err)
 } finally {
 setProfileLoading(false)
 }
 }
 fetchProfile()
 
 if (typeof window !== 'undefined') {
 const params = new URLSearchParams(window.location.search)
 const code = params.get('code')
 const nonce = params.get('nonce')
 const state = params.get('state')
 const error = params.get('error')

 if (error) {
 toast.error(`Google Connection Failed: ${error}`)
 window.history.replaceState({}, document.title, window.location.pathname)
 } else if (code && nonce && state) {
 const savedNonce = localStorage.getItem('oauth_nonce')
 if (nonce !== savedNonce) {
 toast.error('Security verification failed (CSRF attempt detected). Please try again.')
 window.history.replaceState({}, document.title, window.location.pathname)
 } else {
 localStorage.removeItem('oauth_nonce')
 api.post('/gmail/connect', { code, state })
 .then(() => {
 toast.success('Successfully connected to Gmail!')
 setGmailConnected(true)
 setGmailSyncEnabled(true)
 window.history.replaceState({}, document.title, window.location.pathname)
 })
 .catch(err => {
 toast.error(err.response?.data?.detail || 'Failed to connect Google account.')
 window.history.replaceState({}, document.title, window.location.pathname)
 })
 }
 }
 }
 }, [])

 async function connectGmail() {
 const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
 localStorage.setItem('oauth_nonce', nonce)
 
 try {
 const res = await api.get(`/gmail/auth-url?nonce=${nonce}`)
 window.location.href = res.data.auth_url
 } catch (err) {
 console.error('Failed to get Gmail OAuth URL', err)
 const errMsg = err.response?.data?.detail || 'Failed to initialize Google connection.'
 toast.error(errMsg)
 }
 }

 async function toggleGmailSync(enabled) {
 try {
 await api.post(`/gmail/toggle?enabled=${enabled}`)
 setGmailSyncEnabled(enabled)
 toast.success(enabled ? 'Gmail auto-sync enabled!' : 'Gmail sync disabled.')
 } catch (err) {
 console.error('Failed to toggle Gmail sync', err)
 toast.error(err.response?.data?.detail || 'Failed to toggle Gmail sync settings.')
 }
 }

 async function disconnectGmail() {
 try {
 await api.post('/gmail/disconnect')
 setGmailConnected(false)
 setGmailSyncEnabled(false)
 toast.success('Gmail disconnected successfully.')
 } catch (err) {
 console.error('Failed to disconnect Gmail', err)
 toast.error('Failed to disconnect Gmail.')
 }
 }

 async function triggerSync() {
 setSyncingGmail(true)
 try {
 const res = await api.post('/gmail/sync')
 setLastGmailSync(res.data.last_gmail_sync || '')
 
 console.log('Gmail Scan Diagnostics:', res.data.scanned_emails)
 
 const count = res.data.updated_applications?.length || 0
 if (count > 0) {
 toast.success(`Sync completed! Updated ${count} application status(es).`)
 setTimeout(() => window.location.reload(), 1500)
 } else {
 toast.success('Sync completed. No new status updates found.')
 }
 
 if (!isPremium) {
 setGmailScansUsed(prev => prev + 1)
 }
 } catch (err) {
 console.error('Failed to run Gmail sync', err)
 toast.error(err.response?.data?.detail || 'Failed to sync Gmail messages.')
 } finally {
 setSyncingGmail(false)
 }
 }

 const loadRazorpay = () => {
 return new Promise((resolve) => {
 const script = document.createElement('script')
 script.src = 'https://checkout.razorpay.com/v1/checkout.js'
 script.onload = () => resolve(true)
 script.onerror = () => resolve(false)
 document.body.appendChild(script)
 })
 }

 async function handleUpgradePremium() {
 try {
 const res = await loadRazorpay()
 if (!res) {
 toast.error('Razorpay SDK failed to load. Are you online?')
 return
 }
 
 const orderRes = await api.post('/payments/create-razorpay-order')
 const { id, amount, currency } = orderRes.data

 const options = {
 key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Changed to NEXT_PUBLIC_
 amount: amount,
 currency: currency,
 name: 'TrackrAI',
 description: '6-Month Premium Pass',
 order_id: id,
 handler: async function (response) {
 try {
 await api.post('/payments/verify-payment', {
 razorpay_payment_id: response.razorpay_payment_id,
 razorpay_order_id: response.razorpay_order_id,
 razorpay_signature: response.razorpay_signature,
 })
 toast.success('Payment successful! Welcome to Premium.')
 setIsPremium(true)
 } catch (err) {
 toast.error('Payment verification failed.')
 }
 },
 prefill: {
 name: 'TrackrAI User',
 },
 theme: {
 color: '#4f46e5',
 },
 }
 
 const paymentObject = new window.Razorpay(options)
 paymentObject.open()
 
 } catch (err) {
 const errorMessage = err.response?.data?.detail || 'Failed to initiate checkout. Please try again.'
 toast.error(errorMessage)
 }
 }

 async function handleCancelPremium() {
 toast('You are on a one-time 6-month pass. It will automatically expire without auto-renewing.', { icon: 'ℹ️' })
 }

 return (
 <div className="h-full overflow-y-auto">
 <div className="max-w-4xl mx-auto p-8 lg:p-10 pb-32 space-y-8">
 
 <header className="mb-8">
 <h1 className="text-3xl font-bold gradient-text">Premium Features</h1>
 <p className="text-gray-900 dark:text-gray-500 dark:text-white/40 text-sm mt-1">Manage your plan and access advanced automation tools.</p>
 </header>

 <Section icon={Zap} title="Subscription & Billing" description="Manage your current plan">
 {!profileLoading ? (
 <div className="p-4 rounded-3xl bg-black/5 dark:bg-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div>
 <h3 className="text-gray-900 dark:text-white font-bold flex items-center gap-2">
 {isPremium ? 'Premium Tier' : 'Free Tier'}
 {isPremium && <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider">Active</span>}
 </h3>
 <p className="text-xs text-gray-900 dark:text-gray-500 dark:text-white/50 mt-1">
 {isPremium 
 ? 'You have unlimited access to all premium features including automated email sync.' 
 : 'Access to basic tracking. Try our premium Gmail scanner with 2 free scans.'}
 </p>
 </div>
 {!isPremium ? (
 <Button variant="primary" onClick={handleUpgradePremium}>
 ✨ Upgrade to Premium
 </Button>
 ) : (
 <Button variant="danger" size="sm" onClick={handleCancelPremium} className="opacity-80 hover:opacity-100">
 Manage Subscription
 </Button>
 )}
 </div>
 ) : (
 <div className="h-24 rounded-3xl bg-black/5 dark:bg-white/3 animate-pulse" />
 )}
 </Section>

 <Section icon={FileText} title="Multi-Resume Manager" description="Manage multiple resumes tailored for different roles">
 <div className="p-4 rounded-3xl bg-purple-500/5 border border-purple-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div className="space-y-1">
 <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-bold uppercase tracking-wider">Premium Feature</span>
 <p className="text-sm font-semibold text-gray-900 dark:text-white">Unlock Unlimited Resumes</p>
 <p className="text-xs text-gray-900 dark:text-gray-500 dark:text-white/40 leading-relaxed font-medium max-w-md">
 Free users can save up to 2 resumes. Upgrade to Premium to save unlimited customized resumes for different roles and instantly use them across all AI Copilot tools.
 </p>
 </div>
 {!isPremium && (
 <Button variant="primary" size="sm" onClick={handleUpgradePremium}>
 Upgrade
 </Button>
 )}
 </div>
 </Section>

 <Section icon={Mail} title="AI Gmail Sync" description="Connect your inbox to automatically parse and synchronize job application updates in real time">
 <div className="space-y-4">
 {profileLoading ? (
 <div className="h-28 rounded-3xl bg-black/5 dark:bg-white/3 animate-pulse" />
 ) : !gmailConnected ? (
 <div className="p-4 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div className="space-y-1">
 <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-bold uppercase tracking-wider">Premium Feature</span>
 <p className="text-sm font-semibold text-gray-900 dark:text-white">Gmail Integration is not connected</p>
 <p className="text-xs text-gray-900 dark:text-gray-500 dark:text-white/40 leading-relaxed font-medium max-w-md">
 Authorize read-only access to search messages from recruiters. Gemini automatically extracts status updates and updates your pipeline.
 </p>
 </div>
 <Button variant="secondary" size="sm" onClick={connectGmail}>
 Connect Google Account
 </Button>
 </div>
 ) : (
 <div className="space-y-6">
 <div className="p-4 rounded-3xl border flex flex-col gap-4 bg-emerald-500/5 border-emerald-500/10">
 <div className="flex items-center justify-between">
 <div className="space-y-0.5">
 <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
 Connected to Gmail
 </p>
 <p className="text-xs text-gray-900 dark:text-gray-500 dark:text-white/35 font-medium">
 Last scanned: {lastGmailSync ? new Date(lastGmailSync).toLocaleString() : 'Never'}
 </p>
 </div>
 
 <div className="flex gap-2">
 <Button
 variant="danger"
 size="sm"
 onClick={disconnectGmail}
 className="bg-red-500/10 text-red-400 hover:bg-red-500/20"
 >
 Disconnect
 </Button>
 <Button
 variant="secondary"
 size="sm"
 loading={syncingGmail}
 onClick={triggerSync}
 disabled={!isPremium && gmailScansUsed >= 2}
 className={!isPremium && gmailScansUsed >= 2 ? 'opacity-50 cursor-not-allowed' : ''}
 >
 {syncingGmail ? 'Scanning Inbox...' : 'Scan Now'}
 </Button>
 </div>
 </div>

 {!isPremium && (
 <div className="pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/5">
 <span className="text-xs font-semibold text-gray-900 dark:text-gray-500 dark:text-white/50">Free Tier Usage</span>
 <span className={`text-xs font-bold ${gmailScansUsed >= 2 ? 'text-red-400' : 'text-amber-400'}`}>
 {gmailScansUsed} / 2 Scans Used
 </span>
 </div>
 )}
 </div>

 <div className="h-px bg-black/5 dark:bg-white/5" />

 <SettingRow
 label={<span className="flex items-center gap-2">Enable Automated Sync <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[8px] font-bold uppercase tracking-wider">Premium</span></span>}
 description="Automatically parse incoming messages to update application cards dynamically."
 >
 <button
 onClick={() => {
 if (!isPremium) {
 toast.error('Automated Sync requires Premium.')
 return
 }
 toggleGmailSync(!gmailSyncEnabled)
 }}
 className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${gmailSyncEnabled ? 'bg-indigo-600' : 'bg-black/10 dark:bg-white/10'}`}
 >
 <span className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transition-transform ${gmailSyncEnabled ? 'translate-x-5' : ''}`} />
 </button>
 </SettingRow>
 </div>
 )}
 </div>
 </Section>
 
 </div>
 </div>
 )
}
