import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Building2, Globe, ExternalLink, ShieldCheck, ArrowLeft, CheckCircle2, Info, Layers, Tag, Compass
} from 'lucide-react'
import api from '@/services/api'

export default function CompanyIntelligencePage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [research, setResearch] = useState<any>(null)

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const res = await api.get(`/opportunities/${id}/company`)
        setResearch(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCompanyData()
  }, [id])

  if (loading) {
    return <div className="card-base p-12 text-center skeleton">Compiling company intelligence report...</div>
  }

  if (!research) {
    return <div className="card-base p-12 text-center">Company intelligence not available.</div>
  }

  const getSourceBadge = (type: string) => {
    switch (type) {
      case 'public':
        return <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-success-bg text-success"><CheckCircle2 size={11} /> Verified Public</span>
      case 'job_description':
        return <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-accent-subtle text-accent"><Layers size={11} /> From Job Description</span>
      case 'ai_interpretation':
        return <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-warning-bg text-warning"><Compass size={11} /> AI Synthesis</span>
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-background text-text-tertiary">Unverified</span>
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      <Link to="/opportunities" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft size={14} /> Back to Opportunities
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="section-label">EDITORIAL RESEARCH BRIEF</span>
          <h1 className="text-3xl font-display text-text-primary mt-1">
            {research.company_name}
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Industry: <span className="font-semibold text-text-primary">{research.industry || 'Technology'}</span>
          </p>
        </div>
        {research.website && (
          <a
            href={research.website}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-xs inline-flex items-center gap-1.5 shrink-0"
          >
            <Globe size={14} /> Visit Website <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Overview */}
      <div className="card-base p-6 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider font-mono">
            Company Overview
          </h2>
          {getSourceBadge('public')}
        </div>
        <p className="text-sm text-text-secondary leading-relaxed font-sans">
          {research.overview}
        </p>
      </div>

      {/* Products & Business Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-base p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono">
              Core Products & Services
            </h3>
            {getSourceBadge('public')}
          </div>
          <ul className="space-y-2 text-xs text-text-secondary">
            {research.products_services?.map((prod: string, i: number) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>{prod}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-base p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono">
              Business Model
            </h3>
            {getSourceBadge('ai_interpretation')}
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {research.business_model}
          </p>
        </div>
      </div>

      {/* Publicly Documented Technologies */}
      <div className="card-base p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono">
            Publicly Documented Technologies
          </h3>
          {getSourceBadge('job_description')}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {research.technologies?.map((tech: string, i: number) => (
            <span
              key={i}
              className="text-xs font-mono px-3 py-1 rounded bg-accent-subtle/80 text-accent border border-accent/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Culture & Values */}
      <div className="card-base p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono">
            Culture & Engineering Philosophy
          </h3>
          {getSourceBadge('public')}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {research.culture_values?.map((val: string, i: number) => (
            <div key={i} className="p-3 rounded bg-background border border-border text-xs text-text-secondary italic">
              &ldquo;{val}&rdquo;
            </div>
          ))}
        </div>
      </div>

      {/* Source Attribution Table */}
      <div className="card-base p-5 space-y-3">
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono border-b border-border pb-2">
          Source Citations & Retrieval Audit
        </h3>
        <div className="divide-y divide-border text-xs">
          {research.sources?.map((src: any, idx: number) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">{src.label}</p>
                {src.url && (
                  <a href={src.url} target="_blank" rel="noreferrer" className="text-accent hover:underline text-[11px]">
                    {src.url}
                  </a>
                )}
              </div>
              <div className="text-right">
                {getSourceBadge(src.type)}
                {src.retrieved_at && (
                  <p className="text-[10px] text-text-tertiary mt-0.5">Date: {src.retrieved_at}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent disclaimer */}
      <div className="p-4 rounded-lg bg-surface border border-border text-xs text-text-secondary flex items-start gap-3">
        <Info size={16} className="text-accent shrink-0 mt-0.5" />
        <span>
          <strong>Ethical Research Notice:</strong> ResumeAI does not fabricate internal hiring practices, company compensation bands, or non-public intellectual property. All insights are attributed to public references or the supplied job description.
        </span>
      </div>
    </div>
  )
}
