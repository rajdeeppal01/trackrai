import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import CmdKMenu from './components/ui/CmdKMenu'
import { AmbientBackground } from './components/ui/AmbientBackground'
import api from './api/applications'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Applications = lazy(() => import('./pages/Applications'))
const Analytics = lazy(() => import('./pages/Analytics'))
const AICopilot = lazy(() => import('./pages/AICopilot'))
const ATSMatcher = lazy(() => import('./pages/ATSMatcher'))
const ColdEmailer = lazy(() => import('./pages/ColdEmailer'))
const Settings = lazy(() => import('./pages/Settings'))
const Login = lazy(() => import('./pages/Login'))
const CreatorPortal = lazy(() => import('./pages/CreatorPortal'))
const PremiumFeatures = lazy(() => import('./pages/PremiumFeatures'))
const Landing = lazy(() => import('./pages/Landing'))
const Resumes = lazy(() => import('./pages/Resumes'))
const EmailTemplates = lazy(() => import('./pages/resources/EmailTemplates'))
const ResumeGuide = lazy(() => import('./pages/resources/ResumeGuide'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))

function AppContent({ mobileMenuOpen, setMobileMenuOpen }) {
 const { isAuthenticated, loading } = useAuth()
 const location = useLocation()

 useEffect(() => {
 async function logVisit() {
 try {
 await api.post('/telemetry/visit', { path: location.pathname })
 } catch (err) {
 console.error('Failed to log telemetry visit', err)
 }
 }
 logVisit()
 }, [location.pathname])

 if (loading) {
 return (
 <div className="min-h-screen bg-[#050510] flex items-center justify-center text-white">
 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
 </div>
 )
 }

 if (!isAuthenticated) {
 return (
 <Suspense fallback={
 <div className="min-h-screen bg-[#050510] flex items-center justify-center text-white">
 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
 </div>
 }>
 <Routes>
 <Route path="/" element={<Landing />} />
 <Route path="/login" element={<Login />} />
 <Route path="/signup" element={<Login />} />
 <Route path="/resources/cold-email-templates" element={<EmailTemplates />} />
 <Route path="/resources/resume-guide" element={<ResumeGuide />} />
 <Route path="*" element={<Navigate to="/login" replace />} />
 </Routes>
 </Suspense>
 )
 }

 return (
 <div style={{ position: 'relative', zIndex: 1, display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
 <Sidebar
 mobileOpen={mobileMenuOpen}
 onClose={() => setMobileMenuOpen(false)}
 />

 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
 <Navbar onMenuOpen={() => setMobileMenuOpen(true)} />

 <main style={{ flex: 1, overflowY: 'auto' }}>
 <Suspense fallback={
 <div className="h-full flex items-center justify-center text-white">
 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
 </div>
 }>
 <Routes>
 <Route path="/" element={<Dashboard />} />
 <Route path="/applications" element={<Applications />} />
 <Route path="/analytics" element={<Analytics />} />
 <Route path="/copilot" element={<AICopilot />} />
 <Route path="/ats-matcher" element={<ATSMatcher />} />
 <Route path="/cold-email" element={<ColdEmailer />} />
 <Route path="/settings" element={<Settings />} />
 <Route path="/resumes" element={<Resumes />} />
 <Route path="/premium" element={<PremiumFeatures/>} />
 <Route path="/admin" element={<CreatorPortal/>} />
 <Route path="/resources/cold-email-templates" element={<EmailTemplates />} />
 <Route path="/resources/resume-guide" element={<ResumeGuide />} />
 <Route path="/privacy" element={<PrivacyPolicy />} />
 <Route path="/terms" element={<TermsOfService />} />
 <Route path="*" element={<Navigate to="/" replace />} />
 </Routes>
 </Suspense>
 </main>
 </div>
 </div>
 )
}

export default function App() {
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

 return (
 <ThemeProvider>
 <AuthProvider>
 <BrowserRouter>

 {/* ── Dynamic Animated Background ──── */}
 <AmbientBackground />

 {/* Main content rendering */}
 <div className="saas-grid-bg" />
 <AppContent mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

 {/* ── Toaster ──────────────────────────────────────────── */}
 <Toaster
 position="bottom-right"
 toastOptions={{
 style: {
 background: 'rgba(15,15,35,0.95)',
 color: '#fff',
 border: '1px solid rgba(255,255,255,0.10)',
 borderRadius: '6px',
 backdropFilter: 'blur(12px)',
 fontSize: '13px',
 },
 success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
 error: { iconTheme: { primary: '#f87171', secondary: '#fff' } },
 }}
 />

 {/* ── Global Command Palette ───────────────────────────── */}
 <CmdKMenu />
 </BrowserRouter>
 </AuthProvider>
 </ThemeProvider>
 )
}