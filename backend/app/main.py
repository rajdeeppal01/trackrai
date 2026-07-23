from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
from sqlalchemy import text
import os
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.limiter import limiter

from app.database import engine
from app import models
from app.routes.applications import router as application_router
from app.routes.auth import router as auth_router
from app.routes.copilot import router as copilot_router
from app.routes.admin import router as admin_router
from app.routes.telemetry import router as telemetry_router
from app.routes.gmail import router as gmail_router
from app.routes.resumes import router as resumes_router

models.Base.metadata.create_all(bind=engine)

# ─── Self-healing migration: add missing columns if they're missing ──
# create_all() only creates brand-new tables, it never adds columns to
# tables that already exist. This runs a lightweight check on startup
# and adds the columns if needed, so no manual DB shell access is required.
try:
    with engine.connect() as conn:
        if engine.dialect.name == "postgresql":
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_text TEXT"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS current_position VARCHAR(200)"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS current_company VARCHAR(200)"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_refresh_token VARCHAR(500)"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS gmail_sync_enabled BOOLEAN DEFAULT FALSE NOT NULL"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_gmail_sync TIMESTAMP WITH TIME ZONE"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE NOT NULL"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS gmail_scans_used INTEGER DEFAULT 0 NOT NULL"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS session_version INTEGER DEFAULT 1 NOT NULL"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS extension_token VARCHAR(100)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_users_gmail_sync_enabled ON users (gmail_sync_enabled)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_users_is_premium ON users (is_premium)"))
            
            # Resumes table
            conn.execute(text("ALTER TABLE resumes ADD COLUMN IF NOT EXISTS file_data BYTEA"))
            conn.execute(text("ALTER TABLE resumes ADD COLUMN IF NOT EXISTS filename VARCHAR(255)"))
            
            conn.commit()
        else:
            # SQLite doesn't support "IF NOT EXISTS" for ADD COLUMN, so check first
            result = conn.execute(text("PRAGMA table_info(users)"))
            existing_columns = [row[1] for row in result]
            if "resume_text" not in existing_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN resume_text TEXT"))
            if "current_position" not in existing_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN current_position VARCHAR(200)"))
            if "current_company" not in existing_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN current_company VARCHAR(200)"))
            if "bio" not in existing_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN bio TEXT"))
            if "google_refresh_token" not in existing_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN google_refresh_token VARCHAR(500)"))
            if "gmail_sync_enabled" not in existing_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN gmail_sync_enabled BOOLEAN DEFAULT 0 NOT NULL"))
            if "last_gmail_sync" not in existing_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN last_gmail_sync TIMESTAMP"))
            if "is_premium" not in existing_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN is_premium BOOLEAN DEFAULT 0 NOT NULL"))
            if "gmail_scans_used" not in existing_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN gmail_scans_used INTEGER DEFAULT 0 NOT NULL"))
            if "session_version" not in existing_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN session_version INTEGER DEFAULT 1 NOT NULL"))
            if "extension_token" not in existing_columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN extension_token VARCHAR(100)"))
            
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_users_gmail_sync_enabled ON users (gmail_sync_enabled)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_users_is_premium ON users (is_premium)"))
            
            # Resumes table
            result = conn.execute(text("PRAGMA table_info(resumes)"))
            resumes_cols = [row[1] for row in result]
            if "file_data" not in resumes_cols:
                conn.execute(text("ALTER TABLE resumes ADD COLUMN file_data BLOB"))
            if "filename" not in resumes_cols:
                conn.execute(text("ALTER TABLE resumes ADD COLUMN filename VARCHAR(255)"))
                
            conn.commit()
except Exception as e:
    print(f"Migration check skipped/failed: {e}")

from contextlib import asynccontextmanager
from app.scheduler import start_scheduler, shutdown_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    shutdown_scheduler()

app = FastAPI(
    title="TrackrAI API",
    description="AI-powered Job Application Tracker API",
    version="1.0.0",
    lifespan=lifespan
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Safe origins (No "*" wildcard when allow_credentials=True)
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://trackrai.in",
    "https://www.trackrai.in",
    "https://frontend-zeta-ebon-6g2mglih0o.vercel.app",
]
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    allowed_origins.extend([o.strip() for o in env_origins.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(application_router)
app.include_router(copilot_router)
app.include_router(admin_router)
app.include_router(telemetry_router)
app.include_router(gmail_router)
app.include_router(resumes_router, prefix="/resumes", tags=["Resumes"])

@app.get("/")
def root():
    return {"message": "TrackrAI Backend Running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}