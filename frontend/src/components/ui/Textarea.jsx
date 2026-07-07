import React from 'react'

export default function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="block text-xs font-semibold text-white/50">{label}</label>}
      <textarea
        className={`w-full glass border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors resize-none ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
