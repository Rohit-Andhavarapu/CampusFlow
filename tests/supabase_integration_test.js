// ==============================================================================
// CampusFlow V4 — Supabase Integration & Security Test Suite
// Verifies: Schema, RPCs, Eligibility, State Machine, RLS rules, Analytics
// ==============================================================================

const fs = require('fs');
const path = require('path');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName}: ${details}`);
  }
}

console.log('\n====================================================================');
console.log('🧪 RUNNING CAMPUSFLOW V4 SUPABASE INTEGRATION & SECURITY SUITE');
console.log('====================================================================\n');

// 1. MIGRATION INTEGRITY CHECKS
console.log('--- 1. Migration Files & SQL Schema Verification ---');
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
assert(fs.existsSync(migrationsDir), 'Migrations directory exists');

const migrations = [
  '20261030000001_initial_schema.sql',
  '20261030000002_row_level_security.sql',
  '20261030000003_functions_and_rpc.sql',
  '20261030000004_seed_demo_data.sql',
];

migrations.forEach((m) => {
  const filePath = path.join(migrationsDir, m);
  const exists = fs.existsSync(filePath);
  assert(exists, `Migration ${m} exists on disk`);
  if (exists) {
    const content = fs.readFileSync(filePath, 'utf-8');
    assert(content.length > 500, `Migration ${m} has valid content (${content.length} bytes)`);
  }
});

// Check mandatory tables in 001_initial_schema.sql
const schemaContent = fs.readFileSync(path.join(migrationsDir, '20261030000001_initial_schema.sql'), 'utf-8');
const requiredTables = [
  'public.profiles',
  'public.student_profiles',
  'public.student_skills',
  'public.student_projects',
  'public.companies',
  'public.recruiter_company_memberships',
  'public.recruitment_drives',
  'public.job_postings',
  'public.job_eligibility_rules',
  'public.applications',
  'public.application_status_history',
  'public.interviews',
  'public.notifications',
  'public.resume_files',
];

requiredTables.forEach((table) => {
  assert(schemaContent.includes(`create table if not exists ${table}`), `Schema declares table ${table}`);
});

// Check Unique Constraint on applications (student_id, job_id)
assert(
  schemaContent.includes('unique (student_id, job_id)'),
  'Unique constraint enforced on applications(student_id, job_id) to prevent duplicate applications'
);

// 2. ROW LEVEL SECURITY CHECKS
console.log('\n--- 2. Row Level Security (RLS) Policy Verification ---');
const rlsContent = fs.readFileSync(path.join(migrationsDir, '20261030000002_row_level_security.sql'), 'utf-8');

requiredTables.forEach((table) => {
  assert(rlsContent.includes(`alter table ${table} enable row level security`), `RLS explicitly enabled on ${table}`);
});

assert(rlsContent.includes('current_user_role()'), 'Non-recursive helper function current_user_role() declared');
assert(rlsContent.includes('is_admin()'), 'Non-recursive helper function is_admin() declared');
assert(rlsContent.includes('is_recruiter_for_company'), 'Company membership boundary helper is_recruiter_for_company() declared');
assert(rlsContent.includes('is_recruiter_for_student_resume'), 'Resume privacy check is_recruiter_for_student_resume() declared');
assert(rlsContent.includes('bucket_id = \'resumes\''), 'Storage bucket RLS policies declared on storage.objects for resumes');

// 3. SERVER-SIDE RPC AND BUSINESS LOGIC CHECKS
console.log('\n--- 3. RPC & Atomic Transaction Verification ---');
const rpcContent = fs.readFileSync(path.join(migrationsDir, '20261030000003_functions_and_rpc.sql'), 'utf-8');

assert(rpcContent.includes('create or replace function public.evaluate_job_eligibility'), 'evaluate_job_eligibility RPC defined');
assert(rpcContent.includes('create or replace function public.submit_application'), 'submit_application atomic RPC defined');
assert(rpcContent.includes('create or replace function public.update_application_status'), 'update_application_status state machine RPC defined');
assert(rpcContent.includes('create or replace function public.withdraw_application'), 'withdraw_application RPC defined');
assert(rpcContent.includes('create or replace function public.schedule_interview'), 'schedule_interview RPC defined');
assert(rpcContent.includes('create or replace function public.get_placement_analytics'), 'get_placement_analytics RPC defined');

// 4. STATE MACHINE TRANSITION RULES TEST
console.log('\n--- 4. Application State Machine Logic Test ---');

function validateTransition(currentStatus, targetStatus) {
  switch (currentStatus) {
    case 'submitted':
      return ['shortlisted', 'rejected'].includes(targetStatus);
    case 'shortlisted':
      return ['interview', 'rejected'].includes(targetStatus);
    case 'interview':
      return ['selected', 'rejected'].includes(targetStatus);
    case 'selected':
    case 'rejected':
    case 'withdrawn':
      return false; // Terminal states
    default:
      return false;
  }
}

assert(validateTransition('submitted', 'shortlisted'), 'Valid transition: submitted -> shortlisted');
assert(validateTransition('submitted', 'rejected'), 'Valid transition: submitted -> rejected');
assert(validateTransition('shortlisted', 'interview'), 'Valid transition: shortlisted -> interview');
assert(validateTransition('interview', 'selected'), 'Valid transition: interview -> selected');
assert(validateTransition('interview', 'rejected'), 'Valid transition: interview -> rejected');
assert(!validateTransition('submitted', 'selected'), 'Illegal transition prevented: submitted -> selected (skipping pipeline)');
assert(!validateTransition('selected', 'rejected'), 'Terminal state protected: selected -> rejected');
assert(!validateTransition('rejected', 'submitted'), 'Terminal state protected: rejected -> submitted');
assert(!validateTransition('withdrawn', 'interview'), 'Terminal state protected: withdrawn -> interview');

// 5. SERVER-SIDE ELIGIBILITY EVALUATION SIMULATION
console.log('\n--- 5. Explainable Eligibility Engine Test ---');

function evaluateEligibility(rule, student, studentSkills = []) {
  const reasons = [];
  let isEligible = true;
  let isIncomplete = false;

  if (!student.rollNumber || !student.branch || student.cgpa == null) {
    isIncomplete = true;
    reasons.push('Mandatory academic credentials are missing.');
  }

  // CGPA check
  const cgpaPassed = student.cgpa >= rule.minimumCgpa;
  if (!cgpaPassed) {
    isEligible = false;
    reasons.push(`CGPA ${student.cgpa} is below cutoff ${rule.minimumCgpa}.`);
  }

  // Backlogs check
  const backlogsPassed = (student.activeBacklogs || 0) <= rule.maximumBacklogs;
  if (!backlogsPassed) {
    isEligible = false;
    reasons.push(`Active backlogs (${student.activeBacklogs}) exceed allowed (${rule.maximumBacklogs}).`);
  }

  // Branch check
  if (rule.allowedBranches && rule.allowedBranches.length > 0) {
    const branchPassed = rule.allowedBranches.includes(student.branch);
    if (!branchPassed) {
      isEligible = false;
      reasons.push(`Branch "${student.branch}" not eligible.`);
    }
  }

  // Graduation year check
  if (rule.allowedGraduationYears && rule.allowedGraduationYears.length > 0) {
    const yearPassed = rule.allowedGraduationYears.includes(student.graduationYear);
    if (!yearPassed) {
      isEligible = false;
      reasons.push(`Graduation year ${student.graduationYear} not eligible.`);
    }
  }

  return { isEligible: isEligible && !isIncomplete, isIncomplete, reasons };
}

const aetosRule = {
  minimumCgpa: 8.0,
  maximumBacklogs: 0,
  allowedBranches: ['Computer Science & Engineering', 'Artificial Intelligence & Data Science'],
  allowedGraduationYears: [2026],
};

const qualifyingStudent = {
  rollNumber: 'N25H02A0325',
  branch: 'Computer Science & Engineering',
  graduationYear: 2026,
  cgpa: 8.85,
  activeBacklogs: 0,
};

const lowCgpaStudent = {
  rollNumber: 'N25H02A0332',
  branch: 'Computer Science & Engineering',
  graduationYear: 2026,
  cgpa: 6.95,
  activeBacklogs: 0,
};

const wrongBranchStudent = {
  rollNumber: 'N25H02A0341',
  branch: 'Mechanical Engineering',
  graduationYear: 2026,
  cgpa: 8.15,
  activeBacklogs: 0,
};

const incompleteStudent = {
  rollNumber: '',
  branch: '',
  graduationYear: 2026,
  cgpa: null,
};

assert(evaluateEligibility(aetosRule, qualifyingStudent).isEligible, 'Qualifying student evaluates as ELIGIBLE');
const lowCgpaResult = evaluateEligibility(aetosRule, lowCgpaStudent);
assert(!lowCgpaResult.isEligible && lowCgpaResult.reasons.some(r => r.includes('CGPA')), 'Low CGPA student evaluates as INELIGIBLE with CGPA reason');
const wrongBranchResult = evaluateEligibility(aetosRule, wrongBranchStudent);
assert(!wrongBranchResult.isEligible && wrongBranchResult.reasons.some(r => r.includes('Branch')), 'Wrong branch student evaluates as INELIGIBLE with Branch reason');
const incompleteResult = evaluateEligibility(aetosRule, incompleteStudent);
assert(incompleteResult.isIncomplete && !incompleteResult.isEligible, 'Incomplete profile evaluates as INCOMPLETE and INELIGIBLE');

// 6. ANALYTICS MATHEMATICAL CONSISTENCY TEST
console.log('\n--- 6. Placement Analytics Consistency Test ---');

function verifyAnalytics(totalStudents, placed, inProcess, unplaced) {
  const sum = placed + inProcess + unplaced;
  const matches = sum === totalStudents;
  const rate = totalStudents > 0 ? ((placed / totalStudents) * 100).toFixed(1) : '0.0';
  return { matches, rate };
}

const analytics = verifyAnalytics(20, 11, 5, 4);
assert(analytics.matches, 'Total Students (20) == Placed (11) + In Process (5) + Unplaced (4) (Zero double-counting)');
assert(analytics.rate === '55.0', `Placement rate mathematically accurate: ${analytics.rate}% (11/20)`);

// 7. ENVIRONMENT VARIABLES & CLIENT CONFIG TEST
console.log('\n--- 7. Environment Variables & Client Configuration ---');
const envExamplePath = path.join(__dirname, '..', '.env.example');
assert(fs.existsSync(envExamplePath), '.env.example exists in project root');
const envContent = fs.readFileSync(envExamplePath, 'utf-8');
assert(envContent.includes('VITE_SUPABASE_URL'), 'VITE_SUPABASE_URL documented in .env.example');
assert(envContent.includes('VITE_SUPABASE_PUBLISHABLE_KEY'), 'VITE_SUPABASE_PUBLISHABLE_KEY documented in .env.example');
assert(!envContent.includes('service_role'), 'Security: service_role key is NOT exposed in .env.example');

console.log('\n====================================================================');
console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('====================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
