import { ArrowRight } from "lucide-react";

export default function GradientButton({
  children,
  onClick,
  className = "",
  icon = true,
  disabled = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        group
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-2xl
        bg-gradient-to-r
        from-indigo-600
        via-violet-600
        to-fuchsia-600
        px-6
        py-3
        font-medium
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:scale-[1.03]
        hover:shadow-2xl
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      <span>{children}</span>

      {icon && (
        <ArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </button>
  );
}