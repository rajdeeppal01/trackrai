"use client";

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import CmdKMenu from '../ui/CmdKMenu';
import { AmbientBackground } from '../ui/AmbientBackground';

// Pages that should NEVER show the sidebar/navbar
const NO_LAYOUT_PATHS = [
  '/',
  '/login',
  '/signup',
  '/privacy',
  '/terms',
  '/resources/cold-email-templates',
  '/resources/resume-guide',
  '/free-resume-grader'
];

export default function AppLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();

  const isNoLayoutPage = NO_LAYOUT_PATHS.includes(pathname);

  // 1. If it's a public/no-layout page, don't block render with a loading spinner.
  // This ensures Googlebot gets the full HTML instantly on SSR.
  if (isNoLayoutPage) {
    return (
      <>
        <AmbientBackground />
        <div className="saas-grid-bg" />
        {children}
      </>
    );
  }

  // 2. For protected routes, if loading auth state, show spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
      </div>
    );
  }

  // 3. Fallback for unauthenticated state on protected routes (middleware should catch first)
  if (!isAuthenticated) {
    return (
      <>
        <AmbientBackground />
        <div className="saas-grid-bg" />
        {children}
      </>
    );
  }

  // Authenticated Dashboard Layout
  return (
    <>
      <AmbientBackground />
      <div className="saas-grid-bg" />
      
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <Navbar onMenuOpen={() => setMobileMenuOpen(true)} />

          <main style={{ flex: 1, overflowY: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
      
      <CmdKMenu />
    </>
  );
}
