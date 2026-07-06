import { useState } from 'react'
import { useApplications } from '../hooks/useApplications'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon, Download, Trash2, Database,
  User, Shield
} from 'lucide-react'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import toast from 'react-hot-toast'

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
  const { applications, clearApplications } = useApplications()
  const [confirmClear, setConfirmClear] = useState(false)
  const [clearing, setClearing] = useState(false)

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
        <Section icon={User} title="Profile" description="Your account information">
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
