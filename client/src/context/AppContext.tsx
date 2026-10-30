import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Application,
  ApplicationStatus,
  Interview,
  JobPosting,
  Notification,
  StudentProfileData,
  User,
  UserRole,
} from '../types';
import {
  initialApplications,
  initialInterviews,
  initialStudentProfile,
  mockJobPostings,
  mockNotifications,
  mockUsers,
} from '../data/mockData';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  currentRole: UserRole;
  currentUser: User;
  switchRole: (role: UserRole, silent?: boolean) => void;
  jobs: JobPosting[];
  applications: Application[];
  interviews: Interview[];
  notifications: Notification[];
  studentProfile: StudentProfileData;
  toasts: ToastInfo[];
  showToast: (type: ToastInfo['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
  updateStudentProfile: (updated: Partial<StudentProfileData>) => void;
  applyToJob: (jobId: string) => { success: boolean; message: string };
  withdrawApplication: (appId: string) => void;
  shortlistApplication: (appId: string) => void;
  rejectApplication: (appId: string) => void;
  markSelected: (appId: string) => void;
  scheduleInterview: (
    appId: string,
    details: {
      dateTime: string;
      mode: 'Virtual' | 'In-Person';
      locationOrLink: string;
      round: string;
      notes?: string;
    }
  ) => void;
  createJobPosting: (job: Omit<JobPosting, 'id' | 'createdAt' | 'applicantsCount'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobPostings);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [studentProfile, setStudentProfile] = useState<StudentProfileData>(initialStudentProfile);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const currentUser = mockUsers[currentRole];

  const showToast = (type: ToastInfo['type'], title: string, message?: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: UserRole, silent = false) => {
    setCurrentRole(role);
    if (!silent) {
      showToast(
        'info',
        `Switched Persona to ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        `Acting as ${mockUsers[role].name}`
      );
    }
  };

  const updateStudentProfile = (updated: Partial<StudentProfileData>) => {
    setStudentProfile((prev) => ({ ...prev, ...updated }));
    showToast('success', 'Profile Updated', 'Your student credentials have been saved.');
  };

  const applyToJob = (jobId: string): { success: boolean; message: string } => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found' };

    // Check duplicate
    const existing = applications.find(
      (a) => a.jobId === jobId && a.studentId === currentUser.id && a.status !== 'Withdrawn'
    );
    if (existing) {
      showToast('warning', 'Already Applied', `You have already applied for ${job.title}.`);
      return { success: false, message: 'Already applied' };
    }

    const newApp: Application = {
      id: 'app_' + Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      studentId: currentUser.id,
      studentName: studentProfile.fullName,
      studentEmail: studentProfile.email,
      studentRollNo: studentProfile.rollNo,
      studentBranch: studentProfile.branch,
      studentCgpa: studentProfile.cgpa,
      studentResumeUrl: studentProfile.resumeFileName
        ? `https://storage.campusflow.io/resumes/${studentProfile.resumeFileName}`
        : undefined,
      studentSkills: studentProfile.skills,
      appliedAt: new Date().toISOString(),
      status: 'Submitted',
      nextAction: 'Application submitted and placed under employer screening.',
      history: [
        {
          status: 'Submitted',
          timestamp: new Date().toISOString(),
          description: `Application submitted for ${job.title} at ${job.companyName}.`,
          author: 'Student',
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);

    // Update applicant count
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j))
    );

    // Create notification
    const newNotif: Notification = {
      id: 'notif_' + Date.now(),
      userId: currentUser.id,
      title: 'Application Submitted',
      message: `Your application for ${job.title} at ${job.companyName} was submitted.`,
      type: 'application',
      read: false,
      createdAt: new Date().toISOString(),
      link: `/student/applications/${newApp.id}`,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('success', 'Application Successful!', `Applied to ${job.title} at ${job.companyName}`);
    return { success: true, message: 'Success' };
  };

  const withdrawApplication = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'Withdrawn' as ApplicationStatus,
            nextAction: 'Application withdrawn by student.',
            history: [
              ...app.history,
              {
                status: 'Withdrawn' as ApplicationStatus,
                timestamp: new Date().toISOString(),
                description: 'Application retracted by candidate.',
                author: 'Student',
              },
            ],
          };
        }
        return app;
      })
    );
    showToast('info', 'Application Withdrawn', 'Your application status has been updated.');
  };

  const shortlistApplication = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'Shortlisted' as ApplicationStatus,
            nextAction: 'Shortlisted! Awaiting technical round scheduling.',
            history: [
              ...app.history,
              {
                status: 'Shortlisted' as ApplicationStatus,
                timestamp: new Date().toISOString(),
                description: 'Candidate shortlisted by recruitment team.',
                author: 'Recruiter',
              },
            ],
          };
        }
        return app;
      })
    );
    showToast('success', 'Candidate Shortlisted', 'Candidate moved to shortlisted stage.');
  };

  const rejectApplication = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'Rejected' as ApplicationStatus,
            nextAction: 'Application declined for this recruitment cycle.',
            history: [
              ...app.history,
              {
                status: 'Rejected' as ApplicationStatus,
                timestamp: new Date().toISOString(),
                description: 'Application was not selected to advance.',
                author: 'Recruiter',
              },
            ],
          };
        }
        return app;
      })
    );
    showToast('info', 'Status Updated', 'Candidate status updated to Rejected.');
  };

  const markSelected = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'Selected' as ApplicationStatus,
            nextAction: 'Official offer extended. Complete onboarding forms.',
            history: [
              ...app.history,
              {
                status: 'Selected' as ApplicationStatus,
                timestamp: new Date().toISOString(),
                description: 'Congratulations! Candidate officially selected for the role.',
                author: 'Recruiter',
              },
            ],
          };
        }
        return app;
      })
    );
    showToast('success', 'Candidate Selected!', 'Offer confirmed and recorded.');
  };

  const scheduleInterview = (
    appId: string,
    details: {
      dateTime: string;
      mode: 'Virtual' | 'In-Person';
      locationOrLink: string;
      round: string;
      notes?: string;
    }
  ) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    const newInterview: Interview = {
      id: 'int_' + Date.now(),
      applicationId: app.id,
      jobId: app.jobId,
      jobTitle: app.jobTitle,
      companyName: app.companyName,
      companyLogo: app.companyLogo,
      studentId: app.studentId,
      studentName: app.studentName,
      studentRollNo: app.studentRollNo,
      dateTime: details.dateTime,
      mode: details.mode,
      locationOrLink: details.locationOrLink,
      round: details.round,
      status: 'Scheduled',
      interviewer: 'Technical Evaluation Panel',
      notes: details.notes,
    };

    setInterviews((prev) => [newInterview, ...prev]);

    // Update application state
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          return {
            ...a,
            status: 'Interview' as ApplicationStatus,
            interviewDate: details.dateTime,
            nextAction: `${details.round} scheduled for ${new Date(details.dateTime).toLocaleDateString()}`,
            history: [
              ...a.history,
              {
                status: 'Interview' as ApplicationStatus,
                timestamp: new Date().toISOString(),
                description: `${details.round} scheduled (${details.mode})`,
                author: 'Recruiter',
              },
            ],
          };
        }
        return a;
      })
    );

    // Notification
    const notif: Notification = {
      id: 'notif_' + Date.now(),
      userId: app.studentId,
      title: 'Interview Scheduled',
      message: `${app.companyName} scheduled ${details.round} for ${new Date(details.dateTime).toLocaleString()}.`,
      type: 'interview',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/student/interviews',
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('success', 'Interview Scheduled', `${details.round} scheduled for candidate.`);
  };

  const createJobPosting = (newJobData: Omit<JobPosting, 'id' | 'createdAt' | 'applicantsCount'>) => {
    const newJob: JobPosting = {
      ...newJobData,
      id: 'job_' + Date.now(),
      createdAt: new Date().toISOString(),
      applicantsCount: 0,
    };
    setJobs((prev) => [newJob, ...prev]);
    showToast('success', 'Job Posted Successfully', `${newJob.title} is now live on the portal.`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('info', 'All Caught Up', 'All notifications marked as read.');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUser,
        switchRole,
        jobs,
        applications,
        interviews,
        notifications,
        studentProfile,
        toasts,
        showToast,
        removeToast,
        updateStudentProfile,
        applyToJob,
        withdrawApplication,
        shortlistApplication,
        rejectApplication,
        markSelected,
        scheduleInterview,
        createJobPosting,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
