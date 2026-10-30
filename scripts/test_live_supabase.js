// ==============================================================================
// Live Supabase API & Authorization Test Suite for CampusFlow V4
// Directly connects to the live Supabase instance using publishable key and auth sessions
// ==============================================================================

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
  const env = {};
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const PUBLISHABLE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !PUBLISHABLE_KEY) {
  console.error('Missing Supabase configuration.');
  process.exit(1);
}

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

async function runLiveSupabaseTests() {
  console.log('\n====================================================================');
  console.log('🌐 TESTING LIVE SUPABASE PROJECT CONNECTION & AUTHENTICATION');
  console.log(`URL: ${SUPABASE_URL}`);
  console.log('====================================================================\n');

  // ----------------------------------------------------------------------------
  // 1. Anonymous Client Tests
  // ----------------------------------------------------------------------------
  console.log('--- 1. Testing as Anonymous Client (Public Role) ---');
  const anonClient = createClient(SUPABASE_URL, PUBLISHABLE_KEY);

  // Read public companies
  const { data: companies, error: compErr } = await anonClient.from('companies').select('id, name').limit(10);
  assert(!compErr && companies && companies.length >= 6, `Anonymous client can read public companies (found: ${companies?.length || 0})`);

  // Read active job postings
  const { data: jobs, error: jobsErr } = await anonClient.from('job_postings').select('id, title, status').limit(10);
  assert(!jobsErr && jobs && jobs.length >= 6, `Anonymous client can read public active job postings (found: ${jobs?.length || 0})`);

  // Verify private applications are hidden from anon
  const { data: anonApps, error: anonAppErr } = await anonClient.from('applications').select('id');
  assert(!anonAppErr && anonApps && anonApps.length === 0, `RLS: Anonymous client sees 0 applications (private data protected)`);

  // ----------------------------------------------------------------------------
  // 2. Student Authentication & Operations (Aarav Sharma)
  // ----------------------------------------------------------------------------
  console.log('\n--- 2. Testing as Authenticated Student (aarav.sharma@campus.edu) ---');
  const studentClient = createClient(SUPABASE_URL, PUBLISHABLE_KEY, {
    auth: { persistSession: false }
  });

  const { data: studentAuth, error: studentAuthErr } = await studentClient.auth.signInWithPassword({
    email: 'aarav.sharma@campus.edu',
    password: 'CampusFlow2026!'
  });
  assert(!studentAuthErr && studentAuth?.user, `Student authenticated via GoTrue (User ID: ${studentAuth?.user?.id})`);

  // Verify student profile loading
  const { data: studentProfile, error: spErr } = await studentClient
    .from('student_profiles')
    .select('id, full_name, roll_number, cgpa, branch, graduation_year')
    .eq('user_id', studentAuth.user.id)
    .single();
  assert(!spErr && studentProfile?.full_name === 'Aarav Sharma', `Student profile retrieved: ${studentProfile?.full_name} (CGPA: ${studentProfile?.cgpa})`);

  // Verify student applications via RLS
  const { data: studentApps, error: studentAppsErr } = await studentClient
    .from('applications')
    .select('id, job_id, status');
  assert(!studentAppsErr && studentApps && studentApps.length >= 2, `Student sees their own applications (count: ${studentApps?.length || 0})`);

  // Test evaluate_job_eligibility RPC from live Supabase
  const sweJobId = '20000000-0000-4000-a000-000000000001';
  const { data: eligResult, error: eligErr } = await studentClient.rpc('evaluate_job_eligibility', {
    p_job_id: sweJobId,
    p_student_id: studentProfile.id
  });
  assert(!eligErr && eligResult && eligResult.is_eligible === true, `Live RPC evaluate_job_eligibility: Aarav Sharma evaluated as ELIGIBLE for NovaTech SWE`);

  // ----------------------------------------------------------------------------
  // 3. Recruiter Authentication & Operations (Priya Nair)
  // ----------------------------------------------------------------------------
  console.log('\n--- 3. Testing as Authenticated Recruiter (priya.nair@novatech.io) ---');
  const recruiterClient = createClient(SUPABASE_URL, PUBLISHABLE_KEY, {
    auth: { persistSession: false }
  });

  const { data: recruiterAuth, error: recruiterAuthErr } = await recruiterClient.auth.signInWithPassword({
    email: 'priya.nair@novatech.io',
    password: 'CampusFlow2026!'
  });
  assert(!recruiterAuthErr && recruiterAuth?.user, `Recruiter authenticated via GoTrue (User ID: ${recruiterAuth?.user?.id})`);

  // Verify recruiter company membership
  const { data: membership, error: memErr } = await recruiterClient
    .from('recruiter_company_memberships')
    .select('company_id, membership_role, companies(name)')
    .eq('recruiter_user_id', recruiterAuth.user.id)
    .single();
  assert(!memErr && membership?.companies?.name === 'NovaTech Systems', `Recruiter verified for company: ${membership?.companies?.name}`);

  // Recruiter queries applications for NovaTech
  const { data: recruiterApps, error: rAppsErr } = await recruiterClient
    .from('applications')
    .select('id, job_id, status, job_postings!inner(company_id)');
  assert(!rAppsErr && recruiterApps, `Recruiter retrieved company applications via RLS (count: ${recruiterApps?.length || 0})`);

  // ----------------------------------------------------------------------------
  // 4. Placement Administrator Authentication & Analytics (Dr. Rajesh Rao)
  // ----------------------------------------------------------------------------
  console.log('\n--- 4. Testing as Placement Administrator (placements@campus.edu) ---');
  const adminClient = createClient(SUPABASE_URL, PUBLISHABLE_KEY, {
    auth: { persistSession: false }
  });

  const { data: adminAuth, error: adminAuthErr } = await adminClient.auth.signInWithPassword({
    email: 'placements@campus.edu',
    password: 'CampusFlow2026!'
  });
  assert(!adminAuthErr && adminAuth?.user, `Administrator authenticated via GoTrue (User ID: ${adminAuth?.user?.id})`);

  // Verify profile role in public.profiles
  const { data: adminProfile, error: apErr } = await adminClient
    .from('profiles')
    .select('role, full_name')
    .eq('id', adminAuth.user.id)
    .single();
  assert(!apErr && adminProfile?.role === 'placement_admin', `Administrator verified in profiles table with role: ${adminProfile?.role}`);

  // Test live get_placement_analytics RPC
  const { data: analytics, error: analyticsErr } = await adminClient.rpc('get_placement_analytics');
  assert(!analyticsErr && analytics && analytics.total_students > 0, `Live RPC get_placement_analytics: Total Students = ${analytics?.total_students}, Placed = ${analytics?.placed_students}, Placement Rate = ${analytics?.placement_rate}%`);

  console.log('\n====================================================================');
  console.log(`📊 LIVE SUPABASE TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('====================================================================\n');

  if (failCount > 0) process.exit(1);
}

runLiveSupabaseTests().catch(err => {
  console.error('Fatal live Supabase test error:', err);
  process.exit(1);
});
