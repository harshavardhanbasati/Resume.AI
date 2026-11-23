from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.core.security import get_password_hash
from app.models.entities import User, Resume, Opportunity, CompanyResearch, Analysis
from app.services.ai_engine import analyze_job_description, research_company, calculate_match_analysis
from app.services.document_parser import parse_resume_text
from app.api.endpoints import auth, resumes, opportunities, analysis, coach, tailoring

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ResumeAI Career Intelligence API",
    description="Backend API for ResumeAI platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(resumes.router, prefix=settings.API_V1_STR)
app.include_router(opportunities.router, prefix=settings.API_V1_STR)
app.include_router(analysis.router, prefix=settings.API_V1_STR)
app.include_router(coach.router, prefix=settings.API_V1_STR)
app.include_router(tailoring.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_seed_data():
    """Seed default demo user and initial sample data if not present."""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "demo@resumeai.com").first()
        if not user:
            user = User(
                email="demo@resumeai.com",
                name="Harsha Basati",
                hashed_password=get_password_hash("password123")
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            # Seed demo resume
            demo_resume_profile = parse_resume_text(
                "Harsha Basati\nSoftware Engineer with experience in Python, TypeScript, React, PostgreSQL, Docker, AWS and FastAPI.\nTech Solutions Inc.\nSoftware Engineer",
                "Harsha_Basati_Resume.pdf"
            )
            resume = Resume(
                user_id=user.id,
                filename="Harsha_Basati_Resume.pdf",
                file_type="pdf",
                file_size=142800,
                file_path="uploads/demo_resume.pdf",
                status="verified",
                raw_text="Harsha Basati Software Engineer...",
                profile=demo_resume_profile
            )
            db.add(resume)
            db.commit()
            db.refresh(resume)

            # Seed demo opportunity
            jd_text = (
                "Vercel is looking for a Software Engineer to join our Frontend Cloud Infrastructure team.\n"
                "Requirements:\n"
                "- Strong proficiency with TypeScript, React, and modern web architecture.\n"
                "- Experience with cloud deployments, distributed systems, and low-latency APIs.\n"
                "- Familiarity with PostgreSQL, Docker, and CI/CD pipelines.\n"
                "- Understanding of performance profiling and automated test frameworks."
            )
            intel = analyze_job_description("Vercel", "Software Engineer", jd_text)
            opp = Opportunity(
                user_id=user.id,
                company_name="Vercel",
                job_title="Software Engineer",
                job_description=jd_text,
                job_url="https://vercel.com/careers",
                location="San Francisco, CA (Remote)",
                employment_type="full-time",
                status="analyzed",
                intelligence=intel
            )
            db.add(opp)
            db.commit()
            db.refresh(opp)

            # Seed company research
            res_data = research_company("Vercel", jd_text)
            comp_res = CompanyResearch(
                opportunity_id=opp.id,
                company_name="Vercel",
                overview=res_data.get("overview"),
                industry=res_data.get("industry"),
                products_services=res_data.get("products_services"),
                business_model=res_data.get("business_model"),
                technologies=res_data.get("technologies"),
                website=res_data.get("website"),
                culture_values=res_data.get("culture_values"),
                sources=res_data.get("sources")
            )
            db.add(comp_res)
            db.commit()

            # Seed analysis
            analysis_data = calculate_match_analysis(demo_resume_profile, intel)
            ana = Analysis(
                user_id=user.id,
                resume_id=resume.id,
                opportunity_id=opp.id,
                overall_score=analysis_data["overall_score"],
                technical_score=analysis_data["technical_score"],
                experience_score=analysis_data["experience_score"],
                project_score=analysis_data["project_score"],
                keyword_score=analysis_data["keyword_score"],
                qualification_score=analysis_data["qualification_score"],
                skill_matches=analysis_data["skill_matches"],
                recommendations=analysis_data["recommendations"],
                status="completed"
            )
            db.add(ana)
            db.commit()
    finally:
        db.close()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "ResumeAI", "database": "PostgreSQL"}
