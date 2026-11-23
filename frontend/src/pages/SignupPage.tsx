import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import clsx from 'clsx'
import api from '@/services/api'

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: true },
  })

  const onSubmit = async (data: SignupFormData) => {
    setSubmitError(null)
    try {
      const res = await api.post('/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      })
      if (res.data?.access_token) {
        localStorage.setItem('resumeai_token', res.data.access_token)
        localStorage.setItem('resumeai_user', JSON.stringify(res.data.user))
        navigate('/dashboard')
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Registration failed. Please try again.'
      setSubmitError(typeof detail === 'string' ? detail : JSON.stringify(detail))
    }
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">
          Create your account
        </h2>
        <p className="text-text-secondary text-[15px]">
          Start evaluating your qualifications against real job descriptions.
        </p>
      </div>

      {/* Global error */}
      {submitError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg bg-danger-bg px-4 py-3 text-sm text-danger border border-danger/20">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1.5">
            Full name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            className={clsx(
              'w-full rounded-[var(--radius-md)] border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary',
              'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
              errors.name ? 'border-danger' : 'border-border hover:border-border-strong'
            )}
            {...register('name')}
          />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={clsx(
              'w-full rounded-[var(--radius-md)] border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary',
              'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
              errors.email ? 'border-danger' : 'border-border hover:border-border-strong'
            )}
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={clsx(
                'w-full rounded-[var(--radius-md)] border bg-surface px-3.5 py-2.5 pr-10 text-sm text-text-primary',
                'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
                errors.password ? 'border-danger' : 'border-border hover:border-border-strong'
              )}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1.5">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={clsx(
              'w-full rounded-[var(--radius-md)] border bg-surface px-3.5 py-2.5 text-sm text-text-primary',
              'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
              errors.confirmPassword ? 'border-danger' : 'border-border hover:border-border-strong'
            )}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-danger">{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="terms"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
            {...register('terms')}
          />
          <label htmlFor="terms" className="text-xs text-text-secondary leading-relaxed">
            I agree to the terms of service and acknowledge that ResumeAI will never fabricate career experience.
          </label>
        </div>
        {errors.terms && <p className="text-xs text-danger">{errors.terms.message}</p>}

        {/* Submit */}
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>

      {/* Sign-in link */}
      <p className="text-center text-sm text-text-secondary mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent hover:text-accent-hover transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
