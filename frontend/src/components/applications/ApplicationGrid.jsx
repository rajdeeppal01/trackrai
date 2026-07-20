import { useState, useMemo } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import ApplicationCard from './ApplicationCard';
import KanbanColumn from './KanbanColumn';
import { ApplicationCardSkeleton } from '../ui/Skeletons';
import ConfirmDialog from '../ui/ConfirmDialog';
import { STATUS_CONFIG } from '../../utils/statusConfig';
import { Search, Plus, Inbox } from 'lucide-react';
import { useApplications } from '../../hooks/useApplications';
import toast from 'react-hot-toast';

export default function ApplicationGrid({ applications = [], loading, onEdit, onDelete, submitting }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null); // { id, company, role }
  const [activeDragId, setActiveDragId] = useState(null);

  const { editApplication } = useApplications();

  const statusKeys = useMemo(() => Object.keys(STATUS_CONFIG), []);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      return (app.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
             (app.role || '').toLowerCase().includes(searchTerm.toLowerCase());
    }).sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
  }, [applications, searchTerm]);

  // Group into columns
  const columns = useMemo(() => {
    const cols = {};
    statusKeys.forEach((key) => { cols[key] = []; });
    filteredApps.forEach(app => {
      if (cols[app.status]) {
        cols[app.status].push(app);
      }
    });
    return cols;
  }, [filteredApps, statusKeys]);

  // Setup Dnd Sensors (distinguish clicks from drags)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // ── Drag Handlers ──────────────────────────────────────────────
  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;
    
    const activeApp = applications.find(a => a.id.toString() === active.id.toString());
    if (!activeApp) return;

    const overId = over.id.toString();
    
    // Determine the target status
    let newStatus = overId;
    
    // If over a card (not a column directly), find the card's status
    if (!statusKeys.includes(overId)) {
        const overApp = applications.find(a => a.id.toString() === overId);
        if (overApp) {
          newStatus = overApp.status;
        }
    }
    
    // Ensure it's a valid status
    if (statusKeys.includes(newStatus) && activeApp.status !== newStatus) {
        try {
          // The useApplications context will do an optimistic update if editApplication supports it
          await editApplication(activeApp.id, { status: newStatus });
          toast.success(`Moved to ${newStatus}`);
        } catch (error) {
          toast.error('Failed to move application');
        }
    }
  };

  // ── Delete flow ──────────────────────────────────────────────
  function requestDelete(app) {
    setConfirmTarget({ id: app.id, company: app.company, role: app.role });
  }

  async function confirmDelete() {
    if (!confirmTarget) return;
    setDeletingId(confirmTarget.id);
    try {
      await onDelete(confirmTarget.id);
    } finally {
      setDeletingId(null);
      setConfirmTarget(null);
    }
  }

  // ── Loading skeleton ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-full max-w-md rounded-xl" />
        <div className="flex gap-4 overflow-x-hidden">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-80 flex-shrink-0 space-y-4">
               <div className="skeleton h-8 w-24 rounded-lg" />
               <ApplicationCardSkeleton />
               <ApplicationCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty dashboard state ────────────────────────────────────
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/8 flex items-center justify-center mb-6">
          <Inbox size={36} className="text-white/25" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
        <p className="text-sm text-white/40 max-w-sm leading-relaxed mb-6">
          Add your first job application to start tracking your search. Every offer starts with one application.
        </p>
        <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2">
          <Plus size={14} />
          Click "New Application" above to get started
        </div>
      </div>
    );
  }

  const activeAppDrag = activeDragId ? applications.find(a => a.id.toString() === activeDragId.toString()) : null;

  return (
    <div className="flex flex-col h-full min-h-[70vh]">
      {/* Search Bar */}
      <div className="mb-6 flex-shrink-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input
            type="text"
            placeholder="Search company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 glass rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 snap-x">
          {statusKeys.map((key) => (
            <KanbanColumn
              key={key}
              statusKey={key}
              applications={columns[key] || []}
              onEdit={onEdit}
              onDelete={requestDelete}
              deletingId={deletingId}
              submitting={submitting}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeAppDrag ? (
            <div className="w-80 cursor-grabbing rotate-2 shadow-2xl opacity-90">
              <ApplicationCard application={activeAppDrag} disableLayout={true} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!confirmTarget}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={confirmDelete}
        loading={!!deletingId}
        title="Delete Application?"
        message={`Remove ${confirmTarget?.company}${confirmTarget?.role ? ` — ${confirmTarget.role}` : ''}? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}