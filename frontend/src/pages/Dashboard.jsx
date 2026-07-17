import { useState, useEffect } from 'react';
import { useApplications } from '../hooks/useApplications';
import useDocumentTitle from '../hooks/useDocumentTitle';
import StatsRow from '../components/dashboard/StatsRow';
import ApplicationChart from '../components/dashboard/ApplicationChart';
import AIInsights from '../components/dashboard/AIInsights';
import UpcomingSection from '../components/dashboard/UpcomingSection';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import PremiumPromo from '../components/dashboard/PremiumPromo';
import ApplicationGrid from '../components/applications/ApplicationGrid';
import ApplicationTable from '../components/dashboard/ApplicationTable';
import ApplicationForm from '../components/applications/ApplicationForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Plus, LayoutGrid, List } from 'lucide-react';

export default function Dashboard() {
  useDocumentTitle('Dashboard');
  const {
    applications,
    loading,
    submitting,
    activity,
    addApplication,
    editApplication,
    removeApplication,
  } = useApplications();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // application object or null
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'

  // ── Global Command Palette Listener ──────────────────────────
  useEffect(() => {
    const handleOpenModal = () => setIsAddModalOpen(true);
    window.addEventListener('open-new-application', handleOpenModal);
    return () => window.removeEventListener('open-new-application', handleOpenModal);
  }, []);

  // ── Handlers ────────────────────────────────────────────────
  async function handleAdd(data) {
    await addApplication(data);
    setIsAddModalOpen(false);
  }

  async function handleEdit(data) {
    if (!editTarget) return;
    await editApplication(editTarget.id, data);
    setEditTarget(null);
  }

  function openEdit(application) {
    setEditTarget(application);
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              TrackrAI Dashboard
            </h1>
            <p className="text-white/40 mt-1 text-sm">
              {applications.length > 0
                ? `Tracking ${applications.length} application${applications.length !== 1 ? 's' : ''}`
                : 'Manage and analyze your job applications.'}
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            icon={Plus}
            className="shrink-0"
          >
            New Application
          </Button>
        </header>

        {/* Stats Row */}
        <StatsRow applications={applications} loading={loading} />

        {/* Chart + AI Insights + Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ApplicationChart applications={applications} />
            <PremiumPromo />
          </div>
          <div className="space-y-6">
            <AIInsights applications={applications} loading={loading} />
            <UpcomingSection
              applications={applications}
              loading={loading}
              onEdit={openEdit}
            />
          </div>
        </div>

        {/* Applications Grid/Table + Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-3 space-y-4">
            {/* View Toggle */}
            <div className="flex justify-end gap-2">
              <div className="bg-white/5 border border-white/10 rounded-lg p-1 flex gap-1">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/40 hover:text-white/80'}`}
                  title="Kanban View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/40 hover:text-white/80'}`}
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
                onEdit={openEdit}
                onDelete={removeApplication}
              />
            ) : (
              <ApplicationTable 
                applications={applications} 
                onEdit={openEdit} 
              />
            )}
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed activity={activity} />
          </div>
        </div>

        {/* ── Add Application Modal ─────────────────────────────── */}
        <Modal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Application"
        >
          <ApplicationForm
            onSubmit={handleAdd}
            submitting={submitting}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Modal>

        {/* ── Edit Application Modal ────────────────────────────── */}
        <Modal
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          title="Edit Application"
        >
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
  );
}