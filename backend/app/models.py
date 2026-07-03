from sqlalchemy import Column, Integer, String, Date

from .database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    company = Column(String, nullable=False)

    role = Column(String, nullable=False)

    status = Column(String, default="applied")

    applied_date = Column(Date)

    link = Column(String)

    notes = Column(String)