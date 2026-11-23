import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Upload, Plus, Trash2, CheckCircle2, AlertCircle, Clock, ExternalLink } from 'lucide-react'
import api from '@/services/api'
import { formatFileSize, formatRelativeTime } from '@/utils'

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes')
      setResumes(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return
    try {
      await api.delete(`/resumes/${id}`)
      setResumes(resumes.filter(r => r.id !== id))
    } catch (err) {
      alert('Failed to delete resume')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="section-label">DOCUMENT REPOSITORY</span>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            My Resumes
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Manage your verified resume documents and extracted candidate profiles.
          </p>
        </div>
        <Link to="/resumes/upload" className="btn-primary shrink-0">
          <Upload size={16} /> Upload New Resume
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-base p-6 h-48 skeleton" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="card-base p-12 text-center max-w-lg mx-auto my-12">
          <div className="w-14 h-14 rounded-full bg-accent-subtle flex items-center justify-center mx-auto mb-4 text-accent">
            <FileText size={24} />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No resumes uploaded yet</h3>
          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            Upload your existing PDF or DOCX resume to extract your verified career profile and compare it with target roles.
          </p>
          <Link to="/resumes/upload" className="btn-primary inline-flex">
            <Upload size={16} /> Upload Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map(resume => {
            const skillCount = resume.profile?.skills?.length || 0
            const expCount = resume.profile?.experience?.length || 0
            return (
              <div key={resume.id} className="card-interactive p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-subtle/80 flex items-center justify-center text-accent shrink-0">
                      <FileText size={20} />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-success-bg text-success uppercase">
                      <CheckCircle2 size={12} /> {resume.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-text-primary text-[15px] truncate mb-1" title={resume.filename}>
                    {resume.filename}
                  </h3>
                  <div className="text-xs text-text-tertiary flex items-center gap-2 mb-4">
                    <span>{resume.file_type.toUpperCase()}</span>
                    <span>•</span>
                    <span>{formatFileSize(resume.file_size)}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(resume.created_at)}</span>
                  </div>

                  <div className="bg-background/80 rounded-md p-3 text-xs space-y-1.5 mb-4">
                    <div className="flex justify-between text-text-secondary">
                      <span>Candidate:</span>
                      <span className="font-medium text-text-primary">{resume.profile?.name || 'Verified Profile'}</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Verified Skills:</span>
                      <span className="font-medium text-text-primary">{skillCount} skills</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Work Roles:</span>
                      <span className="font-medium text-text-primary">{expCount} positions</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border gap-2">
                  <Link
                    to={`/resumes/${resume.id}/verify`}
                    className="btn-secondary text-xs py-1.5 px-3 flex-1 text-center"
                  >
                    View & Verify
                  </Link>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="p-2 text-text-tertiary hover:text-danger hover:bg-danger-bg rounded-md transition-colors"
                    title="Delete resume"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
