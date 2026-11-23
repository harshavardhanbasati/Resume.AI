import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include an uppercase letter')
      .regex(/[0-9]/, 'Password must include a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (_data: ResetPasswordFormData) => {
    setSubmitError(null)
    await new Promise((r) => setTimeout(r, 1500))
    setSubmitted(true)
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="animate-fade-in-up text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-success-bg">
          <CheckCircle className="h-6 w-6 text-success" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">
          Password updated
        </h2>
        <p className="text-text-secondary text-[15px] mb-8 mx-auto max-w-sm">
          Your password has been reset successfully. You can now sign in with
          your new password.
        </p>
        <Link to="/login" className="btn-primary inline-flex">
          Sign in
        </Link>
      </div>
    )
  }

  /* ── Form state ── */
  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">
          Set new password
        </h2>
        <p className="text-text-secondary text-[15px]">
          Choose a strong password to secure your account.
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
        {/* New password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              className={clsx(
                'w-full rounded-[var(--radius-md)] border bg-surface px-3.5 py-2.5 pr-10 text-sm text-text-primary placeholder:text-text-tertiary',
                'transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
                errors.password
                  ? 'border-danger'
                  : 'border-border hover:border-border-strong'
              )}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p className="mt-1.5 text-xs text-danger">
              {errors.password.message}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-text-tertiary">
              Min 8 characters, one uppercase letter, one number
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Confirm new password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              className={clsx(
                'w-full rounded-[var(--radius-md)] border bg-surface px-3.5 py-2.5 pr-10 text-sm text-text-primary placeholder:text-text-tertiary',
                'transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
                errors.confirmPassword
                  ? 'border-danger'
                  : 'border-border hover:border-border-strong'
              )}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
              tabIndex={-1}
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-danger">
              {errors.confirmPassword.message}
            </p>
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
              Updating password…
            </>
          ) : (
            'Reset password'
          )}
        </button>
      </form>
    </div>
  )
}
