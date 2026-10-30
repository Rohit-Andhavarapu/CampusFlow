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
