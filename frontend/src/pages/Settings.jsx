import { useState, useEffect } from 'react'
import { useApplications } from '../hooks/useApplications'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon, Download, Trash2, Database,
  User, Shield, FileText, Save, Mail
} from 'lucide-react'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import toast from 'react-hot-toast'
import api from '../api/applications'

function Section({ title, description, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <Icon size={16} className="text-indigo-400" />
        </div>
        <div>
          <h2 className="font-semibold text-white text-sm">{title}</h2>
          {description && <p className="text-xs text-white/35 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </motion.div>
  )
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-white/35 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export default function Settings() {
  useDocumentTitle('Settings')
  const { applications, clearApplications } = useApplications()
  const [confirmClear, setConfirmClear] = useState(false)
  const [clearing, setClearing] = useState(false)

  // ── User Profile ──────────────────────────────────────────────
  const [currentPosition, setCurrentPosition] = useState('')
  const [currentCompany, setCurrentCompany] = useState('')
  const [bio, setBio] = useState('')
  const [gmailConnected, setGmailConnected] = useState(false)
  const [gmailSyncEnabled, setGmailSyncEnabled] = useState(false)
  const [lastGmailSync, setLastGmailSync] = useState('')
  const [syncingGmail, setSyncingGmail] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileSaving, setProfileSaving] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/auth/profile')
        setCurrentPosition(res.data.current_position || '')
        setCurrentCompany(res.data.current_company || '')
        setBio(res.data.bio || '')
        setGmailConnected(res.data.gmail_connected || false)
        setGmailSyncEnabled(res.data.gmail_sync_enabled || false)
        setLastGmailSync(res.data.last_gmail_sync || '')
      } catch (err) {
        console.error('Failed to load profile', err)
      } finally {
        setProfileLoading(false)
      }
    }
    fetchProfile()
  }, [])

  async function saveProfile() {
    setProfileSaving(true)
    try {
      await api.put('/auth/profile', {
        current_position: currentPosition,
        current_company: currentCompany,
        bio: bio
      })
      toast.success('Profile settings updated!')
    } catch (err) {
      console.error('Failed to save profile settings', err)
      toast.error('Failed to save profile settings')
    } finally {
      setProfileSaving(false)
    }
  }

  // ── Gmail Integration ─────────────────────────────────────────
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
      
      const count = res.data.updated_applications?.length || 0
      if (count > 0) {
        toast.success(`Sync completed! Updated ${count} application status(es).`)
        setTimeout(() => window.location.reload(), 1500)
      } else {
        toast.success('Sync completed. No new status updates found.')
      }
    } catch (err) {
      console.error('Failed to run Gmail sync', err)
      toast.error(err.response?.data?.detail || 'Failed to sync Gmail messages.')
    } finally {
      setSyncingGmail(false)
    }
  }

  // ── Resume ────────────────────────────────────────────────────
  const [resumeText, setResumeText] = useState('')
  const [resumeLoading, setResumeLoading] = useState(true)
  const [resumeSaving, setResumeSaving] = useState(false)

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await api.get('/auth/resume')
        setResumeText(res.data.resume_text || '')
      } catch (err) {
        console.error('Failed to load resume', err)
      } finally {
        setResumeLoading(false)
      }
    }
    fetchResume()
  }, [])

  async function saveResume() {
    setResumeSaving(true)
    try {
      await api.put('/auth/resume', { resume_text: resumeText })
      toast.success('Resume saved!')
    } catch (err) {
      console.error('Failed to save resume', err)
      toast.error('Failed to save resume')
    } finally {
      setResumeSaving(false)
    }
  }

  // ── Export as JSON ───────────────────────────────────────────
  function exportJSON() {
    if (!applications.length) { toast.error('No applications to export.'); return }
    const blob = new Blob([JSON.stringify(applications, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trackrai-export-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported as JSON!')
  }

  // ── Export as CSV ────────────────────────────────────────────
  function exportCSV() {
    if (!applications.length) { toast.error('No applications to export.'); return }
    const headers = ['ID', 'Company', 'Role', 'Status', 'Applied Date', 'Job Link', 'Notes', 'Created At', 'Updated At']
    const rows = applications.map(a => [
      a.id, a.company, a.role, a.status,
      a.applied_date || '',
      a.link || '',
      (a.notes || '').replace(/\n/g, ' '),
      a.created_at, a.updated_at,
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trackrai-export-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported as CSV!')
  }

  // ── Clear all data ───────────────────────────────────────────
  async function clearAllData() {
    setClearing(true)
    try {
      await clearApplications()
    } catch {
      // Error handled by context
    } finally {
      setClearing(false)
      setConfirmClear(false)
    }
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <header>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
              <SettingsIcon size={18} className="text-white/50" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          </div>
          <p className="text-white/40 text-sm ml-12">Manage your account, data, and preferences.</p>
        </header>

        {/* Profile */}
        <Section icon={User} title="Profile" description="Your account and job search profile details">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
              RP
            </div>
            <div>
              <p className="font-semibold text-white">Rajdeep Pal</p>
              <p className="text-xs text-indigo-400">Premium User</p>
              <p className="text-xs text-white/30 mt-0.5">{applications.length} application{applications.length !== 1 ? 's' : ''} tracked</p>
            </div>
          </div>
          <div className="h-px bg-white/5 my-4" />
          {profileLoading ? (
            <div className="h-40 rounded-xl bg-white/3 animate-pulse" />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/50 font-semibold uppercase tracking-wider">Current Position / Role</label>
                  <input
                    type="text"
                    value={currentPosition}
                    onChange={(e) => setCurrentPosition(e.target.value)}
                    placeholder="e.g. SWE Intern, Student, Unemployed"
                    className="w-full rounded-[6px] bg-white/3 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/50 font-semibold uppercase tracking-wider">Current Company / Organization</label>
                  <input
                    type="text"
                    value={currentCompany}
                    onChange={(e) => setCurrentCompany(e.target.value)}
                    placeholder="e.g. Google, University of Utah"
                    className="w-full rounded-[6px] bg-white/3 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/50 font-semibold uppercase tracking-wider">Bio & Pitch Highlights</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. B.Tech CSE student specializing in threat detection, security automation, and AI-security integration."
                  rows={3}
                  className="w-full rounded-[6px] bg-white/3 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                />
              </div>
              <div className="flex justify-end">
                <Button variant="primary" size="sm" icon={Save} onClick={saveProfile} loading={profileSaving}>
                  Save Profile Settings
                </Button>
              </div>
            </div>
          )}
        </Section>

        {/* Resume */}
        <Section icon={FileText} title="Resume" description="Paste your resume so AI Copilot can give tailored feedback and insights">
          {resumeLoading ? (
            <div className="h-40 rounded-xl bg-white/3 animate-pulse" />
          ) : (
            <>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here (plain text is fine — no need for formatting)..."
                rows={10}
                className="w-full rounded-xl bg-white/3 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/30">
                  {resumeText.trim() ? `${resumeText.trim().split(/\s+/).length} words` : 'No resume added yet'}
                </p>
                <Button variant="primary" size="sm" icon={Save} onClick={saveResume} loading={resumeSaving}>
                  Save Resume
                </Button>
              </div>
            </>
          )}
        </Section>

        {/* Gmail Sync (Premium) */}
        <Section icon={Mail} title="Gmail Automation (Premium)" description="Connect your inbox to automatically parse and synchronize job application updates in real time">
          {profileLoading ? (
            <div className="h-28 rounded-xl bg-white/3 animate-pulse" />
          ) : !gmailConnected ? (
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-bold uppercase tracking-wider">Premium Mode</span>
                <p className="text-sm font-semibold text-white">Gmail Integration is not connected</p>
                <p className="text-xs text-white/40 leading-relaxed font-medium max-w-md">
                  Authorize read-only access to search messages from recruiters. Gemini automatically extracts status updates and updates your pipeline.
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={connectGmail}>
                Connect Google Account
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between gap-4">
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
                >
                  Sync Inbox Now
                </Button>
              </div>

              <div className="h-px bg-white/5" />

              <SettingRow
                label="Enable Automated Sync"
                description="Automatically parse incoming messages to update application cards dynamically."
              >
                <button
                  onClick={() => toggleGmailSync(!gmailSyncEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${gmailSyncEnabled ? 'bg-indigo-600' : 'bg-white/10'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transition-transform ${gmailSyncEnabled ? 'translate-x-5' : ''}`} />
                </button>
              </SettingRow>
            </div>
          )}
        </Section>

        {/* Data & Export */}
        <Section icon={Database} title="Data & Export" description="Download or manage your application data">
          <SettingRow
            label="Export as JSON"
            description="Full data with all fields — perfect for backups or migration."
          >
            <Button variant="secondary" size="sm" icon={Download} onClick={exportJSON}>
              Export JSON
            </Button>
          </SettingRow>
          <div className="h-px bg-white/5" />
          <SettingRow
            label="Export as CSV"
            description="Open in Excel, Sheets, or any spreadsheet app."
          >
            <Button variant="secondary" size="sm" icon={Download} onClick={exportCSV}>
              Export CSV
            </Button>
          </SettingRow>
        </Section>

        {/* App Info */}
        <Section icon={Shield} title="Application" description="Version and system information">
          {[
            { label: 'Version', value: 'v1.0.0' },
            { label: 'Backend', value: 'FastAPI + SQLite' },
            { label: 'Frontend', value: 'React 19 + Vite + Tailwind v4' },
            { label: 'Total Applications', value: String(applications.length) },
          ].map(({ label, value }) => (
            <SettingRow key={label} label={label}>
              <span className="text-xs text-white/40 font-mono bg-white/5 px-2.5 py-1 rounded-lg">{value}</span>
            </SettingRow>
          ))}
        </Section>

        {/* Danger Zone */}
        <Section icon={Trash2} title="Danger Zone" description="Irreversible actions — proceed with caution">
          <SettingRow
            label="Clear All Data"
            description={`Permanently delete all ${applications.length} application${applications.length !== 1 ? 's' : ''} and activity logs.`}
          >
            <button
              onClick={() => setConfirmClear(true)}
              disabled={applications.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Trash2 size={12} />
              Clear All
            </button>
          </SettingRow>
        </Section>

        <ConfirmDialog
          open={confirmClear}
          onCancel={() => setConfirmClear(false)}
          onConfirm={clearAllData}
          loading={clearing}
          title="Delete All Applications?"
          message={`This will permanently delete all ${applications.length} applications and clear your activity log. This cannot be undone.`}
          confirmLabel="Delete Everything"
        />
      </div>
    </div>
  )
}