# TrackrAI 🚀

> **AI-powered job application tracking dashboard** — track every application, visualize your pipeline, and get smart insights about your job search.

![TrackrAI Dashboard](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-19-61dafb) ![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688) ![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)

---

## ✨ Features

- **Dashboard** — Live stats (total, active, offers, rejections), activity chart, AI insights, upcoming pipeline items
- **Applications** — Add, edit, delete applications with full CRUD. Status filter + search
- **Pipeline (Kanban)** — Drag-and-drop cards between status columns. Changes persist to the backend instantly
- **Analytics** — Monthly trend chart, status pie chart, 14-day daily activity, response rates
- **AI Copilot** — Pipeline health score, personalized insights from your data, job search tips
- **Settings** — Export data as JSON or CSV, clear all data

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Drag & Drop | @dnd-kit |
| Backend | FastAPI, SQLite, SQLAlchemy |
| Forms | React Hook Form |
| Notifications | React Hot Toast |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=sqlite:///./trackrai.db" > .env
echo "SECRET_KEY=your-secret-key-here" >> .env
echo "ALGORITHM=HS256" >> .env

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

## 📡 API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/applications` | List all applications |
| `POST` | `/applications` | Create application |
| `GET` | `/applications/{id}` | Get by ID |
| `PATCH` | `/applications/{id}` | Update application |
| `DELETE` | `/applications/{id}` | Delete application |
| `GET` | `/health` | Health check |

---

## 🎨 Design System

- **Theme:** Premium dark mode (`#080818` background)
- **Accent colors:** Indigo `#6366f1` → Purple `#a855f7`
- **Glassmorphism:** `bg-white/5 backdrop-blur-md border border-white/10`
- **Status colors:** Applied (Blue), OA (Yellow), Interview (Purple), HR (Cyan), Offer (Emerald), Rejected (Red)

---

## 🌐 Deployment

- **Frontend:** [Vercel](https://vercel.com) — import the `frontend/` directory
- **Backend:** [Render](https://render.com) — uses `render.yaml` at the repo root

---

## 📁 Project Structure

```
trackrai/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── database.py      # DB connection
│   │   └── routes/
│   │       └── applications.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/           # Dashboard, Applications, Pipeline, Analytics, AICopilot, Settings
│   │   ├── components/      # layout/, dashboard/, applications/, ui/
│   │   ├── hooks/           # useApplications.js
│   │   ├── utils/           # statusConfig, formatters, insightEngine
│   │   └── api/             # Axios API layer
│   └── package.json
├── render.yaml              # Render deployment config
└── README.md
```

---

Made with ❤️ by Rajdeep Pal
