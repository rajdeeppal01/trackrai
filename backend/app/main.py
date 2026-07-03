from fastapi import FastAPI

from .database import Base, engine
from .models import Application

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TrackrAI API",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "message": "TrackrAI Backend Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }