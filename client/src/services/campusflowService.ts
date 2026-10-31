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

/**
 * Resolves the backend Functions/API endpoint URL dynamically.
 * - In local dev (Vite dev server), routes to relative '/functions/v1' which proxies to localhost:3001.
 * - In production without VITE_API_URL, automatically targets the configured Supabase Cloud Edge Functions URL.
 * - Never returns a relative URL in production to prevent silently hitting Vercel static hosting (returning 404/HTML).
 */
export function getFunctionsApiUrl(endpoint: string): string {
  const base = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  if (base) {
    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    if (normalizedBase.endsWith('/functions/v1')) {
      return `${normalizedBase}/${cleanEndpoint}`;
    }
    return `${normalizedBase}/functions/v1/${cleanEndpoint}`;
  }

  // In development mode, allow relative path to hit Vite dev proxy (/functions/v1 -> localhost:3001)
  if (import.meta.env.DEV) {
    return `/functions/v1/${cleanEndpoint}`;
  }

  // In production builds, resolve directly to Supabase Cloud Edge Functions
  const sbUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  if (sbUrl && !sbUrl.includes('placeholder')) {
    const normalizedSb = sbUrl.endsWith('/') ? sbUrl.slice(0, -1) : sbUrl;
    return `${normalizedSb}/functions/v1/${cleanEndpoint}`;
  }

  return `/functions/v1/${cleanEndpoint}`;
}

/**
 * Constructs authoritative headers for Edge Function / API requests.
 * Passes apikey for Supabase Cloud Kong gateway along with Bearer token for RLS/Auth.
 */
export function getFunctionHeaders(token?: string | null): Record<string, string> {
  const apiKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '') as string;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['apikey'] = apiKey;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
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

    const normalizedRole = (profile.role === 'placement_admin' ? 'admin' : profile.role) as UserRole;

    return {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      role: normalizedRole,
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
        resume_files(id, storage_path, original_filename, file_size, uploaded_at)
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

    // Sort resume_files by uploaded_at descending
    const sortedResumes = (sp.resume_files || []).slice().sort((a: any, b: any) =>
      new Date(b.uploaded_at || 0).getTime() - new Date(a.uploaded_at || 0).getTime()
    );
    const latestResume = sortedResumes[0];

    const sizeFormatted = latestResume
      ? Number(latestResume.file_size) >= 1024 * 1024
        ? `${(Number(latestResume.file_size) / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(Number(latestResume.file_size) / 1024)} KB`
      : undefined;

    return {
      id: sp.id,
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
      resumeFileId: latestResume?.id,
      resumeFileName: latestResume?.original_filename,
      resumeStoragePath: latestResume?.storage_path,
      resumeFileSize: sizeFormatted,
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

  async uploadResume(
    file: File,
    studentProfileId: string,
    userId: string
  ): Promise<{
    success: boolean;
    storagePath?: string;
    originalFilename?: string;
    fileSize?: string;
    uploadedAt?: string;
    error?: string;
  }> {
    if (!isSupabaseConfigured()) {
      const sizeFormatted = file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;
      return {
        success: true,
        storagePath: `${userId}/${file.name}`,
        originalFilename: file.name,
        fileSize: sizeFormatted,
        uploadedAt: new Date().toISOString(),
      };
    }

    // Validate PDF
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return { success: false, error: 'Only PDF documents are accepted.' };
    }

    // Max 10 MB
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'File size exceeds maximum limit of 10 MB.' };
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
      content_type: file.type || 'application/pdf',
      file_size: file.size,
    });

    const sizeFormatted = file.size >= 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    return {
      success: true,
      storagePath,
      originalFilename: file.name,
      fileSize: sizeFormatted,
      uploadedAt: new Date().toISOString(),
    };
  },

  async deleteResume(studentProfileId: string, storagePath?: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    try {
      if (storagePath) {
        await supabase.storage.from('resumes').remove([storagePath]);
      }
      await supabase.from('resume_files').delete().eq('student_id', studentProfileId);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async getResumeSignedUrl(storagePath: string): Promise<string | null> {
    if (!isSupabaseConfigured() || !storagePath) {
      return 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    }

    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUrl(storagePath, 3600); // 1-hour signed URL

    if (error || !data?.signedUrl) {
      const { data: pubData } = supabase.storage.from('resumes').getPublicUrl(storagePath);
      return pubData?.publicUrl || null;
    }
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

// ==============================================================================
// 8. Opportunity Watchlist Service (Phase 7)
// ==============================================================================
export const watchlistService = {
  getLocalKey(userId?: string): string {
    return `campusflow_watchlist_${userId || 'guest'}`;
  },

  getLocalWatchlist(userId?: string): string[] {
    try {
      const stored = localStorage.getItem(this.getLocalKey(userId));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setLocalWatchlist(userId: string | undefined, list: string[]): void {
    try {
      localStorage.setItem(this.getLocalKey(userId), JSON.stringify(list));
    } catch {
      // ignore
    }
  },

  async fetchWatchlist(studentProfileId?: string, userId?: string): Promise<string[]> {
    if (!isSupabaseConfigured() || !studentProfileId) {
      return this.getLocalWatchlist(userId);
    }

    try {
      const { data, error } = await (supabase as any)
        .from('student_watchlists')
        .select('job_id')
        .eq('student_id', studentProfileId);

      if (error) {
        return this.getLocalWatchlist(userId);
      }

      const ids = (data || []).map((row: any) => row.job_id);
      this.setLocalWatchlist(userId, ids);
      return ids;
    } catch {
      return this.getLocalWatchlist(userId);
    }
  },

  async toggleWatchlist(jobId: string, studentProfileId?: string, userId?: string): Promise<{ isWatchlisted: boolean }> {
    const current = this.getLocalWatchlist(userId);
    const exists = current.includes(jobId);
    let updated: string[];

    if (exists) {
      updated = current.filter((id) => id !== jobId);
      this.setLocalWatchlist(userId, updated);
      if (isSupabaseConfigured() && studentProfileId) {
        try {
          await (supabase as any)
            .from('student_watchlists')
            .delete()
            .match({ student_id: studentProfileId, job_id: jobId });
        } catch {
          // fallback smoothly
        }
      }
      return { isWatchlisted: false };
    } else {
      updated = [...current, jobId];
      this.setLocalWatchlist(userId, updated);
      if (isSupabaseConfigured() && studentProfileId) {
        try {
          await (supabase as any)
            .from('student_watchlists')
            .insert({ student_id: studentProfileId, job_id: jobId });
        } catch {
          // fallback smoothly
        }
      }
      return { isWatchlisted: true };
    }
  },
};

// ==============================================================================
// 9. Calendar Export Service (Phase 8 — Standard .ics Generation)
// ==============================================================================
export const calendarExportService = {
  downloadInterviewIcs(interview: {
    round: string;
    jobTitle: string;
    companyName: string;
    dateTime: string;
    locationOrLink: string;
    notes?: string;
  }): void {
    const startDate = new Date(interview.dateTime);
    const endDate = new Date(startDate.getTime() + 45 * 60 * 1000); // 45 min default duration

    const pad = (n: number) => (n < 10 ? '0' + n : `${n}`);
    const formatIcsTime = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

    const summary = `${interview.round} — ${interview.companyName} (${interview.jobTitle})`;
    const description = `CampusFlow Verified Interview Round\\nRole: ${interview.jobTitle}\\nCompany: ${interview.companyName}\\nLocation/Link: ${interview.locationOrLink}\\n\\nNotes: ${interview.notes || 'Please be online 5 minutes before the scheduled time.'}`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CampusFlow//Recruitment Intelligence//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:campusflow_${Date.now()}@campusflow.io`,
      `DTSTAMP:${formatIcsTime(new Date())}`,
      `DTSTART:${formatIcsTime(startDate)}`,
      `DTEND:${formatIcsTime(endDate)}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${interview.locationOrLink}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `interview_${interview.companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};

// ==============================================================================
// 10. Company Directory Service
// ==============================================================================
export const companyService = {
  async fetchCompanies(): Promise<Array<{ id: string; name: string; industry?: string; logo_path?: string | null }>> {
    if (!isSupabaseConfigured()) {
      return [
        { id: '22222222-2222-4222-a222-222222222222', name: 'NovaTech Systems', industry: 'Enterprise Software' },
        { id: '33333333-3333-4333-a333-333333333333', name: 'Nexus Data Cloud', industry: 'Cloud & AI' },
        { id: '44444444-4444-4444-a444-444444444444', name: 'Quantum Leap Labs', industry: 'DeepTech' },
      ];
    }
    const { data, error } = await supabase.from('companies').select('id, name, industry, logo_path').order('name');
    if (error || !data || data.length === 0) {
      return [
        { id: '22222222-2222-4222-a222-222222222222', name: 'NovaTech Systems', industry: 'Enterprise Software' },
        { id: '33333333-3333-4333-a333-333333333333', name: 'Nexus Data Cloud', industry: 'Cloud & AI' },
        { id: '44444444-4444-4444-a444-444444444444', name: 'Quantum Leap Labs', industry: 'DeepTech' },
      ];
    }
    return data;
  },
};

// ==============================================================================
// 11. Resume Intelligence Types & Service (Groq AI)
// ==============================================================================
export interface SkillItem {
  name: string;
  category: string;
  evidence?: string;
  is_explicit: boolean;
}

export interface CareerMatch {
  role_title: string;
  fit_percentage: number;
  reasoning: string;
  missing_competencies: string[];
  recommended_action: string;
}

export interface SkillGap {
  missing_skill: string;
  importance: 'Critical' | 'Beneficial' | 'Nice to have';
  relevant_roles: string[];
  recommendation: string;
}

export interface JobSuitabilityMatch {
  job_id: string;
  title: string;
  company_name: string;
  location: string;
  suitability_score: number;
  matching_skills: string[];
  missing_skills: string[];
  reasoning: string;
  academic_eligibility: {
    eligible: boolean;
    cgpa_met: boolean;
    branch_met: boolean;
    backlogs_met: boolean;
    cgpa_cutoff: number;
    student_cgpa: number;
    reason: string;
  };
}

export interface ResumeAnalysisResult {
  analysisId: string;
  studentId: string;
  model: string;
  extractedSkills: SkillItem[];
  careerMatches: CareerMatch[];
  matchedJobs: JobSuitabilityMatch[];
  skillGaps: SkillGap[];
  totalExtractedSkills: number;
  summary: string;
  cached?: boolean;
  analyzedAt: string;
}

export const resumeIntelligenceService = {
  async getAuthToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  },

  async analyzeResume(params: {
    resumeFileId?: string;
    storagePath?: string;
    pdfBase64?: string;
    consent: boolean;
    forceReanalyze?: boolean;
  }): Promise<{ success: boolean; data?: ResumeAnalysisResult; error?: string }> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return { success: false, error: 'Authentication required. Please sign in to analyze your resume.' };
      }

      // In production against Supabase directly without custom proxy, prefer supabase.functions.invoke()
      if (!import.meta.env.VITE_API_URL && !import.meta.env.DEV && isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase.functions.invoke('analyze-resume', {
            body: params,
          });
          if (!error && data && data.success) {
            return { success: true, data };
          }
          if (error) {
            console.warn('supabase.functions.invoke notice, falling back to direct URL fetch:', error);
          }
        } catch (invokeErr: any) {
          console.warn('supabase.functions.invoke exception, falling back to direct URL fetch:', invokeErr.message);
        }
      }

      const res = await fetch(getFunctionsApiUrl('analyze-resume'), {
        method: 'POST',
        headers: getFunctionHeaders(token),
        body: JSON.stringify(params),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || 'Failed to analyze resume' };
      }

      return { success: true, data: json };
    } catch (err: any) {
      console.error('Error invoking resume intelligence:', err);
      return { success: false, error: err.message || 'Network error communicating with Groq Resume Intelligence' };
    }
  },

  async getStoredAnalysis(studentId?: string): Promise<ResumeAnalysisResult | null> {
    try {
      const token = await this.getAuthToken();
      if (token) {
        const res = await fetch(getFunctionsApiUrl('analyze-resume'), {
          headers: getFunctionHeaders(token),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.analysisStatus === 'completed') {
            return {
              analysisId: json.analysisId,
              studentId: json.studentId,
              model: json.model || 'openai/gpt-oss-120b',
              extractedSkills: json.extractedSkills || [],
              careerMatches: json.careerMatches || [],
              matchedJobs: json.matchedJobs || [],
              skillGaps: json.skillGaps || [],
              totalExtractedSkills: json.totalExtractedSkills || (json.extractedSkills || []).length,
              summary: json.summary || '',
              cached: true,
              analyzedAt: json.analyzedAt,
            };
          }
        }
      }

      // Fallback check in Supabase resume_analyses
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await (supabase as any)
        .from('resume_analyses')
        .select('*')
        .eq('student_id', studentId || user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && data.structured_analysis) {
        const sa = data.structured_analysis;
        const skills = sa.extracted_skills || sa.skills || [];
        const roles = sa.recommended_roles || sa.career_matches || [];
        const gaps = sa.skill_gaps || [];
        const summary = sa.resume_summary || sa.summary || '';

        return {
          analysisId: data.id,
          studentId: data.student_id,
          model: data.model_name || 'openai/gpt-oss-120b',
          extractedSkills: skills,
          careerMatches: roles,
          matchedJobs: data.matched_jobs || [],
          skillGaps: gaps,
          totalExtractedSkills: skills.length,
          summary: summary,
          cached: true,
          analyzedAt: data.completed_at || data.created_at,
        };
      }
    } catch {
      // Graceful fallback
    }
    return null;
  },

  async deleteStoredAnalysis(analysisId: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('resume_analyses')
        .delete()
        .eq('id', analysisId);
      return !error;
    } catch {
      return false;
    }
  },
};

// ==============================================================================
// 12. Recruiter Access Management Service
// ==============================================================================
export interface ManagedRecruiter {
  id: string;
  email: string;
  fullName: string;
  companyId: string;
  companyName: string;
  designation: string;
  status: 'active' | 'pending' | 'invited' | 'accepted';
  createdAt: string;
  acceptedAt?: string;
}

export const recruiterManagementService = {
  async getAuthToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  },

  async listRecruiters(): Promise<{ success: boolean; recruiters: ManagedRecruiter[]; error?: string }> {
    try {
      const token = await this.getAuthToken();
      if (!token) return { success: false, recruiters: [], error: 'Authentication required' };

      if (!import.meta.env.VITE_API_URL && !import.meta.env.DEV && isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase.functions.invoke('manage-recruiter', {
            body: { action: 'list' },
          });
          if (!error && data && data.success) {
            return { success: true, recruiters: data.recruiters || [] };
          }
        } catch {}
      }

      const res = await fetch(getFunctionsApiUrl('manage-recruiter'), {
        method: 'POST',
        headers: getFunctionHeaders(token),
        body: JSON.stringify({ action: 'list' }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, recruiters: [], error: json.error || 'Failed to fetch recruiters' };
      }

      return { success: true, recruiters: json.recruiters || [] };
    } catch (err: any) {
      console.error('Error fetching recruiters:', err);
      return { success: false, recruiters: [], error: err.message };
    }
  },

  async inviteRecruiter(payload: {
    email: string;
    fullName: string;
    companyId: string;
    companyName?: string;
    designation: string;
  }): Promise<{ success: boolean; recruiter?: ManagedRecruiter; message?: string; error?: string }> {
    try {
      const token = await this.getAuthToken();
      if (!token) return { success: false, error: 'Authentication required' };

      if (!import.meta.env.VITE_API_URL && !import.meta.env.DEV && isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase.functions.invoke('manage-recruiter', {
            body: { action: 'invite', ...payload },
          });
          if (!error && data && data.success) {
            return { success: true, recruiter: data.recruiter, message: data.message };
          }
        } catch {}
      }

      const res = await fetch(getFunctionsApiUrl('manage-recruiter'), {
        method: 'POST',
        headers: getFunctionHeaders(token),
        body: JSON.stringify({ action: 'invite', ...payload }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || 'Failed to provision recruiter' };
      }

      return { success: true, recruiter: json.recruiter, message: json.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async resendInvitation(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const token = await this.getAuthToken();
      if (!token) return { success: false, error: 'Authentication required' };

      const res = await fetch(getFunctionsApiUrl('manage-recruiter'), {
        method: 'POST',
        headers: getFunctionHeaders(token),
        body: JSON.stringify({ action: 'resend', email }),
      });

      const json = await res.json();
      return { success: res.ok && json.success, message: json.message, error: json.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async revokeRecruiter(recruiterUserId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const token = await this.getAuthToken();
      if (!token) return { success: false, error: 'Authentication required' };

      const res = await fetch(getFunctionsApiUrl('manage-recruiter'), {
        method: 'POST',
        headers: getFunctionHeaders(token),
        body: JSON.stringify({ action: 'revoke', recruiterUserId }),
      });

      const json = await res.json();
      return { success: res.ok && json.success, message: json.message, error: json.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
