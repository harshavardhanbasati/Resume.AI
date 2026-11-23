import { useState } from 'react'
import { clsx } from 'clsx'
import {
  Clock, Briefcase, ChevronDown, ChevronUp,
  Circle, Loader2, CheckCircle2, Flame, Zap, Feather
} from 'lucide-react'
import type { CareerRecommendation } from '@/types'

// Demo data – 8 skills across priority groups
const demoSkills: (CareerRecommendation & { progress: 'not_started' | 'in_progress' | 'completed' })[] = [
  {
    id: 's1',
    type: 'learn',
    priority: 'high',
    title: 'System Design',
    reason: 'Required by 4 out of 5 recent job matches including Google and Stripe roles.',
    expected_benefit: 'Unlocks senior-level engineering positions',
    estimated_effort: '6–8 weeks',
    next_steps: ['Complete Grokking System Design', 'Practice with mock interviews'],
    progress: 'in_progress',
  },
  {
    id: 's2',
    type: 'learn',
    priority: 'high',
    title: 'Kubernetes & Container Orchestration',
    reason: 'Listed as critical requirement in 3 recent opportunities.',
    expected_benefit: 'Strengthens DevOps and cloud-native skills',
    estimated_effort: '4–5 weeks',
    next_steps: ['CKA certification prep', 'Deploy a sample microservice cluster'],
    progress: 'not_started',
  },
  {
    id: 's3',
    type: 'learn',
    priority: 'high',
    title: 'GraphQL',
    reason: 'Stripe and Vercel both list GraphQL as a preferred skill.',
    expected_benefit: 'Improves API design capabilities',
    estimated_effort: '2–3 weeks',
    next_steps: ['Build a GraphQL gateway', 'Convert a REST endpoint'],
    progress: 'completed',
  },
  {
    id: 's4',
    type: 'learn',
    priority: 'medium',
    title: 'AWS Solutions Architect',
    reason: 'Cloud architecture knowledge is preferred in 60% of target roles.',
    expected_benefit: 'Broadens cloud platform expertise',
    estimated_effort: '8–10 weeks',
    next_steps: ['Study AWS Well-Architected Framework', 'Take practice exams'],
    progress: 'not_started',
  },
  {
    id: 's5',
    type: 'learn',
    priority: 'medium',
    title: 'CI/CD Pipeline Design',
    reason: 'Mentioned as important skill in Notion and Figma roles.',
    expected_benefit: 'Demonstrates DevOps maturity to employers',
    estimated_effort: '3–4 weeks',
    next_steps: ['Set up GitHub Actions for a project', 'Implement blue-green deploys'],
    progress: 'in_progress',
  },
  {
    id: 's6',
    type: 'learn',
    priority: 'medium',
    title: 'Technical Writing',
    reason: 'Product engineer roles value clear documentation skills.',
    expected_benefit: 'Enhances collaboration and promotion cases',
    estimated_effort: '2 weeks',
    next_steps: ['Write an RFC for a past project', 'Start a technical blog'],
    progress: 'not_started',
  },
  {
    id: 's7',
    type: 'learn',
    priority: 'low',
    title: 'Rust Fundamentals',
    reason: 'Emerging language in performance-critical backends.',
    expected_benefit: 'Future-proofs systems programming skills',
    estimated_effort: '6–8 weeks',
    next_steps: ['Complete Rustlings', 'Rewrite a CLI tool in Rust'],
    progress: 'not_started',
  },
  {
    id: 's8',
    type: 'learn',
    priority: 'low',
    title: 'Data Visualization with D3',
    reason: 'Nice-to-have for frontend-heavy roles at Figma and Vercel.',
    expected_benefit: 'Adds depth to frontend portfolio',
    estimated_effort: '3–4 weeks',
    next_steps: ['Build an interactive chart component', 'Contribute to an open-source viz library'],
    progress: 'not_started',
  },
]

type Priority = 'high' | 'medium' | 'low'

const priorityConfig: Record<Priority, { label: string; icon: typeof Flame; color: string; bg: string; border: string }> = {
  high: { label: 'High Priority', icon: Flame, color: 'text-danger', bg: 'bg-danger-bg', border: 'border-l-danger' },
  medium: { label: 'Medium Priority', icon: Zap, color: 'text-warning', bg: 'bg-warning-bg', border: 'border-l-accent' },
  low: { label: 'Low Priority', icon: Feather, color: 'text-text-secondary', bg: 'bg-background', border: 'border-l-border-strong' },
}

const progressConfig: Record<string, { label: string; icon: typeof Circle; color: string }> = {
  not_started: { label: 'Not started', icon: Circle, color: 'text-text-tertiary' },
  in_progress: { label: 'In progress', icon: Loader2, color: 'text-accent' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-success' },
}

function SkillCard({
  skill,
  large,
}: {
  skill: (typeof demoSkills)[number]
  large: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const prog = progressConfig[skill.progress]

  return (
    <div
      className={clsx(
        'card-interactive border-l-[3px] transition-all',
        priorityConfig[skill.priority].border,
        large ? 'p-5' : 'p-4'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className={clsx('font-semibold', large ? 'text-[16px]' : 'text-[14px]')}>
            {skill.title}
          </h3>
          <p className="text-text-secondary text-[13px] mt-1 leading-relaxed">{skill.reason}</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <prog.icon size={14} className={clsx(prog.color, skill.progress === 'in_progress' && 'animate-spin')} />
          <span className={clsx('text-[11px] font-medium', prog.color)}>{prog.label}</span>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-4 mt-3 text-[12px] text-text-tertiary">
        <span className="flex items-center gap-1">
          <Clock size={12} /> {skill.estimated_effort}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase size={12} /> {skill.expected_benefit}
        </span>
      </div>

      {/* Expandable next steps */}
      {skill.next_steps.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-ghost text-[12px] px-0 gap-1"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Hide' : 'Show'} next steps
          </button>
          {expanded && (
            <ul className="mt-2 space-y-1.5 animate-fade-in-up">
              {skill.next_steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-text-secondary">
                  <span className="section-number mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  {step}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default function LearningRoadmapPage() {
  const groups: { priority: Priority; skills: typeof demoSkills }[] = [
    { priority: 'high', skills: demoSkills.filter((s) => s.priority === 'high') },
    { priority: 'medium', skills: demoSkills.filter((s) => s.priority === 'medium') },
    { priority: 'low', skills: demoSkills.filter((s) => s.priority === 'low') },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="display-heading text-2xl lg:text-3xl mb-1">Your Learning Roadmap</h1>
        <p className="text-text-secondary text-[14px] max-w-lg">
          Skills recommended based on your resume analyses and target roles.
          Prioritized by how often they appear in your matched opportunities.
        </p>
      </div>

      {/* Priority groups */}
      {groups.map(({ priority, skills }) => {
        const cfg = priorityConfig[priority]
        return (
          <section key={priority}>
            {/* Group header */}
            <div className="flex items-center gap-2 mb-4">
              <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center', cfg.bg)}>
                <cfg.icon size={14} className={cfg.color} />
              </div>
              <h2 className="font-semibold text-[15px]">{cfg.label}</h2>
              <span className="section-label ml-1">{skills.length} skills</span>
            </div>

            {/* Cards — high priority = larger cards */}
            <div
              className={clsx(
                'grid gap-4',
                priority === 'high' ? 'lg:grid-cols-1' : 'lg:grid-cols-2'
              )}
            >
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} large={priority === 'high'} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
