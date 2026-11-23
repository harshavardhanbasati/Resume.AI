import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, AlertCircle, Sparkles } from 'lucide-react'
import clsx from 'clsx'
import api from '@/services/api'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const fillDemoAccount = () => {
    setValue('email', 'demo@resumeai.com')
    setValue('password', 'password123')
  }

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null)
    try {
      const res = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      })
      if (res.data?.access_token) {
        localStorage.setItem('resumeai_token', res.data.access_token)
        localStorage.setItem('resumeai_user', JSON.stringify(res.data.user))
        navigate('/dashboard')
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Invalid email or password. Please try again.'
      setSubmitError(typeof detail === 'string' ? detail : JSON.stringify(detail))
    }
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">
          Welcome back
        </h2>
        <p className="text-text-secondary text-[15px]">
          Sign in to your account to continue your career intelligence workspace.
        </p>
      </div>

      {/* Demo helper banner */}
      <div className="mb-6 p-3.5 bg-accent-subtle/70 border border-accent/20 rounded-lg flex items-center justify-between gap-3">
        <div className="text-xs text-text-primary">
          <span className="font-semibold text-accent">Quick Demo: </span>
          <span>demo@resumeai.com / password123</span>
        </div>
        <button
          type="button"
          onClick={fillDemoAccount}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors shrink-0"
        >
          <Sparkles size={12} /> Auto-fill
        </button>
      </div>

      {/* Global error */}
      {submitError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg bg-danger-bg px-4 py-3 text-sm text-danger border border-danger/20">
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

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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
          {errors.password && (
            <p className="mt-1.5 text-xs text-danger">
              {errors.password.message}
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
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-text-tertiary">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Sign-up link */}
      <p className="text-center text-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Create account
        </Link>
      </p>
    </div>
  )
}
