import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  PenTool, CheckCircle2, XCircle, Edit3, ArrowLeft, AlertTriangle, ShieldCheck, Check, Sparkles
} from 'lucide-react'
import api from '@/services/api'

export default function ResumeTailoringPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [changes, setChanges] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedText, setEditedText] = useState('')

  useEffect(() => {
    const fetchChanges = async () => {
      try {
        const res = await api.get(`/tailoring/${id}`)
        setChanges(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchChanges()
  }, [id])

  const handleUpdateStatus = async (changeId: string, status: string, customText?: string) => {
    try {
      const payload: any = { status }
      if (customText) payload.edited_text = customText
      const res = await api.patch(`/tailoring/${changeId}`, payload)
      setChanges(changes.map(c => c.id === changeId ? res.data : c))
      setEditingId(null)
    } catch (err) {
      alert('Failed to update change status.')
    }
  }

  const acceptedCount = changes.filter(c => c.status === 'accepted').length
  const rejectedCount = changes.filter(c => c.status === 'rejected').length
  const pendingCount = changes.filter(c => c.status === 'pending').length

  if (loading) {
    return <div className="card-base p-12 text-center skeleton">Analyzing resume improvements diff...</div>
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      <Link to="/resumes" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft size={14} /> Back to Resumes
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="section-label">EXPLAINABLE RESUME TAILORING</span>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            Resume Improvement Review
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Every suggested refinement is tied to a verified job requirement without inventing experience.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/resume-studio" className="btn-secondary text-xs">
            Open in Resume Studio
          </Link>
        </div>
      </div>

      {/* Summary audit bar */}
      <div className="card-base p-4 flex flex-wrap items-center justify-between gap-4 bg-surface text-xs">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-text-tertiary block font-mono">TOTAL PROPOSED</span>
            <span className="font-bold text-sm text-text-primary">{changes.length}</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div>
            <span className="text-text-tertiary block font-mono">ACCEPTED</span>
            <span className="font-bold text-sm text-success">{acceptedCount}</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div>
            <span className="text-text-tertiary block font-mono">REJECTED</span>
            <span className="font-bold text-sm text-danger">{rejectedCount}</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div>
            <span className="text-text-tertiary block font-mono">PENDING REVIEW</span>
            <span className="font-bold text-sm text-warning">{pendingCount}</span>
          </div>
        </div>

        <div className="text-text-tertiary text-[11px] flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-success" /> Fully candidate-controlled changes
        </div>
      </div>

      {/* Changes list */}
      <div className="space-y-6">
        {changes.map((item, idx) => {
          const isPending = item.status === 'pending'
          const isAccepted = item.status === 'accepted'
          const isRejected = item.status === 'rejected'
          const isEdited = item.status === 'edited'
          const isEditing = editingId === item.id

          return (
            <div key={item.id} className="card-base p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-accent uppercase">
                    0{idx + 1} — {item.section}
                  </span>
                  {item.needs_verification && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-warning-bg text-warning font-semibold">
                      <AlertTriangle size={11} /> Requires Metric Verification
                    </span>
                  )}
                </div>
                <span
                  className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold ${
                    isAccepted ? 'bg-success-bg text-success' :
                    isRejected ? 'bg-danger-bg text-danger' :
                    isEdited ? 'bg-accent-subtle text-accent' :
                    'bg-warning-bg text-warning'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Diff Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Original */}
                <div className="p-3.5 rounded-lg border border-border bg-danger-bg/20 space-y-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold text-danger block">
                    Original Resume Text
                  </span>
                  <p className="text-text-secondary leading-relaxed font-sans">{item.original_text}</p>
                </div>

                {/* Proposed */}
                <div className="p-3.5 rounded-lg border border-border bg-success-bg/20 space-y-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold text-success block">
                    Proposed Revision
                  </span>
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={editedText}
                        onChange={e => setEditedText(e.target.value)}
                        className="w-full p-2 border border-border rounded text-xs bg-surface"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'edited', editedText)}
                          className="btn-primary text-[11px] py-1 px-3"
                        >
                          Save Edit
                        </button>
                        <button onClick={() => setEditingId(null)} className="btn-ghost text-[11px] py-1 px-2">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-text-primary leading-relaxed font-sans font-medium">
                      {item.edited_text || item.proposed_text}
                    </p>
                  )}
                </div>
              </div>

              {/* Explanations & Evidence */}
              <div className="bg-background/80 rounded-lg p-3.5 text-xs space-y-1.5 border border-border">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-text-primary shrink-0">Rationale:</span>
                  <span className="text-text-secondary">{item.reason}</span>
                </div>
                {item.related_requirement && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-text-primary shrink-0">Target JD Requirement:</span>
                    <span className="text-accent font-medium">{item.related_requirement}</span>
                  </div>
                )}
                {item.supporting_evidence && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-text-primary shrink-0">Verified Candidate Evidence:</span>
                    <span className="text-text-secondary">{item.supporting_evidence}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => {
                    setEditingId(item.id)
                    setEditedText(item.edited_text || item.proposed_text)
                  }}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <Edit3 size={13} /> Edit Revision
                </button>
                <button
                  onClick={() => handleUpdateStatus(item.id, 'rejected')}
                  className="px-3 py-1.5 rounded border border-danger/30 text-danger hover:bg-danger-bg text-xs font-medium flex items-center gap-1"
                >
                  <XCircle size={13} /> Reject
                </button>
                <button
                  onClick={() => handleUpdateStatus(item.id, 'accepted')}
                  className="px-4 py-1.5 rounded bg-success text-white hover:bg-success/90 text-xs font-medium flex items-center gap-1"
                >
                  <CheckCircle2 size={13} /> Accept Revision
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
