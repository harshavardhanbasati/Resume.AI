from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.entities import User, Resume, Opportunity, Analysis
from app.schemas.schemas import AnalysisCreate
from app.services.ai_engine import calculate_match_analysis

router = APIRouter(prefix="/analysis", tags=["analysis"])

@router.post("")
def run_analysis(
    req: AnalysisCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == req.resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    opp = db.query(Opportunity).filter(Opportunity.id == req.opportunity_id, Opportunity.user_id == current_user.id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
        
    res_profile = resume.profile or {}
    opp_intel = opp.intelligence or {}

    results = calculate_match_analysis(res_profile, opp_intel)

    analysis = Analysis(
        user_id=current_user.id,
        resume_id=resume.id,
        opportunity_id=opp.id,
        overall_score=results["overall_score"],
        technical_score=results["technical_score"],
        experience_score=results["experience_score"],
        project_score=results["project_score"],
        keyword_score=results["keyword_score"],
        qualification_score=results["qualification_score"],
        skill_matches=results["skill_matches"],
        recommendations=results["recommendations"],
        status="completed"
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis

@router.get("/history")
def get_analysis_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(Analysis.created_at.desc()).all()
    out = []
    for a in analyses:
        opp = db.query(Opportunity).filter(Opportunity.id == a.opportunity_id).first()
        res = db.query(Resume).filter(Resume.id == a.resume_id).first()
        out.append({
            "id": a.id,
            "opportunity_id": a.opportunity_id,
            "resume_id": a.resume_id,
            "company_name": opp.company_name if opp else "Unknown Company",
            "job_title": opp.job_title if opp else "Unknown Role",
            "resume_filename": res.filename if res else "Resume.pdf",
            "overall_score": a.overall_score,
            "status": a.status,
            "created_at": a.created_at
        })
    return out

@router.get("/{analysis_id}")
def get_analysis(analysis_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis
