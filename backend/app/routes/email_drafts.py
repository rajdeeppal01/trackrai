from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.routes.auth import get_current_user

router = APIRouter(
    prefix="/email-drafts",
    tags=["Email Drafts"],
)


@router.get("/", response_model=List[schemas.EmailDraftResponse])
def get_email_drafts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Return all saved cold email drafts for the current user, newest first."""
    return (
        db.query(models.EmailDraft)
        .filter(models.EmailDraft.user_id == current_user.id)
        .order_by(models.EmailDraft.created_at.desc())
        .limit(50)
        .all()
    )


@router.post("/", response_model=schemas.EmailDraftResponse, status_code=201)
def save_email_draft(
    draft: schemas.EmailDraftCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Persist a newly generated cold email draft to the database."""
    new_draft = models.EmailDraft(
        user_id=current_user.id,
        recipient_email=draft.recipient_email,
        recipient_name=draft.recipient_name,
        company=draft.company,
        target_role=draft.target_role,
        tone=draft.tone,
        subject=draft.subject,
        body=draft.body,
    )
    db.add(new_draft)
    db.commit()
    db.refresh(new_draft)
    return new_draft


@router.delete("/{draft_id}", status_code=204)
def delete_email_draft(
    draft_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete a specific cold email draft. Only the owner can delete."""
    draft = (
        db.query(models.EmailDraft)
        .filter(
            models.EmailDraft.id == draft_id,
            models.EmailDraft.user_id == current_user.id,
        )
        .first()
    )
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    db.delete(draft)
    db.commit()
