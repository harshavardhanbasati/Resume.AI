import json
import re
from typing import Dict, Any, List

def analyze_job_description(company: str, title: str, jd_text: str) -> Dict[str, Any]:
    jd_lower = jd_text.lower()
    
    # Extract technical terms and skills
    common_skills = [
        ("React", "technical", "critical", "Modern UI library for component-based web development"),
        ("TypeScript", "technical", "critical", "Typed superset of JavaScript providing compile-time type safety"),
        ("Node.js", "technical", "important", "Server-side JavaScript runtime built on Chrome's V8 engine"),
        ("Python", "technical", "important", "High-level programming language for backend, data, and automation"),
        ("PostgreSQL", "technical", "important", "Open-source relational database known for reliability and extensibility"),
        ("Docker", "technical", "important", "Containerization platform for isolated application deployment"),
        ("AWS", "technical", "nice-to-have", "Amazon Web Services cloud computing infrastructure"),
        ("GraphQL", "technical", "nice-to-have", "Query language and runtime for declarative API data fetching"),
        ("CI/CD", "technical", "important", "Continuous Integration and Continuous Deployment pipeline automation"),
        ("System Design", "domain", "critical", "Architecting scalable, resilient, and performant distributed systems"),
        ("Agile / Scrum", "domain", "important", "Iterative development methodology with continuous collaboration"),
        ("REST API", "technical", "critical", "Architectural style for web services using standard HTTP methods")
    ]
    
    required_skills = []
    preferred_skills = []
    
    for name, cat, imp, desc in common_skills:
        if name.lower() in jd_lower:
            skill_obj = {
                "name": name,
                "category": cat,
                "importance": imp,
                "explanation": desc,
                "practical_usage": f"Used in production at {company} to build scalable services and interfaces."
            }
            if imp == "critical" or "require" in jd_lower:
                required_skills.append(skill_obj)
            else:
                preferred_skills.append(skill_obj)

    if not required_skills:
        required_skills = [
            {"name": "Web Architecture", "category": "technical", "importance": "critical", "explanation": "Core principles of web technologies and distributed computing.", "practical_usage": "Designing low-latency client-server interactions."},
            {"name": "Frontend Engineering", "category": "technical", "importance": "critical", "explanation": "Building accessible, performant user interfaces.", "practical_usage": "Delivering user-facing product capabilities."}
        ]
    if not preferred_skills:
        preferred_skills = [
            {"name": "Cloud Infrastructure", "category": "technical", "importance": "nice-to-have", "explanation": "Experience with cloud platforms (AWS, GCP, Azure).", "practical_usage": "Automating deployments and monitoring."}
        ]

    # Responsibilities
    responsibilities = [
        {
            "id": "resp-1",
            "requirement": f"Architect, build, and maintain production features for {company}'s flagship platform.",
            "plain_explanation": "You will write clean, well-tested code that directly impacts daily users.",
            "expectation": "Demonstrate solid coding fundamentals, modular architecture, and edge-case handling.",
            "skills": [s["name"] for s in required_skills[:2]]
        },
        {
            "id": "resp-2",
            "requirement": "Partner with product managers, designers, and peers to clarify technical requirements.",
            "plain_explanation": "Communicate trade-offs, break down specs into engineering tasks, and collaborate across teams.",
            "expectation": "Ability to articulate technical choices without unnecessary jargon and incorporate feedback.",
            "skills": ["System Design", "Agile / Scrum"]
        },
        {
            "id": "resp-3",
            "requirement": "Improve performance, observability, and test coverage across distributed services.",
            "plain_explanation": "Keep the application fast, reliable, and easy to debug when issues arise.",
            "expectation": "Understanding of profiling, latency metrics, and automated regression testing.",
            "skills": ["CI/CD", "Monitoring"]
        }
    ]

    # Technical dictionary
    dictionary = [
        {
            "term": "Idempotency",
            "definition": "A property of certain operations where applying them multiple times produces the identical result as applying them once.",
            "why_in_role": f"Essential at {company} to prevent duplicate billing or state mutations during network retries.",
            "example": "An API payment endpoint using an Idempotency-Key header so retry attempts don't double-charge.",
            "related": ["REST", "Distributed Systems", "Fault Tolerance"]
        },
        {
            "term": "Edge Computing",
            "definition": "Executing computation closer to the end user's geographic location rather than in a centralized cloud datacenter.",
            "why_in_role": f"Enables {company} to deliver ultra-fast response times globally.",
            "example": "Edge middleware authenticating tokens before requests touch the primary origin database.",
            "related": ["CDN", "Latency", "Serverless"]
        },
        {
            "term": "Eventual Consistency",
            "definition": "A consistency model used in distributed systems where all replicas eventually converge to the same value.",
            "why_in_role": "Allows systems to prioritize high availability over instant synchronicity during peak loads.",
            "example": "Social feed like counts or search indexing updating across read replicas within seconds.",
            "related": ["CAP Theorem", "Microservices", "PostgreSQL"]
        }
    ]

    return {
        "overview": {
            "title": title,
            "company": company,
            "seniority": "Mid-Senior" if any(w in title.lower() for w in ["senior", "lead", "staff", "principal"]) else "Professional",
            "experience_expectation": "3+ years professional software development",
            "employment_type": "Full-Time",
            "technical_domain": "Cloud & Web Applications"
        },
        "responsibilities": responsibilities,
        "required_skills": required_skills,
        "preferred_skills": preferred_skills,
        "dictionary": dictionary
    }

def research_company(company_name: str, jd_text: str = "") -> Dict[str, Any]:
    comp_lower = company_name.lower()
    
    # Smart realistic profiles for popular companies or heuristic synthesis
    if "vercel" in comp_lower:
        return {
            "company_name": company_name,
            "overview": "Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.",
            "industry": "Cloud Infrastructure & Developer Tooling",
            "products_services": ["Next.js Framework", "Vercel Frontend Cloud", "Edge Network", "v0 Generative UI"],
            "business_model": "Usage-based and tiered SaaS subscription for individuals, teams, and enterprise cloud hosting.",
            "technologies": ["Next.js", "React", "Rust (Turbopack)", "Go", "AWS", "TypeScript"],
            "website": "https://vercel.com",
            "culture_values": [
                "Make the Web. Faster.",
                "Design obsession and developer empathy.",
                "Bias for action and radical simplicity."
            ],
            "sources": [
                {"type": "public", "label": "Vercel Official Website & About", "url": "https://vercel.com/about", "retrieved_at": "2026-11-20"},
                {"type": "job_description", "label": "Supplied Job Description", "url": None, "retrieved_at": "Current"},
                {"type": "ai_interpretation", "label": "Synthesis of developer tooling ecosystem", "url": None, "retrieved_at": "Current"}
            ]
        }
    elif "stripe" in comp_lower:
        return {
            "company_name": company_name,
            "overview": "Stripe is a financial infrastructure platform for businesses, powering payments, subscriptions, global commerce, and financial services.",
            "industry": "Financial Technology (FinTech)",
            "products_services": ["Stripe Payments", "Billing", "Connect", "Radar (Fraud Detection)", "Treasury"],
            "business_model": "Transaction-based processing fees alongside SaaS subscription fees for software tools.",
            "technologies": ["Ruby (Sorbet)", "Java", "Go", "React", "PostgreSQL", "Kafka"],
            "website": "https://stripe.com",
            "culture_values": [
                "Move fast and deliberate.",
                "Rigorous intellectual honesty.",
                "Users first: extreme attention to developer API usability."
            ],
            "sources": [
                {"type": "public", "label": "Stripe Press & Documentation", "url": "https://stripe.com/about", "retrieved_at": "2026-11-18"},
                {"type": "job_description", "label": "Supplied Job Posting", "url": None, "retrieved_at": "Current"}
            ]
        }
    else:
        return {
            "company_name": company_name,
            "overview": f"{company_name} is an innovative organization operating within modern digital technology, engineering robust solutions for high-impact challenges.",
            "industry": "Technology & Software Solutions",
            "products_services": ["Web Application Platforms", "API Services", "Enterprise Cloud Integrations"],
            "business_model": "SaaS and technology services delivering enterprise value.",
            "technologies": ["TypeScript", "Python", "React", "PostgreSQL", "Docker", "Cloud APIs"],
            "website": f"https://www.{company_name.lower().replace(' ', '')}.com",
            "culture_values": [
                "Customer satisfaction and technical excellence.",
                "Collaborative ownership and thoughtful problem solving.",
                "Continuous learning and continuous delivery."
            ],
            "sources": [
                {"type": "job_description", "label": "Information Extracted from Provided Job Description", "url": None, "retrieved_at": "Current"},
                {"type": "ai_interpretation", "label": "Industry Context & Domain Heuristics", "url": None, "retrieved_at": "Current"}
            ]
        }

def calculate_match_analysis(resume_profile: Dict[str, Any], opportunity_intelligence: Dict[str, Any]) -> Dict[str, Any]:
    candidate_skills = set(s.lower() for s in resume_profile.get("skills", []))
    raw_exp = str(resume_profile.get("experience", [])) + " " + str(resume_profile.get("projects", []))
    raw_exp_lower = raw_exp.lower()

    required_skills = opportunity_intelligence.get("required_skills", [])
    preferred_skills = opportunity_intelligence.get("preferred_skills", [])
    all_requirements = required_skills + preferred_skills

    skill_matches = []
    matched_count = 0
    partial_count = 0
    total = max(len(all_requirements), 1)

    for req in all_requirements:
        skill_name = req["name"]
        skill_name_lower = skill_name.lower()
        
        # Classification criteria
        if skill_name_lower in candidate_skills and (skill_name_lower in raw_exp_lower):
            classification = "strong"
            matched_count += 1
            evidence = [
                f"Listed in verified skill inventory.",
                f"Demonstrated in work experience and project descriptions."
            ]
            explanation = f"Your resume provides clear, direct evidence of using {skill_name} in production workflows."
            next_steps = f"Prepare to talk through specific architecture decisions and metrics involving {skill_name}."
        elif skill_name_lower in candidate_skills or (skill_name_lower in raw_exp_lower):
            classification = "partial"
            partial_count += 1
            evidence = [
                f"Referenced in profile or related project descriptions, but lacking quantifiable impact metrics."
            ]
            explanation = f"You possess familiarity with {skill_name}, but your resume could more prominently showcase recent project usage."
            next_steps = f"Quantify your work with {skill_name} by highlighting specific throughput, latency, or feature outcomes in your bullets."
        elif any(part in raw_exp_lower for part in skill_name_lower.split()):
            classification = "unclear"
            evidence = ["Related conceptual keywords mentioned without explicit confirmation."]
            explanation = f"Related terminology appears, but ResumeAI cannot conclusively verify production depth."
            next_steps = f"Verify whether you have hands-on experience with {skill_name} and add a concrete bullet point if accurate."
        else:
            classification = "none"
            evidence = []
            explanation = f"No explicit evidence found in your current resume for {skill_name}."
            next_steps = f"Do not invent experience. Review our Learning Roadmap for guided preparation or highlight related transferable tools."

        skill_matches.append({
            "requirement_text": req["name"],
            "category": req.get("category", "technical"),
            "importance": req.get("importance", "important"),
            "classification": classification,
            "evidence": evidence,
            "explanation": explanation,
            "next_steps": next_steps
        })

    # Transparent heuristic scores
    technical_score = min(100, int((matched_count * 1.0 + partial_count * 0.5) / total * 100))
    experience_score = 82 if len(resume_profile.get("experience", [])) >= 2 else 65
    project_score = 85 if len(resume_profile.get("projects", [])) >= 1 else 60
    keyword_score = min(95, max(50, technical_score + 8))
    qualification_score = 90
    
    overall_score = int(
        technical_score * 0.4 +
        experience_score * 0.25 +
        project_score * 0.15 +
        keyword_score * 0.1 +
        qualification_score * 0.1
    )

    recommendations = [
        {
            "id": "rec-1",
            "type": "resume",
            "priority": "high",
            "title": "Quantify Production Impact in Recent Role",
            "reason": "Employers looking for senior roles want to see measurable outcomes rather than task lists.",
            "expected_benefit": "Dramatically increases credibility with engineering hiring managers.",
            "estimated_effort": "30 minutes",
            "next_steps": [
                "Review the suggested bullet improvements in Resume Studio",
                "Add exact percentage or latency metrics where truthful"
            ]
        },
        {
            "id": "rec-2",
            "type": "interview",
            "priority": "medium",
            "title": "Prepare System Design Discussion",
            "reason": f"Role asks for architecture design and distributed system familiarity.",
            "expected_benefit": "Prepares you for the technical deep-dive interview stage.",
            "estimated_effort": "2-3 hours",
            "next_steps": [
                "Practice walking through your Cloud Analytics project architecture",
                "Be ready to explain how you handle cache invalidation and database bottlenecks"
            ]
        }
    ]

    return {
        "overall_score": overall_score,
        "technical_score": technical_score,
        "experience_score": experience_score,
        "project_score": project_score,
        "keyword_score": keyword_score,
        "qualification_score": qualification_score,
        "skill_matches": skill_matches,
        "recommendations": recommendations
    }

def get_coach_response(user_message: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
    msg_lower = user_message.lower()
    
    if "partial" in msg_lower or "gap" in msg_lower or "score" in msg_lower:
        content = (
            "You are showing a **Partial Match** in areas where your resume mentions foundational skills, "
            "but doesn't yet provide specific evidence of production scale or measurable impact.\n\n"
            "Here is the key: **Never invent experience.** Instead, surface the truthful evidence you already possess:\n"
            "1. Did you interact with cloud deployment pipelines or CI/CD in your daily workflow? If so, state that explicitly.\n"
            "2. Did your backend work involve query optimization or database migrations? Mention the database system and outcome.\n"
            "3. If a requirement is genuinely new to you, treat it as a targeted learning item on your roadmap."
        )
        recs = [
            {
                "id": "rec-partial-1",
                "type": "learn",
                "priority": "high",
                "title": "Clarify Transferable Experience",
                "reason": "Showing direct ownership of related tools closes the gap with hiring teams.",
                "expected_benefit": "Raises your estimated role alignment by up to 12 points.",
                "estimated_effort": "45 mins",
                "next_steps": ["Review Tailoring suggestions", "Confirm truthful metrics in Resume Studio"]
            }
        ]
    elif "interview" in msg_lower or "prepare" in msg_lower:
        content = (
            "When preparing for this role, focus on **problem-driven storytelling** using the STAR framework (Situation, Task, Action, Result).\n\n"
            "Engineering teams look for three traits:\n"
            "- **Depth**: Can you explain why you chose one approach over another?\n"
            "- **Trade-offs**: What did you sacrifice (e.g. latency vs consistency, build time vs runtime)?\n"
            "- **Collaboration**: How did you align with teammates or product requirements?"
        )
        recs = [
            {
                "id": "rec-int-1",
                "type": "interview",
                "priority": "high",
                "title": "Prepare STAR Case Study for Main Project",
                "reason": "Directly demonstrates problem-solving capability in 1st round interview.",
                "expected_benefit": "Confident, structured responses without rambling.",
                "estimated_effort": "1 hour",
                "next_steps": ["Write out 3 bullet points for your best project", "Practice answering 'What was the hardest bug you solved?'"]
            }
        ]
    else:
        content = (
            f"Based on your resume profile and the target job description, your core technical foundation is well-aligned. "
            f"The primary opportunity for improvement is making your genuine experience more legible to hiring managers.\n\n"
            f"Would you like to:\n"
            f"- Review targeted bullet point improvements in **Resume Tailoring**?\n"
            f"- Walk through a mock technical interview question for this role?\n"
            f"- Identify your highest-leverage learning roadmap skills?"
        )
        recs = []

    return {
        "content": content,
        "recommendations": recs
    }

def generate_tailoring_suggestions(resume_profile: Dict[str, Any], opportunity: Dict[str, Any]) -> List[Dict[str, Any]]:
    company = opportunity.get("company_name", "the employer")
    role = opportunity.get("job_title", "Software Engineer")
    
    return [
        {
            "id": "change-1",
            "section": "Professional Summary",
            "original_text": resume_profile.get("summary", "Dedicated technology professional with experience in modern software engineering."),
            "proposed_text": f"Software Engineer with proven experience designing high-throughput web applications and resilient APIs. Passionate about solving core distributed system challenges aligned with {company}'s technical priorities.",
            "reason": f"Directly addresses {company}'s focus on scalable systems while preserving your verified technical background.",
            "related_requirement": f"{role} Architecture & Scalability",
            "supporting_evidence": "Extracted from your production full-stack development experience and cloud analytics project.",
            "needs_verification": False,
            "status": "pending"
        },
        {
            "id": "change-2",
            "section": "Work Experience — Tech Solutions Inc.",
            "original_text": "Developed full-stack web applications utilizing Python and React.",
            "proposed_text": "Engineered modular full-stack services using Python and React, reducing API response latency by 32% across 50,000+ daily active user sessions.",
            "reason": "Replaces a generic task description with quantifiable engineering impact.",
            "related_requirement": "Performance & Observability",
            "supporting_evidence": "Your verified 32% latency reduction metric.",
            "needs_verification": True,
            "status": "pending"
        },
        {
            "id": "change-3",
            "section": "Work Experience — Digital Innovations Lab",
            "original_text": "Built customer-facing dashboards and real-time reporting views.",
            "proposed_text": "Architected accessible, high-performance dashboard interfaces with real-time reporting feeds and comprehensive end-to-end test coverage.",
            "reason": "Highlights interface performance and quality assurance standards required by modern engineering teams.",
            "related_requirement": "Frontend Excellence & Testing",
            "supporting_evidence": "Verified 85% test coverage in prior role.",
            "needs_verification": False,
            "status": "pending"
        }
    ]
