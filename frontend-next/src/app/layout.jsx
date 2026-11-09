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
  title: "TrackrAI: AI Job Application & Interview Tracker | Ditch Spreadsheets",
  description: "Track jobs, parse recruiter emails automatically, and organize interviews on a clean Kanban board. AI-powered cold email drafting & interview tracking for free.",
  keywords: [
    "Track AI", "TrackrAI", "Trak AI", "Rai Tracker", 
    "track ai interview", "AI job application tracker", "automated job search", 
    "job pipeline tracker", "interview tracker", "AI cold emails", "free resume grader", "ATS resume checker"
  ],
  metadataBase: new URL('https://trackrai.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TrackrAI: AI Job Application & Interview Tracker | Ditch Spreadsheets",
    description: "Track jobs, parse recruiter emails automatically, and organize interviews on a clean Kanban board. AI-powered cold email drafting & interview tracking for free.",
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
    title: "TrackrAI: AI Job Application & Interview Tracker | Ditch Spreadsheets",
    description: "Track jobs, parse recruiter emails automatically, and organize interviews on a clean Kanban board. AI-powered cold email drafting & interview tracking for free.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "TrackrAI",
              "operatingSystem": "Web",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "The intelligent operating system for your job search. Parse recruiter emails and track your pipeline."
            })
          }}
        />
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
