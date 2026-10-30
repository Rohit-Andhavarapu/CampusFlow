import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ExploreOpportunities } from './pages/student/ExploreOpportunities';
import { JobDetails } from './pages/student/JobDetails';
import { MyApplications } from './pages/student/MyApplications';
import { ApplicationDetails } from './pages/student/ApplicationDetails';
import { StudentInterviews } from './pages/student/StudentInterviews';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentNotifications } from './pages/student/StudentNotifications';
import { StudentSettings } from './pages/student/StudentSettings';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { RecruiterJobs } from './pages/recruiter/RecruiterJobs';
import { RecruiterJobNew } from './pages/recruiter/RecruiterJobNew';
import { RecruiterJobDetails } from './pages/recruiter/RecruiterJobDetails';
import { RecruiterApplicants } from './pages/recruiter/RecruiterApplicants';
import { RecruiterInterviews } from './pages/recruiter/RecruiterInterviews';
import { RecruiterCompany } from './pages/recruiter/RecruiterCompany';
import { RecruiterAnalytics } from './pages/recruiter/RecruiterAnalytics';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminCompanies } from './pages/admin/AdminCompanies';
import { AdminDrives } from './pages/admin/AdminDrives';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminInterviews } from './pages/admin/AdminInterviews';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminReports } from './pages/admin/AdminReports';

// Public Landing & Auth Pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import { DemoLoginPage } from './pages/auth/DemoLoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';

import { NotFound } from './pages/common/NotFound';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Cinematic Landing Experience */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Isolated Hackathon Evaluation Persona Sandbox */}
          <Route path="/demo" element={<DemoLoginPage />} />

          {/* Authenticated Workspace Shell Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              {/* Student Experience Routes */}
              <Route path="student">
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="opportunities" element={<ExploreOpportunities />} />
                <Route path="opportunities/:id" element={<JobDetails />} />
                <Route path="applications" element={<MyApplications />} />
                <Route path="applications/:id" element={<ApplicationDetails />} />
                <Route path="interviews" element={<StudentInterviews />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="resume" element={<StudentProfile activeTabProp="resume" />} />
                <Route path="notifications" element={<StudentNotifications />} />
                <Route path="settings" element={<StudentSettings />} />
              </Route>

              {/* Recruiter Experience Routes */}
              <Route path="recruiter">
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<RecruiterDashboard />} />
                <Route path="jobs" element={<RecruiterJobs />} />
                <Route path="jobs/new" element={<RecruiterJobNew />} />
                <Route path="jobs/:id" element={<RecruiterJobDetails />} />
                <Route path="applicants" element={<RecruiterApplicants />} />
                <Route path="interviews" element={<RecruiterInterviews />} />
                <Route path="company" element={<RecruiterCompany />} />
                <Route path="analytics" element={<RecruiterAnalytics />} />
              </Route>

              {/* Placement Administrator Routes */}
              <Route path="admin">
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="companies" element={<AdminCompanies />} />
                <Route path="drives" element={<AdminDrives />} />
                <Route path="applications" element={<AdminApplications />} />
                <Route path="interviews" element={<AdminInterviews />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="reports" element={<AdminReports />} />
              </Route>

              {/* 404 Fallback inside shell */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          {/* Global Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
