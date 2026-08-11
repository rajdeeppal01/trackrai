import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import App from './App.jsx';
import './index.css';

Sentry.init({
  dsn: "https://733f16c3473ed1ca0ce6255fd0610a18@o4511891250937856.ingest.us.sentry.io/4511891261227008",
  integrations: [
    Sentry.replayIntegration()
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% sample rate for normal sessions
  replaysOnErrorSampleRate: 1.0, // 100% sample rate for sessions with errors
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
 <HelmetProvider>
 <QueryClientProvider client={queryClient}>
 <App />
 </QueryClientProvider>
 </HelmetProvider>
 </React.StrictMode>,
);