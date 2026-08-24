# TrackrAI

> **AI-powered job application tracking dashboard** — track every application, automate inbox scanning, and get smart insights about your job search.

**Live at:** [https://trackrai.in/](https://trackrai.in/)

![TrackrAI Dashboard](https://img.shields.io/badge/Status-Active-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14+-black) ![React](https://img.shields.io/badge/React-19-61dafb) ![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791) ![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Gemini AI](https://img.shields.io/badge/AI-Gemini_1.5-FF6D00)

---

## Features

- **Dashboard** — Live stats (total, active, offers, rejections), GitHub-style activity heatmap, AI insights, upcoming pipeline items
- **Gamified Kanban Pipeline** — Drag-and-drop cards between status columns with satisfying spring physics and a confetti explosion upon moving an application to "Offer".
- **Automated Follow-up Sequences** — Proactively prompts you to follow up on applications stuck in the "Applied" stage for >7 days, instantly drafting the email via Gemini.
- **AI Gmail Sync (Premium)** — Connect your Google account to automatically scan for job updates. Gemini 1.5 AI parses emails to move your Kanban cards instantly. Now features batched LLM analysis and robust whitelist parsing for major enterprise ATS providers (Taleo, Workday, Eightfold).
- **Public Lead Magnet: Free Resume Grader** — A public, SEO-optimized endpoint where users can get instant AI feedback on their resume matching a job description, seamlessly funneled into signups.
- **ATS Resume Matcher** — Paste a job description and your resume to get an AI-generated match score and keyword analysis.
- **Cold Emailer** — Generate highly personalized cold outreach emails referencing your specific resume and target roles.
- **Multi-Resume Manager** — Store and manage multiple tailored resumes (Free: 2 resumes, Premium: Unlimited).
- **Authentication & Security** — Secure JWT-based user authentication, password visibility toggles, and Razorpay signature verification.

---

## Spatial / VisionOS Design System

TrackrAI is built with a custom design language aimed at a younger, Gen-Z demographic, breaking away from standard "vibe-coded" AI templates.
- **Typography:** `Outfit` (modern, geometric sans) instead of standard system fonts.
- **Vibrant Ambient Glows:** Pure CSS radial gradients mapped to the background layer for hardware-accelerated, dynamic 60fps glows.
- **Springy Physics:** Extensive use of `framer-motion` for bouncy micro-animations on interactive elements (hovering, tapping, dragging).
- **Spatial UI:** Pill-shaped `rounded-3xl` corners, deep translucent glassmorphism (`backdrop-blur-md`), and high-contrast vibrant text gradients.
- **Status colors:** Applied (Blue), OA (Yellow), Interview (Purple), HR (Cyan), Offer (Emerald), Rejected (Red).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js App Router, React 19, Tailwind CSS v4 |
| Animations | Framer Motion, Canvas Confetti |
| Charts | Recharts |
| AI Integration | Google Gemini 1.5 Flash API |
| Backend | FastAPI, SQLAlchemy |
| Database | Supabase PostgreSQL |
| Payments | Razorpay API |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Razorpay Account (for payments)
- Google Cloud Console Project (for Gmail OAuth & Gemini)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=postgresql://postgres.xxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres" > .env
echo "SECRET_KEY=your-secret-key-here" >> .env
echo "ALGORITHM=HS256" >> .env
echo "GEMINI_API_KEY=your-gemini-key" >> .env
echo "RAZORPAY_KEY_ID=rzp_test_..." >> .env
echo "RAZORPAY_KEY_SECRET=secret_..." >> .env

uvicorn app.main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`  
API docs at: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend-next
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Core API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/login` | JWT Authentication |
| `GET` | `/applications` | List all applications |
| `POST` | `/gmail/auth-url` | Generate Google OAuth URL |
| `POST` | `/gmail/sync` | Trigger AI Inbox Scan |
| `POST` | `/copilot/match` | Run ATS Matcher |
| `POST` | `/payments/verify-payment`| Razorpay payment verification |

---

## Deployment

- **Frontend:** [Vercel](https://vercel.com) / [Render](https://render.com)
- **Backend:** [Render](https://render.com) — Uses PostgreSQL database

---

## Project Structure

```
trackrai/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry & Webhooks
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── database.py      # DB connection
│   │   └── routes/
│   │       ├── applications.py
│   │       ├── auth.py
│   │       ├── copilot.py   # Gemini AI routes
│   │       ├── gmail.py     # Gmail API syncing
│   │       └── payments.py  # Razorpay Checkout
│   └── requirements.txt
├── frontend-next/
│   ├── src/
│   │   ├── app/             # Next.js App Router Pages
│   │   ├── components/      
│   │   ├── context/         # Auth & Theme context
│   │   └── api/             # Axios API layer
│   └── package.json
└── README.md
```
