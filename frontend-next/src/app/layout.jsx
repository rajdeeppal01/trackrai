import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import AppLayout from "../components/layout/AppLayout";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TrackrAI (Track AI) — AI-Powered Job Tracker",
  description: "TrackrAI — AI-powered job application tracker. Manage your job search with smart insights, pipeline tracking, and intelligent analytics.",
  metadataBase: new URL('https://trackrai.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TrackrAI (Track AI) — AI-Powered Job Tracker & Copilot",
    description: "Organize your job hunt automatically. The ultimate rai tracker to track AI jobs and standard roles. Features cold emailing and pipeline boards.",
    url: "https://trackrai.in/",
    siteName: "TrackrAI",
    images: [
      {
        url: "https://trackrai.in/og-image.png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrackrAI (Track AI) — AI-Powered Job Tracker & Copilot",
    description: "Organize your job hunt automatically. The ultimate rai tracker to track AI jobs and standard roles. Features cold emailing and pipeline boards.",
    images: ["https://trackrai.in/og-image.png"],
  },
  verification: {
    google: "WXoTcenXijOW0godNyOAVsKMp7z9Adu9glEikJS4xi8",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bitcount+Prop+Single:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
      </body>
    </html>
  );
}
