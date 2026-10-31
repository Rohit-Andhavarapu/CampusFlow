const { PGlite } = require('@electric-sql/pglite');
const fs = require('fs');
const path = require('path');

async function testSql() {
  const db = new PGlite();
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

  const masterSql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql'), 'utf8');
  await db.exec(masterSql);
  console.log('✓ Master baseline deployment executed cleanly');

  const v5Migration = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'migrations', '20261031000001_resume_intelligence.sql'), 'utf8');
  await db.exec(v5Migration);
  console.log('✓ 20261031000001_resume_intelligence.sql executed cleanly on PostgreSQL!');

  const tables = await db.query(`
    select table_name from information_schema.tables where table_schema = 'public' and table_name in ('resume_analyses', 'recruiter_invitations');
  `);
  console.log('✓ Verified new public tables:', tables.rows.map(r => r.table_name));
}

testSql().catch(console.error);
