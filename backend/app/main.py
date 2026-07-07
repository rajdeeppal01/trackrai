from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import os

from app.database import engine
from app import models
from app.routes.applications import router as application_router
from app.routes.auth import router as auth_router
from app.routes.copilot import router as copilot_router
from app.routes.admin import router as admin_router

models.Base.metadata.create_all(bind=engine)

# ─── Self-healing migration: add resume_text column if it's missing ──
# create_all() only creates brand-new tables, it never adds columns to
# tables that already exist. This runs a lightweight check on startup
# and adds the column if needed, so no manual DB shell access is required.
try:
    with engine.connect() as conn:
        if engine.dialect.name == "postgresql":
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_text TEXT"))
            conn.commit()
        else:
            # SQLite doesn't support "IF NOT EXISTS" for ADD COLUMN, so check first
            result = conn.execute(text("PRAGMA table_info(users)"))
            existing_columns = [row[1] for row in result]
            if "resume_text" not in existing_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN resume_text TEXT"))
                conn.commit()
except Exception as e:
    print(f"Migration check skipped/failed (safe to ignore if column already exists): {e}")

app = FastAPI(
    title="TrackrAI API",
    description="AI-powered Job Application Tracker API",
    version="1.0.0",
)

# Safe origins (No "*" wildcard when allow_credentials=True)
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://frontend-zeta-ebon-6g2mglih0o.vercel.app",
]
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    allowed_origins.extend([o.strip() for o in env_origins.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(application_router)
app.include_router(copilot_router)
app.include_router(admin_router)


@app.get("/")
def root():
    return {"message": "TrackrAI Backend Running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}