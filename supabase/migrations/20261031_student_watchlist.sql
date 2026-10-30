-- ==============================================================================
-- CampusFlow V4.5 — Student Opportunity Watchlist Table & Row Level Security
-- Allows authenticated students to bookmark, monitor, and prioritize campus drives
-- ==============================================================================

create table if not exists public.student_watchlists (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  job_id uuid not null references public.job_postings(id) on delete cascade,
  notes text,
  created_at timestamptz default now(),
  unique(student_id, job_id)
);

-- Index for fast lookup by student and job
create index if not exists idx_student_watchlists_student on public.student_watchlists(student_id);
create index if not exists idx_student_watchlists_job on public.student_watchlists(job_id);

-- Enable RLS
alter table public.student_watchlists enable row level security;

-- RLS Policy: Students can view their own watchlisted opportunities
create policy "Students can view own watchlist"
  on public.student_watchlists for select
  using (
    student_id in (
      select id from public.student_profiles where user_id = auth.uid()
    )
  );

-- RLS Policy: Students can insert opportunities into their own watchlist
create policy "Students can insert own watchlist items"
  on public.student_watchlists for insert
  with check (
    student_id in (
      select id from public.student_profiles where user_id = auth.uid()
    )
  );

-- RLS Policy: Students can delete items from their own watchlist
create policy "Students can delete own watchlist items"
  on public.student_watchlists for delete
  using (
    student_id in (
      select id from public.student_profiles where user_id = auth.uid()
    )
  );

-- Placement Admins can read aggregate watchlist counts for student demand forecasting
create policy "Admins can view all watchlists for demand analytics"
  on public.student_watchlists for select
  using (public.is_admin());
