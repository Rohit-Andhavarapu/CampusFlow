import { supabase, isSupabaseConfigured } from './supabase';
import {
  Application,
  ApplicationStatus,
  Interview,
  JobEligibilityCheck,
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
import { checkJobEligibility } from '../utils/formatters';

// ==============================================================================
// Authoritative Demo Account Allowlist (Hackathon Provisioned Demonstration Accounts)
// Real authenticated users must NEVER inherit or access data from these accounts!
// ==============================================================================
export const DEMO_USER_IDS = new Set<string>([
  '28296879-9cd1-43ef-bb8e-7939cb71d213', // aarav.sharma@campus.edu (Student)
  '25daf6ec-9db8-4343-9328-72d44faf0d29', // priya.nair@novatech.io (Recruiter)
  '4a122f0c-2150-47b4-9e67-59470cb336c2', // placements@campus.edu (Admin)
]);

export function isDemoUserId(userId?: string | null): boolean {
  if (!userId) return false;
  return DEMO_USER_IDS.has(userId);
}

// ==============================================================================
// 1. Authentication Service
// ==============================================================================
export const authService = {
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profile) return null;

    return {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      role: profile.role as UserRole,
      avatar: profile.avatar_path || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
  },

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      // Local demo sign in matching demo emails
      const roleMap: Record<string, UserRole> = {
        'aarav.sharma@campus.edu': 'student',
        'priya.nair@novatech.io': 'recruiter',
        'placements@campus.edu': 'admin',
      };
      const role = roleMap[email.toLowerCase()] || 'student';
      return { user: mockUsers[role], error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };

    const user = await this.getCurrentUser();
    return { user, error: null };
  },

  async signInWithGoogle(): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase credentials not configured in environment' };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    return { error: error ? error.message : null };
  },

  async signUp(fullName: string, email: string, password: string): Promise<{ user: User | null; error: string | null; confirmationRequired?: boolean }> {
    if (!isSupabaseConfigured()) {
      return { user: mockUsers.student, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'student', // Public signup strictly restricted to student accounts per security requirements!
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.session) {
      const user = await this.getCurrentUser();
      return { user, error: null };
    }

    return {
      user: null,
      error: null,
      confirmationRequired: !data.session,
    };
  },

  async resetPasswordForEmail(email: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { error: error ? error.message : null };
  },

  async updatePassword(password: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }

    const { error } = await supabase.auth.updateUser({ password });
    return { error: error ? error.message : null };
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  },
};

// ==============================================================================
// 2. Student Profile Service
// ==============================================================================
export const studentService = {
  async getStudentProfile(userId?: string): Promise<StudentProfileData> {
    if (!isSupabaseConfigured()) {
      return initialStudentProfile;
    }

    const { data: authData } = await supabase.auth.getUser();
    const targetUserId = userId || authData.user?.id;
    if (!targetUserId) {
      return initialStudentProfile;
    }

    const isDemo = isDemoUserId(targetUserId);

    const { data: sp, error } = await supabase
      .from('student_profiles')
      .select(`
        *,
        profiles!inner(full_name, email),
        student_skills(skill_name),
        student_projects(id, title, description, project_url, technologies),
        resume_files(original_filename, file_size, uploaded_at)
      `)
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (error || !sp) {
      // If designated demo account and database had an issue, fallback to seeded demo profile
      if (isDemo) {
        return initialStudentProfile;
      }

      // For real authenticated users, fetch user's basic profile details
      const { data: baseProfile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', targetUserId)
        .maybeSingle();

      return {
        fullName: baseProfile?.full_name || authData.user?.user_metadata?.full_name || 'Student Candidate',
        rollNo: '',
        email: baseProfile?.email || authData.user?.email || '',
        phone: '',
        college: 'National Institute of Technology',
        degree: '',
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
    }

    const latestResume = sp.resume_files?.[0];

    return {
      fullName: (sp as any).profiles?.full_name || (sp as any).full_name || 'Student Candidate',
      rollNo: sp.roll_number || '',
      email: (sp as any).profiles?.email || (sp as any).email || '',
      phone: sp.phone || '',
      college: 'National Institute of Technology',
      degree: sp.course || 'B.Tech',
      branch: sp.branch || '',
      graduationYear: sp.graduation_year || 2026,
      cgpa: Number(sp.cgpa) || 0,
      backlogs: sp.active_backlogs || 0,
      bio: sp.bio || '',
      skills: sp.student_skills?.map((s: { skill_name: string }) => s.skill_name) || [],
      githubUrl: sp.github_url || '',
      linkedinUrl: sp.linkedin_url || '',
      portfolioUrl: sp.portfolio_url || '',
      resumeFileName: latestResume?.original_filename,
      resumeFileSize: latestResume ? `${(latestResume.file_size / (1024 * 1024)).toFixed(1)} MB` : undefined,
      resumeLastUpdated: latestResume?.uploaded_at,
      projects: sp.student_projects?.map((p: { id: string; title: string; description: string; technologies: string[]; project_url: string | null }) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        technologies: p.technologies || [],
        link: p.project_url || undefined,
      })) || [],
    };
  },

  async updateStudentProfile(userId: string, data: Partial<StudentProfileData>): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const { error: spError } = await supabase
      .from('student_profiles')
      .update({
        phone: data.phone,
        bio: data.bio,
        github_url: data.githubUrl,
        linkedin_url: data.linkedinUrl,
        portfolio_url: data.portfolioUrl,
      })
      .eq('user_id', userId);

    if (spError) return { success: false, error: spError.message };

    // Update skills if supplied
    if (data.skills) {
      const { data: studentRecord } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (studentRecord) {
        // Clear & re-insert
        await supabase.from('student_skills').delete().eq('student_id', studentRecord.id);
        const skillRows = data.skills.map((skill) => ({
          student_id: studentRecord.id,
          skill_name: skill,
        }));
        await supabase.from('student_skills').insert(skillRows);
      }
    }

    return { success: true };
  },

  async uploadResume(file: File, studentProfileId: string, userId: string): Promise<{ success: boolean; storagePath?: string; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true, storagePath: `resumes/${userId}/${file.name}` };
    }

    // Validate PDF
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return { success: false, error: 'Only PDF documents are accepted.' };
    }

    // Max 5 MB
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File size exceeds maximum limit of 5 MB.' };
    }

    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${userId}/${timestamp}_${sanitizedFilename}`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(storagePath, file, { contentType: 'application/pdf', upsert: true });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    // Record metadata in resume_files table
    await supabase.from('resume_files').insert({
      student_id: studentProfileId,
      storage_path: storagePath,
      original_filename: file.name,
      content_type: file.type,
      file_size: file.size,
    });

    return { success: true, storagePath };
  },

  async getResumeSignedUrl(storagePath: string): Promise<string | null> {
    if (!isSupabaseConfigured()) {
      return 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    }

    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUrl(storagePath, 3600); // 1-hour signed URL

    if (error) return null;
    return data.signedUrl;
  },
};

// ==============================================================================
// 3. Job Postings Service
// ==============================================================================
export const jobsService = {
  async fetchJobs(): Promise<JobPosting[]> {
    if (!isSupabaseConfigured()) {
      return mockJobPostings;
    }

    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        companies!inner(id, name, logo_path, website),
        job_eligibility_rules(*),
        applications(count)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return mockJobPostings;
    }

    return data.map((j: any) => {
      const rule = j.job_eligibility_rules?.[0];
      const appCount = j.applications?.[0]?.count || 0;

      return {
        id: j.id,
        title: j.title,
        companyId: j.company_id,
        companyName: j.companies?.name || 'Company',
        companyLogo: j.companies?.logo_path || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
        location: j.location,
        workMode: j.work_mode,
        type: j.employment_type,
        stipendOrSalary:
          j.compensation_period === 'annual'
            ? `₹${(j.compensation_min / 100000).toFixed(1)} - ₹${(j.compensation_max / 100000).toFixed(1)} LPA`
            : `₹${j.compensation_min.toLocaleString()} - ₹${j.compensation_max.toLocaleString()}/mo`,
        openings: j.openings,
        applyBy: j.deadline,
        description: j.description,
        responsibilities: j.responsibilities || [],
        qualifications: rule?.required_skills || [],
        skillsRequired: rule?.required_skills || [],
        minCgpa: rule?.minimum_cgpa ? Number(rule.minimum_cgpa) : 0,
        eligibleBranches: rule?.allowed_branches || [],
        eligibleGraduationYears: rule?.allowed_graduation_years || [2026],
        websiteUrl: j.companies?.website || 'https://campusflow.io',
        linkedinUrl: 'https://linkedin.com/company',
        createdAt: j.created_at,
        status: j.status,
        applicantsCount: appCount,
      };
    });
  },

  async evaluateEligibility(jobId: string, studentId: string, fallbackJob?: JobPosting, fallbackProfile?: StudentProfileData): Promise<JobEligibilityCheck> {
    if (!isSupabaseConfigured()) {
      if (fallbackJob && fallbackProfile) {
        return checkJobEligibility(fallbackJob, fallbackProfile);
      }
      return { isEligible: true, isIncomplete: false, reasons: [], criteria: [] };
    }

    const { data, error } = await supabase.rpc('evaluate_job_eligibility', {
      p_job_id: jobId,
      p_student_id: studentId,
    });

    if (error || !data) {
      if (fallbackJob && fallbackProfile) {
        return checkJobEligibility(fallbackJob, fallbackProfile);
      }
      return { isEligible: true, isIncomplete: false, reasons: [], criteria: [] };
    }

    return {
      isEligible: data.is_eligible,
      isIncomplete: data.is_incomplete,
      reasons: data.reasons || [],
      criteria: data.criteria || [],
    };
  },

  async createJobPosting(job: Omit<JobPosting, 'id' | 'createdAt' | 'applicantsCount'>): Promise<{ success: boolean; jobId?: string; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true, jobId: 'job_' + Date.now() };
    }

    const { data: user } = await supabase.auth.getUser();

    // Parse compensation
    const compMin = 1000000;
    const compMax = 1500000;

    const { data: newJob, error: jobError } = await supabase
      .from('job_postings')
      .insert({
        company_id: job.companyId,
        created_by: user.user?.id || null,
        title: job.title,
        description: job.description,
        responsibilities: job.responsibilities,
        employment_type: job.type,
        work_mode: job.workMode,
        location: job.location,
        compensation_min: compMin,
        compensation_max: compMax,
        compensation_period: job.type === 'Internship' ? 'monthly' : 'annual',
        currency: 'INR',
        openings: job.openings,
        deadline: job.applyBy,
        status: job.status,
      })
      .select('id')
      .single();

    if (jobError || !newJob) {
      return { success: false, error: jobError?.message || 'Failed to create job posting' };
    }

    // Insert eligibility rule
    await supabase.from('job_eligibility_rules').insert({
      job_id: newJob.id,
      minimum_cgpa: job.minCgpa,
      allowed_branches: job.eligibleBranches,
      allowed_graduation_years: job.eligibleGraduationYears,
      required_skills: job.skillsRequired,
    });

    return { success: true, jobId: newJob.id };
  },
};

function mapDbStatusToApplicationStatus(dbStatus: string): ApplicationStatus {
  switch (dbStatus) {
    case 'submitted':
      return 'Submitted';
    case 'shortlisted':
      return 'Shortlisted';
    case 'interview':
      return 'Interview';
    case 'selected':
      return 'Selected';
    case 'rejected':
      return 'Rejected';
    case 'withdrawn':
      return 'Withdrawn';
    default:
      return 'Submitted';
  }
}

// ==============================================================================
// 4. Applications Service
// ==============================================================================
export const applicationService = {
  async fetchApplications(): Promise<Application[]> {
    if (!isSupabaseConfigured()) {
      return initialApplications;
    }

    const { data, error } = await supabase
      .from('applications')
      .select(`
        id,
        job_id,
        student_id,
        status,
        applied_at,
        updated_at,
        withdrawn_at,
        job_postings!inner (
          id,
          title,
          company_id,
          companies!inner (
            id,
            name,
            logo_path
          )
        ),
        student_profiles!inner (
          id,
          full_name,
          roll_number,
          branch,
          cgpa,
          student_skills (
            skill_name
          ),
          profiles (
            email
          ),
          resume_files (
            storage_path,
            original_filename
          )
        ),
        application_status_history (
          id,
          previous_status,
          new_status,
          change_reason,
          changed_at,
          profiles (
            full_name,
            role
          )
        ),
        interviews (
          id,
          scheduled_at,
          round,
          mode,
          location,
          meeting_url,
          status
        )
      `)
      .order('applied_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase applications fetch warning:', error);
      const { data: authData } = await supabase.auth.getUser();
      if (isDemoUserId(authData.user?.id)) {
        return initialApplications;
      }
      return [];
    }

    return data.map((a: any) => {
      const status = mapDbStatusToApplicationStatus(a.status);
      const history = (a.application_status_history || []).map((h: any) => ({
        status: mapDbStatusToApplicationStatus(h.new_status),
        timestamp: h.changed_at,
        description: h.change_reason || `Status updated to ${h.new_status}`,
        author: h.profiles?.full_name || (h.profiles?.role === 'recruiter' ? 'Recruiter' : 'Placement Office'),
      }));

      if (history.length === 0) {
        history.push({
          status: status,
          timestamp: a.applied_at,
          description: `Application submitted for ${a.job_postings?.title} at ${a.job_postings?.companies?.name}.`,
          author: 'Student',
        });
      }

      const latestInterview = a.interviews?.[0];

      return {
        id: a.id,
        jobId: a.job_id,
        jobTitle: a.job_postings?.title || 'Job Posting',
        companyName: a.job_postings?.companies?.name || 'Company',
        companyLogo: a.job_postings?.companies?.logo_path || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
        studentId: a.student_id,
        studentName: a.student_profiles?.full_name || 'Candidate',
        studentEmail: a.student_profiles?.profiles?.email || 'student@campus.edu',
        studentRollNo: a.student_profiles?.roll_number || 'N/A',
        studentBranch: a.student_profiles?.branch || 'General',
        studentCgpa: Number(a.student_profiles?.cgpa) || 0,
        studentResumeUrl: a.student_profiles?.resume_files?.[0]?.original_filename
          ? `https://storage.campusflow.io/resumes/${a.student_profiles.resume_files[0].original_filename}`
          : undefined,
        studentSkills: a.student_profiles?.student_skills?.map((s: any) => s.skill_name) || [],
        appliedAt: a.applied_at,
        status: status,
        history: history,
        nextAction:
          status === 'Submitted'
            ? 'Application under employer screening.'
            : status === 'Shortlisted'
            ? 'Shortlisted! Awaiting technical round scheduling.'
            : status === 'Interview'
            ? latestInterview ? `${latestInterview.round} scheduled` : 'Interview scheduled'
            : status === 'Selected'
            ? 'Offer confirmed and recorded.'
            : status === 'Rejected'
            ? 'Application not selected to advance.'
            : 'Application withdrawn.',
        interviewDate: latestInterview?.scheduled_at,
      };
    });
  },

  async submitApplication(jobId: string): Promise<{ success: boolean; message: string; applicationId?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true, message: 'Application submitted successfully', applicationId: 'app_' + Date.now() };
    }

    const { data, error } = await supabase.rpc('submit_application', { p_job_id: jobId });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: data.success,
      message: data.message,
      applicationId: data.application_id,
    };
  },

  async updateApplicationStatus(applicationId: string, newStatus: Application['status'], reason?: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true, message: `Status updated to ${newStatus}` };
    }

    const dbStatus = newStatus.toLowerCase() as any;

    const { data, error } = await supabase.rpc('update_application_status', {
      p_application_id: applicationId,
      p_new_status: dbStatus,
      p_reason: reason || `Updated to ${newStatus}`,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: data.success, message: data.message };
  },

  async withdrawApplication(applicationId: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true, message: 'Application withdrawn' };
    }

    const { data, error } = await supabase.rpc('withdraw_application', {
      p_application_id: applicationId,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: data.success, message: data.message };
  },
};

// ==============================================================================
// 5. Interviews Service
// ==============================================================================
export const interviewService = {
  async fetchInterviews(): Promise<Interview[]> {
    if (!isSupabaseConfigured()) {
      return initialInterviews;
    }

    const { data, error } = await supabase
      .from('interviews')
      .select(`
        id,
        application_id,
        scheduled_at,
        duration_minutes,
        mode,
        location,
        meeting_url,
        round,
        status,
        feedback,
        applications!inner (
          id,
          student_id,
          job_id,
          job_postings (
            id,
            title,
            companies (name, logo_path)
          ),
          student_profiles (
            id,
            full_name,
            roll_number
          )
        )
      `)
      .order('scheduled_at', { ascending: true });

    if (error || !data) {
      console.warn('Supabase interviews fetch warning:', error);
      const { data: authData } = await supabase.auth.getUser();
      if (isDemoUserId(authData.user?.id)) {
        return initialInterviews;
      }
      return [];
    }

    return data.map((i: any) => ({
      id: i.id,
      applicationId: i.application_id,
      jobId: i.applications?.job_id || '',
      jobTitle: i.applications?.job_postings?.title || 'Software Role',
      companyName: i.applications?.job_postings?.companies?.name || 'Company',
      companyLogo: i.applications?.job_postings?.companies?.logo_path || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
      studentId: i.applications?.student_id || '',
      studentName: i.applications?.student_profiles?.full_name || 'Candidate',
      studentRollNo: i.applications?.student_profiles?.roll_number || 'N/A',
      dateTime: i.scheduled_at,
      mode: i.mode,
      locationOrLink: i.mode === 'Virtual' ? (i.meeting_url || 'https://meet.google.com/interview') : (i.location || 'Campus Tech Block'),
      round: i.round,
      status: i.status === 'scheduled' ? 'Scheduled' : i.status === 'completed' ? 'Completed' : 'Cancelled',
      interviewer: 'Technical Evaluation Panel',
      notes: i.feedback || undefined,
    }));
  },

  async scheduleInterview(details: {
    applicationId: string;
    dateTime: string;
    mode: 'Virtual' | 'In-Person';
    locationOrLink: string;
    round: string;
    notes?: string;
  }): Promise<{ success: boolean; message: string; interviewId?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true, message: 'Interview scheduled successfully', interviewId: 'int_' + Date.now() };
    }

    const { data, error } = await supabase.rpc('schedule_interview', {
      p_application_id: details.applicationId,
      p_scheduled_at: details.dateTime,
      p_mode: details.mode,
      p_meeting_url: details.mode === 'Virtual' ? details.locationOrLink : undefined,
      p_location: details.mode === 'In-Person' ? details.locationOrLink : undefined,
      p_round: details.round,
      p_notes: details.notes,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: data.success,
      message: data.message,
      interviewId: data.interview_id,
    };
  },
};

// ==============================================================================
// 6. Notifications Service
// ==============================================================================
export const notificationService = {
  async fetchNotifications(): Promise<Notification[]> {
    if (!isSupabaseConfigured()) {
      return mockNotifications;
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase notifications fetch warning:', error);
      const { data: authData } = await supabase.auth.getUser();
      if (isDemoUserId(authData.user?.id)) {
        return mockNotifications;
      }
      return [];
    }

    if (data.length === 0) {
      return [];
    }

    return data.map((n: any) => ({
      id: n.id,
      userId: n.user_id,
      title: n.title,
      message: n.body,
      type: n.category as Notification['type'],
      read: n.is_read,
      createdAt: n.created_at,
      link: n.category === 'interview' ? '/student/interviews' : (n.category === 'application' ? '/student/applications' : undefined),
    }));
  },

  async markAsRead(notificationId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
    }
  },

  async markAllAsRead(): Promise<void> {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        await supabase.from('notifications').update({ is_read: true }).eq('user_id', data.user.id);
      }
    }
  },
};

// ==============================================================================
// 7. Placement Admin Service
// ==============================================================================
export const adminService = {
  async getPlacementAnalytics(): Promise<{
    totalStudents: number;
    placedStudents: number;
    inProcessStudents: number;
    unplacedStudents: number;
    placementRate: number;
    activeDrives: number;
    partnerCompanies: number;
    departmentStats: Array<{ name: string; total: number; placed: number; rate: number }>;
  } | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const { data, error } = await supabase.rpc('get_placement_analytics');
    if (error || !data) {
      console.warn('Supabase get_placement_analytics RPC warning:', error);
      return null;
    }

    return {
      totalStudents: Number(data.total_students) || 0,
      placedStudents: Number(data.placed_students) || 0,
      inProcessStudents: Number(data.in_process_students) || 0,
      unplacedStudents: Number(data.unplaced_students) || 0,
      placementRate: Number(data.placement_rate) || 0,
      activeDrives: Number(data.active_drives) || 0,
      partnerCompanies: Number(data.partner_companies) || 0,
      departmentStats: Array.isArray(data.department_stats)
        ? data.department_stats.map((d: any) => ({
            name: d.name,
            total: Number(d.total) || 0,
            placed: Number(d.placed) || 0,
            rate: Number(d.rate) || 0,
          }))
        : [],
    };
  },
};
