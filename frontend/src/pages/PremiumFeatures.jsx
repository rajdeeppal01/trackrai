import { useState, useEffect } from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { motion } from 'framer-motion'
import { Zap, Mail, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'
import api from '../api/applications'

function SettingRow({ label, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3">
      <div>
        <h4 className="text-sm font-semibold text-white">{label}</h4>
        {description && <p className="text-xs text-white/50 leading-relaxed mt-1 max-w-md">{description}</p>}
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
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <Icon size={16} className="text-amber-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{title}</h2>
          {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  )
}

export default function PremiumFeatures() {
  useDocumentTitle('Premium Features')

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
  }, [])

  async function connectGmail() {
    const localToken = localStorage.getItem('trackrai_token')
    try {
      const res = await api.get(`/gmail/auth-url?token=${localToken}`)
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

  async function handleUpgradePremium() {
    try {
      const res = await api.post('/auth/upgrade-premium')
      setIsPremium(res.data.is_premium)
      toast.success('Successfully upgraded to Premium Mode!')
    } catch (err) {
      toast.error('Failed to upgrade.')
    }
  }

  async function handleCancelPremium() {
    try {
      const res = await api.post('/auth/cancel-premium')
      setIsPremium(res.data.is_premium)
      toast.success('Successfully downgraded to Free Tier.')
    } catch (err) {
      toast.error('Failed to cancel subscription.')
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 lg:p-10 pb-32 space-y-8">
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Premium Features</h1>
          <p className="text-white/40 text-sm mt-1">Manage your plan and access advanced automation tools.</p>
        </header>

        <Section icon={Zap} title="Subscription & Billing" description="Manage your current plan">
          {!profileLoading ? (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-bold flex items-center gap-2">
                  {isPremium ? 'Premium Tier' : 'Free Tier'}
                  {isPremium && <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider">Active</span>}
                </h3>
                <p className="text-xs text-white/50 mt-1">
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
                  Cancel Subscription
                </Button>
              )}
            </div>
          ) : (
            <div className="h-24 rounded-xl bg-white/3 animate-pulse" />
          )}
        </Section>

        <Section icon={Mail} title="AI Gmail Sync" description="Connect your inbox to automatically parse and synchronize job application updates in real time">
          <div className="space-y-4">
            {profileLoading ? (
              <div className="h-28 rounded-xl bg-white/3 animate-pulse" />
            ) : !gmailConnected ? (
              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-bold uppercase tracking-wider">Premium Feature</span>
                  <p className="text-sm font-semibold text-white">Gmail Integration is not connected</p>
                  <p className="text-xs text-white/40 leading-relaxed font-medium max-w-md">
                    Authorize read-only access to search messages from recruiters. Gemini automatically extracts status updates and updates your pipeline.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={connectGmail}>
                  Connect Google Account
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 rounded-xl border flex flex-col gap-4 bg-emerald-500/5 border-emerald-500/10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Connected to Gmail
                      </p>
                      <p className="text-xs text-white/35 font-medium">
                        Last scanned: {lastGmailSync ? new Date(lastGmailSync).toLocaleString() : 'Never'}
                      </p>
                    </div>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={syncingGmail}
                      onClick={triggerSync}
                      disabled={!isPremium && gmailScansUsed >= 2}
                      className={!isPremium && gmailScansUsed >= 2 ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {!isPremium && gmailScansUsed >= 2 ? '🔒 Locked (Requires Premium)' : 'Sync Inbox Now'}
                    </Button>
                  </div>

                  {!isPremium && (
                    <div className="pt-2 flex items-center justify-between border-t border-white/5">
                      <span className="text-xs font-semibold text-white/50">Free Tier Usage</span>
                      <span className={`text-xs font-bold ${gmailScansUsed >= 2 ? 'text-red-400' : 'text-amber-400'}`}>
                        {gmailScansUsed} / 2 Scans Used
                      </span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/5" />

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
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${gmailSyncEnabled ? 'bg-indigo-600' : 'bg-white/10'}`}
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
