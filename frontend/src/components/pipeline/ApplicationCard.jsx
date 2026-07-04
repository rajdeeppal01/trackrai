import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

export default function ApplicationCard({ id, title, company }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      animate={{
        scale: isDragging ? 1.05 : 1,
        opacity: isDragging ? 0.8 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="
        p-4
        rounded-2xl
        bg-white/70
        backdrop-blur-xl
        border
        border-white/40
        shadow-sm
        hover:shadow-md
        cursor-grab
        active:cursor-grabbing
        transition
      "
    >
      <h3 className="font-medium text-gray-900">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {company}
      </p>
    </motion.div>
  );
}