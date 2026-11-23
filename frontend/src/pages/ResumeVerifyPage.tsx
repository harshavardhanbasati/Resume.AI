import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  FileText, CheckCircle2, Save, ArrowLeft, Plus, Trash2, Edit3, Briefcase, GraduationCap, Code
} from 'lucide-react'
import api from '@/services/api'

export default function ResumeVerifyPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resume, setResume] = useState<any>(null)
  const [profile, setProfile] = useState<any>({
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: [],
    experience: [],
    projects: [],
    education: [],
  })
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get(`/resumes/${id}`)
        setResume(res.data)
        if (res.data.profile) {
          setProfile(res.data.profile)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchResume()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put(`/resumes/${id}/profile`, profile)
      alert('Resume profile verified and updated!')
      navigate('/resumes')
    } catch (err) {
      alert('Failed to save verified profile.')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s: string) => s !== skillToRemove)
    })
  }

  if (loading) {
    return <div className="card-base p-12 text-center skeleton">Loading resume data...</div>
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <Link to="/resumes" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary mb-2 transition-colors">
            <ArrowLeft size={14} /> Back to Resumes
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Verify Extracted Profile
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Document: <span className="font-mono text-text-primary">{resume?.filename}</span>
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary shrink-0">
          <Save size={16} /> {saving ? 'Saving Changes...' : 'Save & Confirm Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Overview & Skills */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="card-base p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2">
              Personal Information
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-text-secondary mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name || ''}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded border border-border px-3 py-2 text-xs bg-surface"
                />
              </div>
              <div>
                <label className="block text-text-secondary mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email || ''}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full rounded border border-border px-3 py-2 text-xs bg-surface"
                />
              </div>
              <div>
                <label className="block text-text-secondary mb-1">Phone</label>
                <input
                  type="text"
                  value={profile.phone || ''}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full rounded border border-border px-3 py-2 text-xs bg-surface"
                />
              </div>
              <div>
                <label className="block text-text-secondary mb-1">Location</label>
                <input
                  type="text"
                  value={profile.location || ''}
                  onChange={e => setProfile({ ...profile, location: e.target.value })}
                  className="w-full rounded border border-border px-3 py-2 text-xs bg-surface"
                />
              </div>
            </div>
          </div>

          {/* Skills Tag Cloud */}
          <div className="card-base p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2 flex items-center justify-between">
              <span>Verified Skills</span>
              <span className="text-xs font-mono text-accent">{profile.skills?.length || 0}</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Docker)"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="w-full rounded border border-border px-3 py-1.5 text-xs bg-surface"
              />
              <button onClick={addSkill} className="btn-secondary text-xs px-3 shrink-0">
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pt-1">
              {profile.skills?.map((s: string) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-accent-subtle/80 text-accent font-medium border border-accent/20"
                >
                  {s}
                  <button onClick={() => removeSkill(s)} className="text-accent hover:text-danger">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Summary, Experience, Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <div className="card-base p-5 space-y-3">
            <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2">
              Professional Summary
            </h3>
            <textarea
              rows={3}
              value={profile.summary || ''}
              onChange={e => setProfile({ ...profile, summary: e.target.value })}
              className="w-full rounded border border-border p-3 text-xs bg-surface leading-relaxed"
            />
          </div>

          {/* Work Experience */}
          <div className="card-base p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2 flex items-center gap-2">
              <Briefcase size={16} className="text-accent" /> Work Experience
            </h3>
            {profile.experience?.map((exp: any, idx: number) => (
              <div key={exp.id || idx} className="p-4 rounded-lg border border-border bg-background/50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-sm text-text-primary">{exp.title}</h4>
                    <p className="text-xs text-text-secondary">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="text-xs font-mono text-text-tertiary">{exp.start_date} – {exp.end_date || 'Present'}</span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-text-secondary space-y-1 pt-1">
                    {exp.bullets.map((b: string, bidx: number) => (
                      <li key={bidx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="card-base p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2 flex items-center gap-2">
              <Code size={16} className="text-accent" /> Key Projects
            </h3>
            {profile.projects?.map((proj: any, idx: number) => (
              <div key={proj.id || idx} className="p-4 rounded-lg border border-border bg-background/50 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-sm text-text-primary">{proj.name}</h4>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
                      View Project ↗
                    </a>
                  )}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{proj.description}</p>
                {proj.technologies && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.technologies.map((t: string) => (
                      <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-text-secondary">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
