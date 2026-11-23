import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  LayoutDashboard, FileText, Briefcase, MessageSquare, PenTool,
  History, Map, Settings, User, ChevronLeft, ChevronRight,
  Search, Bell, LogOut, Menu, X
} from 'lucide-react'

// Sidebar context
const SidebarContext = createContext({ collapsed: false, toggle: () => {} })
export const useSidebar = () => useContext(SidebarContext)

const navSections = [
  {
    label: 'Workspace',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { to: '/resumes', icon: FileText, label: 'My Resumes' },
      { to: '/opportunities', icon: Briefcase, label: 'Job Opportunities' },
      { to: '/career-coach', icon: MessageSquare, label: 'Career Coach' },
      { to: '/resume-studio', icon: PenTool, label: 'Resume Studio' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/history', icon: History, label: 'Analysis History' },
      { to: '/roadmap', icon: Map, label: 'Learning Roadmap' },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen bg-surface border-r border-border z-40 flex flex-col transition-all duration-300 ease-[var(--ease-out-expo)]',
        collapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]'
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        {!collapsed && (
          <span className="font-semibold text-[15px] tracking-tight animate-fade-in">
            ResumeAI
          </span>
        )}
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-4 px-2" aria-label="Main navigation">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <span className="section-label px-3 mb-1.5 block">{section.label}</span>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors duration-150 group relative',
                        isActive
                          ? 'bg-accent-subtle text-accent'
                          : 'text-text-secondary hover:text-text-primary hover:bg-black/[0.03]'
                      )
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-accent rounded-r-full" />
                        )}
                        <item.icon size={18} strokeWidth={1.8} className="shrink-0" />
                        {!collapsed && (
                          <span className="animate-fade-in truncate">{item.label}</span>
                        )}
                        {collapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-surface-dark text-text-inverse text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                            {item.label}
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2 shrink-0">
        <button
          onClick={onToggle}
          className="btn-ghost w-full justify-center"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>

      {/* User */}
      <div className="border-t border-border px-3 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center shrink-0">
            <User size={14} className="text-accent" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in min-w-0 flex-1">
              <p className="text-[13px] font-medium truncate">Demo User</p>
              <p className="text-[11px] text-text-tertiary truncate">demo@resumeai.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-surface border-r border-border z-50 flex flex-col animate-slide-in-right lg:hidden">
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight">ResumeAI</span>
          </div>
          <button onClick={onClose} className="btn-ghost p-1" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navSections.map((section) => (
            <div key={section.label} className="mb-4">
              <span className="section-label px-3 mb-1.5 block">{section.label}</span>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors',
                          isActive ? 'bg-accent-subtle text-accent' : 'text-text-secondary hover:text-text-primary'
                        )
                      }
                    >
                      <item.icon size={18} strokeWidth={1.8} />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}

function TopBar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Overview'
    if (path.startsWith('/resumes')) return 'My Resumes'
    if (path.startsWith('/opportunities')) return 'Job Opportunities'
    if (path === '/career-coach') return 'Career Coach'
    if (path.startsWith('/resume-studio')) return 'Resume Studio'
    if (path === '/history') return 'Analysis History'
    if (path === '/roadmap') return 'Learning Roadmap'
    if (path === '/settings') return 'Settings'
    return 'ResumeAI'
  }

  return (
    <>
      <header className="h-[var(--topbar-height)] bg-surface/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="btn-ghost p-1.5 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-text-tertiary hidden sm:inline">ResumeAI</span>
            <span className="text-text-tertiary hidden sm:inline">/</span>
            <span className="font-medium">{getPageTitle()}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="btn-ghost p-2" aria-label="Search">
            <Search size={16} />
          </button>
          <button className="btn-ghost p-2 relative" aria-label="Notifications">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button className="flex items-center gap-2 btn-ghost px-2">
            <div className="w-7 h-7 rounded-full bg-accent-subtle flex items-center justify-center">
              <User size={13} className="text-accent" />
            </div>
          </button>
        </div>
      </header>
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed(!collapsed) }}>
      <div className="min-h-screen bg-background">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        </div>

        {/* Main content area */}
        <div
          className={clsx(
            'transition-all duration-300 ease-[var(--ease-out-expo)]',
            collapsed ? 'lg:ml-[var(--sidebar-collapsed-width)]' : 'lg:ml-[var(--sidebar-width)]'
          )}
        >
          <TopBar />
          <main className="p-4 lg:p-6 xl:p-8 max-w-[1400px]">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
