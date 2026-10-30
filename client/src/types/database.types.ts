export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'student' | 'recruiter' | 'placement_admin';
export type CompanyStatus = 'active' | 'inactive' | 'pending';
export type DriveStatus = 'draft' | 'active' | 'completed' | 'cancelled';
export type EmploymentType = 'Internship' | 'Full-time' | 'Contract';
export type WorkMode = 'Remote' | 'On-site' | 'Hybrid';
export type CompensationPeriod = 'annual' | 'monthly' | 'hourly';
export type JobStatus = 'draft' | 'active' | 'closed';
export type ApplicationStatus =
  | 'submitted'
  | 'shortlisted'
  | 'interview'
  | 'selected'
  | 'rejected'
  | 'withdrawn';
export type InterviewMode = 'Virtual' | 'In-Person';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled';
export type NotificationCategory = 'application' | 'interview' | 'drive' | 'system';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: UserRole;
          avatar_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role?: UserRole;
          avatar_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: UserRole;
          avatar_path?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_profiles: {
        Row: {
          id: string;
          user_id: string;
          roll_number: string;
          course: string;
          branch: string;
          graduation_year: number;
          cgpa: number;
          active_backlogs: number;
          phone: string | null;
          bio: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          portfolio_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          roll_number: string;
          course?: string;
          branch: string;
          graduation_year: number;
          cgpa: number;
          active_backlogs?: number;
          phone?: string | null;
          bio?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          roll_number?: string;
          course?: string;
          branch?: string;
          graduation_year?: number;
          cgpa?: number;
          active_backlogs?: number;
          phone?: string | null;
          bio?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "student_profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      student_skills: {
        Row: {
          id: string;
          student_id: string;
          skill_name: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          skill_name: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          skill_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "student_skills_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "student_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      student_projects: {
        Row: {
          id: string;
          student_id: string;
          title: string;
          description: string;
          project_url: string | null;
          technologies: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          title: string;
          description: string;
          project_url?: string | null;
          technologies?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          title?: string;
          description?: string;
          project_url?: string | null;
          technologies?: string[];
        };
        Relationships: [
          {
            foreignKeyName: "student_projects_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "student_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      companies: {
        Row: {
          id: string;
          name: string;
          industry: string;
          description: string | null;
          website: string | null;
          logo_path: string | null;
          status: CompanyStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          industry: string;
          description?: string | null;
          website?: string | null;
          logo_path?: string | null;
          status?: CompanyStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          industry?: string;
          description?: string | null;
          website?: string | null;
          logo_path?: string | null;
          status?: CompanyStatus;
        };
        Relationships: [];
      };
      recruiter_company_memberships: {
        Row: {
          id: string;
          recruiter_user_id: string;
          company_id: string;
          membership_role: string;
          approved_at: string | null;
        };
        Insert: {
          id?: string;
          recruiter_user_id: string;
          company_id: string;
          membership_role?: string;
          approved_at?: string | null;
        };
        Update: {
          id?: string;
          recruiter_user_id?: string;
          company_id?: string;
          membership_role?: string;
          approved_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "recruiter_company_memberships_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recruiter_company_memberships_recruiter_user_id_fkey";
            columns: ["recruiter_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      recruitment_drives: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string;
          status: DriveStatus;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          status?: DriveStatus;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          title?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          status?: DriveStatus;
          created_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "recruitment_drives_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      job_postings: {
        Row: {
          id: string;
          company_id: string;
          drive_id: string | null;
          created_by: string | null;
          title: string;
          description: string;
          responsibilities: string[];
          employment_type: EmploymentType;
          work_mode: WorkMode;
          location: string;
          compensation_min: number;
          compensation_max: number;
          compensation_period: CompensationPeriod;
          currency: string;
          openings: number;
          deadline: string;
          status: JobStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          drive_id?: string | null;
          created_by?: string | null;
          title: string;
          description: string;
          responsibilities?: string[];
          employment_type: EmploymentType;
          work_mode: WorkMode;
          location: string;
          compensation_min: number;
          compensation_max: number;
          compensation_period?: CompensationPeriod;
          currency?: string;
          openings?: number;
          deadline: string;
          status?: JobStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          drive_id?: string | null;
          created_by?: string | null;
          title?: string;
          description?: string;
          responsibilities?: string[];
          employment_type?: EmploymentType;
          work_mode?: WorkMode;
          location?: string;
          compensation_min?: number;
          compensation_max?: number;
          compensation_period?: CompensationPeriod;
          currency?: string;
          openings?: number;
          deadline?: string;
          status?: JobStatus;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "job_postings_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      job_eligibility_rules: {
        Row: {
          id: string;
          job_id: string;
          minimum_cgpa: number;
          maximum_backlogs: number;
          allowed_branches: string[];
          allowed_graduation_years: number[];
          required_skills: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          minimum_cgpa?: number;
          maximum_backlogs?: number;
          allowed_branches?: string[];
          allowed_graduation_years?: number[];
          required_skills?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          minimum_cgpa?: number;
          maximum_backlogs?: number;
          allowed_branches?: string[];
          allowed_graduation_years?: number[];
          required_skills?: string[];
        };
        Relationships: [
          {
            foreignKeyName: "job_eligibility_rules_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: true;
            referencedRelation: "job_postings";
            referencedColumns: ["id"];
          }
        ];
      };
      applications: {
        Row: {
          id: string;
          student_id: string;
          job_id: string;
          status: ApplicationStatus;
          applied_at: string;
          updated_at: string;
          withdrawn_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          job_id: string;
          status?: ApplicationStatus;
          applied_at?: string;
          updated_at?: string;
          withdrawn_at?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string;
          job_id?: string;
          status?: ApplicationStatus;
          updated_at?: string;
          withdrawn_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "job_postings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "student_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      application_status_history: {
        Row: {
          id: string;
          application_id: string;
          previous_status: ApplicationStatus | null;
          new_status: ApplicationStatus;
          changed_by: string | null;
          change_reason: string | null;
          changed_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          previous_status?: ApplicationStatus | null;
          new_status: ApplicationStatus;
          changed_by?: string | null;
          change_reason?: string | null;
          changed_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          previous_status?: ApplicationStatus | null;
          new_status?: ApplicationStatus;
          changed_by?: string | null;
          change_reason?: string | null;
          changed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          }
        ];
      };
      interviews: {
        Row: {
          id: string;
          application_id: string;
          scheduled_by: string | null;
          scheduled_at: string;
          duration_minutes: number;
          mode: InterviewMode;
          location: string | null;
          meeting_url: string | null;
          round: string;
          status: InterviewStatus;
          feedback: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          scheduled_by?: string | null;
          scheduled_at: string;
          duration_minutes?: number;
          mode?: InterviewMode;
          location?: string | null;
          meeting_url?: string | null;
          round?: string;
          status?: InterviewStatus;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          scheduled_by?: string | null;
          scheduled_at?: string;
          duration_minutes?: number;
          mode?: InterviewMode;
          location?: string | null;
          meeting_url?: string | null;
          round?: string;
          status?: InterviewStatus;
          feedback?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          category: NotificationCategory;
          related_entity_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          category: NotificationCategory;
          related_entity_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          body?: string;
          category?: NotificationCategory;
          related_entity_id?: string | null;
          is_read?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      resume_files: {
        Row: {
          id: string;
          student_id: string;
          storage_path: string;
          original_filename: string;
          content_type: string;
          file_size: number;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          storage_path: string;
          original_filename: string;
          content_type?: string;
          file_size: number;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          storage_path?: string;
          original_filename?: string;
          content_type?: string;
          file_size?: number;
        };
        Relationships: [
          {
            foreignKeyName: "resume_files_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "student_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      evaluate_job_eligibility: {
        Args: {
          p_job_id: string;
          p_student_id: string;
        };
        Returns: {
          is_eligible: boolean;
          is_incomplete: boolean;
          reasons: string[];
          criteria: Array<{
            id: string;
            label: string;
            requiredValue: string;
            studentValue: string;
            passed: boolean;
            missingData?: boolean;
          }>;
        };
      };
      submit_application: {
        Args: {
          p_job_id: string;
        };
        Returns: {
          success: boolean;
          application_id?: string;
          message: string;
          eligibility?: Json;
        };
      };
      update_application_status: {
        Args: {
          p_application_id: string;
          p_new_status: ApplicationStatus;
          p_reason?: string;
        };
        Returns: {
          success: boolean;
          previous_status?: ApplicationStatus;
          new_status?: ApplicationStatus;
          message: string;
        };
      };
      withdraw_application: {
        Args: {
          p_application_id: string;
        };
        Returns: {
          success: boolean;
          message: string;
        };
      };
      schedule_interview: {
        Args: {
          p_application_id: string;
          p_scheduled_at: string;
          p_duration_minutes?: number;
          p_mode?: InterviewMode;
          p_location?: string;
          p_meeting_url?: string;
          p_round?: string;
          p_notes?: string;
        };
        Returns: {
          success: boolean;
          interview_id?: string;
          message: string;
        };
      };
      get_placement_analytics: {
        Args: Record<PropertyKey, never>;
        Returns: {
          total_students: number;
          placed_students: number;
          in_process_students: number;
          unplaced_students: number;
          placement_rate: number;
          active_drives: number;
          partner_companies: number;
          department_stats: Array<{
            name: string;
            total: number;
            placed: number;
            rate: number;
          }>;
        };
      };
    };
    Enums: {
      user_role_type: UserRole;
      company_status_type: CompanyStatus;
      drive_status_type: DriveStatus;
      employment_type_enum: EmploymentType;
      work_mode_enum: WorkMode;
      compensation_period_enum: CompensationPeriod;
      job_status_type: JobStatus;
      application_status_type: ApplicationStatus;
      interview_mode_type: InterviewMode;
      interview_status_type: InterviewStatus;
      notification_category_type: NotificationCategory;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
