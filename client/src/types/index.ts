export type UserRole = 'student' | 'recruiter' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  collegeId?: string; // e.g. "N25H02A0325"
  collegeName?: string;
  branch?: string;
  graduationYear?: number;
  cgpa?: number;
  skills?: string[];
  companyName?: string;
  companyTitle?: string;
}

export interface EligibilityCriterionResult {
  id: string;
  label: string;
  requiredValue: string;
  studentValue: string;
  passed: boolean;
  missingData?: boolean;
  details?: string;
}

export interface JobEligibilityCheck {
  isEligible: boolean;
  isIncomplete: boolean;
  reasons: string[];
  criteria: EligibilityCriterionResult[];
}

export interface JobPosting {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  location: string;
  workMode: 'Remote' | 'On-site' | 'Hybrid';
  type: 'Internship' | 'Full-time' | 'Contract';
  stipendOrSalary: string;
  duration?: string;
  openings: number;
  applyBy: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  skillsRequired: string[];
  minCgpa: number;
  eligibleBranches: string[];
  eligibleGraduationYears: number[];
  websiteUrl: string;
  linkedinUrl: string;
  createdAt: string;
  status: 'active' | 'closed' | 'draft';
  applicantsCount?: number;
}

export type ApplicationStatus =
  | 'Submitted'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected'
  | 'Withdrawn';

export interface ApplicationHistoryItem {
  status: ApplicationStatus;
  timestamp: string;
  description: string;
  author: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentRollNo: string;
  studentBranch: string;
  studentCgpa: number;
  studentResumeUrl?: string;
  studentSkills: string[];
  appliedAt: string;
  status: ApplicationStatus;
  history: ApplicationHistoryItem[];
  nextAction?: string;
  interviewDate?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  dateTime: string;
  mode: 'Virtual' | 'In-Person';
  locationOrLink: string;
  round: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  interviewer: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application' | 'interview' | 'drive' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface StudentProfileData {
  fullName: string;
  rollNo: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  backlogs: number;
  bio: string;
  skills: string[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  resumeFileName?: string;
  resumeFileSize?: string;
  resumeLastUpdated?: string;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}
