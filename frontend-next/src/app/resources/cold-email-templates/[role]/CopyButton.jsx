"use client"
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CopyButton({ subject, body }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)
    setCopied(true)
    toast.success('Template copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
    >
      {copied ? <><Check size={14} /><span>Copied</span></> : <><Copy size={14} /><span>Copy Template</span></>}
    </button>
  )
}
