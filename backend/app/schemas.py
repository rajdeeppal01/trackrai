from pydantic import BaseModel
from datetime import date


class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: str
    applied_date: date
    job_link: str | None = None
    notes: str | None = None


class ApplicationResponse(ApplicationCreate):
    id: int

    class Config:
        from_attributes = True