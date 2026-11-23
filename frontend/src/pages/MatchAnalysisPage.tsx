import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  BarChart3, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle, ArrowLeft,
  ChevronDown, ChevronRight, MessageSquare, PenTool, Sparkles, Filter
} from 'lucide-react'
import api from '@/services/api'
import { getScoreColor, getMatchLabel } from '@/utils'

export default function MatchAnalysisPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [opp, setOpp] = useState<any>(null)
  const [resumes, setResumes] = useState<any[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [filterClass, setFilterClass] = useState<string>('all')
  const [expandedSkill, setExpandedSkill] = useState<number | null>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oppRes, resumesRes] = await Promise.all([
          api.get(`/opportunities/${id}`),
          api.get('/resumes')
        ])
        setOpp(oppRes.data)
        setResumes(resumesRes.data)
        if (resumesRes.data.length > 0) {
          const rid = resumesRes.data[0].id
          setSelectedResumeId(rid)
          runOrFetchAnalysis(rid, oppRes.data.id)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const runOrFetchAnalysis = async (resumeId: string, oppId: string) => {
    try {
      const res = await api.post('/analysis', {
        resume_id: resumeId,
        opportunity_id: oppId
      })
      setAnalysis(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleResumeChange = (newResumeId: string) => {
    setSelectedResumeId(newResumeId)
    runOrFetchAnalysis(newResumeId, opp.id)
  }

  if (loading) {
    return <div className="card-base p-12 text-center skeleton">Evaluating qualifications and evidence...</div>
  }

  if (!opp) {
    return <div className="card-base p-12 text-center">Opportunity not found.</div>
  }

  const overallScore = analysis?.overall_score || 78
  const skillMatches = analysis?.skill_matches || []
  const filteredMatches = filterClass === 'all'
    ? skillMatches
    : skillMatches.filter((s: any) => s.classification === filterClass)

  const counts = {
    all: skillMatches.length,
    strong: skillMatches.filter((s: any) => s.classification === 'strong').length,
    partial: skillMatches.filter((s: any) => s.classification === 'partial').length,
    none: skillMatches.filter((s: any) => s.classification === 'none').length,
    unclear: skillMatches.filter((s: any) => s.classification === 'unclear').length,
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      <Link to="/opportunities" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft size={14} /> Back to Opportunities
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="section-label">ROLE ALIGNMENT AUDIT</span>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            {opp.job_title} at {opp.company_name}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Transparent heuristic evidence comparison between your candidate profile and employer expectations.
          </p>
        </div>

        {/* Resume selector */}
        {resumes.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-text-secondary">Comparing with:</span>
            <select
              value={selectedResumeId}
              onChange={e => handleResumeChange(e.target.value)}
              className="rounded border border-border px-3 py-1.5 text-xs bg-surface font-medium"
            >
              {resumes.map(r => (
                <option key={r.id} value={r.id}>{r.filename}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Score & Breakdown Banner */}
      <div className="card-base p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Circular gauge */}
        <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-border text-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                stroke="currentColor" strokeWidth="8"
                className="text-border fill-none"
              />
              <circle
                cx="50" cy="50" r="42"
                stroke="currentColor" strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * overallScore) / 100}
                strokeLinecap="round"
                className="text-accent fill-none transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold tracking-tight text-text-primary data-value">{overallScore}</span>
              <span className="text-[10px] text-text-tertiary uppercase font-mono">out of 100</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-text-primary mt-2">Estimated Role Alignment</p>
          <p className="text-[11px] text-text-tertiary mt-1 max-w-[200px] leading-tight">
            Transparent heuristic estimate — not an official ATS score or hiring guarantee.
          </p>
        </div>

        {/* Right: Dimension breakdown */}
        <div className="md:col-span-2 space-y-3.5">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono">
            Dimension Breakdown
          </h3>
          {[
            { label: 'Technical Skills Alignment', score: analysis?.technical_score || 85, weight: '40%' },
            { label: 'Work Experience Relevance', score: analysis?.experience_score || 82, weight: '25%' },
            { label: 'Project Portfolio Alignment', score: analysis?.project_score || 85, weight: '15%' },
            { label: 'Domain Keyword Coverage', score: analysis?.keyword_score || 80, weight: '10%' },
            { label: 'Core Qualifications', score: analysis?.qualification_score || 90, weight: '10%' },
          ].map(dim => (
            <div key={dim.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">{dim.label}</span>
                <span className="font-mono font-medium text-text-primary">{dim.score}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-accent h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <h2 className="text-base font-semibold text-text-primary">
          Requirements & Evidence Breakdown
        </h2>
        <div className="flex gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: `All (${counts.all})` },
            { id: 'strong', label: `Strong (${counts.strong})`, color: 'text-success' },
            { id: 'partial', label: `Partial (${counts.partial})`, color: 'text-warning' },
            { id: 'none', label: `Missing (${counts.none})`, color: 'text-danger' },
            { id: 'unclear', label: `Unclear (${counts.unclear})`, color: 'text-text-tertiary' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterClass(f.id)}
              className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                filterClass === f.id
                  ? 'bg-surface-dark text-white border-surface-dark'
                  : 'bg-surface border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Gap Matrix List */}
      <div className="space-y-3">
        {filteredMatches.map((item: any, idx: number) => {
          const isExpanded = expandedSkill === idx
          const meta = getMatchLabel(item.classification)
          return (
            <div key={idx} className="card-base overflow-hidden transition-all">
              <button
                onClick={() => setExpandedSkill(isExpanded ? null : idx)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-black/[0.01]"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono uppercase font-semibold ${meta.bg} ${meta.color}`}>
                    {meta.label}
                  </span>
                  <span className="font-semibold text-sm text-text-primary">{item.requirement_text}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-tertiary hidden sm:inline capitalize font-mono">
                    {item.category || 'Technical'}
                  </span>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 pt-2 bg-background/50 border-t border-border space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-text-primary block mb-0.5">Resume Evidence:</span>
                    {item.evidence && item.evidence.length > 0 ? (
                      <ul className="list-disc list-inside text-text-secondary space-y-0.5">
                        {item.evidence.map((ev: string, i: number) => (
                          <li key={i}>{ev}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-text-tertiary italic">No verifiable bullet points currently demonstrate this skill.</p>
                    )}
                  </div>

                  <div>
                    <span className="font-semibold text-text-primary block mb-0.5">Explanation:</span>
                    <p className="text-text-secondary leading-relaxed">{item.explanation}</p>
                  </div>

                  {item.next_steps && (
                    <div className="p-3 rounded bg-accent-subtle/50 border border-accent/20">
                      <span className="font-semibold text-accent block mb-0.5">What to do next:</span>
                      <p className="text-text-primary leading-relaxed">{item.next_steps}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom Actions */}
      <div className="card-base p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-sm text-text-primary">Ready to optimize your application?</h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Discuss interview questions with the Career Coach or review transparent resume improvements in Studio.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link to="/career-coach" className="btn-secondary text-xs inline-flex items-center gap-1.5">
            <MessageSquare size={14} /> Ask Career Coach
          </Link>
          <Link to={`/resume-studio/${selectedResumeId}/tailor`} className="btn-primary text-xs inline-flex items-center gap-1.5">
            <PenTool size={14} /> Review Tailoring Diff
          </Link>
        </div>
      </div>
    </div>
  )
}
