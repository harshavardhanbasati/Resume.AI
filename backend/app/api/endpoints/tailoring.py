from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.entities import User, Resume, Opportunity, ResumeChange
from app.services.ai_engine import generate_tailoring_suggestions

router = APIRouter(prefix="/tailoring", tags=["tailoring"])

@router.get("/{resume_id}")
def get_suggestions(
    resume_id: str,
    opportunity_id: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    changes = db.query(ResumeChange).filter(ResumeChange.resume_id == resume_id).all()
    if not changes:
        opp = None
        if opportunity_id:
            opp = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
        if not opp:
            opp_dict = {"company_name": "Target Company", "job_title": "Software Engineer"}
        else:
            opp_dict = {"company_name": opp.company_name, "job_title": opp.job_title}
            
        suggestions = generate_tailoring_suggestions(resume.profile or {}, opp_dict)
        for s in suggestions:
            rc = ResumeChange(
                resume_id=resume.id,
                section=s["section"],
                original_text=s["original_text"],
                proposed_text=s["proposed_text"],
                reason=s["reason"],
                related_requirement=s["related_requirement"],
                supporting_evidence=s["supporting_evidence"],
                needs_verification=s["needs_verification"],
                status="pending"
            )
            db.add(rc)
        db.commit()
        changes = db.query(ResumeChange).filter(ResumeChange.resume_id == resume_id).all()
    return changes

@router.patch("/{change_id}")
def update_change_status(
    change_id: str,
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    change = db.query(ResumeChange).filter(ResumeChange.id == change_id).first()
    if not change:
        raise HTTPException(status_code=404, detail="Change not found")
    
    if "status" in payload:
        change.status = payload["status"]
    if "edited_text" in payload:
        change.edited_text = payload["edited_text"]
        change.status = "edited"
        
    db.commit()
    db.refresh(change)
    return change
