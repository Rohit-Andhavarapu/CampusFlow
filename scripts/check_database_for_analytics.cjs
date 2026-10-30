const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = {};
fs.readFileSync('.env', 'utf8').split('\n').forEach(l => {
  const eq = l.indexOf('=');
  if (eq !== -1 && !l.trim().startsWith('#')) {
    env[l.slice(0, eq).trim()] = l.slice(eq + 1).trim();
  }
});

const admin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SECRET_KEY);

async function checkAnalyticsRPC() {
  const { data, error } = await admin.rpc('get_placement_analytics');
  console.log('get_placement_analytics result:', JSON.stringify(data, null, 2));

  const { data: sps } = await admin.from('student_profiles').select('id, full_name, branch, cgpa, graduation_year');
  console.log('Student profiles count:', sps?.length);

  const { data: comps } = await admin.from('companies').select('id, name');
  console.log('Companies:', comps);

  const { data: jobs } = await admin.from('job_postings').select('id, title, company_id, employment_type, compensation_min, compensation_max');
  console.log('Job postings count:', jobs?.length);

  const { data: apps } = await admin.from('applications').select('id, student_id, job_id, status, applied_at');
  console.log('Applications count:', apps?.length);
  process.exit(0);
}
checkAnalyticsRPC().catch(err => {
  console.error(err);
  process.exit(1);
});
