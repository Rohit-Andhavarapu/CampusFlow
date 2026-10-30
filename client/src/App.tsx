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

import { NotFound } from './pages/common/NotFound';

const RootRedirect = () => {
  const { currentRole } = useApp();
  return <Navigate to={`/${currentRole}/dashboard`} replace />;
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<RootRedirect />} />

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

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
