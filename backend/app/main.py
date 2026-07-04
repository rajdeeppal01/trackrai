from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app import models
from app.routes.applications import router as application_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TrackrAI API",
    description="AI-powered Job Application Tracker API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(application_router)


@app.get("/")
def root():
    return {"message": "TrackrAI Backend Running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}