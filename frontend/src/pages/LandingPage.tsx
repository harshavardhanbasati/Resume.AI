import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import clsx from 'clsx'
import {
  Menu,
  X,
  ArrowRight,
  Upload,
  Search,
  BarChart3,
  MessageSquare,
  FileText,
  Target,
  Sparkles,
  Shield,
  Zap,
  Users,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Lock,
  Clock,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ------------------------------------------------------------------ */
/*  Shared tiny components                                             */
/* ------------------------------------------------------------------ */

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={clsx('section-label', dark && 'text-[var(--color-accent-light)]')}>
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  SVG mini-app preview for the hero                                  */
/* ------------------------------------------------------------------ */

function HeroAppPreview() {
  const score = 78
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDash = (score / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[420px]"
    >
      {/* Main card */}
      <div className="card-base p-6 shadow-lg">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]" />
            <span className="text-xs font-semibold tracking-wide text-[var(--color-text-primary)]">
              Resume Analysis
            </span>
          </div>
          <span className="section-label text-[10px]">Live Preview</span>
        </div>

        {/* Score ring */}
        <div className="flex items-center gap-6 mb-5">
          <svg width="130" height="130" viewBox="0 0 130 130" className="shrink-0">
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="10"
            />
            <motion.circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              animate={{ strokeDashoffset: circumference - strokeDash }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              transform="rotate(-90 65 65)"
            />
            <text
              x="65"
              y="60"
              textAnchor="middle"
              className="fill-[var(--color-text-primary)]"
              style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-body)' }}
            >
              {score}
            </text>
            <text
              x="65"
              y="78"
              textAnchor="middle"
              className="fill-[var(--color-text-secondary)]"
              style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
            >
              / 100
            </text>
          </svg>

          <div className="space-y-2.5 flex-1">
            {[
              { label: 'Technical', value: 85, color: 'var(--color-accent)' },
              { label: 'Experience', value: 72, color: 'var(--color-success)' },
              { label: 'Keywords', value: 68, color: 'var(--color-warning)' },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-[11px] text-[var(--color-text-secondary)]">{bar.label}</span>
                  <span className="text-[11px] font-semibold text-[var(--color-text-primary)]">
                    {bar.value}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--color-border)]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: bar.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${bar.value}%` }}
                    transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill matches */}
        <div className="mb-4">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)] mb-2 block">
            Skill Matches
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['React', 'TypeScript', 'Node.js', 'AWS', 'CI/CD'].map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-accent-subtle)] text-[var(--color-accent)]"
              >
                <CheckCircle2 size={10} />
                {skill}
              </span>
            ))}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-warning-bg)] text-[var(--color-warning)]">
              Kubernetes
            </span>
          </div>
        </div>

        {/* Recommendation card */}
        <div className="rounded-lg border border-[var(--color-border)] p-3 bg-[var(--color-background)]">
          <div className="flex items-start gap-2">
            <Sparkles size={14} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
            <div>
              <span className="text-[12px] font-semibold text-[var(--color-text-primary)] block mb-0.5">
                AI Recommendation
              </span>
              <span className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Add your Kubernetes project to demonstrate container orchestration experience.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating accent dot */}
      <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[var(--color-accent)] opacity-20 blur-sm" />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 1 — Navbar                                                 */
/* ------------------------------------------------------------------ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['Features', 'How it Works', 'About']

  return (
    <nav
      className={clsx(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[var(--color-surface)]/95 backdrop-blur-md shadow-sm border-b border-[var(--color-border)]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <BrainCircuit size={18} className="text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
            ResumeAI
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Log in</Link>
          <Link to="/signup" className="btn-primary text-sm">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[var(--color-text-primary)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 pb-5 pt-2 space-y-3"
        >
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/login" className="btn-secondary text-sm w-full text-center">Log in</Link>
            <Link to="/signup" className="btn-primary text-sm w-full text-center">
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 2 — Hero                                                   */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">
          {/* Left — editorial copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-xl"
          >
            <motion.div variants={fadeUp} custom={0}>
              <SectionLabel>Career Intelligence Platform</SectionLabel>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="display-heading text-5xl md:text-6xl lg:text-[68px] mt-5 mb-6 text-[var(--color-text-primary)]"
            >
              Your experience.{' '}
              <span className="italic text-[var(--color-accent)]">Understood.</span>
              <br />
              Your next move.{' '}
              <span className="italic text-[var(--color-accent)]">Prepared.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8 max-w-md"
            >
              ResumeAI reads between the lines of your career and the opportunities ahead —
              delivering analysis, coaching, and preparation that actually moves the needle.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3">
              <Link to="/signup" className="btn-primary text-[15px] px-6 py-3">
                Start Free Analysis <ArrowRight size={16} />
              </Link>
              <a href="#how-it-works" className="btn-secondary text-[15px] px-6 py-3">
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          {/* Right — mini app preview */}
          <div className="hidden lg:block">
            <HeroAppPreview />
          </div>
        </div>
      </div>

      {/* Subtle gradient orb */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[var(--color-accent)] opacity-[0.04] blur-3xl pointer-events-none" />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 3 — Philosophy (dark)                                      */
/* ------------------------------------------------------------------ */

function PhilosophySection() {
  return (
    <section className="bg-[var(--color-surface-dark)] py-24 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="max-w-4xl mx-auto px-6 text-center"
      >
        <motion.div variants={fadeUp} custom={0}>
          <SectionLabel dark>Our Philosophy</SectionLabel>
        </motion.div>

        <motion.blockquote
          variants={fadeUp}
          custom={1}
          className="display-heading text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-inverse)] mt-6 mb-8"
        >
          "Careers aren&apos;t built on keywords —{' '}
          <span className="italic text-[var(--color-accent-light)]">
            they&apos;re built on understanding.
          </span>{' '}
          We believe every professional deserves an intelligent partner that sees the full picture."
        </motion.blockquote>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="text-[var(--color-text-tertiary)] text-base max-w-lg mx-auto"
        >
          ResumeAI goes beyond surface-level matching to uncover the story your experience tells —
          and helps you tell it better.
        </motion.p>
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 4 — How it Works                                           */
/* ------------------------------------------------------------------ */

const steps = [
  {
    num: '01',
    title: 'Upload Your Resume',
    description:
      'Drop in your PDF or DOCX. Our parser extracts every detail — skills, experience, projects, certifications — with precision.',
    icon: Upload,
  },
  {
    num: '02',
    title: 'Paste the Opportunity',
    description:
      'Add a job description or URL. We research the company, decode requirements, and identify what actually matters.',
    icon: Search,
  },
  {
    num: '03',
    title: 'Get Deep Analysis',
    description:
      'Receive a multi-dimensional score, skill-by-skill match breakdown, and clear evidence for each assessment.',
    icon: BarChart3,
  },
  {
    num: '04',
    title: 'Prepare & Improve',
    description:
      'Get AI-powered resume rewrites, interview prep, and a personalized coaching plan to close every gap.',
    icon: MessageSquare,
  },
]

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="mb-16"
        >
          <motion.div variants={fadeUp} custom={0}>
            <SectionLabel>How It Works</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="display-heading text-4xl md:text-5xl mt-4 text-[var(--color-text-primary)]"
          >
            Four steps to career clarity
          </motion.h2>
        </motion.div>

        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isEven = i % 2 === 1
            return (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                custom={0}
                className={clsx(
                  'grid lg:grid-cols-2 gap-10 lg:gap-20 items-center',
                  isEven && 'lg:[direction:rtl]'
                )}
              >
                {/* Text side */}
                <div className={clsx(isEven && 'lg:[direction:ltr]')}>
                  <span className="section-number">{step.num}</span>
                  <h3 className="text-2xl md:text-3xl font-semibold mt-2 mb-4 text-[var(--color-text-primary)]">
                    {step.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed text-base max-w-md">
                    {step.description}
                  </p>
                </div>

                {/* Visual side */}
                <div className={clsx('lg:[direction:ltr]')}>
                  <div className="card-base p-10 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-[var(--color-accent-subtle)] flex items-center justify-center">
                      <Icon size={36} className="text-[var(--color-accent)]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 5 — Feature Showcase                                       */
/* ------------------------------------------------------------------ */

const features = [
  {
    title: 'Intelligent Resume Parsing',
    description:
      'Our AI reads your resume the way a senior recruiter would — understanding context, impact, and nuance, not just keywords.',
    icon: FileText,
  },
  {
    title: 'Multi-Dimensional Scoring',
    description:
      'Get scored across technical skills, experience depth, project relevance, keyword alignment, and qualifications — not a single opaque number.',
    icon: BarChart3,
  },
  {
    title: 'Company Deep Research',
    description:
      'Automatic company research surfaces culture, tech stack, products, and business model so you walk into interviews informed.',
    icon: Search,
  },
  {
    title: 'Skill Gap Analysis',
    description:
      'See exactly which requirements you meet, which you partially meet, and where you have gaps — with evidence from your own resume.',
    icon: Target,
  },
  {
    title: 'AI Career Coach',
    description:
      'An always-available coaching conversation that knows your profile, your targets, and delivers actionable next steps.',
    icon: Sparkles,
  },
  {
    title: 'Smart Resume Rewrites',
    description:
      'Get line-by-line suggestions to tailor your resume to each opportunity, with before/after previews and one-click accept.',
    icon: TrendingUp,
  },
]

function FeatureShowcaseSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} custom={0}>
            <SectionLabel>Features</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="display-heading text-4xl md:text-5xl mt-4 mb-4 text-[var(--color-text-primary)]"
          >
            Everything you need to land the role
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-[var(--color-text-secondary)] text-base max-w-lg mx-auto"
          >
            From parsing to preparation, ResumeAI covers every step of the modern job search.
          </motion.p>
        </motion.div>

        <div className="space-y-12 lg:space-y-20">
          {features.map((feature, i) => {
            const Icon = feature.icon
            const isEven = i % 2 === 1
            return (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                custom={0}
                className={clsx(
                  'grid lg:grid-cols-2 gap-10 lg:gap-16 items-center',
                  isEven && 'lg:[direction:rtl]'
                )}
              >
                <div className={clsx(isEven && 'lg:[direction:ltr]')}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center">
                      <Icon size={20} className="text-[var(--color-accent)]" />
                    </div>
                    <span className="section-number">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-[var(--color-text-primary)]">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-md">
                    {feature.description}
                  </p>
                </div>

                <div className={clsx('lg:[direction:ltr]')}>
                  <div className="card-base p-8 lg:p-12 flex items-center justify-center min-h-[200px]">
                    <Icon size={48} className="text-[var(--color-accent)] opacity-30" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 6 — Trust                                                  */
/* ------------------------------------------------------------------ */

const trustPoints = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data is encrypted end-to-end. We never sell or share your information.',
  },
  {
    icon: Lock,
    title: 'Transparent AI',
    description: 'Every AI assessment comes with evidence and reasoning you can verify.',
  },
  {
    icon: Zap,
    title: 'Real-Time Analysis',
    description: 'Get results in seconds, not hours. Our infrastructure is built for speed.',
  },
  {
    icon: Users,
    title: 'Built for Professionals',
    description: 'Designed with hiring managers, recruiters, and career coaches in mind.',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: 'Your AI career coach is ready whenever you are — no appointments needed.',
  },
]

function TrustSection() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.div variants={fadeUp} custom={0}>
            <SectionLabel>Why Trust Us</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="display-heading text-4xl md:text-5xl mt-4 text-[var(--color-text-primary)]"
          >
            Built on principles that matter
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {trustPoints.map((point, i) => {
            const Icon = point.icon
            return (
              <motion.div
                key={point.title}
                variants={fadeUp}
                custom={i}
                className="card-base p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center">
                  <Icon size={22} className="text-[var(--color-accent)]" />
                </div>
                <h4 className="text-sm font-semibold mb-1.5 text-[var(--color-text-primary)]">
                  {point.title}
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 7 — Final CTA (dark)                                       */
/* ------------------------------------------------------------------ */

function FinalCTASection() {
  return (
    <section className="bg-[var(--color-surface-dark)] py-24 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="max-w-3xl mx-auto px-6 text-center"
      >
        <motion.div variants={fadeUp} custom={0}>
          <SectionLabel dark>Ready?</SectionLabel>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          custom={1}
          className="display-heading text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-inverse)] mt-6 mb-6"
        >
          Your next career move{' '}
          <span className="italic text-[var(--color-accent-light)]">starts here</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="text-[var(--color-text-tertiary)] text-base mb-10 max-w-md mx-auto"
        >
          Upload your resume. Paste a job description. Get the intelligence you need in under a
          minute.
        </motion.p>

        <motion.div variants={fadeUp} custom={3} className="flex flex-wrap justify-center gap-4">
          <Link to="/signup" className="btn-primary text-[15px] px-8 py-3.5">
            Get Started — It&apos;s Free <ArrowRight size={16} />
          </Link>
          <a href="#how-it-works" className="btn-secondary text-[15px] px-8 py-3.5 border-white/15 bg-transparent text-[var(--color-text-inverse)] hover:border-white/30">
            Learn More
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 8 — Footer                                                 */
/* ------------------------------------------------------------------ */

const footerColumns = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Blog', 'Career Tips', 'API'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Contact', 'Press'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security', 'Cookies'],
  },
]

function Footer() {
  const [currentYear] = useState(() => new Date().getFullYear())

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                <BrainCircuit size={15} className="text-white" />
              </div>
              <span className="text-base font-semibold text-[var(--color-text-primary)]">
                ResumeAI
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs mb-4">
              The career intelligence platform that understands your experience and prepares your
              next move.
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              © {currentYear} ResumeAI. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-3">
                {col.title}
              </h5>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/*  Landing Page — composed                                            */
/* ------------------------------------------------------------------ */

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <HowItWorksSection />
      <FeatureShowcaseSection />
      <TrustSection />
      <FinalCTASection />
      <Footer />
    </div>
  )
}

export default LandingPage
