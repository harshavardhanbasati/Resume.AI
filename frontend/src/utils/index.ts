import { clsx } from 'clsx'

// Utility to merge class names
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return clsx(inputs)
}

// Format date to relative time
export function formatRelativeTime(date: string): string {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Score to color
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-warning'
  return 'text-danger'
}

// Match classification to label & color
export function getMatchLabel(classification: string): { label: string; color: string; bg: string } {
  switch (classification) {
    case 'strong':
      return { label: 'Strong Evidence', color: 'text-success', bg: 'bg-success-bg' }
    case 'partial':
      return { label: 'Partial Evidence', color: 'text-warning', bg: 'bg-warning-bg' }
    case 'none':
      return { label: 'No Evidence Found', color: 'text-danger', bg: 'bg-danger-bg' }
    default:
      return { label: 'Unclear', color: 'text-text-tertiary', bg: 'bg-background' }
  }
}

// Truncate text
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max) + '…'
}
