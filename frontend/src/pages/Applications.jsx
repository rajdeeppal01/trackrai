import React, { useState } from 'react'
import { useApplications } from '../hooks/useApplications'
import ApplicationGrid from '../components/applications/ApplicationGrid'
import ApplicationForm from '../components/applications/ApplicationForm'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { Briefcase, Plus } from 'lucide-react'

export default function Applications() {
  const {
    applications,
    loading,
    submitting,
    addApplication,
    editApplication,
    removeApplication,
  } = useApplications()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  async function handleAdd(data) {
    await addApplication(data)
    setIsAddOpen(false)
  }

  async function handleEdit(data) {
    if (!editTarget) return
    await editApplication(editTarget.id, data)
    setEditTarget(null)
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                <Briefcase size={18} className="text-indigo-400" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">Applications</h1>
            </div>
            <p className="text-white/40 text-sm ml-12">
              {applications.length > 0
                ? `${applications.length} total application${applications.length !== 1 ? 's' : ''}`
                : 'Your job application tracker.'}
            </p>
          </div>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddOpen(true)}
            className="shrink-0"
          >
            New Application
          </Button>
        </header>

        <ApplicationGrid
          applications={applications}
          loading={loading}
          submitting={submitting}
          onEdit={setEditTarget}
          onDelete={removeApplication}
        />

        <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Application">
          <ApplicationForm onSubmit={handleAdd} submitting={submitting} onCancel={() => setIsAddOpen(false)} />
        </Modal>

        <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Application">
          <ApplicationForm
            key={editTarget?.id}
            initialData={editTarget}
            onSubmit={handleEdit}
            submitting={submitting}
            onCancel={() => setEditTarget(null)}
          />
        </Modal>

      </div>
    </div>
  )
}
