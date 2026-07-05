import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { ThemeProvider } from './context/ThemeContext'
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
    <ThemeProvider>
      <BrowserRouter>

        {/* ── Blue glowy gradient background (Skiper UI style) ──── */}
        <div
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Bottom-left large electric-blue blob */}
          <div style={{
            position: 'absolute',
            bottom: '-15%',
            left: '-10%',
            width: '65%',
            height: '65%',
            background: 'radial-gradient(ellipse at center, rgba(0,191,255,0.28) 0%, rgba(0,100,255,0.12) 50%, transparent 72%)',
            filter: 'blur(70px)',
            borderRadius: '50%',
          }} />
          {/* Bottom-right blob */}
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-8%',
            width: '55%',
            height: '60%',
            background: 'radial-gradient(ellipse at center, rgba(0,160,255,0.22) 0%, rgba(14,165,233,0.08) 55%, transparent 72%)',
            filter: 'blur(90px)',
            borderRadius: '50%',
          }} />
          {/* Center-bottom cyan accent */}
          <div style={{
            position: 'absolute',
            bottom: '0%',
            left: '20%',
            width: '60%',
            height: '35%',
            background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.18) 0%, transparent 68%)',
            filter: 'blur(80px)',
            borderRadius: '50%',
          }} />
          {/* Top subtle indigo (keeps brand feel) */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            right: '15%',
            width: '40%',
            height: '40%',
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.10) 0%, transparent 70%)',
            filter: 'blur(100px)',
            borderRadius: '50%',
          }} />
        </div>

        {/* ── Main layout ────────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
          <Sidebar
            mobileOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            <Navbar onMenuOpen={() => setMobileMenuOpen(true)} />

            <main style={{ flex: 1, overflowY: 'auto' }}>
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

        {/* ── Toaster ──────────────────────────────────────────── */}
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
    </ThemeProvider>
  )
}