-- ==============================================================================
-- CampusFlow V4 — Supabase Schema Migration: 001_initial_schema.sql
-- Problem Statement: HACK-P410 (Campus Recruitment Portal)
-- ==============================================================================

-- 1. Enable Required PostgreSQL Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. Custom Domain Types / Enums
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

-- 3. Profiles Table (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role user_role_type not null default 'student',
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index on email & role for quick identity and authorization lookups
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_email on public.profiles(email);

-- 4. Student Profiles Table
create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  roll_number text not null unique,
  course text not null default 'B.Tech',
  branch text not null,
  graduation_year integer not null check (graduation_year >= 2020 and graduation_year <= 2035),
  cgpa numeric(3, 2) not null check (cgpa >= 0.00 and cgpa <= 10.00),
  active_backlogs integer not null default 0 check (active_backlogs >= 0),
  phone text,
  bio text,
  github_url text,
  linkedin_url text,
  portfolio_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_student_profiles_user_id on public.student_profiles(user_id);
create index if not exists idx_student_profiles_branch on public.student_profiles(branch);
create index if not exists idx_student_profiles_cgpa on public.student_profiles(cgpa);
create index if not exists idx_student_profiles_grad_year on public.student_profiles(graduation_year);

-- 5. Student Skills Table
create table if not exists public.student_skills (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  skill_name text not null,
  unique (student_id, skill_name)
);

create index if not exists idx_student_skills_student on public.student_skills(student_id);
create index if not exists idx_student_skills_name on public.student_skills(lower(skill_name));

-- 6. Student Projects Table
create table if not exists public.student_projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  project_url text,
  technologies text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_student_projects_student on public.student_projects(student_id);

-- 7. Companies Table
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

create index if not exists idx_companies_status on public.companies(status);

-- 8. Recruiter Company Memberships Table
create table if not exists public.recruiter_company_memberships (
  id uuid primary key default gen_random_uuid(),
  recruiter_user_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  membership_role text not null default 'recruiter',
  approved_at timestamptz default now(),
  unique (recruiter_user_id, company_id)
);

create index if not exists idx_recruiter_memberships_recruiter on public.recruiter_company_memberships(recruiter_user_id);
create index if not exists idx_recruiter_memberships_company on public.recruiter_company_memberships(company_id);

-- 9. Recruitment Drives Table
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

create index if not exists idx_drives_company on public.recruitment_drives(company_id);
create index if not exists idx_drives_status on public.recruitment_drives(status);

-- 10. Job Postings Table
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

create index if not exists idx_jobs_company on public.job_postings(company_id);
create index if not exists idx_jobs_status on public.job_postings(status);
create index if not exists idx_jobs_deadline on public.job_postings(deadline);

-- 11. Job Eligibility Rules Table
create table if not exists public.job_eligibility_rules (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.job_postings(id) on delete cascade unique,
  minimum_cgpa numeric(3, 2) not null default 0.00 check (minimum_cgpa >= 0.00 and minimum_cgpa <= 10.00),
  maximum_backlogs integer not null default 0 check (maximum_backlogs >= 0),
  allowed_branches text[] not null default '{}',
  allowed_graduation_years integer[] not null default '{}',
  required_skills text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_eligibility_job on public.job_eligibility_rules(job_id);

-- 12. Applications Table
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

create index if not exists idx_applications_student on public.applications(student_id);
create index if not exists idx_applications_job on public.applications(job_id);
create index if not exists idx_applications_status on public.applications(status);

-- 13. Application Status History Table (Audit Trail)
create table if not exists public.application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  previous_status application_status_type,
  new_status application_status_type not null,
  changed_by uuid references public.profiles(id) on delete set null,
  change_reason text,
  changed_at timestamptz not null default now()
);

create index if not exists idx_app_history_app on public.application_status_history(application_id);

-- 14. Interviews Table
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

create index if not exists idx_interviews_application on public.interviews(application_id);
create index if not exists idx_interviews_scheduled_at on public.interviews(scheduled_at);

-- 15. Notifications Table
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

create index if not exists idx_notifications_user on public.notifications(user_id, is_read);

-- 16. Resume Files Metadata Table
create table if not exists public.resume_files (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  storage_path text not null unique,
  original_filename text not null,
  content_type text not null default 'application/pdf',
  file_size bigint not null check (file_size > 0),
  uploaded_at timestamptz not null default now()
);

create index if not exists idx_resumes_student on public.resume_files(student_id);

-- 17. Storage Bucket Initialization
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  5242880, -- 5 MB limit
  array['application/pdf']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['application/pdf'];

-- 18. Updated_At Auto-Trigger Helper Function
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create or replace trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace trigger trg_student_profiles_updated_at
  before update on public.student_profiles
  for each row execute function public.set_updated_at();

create or replace trigger trg_job_postings_updated_at
  before update on public.job_postings
  for each row execute function public.set_updated_at();

create or replace trigger trg_applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

create or replace trigger trg_interviews_updated_at
  before update on public.interviews
  for each row execute function public.set_updated_at();
-- ==============================================================================
-- CampusFlow V4 — Supabase Migration: 002_row_level_security.sql
-- Non-Negotiable Multi-Role RLS Policies (Student, Recruiter, Admin)
-- ==============================================================================

-- 1. Helper Functions (Security Definer to prevent recursive RLS)
create or replace function public.current_user_role()
returns user_role_type as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable security definer set search_path = public;

create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select role = 'placement_admin' from public.profiles where id = auth.uid()),
    false
  );
$$ language sql stable security definer set search_path = public;

create or replace function public.get_student_profile_id()
returns uuid as $$
  select id from public.student_profiles where user_id = auth.uid();
$$ language sql stable security definer set search_path = public;

create or replace function public.is_recruiter_for_company(p_company_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.recruiter_company_memberships
    where recruiter_user_id = auth.uid()
      and company_id = p_company_id
      and approved_at is not null
  );
$$ language sql stable security definer set search_path = public;

create or replace function public.is_recruiter_for_job(p_job_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.job_postings j
    join public.recruiter_company_memberships m on m.company_id = j.company_id
    where j.id = p_job_id
      and m.recruiter_user_id = auth.uid()
      and m.approved_at is not null
  );
$$ language sql stable security definer set search_path = public;

create or replace function public.is_recruiter_for_application(p_application_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.applications a
    join public.job_postings j on j.id = a.job_id
    join public.recruiter_company_memberships m on m.company_id = j.company_id
    where a.id = p_application_id
      and m.recruiter_user_id = auth.uid()
      and m.approved_at is not null
  );
$$ language sql stable security definer set search_path = public;

create or replace function public.is_recruiter_for_student_resume(p_student_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.applications a
    join public.job_postings j on j.id = a.job_id
    join public.recruiter_company_memberships m on m.company_id = j.company_id
    where a.student_id = p_student_id
      and m.recruiter_user_id = auth.uid()
      and m.approved_at is not null
  );
$$ language sql stable security definer set search_path = public;

-- 2. Enable RLS on All Tables
alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.student_skills enable row level security;
alter table public.student_projects enable row level security;
alter table public.companies enable row level security;
alter table public.recruiter_company_memberships enable row level security;
alter table public.recruitment_drives enable row level security;
alter table public.job_postings enable row level security;
alter table public.job_eligibility_rules enable row level security;
alter table public.applications enable row level security;
alter table public.application_status_history enable row level security;
alter table public.interviews enable row level security;
alter table public.notifications enable row level security;
alter table public.resume_files enable row level security;

-- ==============================================================================
-- 3. PROFILES POLICIES
-- ==============================================================================
create policy "Users can read own profile"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "Users can update own non-sensitive profile fields"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Placement admin can manage profiles
create policy "Admins can view and manage all profiles"
  on public.profiles for all
  using (public.is_admin());

-- ==============================================================================
-- 4. STUDENT PROFILES POLICIES
-- ==============================================================================
-- Students can read their own profile; Admins and authorized Recruiters can view student profiles
create policy "Students can view own student_profile"
  on public.student_profiles for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or public.is_recruiter_for_student_resume(id)
  );

create policy "Students can update own student_profile"
  on public.student_profiles for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Admins can manage student_profiles"
  on public.student_profiles for all
  using (public.is_admin());

-- ==============================================================================
-- 5. STUDENT SKILLS & PROJECTS POLICIES
-- ==============================================================================
create policy "View student skills"
  on public.student_skills for select
  using (
    student_id = public.get_student_profile_id()
    or public.is_admin()
    or public.is_recruiter_for_student_resume(student_id)
  );

create policy "Students manage own skills"
  on public.student_skills for all
  using (student_id = public.get_student_profile_id())
  with check (student_id = public.get_student_profile_id());

create policy "View student projects"
  on public.student_projects for select
  using (
    student_id = public.get_student_profile_id()
    or public.is_admin()
    or public.is_recruiter_for_student_resume(student_id)
  );

create policy "Students manage own projects"
  on public.student_projects for all
  using (student_id = public.get_student_profile_id())
  with check (student_id = public.get_student_profile_id());

-- ==============================================================================
-- 6. COMPANIES & MEMBERSHIPS POLICIES
-- ==============================================================================
create policy "Anyone authenticated can view active companies"
  on public.companies for select
  using (status = 'active' or public.is_admin() or public.is_recruiter_for_company(id));

create policy "Admins can manage companies"
  on public.companies for all
  using (public.is_admin());

create policy "Recruiters view own company memberships"
  on public.recruiter_company_memberships for select
  using (recruiter_user_id = auth.uid() or public.is_admin());

create policy "Admins manage recruiter company memberships"
  on public.recruiter_company_memberships for all
  using (public.is_admin());

-- ==============================================================================
-- 7. RECRUITMENT DRIVES POLICIES
-- ==============================================================================
create policy "Authenticated users view active drives"
  on public.recruitment_drives for select
  using (status = 'active' or public.is_admin() or public.is_recruiter_for_company(company_id));

create policy "Admins and authorized recruiters manage drives"
  on public.recruitment_drives for all
  using (public.is_admin() or public.is_recruiter_for_company(company_id));

-- ==============================================================================
-- 8. JOB POSTINGS & ELIGIBILITY RULES POLICIES
-- ==============================================================================
-- Students and public can view active job postings
create policy "View active job postings"
  on public.job_postings for select
  using (
    status = 'active'
    or public.is_admin()
    or public.is_recruiter_for_company(company_id)
  );

create policy "Recruiters can insert postings for their company"
  on public.job_postings for insert
  with check (public.is_admin() or public.is_recruiter_for_company(company_id));

create policy "Recruiters can update postings for their company"
  on public.job_postings for update
  using (public.is_admin() or public.is_recruiter_for_company(company_id))
  with check (public.is_admin() or public.is_recruiter_for_company(company_id));

create policy "Admins manage all job postings"
  on public.job_postings for all
  using (public.is_admin());

create policy "View job eligibility rules"
  on public.job_eligibility_rules for select
  using (
    exists (
      select 1 from public.job_postings j
      where j.id = job_id and (j.status = 'active' or public.is_admin() or public.is_recruiter_for_company(j.company_id))
    )
  );

create policy "Manage job eligibility rules"
  on public.job_eligibility_rules for all
  using (public.is_admin() or public.is_recruiter_for_job(job_id));

-- ==============================================================================
-- 9. APPLICATIONS POLICIES
-- ==============================================================================
-- Students see their own applications; Recruiters see applications for their jobs; Admins see all
create policy "View applications"
  on public.applications for select
  using (
    student_id = public.get_student_profile_id()
    or public.is_recruiter_for_job(job_id)
    or public.is_admin()
  );

-- Application submission is executed via trusted submit_application() RPC function,
-- but direct insert policy for own profile is also bounded by RLS
create policy "Students can submit own application"
  on public.applications for insert
  with check (student_id = public.get_student_profile_id());

create policy "Recruiters and Admins can update application status"
  on public.applications for update
  using (public.is_recruiter_for_job(job_id) or public.is_admin());

-- Students can withdraw their own application
create policy "Students can withdraw application"
  on public.applications for update
  using (student_id = public.get_student_profile_id())
  with check (student_id = public.get_student_profile_id() and status = 'withdrawn');

-- ==============================================================================
-- 10. APPLICATION STATUS HISTORY POLICIES
-- ==============================================================================
create policy "View application status history"
  on public.application_status_history for select
  using (
    exists (
      select 1 from public.applications a
      where a.id = application_id and (
        a.student_id = public.get_student_profile_id()
        or public.is_recruiter_for_job(a.job_id)
        or public.is_admin()
      )
    )
  );

-- Only trusted functions or authorized recruiters/admins insert history
create policy "Insert application status history"
  on public.application_status_history for insert
  with check (
    public.is_admin()
    or public.is_recruiter_for_application(application_id)
    or exists (
      select 1 from public.applications a
      where a.id = application_id and a.student_id = public.get_student_profile_id()
    )
  );

-- ==============================================================================
-- 11. INTERVIEWS POLICIES
-- ==============================================================================
create policy "View interviews"
  on public.interviews for select
  using (
    exists (
      select 1 from public.applications a
      where a.id = application_id and (
        a.student_id = public.get_student_profile_id()
        or public.is_recruiter_for_job(a.job_id)
        or public.is_admin()
      )
    )
  );

create policy "Recruiters and admins manage interviews"
  on public.interviews for all
  using (
    public.is_admin()
    or public.is_recruiter_for_application(application_id)
  );

-- ==============================================================================
-- 12. NOTIFICATIONS POLICIES
-- ==============================================================================
create policy "Users read and update own notifications"
  on public.notifications for select
  using (user_id = auth.uid() or public.is_admin());

create policy "Users mark own notifications as read"
  on public.notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ==============================================================================
-- 13. RESUME FILES & STORAGE POLICIES
-- ==============================================================================
create policy "View resume files metadata"
  on public.resume_files for select
  using (
    student_id = public.get_student_profile_id()
    or public.is_recruiter_for_student_resume(student_id)
    or public.is_admin()
  );

create policy "Students manage own resume files"
  on public.resume_files for all
  using (student_id = public.get_student_profile_id())
  with check (student_id = public.get_student_profile_id());

-- Storage Bucket RLS on storage.objects for 'resumes'
create policy "Students can upload own resume to storage"
  on storage.objects for insert
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Students can update/delete own resume in storage"
  on storage.objects for all
  using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Authorized users can read resume from storage"
  on storage.objects for select
  using (
    bucket_id = 'resumes'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
      or exists (
        select 1 from public.student_profiles sp
        where sp.user_id::text = (storage.foldername(name))[1]
          and public.is_recruiter_for_student_resume(sp.id)
      )
    )
  );
-- ==============================================================================
-- CampusFlow V4 — Supabase Migration: 003_functions_and_rpc.sql
-- Trusted PostgreSQL RPCs, Atomic Transactions, State Machine & Analytics
-- ==============================================================================

-- 1. Automatic Profile Provisioning on User Signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_role user_role_type;
  v_full_name text;
begin
  -- Extract role from user metadata, defaulting safely to 'student'
  v_role := coalesce(
    (new.raw_user_meta_data->>'role')::user_role_type,
    'student'::user_role_type
  );

  v_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, v_full_name, v_role)
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    updated_at = now();

  -- If user is student, also create initial student_profile record
  if v_role = 'student' then
    insert into public.student_profiles (
      user_id,
      roll_number,
      branch,
      graduation_year,
      cgpa,
      active_backlogs
    )
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'roll_number', 'N25H' || lpad((floor(random() * 900000 + 100000)::bigint)::text, 6, '0')),
      coalesce(new.raw_user_meta_data->>'branch', 'Computer Science & Engineering'),
      coalesce((new.raw_user_meta_data->>'graduation_year')::int, 2026),
      coalesce((new.raw_user_meta_data->>'cgpa')::numeric, 8.50),
      coalesce((new.raw_user_meta_data->>'active_backlogs')::int, 0)
    )
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Attach trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ==============================================================================
-- 2. Server-Side Eligibility Evaluation Engine
-- ==============================================================================
create or replace function public.evaluate_job_eligibility(
  p_job_id uuid,
  p_student_id uuid
)
returns jsonb as $$
declare
  v_rule record;
  v_student record;
  v_cgpa_passed boolean := true;
  v_backlogs_passed boolean := true;
  v_branch_passed boolean := true;
  v_year_passed boolean := true;
  v_skills_passed boolean := true;
  v_is_incomplete boolean := false;
  v_is_eligible boolean := true;
  v_reasons text[] := array[]::text[];
  v_criteria jsonb[] := array[]::jsonb[];
  v_student_skills text[];
  v_missing_skills text[] := array[]::text[];
begin
  -- Fetch Student Data
  select sp.*, p.full_name, p.email
  into v_student
  from public.student_profiles sp
  join public.profiles p on p.id = sp.user_id
  where sp.id = p_student_id;

  if not found then
    return jsonb_build_object(
      'is_eligible', false,
      'is_incomplete', true,
      'reasons', array['Student academic profile record not found. Please complete your profile.'],
      'criteria', '[]'::jsonb
    );
  end if;

  -- Check profile completeness
  if v_student.roll_number is null or v_student.branch is null or v_student.cgpa is null then
    v_is_incomplete := true;
    v_reasons := array_append(v_reasons, 'Mandatory academic credentials (Roll No, Branch, CGPA) are missing.');
  end if;

  -- Fetch Student Skills
  select coalesce(array_agg(skill_name), array[]::text[])
  into v_student_skills
  from public.student_skills
  where student_id = p_student_id;

  -- Fetch Job Eligibility Rules
  select *
  into v_rule
  from public.job_eligibility_rules
  where job_id = p_job_id;

  if not found then
    -- No specific rules set: eligible by default if profile is complete
    return jsonb_build_object(
      'is_eligible', not v_is_incomplete,
      'is_incomplete', v_is_incomplete,
      'reasons', case when v_is_incomplete then v_reasons else array['Open to all students with completed profiles.'] end,
      'criteria', '[]'::jsonb
    );
  end if;

  -- 1. CGPA Criterion
  v_cgpa_passed := (v_student.cgpa >= v_rule.minimum_cgpa);
  if not v_cgpa_passed then
    v_reasons := array_append(v_reasons, format('CGPA %s is below the required cutoff of %s.', v_student.cgpa, v_rule.minimum_cgpa));
  end if;
  v_criteria := array_append(v_criteria, jsonb_build_object(
    'id', 'cgpa',
    'label', 'Minimum CGPA Cutoff',
    'requiredValue', format('≥ %s', v_rule.minimum_cgpa),
    'studentValue', v_student.cgpa::text,
    'passed', v_cgpa_passed,
    'missingData', false
  ));

  -- 2. Backlogs Criterion
  v_backlogs_passed := (v_student.active_backlogs <= v_rule.maximum_backlogs);
  if not v_backlogs_passed then
    v_reasons := array_append(v_reasons, format('Active backlogs (%s) exceed the allowed maximum (%s).', v_student.active_backlogs, v_rule.maximum_backlogs));
  end if;
  v_criteria := array_append(v_criteria, jsonb_build_object(
    'id', 'backlogs',
    'label', 'Active Backlogs',
    'requiredValue', format('≤ %s backlogs', v_rule.maximum_backlogs),
    'studentValue', format('%s active', v_student.active_backlogs),
    'passed', v_backlogs_passed,
    'missingData', false
  ));

  -- 3. Branch Criterion
  if cardinality(v_rule.allowed_branches) > 0 then
    v_branch_passed := (v_student.branch = any(v_rule.allowed_branches));
    if not v_branch_passed then
      v_reasons := array_append(v_reasons, format('Branch "%s" is not in the eligible branches list.', v_student.branch));
    end if;
    v_criteria := array_append(v_criteria, jsonb_build_object(
      'id', 'branch',
      'label', 'Eligible Degree & Branch',
      'requiredValue', array_to_string(v_rule.allowed_branches, ', '),
      'studentValue', v_student.branch,
      'passed', v_branch_passed,
      'missingData', false
    ));
  else
    v_criteria := array_append(v_criteria, jsonb_build_object(
      'id', 'branch',
      'label', 'Eligible Degree & Branch',
      'requiredValue', 'All Branches Allowed',
      'studentValue', v_student.branch,
      'passed', true,
      'missingData', false
    ));
  end if;

  -- 4. Graduation Year Criterion
  if cardinality(v_rule.allowed_graduation_years) > 0 then
    v_year_passed := (v_student.graduation_year = any(v_rule.allowed_graduation_years));
    if not v_year_passed then
      v_reasons := array_append(v_reasons, format('Graduation batch "%s" is not eligible for this drive.', v_student.graduation_year));
    end if;
    v_criteria := array_append(v_criteria, jsonb_build_object(
      'id', 'batch',
      'label', 'Graduation Batch',
      'requiredValue', array_to_string(v_rule.allowed_graduation_years, ', '),
      'studentValue', format('Class of %s', v_student.graduation_year),
      'passed', v_year_passed,
      'missingData', false
    ));
  end if;

  -- 5. Required Skills Criterion (Informational / Check)
  if cardinality(v_rule.required_skills) > 0 then
    select array_agg(req)
    into v_missing_skills
    from unnest(v_rule.required_skills) req
    where not exists (
      select 1 from unnest(v_student_skills) s
      where lower(s) = lower(req)
    );

    v_skills_passed := (v_missing_skills is null or cardinality(v_missing_skills) = 0);
    if not v_skills_passed then
      v_reasons := array_append(v_reasons, format('Missing required skills: %s', array_to_string(v_missing_skills, ', ')));
    end if;

    v_criteria := array_append(v_criteria, jsonb_build_object(
      'id', 'skills',
      'label', 'Core Competencies',
      'requiredValue', array_to_string(v_rule.required_skills, ', '),
      'studentValue', case when cardinality(v_student_skills) > 0 then array_to_string(v_student_skills, ', ') else 'None listed' end,
      'passed', v_skills_passed,
      'missingData', cardinality(v_student_skills) = 0
    ));
  end if;

  v_is_eligible := v_cgpa_passed and v_backlogs_passed and v_branch_passed and v_year_passed and not v_is_incomplete;

  return jsonb_build_object(
    'is_eligible', v_is_eligible,
    'is_incomplete', v_is_incomplete,
    'reasons', v_reasons,
    'criteria', to_jsonb(v_criteria)
  );
end;
$$ language plpgsql stable security definer set search_path = public;


-- ==============================================================================
-- 3. Atomic Application Submission RPC
-- ==============================================================================
create or replace function public.submit_application(p_job_id uuid)
returns jsonb as $$
declare
  v_user_id uuid := auth.uid();
  v_role user_role_type;
  v_student_id uuid;
  v_job record;
  v_eligibility jsonb;
  v_app_id uuid;
  v_company_name text;
begin
  -- 1. Check Authentication
  if v_user_id is null then
    return jsonb_build_object('success', false, 'message', 'Unauthorized: Please log in to submit an application.');
  end if;

  -- 2. Verify Role
  select role into v_role from public.profiles where id = v_user_id;
  if v_role != 'student' then
    return jsonb_build_object('success', false, 'message', 'Forbidden: Only verified student accounts can apply.');
  end if;

  -- 3. Fetch Student Profile
  select id into v_student_id from public.student_profiles where user_id = v_user_id;
  if v_student_id is null then
    return jsonb_build_object('success', false, 'message', 'Profile Incomplete: Please complete your academic profile.');
  end if;

  -- 4. Fetch Job Posting & Lock Row
  select j.*, c.name as company_name
  into v_job
  from public.job_postings j
  join public.companies c on c.id = j.company_id
  where j.id = p_job_id;

  if not found then
    return jsonb_build_object('success', false, 'message', 'Job opening not found.');
  end if;

  -- 5. Verify Job Status & Deadline
  if v_job.status != 'active' then
    return jsonb_build_object('success', false, 'message', 'This job opening is no longer accepting applications.');
  end if;

  if v_job.deadline < now() then
    return jsonb_build_object('success', false, 'message', 'Application deadline has expired.');
  end if;

  -- 6. Evaluate Authoritative Server-Side Eligibility
  v_eligibility := public.evaluate_job_eligibility(p_job_id, v_student_id);
  if not (v_eligibility->>'is_eligible')::boolean then
    return jsonb_build_object(
      'success', false,
      'message', 'Eligibility criteria not met: ' || coalesce(v_eligibility->'reasons'->>0, 'Cutoff criteria not met.'),
      'eligibility', v_eligibility
    );
  end if;

  -- 7. Check for Duplicate Active Application
  if exists (
    select 1 from public.applications
    where student_id = v_student_id
      and job_id = p_job_id
      and status != 'withdrawn'
  ) then
    return jsonb_build_object('success', false, 'message', 'You have already submitted an active application for this opening.');
  end if;

  -- 8. Atomic Insert into applications
  insert into public.applications (
    student_id,
    job_id,
    status,
    applied_at
  )
  values (
    v_student_id,
    p_job_id,
    'submitted',
    now()
  )
  returning id into v_app_id;

  -- 9. Insert Initial Audit Trail Event into application_status_history
  insert into public.application_status_history (
    application_id,
    previous_status,
    new_status,
    changed_by,
    change_reason,
    changed_at
  )
  values (
    v_app_id,
    null,
    'submitted',
    v_user_id,
    'Application submitted by candidate via CampusFlow Portal.',
    now()
  );

  -- 10. Generate In-App Notification for Student
  insert into public.notifications (
    user_id,
    title,
    body,
    category,
    related_entity_id,
    is_read
  )
  values (
    v_user_id,
    'Application Submitted Successfully',
    format('Your application for %s at %s has been received.', v_job.title, v_job.company_name),
    'application',
    v_app_id::text,
    false
  );

  return jsonb_build_object(
    'success', true,
    'application_id', v_app_id,
    'message', format('Successfully applied to %s at %s.', v_job.title, v_job.company_name)
  );
end;
$$ language plpgsql security definer set search_path = public;


-- ==============================================================================
-- 4. Application Status State Machine & Recruiter Review RPC
-- ==============================================================================
create or replace function public.update_application_status(
  p_application_id uuid,
  p_new_status application_status_type,
  p_reason text default null
)
returns jsonb as $$
declare
  v_user_id uuid := auth.uid();
  v_app record;
  v_allowed boolean := false;
  v_student_user_id uuid;
begin
  -- Fetch current application
  select a.*, j.company_id, j.title as job_title, c.name as company_name, sp.user_id as student_user_id
  into v_app
  from public.applications a
  join public.job_postings j on j.id = a.job_id
  join public.companies c on c.id = j.company_id
  join public.student_profiles sp on sp.id = a.student_id
  where a.id = p_application_id;

  if not found then
    return jsonb_build_object('success', false, 'message', 'Application record not found.');
  end if;

  -- Authorization check: Admin or authorized Recruiter
  if not (public.is_admin() or public.is_recruiter_for_company(v_app.company_id)) then
    return jsonb_build_object('success', false, 'message', 'Forbidden: You do not have permissions to evaluate applicants for this company.');
  end if;

  -- State Machine Transition Enforcement
  case v_app.status
    when 'submitted' then
      v_allowed := (p_new_status in ('shortlisted', 'rejected'));
    when 'shortlisted' then
      v_allowed := (p_new_status in ('interview', 'rejected'));
    when 'interview' then
      v_allowed := (p_new_status in ('selected', 'rejected'));
    when 'selected' then
      v_allowed := false; -- Terminal state
    when 'rejected' then
      v_allowed := false; -- Terminal state
    when 'withdrawn' then
      v_allowed := false; -- Terminal state
    else
      v_allowed := false;
  end case;

  if not v_allowed then
    return jsonb_build_object(
      'success', false,
      'message', format('Invalid state transition from "%s" to "%s". Terminal or non-sequential transitions are prohibited.', v_app.status, p_new_status)
    );
  end if;

  -- Execute state transition
  update public.applications
  set status = p_new_status,
      updated_at = now()
  where id = p_application_id;

  -- Record audit trail
  insert into public.application_status_history (
    application_id,
    previous_status,
    new_status,
    changed_by,
    change_reason,
    changed_at
  )
  values (
    p_application_id,
    v_app.status,
    p_new_status,
    v_user_id,
    coalesce(p_reason, format('Candidate status transitioned to %s.', p_new_status)),
    now()
  );

  -- Send notification to candidate
  insert into public.notifications (
    user_id,
    title,
    body,
    category,
    related_entity_id,
    is_read
  )
  values (
    v_app.student_user_id,
    format('Application Status: %s', initcap(p_new_status::text)),
    format('Your application for %s at %s has been updated to %s.', v_app.job_title, v_app.company_name, p_new_status),
    'application',
    p_application_id::text,
    false
  );

  return jsonb_build_object(
    'success', true,
    'previous_status', v_app.status,
    'new_status', p_new_status,
    'message', format('Candidate status successfully updated to %s.', p_new_status)
  );
end;
$$ language plpgsql security definer set search_path = public;


-- ==============================================================================
-- 5. Application Withdrawal RPC
-- ==============================================================================
create or replace function public.withdraw_application(p_application_id uuid)
returns jsonb as $$
declare
  v_user_id uuid := auth.uid();
  v_app record;
begin
  select a.*, sp.user_id as student_user_id, j.title as job_title, c.name as company_name
  into v_app
  from public.applications a
  join public.student_profiles sp on sp.id = a.student_id
  join public.job_postings j on j.id = a.job_id
  join public.companies c on c.id = j.company_id
  where a.id = p_application_id;

  if not found then
    return jsonb_build_object('success', false, 'message', 'Application record not found.');
  end if;

  if v_app.student_user_id != v_user_id and not public.is_admin() then
    return jsonb_build_object('success', false, 'message', 'Forbidden: You can only withdraw your own applications.');
  end if;

  -- Withdrawal only permitted from submitted or shortlisted
  if v_app.status not in ('submitted', 'shortlisted') then
    return jsonb_build_object(
      'success', false,
      'message', format('Cannot withdraw application in "%s" stage. Please contact the placement cell.', v_app.status)
    );
  end if;

  update public.applications
  set status = 'withdrawn',
      withdrawn_at = now(),
      updated_at = now()
  where id = p_application_id;

  insert into public.application_status_history (
    application_id,
    previous_status,
    new_status,
    changed_by,
    change_reason,
    changed_at
  )
  values (
    p_application_id,
    v_app.status,
    'withdrawn',
    v_user_id,
    'Application withdrawn by candidate.',
    now()
  );

  return jsonb_build_object('success', true, 'message', 'Application successfully withdrawn.');
end;
$$ language plpgsql security definer set search_path = public;


-- ==============================================================================
-- 6. Interview Scheduling RPC
-- ==============================================================================
create or replace function public.schedule_interview(
  p_application_id uuid,
  p_scheduled_at timestamptz,
  p_duration_minutes int default 45,
  p_mode interview_mode_type default 'Virtual',
  p_location text default null,
  p_meeting_url text default null,
  p_round text default 'Technical Evaluation Round',
  p_notes text default null
)
returns jsonb as $$
declare
  v_user_id uuid := auth.uid();
  v_app record;
  v_interview_id uuid;
begin
  select a.*, j.company_id, j.title as job_title, c.name as company_name, sp.user_id as student_user_id
  into v_app
  from public.applications a
  join public.job_postings j on j.id = a.job_id
  join public.companies c on c.id = j.company_id
  join public.student_profiles sp on sp.id = a.student_id
  where a.id = p_application_id;

  if not found then
    return jsonb_build_object('success', false, 'message', 'Application record not found.');
  end if;

  if not (public.is_admin() or public.is_recruiter_for_company(v_app.company_id)) then
    return jsonb_build_object('success', false, 'message', 'Forbidden: Unauthorized to schedule interviews for this applicant.');
  end if;

  if p_scheduled_at < now() then
    return jsonb_build_object('success', false, 'message', 'Interview time must be in the future.');
  end if;

  -- Insert Interview
  insert into public.interviews (
    application_id,
    scheduled_by,
    scheduled_at,
    duration_minutes,
    mode,
    location,
    meeting_url,
    round,
    status,
    feedback
  )
  values (
    p_application_id,
    v_user_id,
    p_scheduled_at,
    p_duration_minutes,
    p_mode,
    p_location,
    p_meeting_url,
    p_round,
    'scheduled',
    p_notes
  )
  returning id into v_interview_id;

  -- Transition Application status to 'interview' if shortlisted
  if v_app.status = 'shortlisted' then
    perform public.update_application_status(
      p_application_id,
      'interview',
      format('Interview scheduled: %s on %s', p_round, to_char(p_scheduled_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI UTC'))
    );
  end if;

  -- Send notification
  insert into public.notifications (
    user_id,
    title,
    body,
    category,
    related_entity_id,
    is_read
  )
  values (
    v_app.student_user_id,
    format('Interview Scheduled: %s', p_round),
    format('%s has scheduled %s for %s (%s).', v_app.company_name, p_round, to_char(p_scheduled_at at time zone 'UTC', 'Mon DD, YYYY at HH24:MI UTC'), p_mode),
    'interview',
    v_interview_id::text,
    false
  );

  return jsonb_build_object(
    'success', true,
    'interview_id', v_interview_id,
    'message', format('Successfully scheduled %s for candidate.', p_round)
  );
end;
$$ language plpgsql security definer set search_path = public;


-- ==============================================================================
-- 7. Placement Analytics RPC (Placement Administrator Command Center)
-- ==============================================================================
create or replace function public.get_placement_analytics()
returns jsonb as $$
declare
  v_total_students int;
  v_placed_students int;
  v_in_process_students int;
  v_unplaced_students int;
  v_placement_rate numeric(5, 2);
  v_active_drives int;
  v_partner_companies int;
  v_dept_stats jsonb;
begin
  select count(distinct id) into v_total_students from public.student_profiles;

  -- A student is placed if they have at least one 'selected' application
  select count(distinct student_id)
  into v_placed_students
  from public.applications
  where status = 'selected';

  -- A student is in process if they have active applications (submitted, shortlisted, interview) and are not placed
  select count(distinct student_id)
  into v_in_process_students
  from public.applications
  where status in ('submitted', 'shortlisted', 'interview')
    and student_id not in (select student_id from public.applications where status = 'selected');

  v_unplaced_students := greatest(0, v_total_students - v_placed_students - v_in_process_students);

  if v_total_students > 0 then
    v_placement_rate := round((v_placed_students::numeric / v_total_students::numeric) * 100, 1);
  else
    v_placement_rate := 0.0;
  end if;

  select count(*) into v_active_drives from public.recruitment_drives where status = 'active';
  select count(*) into v_partner_companies from public.companies where status = 'active';

  -- Department-wise breakdown
  select jsonb_agg(dept)
  into v_dept_stats
  from (
    select
      sp.branch as name,
      count(distinct sp.id) as total,
      count(distinct case when a.status = 'selected' then sp.id end) as placed,
      round(
        (count(distinct case when a.status = 'selected' then sp.id end)::numeric /
         greatest(count(distinct sp.id), 1)::numeric) * 100, 1
      ) as rate
    from public.student_profiles sp
    left join public.applications a on a.student_id = sp.id
    group by sp.branch
    order by total desc
  ) dept;

  return jsonb_build_object(
    'total_students', v_total_students,
    'placed_students', v_placed_students,
    'in_process_students', v_in_process_students,
    'unplaced_students', v_unplaced_students,
    'placement_rate', v_placement_rate,
    'active_drives', v_active_drives,
    'partner_companies', v_partner_companies,
    'department_stats', coalesce(v_dept_stats, '[]'::jsonb)
  );
end;
$$ language plpgsql stable security definer set search_path = public;
-- ==============================================================================
-- CampusFlow V4 — Supabase Migration: 004_seed_demo_data.sql
-- Demonstration Data: Companies, Jobs, 20 Students, Applications, Interviews
-- ==============================================================================

-- 1. Demo User IDs (Deterministic UUIDs for reproducibility across environments)
-- Student: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
-- Recruiter: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
-- Admin: cccccccc-cccc-cccc-cccc-cccccccccccc

-- Note: In Supabase production/local auth, these IDs can match auth.users(id).
-- If auth.users has foreign key enforcement, we insert demo entries into auth.users if accessible,
-- or use safe upserts into public.profiles.

do $$
declare
  v_student_auth_id uuid := 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
  v_recruiter_auth_id uuid := 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb';
  v_admin_auth_id uuid := 'cccccccc-cccc-4ccc-cccc-cccccccccccc';

  v_company_aetos uuid := '11111111-1111-4111-a111-111111111111';
  v_company_nova uuid := '22222222-2222-4222-a222-222222222222';
  v_company_agnext uuid := '33333333-3333-4333-a333-333333333333';
  v_company_orbit uuid := '44444444-4444-4444-a444-444444444444';
  v_company_medrenova uuid := '55555555-5555-4555-a555-555555555555';
  v_company_vertex uuid := '66666666-6666-4666-a666-666666666666';

  v_drive_aetos uuid := 'd1111111-1111-4111-a111-111111111111';
  v_drive_nova uuid := 'd2222222-2222-4222-a222-222222222222';
  v_drive_orbit uuid := 'd4444444-4444-4444-a444-444444444444';

  v_job_aetos uuid := 'j1111111-1111-4111-a111-111111111111';
  v_job_nova_swe uuid := 'j2222222-2222-4222-a222-222222222222';
  v_job_nova_cloud uuid := 'j2222222-3333-4222-a222-333333333333';
  v_job_orbit_analyst uuid := 'j4444444-1111-4444-a444-111111111111';
  v_job_agnext_ai uuid := 'j3333333-1111-4333-a333-111111111111';
  v_job_medrenova_cv uuid := 'j5555555-1111-4555-a555-111111111111';
  v_job_vertex_fs uuid := 'j6666666-1111-4666-a666-111111111111';

  v_primary_student_id uuid;
  v_app_1 uuid := 'a1111111-1111-4111-a111-111111111111';
  v_app_2 uuid := 'a2222222-2222-4222-a222-222222222222';
  v_app_3 uuid := 'a3333333-3333-4333-a333-333333333333';
  v_app_4 uuid := 'a4444444-4444-4444-a444-444444444444';
begin
  -- 1. Create or ensure auth.users entries for the three demo roles if auth schema is writable
  begin
    insert into auth.users (id, email, raw_user_meta_data, role, aud)
    values
      (v_student_auth_id, 'aarav.sharma@campus.edu', '{"role":"student","full_name":"Aarav Sharma"}'::jsonb, 'authenticated', 'authenticated'),
      (v_recruiter_auth_id, 'priya.nair@novatech.io', '{"role":"recruiter","full_name":"Priya Nair"}'::jsonb, 'authenticated', 'authenticated'),
      (v_admin_auth_id, 'placements@campus.edu', '{"role":"placement_admin","full_name":"Dr. Rajesh Rao"}'::jsonb, 'authenticated', 'authenticated')
    on conflict (id) do nothing;
  exception
    when others then
      -- If running in an environment without direct auth.users insert privileges, proceed with public.profiles
      null;
  end;

  -- 2. Insert Profiles
  insert into public.profiles (id, email, full_name, role, avatar_path)
  values
    (v_student_auth_id, 'aarav.sharma@campus.edu', 'Aarav Sharma', 'student', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    (v_recruiter_auth_id, 'priya.nair@novatech.io', 'Priya Nair', 'recruiter', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
    (v_admin_auth_id, 'placements@campus.edu', 'Dr. Rajesh Rao', 'placement_admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80')
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role;

  -- 3. Insert Student Profile for Aarav Sharma
  insert into public.student_profiles (
    id,
    user_id,
    roll_number,
    course,
    branch,
    graduation_year,
    cgpa,
    active_backlogs,
    phone,
    bio,
    github_url,
    linkedin_url,
    portfolio_url
  )
  values (
    's1111111-1111-4111-a111-111111111111',
    v_student_auth_id,
    'N25H02A0325',
    'B.Tech',
    'Computer Science & Engineering',
    2026,
    8.85,
    0,
    '+91 98765 43210',
    'Final-year computer science undergrad passionate about building high-performance web systems, Agentic AI, and distributed applications.',
    'https://github.com/aarav-sharma',
    'https://linkedin.com/in/aarav-sharma-campus',
    'https://aaravsharma.dev'
  )
  on conflict (user_id) do update set
    roll_number = excluded.roll_number,
    cgpa = excluded.cgpa
  returning id into v_primary_student_id;

  -- Insert Skills for Aarav
  insert into public.student_skills (student_id, skill_name)
  values
    (v_primary_student_id, 'React'),
    (v_primary_student_id, 'TypeScript'),
    (v_primary_student_id, 'Node.js'),
    (v_primary_student_id, 'Python'),
    (v_primary_student_id, 'Agentic AI'),
    (v_primary_student_id, 'PostgreSQL'),
    (v_primary_student_id, 'Tailwind CSS'),
    (v_primary_student_id, 'Docker')
  on conflict (student_id, skill_name) do nothing;

  -- Insert Projects for Aarav
  insert into public.student_projects (student_id, title, description, project_url, technologies)
  values
    (
      v_primary_student_id,
      'Distributed Log Aggregator',
      'High-throughput streaming analytics platform handling 15k events/sec using Go, Kafka, and ClickHouse.',
      'https://github.com/aarav-sharma/dist-logger',
      array['Go', 'Kafka', 'ClickHouse', 'Docker']
    ),
    (
      v_primary_student_id,
      'Autonomous Code Refactoring Agent',
      'LLM-powered tool using tree-sitter AST queries to automate TypeScript migrations and dead code removal.',
      'https://github.com/aarav-sharma/auto-refactor',
      array['TypeScript', 'Python', 'AST', 'OpenAI API']
    )
  on conflict do nothing;

  -- 4. Insert Companies
  insert into public.companies (id, name, industry, description, website, logo_path, status)
  values
    (v_company_aetos, 'Aetos DigiLog', 'Artificial Intelligence & Defense Tech', 'Next-generation intelligent autonomy and multi-agent coordination systems.', 'https://aetosdigilog.com', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_nova, 'NovaTech Systems', 'Enterprise Software & Cloud Platforms', 'Global cloud automation and mission-critical developer infrastructure.', 'https://novatech.io', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_agnext, 'AgNext Technologies', 'AgriTech & Automation', 'Deep-tech computer vision and spectroscopy analytics for agricultural value chains.', 'https://agnext.com', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_orbit, 'Orbit Analytics', 'Data Intelligence & Analytics', 'Enterprise business intelligence and decision-intelligence platform.', 'https://orbitanalytics.com', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_medrenova, 'MedRenova Diagnostics', 'HealthTech & Medical Imaging', 'AI-assisted medical pathology and diagnostic imaging platforms.', 'https://medrenova.health', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_vertex, 'Vertex Digital Labs', 'Full-Stack Software Engineering', 'High-velocity digital product engineering and distributed systems studio.', 'https://vertexdigital.io', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=128&auto=format&fit=crop&q=80', 'active')
  on conflict (id) do update set
    name = excluded.name,
    industry = excluded.industry;

  -- 5. Recruiter Memberships
  insert into public.recruiter_company_memberships (recruiter_user_id, company_id, membership_role, approved_at)
  values
    (v_recruiter_auth_id, v_company_nova, 'lead_recruiter', now()),
    (v_recruiter_auth_id, v_company_aetos, 'guest_interviewer', now())
  on conflict (recruiter_user_id, company_id) do nothing;

  -- 6. Recruitment Drives
  insert into public.recruitment_drives (id, company_id, title, description, start_date, end_date, status, created_by)
  values
    (v_drive_aetos, v_company_aetos, 'Aetos AI Campus Fellowship 2026', 'Campus-wide drive for undergraduate AI engineers and research fellows.', now() - interval '10 days', now() + interval '30 days', 'active', v_admin_auth_id),
    (v_drive_nova, v_company_nova, 'NovaTech Early Careers Drive 2026', 'Tier-1 recruitment for software development trainees and cloud architects.', now() - interval '5 days', now() + interval '45 days', 'active', v_admin_auth_id),
    (v_drive_orbit, v_company_orbit, 'Orbit Data Analytics Drive', 'Selection pipeline for business analysts and data engineers.', now() - interval '2 days', now() + interval '20 days', 'active', v_admin_auth_id)
  on conflict (id) do nothing;

  -- 7. Job Postings & Eligibility Rules
  -- Job 1: AI Intern (Aetos DigiLog)
  insert into public.job_postings (
    id, company_id, drive_id, created_by, title, description,
    responsibilities, employment_type, work_mode, location,
    compensation_min, compensation_max, compensation_period, currency,
    openings, deadline, status
  )
  values (
    v_job_aetos, v_company_aetos, v_drive_aetos, v_admin_auth_id,
    'AI Intern',
    'Join our Core Research Group building autonomous agentic workflows and specialized domain models for mission planning.',
    array['Design and deploy agentic decision loops with LangGraph and Python', 'Evaluate model alignment against synthetic execution benchmarks', 'Collaborate with senior researchers on latency and token optimization'],
    'Internship', 'Hybrid', 'Bengaluru, Karnataka (Hybrid)',
    25000.00, 30000.00, 'monthly', 'INR',
    4, now() + interval '14 days', 'active'
  ) on conflict (id) do nothing;

  insert into public.job_eligibility_rules (
    job_id, minimum_cgpa, maximum_backlogs, allowed_branches, allowed_graduation_years, required_skills
  )
  values (
    v_job_aetos, 8.00, 0,
    array['Computer Science & Engineering', 'Artificial Intelligence & Data Science'],
    array[2026],
    array['Python', 'Agentic AI']
  ) on conflict (job_id) do nothing;

  -- Job 2: Software Engineer Trainee (NovaTech Systems)
  insert into public.job_postings (
    id, company_id, drive_id, created_by, title, description,
    responsibilities, employment_type, work_mode, location,
    compensation_min, compensation_max, compensation_period, currency,
    openings, deadline, status
  )
  values (
    v_job_nova_swe, v_company_nova, v_drive_nova, v_recruiter_auth_id,
    'Software Engineer Trainee',
    'Design, develop, and scale high-availability enterprise services handling millions of operations daily.',
    array['Build fault-tolerant microservices in Node.js and TypeScript', 'Optimize SQL queries and PostgreSQL database indexes', 'Participate in code reviews, CI/CD pipelines, and design critiques'],
    'Full-time', 'On-site', 'Hyderabad, Telangana (On-site)',
    1400000.00, 1800000.00, 'annual', 'INR',
    10, now() + interval '21 days', 'active'
  ) on conflict (id) do nothing;

  insert into public.job_eligibility_rules (
    job_id, minimum_cgpa, maximum_backlogs, allowed_branches, allowed_graduation_years, required_skills
  )
  values (
    v_job_nova_swe, 7.50, 0,
    array['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'],
    array[2026],
    array['TypeScript', 'React', 'Node.js']
  ) on conflict (job_id) do nothing;

  -- Job 3: Data Analyst Trainee (Orbit Analytics)
  insert into public.job_postings (
    id, company_id, drive_id, created_by, title, description,
    responsibilities, employment_type, work_mode, location,
    compensation_min, compensation_max, compensation_period, currency,
    openings, deadline, status
  )
  values (
    v_job_orbit_analyst, v_company_orbit, v_drive_orbit, v_admin_auth_id,
    'Data Analyst Trainee',
    'Transform complex operational data into actionable dashboards and automated decision workflows.',
    array['Write complex analytical SQL queries and build ETL scripts', 'Create interactive executive dashboards using Tableau and Python', 'Analyze product usage trends and present insights to stakeholders'],
    'Full-time', 'Hybrid', 'Pune, Maharashtra (Hybrid)',
    900000.00, 1200000.00, 'annual', 'INR',
    5, now() + interval '25 days', 'active'
  ) on conflict (id) do nothing;

  insert into public.job_eligibility_rules (
    job_id, minimum_cgpa, maximum_backlogs, allowed_branches, allowed_graduation_years, required_skills
  )
  values (
    v_job_orbit_analyst, 7.20, 1,
    array[]::text[], -- All branches allowed
    array[2026],
    array['SQL', 'Python']
  ) on conflict (job_id) do nothing;

  -- Job 4: AI Automation Intern (AgNext Technologies)
  insert into public.job_postings (
    id, company_id, drive_id, created_by, title, description,
    responsibilities, employment_type, work_mode, location,
    compensation_min, compensation_max, compensation_period, currency,
    openings, deadline, status
  )
  values (
    v_job_agnext_ai, v_company_agnext, null, v_admin_auth_id,
    'AI Automation Intern',
    'Automate testing, instrumentation, and continuous verification of deployed edge-AI models.',
    array['Build automated edge deployment pipelines', 'Implement performance instrumentation and telemetry', 'Evaluate model drift across agricultural dataset batches'],
    'Internship', 'Remote', 'Remote (India)',
    15000.00, 20000.00, 'monthly', 'INR',
    3, now() - interval '2 days', 'closed' -- Closed drive
  ) on conflict (id) do nothing;

  insert into public.job_eligibility_rules (
    job_id, minimum_cgpa, maximum_backlogs, allowed_branches, allowed_graduation_years, required_skills
  )
  values (
    v_job_agnext_ai, 7.00, 0,
    array['Computer Science & Engineering', 'Information Technology'],
    array[2026],
    array['Python']
  ) on conflict (job_id) do nothing;

  -- 8. Seed Applications for Aarav Sharma
  -- App 1: AI Intern (Interview Scheduled)
  insert into public.applications (id, student_id, job_id, status, applied_at)
  values (v_app_1, v_primary_student_id, v_job_aetos, 'interview', now() - interval '8 days')
  on conflict (id) do nothing;

  insert into public.application_status_history (application_id, previous_status, new_status, changed_by, change_reason, changed_at)
  values
    (v_app_1, null, 'submitted', v_student_auth_id, 'Application submitted by candidate.', now() - interval '8 days'),
    (v_app_1, 'submitted', 'shortlisted', v_recruiter_auth_id, 'Profile and AI portfolio matched requirements.', now() - interval '4 days'),
    (v_app_1, 'shortlisted', 'interview', v_recruiter_auth_id, 'Round 1 Technical Interview scheduled.', now() - interval '1 day')
  on conflict do nothing;

  -- App 2: Software Engineer Trainee (Shortlisted)
  insert into public.applications (id, student_id, job_id, status, applied_at)
  values (v_app_2, v_primary_student_id, v_job_nova_swe, 'shortlisted', now() - interval '6 days')
  on conflict (id) do nothing;

  insert into public.application_status_history (application_id, previous_status, new_status, changed_by, change_reason, changed_at)
  values
    (v_app_2, null, 'submitted', v_student_auth_id, 'Application submitted by candidate.', now() - interval '6 days'),
    (v_app_2, 'submitted', 'shortlisted', v_recruiter_auth_id, 'Academic criteria verified. Shortlisted.', now() - interval '2 days')
  on conflict do nothing;

  -- App 3: Data Analyst Trainee (Submitted)
  insert into public.applications (id, student_id, job_id, status, applied_at)
  values (v_app_3, v_primary_student_id, v_job_orbit_analyst, 'submitted', now() - interval '3 days')
  on conflict (id) do nothing;

  insert into public.application_status_history (application_id, previous_status, new_status, changed_by, change_reason, changed_at)
  values
    (v_app_3, null, 'submitted', v_student_auth_id, 'Application submitted by candidate.', now() - interval '3 days')
  on conflict do nothing;

  -- App 4: AI Automation Intern (Selected)
  insert into public.applications (id, student_id, job_id, status, applied_at)
  values (v_app_4, v_primary_student_id, v_job_agnext_ai, 'selected', now() - interval '20 days')
  on conflict (id) do nothing;

  insert into public.application_status_history (application_id, previous_status, new_status, changed_by, change_reason, changed_at)
  values
    (v_app_4, null, 'submitted', v_student_auth_id, 'Application submitted.', now() - interval '20 days'),
    (v_app_4, 'submitted', 'shortlisted', v_recruiter_auth_id, 'Shortlisted for interview.', now() - interval '15 days'),
    (v_app_4, 'shortlisted', 'interview', v_recruiter_auth_id, 'Technical interview completed.', now() - interval '10 days'),
    (v_app_4, 'interview', 'selected', v_recruiter_auth_id, 'Offer extended and candidate selected.', now() - interval '4 days')
  on conflict do nothing;

  -- 9. Scheduled Interview
  insert into public.interviews (
    id, application_id, scheduled_by, scheduled_at, duration_minutes,
    mode, location, meeting_url, round, status, feedback
  )
  values (
    'i1111111-1111-4111-a111-111111111111',
    v_app_1,
    v_recruiter_auth_id,
    now() + interval '3 days',
    60,
    'Virtual',
    null,
    'https://meet.google.com/aet-osdi-log',
    'Round 1: Technical & Agentic Architecture',
    'scheduled',
    'Please keep your IDE ready with your portfolio projects and be prepared to explain LangGraph or Agentic control loops.'
  ) on conflict (id) do nothing;

  -- 10. Seed Notifications
  insert into public.notifications (user_id, title, body, category, related_entity_id, is_read, created_at)
  values
    (v_student_auth_id, 'Interview Scheduled', 'Aetos DigiLog scheduled your Round 1 Technical Interview.', 'interview', v_app_1::text, false, now() - interval '1 day'),
    (v_student_auth_id, 'Offer Extended!', 'Congratulations! You have been selected for the AI Automation Intern role at AgNext Technologies.', 'application', v_app_4::text, false, now() - interval '4 days'),
    (v_student_auth_id, 'Shortlisted by NovaTech', 'Your application for Software Engineer Trainee at NovaTech Systems has been shortlisted.', 'application', v_app_2::text, true, now() - interval '2 days'),
    (v_recruiter_auth_id, 'New Application Received', 'Aarav Sharma submitted an application for Software Engineer Trainee.', 'application', v_app_2::text, false, now() - interval '6 days')
  on conflict do nothing;

  -- 11. Seed 19 additional synthetic students across branches and placement statuses
  -- to guarantee the mandatory 20 synthetic student records
  perform public.seed_synthetic_batch();
end $$;

-- Helper Function to Seed 20 Synthetic Students
create or replace function public.seed_synthetic_batch()
returns void as $$
declare
  v_rec record;
  v_new_user_id uuid;
  v_student_id uuid;
  v_idx int := 1;
  v_students jsonb := '[
    {"name": "Bhavna Kulkarni", "roll": "N25H02A0326", "email": "bhavna.k@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 9.20, "year": 2026, "skills": ["Python", "Django", "AWS", "PostgreSQL"], "status": "selected"},
    {"name": "Chirag Mehra", "roll": "N25H02A0327", "email": "chirag.m@campus.edu", "branch": "Information Technology", "cgpa": 8.40, "year": 2026, "skills": ["Java", "Spring Boot", "Kafka", "Docker"], "status": "interview"},
    {"name": "Divya Iyer", "roll": "N25H02A0328", "email": "divya.i@campus.edu", "branch": "Artificial Intelligence & Data Science", "cgpa": 9.45, "year": 2026, "skills": ["PyTorch", "Computer Vision", "Python", "MLOps"], "status": "selected"},
    {"name": "Eshaan Gupta", "roll": "N25H02A0329", "email": "eshaan.g@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 7.65, "year": 2026, "skills": ["React", "JavaScript", "Tailwind", "HTML5"], "status": "submitted"},
    {"name": "Farhan Ali", "roll": "N25H02A0330", "email": "farhan.a@campus.edu", "branch": "Electronics & Communication", "cgpa": 8.10, "year": 2026, "skills": ["C++", "Embedded C", "IoT", "Python"], "status": "shortlisted"},
    {"name": "Gayatri Joshi", "roll": "N25H02A0331", "email": "gayatri.j@campus.edu", "branch": "Information Technology", "cgpa": 8.75, "year": 2026, "skills": ["Go", "Kubernetes", "Linux", "SQL"], "status": "selected"},
    {"name": "Harsh Vardhan", "roll": "N25H02A0332", "email": "harsh.v@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 6.95, "year": 2026, "skills": ["Python", "SQL", "Excel", "Tableau"], "status": "rejected"},
    {"name": "Ishita Sen", "roll": "N25H02A0333", "email": "ishita.s@campus.edu", "branch": "Artificial Intelligence & Data Science", "cgpa": 8.90, "year": 2026, "skills": ["SQL", "R", "Tableau", "PowerBI"], "status": "selected"},
    {"name": "Jayant Patel", "roll": "N25H02A0334", "email": "jayant.p@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 7.80, "year": 2026, "skills": ["Node.js", "MongoDB", "Express", "React"], "status": "submitted"},
    {"name": "Kavya Pillai", "roll": "N25H02A0335", "email": "kavya.p@campus.edu", "branch": "Information Technology", "cgpa": 9.05, "year": 2026, "skills": ["Rust", "C++", "Systems", "Networks"], "status": "selected"},
    {"name": "Lokesh Nair", "roll": "N25H02A0336", "email": "lokesh.n@campus.edu", "branch": "Electronics & Communication", "cgpa": 7.30, "year": 2026, "skills": ["Python", "VLSI", "Verilog", "MATLAB"], "status": "unplaced"},
    {"name": "Meera Nambiar", "roll": "N25H02A0337", "email": "meera.n@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 8.60, "year": 2026, "skills": ["React Native", "Swift", "Flutter", "Firebase"], "status": "interview"},
    {"name": "Nikhil Saxena", "roll": "N25H02A0338", "email": "nikhil.s@campus.edu", "branch": "Information Technology", "cgpa": 8.35, "year": 2026, "skills": ["TypeScript", "GraphQL", "Next.js", "Jest"], "status": "selected"},
    {"name": "Ojas Deshmukh", "roll": "N25H02A0339", "email": "ojas.d@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 7.40, "year": 2026, "skills": ["Java", "SQL", "HTML/CSS", "Git"], "status": "unplaced"},
    {"name": "Prerna Singhania", "roll": "N25H02A0340", "email": "prerna.s@campus.edu", "branch": "Artificial Intelligence & Data Science", "cgpa": 9.30, "year": 2026, "skills": ["LLMs", "Prompt Engineering", "LangChain", "Python"], "status": "selected"},
    {"name": "Rohan Bose", "roll": "N25H02A0341", "email": "rohan.b@campus.edu", "branch": "Mechanical Engineering", "cgpa": 8.15, "year": 2026, "skills": ["Python", "Data Analytics", "AutoCAD", "SQL"], "status": "submitted"},
    {"name": "Sneha Chatterjee", "roll": "N25H02A0342", "email": "sneha.c@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 8.70, "year": 2026, "skills": ["Cybersecurity", "Linux", "Network Security", "Python"], "status": "selected"},
    {"name": "Tanmay Bhatt", "roll": "N25H02A0343", "email": "tanmay.b@campus.edu", "branch": "Information Technology", "cgpa": 7.10, "year": 2026, "skills": ["PHP", "MySQL", "JavaScript", "Bootstrap"], "status": "unplaced"},
    {"name": "Urvi Shah", "roll": "N25H02A0344", "email": "urvi.s@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 9.15, "year": 2026, "skills": ["Kubernetes", "Cloud Architecture", "Go", "GCP"], "status": "selected"}
  ]'::jsonb;
begin
  for v_rec in select * from jsonb_to_recordset(v_students) as x(
    name text, roll text, email text, branch text, cgpa numeric, year int, skills text[], status text
  )
  loop
    v_new_user_id := gen_random_uuid();

    -- Create profile
    insert into public.profiles (id, email, full_name, role)
    values (v_new_user_id, v_rec.email, v_rec.name, 'student')
    on conflict (email) do update set full_name = excluded.full_name
    returning id into v_new_user_id;

    -- Create student_profile
    insert into public.student_profiles (
      user_id, roll_number, course, branch, graduation_year, cgpa, active_backlogs
    )
    values (
      v_new_user_id, v_rec.roll, 'B.Tech', v_rec.branch, v_rec.year, v_rec.cgpa, 0
    )
    on conflict (roll_number) do update set cgpa = excluded.cgpa
    returning id into v_student_id;

    -- Skills
    insert into public.student_skills (student_id, skill_name)
    select v_student_id, unnest(v_rec.skills)
    on conflict do nothing;

    -- If placed (selected), link an application to NovaTech SWE
    if v_rec.status = 'selected' then
      insert into public.applications (student_id, job_id, status, applied_at)
      values (v_student_id, 'j2222222-2222-4222-a222-222222222222'::uuid, 'selected', now() - interval '10 days')
      on conflict (student_id, job_id) do nothing;
    elsif v_rec.status in ('submitted', 'shortlisted', 'interview', 'rejected') then
      insert into public.applications (student_id, job_id, status, applied_at)
      values (v_student_id, 'j2222222-2222-4222-a222-222222222222'::uuid, v_rec.status::application_status_type, now() - interval '5 days')
      on conflict (student_id, job_id) do nothing;
    end if;
  end loop;
end;
$$ language plpgsql security definer set search_path = public;
