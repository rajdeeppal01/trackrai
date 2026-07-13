from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator

VALID_STATUSES = {"Applied", "OA", "Interview", "HR", "Offer", "Rejected"}


# ─── User Auth Schemas ─────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        if len(v) > 72:
            raise ValueError("Password cannot exceed 72 characters")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None


class ResumeUpdate(BaseModel):
    resume_text: Optional[str] = None


class ResumeResponse(BaseModel):
    resume_text: Optional[str] = None

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    bio: Optional[str] = None


class UserProfileResponse(BaseModel):
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    bio: Optional[str] = None
    gmail_connected: bool = False
    gmail_sync_enabled: bool = False
    last_gmail_sync: Optional[datetime] = None
    is_premium: bool = False
    gmail_scans_used: int = 0

    class Config:
        from_attributes = True


# ─── Application Schemas ───────────────────────────────────────────

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
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TelemetryVisit(BaseModel):
    path: Optional[str] = None