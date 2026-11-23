import { useState, useEffect } from 'react'
import {
  PenTool, Download, Printer, Layout, CheckCircle2, Eye, RefreshCw, Sparkles, FileText
} from 'lucide-react'
import api from '@/services/api'

export default function ResumeStudioPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [selectedResume, setSelectedResume] = useState<any>(null)
  const [template, setTemplate] = useState<'editorial' | 'minimal' | 'technical'>('editorial')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get('/resumes')
        setResumes(res.data)
        if (res.data.length > 0) {
          setSelectedResume(res.data[0])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchResumes()
  }, [])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <div className="card-base p-12 text-center skeleton">Loading Resume Studio...</div>
  }

  const profile = selectedResume?.profile || {
    name: 'Harsha Basati',
    email: 'harsha@example.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    summary: 'Senior Software Engineer with deep expertise in cloud architectures, TypeScript, React, and PostgreSQL.',
    skills: ['TypeScript', 'React', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'FastAPI'],
    experience: [
      {
        company: 'Tech Solutions Inc.',
        title: 'Software Engineer',
        location: 'San Francisco, CA',
        start_date: '2023-01',
        end_date: 'Present',
        bullets: [
          'Engineered full-stack services using Python and React, reducing API latency by 32%.',
          'Architected high-throughput telemetry pipelines handling over 50,000 daily active sessions.'
        ]
      }
    ],
    projects: [
      {
        name: 'Cloud Analytics Platform',
        description: 'Interactive telemetry dashboard and real-time query interface.',
        technologies: ['React', 'PostgreSQL', 'FastAPI', 'Docker']
      }
    ],
    education: [
      {
        institution: 'State University',
        degree: 'Bachelor of Science in Computer Science',
        start_date: '2017',
        end_date: '2021',
        highlights: ["Dean's Honor List"]
      }
    ]
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-12">
      {/* Header controls (hidden in print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border print:hidden">
        <div>
          <span className="section-label">DOCUMENT WORKSHOP</span>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            Resume Studio
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            ATS-friendly typography and live document preview with complete candidate control.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Template switcher */}
          <div className="flex rounded-md border border-border p-1 bg-surface text-xs font-medium">
            <button
              onClick={() => setTemplate('editorial')}
              className={`px-3 py-1 rounded transition-colors ${
                template === 'editorial' ? 'bg-accent text-white font-semibold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Editorial
            </button>
            <button
              onClick={() => setTemplate('minimal')}
              className={`px-3 py-1 rounded transition-colors ${
                template === 'minimal' ? 'bg-accent text-white font-semibold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Minimal
            </button>
            <button
              onClick={() => setTemplate('technical')}
              className={`px-3 py-1 rounded transition-colors ${
                template === 'technical' ? 'bg-accent text-white font-semibold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Technical
            </button>
          </div>

          <button onClick={handlePrint} className="btn-primary text-xs inline-flex items-center gap-1.5">
            <Printer size={14} /> Export / Print PDF
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Controls & metadata (hidden in print) */}
        <div className="space-y-4 print:hidden">
          <div className="card-base p-4 space-y-3">
            <span className="section-label block">ACTIVE RESUME</span>
            <select
              value={selectedResume?.id || ''}
              onChange={e => {
                const found = resumes.find(r => r.id === e.target.value)
                if (found) setSelectedResume(found)
              }}
              className="w-full rounded border border-border p-2 text-xs bg-surface font-medium"
            >
              {resumes.map(r => (
                <option key={r.id} value={r.id}>{r.filename}</option>
              ))}
            </select>
          </div>

          <div className="card-base p-4 space-y-3 text-xs">
            <span className="section-label block">ATS COMPLIANCE</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 size={14} /> Standard font hierarchies
              </div>
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 size={14} /> Clean single/two column flow
              </div>
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 size={14} /> No unparseable tables or graphics
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Printable Resume Sheet */}
        <div className="lg:col-span-3 flex justify-center">
          <div
            id="resume-printable-sheet"
            className="w-full max-w-[800px] bg-white text-[#17191F] shadow-lg rounded-sm p-10 md:p-14 border border-border min-h-[1050px] font-sans text-xs leading-relaxed print:shadow-none print:border-none print:p-0 print:m-0"
          >
            {/* Header */}
            <div className={`pb-5 mb-5 border-b ${template === 'technical' ? 'border-[#635BDA]/30' : 'border-[#E7E5DF]'}`}>
              <h1 className={`text-2xl font-bold tracking-tight text-[#17191F] mb-1 ${template === 'editorial' ? 'font-serif text-3xl' : ''}`}>
                {profile.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#737783] font-mono">
                <span>{profile.email}</span>
                {profile.phone && <span>• {profile.phone}</span>}
                {profile.location && <span>• {profile.location}</span>}
                {profile.linkedin && <span>• {profile.linkedin}</span>}
              </div>
            </div>

            {/* Summary */}
            {profile.summary && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-[#635BDA] mb-1.5">
                  Professional Summary
                </h2>
                <p className="text-xs text-[#17191F] leading-relaxed">
                  {profile.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-[#635BDA] mb-1.5">
                  Technical Core Competencies
                </h2>
                <p className="text-xs text-[#17191F] leading-relaxed font-mono">
                  {profile.skills.join(' • ')}
                </p>
              </div>
            )}

            {/* Experience */}
            {profile.experience && profile.experience.length > 0 && (
              <div className="mb-5 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-[#635BDA] border-b border-[#E7E5DF] pb-1">
                  Work Experience
                </h2>
                {profile.experience.map((exp: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-xs text-[#17191F]">{exp.title}</span>
                      <span className="text-[11px] font-mono text-[#737783]">{exp.start_date} – {exp.end_date || 'Present'}</span>
                    </div>
                    <div className="text-xs italic text-[#737783] mb-1">
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </div>
                    {exp.bullets && (
                      <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-[#17191F]">
                        {exp.bullets.map((b: string, bi: number) => (
                          <li key={bi} className="leading-relaxed">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {profile.projects && profile.projects.length > 0 && (
              <div className="mb-5 space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-[#635BDA] border-b border-[#E7E5DF] pb-1">
                  Key Projects & Engineering Deliverables
                </h2>
                {profile.projects.map((proj: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-xs text-[#17191F]">{proj.name}</span>
                      {proj.technologies && (
                        <span className="text-[10px] font-mono text-[#737783]">
                          [{proj.technologies.join(', ')}]
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#17191F]">{proj.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-[#635BDA] border-b border-[#E7E5DF] pb-1">
                  Education & Honors
                </h2>
                {profile.education.map((edu: any, i: number) => (
                  <div key={i} className="flex justify-between items-baseline text-xs">
                    <div>
                      <span className="font-bold">{edu.degree}</span> — {edu.institution}
                    </div>
                    <span className="font-mono text-[#737783] text-[11px]">{edu.start_date} – {edu.end_date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
