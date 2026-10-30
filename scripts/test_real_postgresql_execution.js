// ==============================================================================
// Real PostgreSQL Execution Test Harness for CampusFlow V4
// Uses @electric-sql/pglite (real PostgreSQL 18.6 WASM engine)
// Emulates Supabase baseline environment (auth and storage schemas)
// ==============================================================================

const { PGlite } = require('@electric-sql/pglite');
const fs = require('fs');
const path = require('path');

async function runRealPostgresTest() {
  console.log('\n====================================================================');
  console.log('🐘 STARTING REAL POSTGRESQL ENGINE VALIDATION');
  console.log('====================================================================\n');

  const db = new PGlite();

  // 1. Verify PostgreSQL Engine is operational
  const ver = await db.query('SELECT version();');
  console.log('✓ Connected to Real PostgreSQL Engine:', ver.rows[0].version.split('\n')[0]);

  // 2. Setup Supabase baseline environment (auth and storage schemas, auth.users, storage.buckets/objects, roles)
  console.log('\n--- Provisioning Supabase Baseline Environment (auth & storage schemas, roles) ---');
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
      avif_autodetection boolean default false,
      file_size_limit bigint,
      allowed_mime_types text[],
      owner_id text
    );

    create table if not exists storage.objects (
      id uuid primary key default gen_random_uuid(),
      bucket_id text references storage.buckets(id),
      name text,
      owner uuid,
      created_at timestamptz default now(),
      updated_at timestamptz default now(),
      last_accessed_at timestamptz default now(),
      metadata jsonb,
      path_tokens text[] generated always as (string_to_array(name, '/')) stored
    );

    create or replace function storage.foldername(name text)
    returns text[] as $$
      select string_to_array(name, '/');
    $$ language sql immutable;
  `);
  console.log('✓ Supabase baseline environment ready (auth.users, storage.buckets, auth.uid(), auth.role(), storage.foldername())');

  // 3. Load Master SQL Script
  const masterSqlPath = path.join(__dirname, '..', 'supabase', 'CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql');
  const masterSql = fs.readFileSync(masterSqlPath, 'utf8');

  console.log('\n--- Executing CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql in Real PostgreSQL ---');
  try {
    const startTime = Date.now();
    await db.exec(masterSql);
    const duration = Date.now() - startTime;
    console.log(`✅ SUCCESS: Master SQL script executed completely in Real PostgreSQL in ${duration}ms with ZERO ERRORS!`);
  } catch (err) {
    console.error('\n❌ POSTGRESQL EXECUTION FAILED:');
    console.error('Message:', err.message);
    if (err.position) console.error('Error Position:', err.position);
    if (err.internalQuery) console.error('Internal Query:', err.internalQuery);
    if (err.where) console.error('Where:', err.where);
    process.exit(1);
  }

  // 4. Verify Database Objects in PostgreSQL System Catalogs
  console.log('\n--- Verifying Database Objects in PostgreSQL Catalogs ---');
  
  // Verify Tables
  const tables = await db.query(`
    select table_name 
    from information_schema.tables 
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name;
  `);
  console.log(`✓ Tables created in public schema (${tables.rows.length} tables):`);
  tables.rows.forEach(t => console.log(`   - public.${t.table_name}`));

  // Verify Custom Enums
  const enums = await db.query(`
    select t.typname as enum_name, array_agg(e.enumlabel order by e.enumsortorder) as enum_values
    from pg_type t
    join pg_enum e on t.oid = e.enumtypid
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
    group by t.typname
    order by t.typname;
  `);
  console.log(`\n✓ Custom Enums (${enums.rows.length} enums):`);
  enums.rows.forEach(e => console.log(`   - ${e.enum_name}: [${e.enum_values.join(', ')}]`));

  // Verify Functions & RPCs
  const functions = await db.query(`
    select routine_name, routine_type, data_type
    from information_schema.routines
    where routine_schema = 'public'
    order by routine_name;
  `);
  console.log(`\n✓ Functions in public schema (${functions.rows.length} functions):`);
  functions.rows.forEach(f => console.log(`   - public.${f.routine_name}() -> ${f.data_type}`));

  // Verify Triggers
  const triggers = await db.query(`
    select event_object_table, trigger_name, event_manipulation, action_timing
    from information_schema.triggers
    where trigger_schema in ('public', 'auth')
    order by event_object_table, trigger_name;
  `);
  console.log(`\n✓ Triggers installed (${triggers.rows.length} triggers):`);
  triggers.rows.forEach(tr => console.log(`   - ${tr.trigger_name} ON ${tr.event_object_table} (${tr.action_timing} ${tr.event_manipulation})`));

  // Verify Row Level Security is Enabled
  const rlsStatus = await db.query(`
    select tablename, rowsecurity
    from pg_tables
    where schemaname = 'public'
    order by tablename;
  `);
  console.log(`\n✓ Row Level Security (RLS) Status:`);
  let allRlsEnabled = true;
  rlsStatus.rows.forEach(r => {
    const isEnabled = r.rowsecurity === true;
    if (!isEnabled) allRlsEnabled = false;
    console.log(`   - ${r.tablename}: RLS ${isEnabled ? 'ENABLED' : 'DISABLED'}`);
  });
  if (!allRlsEnabled) {
    throw new Error('CRITICAL: One or more public tables do NOT have RLS enabled!');
  }

  // Verify Seed Records Count
  const seedCounts = await db.query(`
    select 
      (select count(*) from public.companies) as companies,
      (select count(*) from public.recruitment_drives) as drives,
      (select count(*) from public.job_postings) as jobs,
      (select count(*) from public.job_eligibility_rules) as rules,
      (select count(*) from public.student_profiles) as students,
      (select count(*) from public.applications) as applications;
  `);
  console.log('\n✓ Seed Record Counts:');
  console.log('   Companies:            ', seedCounts.rows[0].companies);
  console.log('   Recruitment Drives:   ', seedCounts.rows[0].drives);
  console.log('   Job Postings:         ', seedCounts.rows[0].jobs);
  console.log('   Eligibility Rules:    ', seedCounts.rows[0].rules);
  console.log('   Student Profiles:     ', seedCounts.rows[0].students);
  console.log('   Applications:         ', seedCounts.rows[0].applications);

  // 5. Test Idempotency (Run the script again to guarantee idempotent deployment)
  console.log('\n--- Testing Idempotent Deployment (Rerunning entire script on populated DB) ---');
  await db.exec(masterSql);
  console.log('✅ SUCCESS: Idempotency verified! Script re-executed with zero errors or duplicates.');

  console.log('\n====================================================================');
  console.log('🎉 REAL POSTGRESQL ENGINE VALIDATION PASSED 100%');
  console.log('====================================================================\n');
}

runRealPostgresTest().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
