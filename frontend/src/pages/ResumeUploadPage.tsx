import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import api from '@/services/api'
import { formatFileSize } from '@/utils'

export default function ResumeUploadPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0]
      if (selected.size > 10 * 1024 * 1024) {
        setError('File size exceeds the 10MB limit.')
        return
      }
      setFile(selected)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError(null)
    setUploadProgress(20)

    try {
      const formData = new FormData()
      formData.append('file', file)

      setUploadProgress(55)
      const res = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setUploadProgress(100)

      setTimeout(() => {
        navigate(`/resumes/${res.data.id}/verify`)
      }, 500)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload and parse resume. Please try again.')
      setUploading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb back */}
      <Link to="/resumes" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft size={14} /> Back to My Resumes
      </Link>

      <div>
        <span className="section-label">INGESTION & STRUCTURED EXTRACTION</span>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          Upload Your Resume
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          ResumeAI extracts your verified work experience, achievements, and technical skills without altering your original document.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-danger-bg text-danger border border-danger/20 text-sm flex items-start gap-3">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`card-base p-10 border-2 border-dashed text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-accent bg-accent-subtle/40'
            : file
            ? 'border-success/40 bg-success-bg/20'
            : 'border-border hover:border-border-strong hover:bg-black/[0.01]'
        }`}
      >
        <input {...getInputProps()} />

        <div className="w-14 h-14 rounded-full bg-accent-subtle flex items-center justify-center mx-auto mb-4 text-accent">
          {file ? <CheckCircle2 size={28} className="text-success" /> : <Upload size={28} />}
        </div>

        {file ? (
          <div>
            <p className="font-semibold text-text-primary text-base">{file.name}</p>
            <p className="text-xs text-text-secondary mt-1">{formatFileSize(file.size)} • Click or drag to replace</p>
          </div>
        ) : (
          <div>
            <p className="text-base font-medium text-text-primary mb-1">
              {isDragActive ? 'Drop your resume file here' : 'Drag and drop your resume file here'}
            </p>
            <p className="text-xs text-text-secondary mb-4">
              Supports PDF or DOCX up to 10MB
            </p>
            <span className="btn-secondary text-xs inline-flex py-1.5 px-4">
              Browse Files
            </span>
          </div>
        )}
      </div>

      {/* Progress & Submit */}
      {file && (
        <div className="card-base p-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-text-primary">Extraction Pipeline</span>
            <span className="text-xs text-text-secondary">{uploading ? `${uploadProgress}%` : 'Ready to parse'}</span>
          </div>

          {uploading && (
            <div className="w-full bg-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-accent h-2 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setFile(null)}
              disabled={uploading}
              className="btn-ghost text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn-primary text-sm px-6"
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Extracting Profile…
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Parse & Verify Resume
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Notice */}
      <div className="text-xs text-text-tertiary border-t border-border pt-4 leading-relaxed">
        <strong>Privacy Commitment:</strong> Your documents are encrypted and evaluated in your private workspace. ResumeAI never fabricates qualifications, sells candidate data, or generates unsubstantiated claims.
      </div>
    </div>
  )
}
