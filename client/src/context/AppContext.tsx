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
import { isSupabaseConfigured, supabase } from '../services/supabase';
import {
  applicationService,
  authService,
  interviewService,
  jobsService,
  notificationService,
  studentService,
  watchlistService,
  isDemoUserId,
} from '../services/campusflowService';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

const emptyStudentProfile: StudentProfileData = {
  fullName: '',
  rollNo: '',
  email: '',
  phone: '',
  college: 'National Institute of Technology',
  degree: 'B.Tech',
  branch: '',
  graduationYear: 2026,
  cgpa: 0,
  backlogs: 0,
  bio: '',
  skills: [],
  githubUrl: '',
  linkedinUrl: '',
  portfolioUrl: '',
  projects: [],
};

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  isDatabaseConnected: boolean;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  switchRole: (role: UserRole, silent?: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string; confirmationRequired?: boolean }>;
  logout: () => Promise<void>;
  jobs: JobPosting[];
  applications: Application[];
  interviews: Interview[];
  notifications: Notification[];
  studentProfile: StudentProfileData;
  toasts: ToastInfo[];
  showToast: (type: ToastInfo['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
  updateStudentProfile: (updated: Partial<StudentProfileData>) => Promise<void>;
  applyToJob: (jobId: string) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
  withdrawApplication: (appId: string) => Promise<void>;
  shortlistApplication: (appId: string) => Promise<void>;
  rejectApplication: (appId: string) => Promise<void>;
  markSelected: (appId: string) => Promise<void>;
  scheduleInterview: (
    appId: string,
    details: {
      dateTime: string;
      mode: 'Virtual' | 'In-Person';
      locationOrLink: string;
      round: string;
      notes?: string;
    }
  ) => Promise<void>;
  createJobPosting: (job: Omit<JobPosting, 'id' | 'createdAt' | 'applicantsCount'>) => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  watchlist: string[];
  toggleWatchlist: (jobId: string) => Promise<void>;
  isWatchlisted: (jobId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobPostings);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfileData>(emptyStudentProfile);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const isDatabaseConnected = isSupabaseConfigured();

  const demoRoleCredentials: Record<UserRole, { email: string; pass: string }> = {
    student: { email: 'aarav.sharma@campus.edu', pass: 'CampusFlow2026!' },
    recruiter: { email: 'priya.nair@novatech.io', pass: 'CampusFlow2026!' },
    admin: { email: 'placements@campus.edu', pass: 'CampusFlow2026!' },
  };

  // Inspect existing authenticated session on mount without forced demo login
  useEffect(() => {
    if (isDatabaseConnected) {
      const initApp = async () => {
        try {
          // Check for existing authenticated session
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            const remoteUser = await authService.getCurrentUser();
            if (remoteUser) {
              setIsAuthenticated(true);
              setCurrentRole(remoteUser.role);
              setActiveUser(remoteUser);

              const [remoteJobs, remoteProfile, remoteApps, remoteInts, remoteNotifs] = await Promise.all([
                jobsService.fetchJobs(),
                remoteUser.role === 'student' ? studentService.getStudentProfile(remoteUser.id) : null,
                applicationService.fetchApplications(),
                interviewService.fetchInterviews(),
                notificationService.fetchNotifications(),
              ]);

              if (remoteJobs && remoteJobs.length > 0) setJobs(remoteJobs);
              if (remoteProfile) setStudentProfile(remoteProfile);
              setApplications(remoteApps || []);
              setInterviews(remoteInts || []);
              setNotifications(remoteNotifs || []);
              if (remoteUser.role === 'student') {
                const remoteWl = await watchlistService.fetchWatchlist(remoteProfile?.id, remoteUser.id);
                setWatchlist(remoteWl);
              }
              return;
            }
          }

          // Unauthenticated visitor: fetch public active recruitment jobs and clean state
          setIsAuthenticated(false);
          setActiveUser(null);
          setApplications([]);
          setInterviews([]);
          setNotifications([]);
          setStudentProfile(emptyStudentProfile);
          setWatchlist([]);
          const remoteJobs = await jobsService.fetchJobs();
          if (remoteJobs && remoteJobs.length > 0) setJobs(remoteJobs);
        } catch (err) {
          console.error('Session initialization error:', err);
          setIsAuthenticated(false);
          setActiveUser(null);
          setApplications([]);
          setInterviews([]);
          setNotifications([]);
          setWatchlist([]);
        } finally {
          setIsAuthLoading(false);
        }
      };
      initApp();

      // Listen for auth state changes (OAuth callbacks, login, logout)
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = await authService.getCurrentUser();
          if (user) {
            setIsAuthenticated(true);
            setCurrentRole(user.role);
            setActiveUser(user);
            const [remoteApps, remoteInts, remoteNotifs, remoteProf] = await Promise.all([
              applicationService.fetchApplications(),
              interviewService.fetchInterviews(),
              notificationService.fetchNotifications(),
              user.role === 'student' ? studentService.getStudentProfile(user.id) : null,
            ]);
            setApplications(remoteApps || []);
            setInterviews(remoteInts || []);
            setNotifications(remoteNotifs || []);
            if (remoteProf) setStudentProfile(remoteProf);
            if (user.role === 'student') {
              const remoteWl = await watchlistService.fetchWatchlist(remoteProf?.id, user.id);
              setWatchlist(remoteWl);
            } else {
              setWatchlist([]);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setActiveUser(null);
          setApplications([]);
          setInterviews([]);
          setNotifications([]);
          setStudentProfile(emptyStudentProfile);
          setWatchlist([]);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [isDatabaseConnected]);

  const currentUser = activeUser || mockUsers[currentRole];

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

  const switchRole = async (role: UserRole, silent = false) => {
    // If a real non-demo user is logged in, DO NOT overwrite their session with demo credentials
    if (activeUser && !isDemoUserId(activeUser.id)) {
      setCurrentRole(role);
      return;
    }

    setCurrentRole(role);
    setIsAuthenticated(true);
    if (!silent) {
      showToast(
        'info',
        `Switched Persona to ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        `Acting as ${mockUsers[role].name}`
      );
    }
    // Synchronize underlying Supabase Auth session with the selected demo persona
    if (isDatabaseConnected) {
      try {
        const creds = demoRoleCredentials[role];
        await authService.signIn(creds.email, creds.pass);
        const remoteUser = await authService.getCurrentUser();
        if (remoteUser) setActiveUser(remoteUser);
        const [remoteApps, remoteInts, remoteNotifs] = await Promise.all([
          applicationService.fetchApplications(),
          interviewService.fetchInterviews(),
          notificationService.fetchNotifications(),
        ]);
        setApplications(remoteApps || []);
        setInterviews(remoteInts || []);
        setNotifications(remoteNotifs || []);
        if (role === 'student') {
          const remoteProfile = await studentService.getStudentProfile();
          if (remoteProfile) setStudentProfile(remoteProfile);
          const remoteWl = await watchlistService.fetchWatchlist(remoteProfile?.id, remoteUser?.id);
          setWatchlist(remoteWl);
        } else {
          setWatchlist([]);
        }
      } catch (err) {
        console.warn('Backend persona authentication sync warning:', err);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.signIn(email, password);
      if (res.error || !res.user) {
        showToast('error', 'Login Failed', res.error || 'Invalid credentials');
        return { success: false, error: res.error || 'Invalid credentials' };
      }
      setIsAuthenticated(true);
      setCurrentRole(res.user.role);
      setActiveUser(res.user);
      const [remoteApps, remoteInts, remoteNotifs] = await Promise.all([
        applicationService.fetchApplications(),
        interviewService.fetchInterviews(),
        notificationService.fetchNotifications(),
      ]);
      setApplications(remoteApps || []);
      setInterviews(remoteInts || []);
      setNotifications(remoteNotifs || []);
      if (res.user.role === 'student') {
        const remoteProfile = await studentService.getStudentProfile(res.user.id);
        if (remoteProfile) setStudentProfile(remoteProfile);
        const remoteWl = await watchlistService.fetchWatchlist(remoteProfile?.id, res.user.id);
        setWatchlist(remoteWl);
      } else {
        setWatchlist([]);
      }
      showToast('success', `Welcome back, ${res.user.name}`, `Signed in as ${res.user.role.toUpperCase()}`);
      return { success: true, role: res.user.role };
    } catch (err: any) {
      return { success: false, error: err.message || 'Authentication error' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const res = await authService.signInWithGoogle();
      if (res.error) {
        showToast('error', 'Google Sign-In Error', res.error);
        return { success: false, error: res.error };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google OAuth failed' };
    }
  };

  const signup = async (fullName: string, email: string, password: string) => {
    try {
      const res = await authService.signUp(fullName, email, password);
      if (res.error) {
        showToast('error', 'Registration Failed', res.error);
        return { success: false, error: res.error };
      }
      if (res.confirmationRequired) {
        showToast('info', 'Verification Required', 'Please check your email to verify your student account.');
        return { success: true, confirmationRequired: true };
      }
      if (res.user) {
        setIsAuthenticated(true);
        setCurrentRole('student');
        setActiveUser(res.user);
        setApplications([]);
        setInterviews([]);
        setNotifications([]);
        const cleanProf = await studentService.getStudentProfile(res.user.id);
        setStudentProfile(cleanProf);
        showToast('success', 'Account Created', `Welcome to CampusFlow, ${fullName}!`);
        return { success: true, confirmationRequired: false };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
    } catch (e) {
      console.warn('SignOut error:', e);
    }
    setIsAuthenticated(false);
    setActiveUser(null);
    setApplications([]);
    setInterviews([]);
    setNotifications([]);
    setStudentProfile(emptyStudentProfile);
    setWatchlist([]);
    showToast('info', 'Signed Out', 'You have been logged out of CampusFlow.');
  };

  const updateStudentProfile = async (updated: Partial<StudentProfileData>) => {
    setStudentProfile((prev) => ({ ...prev, ...updated }));
    if (isDatabaseConnected) {
      await studentService.updateStudentProfile(currentUser.id, updated);
    }
    showToast('success', 'Profile Updated', 'Your student credentials have been saved.');
  };

  const applyToJob = async (jobId: string): Promise<{ success: boolean; message: string }> => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found' };

    // Duplicate check
    const existing = applications.find(
      (a) => a.jobId === jobId && a.studentId === currentUser.id && a.status !== 'Withdrawn'
    );
    if (existing) {
      showToast('warning', 'Already Applied', `You have already applied for ${job.title}.`);
      return { success: false, message: 'Already applied' };
    }

    // If live Supabase connection is active, submit via authoritative PostgreSQL RPC
    if (isDatabaseConnected) {
      const res = await applicationService.submitApplication(jobId);
      if (!res.success) {
        showToast('error', 'Application Denied', res.message);
        return { success: false, message: res.message };
      }

      // Re-fetch synchronized live data from Supabase
      const [remoteApps, remoteNotifs] = await Promise.all([
        applicationService.fetchApplications(),
        notificationService.fetchNotifications(),
      ]);
      if (remoteApps && remoteApps.length > 0) setApplications(remoteApps);
      if (remoteNotifs && remoteNotifs.length > 0) setNotifications(remoteNotifs);

      // Increment applicant count on job
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j))
      );

      showToast('success', 'Application Successful!', `Applied to ${job.title} at ${job.companyName}`);
      return { success: true, message: 'Success' };
    }

    const generatedAppId = 'app_' + Date.now();
    const newApp: Application = {
      id: generatedAppId,
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

    // Increment applicant count
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j))
    );

    // Create in-app notification
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

  const withdrawApplication = async (appId: string) => {
    if (isDatabaseConnected) {
      await applicationService.withdrawApplication(appId);
      const remoteApps = await applicationService.fetchApplications();
      if (remoteApps && remoteApps.length > 0) setApplications(remoteApps);
    } else {
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
    }
    showToast('info', 'Application Withdrawn', 'Your application status has been updated.');
  };

  const shortlistApplication = async (appId: string) => {
    if (isDatabaseConnected) {
      await applicationService.updateApplicationStatus(appId, 'Shortlisted', 'Shortlisted by recruitment team.');
      const remoteApps = await applicationService.fetchApplications();
      if (remoteApps && remoteApps.length > 0) setApplications(remoteApps);
    } else {
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
    }
    showToast('success', 'Candidate Shortlisted', 'Candidate moved to shortlisted stage.');
  };

  const rejectApplication = async (appId: string) => {
    if (isDatabaseConnected) {
      await applicationService.updateApplicationStatus(appId, 'Rejected', 'Application not selected to advance.');
      const remoteApps = await applicationService.fetchApplications();
      if (remoteApps && remoteApps.length > 0) setApplications(remoteApps);
    } else {
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
    }
    showToast('info', 'Status Updated', 'Candidate status updated to Rejected.');
  };

  const markSelected = async (appId: string) => {
    if (isDatabaseConnected) {
      await applicationService.updateApplicationStatus(appId, 'Selected', 'Offer confirmed and recorded.');
      const remoteApps = await applicationService.fetchApplications();
      if (remoteApps && remoteApps.length > 0) setApplications(remoteApps);
    } else {
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
    }
    showToast('success', 'Candidate Selected!', 'Offer confirmed and recorded.');
  };

  const scheduleInterview = async (
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

    if (isDatabaseConnected) {
      const res = await interviewService.scheduleInterview({
        applicationId: appId,
        dateTime: details.dateTime,
        mode: details.mode,
        locationOrLink: details.locationOrLink,
        round: details.round,
        notes: details.notes,
      });

      if (!res.success) {
        showToast('error', 'Scheduling Failed', res.message);
        return;
      }

      const [remoteApps, remoteInts, remoteNotifs] = await Promise.all([
        applicationService.fetchApplications(),
        interviewService.fetchInterviews(),
        notificationService.fetchNotifications(),
      ]);
      if (remoteApps && remoteApps.length > 0) setApplications(remoteApps);
      if (remoteInts && remoteInts.length > 0) setInterviews(remoteInts);
      if (remoteNotifs && remoteNotifs.length > 0) setNotifications(remoteNotifs);

      showToast('success', 'Interview Scheduled', `${details.round} scheduled for candidate.`);
      return;
    }

    const generatedInterviewId = 'int_' + Date.now();
    const newInterview: Interview = {
      id: generatedInterviewId,
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

    // In-app Notification
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

  const createJobPosting = async (newJobData: Omit<JobPosting, 'id' | 'createdAt' | 'applicantsCount'>) => {
    let generatedJobId = 'job_' + Date.now();

    if (isDatabaseConnected) {
      const res = await jobsService.createJobPosting(newJobData);
      if (res.jobId) generatedJobId = res.jobId;
      const remoteJobs = await jobsService.fetchJobs();
      if (remoteJobs && remoteJobs.length > 0) setJobs(remoteJobs);
    } else {
      const newJob: JobPosting = {
        ...newJobData,
        id: generatedJobId,
        createdAt: new Date().toISOString(),
        applicantsCount: 0,
      };
      setJobs((prev) => [newJob, ...prev]);
    }
    showToast('success', 'Job Posted Successfully', `${newJobData.title} is now live on the portal.`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (isDatabaseConnected) {
      notificationService.markAsRead(id).catch(console.error);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (isDatabaseConnected) {
      notificationService.markAllAsRead().catch(console.error);
    }
    showToast('info', 'All Caught Up', 'All notifications marked as read.');
  };

  const toggleWatchlist = async (jobId: string) => {
    const res = await watchlistService.toggleWatchlist(jobId, studentProfile.id, currentUser.id);
    const updated = watchlistService.getLocalWatchlist(currentUser.id);
    setWatchlist(updated);
    showToast(
      res.isWatchlisted ? 'success' : 'info',
      res.isWatchlisted ? 'Added to Watchlist' : 'Removed from Watchlist',
      res.isWatchlisted ? 'Opportunity saved to your watchlist.' : 'Removed from saved opportunities.'
    );
  };

  const isWatchlisted = (jobId: string) => watchlist.includes(jobId);

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        isDatabaseConnected,
        isAuthenticated,
        isAuthLoading,
        switchRole,
        login,
        loginWithGoogle,
        signup,
        logout,
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
        watchlist,
        toggleWatchlist,
        isWatchlisted,
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
