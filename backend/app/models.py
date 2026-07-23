from sqlalchemy import Column, Integer, String, Date, Text, DateTime, ForeignKey, Boolean, LargeBinary
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    cached_insights = Column(Text, nullable=True)
    insights_updated_at = Column(DateTime(timezone=True), nullable=True)
    resume_text = Column(Text, nullable=True)
    current_position = Column(String(200), nullable=True)
    current_company = Column(String(200), nullable=True)
    bio = Column(Text, nullable=True)
    google_refresh_token = Column(String(500), nullable=True)
    gmail_sync_enabled = Column(Boolean, default=False, nullable=False, index=True)
    last_gmail_sync = Column(DateTime(timezone=True), nullable=True)
    is_premium = Column(Boolean, default=False, nullable=False, index=True)
    gmail_scans_used = Column(Integer, default=0, nullable=False)
    session_version = Column(Integer, default=1, nullable=False)
    stripe_customer_id = Column(String(200), nullable=True)
    stripe_session_id = Column(String(200), nullable=True)
    premium_expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company = Column(String(200), nullable=False)
    role = Column(String(200), nullable=False)
    status = Column(String(30), nullable=False, default="Applied")
    applied_date = Column(Date, nullable=True)
    link = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="applications")


class SiteVisit(Base):
    __tablename__ = "site_visits"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String(100), nullable=True)
    user_agent = Column(String(500), nullable=True)
    ip_address = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    content = Column(Text, nullable=False)
    is_default = Column(Boolean, default=False, nullable=False)
    file_data = Column(LargeBinary, nullable=True)
    filename = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="resumes")