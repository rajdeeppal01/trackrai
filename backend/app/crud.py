from sqlalchemy.orm import Session

from . import models


def create_application(db: Session, app):
    db_app = models.Application(
        company=app.company,
        role=app.role,
        status=app.status,
        applied_date=app.applied_date,
        job_link=app.job_link,
        notes=app.notes
    )

    db.add(db_app)
    db.commit()
    db.refresh(db_app)

    return db_app


def get_applications(db: Session):
    return db.query(models.Application).all()