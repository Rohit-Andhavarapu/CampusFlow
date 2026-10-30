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
