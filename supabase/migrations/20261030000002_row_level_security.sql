-- ==============================================================================
-- CampusFlow V4 - Supabase Migration: 002_row_level_security.sql
-- Non-Negotiable Multi-Role RLS Policies (Student, Recruiter, Admin)
-- ==============================================================================

-- ==============================================================================
-- 5. SECURITY HELPER FUNCTIONS (DEFINED BEFORE RLS POLICIES)
-- ==============================================================================
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


-- ==============================================================================
-- 7. ROW LEVEL SECURITY POLICIES (100% EXPLICIT COVERAGE)
-- ==============================================================================
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

-- Profiles Policies
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can update own non-sensitive profile fields" on public.profiles;
create policy "Users can update own non-sensitive profile fields"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "Admins can view and manage all profiles" on public.profiles;
create policy "Admins can view and manage all profiles"
  on public.profiles for all
  using (public.is_admin());

-- Student Profiles Policies
drop policy if exists "Students can view own student_profile" on public.student_profiles;
create policy "Students can view own student_profile"
  on public.student_profiles for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or public.is_recruiter_for_student_resume(id)
  );

drop policy if exists "Students can update own student_profile" on public.student_profiles;
create policy "Students can update own student_profile"
  on public.student_profiles for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Admins can manage student_profiles" on public.student_profiles;
create policy "Admins can manage student_profiles"
  on public.student_profiles for all
  using (public.is_admin());

-- Skills & Projects Policies
drop policy if exists "View student skills" on public.student_skills;
create policy "View student skills"
  on public.student_skills for select
  using (
    student_id = public.get_student_profile_id()
    or public.is_admin()
    or public.is_recruiter_for_student_resume(student_id)
  );

drop policy if exists "Students manage own skills" on public.student_skills;
create policy "Students manage own skills"
  on public.student_skills for all
  using (student_id = public.get_student_profile_id())
  with check (student_id = public.get_student_profile_id());

drop policy if exists "View student projects" on public.student_projects;
create policy "View student projects"
  on public.student_projects for select
  using (
    student_id = public.get_student_profile_id()
    or public.is_admin()
    or public.is_recruiter_for_student_resume(student_id)
  );

drop policy if exists "Students manage own projects" on public.student_projects;
create policy "Students manage own projects"
  on public.student_projects for all
  using (student_id = public.get_student_profile_id())
  with check (student_id = public.get_student_profile_id());

-- Companies & Memberships
drop policy if exists "Anyone authenticated can view active companies" on public.companies;
create policy "Anyone authenticated can view active companies"
  on public.companies for select
  using (status = 'active' or public.is_admin() or public.is_recruiter_for_company(id));

drop policy if exists "Admins can manage companies" on public.companies;
create policy "Admins can manage companies"
  on public.companies for all
  using (public.is_admin());

drop policy if exists "Recruiters view own company memberships" on public.recruiter_company_memberships;
create policy "Recruiters view own company memberships"
  on public.recruiter_company_memberships for select
  using (recruiter_user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins manage recruiter company memberships" on public.recruiter_company_memberships;
create policy "Admins manage recruiter company memberships"
  on public.recruiter_company_memberships for all
  using (public.is_admin());

-- Recruitment Drives
drop policy if exists "Authenticated users view active drives" on public.recruitment_drives;
create policy "Authenticated users view active drives"
  on public.recruitment_drives for select
  using (status = 'active' or public.is_admin() or public.is_recruiter_for_company(company_id));

drop policy if exists "Admins and authorized recruiters manage drives" on public.recruitment_drives;
create policy "Admins and authorized recruiters manage drives"
  on public.recruitment_drives for all
  using (public.is_admin() or public.is_recruiter_for_company(company_id));

-- Job Postings & Eligibility Rules
drop policy if exists "View active job postings" on public.job_postings;
create policy "View active job postings"
  on public.job_postings for select
  using (
    status = 'active'
    or public.is_admin()
    or public.is_recruiter_for_company(company_id)
  );

drop policy if exists "Recruiters can insert postings for their company" on public.job_postings;
create policy "Recruiters can insert postings for their company"
  on public.job_postings for insert
  with check (public.is_admin() or public.is_recruiter_for_company(company_id));

drop policy if exists "Recruiters can update postings for their company" on public.job_postings;
create policy "Recruiters can update postings for their company"
  on public.job_postings for update
  using (public.is_admin() or public.is_recruiter_for_company(company_id))
  with check (public.is_admin() or public.is_recruiter_for_company(company_id));

drop policy if exists "Admins manage all job postings" on public.job_postings;
create policy "Admins manage all job postings"
  on public.job_postings for all
  using (public.is_admin());

drop policy if exists "View job eligibility rules" on public.job_eligibility_rules;
create policy "View job eligibility rules"
  on public.job_eligibility_rules for select
  using (
    exists (
      select 1 from public.job_postings j
      where j.id = job_id and (j.status = 'active' or public.is_admin() or public.is_recruiter_for_company(j.company_id))
    )
  );

drop policy if exists "Manage job eligibility rules" on public.job_eligibility_rules;
create policy "Manage job eligibility rules"
  on public.job_eligibility_rules for all
  using (public.is_admin() or public.is_recruiter_for_job(job_id));

-- Applications Policies
drop policy if exists "View applications" on public.applications;
create policy "View applications"
  on public.applications for select
  using (
    student_id = public.get_student_profile_id()
    or public.is_recruiter_for_job(job_id)
    or public.is_admin()
  );

drop policy if exists "Students can submit own application" on public.applications;
create policy "Students can submit own application"
  on public.applications for insert
  with check (student_id = public.get_student_profile_id());

drop policy if exists "Recruiters and Admins can update application status" on public.applications;
create policy "Recruiters and Admins can update application status"
  on public.applications for update
  using (public.is_recruiter_for_job(job_id) or public.is_admin());

drop policy if exists "Students can withdraw application" on public.applications;
create policy "Students can withdraw application"
  on public.applications for update
  using (student_id = public.get_student_profile_id())
  with check (student_id = public.get_student_profile_id() and status = 'withdrawn');

-- Application Status History Policies
drop policy if exists "View application status history" on public.application_status_history;
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

drop policy if exists "Insert application status history" on public.application_status_history;
create policy "Insert application status history"
  on public.application_status_history for insert
  with check (
    public.is_admin()
    or public.is_recruiter_for_application(application_id)
  );

-- Interviews Policies
drop policy if exists "View interviews" on public.interviews;
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

drop policy if exists "Recruiters and admins manage interviews" on public.interviews;
create policy "Recruiters and admins manage interviews"
  on public.interviews for all
  using (
    public.is_admin()
    or public.is_recruiter_for_application(application_id)
  );

-- Notifications Policies
drop policy if exists "Users read and update own notifications" on public.notifications;
create policy "Users read and update own notifications"
  on public.notifications for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users mark own notifications as read" on public.notifications;
create policy "Users mark own notifications as read"
  on public.notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Resume Files Metadata Policies
drop policy if exists "View resume files metadata" on public.resume_files;
create policy "View resume files metadata"
  on public.resume_files for select
  using (
    student_id = public.get_student_profile_id()
    or public.is_recruiter_for_student_resume(student_id)
    or public.is_admin()
  );

drop policy if exists "Students manage own resume files" on public.resume_files;
create policy "Students manage own resume files"
  on public.resume_files for all
  using (student_id = public.get_student_profile_id())
  with check (student_id = public.get_student_profile_id());


-- ==============================================================================
-- 9. STORAGE BUCKET CONFIGURATION (PRIVATE RESUMES)
-- ==============================================================================
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

drop policy if exists "Students can upload own resume to storage" on storage.objects;
create policy "Students can upload own resume to storage"
  on storage.objects for insert
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Students can update/delete own resume in storage" on storage.objects;
create policy "Students can update/delete own resume in storage"
  on storage.objects for all
  using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Authorized users can read resume from storage" on storage.objects;
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

