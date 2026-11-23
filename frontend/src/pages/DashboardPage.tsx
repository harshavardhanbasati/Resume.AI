import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  Plus, FileText, Briefcase, TrendingUp, AlertTriangle,
  Upload, Clock, CheckCircle2, Sparkles, ArrowRight,
  Target, Star, Search
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { Resume, Opportunity } from '@/types'

// Demo data
const demoResumes: Pick<Resume, 'id' | 'filename' | 'status' | 'created_at'>[] = [
  {
    id: '1',
    filename: 'Harsha_Vardhan_Resume_2026.pdf',
    status: 'verified',
    created_at: '2026-11-20T09:30:00Z',
  },
  {
    id: '2',
    filename: 'CV_Backend_Engineer.docx',
    status: 'parsed',
    created_at: '2026-11-18T14:15:00Z',
  },
  {
    id: '3',
    filename: 'Resume_FullStack_Nov.pdf',
    status: 'processing',
    created_at: '2026-11-22T16:00:00Z',
  },
]

const demoOpportunities: (Pick<Opportunity, 'id' | 'company_name' | 'job_title' | 'created_at'> & {
  alignmentScore: number
})[] = [
  { id: '1', company_name: 'Google', job_title: 'Senior Software Engineer', created_at: '2026-11-21T10:00:00Z', alignmentScore: 87 },
  { id: '2', company_name: 'Stripe', job_title: 'Full-Stack Engineer', created_at: '2026-11-19T08:45:00Z', alignmentScore: 72 },
  { id: '3', company_name: 'Vercel', job_title: 'Frontend Developer', created_at: '2026-11-17T11:30:00Z', alignmentScore: 93 },
]

// Demo data – career progress
const progressData = [
  { month: 'Jun', strength: 42 },
  { month: 'Jul', strength: 48 },
  { month: 'Aug', strength: 51 },
  { month: 'Sep', strength: 59 },
  { month: 'Oct', strength: 68 },
  { month: 'Nov', strength: 76 },
]

// Demo data – timeline
const activityTimeline = [
  { id: 1, icon: Upload, text: 'Uploaded Resume_FullStack_Nov.pdf', time: '2 hours ago', accent: false },
  { id: 2, icon: CheckCircle2, text: 'Analysis completed for Google – Senior SWE', time: '5 hours ago', accent: true },
  { id: 3, icon: Sparkles, text: 'Career Coach recommended 3 new skills', time: 'Yesterday', accent: false },
  { id: 4, icon: Target, text: 'Matched 12 skills for Stripe opportunity', time: '2 days ago', accent: false },
  { id: 5, icon: Star, text: 'Profile strength increased to 76%', time: '3 days ago', accent: true },
]

const statusColors: Record<string, string> = {
  verified: 'bg-success-bg text-success',
  parsed: 'bg-accent-subtle text-accent',
  processing: 'bg-warning-bg text-warning',
  uploading: 'bg-warning-bg text-warning',
  error: 'bg-danger-bg text-danger',
}

function getGreeting(date: Date): string {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ScoreRing({ score, size = 36 }: { score: number; size?: number }) {
  const r = (size - 6) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? 'var(--color-success)' : score >= 60 ? 'var(--color-accent)' : 'var(--color-warning)'
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={3} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="rotate-90 origin-center"
        style={{ fontSize: size * 0.28, fontWeight: 600, fill: 'var(--color-text-primary)' }}
      >
        {score}
      </text>
    </svg>
  )
}

/* ─── Empty state ─── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
      {/* Composed icon illustration */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-2xl bg-accent-subtle flex items-center justify-center">
          <FileText size={40} strokeWidth={1.2} className="text-accent" />
        </div>
        <div className="absolute -top-2 -right-3 w-10 h-10 rounded-xl bg-success-bg flex items-center justify-center shadow-sm border border-border">
          <Sparkles size={18} className="text-success" />
        </div>
        <div className="absolute -bottom-2 -left-3 w-10 h-10 rounded-xl bg-warning-bg flex items-center justify-center shadow-sm border border-border">
          <Search size={18} className="text-warning" />
        </div>
        <div className="absolute -bottom-3 right-0 w-8 h-8 rounded-lg bg-accent-subtle flex items-center justify-center shadow-sm border border-border">
          <TrendingUp size={14} className="text-accent" />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Welcome to ResumeAI</h2>
      <p className="text-text-secondary max-w-md mb-8 text-[15px] leading-relaxed">
        Upload your first resume to unlock AI-powered skill analysis, job matching,
        and personalized career coaching.
      </p>

      <Link to="/resumes" className="btn-primary">
        <Upload size={16} />
        Upload your first resume
      </Link>
    </div>
  )
}

/* ─── Main dashboard ─── */
export default function DashboardPage() {
  const [showEmpty] = useState(false)
  const [currentDate] = useState(() => new Date())

  if (showEmpty) return <EmptyState />

  const today = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Greeting ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="display-heading text-3xl lg:text-4xl mb-1">
            {getGreeting(currentDate)}, Harsha
          </h1>
          <p className="text-text-secondary text-[15px]">{today}</p>
        </div>
        <Link to="/resumes" className="btn-primary self-start sm:self-auto">
          <Plus size={16} />
          Start new analysis
        </Link>
      </div>

      {/* ── Stats row (editorial style, varied treatments) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 — accent background */}
        <div className="card-base p-5 bg-accent-subtle/40">
          <span className="data-value text-3xl text-accent">3</span>
          <p className="section-label mt-1">Resumes analyzed</p>
        </div>

        {/* Stat 2 — bordered, left-accent stripe */}
        <div className="card-base p-5 relative overflow-hidden">
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
          <span className="data-value text-3xl">5</span>
          <p className="section-label mt-1">Opportunities evaluated</p>
        </div>

        {/* Stat 3 — success tint */}
        <div className="card-base p-5 bg-success-bg/50">
          <span className="data-value text-3xl text-success">12</span>
          <p className="section-label mt-1">Skills with strong evidence</p>
        </div>

        {/* Stat 4 — warning tint */}
        <div className="card-base p-5 bg-warning-bg/50">
          <div className="flex items-center gap-2">
            <span className="data-value text-3xl text-warning">4</span>
            <AlertTriangle size={16} className="text-warning mt-1" />
          </div>
          <p className="section-label mt-1">Skills needing development</p>
        </div>
      </div>

      {/* ── Two-column: Resumes + Opportunities ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Resumes */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[15px]">Recent Resumes</h2>
            <Link to="/resumes" className="btn-ghost text-xs gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {demoResumes.map((r) => (
              <Link
                key={r.id}
                to={`/resumes/${r.id}`}
                className="card-interactive p-4 flex items-center gap-4 group block"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium truncate group-hover:text-accent transition-colors">
                    {r.filename}
                  </p>
                  <p className="text-[11px] text-text-tertiary">{formatDate(r.created_at)}</p>
                </div>
                <span className={clsx('text-[11px] font-medium px-2 py-0.5 rounded-full capitalize', statusColors[r.status])}>
                  {r.status}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Active Opportunities */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[15px]">Active Opportunities</h2>
            <Link to="/opportunities" className="btn-ghost text-xs gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {demoOpportunities.map((o) => (
              <Link
                key={o.id}
                to={`/opportunities/${o.id}`}
                className="card-interactive p-4 flex items-center gap-4 group block"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-dark flex items-center justify-center shrink-0">
                  <Briefcase size={18} className="text-text-inverse" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium truncate group-hover:text-accent transition-colors">
                    {o.job_title}
                  </p>
                  <p className="text-[11px] text-text-tertiary">{o.company_name} · {formatDate(o.created_at)}</p>
                </div>
                <ScoreRing score={o.alignmentScore} />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── Two-column: Progress chart + Activity ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Career Progress */}
        <section className="card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[14px]">Profile Strength Over Time</h3>
            <span className="section-label">Last 6 months</span>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="strengthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value}%`, 'Strength']}
                />
                <Area
                  type="monotone"
                  dataKey="strength"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  fill="url(#strengthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="card-base p-5">
          <h3 className="font-semibold text-[14px] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activityTimeline.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div
                  className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                    item.accent ? 'bg-accent-subtle' : 'bg-background'
                  )}
                >
                  <item.icon size={15} className={item.accent ? 'text-accent' : 'text-text-secondary'} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug">{item.text}</p>
                  <p className="text-[11px] text-text-tertiary mt-0.5 flex items-center gap-1">
                    <Clock size={10} /> {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
