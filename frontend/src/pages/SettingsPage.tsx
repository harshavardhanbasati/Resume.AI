import { useState } from 'react'
import { clsx } from 'clsx'
import {
  User, Lock, Shield, Database,
  Edit3, Download, Trash2, AlertTriangle
} from 'lucide-react'

type TabKey = 'profile' | 'account' | 'privacy' | 'data'

const tabs: { key: TabKey; label: string; icon: typeof User }[] = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'account', label: 'Account', icon: Lock },
  { key: 'privacy', label: 'Privacy', icon: Shield },
  { key: 'data', label: 'Data', icon: Database },
]

/* ───── Reusable field row ───── */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 border-b border-border last:border-b-0">
      <span className="section-label">{label}</span>
      <p className="text-[14px] mt-0.5">{value}</p>
    </div>
  )
}

/* ───── Toggle switch ───── */
function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-b-0 cursor-pointer">
      <div>
        <p className="text-[14px] font-medium">{label}</p>
        {description && <p className="text-[12px] text-text-secondary mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative shrink-0 w-10 h-[22px] rounded-full transition-colors',
          checked ? 'bg-accent' : 'bg-border-strong'
        )}
      >
        <span
          className={clsx(
            'absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full shadow-xs transition-transform',
            checked && 'translate-x-[18px]'
          )}
        />
      </button>
    </label>
  )
}

/* ───── Tab content ───── */
function ProfileTab() {
  const [editing, setEditing] = useState(false)
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[15px]">Personal Information</h3>
        <button onClick={() => setEditing(!editing)} className="btn-ghost text-[13px] gap-1.5">
          <Edit3 size={13} /> {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="section-label block mb-1">Name</label>
            <input
              type="text"
              defaultValue="Harsha Vardhan Basati"
              className="w-full card-base px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/30 rounded-lg"
            />
          </div>
          <div>
            <label className="section-label block mb-1">Email</label>
            <input
              type="email"
              defaultValue="harsha@example.com"
              className="w-full card-base px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/30 rounded-lg"
            />
          </div>
          <div>
            <label className="section-label block mb-1">Location</label>
            <input
              type="text"
              defaultValue="Hyderabad, India"
              className="w-full card-base px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/30 rounded-lg"
            />
          </div>
          <div>
            <label className="section-label block mb-1">Bio</label>
            <textarea
              rows={3}
              defaultValue="Full-stack engineer passionate about building beautiful, performant applications."
              className="w-full card-base px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/30 rounded-lg resize-none"
            />
          </div>
          <button className="btn-primary text-[13px]" onClick={() => setEditing(false)}>
            Save changes
          </button>
        </div>
      ) : (
        <div>
          <Field label="Name" value="Harsha Vardhan Basati" />
          <Field label="Email" value="harsha@example.com" />
          <Field label="Location" value="Hyderabad, India" />
          <Field label="Bio" value="Full-stack engineer passionate about building beautiful, performant applications." />
        </div>
      )}
    </div>
  )
}

function AccountTab() {
  const [emailNotif, setEmailNotif] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [analysisAlerts, setAnalysisAlerts] = useState(false)

  return (
    <div className="space-y-8">
      {/* Change password */}
      <div>
        <h3 className="font-semibold text-[15px] mb-4">Change Password</h3>
        <div className="space-y-3 max-w-sm">
          <div>
            <label className="section-label block mb-1">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full card-base px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/30 rounded-lg"
            />
          </div>
          <div>
            <label className="section-label block mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full card-base px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/30 rounded-lg"
            />
          </div>
          <div>
            <label className="section-label block mb-1">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full card-base px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/30 rounded-lg"
            />
          </div>
          <button className="btn-secondary text-[13px]">Update password</button>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h3 className="font-semibold text-[15px] mb-2">Notification Preferences</h3>
        <Toggle label="Email notifications" description="Receive emails about analysis results" checked={emailNotif} onChange={setEmailNotif} />
        <Toggle label="Weekly digest" description="Summary of career insights every Monday" checked={weeklyDigest} onChange={setWeeklyDigest} />
        <Toggle label="Instant analysis alerts" description="Get notified as soon as an analysis completes" checked={analysisAlerts} onChange={setAnalysisAlerts} />
      </div>
    </div>
  )
}

function PrivacyTab() {
  const [shareStats, setShareStats] = useState(false)
  const [publicResume, setPublicResume] = useState(false)
  const [analytics, setAnalytics] = useState(true)

  return (
    <div>
      <h3 className="font-semibold text-[15px] mb-2">Privacy Settings</h3>
      <Toggle label="Share usage statistics" description="Help improve ResumeAI by sharing anonymous usage data" checked={shareStats} onChange={setShareStats} />
      <Toggle label="Public resume profile" description="Allow recruiters to discover your resume profile" checked={publicResume} onChange={setPublicResume} />
      <Toggle label="Analytics cookies" description="Enable analytics for a better experience" checked={analytics} onChange={setAnalytics} />
    </div>
  )
}

function DataTab() {
  const [confirmDelete, setConfirmDelete] = useState('')

  return (
    <div className="space-y-8">
      {/* Export */}
      <div>
        <h3 className="font-semibold text-[15px] mb-2">Export Your Data</h3>
        <p className="text-text-secondary text-[13px] mb-3">
          Download a copy of all your resumes, analyses, and career recommendations.
        </p>
        <button className="btn-secondary text-[13px] gap-1.5">
          <Download size={14} /> Export all data
        </button>
      </div>

      {/* Delete documents */}
      <div className="card-base border-danger/30 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 size={16} className="text-danger" />
          <h3 className="font-semibold text-[15px] text-danger">Delete All Documents</h3>
        </div>
        <p className="text-text-secondary text-[13px] mb-3">
          Permanently remove all uploaded resumes, opportunities, and analysis results. This action cannot be undone.
        </p>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-danger text-white text-[13px] font-medium hover:bg-danger/90 transition-colors cursor-pointer">
          <Trash2 size={13} /> Delete all documents
        </button>
      </div>

      {/* Delete account */}
      <div className="card-base border-danger/30 p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={16} className="text-danger" />
          <h3 className="font-semibold text-[15px] text-danger">Delete Account</h3>
        </div>
        <p className="text-text-secondary text-[13px] mb-3">
          Once you delete your account, there is no going back. All data will be permanently destroyed.
        </p>
        <div className="max-w-sm mb-3">
          <label className="section-label block mb-1">Type "DELETE" to confirm</label>
          <input
            type="text"
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            placeholder="DELETE"
            className="w-full card-base px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-danger/30 rounded-lg"
          />
        </div>
        <button
          disabled={confirmDelete !== 'DELETE'}
          className={clsx(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer',
            confirmDelete === 'DELETE'
              ? 'bg-danger text-white hover:bg-danger/90'
              : 'bg-danger/20 text-danger/50 cursor-not-allowed'
          )}
        >
          <AlertTriangle size={13} /> Delete my account
        </button>
      </div>
    </div>
  )
}

/* ───── Main Settings Page ───── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile')

  const tabContent: Record<TabKey, React.ReactNode> = {
    profile: <ProfileTab />,
    account: <AccountTab />,
    privacy: <PrivacyTab />,
    data: <DataTab />,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="display-heading text-2xl lg:text-3xl mb-1">Settings</h1>
        <p className="text-text-secondary text-[14px]">
          Manage your profile, account, privacy, and data.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab nav */}
        <nav className="flex lg:flex-col gap-1 lg:w-48 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors text-left',
                activeTab === tab.key
                  ? 'bg-accent-subtle text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-black/[0.03]'
              )}
            >
              <tab.icon size={16} strokeWidth={1.8} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div className="card-base p-5 sm:p-6 flex-1 min-w-0 animate-fade-in" key={activeTab}>
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  )
}
