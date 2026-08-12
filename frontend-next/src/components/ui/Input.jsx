import React from 'react'

export default function Input({ label, error, className = '', ...props }) {
 return (
 <div className="space-y-1.5 w-full">
 {label && <label className="block text-xs font-semibold text-white/50">{label}</label>}
 <input
 className={`w-full glass rounded-3xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors ${className}`}
 {...props}
 />
 {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
 </div>
 )
}
