"use client";

import { useState } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  // Create a client in state to ensure it is not shared across requests during SSR
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
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
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
