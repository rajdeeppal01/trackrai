# Project Instructions: TrackrAI

## Tech Stack
- Frontend: Next.js (App Router), React 19, Tailwind CSS v4, Framer Motion
- Backend: Python 3.11+, FastAPI, SQLAlchemy, PostgreSQL (Supabase)
- Integrations: Google Gemini 1.5, Razorpay, Gmail API OAuth

## Code Style
- **Python**: Use Pydantic V2 for all data validation (`schemas.py`). Use SQLAlchemy 2.0 style async/sync queries.
- **Frontend**: Follow Next.js App Router conventions (`app/` dir). Use Spatial/VisionOS design system (Pill-shaped corners, pure CSS radial gradients, Framer Motion for micro-interactions).
- **Typography**: Uses `Outfit` font family.

## Build & Run
- **Backend Dev**: `cd backend && uvicorn app.main:app --reload --port 8000`
- **Frontend Dev**: `cd frontend-next && npm run dev`
- **Start Scripts**: Use `start-backend.ps1` and `start-frontend.ps1` if on Windows.

## Project Structure
- `backend/app/routes/`: API endpoint definitions
- `backend/app/crud/`: Database interaction logic
- `backend/app/models.py`: Database schema source of truth
- `frontend-next/src/app/`: Next.js page routing
- `frontend-next/src/components/`: Reusable UI elements

## Conventions
- **AI Integrations**: Keep prompt definitions encapsulated inside `copilot.py` or dedicated helper modules.
- **Security**: Always use `security.py` utilities for password hashing/JWT.
- **UI Physics**: Aim for bouncy, 60fps animations. Avoid basic static UI state transitions.
