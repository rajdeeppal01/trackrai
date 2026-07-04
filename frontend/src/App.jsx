import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'

import Dashboard    from './pages/Dashboard'
import Applications from './pages/Applications'
import Pipeline     from './pages/Pipeline'
import Analytics    from './pages/Analytics'
import AICopilot    from './pages/AICopilot'
import Settings     from './pages/Settings'

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <BrowserRouter>
      {/* ── Background ambient glows ───────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
        <div className="absolute -top-40 left-1/4 w-[600px] h-[400px] bg-indigo-500/8 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[600px] bg-purple-500/6 blur-[140px] rounded-full" />
      </div>

      {/* ── Main layout ────────────────────────────────────────── */}
      <div className="relative z-10 flex h-screen w-full overflow-hidden">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Navbar onMenuOpen={() => setMobileMenuOpen(true)} />

          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/"             element={<Dashboard    />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/pipeline"     element={<Pipeline     />} />
              <Route path="/analytics"    element={<Analytics    />} />
              <Route path="/copilot"      element={<AICopilot    />} />
              <Route path="/settings"     element={<Settings     />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* ── Global toast notifications ──────────────────────────── */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(15,15,35,0.95)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '14px',
            backdropFilter: 'blur(12px)',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  )
}