import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
      }}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/40
        bg-white/65
        backdrop-blur-2xl
        shadow-lg
        hover:shadow-2xl
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}