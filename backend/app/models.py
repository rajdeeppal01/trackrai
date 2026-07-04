from sqlalchemy import Column, Integer, String, Date, Text, DateTime
from sqlalchemy.sql import func
from .database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(200), nullable=False)
    role = Column(String(200), nullable=False)
    status = Column(String(30), nullable=False, default="Applied")
    applied_date = Column(Date, nullable=True)
    link = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)