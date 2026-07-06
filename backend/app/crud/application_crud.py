from sqlalchemy.orm import Session
from sqlalchemy import desc

from app import models
from app import schemas


def get_all(db: Session, user_id: int):
    return (
        db.query(models.Application)
        .filter(models.Application.user_id == user_id)
        .order_by(desc(models.Application.created_at))
        .all()
    )


def get_by_id(db: Session, application_id: int, user_id: int):
    return (
        db.query(models.Application)
        .filter(models.Application.id == application_id, models.Application.user_id == user_id)
        .first()
    )


def create(db: Session, application: schemas.ApplicationCreate, user_id: int):
    db_application = models.Application(
        **application.model_dump(),
        user_id=user_id
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


def update(
    db: Session,
    application_id: int,
    application: schemas.ApplicationUpdate,
    user_id: int,
):
    db_application = get_by_id(db, application_id, user_id)

    if not db_application:
        return None

    updates = application.model_dump(exclude_unset=True)

    for key, value in updates.items():
        setattr(db_application, key, value)

    db.commit()
    db.refresh(db_application)

    return db_application


def delete(db: Session, application_id: int, user_id: int):
    db_application = get_by_id(db, application_id, user_id)

    if not db_application:
        return False

    db.delete(db_application)
    db.commit()

    return True


def delete_all(db: Session, user_id: int):
    db.query(models.Application).filter(models.Application.user_id == user_id).delete()
    db.commit()
    return True