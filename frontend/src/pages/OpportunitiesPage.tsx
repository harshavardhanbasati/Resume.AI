import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase, Plus, Search, Building2, MapPin, Sparkles, Trash2, ArrowRight, BarChart2, BookOpen
} from 'lucide-react'
import api from '@/services/api'
import { formatRelativeTime } from '@/utils'

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchOpportunities = async () => {
    try {
      const res = await api.get('/opportunities')
      setOpportunities(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return
    try {
      await api.delete(`/opportunities/${id}`)
      setOpportunities(opportunities.filter(o => o.id !== id))
    } catch (err) {
      alert('Failed to delete opportunity.')
    }
  }

  const filtered = opportunities.filter(o =>
    o.company_name.toLowerCase().includes(search.toLowerCase()) ||
    o.job_title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="section-label">TARGET ROLES & PIPELINE</span>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            Job Opportunities
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Evaluate requirements, inspect company intelligence, and calculate truthful role alignment.
          </p>
        </div>
        <Link to="/opportunities/new" className="btn-primary shrink-0">
          <Plus size={16} /> Add Job Opportunity
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-md border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-base p-6 h-56 skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-base p-12 text-center max-w-lg mx-auto my-12">
          <div className="w-14 h-14 rounded-full bg-accent-subtle flex items-center justify-center mx-auto mb-4 text-accent">
            <Briefcase size={24} />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No opportunities added yet</h3>
          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            Add a target job description or company to generate requirement breakdowns, company research reports, and transparent match analysis.
          </p>
          <Link to="/opportunities/new" className="btn-primary inline-flex">
            <Plus size={16} /> Add First Opportunity
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(opp => {
            const reqCount = opp.intelligence?.required_skills?.length || 0
            const prefCount = opp.intelligence?.preferred_skills?.length || 0
            return (
              <div key={opp.id} className="card-interactive p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-mono font-medium text-accent uppercase tracking-wider">
                      {opp.employment_type}
                    </span>
                    <button
                      onClick={() => handleDelete(opp.id)}
                      className="text-text-tertiary hover:text-danger p-1 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h3 className="font-semibold text-text-primary text-base leading-snug">
                    {opp.job_title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-text-secondary mt-1 mb-4">
                    <span className="font-medium text-text-primary flex items-center gap-1">
                      <Building2 size={13} className="text-accent" /> {opp.company_name}
                    </span>
                    {opp.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {opp.location}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="bg-background/80 rounded-md p-3 text-xs space-y-1.5 mb-4">
                    <div className="flex justify-between text-text-secondary">
                      <span>Mandatory Requirements:</span>
                      <span className="font-medium text-text-primary">{reqCount} skills</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Desirable Qualifications:</span>
                      <span className="font-medium text-text-primary">{prefCount} skills</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Added:</span>
                      <span className="text-text-tertiary">{formatRelativeTime(opp.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/opportunities/${opp.id}/company`}
                      className="btn-secondary text-[11px] py-1.5 px-2 text-center flex items-center justify-center gap-1"
                    >
                      <Building2 size={12} /> Company Intel
                    </Link>
                    <Link
                      to={`/opportunities/${opp.id}/analysis`}
                      className="btn-secondary text-[11px] py-1.5 px-2 text-center flex items-center justify-center gap-1"
                    >
                      <BookOpen size={12} /> JD Breakdown
                    </Link>
                  </div>
                  <Link
                    to={`/opportunities/${opp.id}/match`}
                    className="btn-primary text-xs py-2 w-full text-center flex items-center justify-center gap-1.5"
                  >
                    <BarChart2 size={14} /> View Match Analysis
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
