import { motion } from 'framer-motion'
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
 'inline-flex items-center justify-center gap-2 font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed select-none'

 const variants = {
 primary:
 'bg-white/90 hover:bg-white text-black shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.3)]',
 secondary:
 'bg-white/5 backdrop-blur-xl text-white/80 hover:bg-white/10 hover:text-white shadow-lg',
 danger:
 'bg-red-500/10 backdrop-blur-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 shadow-lg',
 ghost: 'text-white/50 hover:text-white hover:bg-white/5',
 }

 const sizes = {
 sm: 'px-3 py-1.5 text-xs',
 md: 'px-5 py-2.5 text-sm',
 lg: 'px-6 py-3 text-base',
 }

 return (
 <motion.button
 type={type}
 disabled={disabled || loading}
 onClick={onClick}
 whileHover={{ scale: disabled ? 1 : 1.02 }}
 whileTap={{ scale: disabled ? 1 : 0.96 }}
 transition={{ type: "spring", stiffness: 400, damping: 25 }}
 className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
 {...props}
 >
 {loading ? (
 <Loader2 size={14} className="animate-spin" />
 ) : Icon ? (
 <Icon size={14} />
 ) : null}
 {children}
 </motion.button>
 )
}
