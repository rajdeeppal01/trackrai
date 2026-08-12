"use client";

import { useState } from 'react'
import { useApplications } from '../../hooks/useApplications'
import ApplicationGrid from '../../components/applications/ApplicationGrid'
import ApplicationTable from '../../components/dashboard/ApplicationTable'
import ApplicationForm from '../../components/applications/ApplicationForm'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { Briefcase, Plus, LayoutGrid, List } from 'lucide-react'

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
 const [viewMode, setViewMode] = useState('kanban') // 'kanban' | 'table'

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
 <div className="min-h-screen p-4 md:p-8 font-sans">
 <div className="max-w-7xl mx-auto space-y-8">

 <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
 <div>
 <div className="flex items-center gap-3 mb-1">
 <div className="w-9 h-9 rounded-3xl bg-indigo-500/15 flex items-center justify-center">
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

 <div className="space-y-4">
 <div className="flex justify-end gap-2">
 <div className="bg-white/5 rounded-2xl p-1 flex gap-1">
 <button
 onClick={() => setViewMode('kanban')}
 className={`p-1.5 rounded-3xl transition-colors ${viewMode === 'kanban' ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/40 hover:text-white/80'}`}
 title="Kanban View"
 >
 <LayoutGrid size={16} />
 </button>
 <button
 onClick={() => setViewMode('table')}
 className={`p-1.5 rounded-3xl transition-colors ${viewMode === 'table' ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/40 hover:text-white/80'}`}
 title="Table View"
 >
 <List size={16} />
 </button>
 </div>
 </div>

 {viewMode === 'kanban' ? (
 <ApplicationGrid
 applications={applications}
 loading={loading}
 submitting={submitting}
 onEdit={setEditTarget}
 onDelete={removeApplication}
 />
 ) : (
 <ApplicationTable 
 applications={applications} 
 onEdit={setEditTarget} 
 />
 )}
 </div>

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
