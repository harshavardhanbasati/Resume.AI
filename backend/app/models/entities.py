import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, ForeignKey, DateTime, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    opportunities = relationship("Opportunity", back_populates="user", cascade="all, delete-orphan")
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")
    coach_messages = relationship("CoachMessage", back_populates="user", cascade="all, delete-orphan")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(10), nullable=False)  # pdf or docx
    file_size = Column(Integer, nullable=False)
    file_path = Column(String(512), nullable=False)
    status = Column(String(50), default="uploaded")  # uploaded, parsed, verified, error
    
    # Parsed structured profile stored as structured JSON
    profile = Column(JSON, nullable=True)
    raw_text = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    analyses = relationship("Analysis", back_populates="resume", cascade="all, delete-orphan")
    changes = relationship("ResumeChange", back_populates="resume", cascade="all, delete-orphan")

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    company_name = Column(String(255), nullable=False)
    job_title = Column(String(255), nullable=False)
    job_description = Column(Text, nullable=False)
    job_url = Column(String(1024), nullable=True)
    location = Column(String(255), nullable=True)
    employment_type = Column(String(50), default="full-time")
    status = Column(String(50), default="draft")
    
    # Parsed job intelligence structured data
    intelligence = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="opportunities")
    company_research = relationship("CompanyResearch", uselist=False, back_populates="opportunity", cascade="all, delete-orphan")
    analyses = relationship("Analysis", back_populates="opportunity", cascade="all, delete-orphan")

class CompanyResearch(Base):
    __tablename__ = "company_research"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    opportunity_id = Column(String(36), ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False, unique=True)
    company_name = Column(String(255), nullable=False)
    overview = Column(Text, nullable=True)
    industry = Column(String(255), nullable=True)
    products_services = Column(JSON, nullable=True)
    business_model = Column(Text, nullable=True)
    technologies = Column(JSON, nullable=True)
    website = Column(String(512), nullable=True)
    culture_values = Column(JSON, nullable=True)
    sources = Column(JSON, nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)

    opportunity = relationship("Opportunity", back_populates="company_research")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    opportunity_id = Column(String(36), ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False, index=True)
    
    overall_score = Column(Float, default=0.0)
    technical_score = Column(Float, default=0.0)
    experience_score = Column(Float, default=0.0)
    project_score = Column(Float, default=0.0)
    keyword_score = Column(Float, default=0.0)
    qualification_score = Column(Float, default=0.0)
    
    skill_matches = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)
    status = Column(String(50), default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")
    opportunity = relationship("Opportunity", back_populates="analyses")

class ResumeChange(Base):
    __tablename__ = "resume_changes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    section = Column(String(100), nullable=False)
    original_text = Column(Text, nullable=False)
    proposed_text = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    related_requirement = Column(String(255), nullable=True)
    supporting_evidence = Column(Text, nullable=True)
    needs_verification = Column(Boolean, default=False)
    status = Column(String(50), default="pending")  # pending, accepted, rejected, edited
    edited_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="changes")

class CoachMessage(Base):
    __tablename__ = "coach_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(20), nullable=False)  # user, assistant
    content = Column(Text, nullable=False)
    context = Column(String(255), nullable=True)
    recommendations = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="coach_messages")
