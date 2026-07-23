from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, Resume
from app.schemas import SavedResumeCreate, SavedResumeUpdate, SavedResumeResponse
from app.routes.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[SavedResumeResponse])
def get_user_resumes(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Get all saved resumes for the authenticated user."""
    return db.query(Resume).filter(Resume.user_id == current_user.id).all()

@router.post("/", response_model=SavedResumeResponse, status_code=status.HTTP_201_CREATED)
def create_resume(
    resume_in: SavedResumeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new resume for the user."""
    # If this is set to default, unset default on others
    if resume_in.is_default:
        db.query(Resume).filter(Resume.user_id == current_user.id).update({"is_default": False})

    new_resume = Resume(
        user_id=current_user.id,
        name=resume_in.name,
        content=resume_in.content,
        is_default=resume_in.is_default
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    return new_resume

@router.put("/{resume_id}", response_model=SavedResumeResponse)
def update_resume(
    resume_id: int,
    resume_in: SavedResumeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing resume."""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    update_data = resume_in.model_dump(exclude_unset=True)
    
    if update_data.get("is_default"):
        # Unset default on others
        db.query(Resume).filter(Resume.user_id == current_user.id, Resume.id != resume_id).update({"is_default": False})
        
    for key, value in update_data.items():
        setattr(resume, key, value)
        
    db.commit()
    db.refresh(resume)
    return resume

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a resume."""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    db.delete(resume)
    db.commit()
    return None
