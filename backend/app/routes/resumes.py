from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Response
import io
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
async def create_resume(
    name: str = Form(...),
    is_default: bool = Form(False),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new resume for the user."""
    # Enforce premium limit
    if not current_user.is_premium:
        count = db.query(Resume).filter(Resume.user_id == current_user.id).count()
        if count >= 2:
            raise HTTPException(status_code=403, detail="Free users can only create up to 2 resumes. Please upgrade to Premium for unlimited resumes.")

    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    filename = file.filename.lower()
    content_bytes = await file.read()
    
    try:
        text_content = ""
        if filename.endswith(".pdf"):
            import PyPDF2
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content_bytes))
            for page in pdf_reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text_content += extracted + "\n"
        elif filename.endswith(".docx"):
            import docx2txt
            text_content = docx2txt.process(io.BytesIO(content_bytes))
        elif filename.endswith(".txt") or filename.endswith(".md"):
            text_content = content_bytes.decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, DOCX, or TXT.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse file: {str(e)}")

    # If this is set to default, unset default on others
    if is_default:
        db.query(Resume).filter(Resume.user_id == current_user.id).update({"is_default": False})

    new_resume = Resume(
        user_id=current_user.id,
        name=name,
        content=text_content.strip(),
        is_default=is_default,
        file_data=content_bytes if filename.endswith(".pdf") else None,
        filename=file.filename if filename.endswith(".pdf") else None
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

@router.get("/{resume_id}/download")
def download_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Download a resume PDF."""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    if not resume.file_data:
        raise HTTPException(status_code=404, detail="No PDF file is associated with this resume.")
        
    return Response(content=resume.file_data, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="{resume.filename or "resume.pdf"}"'})
