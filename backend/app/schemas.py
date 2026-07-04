from datetime import date, datetime
from typing import Optional, Literal
from pydantic import BaseModel, field_validator

VALID_STATUSES = {"Applied", "OA", "Interview", "HR", "Offer", "Rejected"}


class ApplicationBase(BaseModel):
    company: str
    role: str
    status: str = "Applied"
    applied_date: Optional[date] = None
    link: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in VALID_STATUSES:
            raise ValueError(f"status must be one of {sorted(VALID_STATUSES)}")
        return v

    @field_validator("company", "role")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty")
        return v.strip()


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    applied_date: Optional[date] = None
    link: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_STATUSES:
            raise ValueError(f"status must be one of {sorted(VALID_STATUSES)}")
        return v


class ApplicationResponse(ApplicationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True