from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class WorkExperienceSchema(BaseModel):
    id: Optional[str] = None
    company: str
    title: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    current: bool = False
    description: Optional[str] = None
    bullets: List[str] = []

class ProjectSchema(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    technologies: List[str] = []
    url: Optional[str] = None
    highlights: List[str] = []

class EducationSchema(BaseModel):
    id: Optional[str] = None
    institution: str
    degree: str
    field: str
    start_date: str
    end_date: Optional[str] = None
    gpa: Optional[str] = None
    highlights: List[str] = []

class CertificationSchema(BaseModel):
    id: Optional[str] = None
    name: str
    issuer: str
    date: Optional[str] = None
    url: Optional[str] = None

class ResumeProfileSchema(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    website: Optional[str] = None
    summary: Optional[str] = None
    skills: List[str] = []
    experience: List[WorkExperienceSchema] = []
    projects: List[ProjectSchema] = []
    education: List[EducationSchema] = []
    certifications: List[CertificationSchema] = []
    achievements: List[str] = []

class ResumeResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    file_size: int
    status: str
    created_at: datetime
    updated_at: datetime
    profile: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class OpportunityCreate(BaseModel):
    company_name: str
    job_title: str
    job_description: str
    job_url: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = "full-time"

class OpportunityResponse(OpportunityCreate):
    id: str
    user_id: str
    status: str
    intelligence: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CoachMessageCreate(BaseModel):
    content: str
    context: Optional[str] = None

class AnalysisCreate(BaseModel):
    resume_id: str
    opportunity_id: str
