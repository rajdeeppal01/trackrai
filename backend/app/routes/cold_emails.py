from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from app.routes.auth import get_current_user

router = APIRouter(
    prefix="/cold-emails",
    tags=["Cold Emails"],
    responses={401: {"description": "Not authenticated"}}
)

@router.get("/", response_model=List[schemas.ColdEmailResponse])
def get_cold_emails(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all tracked cold emails for the current user."""
    return db.query(models.ColdEmail).filter(models.ColdEmail.user_id == current_user.id).order_by(models.ColdEmail.created_at.desc()).all()

@router.post("/", response_model=schemas.ColdEmailResponse, status_code=status.HTTP_201_CREATED)
def create_cold_email(
    cold_email: schemas.ColdEmailCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Log a new cold email outreach."""
    db_cold_email = models.ColdEmail(
        **cold_email.model_dump(),
        user_id=current_user.id
    )
    db.add(db_cold_email)
    db.commit()
    db.refresh(db_cold_email)
    return db_cold_email

@router.patch("/{email_id}", response_model=schemas.ColdEmailResponse)
def update_cold_email(
    email_id: int,
    cold_email_update: schemas.ColdEmailUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Update a tracked cold email (e.g. change status)."""
    db_email = db.query(models.ColdEmail).filter(
        models.ColdEmail.id == email_id,
        models.ColdEmail.user_id == current_user.id
    ).first()
    
    if not db_email:
        raise HTTPException(status_code=404, detail="Cold email not found")
        
    update_data = cold_email_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_email, key, value)
        
    db.commit()
    db.refresh(db_email)
    return db_email

@router.delete("/{email_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cold_email(
    email_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Delete a tracked cold email."""
    db_email = db.query(models.ColdEmail).filter(
        models.ColdEmail.id == email_id,
        models.ColdEmail.user_id == current_user.id
    ).first()
    
    if not db_email:
        raise HTTPException(status_code=404, detail="Cold email not found")
        
    db.delete(db_email)
    db.commit()
    return None
