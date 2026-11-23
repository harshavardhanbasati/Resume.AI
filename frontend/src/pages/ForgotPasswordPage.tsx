import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Mail, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setSubmitError(null)
    await new Promise((r) => setTimeout(r, 1500))
    setSubmittedEmail(data.email)
    setSubmitted(true)
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="animate-fade-in-up text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-success-bg">
          <Mail className="h-6 w-6 text-success" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">
          Check your email
        </h2>
        <p className="text-text-secondary text-[15px] mb-8 mx-auto max-w-sm">
          We sent a password reset link to{' '}
          <span className="font-medium text-text-primary">{submittedEmail}</span>.
          It may take a minute to arrive.
        </p>
        <Link to="/login" className="btn-primary inline-flex">
          Back to sign in
        </Link>
      </div>
    )
  }

  /* ── Form state ── */
  return (
    <div className="animate-fade-in-up">
      {/* Back link */}
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">
          Reset your password
        </h2>
        <p className="text-text-secondary text-[15px]">
          Enter the email address associated with your account and we&apos;ll send
          you a link to reset your password.
        </p>
      </div>

      {/* Global error */}
      {submitError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg bg-danger-bg px-4 py-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={clsx(
              'w-full rounded-[var(--radius-md)] border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
              errors.email
                ? 'border-danger'
                : 'border-border hover:border-border-strong'
            )}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending link…
            </>
          ) : (
            'Send reset link'
          )}
        </button>
      </form>
    </div>
  )
}
