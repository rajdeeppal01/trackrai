import React from 'react'
import { motion } from 'framer-motion'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3], x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[30%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen" 
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3], x: [0, 20, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-brand-500/15 blur-[120px] mix-blend-screen" 
      />
    </div>
  )
}
