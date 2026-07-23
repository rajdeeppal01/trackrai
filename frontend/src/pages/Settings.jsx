import { useState, useEffect } from 'react'
import { useApplications } from '../hooks/useApplications'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon, Download, Trash2, Database,
  User, Shield, FileText, Save, Puzzle, Copy, RefreshCw
} from 'lucide-react'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import toast from 'react-hot-toast'
import api from '../api/applications'
import { useAuth } from '../context/AuthContext'

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
  const { user } = useAuth()
  const { applications, clearApplications } = useApplications()
  const [confirmClear, setConfirmClear] = useState(false)
  const [clearing, setClearing] = useState(false)

  // ── User Profile ──────────────────────────────────────────────
  const [currentPosition, setCurrentPosition] = useState('')
  const [currentCompany, setCurrentCompany] = useState('')
  const [bio, setBio] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileSaving, setProfileSaving] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/auth/profile')
        setCurrentPosition(res.data.current_position || '')
        setCurrentCompany(res.data.current_company || '')
        setBio(res.data.bio || '')
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


  // ── Multi-Resume Manager ──────────────────────────────────────
  const [resumes, setResumes] = useState([])
  const [resumeLoading, setResumeLoading] = useState(true)
  const [resumeSaving, setResumeSaving] = useState(false)
  const [editingResumeId, setEditingResumeId] = useState(null)
  
  // Form state
  const [resumeName, setResumeName] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [resumeIsDefault, setResumeIsDefault] = useState(false)
  const [showResumeForm, setShowResumeForm] = useState(false)

  useEffect(() => {
    async function fetchResumes() {
      try {
        const res = await api.get('/resumes/')
        setResumes(res.data)
      } catch (err) {
        console.error('Failed to load resumes', err)
      } finally {
        setResumeLoading(false)
      }
    }
    fetchResumes()
  }, [])

  function openResumeForm(resume = null) {
    if (resume) {
      setEditingResumeId(resume.id)
      setResumeName(resume.name)
      setResumeText(resume.content)
      setResumeIsDefault(resume.is_default)
    } else {
      setEditingResumeId(null)
      setResumeName('')
      setResumeText('')
      setResumeIsDefault(resumes.length === 0) // First resume is default
    }
    setShowResumeForm(true)
  }

  function closeResumeForm() {
    setShowResumeForm(false)
    setEditingResumeId(null)
  }

  async function saveResume() {
    if (!resumeName.trim() || !resumeText.trim()) {
      toast.error('Name and content are required')
      return
    }
    setResumeSaving(true)
    try {
      const payload = {
        name: resumeName,
        content: resumeText,
        is_default: resumeIsDefault
      }
      
      if (editingResumeId) {
        const res = await api.put(`/resumes/${editingResumeId}`, payload)
        setResumes(prev => prev.map(r => r.id === editingResumeId ? res.data : (payload.is_default ? {...r, is_default: false} : r)))
        toast.success('Resume updated!')
      } else {
        const res = await api.post('/resumes/', payload)
        setResumes(prev => {
          const updated = payload.is_default ? prev.map(r => ({...r, is_default: false})) : prev
          return [...updated, res.data]
        })
        toast.success('Resume created!')
      }
      closeResumeForm()
    } catch (err) {
      console.error('Failed to save resume', err)
      toast.error('Failed to save resume')
    } finally {
      setResumeSaving(false)
    }
  }
  
  async function deleteResume(id) {
    if (!confirm('Are you sure you want to delete this resume?')) return
    try {
      await api.delete(`/resumes/${id}`)
      setResumes(prev => prev.filter(r => r.id !== id))
      toast.success('Resume deleted')
    } catch (err) {
      toast.error('Failed to delete resume')
    }
  }

  // ── Chrome Extension ──────────────────────────────────────────
  const [extensionToken, setExtensionToken] = useState(null)
  const [tokenLoading, setTokenLoading] = useState(true)
  const [generatingToken, setGeneratingToken] = useState(false)

  useEffect(() => {
    async function fetchExtensionToken() {
      try {
        const res = await api.get('/auth/extension-token')
        if (res.data.has_token) {
          setExtensionToken('•••••••••••••••• (Hidden for security)')
        } else {
          setExtensionToken(null)
        }
      } catch (err) {
        console.error('Failed to fetch extension token', err)
      } finally {
        setTokenLoading(false)
      }
    }
    fetchExtensionToken()
  }, [])

  async function generateNewToken() {
    setGeneratingToken(true)
    try {
      const res = await api.post('/auth/extension-token')
      setExtensionToken(res.data.extension_token)
      toast.success('Generated new Extension Token!')
    } catch (err) {
      toast.error('Failed to generate token')
    } finally {
      setGeneratingToken(false)
    }
  }

  function copyToken() {
    if (extensionToken && !extensionToken.includes('Hidden')) {
      navigator.clipboard.writeText(extensionToken)
      toast.success('Token copied to clipboard')
    } else {
      toast.error('Please generate a new token to copy it.')
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
              <p className="font-semibold text-white">{user?.email || 'User'}</p>
              <p className={`text-xs ${user?.is_premium ? 'text-indigo-400' : 'text-white/50'}`}>
                {user?.is_premium ? 'Premium User' : 'Free User'}
              </p>
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
        <Section icon={FileText} title="Resumes" description="Manage your resumes for tailored AI Copilot feedback">
          {resumeLoading ? (
            <div className="h-40 rounded-xl bg-white/3 animate-pulse" />
          ) : (
            <div className="space-y-4">
              {!showResumeForm ? (
                <>
                  {resumes.length === 0 ? (
                    <div className="text-center py-6 text-white/40 text-sm bg-white/5 rounded-xl border border-white/5">
                      No resumes found. Add one to get started.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {resumes.map(resume => (
                        <div key={resume.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/10 group">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-white">{resume.name}</h3>
                              {resume.is_default && (
                                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/30 mt-1">{resume.content.trim().split(/\s+/).length} words</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openResumeForm(resume)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                              <SettingsIcon size={14} />
                            </button>
                            <button onClick={() => deleteResume(resume.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2">
                    {!user?.is_premium && (
                      <p className="text-xs text-white/50">
                        {resumes.length}/2 free resumes used.
                      </p>
                    )}
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => openResumeForm()}
                      disabled={!user?.is_premium && resumes.length >= 2}
                      className={!user?.is_premium && resumes.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      + Add Resume
                    </Button>
                  </div>
                  {!user?.is_premium && resumes.length >= 2 && (
                    <div className="mt-2 text-xs text-orange-400/80 bg-orange-500/10 p-2 rounded-lg border border-orange-500/20 text-center">
                      Free users can only add up to 2 resumes. Upgrade to Premium to add more.
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div>
                    <label className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1 block">Resume Name</label>
                    <input
                      type="text"
                      value={resumeName}
                      onChange={(e) => setResumeName(e.target.value)}
                      placeholder="e.g. Frontend Engineer, Product Manager"
                      className="w-full rounded-[6px] bg-black/40 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1 block">Resume Content</label>
                    <textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your resume text here (plain text is fine)..."
                      rows={10}
                      className="w-full rounded-[6px] bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="default-resume"
                      checked={resumeIsDefault}
                      onChange={(e) => setResumeIsDefault(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-indigo-500/50"
                    />
                    <label htmlFor="default-resume" className="text-sm text-white/70 cursor-pointer">Set as default resume</label>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button variant="secondary" size="sm" onClick={closeResumeForm}>Cancel</Button>
                    <Button variant="primary" size="sm" icon={Save} onClick={saveResume} loading={resumeSaving}>
                      Save Resume
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Section>

        {/* Chrome Extension */}
        <Section icon={Puzzle} title="Chrome Extension Integration" description="Connect the official TrackrAI 1-Click Chrome Clipper">
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              The TrackrAI Chrome Extension allows you to save jobs from LinkedIn and Indeed with one click. 
              To connect it, generate a token below and paste it into the extension's settings.
            </p>
            {tokenLoading ? (
              <div className="h-10 rounded-xl bg-white/3 animate-pulse" />
            ) : (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value={extensionToken || 'No token generated yet'}
                  className={`flex-1 rounded-xl bg-black/40 border ${extensionToken ? 'border-emerald-500/30 text-emerald-300' : 'border-white/10 text-white/30'} px-4 py-3 text-sm font-mono focus:outline-none`}
                />
                {extensionToken && !extensionToken.includes('Hidden') && (
                  <Button variant="secondary" onClick={copyToken} icon={Copy} size="sm">
                    Copy
                  </Button>
                )}
                <Button 
                  variant="primary" 
                  onClick={generateNewToken} 
                  loading={generatingToken} 
                  icon={RefreshCw} 
                  size="sm"
                  className={extensionToken ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : ''}
                >
                  {extensionToken ? 'Regenerate' : 'Generate Token'}
                </Button>
              </div>
            )}
            {extensionToken && (
              <p className="text-xs text-orange-400/80 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                Warning: Anyone with this token can save jobs to your account. Do not share it publicly.
              </p>
            )}
          </div>
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