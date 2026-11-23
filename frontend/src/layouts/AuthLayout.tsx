import { Outlet, Link } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — Brand panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-surface-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full border border-white/20" />
          <div className="absolute bottom-40 right-10 w-64 h-64 rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/3 w-px h-40 bg-white/10" />
        </div>
        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-text-inverse font-semibold text-lg tracking-tight">ResumeAI</span>
          </Link>

          <div className="max-w-md">
            <h1 className="display-heading text-text-inverse text-4xl xl:text-5xl mb-6">
              Understand the<br />opportunity.<br />
              <span className="text-accent-light">Prepare your<br />next move.</span>
            </h1>
            <p className="text-white/50 text-[15px] leading-relaxed">
              Analyze job descriptions, discover what your experience proves, and build resumes that present your genuine qualifications with clarity.
            </p>
          </div>

          <div className="flex items-center gap-6 text-white/30 text-[12px] font-mono">
            <span>Career Intelligence</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Resume Analysis</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Skill Matching</span>
          </div>
        </div>
      </div>

      {/* Right — Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-semibold text-[15px] tracking-tight">ResumeAI</span>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
