import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import Button from './Button'

/**
 * ConfirmDialog — modal confirmation for destructive actions.
 * Props:
 *   open       boolean
 *   onConfirm  () => void
 *   onCancel   () => void
 *   title      string
 *   message    string
 *   confirmLabel  string  (default "Delete")
 *   loading    boolean
 */
export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  loading = false,
}) {
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
            onClick={onCancel}
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="glass-strong rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto overflow-hidden"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Red top accent */}
              <div className="h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={22} className="text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50 mb-6 leading-relaxed">{message}</p>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:text-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {loading ? (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                    ) : null}
                    {confirmLabel}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
