# TrackrAI 🚀

> **AI-powered job application tracking dashboard** — track every application, automate inbox scanning, and get smart insights about your job search.

**Live at:** [https://trackrai.in/](https://trackrai.in/)

![TrackrAI Dashboard](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-19-61dafb) ![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791) ![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Gemini AI](https://img.shields.io/badge/AI-Gemini_1.5-FF6D00)

---

## ✨ Features

- **Dashboard** — Live stats (total, active, offers, rejections), GitHub-style activity heatmap, AI insights, upcoming pipeline items
- **Gamified Kanban Pipeline** — Drag-and-drop cards between status columns with satisfying spring physics and a confetti explosion upon moving an application to "Offer".
- **AI Gmail Sync (Premium)** — Connect your Google account to automatically scan for job updates. Gemini 1.5 AI parses emails to move your Kanban cards instantly.
- **ATS Resume Matcher** — Paste a job description and your resume to get an AI-generated match score and keyword analysis.
- **Multi-Resume Manager** — Store and manage multiple tailored resumes (Free: 2 resumes, Premium: Unlimited).
- **Analytics** — Monthly trend chart, status pie chart, 14-day daily activity, response rates.
- **Authentication & Security** — Secure JWT-based user authentication and Stripe Webhook signature verification.

---

## 🎨 Spatial / VisionOS Design System

TrackrAI is built with a custom design language aimed at a younger, Gen-Z demographic, breaking away from standard "vibe-coded" AI templates.
- **Typography:** `Outfit` (modern, geometric sans) instead of standard system fonts.
- **Vibrant Ambient Glows:** Pure CSS radial gradients mapped to the background layer for hardware-accelerated, dynamic 60fps glows.
- **Springy Physics:** Extensive use of `framer-motion` for bouncy micro-animations on interactive elements (hovering, tapping, dragging).
- **Spatial UI:** Pill-shaped `rounded-3xl` corners, deep translucent glassmorphism (`backdrop-blur-md`), and high-contrast vibrant text gradients.
- **Status colors:** Applied (Blue), OA (Yellow), Interview (Purple), HR (Cyan), Offer (Emerald), Rejected (Red).

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Animations | Framer Motion, Canvas Confetti |
| Charts | Recharts |
| AI Integration | Google Gemini 1.5 Flash API |
| Backend | FastAPI, SQLAlchemy |
| Database | Neon Serverless PostgreSQL |
| Payments | Stripe API & Webhooks |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Stripe Account (for payments)
- Google Cloud Console Project (for Gmail OAuth & Gemini)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=postgresql://user:password@ep-cool-db.neon.tech/neondb" > .env
echo "SECRET_KEY=your-secret-key-here" >> .env
echo "ALGORITHM=HS256" >> .env
echo "GEMINI_API_KEY=your-gemini-key" >> .env
echo "STRIPE_SECRET_KEY=sk_test_..." >> .env
echo "STRIPE_WEBHOOK_SECRET=whsec_..." >> .env

uvicorn app.main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`  
API docs at: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📡 Core API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/login` | JWT Authentication |
| `GET` | `/applications` | List all applications |
| `POST` | `/gmail/auth-url` | Generate Google OAuth URL |
| `POST` | `/gmail/sync` | Trigger AI Inbox Scan |
| `POST` | `/copilot/match` | Run ATS Matcher |
| `POST` | `/payments/webhook`| Stripe payment webhook |

---

## 🌐 Deployment

- **Frontend:** [Vercel](https://vercel.com) / [Render](https://render.com)
- **Backend:** [Render](https://render.com) — Uses PostgreSQL database

---

## 📁 Project Structure

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
│   │       └── payments.py  # Stripe Checkout
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/           
│   │   ├── components/      
│   │   ├── context/         # Auth & Theme context
│   │   └── api/             # Axios API layer
│   └── package.json
└── README.md
```
