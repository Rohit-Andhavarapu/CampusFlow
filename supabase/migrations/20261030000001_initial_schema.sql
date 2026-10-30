-- ==============================================================================
-- CampusFlow V4 - Supabase Schema Migration: 001_initial_schema.sql
-- Problem Statement: HACK-P410 (Campus Recruitment Portal)
-- ==============================================================================

-- ==============================================================================
-- 1. EXTENSIONS
-- ==============================================================================
do $$ begin
  create extension if not exists "uuid-ossp";
exception
  when others then null;
end $$;

do $$ begin
  create extension if not exists "pgcrypto";
exception
  when others then null;
end $$;


-- ==============================================================================
-- 2. ENUMS & DOMAIN TYPES
-- ==============================================================================
do $$ begin
  create type user_role_type as enum ('student', 'recruiter', 'placement_admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type company_status_type as enum ('active', 'inactive', 'pending');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type drive_status_type as enum ('draft', 'active', 'completed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type employment_type_enum as enum ('Internship', 'Full-time', 'Contract');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type work_mode_enum as enum ('Remote', 'On-site', 'Hybrid');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type compensation_period_enum as enum ('annual', 'monthly', 'hourly');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type job_status_type as enum ('draft', 'active', 'closed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type application_status_type as enum (
    'submitted',
    'shortlisted',
    'interview',
    'selected',
    'rejected',
    'withdrawn'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type interview_mode_type as enum ('Virtual', 'In-Person');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type interview_status_type as enum ('scheduled', 'completed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type notification_category_type as enum ('application', 'interview', 'drive', 'system');
exception
  when duplicate_object then null;
end $$;


-- ==============================================================================
-- 3. TABLES (14 NORMALIZED RELATIONAL ENTITIES)
-- ==============================================================================

-- 1. Profiles Table (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role user_role_type not null default 'student',
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Student Profiles Table
create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade unique,
  full_name text not null,
  email text not null unique,
  roll_number text not null unique,
  course text not null default 'B.Tech',
  branch text not null,
  graduation_year integer not null check (graduation_year >= 2020 and graduation_year <= 2035),
  cgpa numeric(4, 2) not null check (cgpa >= 0.00 and cgpa <= 10.00),
  active_backlogs integer not null default 0 check (active_backlogs >= 0),
  phone text,
  bio text,
  github_url text,
  linkedin_url text,
  portfolio_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Student Skills Table
create table if not exists public.student_skills (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  skill_name text not null,
  unique (student_id, skill_name)
);

-- 4. Student Projects Table
create table if not exists public.student_projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  project_url text,
  technologies text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 5. Companies Table
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  industry text not null,
  description text,
  website text,
  logo_path text,
  status company_status_type not null default 'active',
  created_at timestamptz not null default now()
);

-- 6. Recruiter Company Memberships Table
create table if not exists public.recruiter_company_memberships (
  id uuid primary key default gen_random_uuid(),
  recruiter_user_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  membership_role text not null default 'recruiter',
  approved_at timestamptz default now(),
  unique (recruiter_user_id, company_id)
);

-- 7. Recruitment Drives Table
create table if not exists public.recruitment_drives (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  description text,
  start_date timestamptz not null,
  end_date timestamptz not null check (end_date >= start_date),
  status drive_status_type not null default 'active',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 8. Job Postings Table
create table if not exists public.job_postings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  drive_id uuid references public.recruitment_drives(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null,
  responsibilities text[] not null default '{}',
  employment_type employment_type_enum not null,
  work_mode work_mode_enum not null,
  location text not null,
  compensation_min numeric(12, 2) not null check (compensation_min >= 0),
  compensation_max numeric(12, 2) not null check (compensation_max >= compensation_min),
  compensation_period compensation_period_enum not null default 'annual',
  currency text not null default 'INR',
  openings integer not null default 1 check (openings > 0),
  deadline timestamptz not null,
  status job_status_type not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. Job Eligibility Rules Table
create table if not exists public.job_eligibility_rules (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.job_postings(id) on delete cascade unique,
  minimum_cgpa numeric(4, 2) not null default 0.00 check (minimum_cgpa >= 0.00 and minimum_cgpa <= 10.00),
  maximum_backlogs integer not null default 0 check (maximum_backlogs >= 0),
  allowed_branches text[] not null default '{}',
  allowed_graduation_years integer[] not null default '{}',
  required_skills text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 10. Applications Table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  job_id uuid not null references public.job_postings(id) on delete cascade,
  status application_status_type not null default 'submitted',
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  unique (student_id, job_id)
);

-- 11. Application Status History Table (Audit Trail)
create table if not exists public.application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  previous_status application_status_type,
  new_status application_status_type not null,
  changed_by uuid references public.profiles(id) on delete set null,
  change_reason text,
  changed_at timestamptz not null default now()
);

-- 12. Interviews Table
create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  scheduled_by uuid references public.profiles(id) on delete set null,
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 45 check (duration_minutes > 0),
  mode interview_mode_type not null default 'Virtual',
  location text,
  meeting_url text,
  round text not null default 'Technical Round',
  status interview_status_type not null default 'scheduled',
  feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 13. Notifications Table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  category notification_category_type not null,
  related_entity_id text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 14. Resume Files Metadata Table
create table if not exists public.resume_files (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  storage_path text not null unique,
  original_filename text not null,
  content_type text not null default 'application/pdf',
  file_size bigint not null check (file_size > 0),
  uploaded_at timestamptz not null default now()
);


-- ==============================================================================
-- 4. CONSTRAINTS & INDEXES
-- ==============================================================================
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_student_profiles_user on public.student_profiles(user_id);
create index if not exists idx_student_profiles_branch on public.student_profiles(branch);
create index if not exists idx_student_profiles_cgpa on public.student_profiles(cgpa);
create index if not exists idx_student_skills_student on public.student_skills(student_id);
create index if not exists idx_student_projects_student on public.student_projects(student_id);
create index if not exists idx_companies_status on public.companies(status);
create index if not exists idx_recruiter_memberships_recruiter on public.recruiter_company_memberships(recruiter_user_id);
create index if not exists idx_recruiter_memberships_company on public.recruiter_company_memberships(company_id);
create index if not exists idx_drives_company on public.recruitment_drives(company_id);
create index if not exists idx_jobs_company on public.job_postings(company_id);
create index if not exists idx_jobs_status on public.job_postings(status);
create index if not exists idx_jobs_deadline on public.job_postings(deadline);
create index if not exists idx_applications_student on public.applications(student_id);
create index if not exists idx_applications_job on public.applications(job_id);
create index if not exists idx_applications_status on public.applications(status);
create index if not exists idx_app_history_app on public.application_status_history(application_id);
create index if not exists idx_interviews_application on public.interviews(application_id);
create index if not exists idx_interviews_scheduled on public.interviews(scheduled_at);
create index if not exists idx_notifications_user_read on public.notifications(user_id, is_read);
create index if not exists idx_resumes_student on public.resume_files(student_id);
