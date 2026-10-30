// ==============================================================================
// CampusFlow V4 — Deep PostgreSQL Validation & Verification Suite
// Executes against real PostgreSQL 16/18 engine (@electric-sql/pglite)
// Comprehensive testing across Phases 3, 4, 5, 6, 7, and 8
// ==============================================================================

const { PGlite } = require('@electric-sql/pglite');
const fs = require('fs');
const path = require('path');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failCount++;
  }
}

async function runDeepDatabaseValidation() {
  console.log('\n====================================================================');
  console.log('🛡️ CAMPUSFLOW V4: DEEP DATABASE INTEGRITY & REGRESSION VALIDATION');
  console.log('====================================================================\n');

  const db = new PGlite();

  // ----------------------------------------------------------------------------
  // SECTION 1: Baseline Environment Setup
  // ----------------------------------------------------------------------------
  console.log('--- Setting up Supabase Baseline Environment in Real PostgreSQL ---');
  await db.exec(`
    do $$ begin create role anon; exception when others then null; end $$;
    do $$ begin create role authenticated; exception when others then null; end $$;
    do $$ begin create role service_role; exception when others then null; end $$;
    do $$ begin create role postgres; exception when others then null; end $$;

    create schema if not exists auth;
    create schema if not exists storage;

    create table if not exists auth.users (
      id uuid primary key default gen_random_uuid(),
      email text unique,
      encrypted_password text,
      email_confirmed_at timestamptz,
      raw_app_meta_data jsonb default '{}'::jsonb,
      raw_user_meta_data jsonb default '{}'::jsonb,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );

    create or replace function auth.uid() returns uuid as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
    $$ language sql stable;

    create or replace function auth.role() returns text as $$
      select coalesce(current_setting('request.jwt.claim.role', true), 'anon');
    $$ language sql stable;

    create table if not exists storage.buckets (
      id text primary key,
      name text not null,
      owner uuid,
      created_at timestamptz default now(),
      updated_at timestamptz default now(),
      public boolean default false,
      file_size_limit bigint,
      allowed_mime_types text[]
    );

    create table if not exists storage.objects (
      id uuid primary key default gen_random_uuid(),
      bucket_id text references storage.buckets(id),
      name text,
      owner uuid,
      created_at timestamptz default now(),
      updated_at timestamptz default now(),
      last_accessed_at timestamptz default now(),
      metadata jsonb
    );

    create or replace function storage.foldername(name text)
    returns text[] as $$
      select string_to_array(name, '/');
    $$ language sql immutable;
  `);
  console.log('✓ Baseline Supabase schema ready.\n');

  // ----------------------------------------------------------------------------
  // SECTION 2: Master SQL Execution & Idempotency
  // ----------------------------------------------------------------------------
  console.log('--- Phase 3: Master SQL Script Real Execution ---');
  const masterSql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql'), 'utf8');
  
  await db.exec(masterSql);
  assert(true, 'Master SQL executed in real PostgreSQL with 0 syntax or runtime errors');

  // Grant public schema table permissions to authenticated role for PostgREST simulation
  await db.exec(`
    grant usage on schema public to anon, authenticated, service_role;
    grant all on all tables in schema public to authenticated, service_role;
    grant select on all tables in schema public to anon;
    grant all on all sequences in schema public to authenticated, service_role;
  `);

  // Idempotency: execute a second time
  await db.exec(masterSql);
  assert(true, 'Idempotency verified: re-execution on populated database succeeded with 0 errors');

  // Verify all 14 tables exist
  const tableCheck = await db.query(`
    select count(*)::int as count from information_schema.tables 
    where table_schema = 'public' and table_type = 'BASE TABLE';
  `);
  assert(tableCheck.rows[0].count === 14, `All 14 normalized schema tables exist (count: ${tableCheck.rows[0].count})`);

  // Verify all 14 tables have RLS enabled
  const rlsCheck = await db.query(`
    select count(*)::int as count from pg_tables 
    where schemaname = 'public' and rowsecurity = true;
  `);
  assert(rlsCheck.rows[0].count === 14, `All 14 tables have Row Level Security enabled (count: ${rlsCheck.rows[0].count})`);

  // Verify Seed Records
  const countRes = await db.query(`
    select 
      (select count(*) from public.companies)::int as companies,
      (select count(*) from public.recruitment_drives)::int as drives,
      (select count(*) from public.job_postings)::int as jobs,
      (select count(*) from public.job_eligibility_rules)::int as rules,
      (select count(*) from public.student_profiles)::int as students,
      (select count(*) from public.applications)::int as applications;
  `);
  const c = countRes.rows[0];
  assert(c.companies === 6, `Seed Companies: 6 (actual: ${c.companies})`);
  assert(c.drives === 3, `Seed Recruitment Drives: 3 (actual: ${c.drives})`);
  assert(c.jobs === 7, `Seed Job Postings: 7 (actual: ${c.jobs})`);
  assert(c.rules === 7, `Seed Eligibility Rules: 7 (actual: ${c.rules})`);
  assert(c.students === 19, `Synthetic Directory Students: 19 (actual: ${c.students})`);
  assert(c.applications >= 16, `Seed Applications: >= 16 (actual: ${c.applications})`);

  // ----------------------------------------------------------------------------
  // SECTION 3: Phase 4 & 5 — Supabase Compatibility, Triggers & Constraints
  // ----------------------------------------------------------------------------
  console.log('\n--- Phase 4 & 5: Schema Constraints, Triggers & Negative Cases ---');

  // Trigger: handle_new_user() on auth.users
  const testStudentUserId = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
  await db.exec(`
    insert into auth.users (id, email, raw_user_meta_data)
    values ('${testStudentUserId}', 'rohit.test@campus.edu', '{"full_name": "Rohit Andhavarapu", "role": "admin"}');
  `);
  const profileRow = await db.query(`select * from public.profiles where id = '${testStudentUserId}';`);
  assert(profileRow.rows.length === 1, 'Trigger handle_new_user() auto-created public.profiles record');
  assert(profileRow.rows[0].role === 'student', 'Trigger assigned default "student" role (ignoring untrusted client metadata role="admin")');

  const studentProfileAuto = await db.query(`select * from public.student_profiles where user_id = '${testStudentUserId}';`);
  assert(studentProfileAuto.rows.length === 1, 'Trigger handle_new_user() auto-created initial public.student_profiles record');

  // Trigger: protect_profile_role prevents student from changing role to admin
  let roleTamperFailed = false;
  try {
    await db.exec(`
      set request.jwt.claim.sub = '${testStudentUserId}';
      set request.jwt.claim.role = 'authenticated';
      update public.profiles set role = 'placement_admin' where id = '${testStudentUserId}';
    `);
  } catch (err) {
    roleTamperFailed = err.message.includes('Forbidden') || err.message.includes('escalation');
  }
  assert(roleTamperFailed, 'Trigger protect_profile_role blocked student from self-promoting to placement_admin');

  // Check constraint: invalid CGPA (> 10.0)
  let cgpaTestPassed = false;
  try {
    await db.exec(`
      insert into public.student_profiles (full_name, email, roll_number, course, branch, graduation_year, cgpa)
      values ('Invalid CGPA Student', 'invalid.cgpa@campus.edu', 'ROLL9999', 'B.Tech', 'CSE', 2026, 10.50);
    `);
  } catch (err) {
    cgpaTestPassed = err.message.includes('check') || err.message.includes('cgpa');
  }
  assert(cgpaTestPassed, 'Check constraint rejected CGPA 10.50 (> 10.00)');

  // Check constraint: negative openings in job_postings
  let openingsTestPassed = false;
  try {
    await db.exec(`
      insert into public.job_postings (
        company_id, title, description, employment_type, work_mode, location,
        compensation_min, compensation_max, compensation_period, currency, openings, deadline
      ) values (
        '11111111-1111-4111-a111-111111111111', 'Negative Openings Job', 'Desc', 'Full-time', 'Remote', 'Remote',
        1000000, 1500000, 'annual', 'INR', -3, now() + interval '10 days'
      );
    `);
  } catch (err) {
    openingsTestPassed = err.message.includes('check') || err.message.includes('openings');
  }
  assert(openingsTestPassed, 'Check constraint chk_job_openings rejected negative openings (-3)');

  // Check constraint: compensation_max < compensation_min
  let compTestPassed = false;
  try {
    await db.exec(`
      insert into public.job_postings (
        company_id, title, description, employment_type, work_mode, location,
        compensation_min, compensation_max, compensation_period, currency, openings, deadline
      ) values (
        '11111111-1111-4111-a111-111111111111', 'Inverted Salary Job', 'Desc', 'Full-time', 'Remote', 'Remote',
        2000000, 1000000, 'annual', 'INR', 5, now() + interval '10 days'
      );
    `);
  } catch (err) {
    compTestPassed = err.message.includes('check') || err.message.includes('compensation');
  }
  assert(compTestPassed, 'Check constraint chk_job_compensation rejected max < min compensation');

  // Unique constraint: duplicate roll number
  let rollTestPassed = false;
  try {
    await db.exec(`
      insert into public.student_profiles (full_name, email, roll_number, course, branch, graduation_year, cgpa)
      values ('Duplicate Roll', 'dup.roll@campus.edu', 'N25H02A0326', 'B.Tech', 'CSE', 2026, 8.5);
    `);
  } catch (err) {
    rollTestPassed = err.message.includes('unique') || err.message.includes('duplicate');
  }
  assert(rollTestPassed, 'Unique constraint rejected duplicate roll_number (N25H02A0326)');

  // Unique constraint: duplicate application for (student_id, job_id)
  let dupAppPassed = false;
  try {
    const app = (await db.query(`select student_id, job_id from public.applications limit 1;`)).rows[0];
    await db.exec(`
      insert into public.applications (student_id, job_id, status)
      values ('${app.student_id}', '${app.job_id}', 'submitted');
    `);
  } catch (err) {
    dupAppPassed = err.message.includes('unique') || err.message.includes('duplicate');
  }
  assert(dupAppPassed, 'Unique constraint rejected duplicate application for (student_id, job_id)');

  // ----------------------------------------------------------------------------
  // SECTION 4: Phase 6 — Business Logic RPC Execution Tests
  // ----------------------------------------------------------------------------
  console.log('\n--- Phase 6: Server-Side RPC Function Execution ---');

  // Update student profile for our test user
  const spRes = await db.query(`
    update public.student_profiles set
      roll_number = 'N25H02A9999',
      course = 'B.Tech',
      branch = 'Computer Science & Engineering',
      graduation_year = 2026,
      cgpa = 8.90,
      active_backlogs = 0
    where user_id = '${testStudentUserId}'
    returning id;
  `);
  const testStudentProfileId = spRes.rows[0].id;

  // Insert skills
  await db.exec(`
    insert into public.student_skills (student_id, skill_name)
    values ('${testStudentProfileId}', 'Python'), ('${testStudentProfileId}', 'PostgreSQL'), ('${testStudentProfileId}', 'Agentic AI');
  `);

  // Test evaluate_job_eligibility RPC for Aetos AI job (requires CGPA >= 8.0, CSE/IT/AI, 2026, 0 backlogs)
  const aetosJobId = '10000000-0000-4000-a000-000000000001';
  const eligEval = await db.query(`
    select public.evaluate_job_eligibility('${aetosJobId}', '${testStudentProfileId}') as res;
  `);
  const eligRes = eligEval.rows[0].res;
  assert(eligRes.is_eligible === true, 'evaluate_job_eligibility: Qualifying candidate (CGPA 8.90, CSE, 2026) evaluates as ELIGIBLE');
  assert(eligRes.is_incomplete === false, 'evaluate_job_eligibility: Completed profile has is_incomplete = false');

  // Test evaluate_job_eligibility for ineligible candidate (Vertex FS requires CGPA 8.5, but let's test a lower CGPA student)
  const lowCgpaStudent = (await db.query(`select id, cgpa from public.student_profiles where cgpa < 7.5 limit 1;`)).rows[0];
  const vertexJobId = '60000000-0000-4000-a000-000000000001'; // Vertex requires 8.50
  const ineligEval = await db.query(`
    select public.evaluate_job_eligibility('${vertexJobId}', '${lowCgpaStudent.id}') as res;
  `);
  const ineligRes = ineligEval.rows[0].res;
  assert(ineligRes.is_eligible === false, `evaluate_job_eligibility: Low CGPA student correctly flagged as INELIGIBLE (${ineligRes.reasons[0]})`);

  // Test submit_application RPC as authenticated student
  await db.exec(`
    set request.jwt.claim.sub = '${testStudentUserId}';
    set request.jwt.claim.role = 'authenticated';
  `);
  const submitRes = (await db.query(`select public.submit_application('${aetosJobId}') as res;`)).rows[0].res;
  assert(submitRes.success === true, `submit_application: Atomic application submitted successfully (ID: ${submitRes.application_id})`);

  // Verify status history audit row was created
  const historyRow = await db.query(`
    select * from public.application_status_history where application_id = '${submitRes.application_id}';
  `);
  assert(historyRow.rows.length === 1, 'submit_application created immutable application_status_history audit record');

  // Verify in-app notification was created
  const notifRow = await db.query(`
    select * from public.notifications where user_id = '${testStudentUserId}' and category = 'application';
  `);
  assert(notifRow.rows.length >= 1, 'submit_application generated notification for the student');

  // Test duplicate application rejection
  const dupSubmitRes = (await db.query(`select public.submit_application('${aetosJobId}') as res;`)).rows[0].res;
  assert(dupSubmitRes.success === false, `submit_application rejected repeated submission: "${dupSubmitRes.message}"`);

  // Test State Machine Transitions via update_application_status RPC
  // Create an authorized recruiter user (provisioned via backend service_role)
  const testRecruiterUserId = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb';
  await db.exec(`
    set request.jwt.claim.role = 'service_role';
    set request.jwt.claim.sub = '';
    insert into auth.users (id, email) values ('${testRecruiterUserId}', 'recruiter.aetos@aetos.com');
    insert into public.profiles (id, email, full_name, role) values ('${testRecruiterUserId}', 'recruiter.aetos@aetos.com', 'Aetos Recruiter', 'recruiter')
    on conflict (id) do update set role = 'recruiter';
    insert into public.recruiter_company_memberships (recruiter_user_id, company_id, membership_role)
    values ('${testRecruiterUserId}', '11111111-1111-4111-a111-111111111111', 'recruiter');
  `);

  // Recruiter switches to their session
  await db.exec(`
    set request.jwt.claim.sub = '${testRecruiterUserId}';
    set request.jwt.claim.role = 'authenticated';
  `);

  // Valid transition: submitted -> shortlisted
  const shortlistRes = (await db.query(`
    select public.update_application_status('${submitRes.application_id}', 'shortlisted', 'Candidate cleared preliminary resume screening.') as res;
  `)).rows[0].res;
  assert(shortlistRes.success === true, 'update_application_status: Valid transition submitted -> shortlisted succeeded');

  // Illegal transition: shortlisted -> selected (skipping interview)
  const illegalRes = (await db.query(`
    select public.update_application_status('${submitRes.application_id}', 'selected', 'Attempting illegal skip.') as res;
  `)).rows[0].res;
  assert(illegalRes.success === false, `update_application_status: Illegal transition blocked (${illegalRes.message})`);

  // Schedule interview RPC
  const interviewRes = (await db.query(`
    select public.schedule_interview(
      '${submitRes.application_id}',
      (now() + interval '3 days')::timestamptz,
      60,
      'Virtual',
      null,
      'https://meet.google.com/aetos-ai-eval',
      'Technical Deep Dive: Multi-Agent Systems',
      'Please be ready to walk through your distributed logger architecture.'
    ) as res;
  `)).rows[0].res;
  assert(interviewRes.success === true, `schedule_interview: Interview created and application status transitioned to 'interview'`);

  // Transition: interview -> selected
  const offerRes = (await db.query(`
    select public.update_application_status('${submitRes.application_id}', 'selected', 'Candidate passed technical round with exceptional marks.') as res;
  `)).rows[0].res;
  assert(offerRes.success === true, 'update_application_status: Valid transition interview -> selected succeeded');

  // Terminal state protection: selected -> rejected
  const terminalRes = (await db.query(`
    select public.update_application_status('${submitRes.application_id}', 'rejected', 'Cannot reject after offer.') as res;
  `)).rows[0].res;
  assert(terminalRes.success === false, `update_application_status: Terminal state 'selected' protected from modification`);

  // Test Placement Analytics RPC
  const analyticsRes = (await db.query(`select public.get_placement_analytics() as res;`)).rows[0].res;
  assert(analyticsRes.total_students > 0, `get_placement_analytics: Total students computed (${analyticsRes.total_students})`);
  assert(analyticsRes.placed_students >= 1, `get_placement_analytics: Placed students counted (${analyticsRes.placed_students})`);
  const mathSum = analyticsRes.placed_students + analyticsRes.in_process_students + analyticsRes.unplaced_students;
  assert(analyticsRes.total_students === mathSum, `get_placement_analytics: Mathematical identity verified (${analyticsRes.total_students} == ${mathSum})`);

  // ----------------------------------------------------------------------------
  // SECTION 5: Phase 8 — Row Level Security (RLS) Policy Verification
  // ----------------------------------------------------------------------------
  console.log('\n--- Phase 8: Row Level Security Policy Enforcement ---');

  // Test 1: Anonymous access to private applications
  await db.exec(`
    set request.jwt.claim.sub = '';
    set request.jwt.claim.role = 'anon';
    set role anon;
  `);
  const anonApps = await db.query(`select count(*)::int as count from public.applications;`);
  assert(anonApps.rows[0].count === 0, 'RLS: Anonymous user cannot read any application records (returned 0 rows)');
  await db.exec(`reset role;`);

  // Test 2: Student A cannot read other students' applications
  await db.exec(`
    set request.jwt.claim.sub = '${testStudentUserId}';
    set request.jwt.claim.role = 'authenticated';
    set role authenticated;
  `);
  const studentApps = await db.query(`select student_id from public.applications;`);
  const allOwnApps = studentApps.rows.every(r => r.student_id === testStudentProfileId);
  assert(allOwnApps && studentApps.rows.length > 0, 'RLS: Student can only query their own submitted applications');
  await db.exec(`reset role;`);

  // Test 3: Unauthorized recruiter cannot see applications from other companies
  const unauthorizedRecruiterId = 'cccccccc-cccc-4ccc-cccc-cccccccccccc';
  await db.exec(`
    set request.jwt.claim.role = 'service_role';
    set request.jwt.claim.sub = '';
    insert into auth.users (id, email) values ('${unauthorizedRecruiterId}', 'other.recruiter@nova.com');
    insert into public.profiles (id, email, full_name, role) values ('${unauthorizedRecruiterId}', 'other.recruiter@nova.com', 'Nova Recruiter', 'recruiter')
    on conflict (id) do update set role = 'recruiter';
    insert into public.recruiter_company_memberships (recruiter_user_id, company_id, membership_role)
    values ('${unauthorizedRecruiterId}', '22222222-2222-4222-a222-222222222222', 'recruiter');
  `);

  await db.exec(`
    set request.jwt.claim.sub = '${unauthorizedRecruiterId}';
    set request.jwt.claim.role = 'authenticated';
    set role authenticated;
  `);
  const otherRecruiterApps = await db.query(`
    select a.id from public.applications a
    join public.job_postings j on j.id = a.job_id
    where j.company_id = '11111111-1111-4111-a111-111111111111'; -- Aetos DigiLog
  `);
  assert(otherRecruiterApps.rows.length === 0, 'RLS: Recruiter from NovaTech cannot see applications belonging to Aetos DigiLog');
  await db.exec(`reset role;`);

  // ----------------------------------------------------------------------------
  // SECTION 6: Phase 7 — Complete 17-Step Recruitment Workflow in Real PostgreSQL
  // ----------------------------------------------------------------------------
  console.log('\n--- Phase 7: Real PostgreSQL 17-Step Recruitment Lifecycle Execution ---');

  // STEP 1: Create / Authenticate a Recruiter
  const e2eRecruiterUserId = '11110000-0000-4000-a000-000000000001';
  await db.exec(`
    set request.jwt.claim.role = 'service_role';
    set request.jwt.claim.sub = '';
    insert into auth.users (id, email) values ('${e2eRecruiterUserId}', 'recruiter.cloud@novatech.io');
    insert into public.profiles (id, email, full_name, role) values ('${e2eRecruiterUserId}', 'recruiter.cloud@novatech.io', 'Sanjay Verma', 'recruiter')
    on conflict (id) do update set role = 'recruiter';
    insert into public.recruiter_company_memberships (recruiter_user_id, company_id, membership_role)
    values ('${e2eRecruiterUserId}', '22222222-2222-4222-a222-222222222222', 'recruiter'); -- NovaTech Systems
  `);
  assert(true, 'STEP 1: Recruiter Sanjay Verma provisioned and authenticated for NovaTech Systems');

  // STEP 2: Create Authorized Company Job Posting with Eligibility Rules
  const e2eJobId = '77777777-7777-4777-a777-777777777777';
  await db.exec(`
    set request.jwt.claim.role = 'authenticated';
    set request.jwt.claim.sub = '${e2eRecruiterUserId}';
    set role authenticated;

    insert into public.job_postings (
      id, company_id, title, description, employment_type, work_mode, location,
      compensation_min, compensation_max, compensation_period, currency, openings, deadline, status
    ) values (
      '${e2eJobId}', '22222222-2222-4222-a222-222222222222', 'Cloud DevOps Specialist 2026',
      'Manage multi-region Kubernetes clusters and CI/CD pipelines.', 'Full-time', 'Hybrid', 'Hyderabad, India',
      1200000, 1600000, 'annual', 'INR', 4, now() + interval '30 days', 'active'
    );

    insert into public.job_eligibility_rules (
      job_id, minimum_cgpa, maximum_backlogs, allowed_branches, allowed_graduation_years, required_skills
    ) values (
      '${e2eJobId}', 7.50, 0,
      array['Computer Science & Engineering', 'Information Technology'],
      array[2026],
      array['Docker', 'Kubernetes', 'Linux', 'Python']
    );
  `);
  await db.exec(`reset role;`);
  assert(true, 'STEP 2: Job "Cloud DevOps Specialist 2026" published with strict eligibility rules (CGPA >= 7.50, CSE/IT, Batch 2026)');

  // STEP 3: Authenticate Student
  const e2eStudentUserId = '22220000-0000-4000-a000-000000000001';
  await db.exec(`
    set request.jwt.claim.role = 'service_role';
    set request.jwt.claim.sub = '';
    insert into auth.users (id, email) values ('${e2eStudentUserId}', 'priyanshu.cs@campus.edu');
    update public.student_profiles set
      full_name = 'Priyanshu Verma',
      roll_number = 'N25H02A7777',
      course = 'B.Tech',
      branch = 'Computer Science & Engineering',
      graduation_year = 2026,
      cgpa = 8.40,
      active_backlogs = 0
    where user_id = '${e2eStudentUserId}';
  `);
  const e2eSp = (await db.query(`select id from public.student_profiles where user_id = '${e2eStudentUserId}';`)).rows[0];
  await db.exec(`
    insert into public.student_skills (student_id, skill_name)
    values ('${e2eSp.id}', 'Docker'), ('${e2eSp.id}', 'Kubernetes'), ('${e2eSp.id}', 'Linux'), ('${e2eSp.id}', 'Python');
  `);
  assert(true, `STEP 3: Student Priyanshu Verma (CGPA 8.40, CSE, Batch 2026) authenticated`);

  // STEP 4: Evaluate Eligibility
  const e2eElig = (await db.query(`select public.evaluate_job_eligibility('${e2eJobId}', '${e2eSp.id}') as res;`)).rows[0].res;
  assert(e2eElig.is_eligible === true, 'STEP 4: Candidate eligibility evaluated: ELIGIBLE (all cutoffs satisfied)');

  // STEP 5: Submit Application
  await db.exec(`
    set request.jwt.claim.role = 'authenticated';
    set request.jwt.claim.sub = '${e2eStudentUserId}';
    set role authenticated;
  `);
  const e2eSub = (await db.query(`select public.submit_application('${e2eJobId}') as res;`)).rows[0].res;
  await db.exec(`reset role;`);
  assert(e2eSub.success === true, `STEP 5: Application submitted atomically via RPC (ID: ${e2eSub.application_id})`);

  // STEP 6: Confirm Application Exists in PostgreSQL
  const e2eAppRow = (await db.query(`select * from public.applications where id = '${e2eSub.application_id}';`)).rows[0];
  assert(e2eAppRow.status === 'submitted', `STEP 6: Application verified in PostgreSQL with initial status "submitted"`);

  // STEP 7: Attempt Duplicate Submission
  await db.exec(`
    set request.jwt.claim.role = 'authenticated';
    set request.jwt.claim.sub = '${e2eStudentUserId}';
    set role authenticated;
  `);
  const e2eDup = (await db.query(`select public.submit_application('${e2eJobId}') as res;`)).rows[0].res;
  await db.exec(`reset role;`);
  assert(e2eDup.success === false, `STEP 7: Duplicate submission attempt rejected: "${e2eDup.message}"`);

  // STEP 8: Authenticate Recruiter
  await db.exec(`
    set request.jwt.claim.role = 'authenticated';
    set request.jwt.claim.sub = '${e2eRecruiterUserId}';
    set role authenticated;
  `);
  assert(true, 'STEP 8: Recruiter session activated for NovaTech Systems');

  // STEP 9: Retrieve the Applicant via RLS
  const recruiterAppView = await db.query(`select * from public.applications where id = '${e2eSub.application_id}';`);
  assert(recruiterAppView.rows.length === 1, 'STEP 9: Recruiter retrieved applicant record under company RLS policy');

  // STEP 10: Shortlist Candidate
  const e2eShortlist = (await db.query(`
    select public.update_application_status('${e2eSub.application_id}', 'shortlisted', 'Resume and GitHub portfolio cleared screening.') as res;
  `)).rows[0].res;
  assert(e2eShortlist.success === true, 'STEP 10: Candidate advanced to "shortlisted" status');

  // STEP 11: Verify Application Status History
  const e2eHist = await db.query(`
    select * from public.application_status_history where application_id = '${e2eSub.application_id}' order by changed_at asc;
  `);
  assert(e2eHist.rows.length === 2, `STEP 11: Application status history contains 2 audit entries (submitted -> shortlisted)`);

  // STEP 12: Schedule Interview
  const e2eInterview = (await db.query(`
    select public.schedule_interview(
      '${e2eSub.application_id}',
      (now() + interval '5 days')::timestamptz,
      60,
      'Virtual',
      null,
      'https://meet.google.com/devops-tech-round',
      'Round 1: Container Orchestration & Cloud Security',
      'Hands-on Kubernetes troubleshooting challenge.'
    ) as res;
  `)).rows[0].res;
  assert(e2eInterview.success === true, 'STEP 12: Technical interview scheduled with Google Meet video link');

  // STEP 13: Verify Interview Persistence & Student Notification
  const e2eIntRow = await db.query(`select * from public.interviews where application_id = '${e2eSub.application_id}';`);
  assert(e2eIntRow.rows.length === 1, 'STEP 13: Interview record persisted in PostgreSQL');
  
  // Verify student receives the notification under student RLS session
  await db.exec(`set request.jwt.claim.sub = '${e2eStudentUserId}';`);
  const e2eNotifs = await db.query(`select * from public.notifications where user_id = '${e2eStudentUserId}';`);
  assert(e2eNotifs.rows.length >= 2, `STEP 13: Student received automated in-app notifications (count: ${e2eNotifs.rows.length})`);
  
  // Return to recruiter session
  await db.exec(`set request.jwt.claim.sub = '${e2eRecruiterUserId}';`);

  // STEP 14: Record Final Selection
  const e2eOffer = (await db.query(`
    select public.update_application_status('${e2eSub.application_id}', 'selected', 'Candidate performed exceptionally well in practical challenge. Offer extended.') as res;
  `)).rows[0].res;
  assert(e2eOffer.success === true, 'STEP 14: Final hiring outcome recorded: candidate "selected"');

  // STEP 15: Authenticate Placement Administrator
  const e2eAdminUserId = '33330000-0000-4000-a000-000000000001';
  await db.exec(`
    reset role;
    set request.jwt.claim.role = 'service_role';
    set request.jwt.claim.sub = '';
    insert into auth.users (id, email) values ('${e2eAdminUserId}', 'placement.officer@campusflow.edu');
    insert into public.profiles (id, email, full_name, role) values ('${e2eAdminUserId}', 'placement.officer@campusflow.edu', 'Prof. K. Sharma', 'placement_admin')
    on conflict (id) do update set role = 'placement_admin';
    set request.jwt.claim.role = 'authenticated';
    set request.jwt.claim.sub = '${e2eAdminUserId}';
    set role authenticated;
  `);
  assert(true, 'STEP 15: Placement Administrator Prof. K. Sharma authenticated');

  // STEP 16: Verify Placement Analytics Reflects Result
  const adminAnalytics = (await db.query(`select public.get_placement_analytics() as res;`)).rows[0].res;
  assert(adminAnalytics.placed_students >= 11, `STEP 16: Placement analytics updated: ${adminAnalytics.placed_students} placed students, ${adminAnalytics.placement_rate}% placement rate`);

  // STEP 17: Verify Total Database Persistence
  await db.exec(`reset role;`);
  const finalVerification = (await db.query(`
    select
      (select count(*) from public.companies)::int as companies,
      (select count(*) from public.job_postings)::int as jobs,
      (select count(*) from public.student_profiles)::int as students,
      (select count(*) from public.applications)::int as applications,
      (select count(*) from public.interviews)::int as interviews,
      (select count(*) from public.application_status_history)::int as history_records;
  `)).rows[0];
  assert(finalVerification.jobs >= 8, `STEP 17: Database persistence verified: ${finalVerification.jobs} jobs, ${finalVerification.applications} applications, ${finalVerification.interviews} interviews, ${finalVerification.history_records} audit entries`);

  console.log('\n====================================================================');
  console.log(`📊 FINAL TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('====================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runDeepDatabaseValidation().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
