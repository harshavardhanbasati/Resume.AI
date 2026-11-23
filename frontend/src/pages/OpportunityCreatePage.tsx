import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Briefcase, ArrowLeft, Loader2, Sparkles, AlertCircle, Building2 } from 'lucide-react'
import api from '@/services/api'

const oppSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  job_description: z.string().min(20, 'Job description must be at least 20 characters'),
  job_url: z.string().optional(),
  location: z.string().optional(),
  employment_type: z.string(),
})

type OppFormData = z.infer<typeof oppSchema>

export default function OpportunityCreatePage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OppFormData>({
    resolver: zodResolver(oppSchema),
    defaultValues: {
      company_name: '',
      job_title: '',
      job_description: '',
      location: 'Remote',
      employment_type: 'full-time',
    },
  })

  const loadSampleJD = () => {
    setValue('company_name', 'Stripe')
    setValue('job_title', 'Software Engineer, Core Infrastructure')
    setValue('location', 'San Francisco, CA / Remote')
    setValue(
      'job_description',
      `Stripe is building the economic infrastructure for the internet.\n\n` +
      `We are looking for experienced Software Engineers to join our Core Infrastructure team. You will build and scale the distributed systems that power trillions in annual volume.\n\n` +
      `Responsibilities:\n` +
      `- Design, build, and maintain high-throughput backend services and APIs.\n` +
      `- Improve reliability, latency, and fault-tolerance across distributed data stores.\n` +
      `- Partner with product and platform teams to establish clear technical specifications.\n\n` +
      `Requirements:\n` +
      `- Strong programming experience in modern languages (Go, Java, Python, or TypeScript).\n` +
      `- Deep understanding of relational databases (PostgreSQL or MySQL) and caching systems.\n` +
      `- Experience with distributed systems, microservices, and Docker containerization.\n` +
      `- Understanding of CI/CD pipelines and automated integration testing.`
    )
  }

  const onSubmit = async (data: OppFormData) => {
    setError(null)
    try {
      const res = await api.post('/opportunities', data)
      navigate(`/opportunities/${res.data.id}/analysis`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create and analyze opportunity.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      <Link to="/opportunities" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft size={14} /> Back to Opportunities
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="section-label">OPPORTUNITY INGESTION</span>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            Add Job Opportunity
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Provide the company name and job description to generate instant company intelligence and requirements breakdown.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSampleJD}
          className="btn-secondary text-xs shrink-0 self-start sm:self-auto flex items-center gap-1.5"
        >
          <Sparkles size={13} className="text-accent" /> Load Sample Job
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-danger-bg text-danger border border-danger/20 text-sm flex items-start gap-3">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card-base p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">Company Name *</label>
            <input
              type="text"
              placeholder="e.g. Stripe, Vercel, Linear"
              className="w-full rounded border border-border px-3.5 py-2 text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              {...register('company_name')}
            />
            {errors.company_name && <p className="text-[11px] text-danger mt-1">{errors.company_name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">Job Title *</label>
            <input
              type="text"
              placeholder="e.g. Senior Software Engineer"
              className="w-full rounded border border-border px-3.5 py-2 text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              {...register('job_title')}
            />
            {errors.job_title && <p className="text-[11px] text-danger mt-1">{errors.job_title.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">Location (Optional)</label>
            <input
              type="text"
              placeholder="e.g. San Francisco, CA / Remote"
              className="w-full rounded border border-border px-3.5 py-2 text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              {...register('location')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">Employment Type</label>
            <select
              className="w-full rounded border border-border px-3.5 py-2 text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              {...register('employment_type')}
            >
              <option value="full-time">Full-Time</option>
              <option value="contract">Contract / Freelance</option>
              <option value="part-time">Part-Time</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-primary mb-1">Job Description *</label>
          <textarea
            rows={10}
            placeholder="Paste the full job description here (responsibilities, requirements, qualifications)..."
            className="w-full rounded border border-border p-3 text-xs bg-surface leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent font-sans"
            {...register('job_description')}
          />
          {errors.job_description && <p className="text-[11px] text-danger mt-1">{errors.job_description.message}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Link to="/opportunities" className="btn-ghost text-xs">
            Cancel
          </Link>
          <button type="submit" disabled={isSubmitting} className="btn-primary text-xs px-6">
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Analyzing Opportunity…
              </>
            ) : (
              <>
                <Sparkles size={15} /> Analyze & Save Opportunity
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
