import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

/**
 * Animated theme toggle — sun/moon SVG with Framer Motion.
 * Adapted from toggles.dev / Skiper UI (https://skiper-ui.com)
 */
export default function ThemeToggle() {
 const { theme, toggleTheme } = useTheme()
 const isDark = theme === 'dark'

 return (
 <button
 type="button"
 onClick={toggleTheme}
 aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
 title={isDark ? 'Light mode' : 'Dark mode'}
 style={{
 width: 36,
 height: 36,
 padding: 6,
 borderRadius: '50%',
 border: '1px solid rgba(255,255,255,0.1)',
 background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.92)',
 color: isDark ? '#ffffff' : '#0f172a',
 cursor: 'pointer',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 transition: 'background 0.3s, color 0.3s, border-color 0.3s',
 flexShrink: 0,
 }}
 >
 <svg
 xmlns="http://www.w3.org/2000/svg"
 aria-hidden="true"
 fill="currentColor"
 strokeLinecap="round"
 viewBox="0 0 32 32"
 style={{ width: '100%', height: '100%', overflow: 'visible' }}
 >
 {/* Clip mask — moves to reveal moon vs sun */}
 <defs>
 <clipPath id="theme-toggle-clip">
 <motion.path
 animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }}
 transition={{ ease: 'easeInOut', duration: 0.35 }}
 d="M0-5h30a1 1 0 0 0 9 13v24H0Z"
 />
 </clipPath>
 </defs>

 <g clipPath="url(#theme-toggle-clip)">
 {/* Circle — grows to full moon when dark */}
 <motion.circle
 animate={{ r: isDark ? 10 : 8 }}
 transition={{ ease: 'easeInOut', duration: 0.35 }}
 cx="16"
 cy="16"
 />
 {/* Sun rays — hidden when dark */}
 <motion.g
 animate={{
 rotate: isDark ? -100 : 0,
 scale: isDark ? 0.5 : 1,
 opacity: isDark ? 0 : 1,
 }}
 style={{ originX: '16px', originY: '16px' }}
 transition={{ ease: 'easeInOut', duration: 0.35 }}
 stroke="currentColor"
 strokeWidth="1.5"
 fill="none"
 >
 <path d="M16 5.5v-4" />
 <path d="M16 30.5v-4" />
 <path d="M1.5 16h4" />
 <path d="M26.5 16h4" />
 <path d="m23.4 8.6 2.8-2.8" />
 <path d="m5.7 26.3 2.9-2.9" />
 <path d="m5.8 5.8 2.8 2.8" />
 <path d="m23.4 23.4 2.9 2.9" />
 </motion.g>
 </g>
 </svg>
 </button>
 )
}
