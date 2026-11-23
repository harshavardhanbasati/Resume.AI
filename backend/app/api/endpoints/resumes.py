import os
import shutil
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.api.deps import get_current_user
from app.models.entities import User, Resume, ResumeChange
from app.schemas.schemas import ResumeResponse, ResumeProfileSchema
from app.services.document_parser import extract_text_from_file, parse_resume_text

router = APIRouter(prefix="/resumes", tags=["resumes"])

@router.get("", response_model=List[ResumeResponse])
def list_resumes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).all()

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ["pdf", "docx"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX documents are supported."
        )

    # Save file
    file_id = os.urandom(8).hex()
    save_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}_{file.filename}")
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(save_path)
    
    # Extract and parse
    try:
        raw_text = extract_text_from_file(save_path, ext)
        parsed_profile = parse_resume_text(raw_text, file.filename)
    except Exception as e:
        raw_text = ""
        parsed_profile = parse_resume_text("", file.filename)

    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_type=ext,
        file_size=file_size,
        file_path=save_path,
        status="parsed",
        raw_text=raw_text,
        profile=parsed_profile
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(resume_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.put("/{resume_id}/profile", response_model=ResumeResponse)
def update_resume_profile(
    resume_id: str,
    profile_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    resume.profile = profile_data
    resume.status = "verified"
    db.commit()
    db.refresh(resume)
    return resume

@router.delete("/{resume_id}")
def delete_resume(resume_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    try:
        if os.path.exists(resume.file_path):
            os.remove(resume.file_path)
    except Exception:
        pass
    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}
