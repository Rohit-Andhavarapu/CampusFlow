-- ==============================================================================
-- CampusFlow V5 — Migration: Resume Intelligence & Recruiter Access Management
-- ==============================================================================

-- 1. Resume Analyses Table
create table if not exists public.resume_analyses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  resume_file_id uuid references public.resume_files(id) on delete set null,
  resume_file_hash text,
  model_provider text not null default 'groq',
  model_name text not null default 'openai/gpt-oss-20b',
  analysis_schema_version text not null default '1.0',
  analysis_status text not null default 'completed' check (analysis_status in ('pending', 'processing', 'completed', 'failed')),
  structured_analysis jsonb not null default '{}'::jsonb,
  matched_jobs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz default now(),
  error_code text,
  error_message text
);

-- Indexes for performance & quick cache lookups
create index if not exists idx_resume_analyses_student on public.resume_analyses(student_id);
create index if not exists idx_resume_analyses_hash on public.resume_analyses(student_id, resume_file_hash);
create index if not exists idx_resume_analyses_status on public.resume_analyses(analysis_status);

-- Enable Row Level Security
alter table public.resume_analyses enable row level security;

-- RLS: Students can view and delete their own resume analyses
drop policy if exists "Students can view own resume analyses" on public.resume_analyses;
create policy "Students can view own resume analyses"
  on public.resume_analyses for select
  to authenticated
  using (
    student_id in (
      select id from public.student_profiles where user_id = auth.uid()
    )
  );

drop policy if exists "Students can delete own resume analyses" on public.resume_analyses;
create policy "Students can delete own resume analyses"
  on public.resume_analyses for delete
  to authenticated
  using (
    student_id in (
      select id from public.student_profiles where user_id = auth.uid()
    )
  );

-- RLS: Only service_role can insert or update verified AI analysis results
drop policy if exists "Service role can manage resume analyses" on public.resume_analyses;
create policy "Service role can manage resume analyses"
  on public.resume_analyses for all
  to service_role
  using (true)
  with check (true);

-- 2. Recruiter Invitations & Access Management Table
create table if not exists public.recruiter_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  company_id uuid not null references public.companies(id) on delete cascade,
  designation text not null default 'Talent Acquisition Partner',
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  invited_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  accepted_at timestamptz
);

create index if not exists idx_recruiter_invites_email on public.recruiter_invitations(email);
create index if not exists idx_recruiter_invites_company on public.recruiter_invitations(company_id);

alter table public.recruiter_invitations enable row level security;

-- RLS: Only Placement Administrators can view and manage recruiter invitations
drop policy if exists "Placement administrators can view invitations" on public.recruiter_invitations;
create policy "Placement administrators can view invitations"
  on public.recruiter_invitations for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'placement_admin'
    )
  );

drop policy if exists "Placement administrators can manage invitations" on public.recruiter_invitations;
create policy "Placement administrators can manage invitations"
  on public.recruiter_invitations for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'placement_admin'
    )
  );
