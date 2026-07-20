import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableApplicationCard from './SortableApplicationCard';
import { STATUS_CONFIG } from '../../utils/statusConfig';

export default function KanbanColumn({ statusLabel, applications, onEdit, onDelete, deletingId, submitting }) {
  const { setNodeRef, isOver } = useDroppable({
    id: statusLabel,
    data: {
      type: 'Column',
      status: statusLabel
    }
  });

  const config = STATUS_CONFIG[statusLabel];

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col flex-shrink-0 w-80 max-h-full rounded-2xl glass p-3 border border-white/5 overflow-y-auto transition-colors duration-200 ${isOver ? 'bg-white/5 border-white/20' : ''}`}
    >
      <div className="flex items-center gap-2 mb-4 px-2">
        <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
        <h3 className="font-semibold text-white/90">{statusLabel}</h3>
        <span className="ml-auto text-xs font-medium text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
          {applications.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-[100px] pb-2">
        <SortableContext
          items={applications.map(app => app.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {applications.map(app => (
            <SortableApplicationCard
              key={app.id}
              id={app.id.toString()}
              application={app}
              onEdit={onEdit}
              onDelete={onDelete}
              deleting={deletingId === app.id}
              disabled={submitting}
            />
          ))}
        </SortableContext>
        
        {applications.length === 0 && (
          <div className="h-24 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-xs text-white/30">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}
