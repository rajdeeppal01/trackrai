import React from 'react'

export default function Select({ label, children, error, className = '', ...props }) {
 return (
 <div className="space-y-1.5 w-full">
 {label && <label className="block text-xs font-semibold text-white/50">{label}</label>}
 <select
 className={`w-full glass rounded-3xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors [&>option]:bg-[#080820] ${className}`}
 {...props}
 >
 {children}
 </select>
 {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
 </div>
 )
}
