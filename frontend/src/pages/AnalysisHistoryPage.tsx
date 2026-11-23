import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  Calendar, Building2, FileText, ChevronRight, Search
} from 'lucide-react'

// Demo data
const demoHistory = [
  {
    id: 'a1',
    company: 'Google',
    role: 'Senior Software Engineer',
    date: '2026-11-21',
    resume: 'Harsha_Vardhan_Resume_2026.pdf',
    score: 87,
    status: 'completed' as const,
  },
  {
    id: 'a2',
    company: 'Stripe',
    role: 'Full-Stack Engineer',
    date: '2026-11-19',
    resume: 'CV_Backend_Engineer.docx',
    score: 72,
    status: 'completed' as const,
  },
  {
    id: 'a3',
    company: 'Vercel',
    role: 'Frontend Developer',
    date: '2026-11-17',
    resume: 'Resume_FullStack_Nov.pdf',
    score: 93,
    status: 'completed' as const,
  },
  {
    id: 'a4',
    company: 'Notion',
    role: 'Product Engineer',
    date: '2026-11-14',
    resume: 'Harsha_Vardhan_Resume_2026.pdf',
    score: 65,
    status: 'completed' as const,
  },
  {
    id: 'a5',
    company: 'Figma',
    role: 'UI Engineer',
    date: '2026-11-10',
    resume: 'Resume_FullStack_Nov.pdf',
    score: 0,
    status: 'error' as const,
  },
]

type StatusFilter = 'all' | 'completed' | 'error'

function scoreColor(s: number): string {
  if (s >= 80) return 'text-success'
  if (s >= 60) return 'text-accent'
  return 'text-warning'
}

function scoreBg(s: number): string {
  if (s >= 80) return 'bg-success-bg'
  if (s >= 60) return 'bg-accent-subtle'
  return 'bg-warning-bg'
}

const statusBadge: Record<string, string> = {
  completed: 'bg-success-bg text-success',
  running: 'bg-warning-bg text-warning',
  error: 'bg-danger-bg text-danger',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function AnalysisHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('all')
  const [now] = useState(() => Date.now())

  const filtered = demoHistory.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    if (dateRange !== 'all') {
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
      const cutoff = now - days * 86400000
      if (new Date(item.date).getTime() < cutoff) return false
    }
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="display-heading text-2xl lg:text-3xl mb-1">Analysis History</h1>
          <p className="text-text-secondary text-[14px]">
            Review all your past resume–opportunity analyses.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date range */}
        <div className="flex items-center gap-1 card-base px-1 py-1">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={clsx(
                'px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors',
                dateRange === range
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {range === 'all' ? 'All time' : `Last ${range.replace('d', ' days')}`}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 card-base px-1 py-1">
          {(['all', 'completed', 'error'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                'px-3 py-1.5 text-[12px] font-medium rounded-md capitalize transition-colors',
                statusFilter === s
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card-base p-12 flex flex-col items-center text-center">
          <Search size={32} className="text-text-tertiary mb-3" />
          <p className="text-text-secondary text-[14px]">No analyses match the current filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Link
              key={item.id}
              to={`/history/${item.id}`}
              className="card-interactive p-4 sm:p-5 flex items-center gap-4 group block"
            >
              {/* Company icon placeholder */}
              <div className="w-11 h-11 rounded-xl bg-surface-dark flex items-center justify-center shrink-0">
                <Building2 size={20} className="text-text-inverse" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1 grid sm:grid-cols-[1fr_auto_auto] gap-y-1 gap-x-6 items-center">
                <div className="min-w-0">
                  <p className="text-[14px] font-medium truncate group-hover:text-accent transition-colors">
                    {item.company} — {item.role}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-text-tertiary mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} /> {formatDate(item.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={10} /> {item.resume}
                    </span>
                  </div>
                </div>

                {/* Score */}
                {item.status === 'completed' ? (
                  <div className={clsx('flex items-center gap-2 px-3 py-1 rounded-lg', scoreBg(item.score))}>
                    <span className={clsx('data-value text-lg', scoreColor(item.score))}>{item.score}%</span>
                    <span className="text-[11px] text-text-secondary">match</span>
                  </div>
                ) : (
                  <div />
                )}

                {/* Status badge */}
                <span
                  className={clsx(
                    'text-[11px] font-medium px-2.5 py-1 rounded-full capitalize self-center',
                    statusBadge[item.status]
                  )}
                >
                  {item.status}
                </span>
              </div>

              <ChevronRight size={16} className="text-text-tertiary shrink-0 group-hover:text-accent transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
