import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ApplicationCard from './ApplicationCard';

export default function SortableApplicationCard({ id, application, onEdit, onDelete, deleting, disabled }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id, data: { application } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-4 touch-none cursor-grab active:cursor-grabbing">
      <ApplicationCard
        application={application}
        onEdit={onEdit}
        onDelete={onDelete}
        deleting={deleting}
        disabled={disabled}
      />
    </div>
  );
}
