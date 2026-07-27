import React from 'react'
import { motion } from 'framer-motion'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6], x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full will-change-transform" 
        style={{ background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.12) 0%, transparent 60%)' }}
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5], x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[30%] -right-[20%] w-[60vw] h-[60vw] rounded-full will-change-transform" 
        style={{ background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.12) 0%, transparent 60%)' }}
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6], x: [0, 20, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full will-change-transform" 
        style={{ background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 60%)' }}
      />
    </div>
  )
}
