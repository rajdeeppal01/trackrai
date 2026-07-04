export default function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-gray-200
        bg-white/80
        backdrop-blur-xl
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}