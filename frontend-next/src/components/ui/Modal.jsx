import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Reusable Modal component.
 * Usage:
 * <Modal open={open} onClose={onClose} title="Add Application">
 * {children}
 * </Modal>
 */
export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-2xl' }) {
 // Close on Escape key
 useEffect(() => {
 if (!open) return
 const handler = (e) => { if (e.key === 'Escape') onClose() }
 document.addEventListener('keydown', handler)
 return () => document.removeEventListener('keydown', handler)
 }, [open, onClose])

 // Prevent body scroll when modal is open
 useEffect(() => {
 if (open) {
 document.body.style.overflow = 'hidden'
 } else {
 document.body.style.overflow = ''
 }
 return () => { document.body.style.overflow = '' }
 }, [open])

 return (
 <AnimatePresence>
 {open && (
 <>
 {/* Backdrop */}
 <motion.div
 className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 />

 {/* Panel */}
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <motion.div
 className={`relative w-full ${maxWidth} glass-strong rounded-3xl shadow-2xl overflow-hidden`}
 initial={{ opacity: 0, scale: 0.95, y: 24 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 12 }}
 transition={{ type: 'spring', stiffness: 400, damping: 30 }}
 onClick={(e) => e.stopPropagation()}
 >
 {/* Gradient top border */}
 <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

 {/* Header */}
 {title && (
 <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b ">
 <h2 className="text-xl font-bold text-white">{title}</h2>
 <button
 onClick={onClose}
 className="w-8 h-8 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all duration-200"
 >
 <X size={16} />
 </button>
 </div>
 )}

 {/* Content */}
 <div className="px-8 py-6 max-h-[80vh] overflow-y-auto">
 {children}
 </div>
 </motion.div>
 </div>
 </>
 )}
 </AnimatePresence>
 )
}
