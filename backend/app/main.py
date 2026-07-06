from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.database import engine
from app import models
from app.routes.applications import router as application_router
from app.routes.auth import router as auth_router
from app.routes.copilot import router as copilot_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TrackrAI API",
    description="AI-powered Job Application Tracker API",
    version="1.0.0",
)

# Safe origins (No "*" wildcard when allow_credentials=True)
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
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


@app.get("/")
def root():
    return {"message": "TrackrAI Backend Running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}