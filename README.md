# ResumeAI — AI Career Intelligence & Resume Optimization Platform

> **"Understand the opportunity. Recognize your strengths. Build your next move."**

ResumeAI is a premium, AI-powered career intelligence platform that bridges the gap between a candidate's actual, verified experience and an employer's real job requirements. 

Unlike traditional template builders or superficial keyword stuffers, ResumeAI acts as an intelligent career companion: decomposing complex job descriptions into plain expectations, conducting transparent company research with source attribution, calculating evidence-driven role alignment scores, and generating explainable, candidate-controlled resume improvements without fabricating experience.

---

## 🌟 Core Capabilities

### 1. 🔍 Job Description Intelligence
- **Deconstruct Job Postings:** Breaks down dense job descriptions into seniority levels, core responsibilities, and technical domains.
- **Plain-Language Explanations:** Explains what the employer actually means and what interviewers look for in each responsibility.
- **Interactive Technical Dictionary:** On-demand explanations of advanced engineering concepts (e.g., Idempotency, Edge Computing, Eventual Consistency) with real-world production examples.

### 2. 🏢 Company Intelligence & Research
- **Structured Company Reports:** Generates executive briefs covering overview, business model, documented technology stack, and engineering culture.
- **Source Attribution & Auditability:** Every insight explicitly cites its source type:
  - 🟢 **Verified Public:** Official documentation, company websites, press releases.
  - 🔵 **From Job Description:** Stated requirements extracted from the target job posting.
  - 🟡 **AI Synthesis:** Domain-specific architectural interpretation.
  - ⚪ **Unverified:** Marked when data cannot be independently verified.

### 3. 🎯 Evidence-Based Skill Matching
- **Transparent Role Alignment Score:** Circular visual score indicator ($0-100$) reflecting weighted technical, experience, project, and qualification relevance.
- **4-Tier Evidence Classification:**
  - **Strong Evidence:** Clear, quantifiable proof in the candidate's resume.
  - **Partial Evidence:** Related exposure, but lacks production scale or metrics.
  - **No Evidence Found:** Requirement not evidenced in current resume (no assumption of incompetence).
  - **Unclear:** Insufficient data to classify conclusively.
- **Actionable Next Steps:** Explains exactly why a classification was given and how to bridge the gap truthfully.

### 4. 💬 AI Career Coach
- **Context-Aware Advisory:** The coach understands your verified candidate profile, selected job description, company research, and match gaps.
- **Actionable Recommendation Cards:** Produces structured advice tagged by priority (`High`, `Medium`, `Low`), expected benefit, and step-by-step next actions.
- **Zero Fabrication Guarantee:** Never encourages claiming unverified or untrue skills.

### 5. ✍️ Explainable Resume Tailoring
- **Side-by-Side Diff Interface:** View original resume text alongside proposed revisions.
- **Full Traceability:** Every suggested bullet point cites the related job requirement, supporting candidate evidence, and whether verification is required.
- **Candidate Control:** Complete autonomy with one-click **Accept**, **Reject**, or inline **Edit** controls.

### 6. 📄 ATS Resume Studio
- **Clean Typography & Layouts:** Multiple professional, ATS-compliant formats (Editorial, Minimalist, Technical).
- **No ATS Traps:** Avoids complex tables, unparseable graphics, or confusing columns.
- **Print & PDF Export:** Integrated one-click print and vector PDF generation directly from the browser.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom `@theme` tokens (Swiss editorial aesthetic)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **State & Data Fetching:** [TanStack Query v5](https://tanstack.com/query) + [Axios](https://axios-http.com/)
- **Icons & Motion:** [Lucide React](https://lucide.dev/) + [Framer Motion](https://www.framer.com/motion/)
- **Form Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts:** [Recharts](https://recharts.org/)

### Backend
- **Runtime:** [Python 3.14+](https://www.python.org/)
- **Web Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **Database & ORM:** [PostgreSQL 18](https://www.postgresql.org/) + [SQLAlchemy 2.0](https://www.sqlalchemy.org/) + [Psycopg 3](https://www.psycopg.org/)
- **Data Validation:** [Pydantic v2](https://docs.pydantic.dev/) + `pydantic-settings`
- **Document Processing:** [PyMuPDF (fitz)](https://pymupdf.readthedocs.io/) for PDFs, [python-docx](https://python-docx.readthedocs.io/) for DOCX
- **Security:** Bcrypt password hashing + PyJWT Bearer token authentication
- **Local AI Provider:** [Ollama](https://ollama.ai/) adapter with resilient heuristic fallback

---

## 📂 Project Architecture

```
ResumeAI/
├── .env.example                         # Safe configuration template (committed)
├── .gitignore                           # Git ignore rules (protects .env, pycache, uploads)
├── README.md                            # Comprehensive platform documentation
│
├── backend/
│   ├── .env                             # Secret environment variables (ignored by Git)
│   ├── uploads/                         # Encrypted local storage for uploaded resumes
│   └── app/
│       ├── api/
│       │   ├── deps.py                  # JWT authentication dependency & user validation
│       │   └── endpoints/
│       │       ├── auth.py              # User signup, login, profile (/api/auth)
│       │       ├── resumes.py           # Ingestion, parsing, profile verify (/api/resumes)
│       │       ├── opportunities.py     # Target opportunities, JD breakdown (/api/opportunities)
│       │       ├── analysis.py          # Match score calculation & history (/api/analysis)
│       │       ├── coach.py             # Career coach advisory messaging (/api/coach)
│       │       └── tailoring.py         # Explainable diffs & candidate approvals (/api/tailoring)
│       ├── core/
│       │   ├── config.py                # Pydantic settings loading from .env
│       │   ├── database.py              # PostgreSQL database engine & session pool
│       │   └── security.py              # Password hashing & JWT generation
│       ├── models/
│       │   └── entities.py              # Relational models (Users, Resumes, Opportunities, etc.)
│       ├── schemas/
│       │   └── schemas.py               # Pydantic request & response schemas
│       ├── services/
│       │   ├── document_parser.py       # PDF / DOCX structured profile extraction
│       │   └── ai_engine.py             # Heuristics, JD analysis & matching logic
│       └── main.py                      # FastAPI entrypoint, CORS, table creation & seeding
│
└── frontend/
    ├── src/
    │   ├── layouts/
    │   │   ├── PublicLayout.tsx         # Public marketing page shell
    │   │   ├── AuthLayout.tsx           # Split-screen brand authentication layout
    │   │   └── AppLayout.tsx            # Vertical collapsible sidebar & topbar workspace
    │   ├── pages/
    │   │   ├── LandingPage.tsx          # Public editorial hero, trust, and how-it-works
    │   │   ├── LoginPage.tsx            # Sign-in form with 1-click demo autofill
    │   │   ├── SignupPage.tsx           # Account registration connected to PostgreSQL
    │   │   ├── ForgotPasswordPage.tsx   # Account recovery flow
    │   │   ├── ResetPasswordPage.tsx    # Password reset screen
    │   │   ├── DashboardPage.tsx        # Career intelligence workspace overview
    │   │   ├── ResumesPage.tsx          # Document repository & status tracking
    │   │   ├── ResumeUploadPage.tsx     # Drag-and-drop resume ingestion
    │   │   ├── ResumeVerifyPage.tsx     # Extracted profile verification & editor
    │   │   ├── OpportunitiesPage.tsx    # Job pipeline & target role tracker
    │   │   ├── OpportunityCreatePage.tsx# Job description ingestion & sample loader
    │   │   ├── CompanyIntelligencePage.tsx # Company research brief with citations
    │   │   ├── JobAnalysisPage.tsx      # JD expectations & interactive dictionary
    │   │   ├── MatchAnalysisPage.tsx    # Alignment gauge & 4-tier evidence breakdown
    │   │   ├── CareerCoachPage.tsx      # Contextual AI advisory workspace
    │   │   ├── ResumeStudioPage.tsx     # ATS template editor & printable export
    │   │   ├── ResumeTailoringPage.tsx  # Explainable diff review (accept/reject/edit)
    │   │   ├── AnalysisHistoryPage.tsx  # Historical comparison audit trail
    │   │   ├── LearningRoadmapPage.tsx  # Prioritized learning roadmap
    │   │   └── SettingsPage.tsx         # Account, privacy, and data management
    │   ├── services/
    │   │   └── api.ts                   # Axios client with JWT interceptor & proxy
    │   ├── types/
    │   │   └── index.ts                 # TypeScript domain entities
    │   └── utils/
    │       └── index.ts                 # Formats, helpers, score color mappings
    └── vite.config.ts                   # Vite configuration with /api proxy to FastAPI
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **Python** 3.10+ (tested on Python 3.14)
- **PostgreSQL** 14+ (installed and running locally)

---

### 2. Database & Backend Setup

1. **Verify PostgreSQL is running** and create the database `resumeai`:
   ```bash
   # In psql or your database client:
   CREATE DATABASE resumeai;
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `backend/.env` and update credentials:
   ```bash
   cp backend/.env.example backend/.env
   ```
   *Example `backend/.env`:*
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/resumeai
   SECRET_KEY=your-secure-jwt-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   OLLAMA_HOST=http://localhost:11434
   OLLAMA_MODEL=llama3.2
   ```

3. **Install Backend Dependencies**:
   ```bash
   pip install fastapi uvicorn sqlalchemy psycopg psycopg-binary pydantic pydantic-settings bcrypt PyJWT pymupdf python-docx python-multipart httpx
   ```

4. **Start the FastAPI Server**:
   ```bash
   cd backend
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   *The server automatically initializes database tables and seeds a sample demo user & opportunity on first boot.*

---

### 3. Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *Vite starts at [http://127.0.0.1:5173/](http://127.0.0.1:5173/) and proxies all `/api` requests to the FastAPI backend at `http://127.0.0.1:8000`.*

---

## 🔑 Default Credentials

For quick testing without creating a new account:

- **Email:** `demo@resumeai.com`
- **Password:** `password123`
- *(Or click the **"Auto-fill"** quick test button on the Login page)*

---

## 🔒 Security & Privacy Commitments

1. **Zero Fabrication Policy:** ResumeAI's AI engine is strictly instructed to align and surface genuine candidate evidence. It never fabricates jobs, degrees, certifications, or false metrics.
2. **Private Document Handling:** Uploaded resumes are isolated and referenced only by authenticated user sessions.
3. **No Credential Leaks:** Credentials are kept exclusively in `backend/.env`, which is permanently excluded via `.gitignore`.
4. **Candidate Control:** Every automated resume tailoring suggestion requires explicit candidate review (Accept, Reject, or Edit) before applying to final documents.

---

## 📄 License
This project is proprietary software built for modern career intelligence. All rights reserved.
