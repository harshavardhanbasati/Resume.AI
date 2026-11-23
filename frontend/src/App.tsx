import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/Toaster'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'

// Pages
import { LandingPage } from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import DashboardPage from '@/pages/DashboardPage'
import ResumesPage from '@/pages/ResumesPage'
import ResumeUploadPage from '@/pages/ResumeUploadPage'
import ResumeVerifyPage from '@/pages/ResumeVerifyPage'
import OpportunitiesPage from '@/pages/OpportunitiesPage'
import OpportunityCreatePage from '@/pages/OpportunityCreatePage'
import CompanyIntelligencePage from '@/pages/CompanyIntelligencePage'
import JobAnalysisPage from '@/pages/JobAnalysisPage'
import MatchAnalysisPage from '@/pages/MatchAnalysisPage'
import CareerCoachPage from '@/pages/CareerCoachPage'
import ResumeStudioPage from '@/pages/ResumeStudioPage'
import ResumeTailoringPage from '@/pages/ResumeTailoringPage'
import AnalysisHistoryPage from '@/pages/AnalysisHistoryPage'
import LearningRoadmapPage from '@/pages/LearningRoadmapPage'
import SettingsPage from '@/pages/SettingsPage'

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Authenticated Workspace Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Resume Management */}
          <Route path="/resumes" element={<ResumesPage />} />
          <Route path="/resumes/upload" element={<ResumeUploadPage />} />
          <Route path="/resumes/:id/verify" element={<ResumeVerifyPage />} />
          
          {/* Job Opportunities & Intelligence */}
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/opportunities/new" element={<OpportunityCreatePage />} />
          <Route path="/opportunities/:id/company" element={<CompanyIntelligencePage />} />
          <Route path="/opportunities/:id/analysis" element={<JobAnalysisPage />} />
          <Route path="/opportunities/:id/match" element={<MatchAnalysisPage />} />
          
          {/* Career Coach & Studio */}
          <Route path="/career-coach" element={<CareerCoachPage />} />
          <Route path="/resume-studio" element={<ResumeStudioPage />} />
          <Route path="/resume-studio/:id/tailor" element={<ResumeTailoringPage />} />
          
          {/* Insights & Preferences */}
          <Route path="/history" element={<AnalysisHistoryPage />} />
          <Route path="/roadmap" element={<LearningRoadmapPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}
