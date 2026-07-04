import { Loader2 } from 'lucide-react'

/**
 * Reusable Button component.
 * variants: 'primary' | 'secondary' | 'danger' | 'ghost'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none'

  const variants = {
    primary:
      'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-lg shadow-brand-900/30',
    secondary:
      'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20',
    danger:
      'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300',
    ghost: 'text-white/50 hover:text-white hover:bg-white/5',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : Icon ? (
        <Icon size={14} />
      ) : null}
      {children}
    </button>
  )
}
