import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Briefcase, BookOpen, CheckCircle, ChevronDown, ChevronRight, HelpCircle, ArrowLeft, BarChart2, Tag, Layers, Sparkles
} from 'lucide-react'
import api from '@/services/api'

export default function JobAnalysisPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [opp, setOpp] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'responsibilities' | 'skills' | 'dictionary'>('overview')
  const [expandedResp, setExpandedResp] = useState<Record<string, boolean>>({ 'resp-1': true })
  const [selectedTerm, setSelectedTerm] = useState<any>(null)

  useEffect(() => {
    const fetchOpp = async () => {
      try {
        const res = await api.get(`/opportunities/${id}`)
        setOpp(res.data)
        if (res.data.intelligence?.dictionary?.length > 0) {
          setSelectedTerm(res.data.intelligence.dictionary[0])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOpp()
  }, [id])

  if (loading) {
    return <div className="card-base p-12 text-center skeleton">Deconstructing job requirements...</div>
  }

  if (!opp) {
    return <div className="card-base p-12 text-center">Opportunity not found.</div>
  }

  const intel = opp.intelligence || {}
  const overview = intel.overview || {}
  const responsibilities = intel.responsibilities || []
  const requiredSkills = intel.required_skills || []
  const preferredSkills = intel.preferred_skills || []
  const dictionary = intel.dictionary || []

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      <Link to="/opportunities" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft size={14} /> Back to Opportunities
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="section-label">JOB DESCRIPTION INTELLIGENCE</span>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            {opp.job_title}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Employer: <span className="font-semibold text-text-primary">{opp.company_name}</span> • {opp.location || 'Remote'}
          </p>
        </div>
        <Link to={`/opportunities/${opp.id}/match`} className="btn-primary shrink-0">
          <BarChart2 size={16} /> Run Resume Match Analysis
        </Link>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border gap-2 overflow-x-auto text-xs font-medium">
        {[
          { key: 'overview', label: 'Role Overview' },
          { key: 'responsibilities', label: `Responsibilities (${responsibilities.length})` },
          { key: 'skills', label: `Required & Preferred Skills (${requiredSkills.length + preferredSkills.length})` },
          { key: 'dictionary', label: `Technical Dictionary (${dictionary.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card-base p-4">
              <span className="section-label block mb-1">SENIORITY</span>
              <p className="text-sm font-semibold text-text-primary">{overview.seniority || 'Professional'}</p>
            </div>
            <div className="card-base p-4">
              <span className="section-label block mb-1">EXPERIENCE</span>
              <p className="text-sm font-semibold text-text-primary">{overview.experience_expectation || '3+ years'}</p>
            </div>
            <div className="card-base p-4">
              <span className="section-label block mb-1">EMPLOYMENT</span>
              <p className="text-sm font-semibold text-text-primary">{opp.employment_type || 'Full-Time'}</p>
            </div>
            <div className="card-base p-4">
              <span className="section-label block mb-1">DOMAIN</span>
              <p className="text-sm font-semibold text-text-primary">{overview.technical_domain || 'Engineering'}</p>
            </div>
          </div>

          <div className="card-base p-6 space-y-3">
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono border-b border-border pb-2">
              Original Job Description
            </h3>
            <p className="text-xs text-text-secondary whitespace-pre-line leading-relaxed font-sans bg-background/50 p-4 rounded-lg border border-border">
              {opp.job_description}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Responsibilities */}
      {activeTab === 'responsibilities' && (
        <div className="space-y-4">
          {responsibilities.map((r: any) => {
            const isExpanded = !!expandedResp[r.id]
            return (
              <div key={r.id} className="card-base overflow-hidden transition-all">
                <button
                  onClick={() => setExpandedResp({ ...expandedResp, [r.id]: !isExpanded })}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-black/[0.01]"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent-subtle flex items-center justify-center text-accent text-xs font-mono shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">{r.requirement}</h4>
                      <p className="text-xs text-text-tertiary mt-0.5">Click to inspect plain-language breakdown</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown size={18} className="text-text-tertiary" /> : <ChevronRight size={18} className="text-text-tertiary" />}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 bg-background/50 border-t border-border space-y-3 text-xs">
                    <div>
                      <span className="font-semibold text-text-primary block mb-0.5">What this actually means:</span>
                      <p className="text-text-secondary leading-relaxed">{r.plain_explanation}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-text-primary block mb-0.5">What the interviewer wants you to demonstrate:</span>
                      <p className="text-text-secondary leading-relaxed">{r.expectation}</p>
                    </div>
                    {r.skills && (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-text-tertiary">Related capabilities:</span>
                        <div className="flex gap-1.5">
                          {r.skills.map((s: string) => (
                            <span key={s} className="px-2 py-0.5 rounded bg-surface border border-border text-[11px] font-mono text-accent">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Tab 3: Skills */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-danger" /> Mandatory Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requiredSkills.map((s: any, idx: number) => (
                <div key={idx} className="card-base p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-text-primary">{s.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-danger-bg text-danger font-medium">
                      {s.importance}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{s.explanation}</p>
                  <p className="text-[11px] text-text-tertiary italic bg-background p-2 rounded">
                    &ldquo;{s.practical_usage}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning" /> Desirable / Preferred Qualifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preferredSkills.map((s: any, idx: number) => (
                <div key={idx} className="card-base p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-text-primary">{s.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-warning-bg text-warning font-medium">
                      {s.importance}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{s.explanation}</p>
                  <p className="text-[11px] text-text-tertiary italic bg-background p-2 rounded">
                    &ldquo;{s.practical_usage}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Technical Dictionary */}
      {activeTab === 'dictionary' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-base p-4 space-y-1">
            <span className="section-label block mb-2">TERMS IN THIS JOB</span>
            <div className="divide-y divide-border">
              {dictionary.map((term: any) => (
                <button
                  key={term.term}
                  onClick={() => setSelectedTerm(term)}
                  className={`w-full text-left py-2.5 px-3 rounded text-xs transition-colors ${
                    selectedTerm?.term === term.term
                      ? 'bg-accent text-white font-medium'
                      : 'text-text-primary hover:bg-black/[0.02]'
                  }`}
                >
                  {term.term}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            {selectedTerm ? (
              <div className="card-base p-6 space-y-4">
                <div className="border-b border-border pb-3">
                  <span className="section-label text-accent">INTERACTIVE CONCEPT BREAKDOWN</span>
                  <h3 className="text-xl font-bold text-text-primary mt-1">{selectedTerm.term}</h3>
                </div>

                <div>
                  <span className="font-semibold text-xs text-text-primary block mb-1">Beginner-Friendly Definition:</span>
                  <p className="text-xs text-text-secondary leading-relaxed bg-background/50 p-3 rounded border border-border">
                    {selectedTerm.definition}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-xs text-text-primary block mb-1">Why It Appears In This Role:</span>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {selectedTerm.why_in_role}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-xs text-text-primary block mb-1">Real-World Production Example:</span>
                  <p className="text-xs text-text-secondary leading-relaxed italic bg-accent-subtle/40 p-3 rounded border border-accent/20">
                    &ldquo;{selectedTerm.example}&rdquo;
                  </p>
                </div>

                {selectedTerm.related && (
                  <div className="pt-2">
                    <span className="font-semibold text-xs text-text-primary block mb-1.5">Related Concepts:</span>
                    <div className="flex gap-2">
                      {selectedTerm.related.map((r: string) => (
                        <span key={r} className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-surface border border-border text-text-secondary">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card-base p-12 text-center text-xs text-text-tertiary">Select a term to inspect.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
