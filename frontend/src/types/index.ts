// Shared TypeScript types for ResumeAI

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export interface Resume {
  id: string
  user_id: string
  filename: string
  file_type: 'pdf' | 'docx'
  file_size: number
  status: 'uploading' | 'processing' | 'parsed' | 'verified' | 'error'
  created_at: string
  updated_at: string
  profile?: ResumeProfile
}

export interface ResumeProfile {
  name: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  website?: string
  summary?: string
  skills: string[]
  experience: WorkExperience[]
  projects: Project[]
  education: Education[]
  certifications: Certification[]
  achievements: string[]
}

export interface WorkExperience {
  id: string
  company: string
  title: string
  location?: string
  start_date: string
  end_date?: string
  current: boolean
  description: string
  bullets: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  highlights: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  start_date: string
  end_date?: string
  gpa?: string
  highlights: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date?: string
  url?: string
}

export interface Opportunity {
  id: string
  user_id: string
  company_name: string
  job_title: string
  job_description: string
  job_url?: string
  location?: string
  employment_type?: 'full-time' | 'part-time' | 'contract' | 'internship'
  status: 'draft' | 'analyzing' | 'analyzed' | 'error'
  created_at: string
  updated_at: string
}

export interface CompanyResearch {
  id: string
  opportunity_id: string
  company_name: string
  overview?: string
  industry?: string
  products_services?: string[]
  business_model?: string
  technologies?: string[]
  website?: string
  culture_values?: string[]
  sources: ResearchSource[]
  generated_at: string
}

export interface ResearchSource {
  type: 'public' | 'job_description' | 'ai_interpretation' | 'unverified'
  label: string
  url?: string
  retrieved_at?: string
}

export interface JobRequirement {
  id: string
  opportunity_id: string
  text: string
  plain_explanation: string
  category: 'required' | 'preferred'
  skill_type: 'technical' | 'soft' | 'domain' | 'qualification'
  importance: 'critical' | 'important' | 'nice-to-have'
  related_skills: string[]
}

export interface SkillMatch {
  id: string
  analysis_id: string
  requirement_id: string
  requirement_text: string
  classification: 'strong' | 'partial' | 'none' | 'unclear'
  evidence: string[]
  explanation: string
  next_steps?: string
}

export interface Analysis {
  id: string
  user_id: string
  resume_id: string
  opportunity_id: string
  overall_score: number
  technical_score: number
  experience_score: number
  project_score: number
  keyword_score: number
  qualification_score: number
  skill_matches: SkillMatch[]
  status: 'running' | 'completed' | 'error'
  created_at: string
}

export interface CoachMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  context?: string
  recommendations?: CareerRecommendation[]
}

export interface CareerRecommendation {
  id: string
  type: 'learn' | 'project' | 'resume' | 'interview' | 'practice'
  priority: 'high' | 'medium' | 'low'
  title: string
  reason: string
  expected_benefit: string
  estimated_effort?: string
  next_steps: string[]
}

export interface ResumeChange {
  id: string
  resume_id: string
  section: string
  original_text: string
  proposed_text: string
  reason: string
  related_requirement?: string
  supporting_evidence?: string
  needs_verification: boolean
  status: 'pending' | 'accepted' | 'rejected' | 'edited'
  edited_text?: string
}

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  preview_url: string
  ats_friendly: boolean
}
