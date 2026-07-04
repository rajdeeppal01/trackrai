import { useMemo, useState } from 'react'
import { useApplications } from '../hooks/useApplications'
import {
  DndContext, closestCorners, PointerSensor, useSensor, useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ALL_STATUSES, STATUS_CONFIG } from '../utils/statusConfig'
import { KanbanSquare, Building2, GripVertical } from 'lucide-react'

// ── Draggable card ───────────────────────────────────────────────
function KanbanCard({ application }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(application.id),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-white/15 transition-all duration-200 select-none"
    >
      <div className="flex items-start gap-2">
        <div
          {...listeners}
          {...attributes}
          className="mt-0.5 text-white/20 hover:text-white/50 transition-colors cursor-grab flex-shrink-0"
        >
          <GripVertical size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Building2 size={11} className="text-white/30 flex-shrink-0" />
            <p className="text-xs font-semibold text-white truncate">{application.company}</p>
          </div>
          <p className="text-[11px] text-white/40 truncate leading-snug ml-3.5">{application.role}</p>
        </div>
      </div>
    </div>
  )
}

// ── Drag overlay (the floating card while dragging) ──────────────
function DragCard({ application }) {
  return (
    <div className="glass-strong rounded-xl p-3 shadow-2xl rotate-2 border border-indigo-500/30 w-48">
      <p className="text-xs font-semibold text-white truncate">{application?.company}</p>
      <p className="text-[11px] text-white/40 truncate mt-0.5">{application?.role}</p>
    </div>
  )
}

// ── Column ───────────────────────────────────────────────────────
function KanbanColumn({ status, items }) {
  const cfg = STATUS_CONFIG[status] || {}
  const itemIds = items.map(a => String(a.id))

  return (
    <div className="flex flex-col min-h-[500px] min-w-[220px]">
      {/* Column header */}
      <div className={`flex items-center gap-2 mb-3 px-1`}>
        <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
        <span className={`text-xs font-bold uppercase tracking-widest ${cfg.color}`}>{cfg.label || status}</span>
        <span className="ml-auto text-[10px] text-white/25 font-mono bg-white/5 px-1.5 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      {/* Drop zone */}
      <div className={`flex-1 rounded-2xl border ${cfg.border} bg-white/2 p-2 space-y-2 min-h-[120px]`}>
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-[11px] text-white/15 text-center px-3">
              Drop cards here
            </div>
          ) : (
            items.map(app => <KanbanCard key={app.id} application={app} />)
          )}
        </SortableContext>
      </div>
    </div>
  )
}

// ── Main Pipeline page ────────────────────────────────────────────
export default function Pipeline() {
  const { applications, loading, editApplication } = useApplications()
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  // Group applications by status — show all statuses as columns
  const columns = useMemo(() => {
    const grouped = {}
    ALL_STATUSES.forEach(s => { grouped[s] = [] })
    applications.forEach(app => {
      if (grouped[app.status]) grouped[app.status].push(app)
      else grouped['Applied'].push(app)
    })
    return grouped
  }, [applications])

  const activeApp = useMemo(
    () => activeId ? applications.find(a => String(a.id) === activeId) : null,
    [activeId, applications]
  )

  function findStatusByAppId(id) {
    for (const [status, apps] of Object.entries(columns)) {
      if (apps.find(a => String(a.id) === id)) return status
    }
    return null
  }

  async function handleDragEnd(event) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeAppId = active.id
    const overContainer = over.data?.current?.sortable?.containerId || findStatusByAppId(over.id) || over.id
    const currentStatus = findStatusByAppId(activeAppId)

    if (!currentStatus || !overContainer || currentStatus === overContainer) return

    // Optimistically update via API
    await editApplication(Number(activeAppId), { status: overContainer })
  }

  if (loading) {
    return (
      <div className="min-h-screen text-white p-4 md:p-8">
        <div className="skeleton h-10 w-48 rounded-xl mb-8" />
        <div className="flex gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton rounded-2xl w-52 h-96 flex-shrink-0" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans">
      <div className="max-w-full space-y-6">

        {/* Header */}
        <header>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <KanbanSquare size={18} className="text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Pipeline</h1>
          </div>
          <p className="text-white/40 text-sm ml-12">Drag cards between columns to update their status instantly.</p>
        </header>

        {/* Kanban board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={({ active }) => setActiveId(active.id)}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="flex gap-4 overflow-x-auto pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
            {ALL_STATUSES.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                items={columns[status] || []}
              />
            ))}
          </div>

          <DragOverlay>
            {activeApp ? <DragCard application={activeApp} /> : null}
          </DragOverlay>
        </DndContext>

      </div>
    </div>
  )
}
