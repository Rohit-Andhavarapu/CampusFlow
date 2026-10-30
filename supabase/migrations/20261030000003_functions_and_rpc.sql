-- ==============================================================================
-- CampusFlow V4 - Supabase Migration: 003_functions_and_rpc.sql
-- Problem Statement: HACK-P410 (Campus Recruitment Portal)
-- Functions: Eligibility Engine, Atomic Application Submission, State Machine, Analytics
-- ==============================================================================

-- ==============================================================================
-- 6. AUTHENTICATION & INTEGRITY TRIGGERS
-- ==============================================================================

-- A. Public Registration Trigger: NEVER TRUST USER METADATA FOR ROLE
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_full_name text;
begin
  -- Every public registration is strictly assigned 'student'.
  -- Privileged accounts must be promoted via trusted administrative setup.
  v_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, v_full_name, 'student'::user_role_type)
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    updated_at = now();

  -- Only create student profile if one doesn't exist yet for this user or email
  if not exists (select 1 from public.student_profiles where user_id = new.id or email = new.email) then
    insert into public.student_profiles (
      user_id,
      full_name,
      email,
      roll_number,
      branch,
      graduation_year,
      cgpa,
      active_backlogs
    )
    values (
      new.id,
      v_full_name,
      new.email,
      'N25H' || lpad((floor(random() * 900000 + 100000)::bigint)::text, 6, '0'),
      'Computer Science & Engineering',
      2026,
      8.50,
      0
    );
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- B. Prevent Privilege Escalation on profiles.role
create or replace function public.protect_profile_role()
returns trigger as $$
begin
  if new.role is distinct from old.role then
    -- Allow direct database superuser, service_role, or authenticated placement_admin
    if auth.uid() is not null and coalesce(auth.role(), '') != 'service_role' and not public.is_admin() then
      raise exception 'Forbidden: Privilege escalation denied. Only placement administrators can modify user roles.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_protect_profile_role on public.profiles;
create trigger trg_protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- C. Protect Academic Standing from Student Direct Modifications
create or replace function public.protect_student_academic_records()
returns trigger as $$
begin
  -- Allow direct database superuser, service_role, or authenticated placement_admin
  if auth.uid() is not null and coalesce(auth.role(), '') != 'service_role' and not public.is_admin() then
    if new.cgpa is distinct from old.cgpa or
       new.active_backlogs is distinct from old.active_backlogs or
       new.roll_number is distinct from old.roll_number or
       new.branch is distinct from old.branch or
       new.graduation_year is distinct from old.graduation_year or
       new.course is distinct from old.course then
      raise exception 'Forbidden: Verified academic records (CGPA, Roll Number, Branch, Graduation Year, Backlogs) cannot be modified by students. Contact the Training & Placement Cell.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_protect_student_academic_records on public.student_profiles;
create trigger trg_protect_student_academic_records
  before update on public.student_profiles
  for each row execute function public.protect_student_academic_records();

-- D. Auto Updated_At Trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_student_profiles_updated_at on public.student_profiles;
create trigger trg_student_profiles_updated_at
  before update on public.student_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_job_postings_updated_at on public.job_postings;
create trigger trg_job_postings_updated_at
  before update on public.job_postings
  for each row execute function public.set_updated_at();

drop trigger if exists trg_applications_updated_at on public.applications;
create trigger trg_applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

drop trigger if exists trg_interviews_updated_at on public.interviews;
create trigger trg_interviews_updated_at
  before update on public.interviews
  for each row execute function public.set_updated_at();


-- ==============================================================================
-- 8. BUSINESS LOGIC RPC FUNCTIONS
-- ==============================================================================

-- A. Explainable Server-Side Eligibility Checker
create or replace function public.evaluate_job_eligibility(
  p_job_id uuid,
  p_student_id uuid
)
returns jsonb as $$
declare
  v_user_id uuid := auth.uid();
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
  v_job_company_id uuid;
begin
  select sp.*, p.full_name as profile_full_name, p.email as profile_email
  into v_student
  from public.student_profiles sp
  left join public.profiles p on p.id = sp.user_id
  where sp.id = p_student_id;

  if not found then
    return jsonb_build_object(
      'is_eligible', false,
      'is_incomplete', true,
      'reasons', array['Student academic profile record not found. Please complete your profile.'],
      'criteria', '[]'::jsonb
    );
  end if;

  -- Privacy Protection: Student, authorized recruiter for company, or admin
  select company_id into v_job_company_id from public.job_postings where id = p_job_id;
  if v_user_id is not null then
    if v_student.user_id != v_user_id
       and not public.is_admin()
       and not (v_job_company_id is not null and public.is_recruiter_for_company(v_job_company_id)) then
      raise exception 'Forbidden: You do not have permissions to evaluate eligibility for this student.';
    end if;
  end if;

  -- Completeness Check
  if v_student.roll_number is null or v_student.branch is null or v_student.cgpa is null then
    v_is_incomplete := true;
    v_reasons := array_append(v_reasons, 'Mandatory academic credentials (Roll No, Branch, CGPA) are missing.');
  end if;

  -- Fetch Skills
  select coalesce(array_agg(skill_name), array[]::text[])
  into v_student_skills
  from public.student_skills
  where student_id = p_student_id;

  -- Fetch Rules
  select *
  into v_rule
  from public.job_eligibility_rules
  where job_id = p_job_id;

  if not found then
    return jsonb_build_object(
      'is_eligible', not v_is_incomplete,
      'is_incomplete', v_is_incomplete,
      'reasons', case when v_is_incomplete then v_reasons else array['Open to all registered candidates with completed profiles.'] end,
      'criteria', '[]'::jsonb
    );
  end if;

  -- 1. CGPA Criterion (MANDATORY)
  v_cgpa_passed := (v_student.cgpa >= v_rule.minimum_cgpa);
  if not v_cgpa_passed then
    v_reasons := array_append(v_reasons, format('CGPA %s is below required cutoff of %s.', v_student.cgpa, v_rule.minimum_cgpa));
  end if;
  v_criteria := array_append(v_criteria, jsonb_build_object(
    'id', 'cgpa',
    'label', 'Minimum CGPA Cutoff',
    'requiredValue', format('≥ %s', v_rule.minimum_cgpa),
    'studentValue', v_student.cgpa::text,
    'passed', v_cgpa_passed,
    'missingData', false
  ));

  -- 2. Backlogs Criterion (MANDATORY)
  v_backlogs_passed := (v_student.active_backlogs <= v_rule.maximum_backlogs);
  if not v_backlogs_passed then
    v_reasons := array_append(v_reasons, format('Active backlogs (%s) exceed allowed maximum (%s).', v_student.active_backlogs, v_rule.maximum_backlogs));
  end if;
  v_criteria := array_append(v_criteria, jsonb_build_object(
    'id', 'backlogs',
    'label', 'Active Backlogs',
    'requiredValue', format('≤ %s backlogs', v_rule.maximum_backlogs),
    'studentValue', format('%s active', v_student.active_backlogs),
    'passed', v_backlogs_passed,
    'missingData', false
  ));

  -- 3. Branch Criterion (MANDATORY)
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

  -- 4. Graduation Year Criterion (MANDATORY)
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

  -- 5. Required Skills Criterion (Informational / Core Competency check)
  if cardinality(v_rule.required_skills) > 0 then
    select array_agg(req)
    into v_missing_skills
    from unnest(v_rule.required_skills) req
    where not exists (
      select 1 from unnest(v_student_skills) s
      where lower(trim(s)) = lower(trim(req))
    );

    v_skills_passed := (v_missing_skills is null or cardinality(v_missing_skills) = 0);
    if not v_skills_passed then
      v_reasons := array_append(v_reasons, format('Recommended skills missing: %s', array_to_string(v_missing_skills, ', ')));
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

-- B. Atomic Application Submission RPC
create or replace function public.submit_application(p_job_id uuid)
returns jsonb as $$
declare
  v_user_id uuid := auth.uid();
  v_role user_role_type;
  v_student_id uuid;
  v_job record;
  v_eligibility jsonb;
  v_app_id uuid;
begin
  if v_user_id is null then
    return jsonb_build_object('success', false, 'message', 'Unauthorized: Please log in to submit an application.');
  end if;

  select role into v_role from public.profiles where id = v_user_id;
  if v_role != 'student' then
    return jsonb_build_object('success', false, 'message', 'Forbidden: Only verified student accounts can apply.');
  end if;

  select id into v_student_id from public.student_profiles where user_id = v_user_id;
  if v_student_id is null then
    return jsonb_build_object('success', false, 'message', 'Profile Incomplete: Please complete your academic profile.');
  end if;

  select j.*, c.name as company_name
  into v_job
  from public.job_postings j
  join public.companies c on c.id = j.company_id
  where j.id = p_job_id
  for share of j;

  if not found then
    return jsonb_build_object('success', false, 'message', 'Job opening not found.');
  end if;

  if v_job.status != 'active' then
    return jsonb_build_object('success', false, 'message', 'This job opening is no longer accepting applications.');
  end if;

  if v_job.deadline < now() then
    return jsonb_build_object('success', false, 'message', 'Application deadline has expired.');
  end if;

  v_eligibility := public.evaluate_job_eligibility(p_job_id, v_student_id);
  if not (v_eligibility->>'is_eligible')::boolean then
    return jsonb_build_object(
      'success', false,
      'message', 'Eligibility criteria not met: ' || coalesce(v_eligibility->'reasons'->>0, 'Cutoff criteria not met.'),
      'eligibility', v_eligibility
    );
  end if;

  if exists (
    select 1 from public.applications
    where student_id = v_student_id
      and job_id = p_job_id
      and status != 'withdrawn'
  ) then
    return jsonb_build_object('success', false, 'message', 'You have already submitted an active application for this opening.');
  end if;

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

-- C. Application Status State Machine & Recruiter Review RPC
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
  select a.*, j.company_id, j.title as job_title, c.name as company_name, sp.user_id as student_user_id
  into v_app
  from public.applications a
  join public.job_postings j on j.id = a.job_id
  join public.companies c on c.id = j.company_id
  join public.student_profiles sp on sp.id = a.student_id
  where a.id = p_application_id
  for update of a;

  if not found then
    return jsonb_build_object('success', false, 'message', 'Application record not found.');
  end if;

  if not (public.is_admin() or public.is_recruiter_for_company(v_app.company_id)) then
    return jsonb_build_object('success', false, 'message', 'Forbidden: You do not have permissions to evaluate applicants for this company.');
  end if;

  case v_app.status
    when 'submitted' then
      v_allowed := (p_new_status in ('shortlisted', 'rejected'));
    when 'shortlisted' then
      v_allowed := (p_new_status in ('interview', 'rejected'));
    when 'interview' then
      v_allowed := (p_new_status in ('selected', 'rejected'));
    when 'selected' then
      v_allowed := false;
    when 'rejected' then
      v_allowed := false;
    when 'withdrawn' then
      v_allowed := false;
    else
      v_allowed := false;
  end case;

  if not v_allowed then
    return jsonb_build_object(
      'success', false,
      'message', format('Invalid state transition from "%s" to "%s". Terminal or non-sequential transitions are prohibited.', v_app.status, p_new_status)
    );
  end if;

  update public.applications
  set status = p_new_status,
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
    p_new_status,
    v_user_id,
    coalesce(p_reason, format('Candidate status transitioned to %s.', p_new_status)),
    now()
  );

  if v_app.student_user_id is not null then
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
  end if;

  return jsonb_build_object(
    'success', true,
    'previous_status', v_app.status,
    'new_status', p_new_status,
    'message', format('Candidate status successfully updated to %s.', p_new_status)
  );
end;
$$ language plpgsql security definer set search_path = public;

-- D. Application Withdrawal RPC
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

-- E. Interview Scheduling RPC
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

  if v_app.status = 'shortlisted' then
    perform public.update_application_status(
      p_application_id,
      'interview',
      format('Interview scheduled: %s on %s', p_round, to_char(p_scheduled_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI UTC'))
    );
  end if;

  if v_app.student_user_id is not null then
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
  end if;

  return jsonb_build_object(
    'success', true,
    'interview_id', v_interview_id,
    'message', format('Successfully scheduled %s for candidate.', p_round)
  );
end;
$$ language plpgsql security definer set search_path = public;

-- F. Placement Analytics RPC (Zero Double-Counting)
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

  select count(distinct student_id)
  into v_placed_students
  from public.applications
  where status = 'selected';

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

