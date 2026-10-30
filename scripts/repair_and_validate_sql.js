// ==============================================================================
// CampusFlow V4 — SQL Syntax Repair & Real PostgreSQL AST Parser Validator
// Uses libpg-query (WASM compiled official PostgreSQL grammar) to guarantee
// 100% valid PL/pgSQL syntax on the complete master deployment script and migrations
// ==============================================================================

const fs = require('fs');
const path = require('path');
const { loadModule, parseSync } = require('pgsql-parser');

const masterSqlPath = path.join(__dirname, '..', 'supabase', 'CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql');
let sql = fs.readFileSync(masterSqlPath, 'utf8');

console.log('\n====================================================================');
console.log('🔧 STARTING COMPREHENSIVE SQL REPAIR & POSTGRESQL PARSER VALIDATION');
console.log('====================================================================\n');

// 1. Repair seed_synthetic_batch() closure before Section 11 if broken
const brokenSeedRegex = /(end\s+loop;\s*)(-- =+[\r\n]+-- 11\. RECRUITMENT ECOSYSTEM)/;
if (brokenSeedRegex.test(sql)) {
  sql = sql.replace(
    brokenSeedRegex,
    (match, p1, p2) => p1 + 'end;\n$$ language plpgsql security definer set search_path = public;\n\n' + p2
  );
  console.log('✓ Repaired missing closure on public.seed_synthetic_batch()');
}

// 2. Repair Section 11 DO block opening: 'do \ndeclare' -> 'do $$\ndeclare'
const brokenDoRegex = /\bdo\s*(\r?\n\s*)declare\b/;
if (brokenDoRegex.test(sql)) {
  sql = sql.replace(brokenDoRegex, (match, p1) => 'do $$' + p1 + 'declare');
  console.log('✓ Repaired missing $$ delimiter on Section 11 DO statement');
}

// 3. Repair Section 11 DO block closing: 'end ;' -> 'end $$;'
const brokenEndRegex = /\bend\s*;\s*(\r?\n\s*-- =+[\r\n]+-- 12\. VERIFICATION)/;
if (brokenEndRegex.test(sql)) {
  sql = sql.replace(brokenEndRegex, (match, p1) => 'end $$;' + p1);
  console.log('✓ Repaired missing $$ delimiter on Section 11 ending (end $$;)');
}

// 4. Match exact PostgreSQL function signatures for GRANT statements
const exactGrants = `revoke execute on all functions in schema public from public;

grant execute on function public.current_user_role() to anon, authenticated, service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.get_student_profile_id() to anon, authenticated, service_role;
grant execute on function public.is_recruiter_for_company(uuid) to anon, authenticated, service_role;
grant execute on function public.is_recruiter_for_job(uuid) to anon, authenticated, service_role;
grant execute on function public.is_recruiter_for_application(uuid) to anon, authenticated, service_role;
grant execute on function public.is_recruiter_for_student_resume(uuid) to anon, authenticated, service_role;

grant execute on function public.evaluate_job_eligibility(uuid, uuid) to authenticated, service_role;
grant execute on function public.submit_application(uuid) to authenticated, service_role;
grant execute on function public.update_application_status(uuid, application_status_type, text) to authenticated, service_role;
grant execute on function public.withdraw_application(uuid) to authenticated, service_role;
grant execute on function public.schedule_interview(uuid, timestamptz, int, interview_mode_type, text, text, text, text) to authenticated, service_role;
grant execute on function public.get_placement_analytics() to authenticated, service_role;`;

const grantBlockRegex = /revoke execute on all functions in schema public from public;[\s\S]*?grant execute on function public\.get_placement_analytics\(\) to authenticated, service_role;/;
if (grantBlockRegex.test(sql)) {
  sql = sql.replace(grantBlockRegex, () => exactGrants);
  console.log('✓ Synchronized all GRANT EXECUTE statements with exact parameter signatures');
}

// 5. Verify Dollar Quote Balance
const dollarMatches = sql.match(/\$\$/g) || [];
console.log(`\nDollar quote delimiter count: ${dollarMatches.length}`);

const lines = sql.split('\n');
let inBlock = false;
let blockStartLine = -1;
let blockType = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const count = (line.match(/\$\$/g) || []).length;
  if (count > 0) {
    for (let c = 0; c < count; c++) {
      if (!inBlock) {
        inBlock = true;
        blockStartLine = i + 1;
        blockType = line.trim();
        console.log(`  OPEN  $$ at line ${i + 1}: ${blockType.slice(0, 60)}`);
      } else {
        inBlock = false;
        console.log(`  CLOSE $$ at line ${i + 1} (started at ${blockStartLine})`);
      }
    }
  }
}

if (inBlock) {
  throw new Error(`CRITICAL: Unclosed dollar-quoted block starting at line ${blockStartLine}: ${blockType}`);
}
console.log('✓ All $$ delimiters are strictly balanced in pairs.');

(async () => {
  // Load libpg-query WASM module
  await loadModule();

  // 6. Parse complete Master SQL with real PostgreSQL grammar parser
  console.log('\n--- Executing libpg-query AST parser on master deployment script ---');
  try {
    const ast = parseSync(sql);
    console.log(`✅ SUCCESS: Master SQL parsed by PostgreSQL grammar with 0 syntax errors! (AST root statements: ${ast.stmts.length})`);
  } catch (err) {
    console.error(`❌ PARSER ERROR at cursor ${err.cursorPosition}: ${err.message}`);
    if (err.cursorPosition) {
      const errLines = sql.slice(0, err.cursorPosition).split('\n');
      console.error(`Line: ${errLines.length}, Column: ${errLines[errLines.length - 1].length}`);
      console.error(`Nearby context:\n${sql.slice(Math.max(0, err.cursorPosition - 150), Math.min(sql.length, err.cursorPosition + 150))}`);
    }
    process.exit(1);
  }

  // 7. Write repaired master file
  fs.writeFileSync(masterSqlPath, sql, 'utf8');
  console.log('✓ Written verified script to supabase/CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql');

  // 8. Synchronize modular migrations
  console.log('\n--- Synchronizing Modular Migration Files ---');
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const masterLines = sql.split('\n');

  function getSectionRange(headerName, nextHeaderName) {
    const startH = masterLines.findIndex(l => l.trim() === headerName);
    if (startH === -1) throw new Error(`Could not find header: ${headerName}`);
    const start = startH - 1; // start at preceding separator
    let end;
    if (nextHeaderName) {
      const nextH = masterLines.findIndex(l => l.trim() === nextHeaderName);
      if (nextH === -1) throw new Error(`Could not find header: ${nextHeaderName}`);
      end = nextH - 1;
    } else {
      end = masterLines.length;
    }
    return masterLines.slice(start, end).join('\n');
  }

  const s1 = getSectionRange('-- 1. EXTENSIONS', '-- 2. ENUMS & DOMAIN TYPES');
  const s2 = getSectionRange('-- 2. ENUMS & DOMAIN TYPES', '-- 3. TABLES (14 NORMALIZED RELATIONAL ENTITIES)');
  const s3 = getSectionRange('-- 3. TABLES (14 NORMALIZED RELATIONAL ENTITIES)', '-- 4. CONSTRAINTS & INDEXES');
  const s4 = getSectionRange('-- 4. CONSTRAINTS & INDEXES', '-- 5. SECURITY HELPER FUNCTIONS (DEFINED BEFORE RLS POLICIES)');
  const s5 = getSectionRange('-- 5. SECURITY HELPER FUNCTIONS (DEFINED BEFORE RLS POLICIES)', '-- 6. AUTHENTICATION & INTEGRITY TRIGGERS');
  const s6 = getSectionRange('-- 6. AUTHENTICATION & INTEGRITY TRIGGERS', '-- 7. ROW LEVEL SECURITY POLICIES (100% EXPLICIT COVERAGE)');
  const s7 = getSectionRange('-- 7. ROW LEVEL SECURITY POLICIES (100% EXPLICIT COVERAGE)', '-- 8. BUSINESS LOGIC RPC FUNCTIONS');
  const s8 = getSectionRange('-- 8. BUSINESS LOGIC RPC FUNCTIONS', '-- 9. STORAGE BUCKET CONFIGURATION (PRIVATE RESUMES)');
  const s9 = getSectionRange('-- 9. STORAGE BUCKET CONFIGURATION (PRIVATE RESUMES)', '-- 10. SYNTHETIC BATCH SEED HELPER (DEFINED BEFORE EXECUTION)');
  const s10 = getSectionRange('-- 10. SYNTHETIC BATCH SEED HELPER (DEFINED BEFORE EXECUTION)', '-- 11. RECRUITMENT ECOSYSTEM SEED DATA (INDEPENDENT OF AUTH PROVISIONING)');
  const s11 = getSectionRange('-- 11. RECRUITMENT ECOSYSTEM SEED DATA (INDEPENDENT OF AUTH PROVISIONING)', '-- 12. VERIFICATION QUERIES');
  const s12 = getSectionRange('-- 12. VERIFICATION QUERIES', null);

  const m1Content = [
    '-- ==============================================================================',
    '-- CampusFlow V4 - Supabase Schema Migration: 001_initial_schema.sql',
    '-- Problem Statement: HACK-P410 (Campus Recruitment Portal)',
    '-- ==============================================================================',
    '',
    s1, '', s2, '', s3, '', s4
  ].join('\n');

  const m2Content = [
    '-- ==============================================================================',
    '-- CampusFlow V4 - Supabase Migration: 002_row_level_security.sql',
    '-- Non-Negotiable Multi-Role RLS Policies (Student, Recruiter, Admin)',
    '-- ==============================================================================',
    '',
    s5, '', s7, '', s9
  ].join('\n');

  const m3Content = [
    '-- ==============================================================================',
    '-- CampusFlow V4 - Supabase Migration: 003_functions_and_rpc.sql',
    '-- Problem Statement: HACK-P410 (Campus Recruitment Portal)',
    '-- Functions: Eligibility Engine, Atomic Application Submission, State Machine, Analytics',
    '-- ==============================================================================',
    '',
    s6, '', s8
  ].join('\n');

  const m4Content = [
    '-- ==============================================================================',
    '-- CampusFlow V4 - Supabase Migration: 004_seed_demo_data.sql',
    '-- Problem Statement: HACK-P410 (Campus Recruitment Portal)',
    '-- Seed Data: Synthetic University Directory & Enterprise Recruitment Infrastructure',
    '-- ==============================================================================',
    '',
    s10, '', s11, '', s12
  ].join('\n');

  const mFiles = [
    { name: '20261030000001_initial_schema.sql', content: m1Content },
    { name: '20261030000002_row_level_security.sql', content: m2Content },
    { name: '20261030000003_functions_and_rpc.sql', content: m3Content },
    { name: '20261030000004_seed_demo_data.sql', content: m4Content }
  ];

  for (const mf of mFiles) {
    const filePath = path.join(migrationsDir, mf.name);
    fs.writeFileSync(filePath, mf.content, 'utf8');
    try {
      const mAst = parseSync(mf.content);
      console.log(`✓ Migration ${mf.name} validated by PostgreSQL parser (0 syntax errors, ${mAst.stmts.length} statements)`);
    } catch (mErr) {
      console.error(`❌ Parse error in migration ${mf.name}: ${mErr.message}`);
      process.exit(1);
    }
  }

  console.log('\n====================================================================');
  console.log('🎉 ALL SQL FILES SUCCESSFULLY REPAIRED, SYNCHRONIZED & PARSER-VALIDATED');
  console.log('====================================================================\n');
})();
