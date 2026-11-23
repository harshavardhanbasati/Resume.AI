from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.entities import User, Opportunity, CompanyResearch
from app.schemas.schemas import OpportunityCreate, OpportunityResponse
from app.services.ai_engine import analyze_job_description, research_company

router = APIRouter(prefix="/opportunities", tags=["opportunities"])

@router.get("", response_model=List[OpportunityResponse])
def list_opportunities(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Opportunity).filter(Opportunity.user_id == current_user.id).order_by(Opportunity.created_at.desc()).all()

@router.post("", response_model=OpportunityResponse)
def create_opportunity(
    opp_in: OpportunityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Analyze JD with AI Engine
    intel = analyze_job_description(opp_in.company_name, opp_in.job_title, opp_in.job_description)
    
    opp = Opportunity(
        user_id=current_user.id,
        company_name=opp_in.company_name,
        job_title=opp_in.job_title,
        job_description=opp_in.job_description,
        job_url=opp_in.job_url,
        location=opp_in.location,
        employment_type=opp_in.employment_type or "full-time",
        status="analyzed",
        intelligence=intel
    )
    db.add(opp)
    db.commit()
    db.refresh(opp)

    # Automatically generate company research
    research_data = research_company(opp_in.company_name, opp_in.job_description)
    comp_res = CompanyResearch(
        opportunity_id=opp.id,
        company_name=opp_in.company_name,
        overview=research_data.get("overview"),
        industry=research_data.get("industry"),
        products_services=research_data.get("products_services"),
        business_model=research_data.get("business_model"),
        technologies=research_data.get("technologies"),
        website=research_data.get("website"),
        culture_values=research_data.get("culture_values"),
        sources=research_data.get("sources")
    )
    db.add(comp_res)
    db.commit()

    return opp

@router.get("/{opp_id}", response_model=OpportunityResponse)
def get_opportunity(opp_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id, Opportunity.user_id == current_user.id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opp

@router.get("/{opp_id}/company")
def get_company_research(opp_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    comp_res = db.query(CompanyResearch).filter(CompanyResearch.opportunity_id == opp_id).first()
    if not comp_res:
        opp = db.query(Opportunity).filter(Opportunity.id == opp_id, Opportunity.user_id == current_user.id).first()
        if not opp:
            raise HTTPException(status_code=404, detail="Opportunity not found")
        # Generate on the fly
        research_data = research_company(opp.company_name, opp.job_description)
        comp_res = CompanyResearch(
            opportunity_id=opp.id,
            company_name=opp.company_name,
            overview=research_data.get("overview"),
            industry=research_data.get("industry"),
            products_services=research_data.get("products_services"),
            business_model=research_data.get("business_model"),
            technologies=research_data.get("technologies"),
            website=research_data.get("website"),
            culture_values=research_data.get("culture_values"),
            sources=research_data.get("sources")
        )
        db.add(comp_res)
        db.commit()
        db.refresh(comp_res)
    return comp_res

@router.delete("/{opp_id}")
def delete_opportunity(opp_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id, Opportunity.user_id == current_user.id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    db.delete(opp)
    db.commit()
    return {"message": "Opportunity deleted"}
