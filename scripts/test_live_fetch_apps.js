const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = {};
fs.readFileSync('.env', 'utf8').split('\n').forEach(l => {
  const eq = l.indexOf('=');
  if (eq !== -1 && !l.trim().startsWith('#')) {
    env[l.slice(0, eq).trim()] = l.slice(eq + 1).trim();
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function testFetchApps() {
  console.log('Testing application fetch across all 3 roles...');

  // 1. Student Aarav
  await supabase.auth.signInWithPassword({ email: 'aarav.sharma@campus.edu', password: 'CampusFlow2026!' });
  const { data: studentApps, error: sErr } = await supabase
    .from('applications')
    .select(`
      id,
      job_id,
      student_id,
      status,
      applied_at,
      job_postings!inner (
        id,
        title,
        companies!inner (
          name,
          logo_path
        )
      ),
      student_profiles!inner (
        id,
        full_name,
        roll_number,
        branch,
        cgpa,
        student_skills (
          skill_name
        ),
        profiles (
          email
        )
      ),
      application_status_history (
        id,
        previous_status,
        new_status,
        change_reason,
        changed_at,
        profiles (
          full_name,
          role
        )
      ),
      interviews (
        id,
        scheduled_at,
        round,
        mode,
        location,
        meeting_url,
        status
      )
    `);

  if (sErr) console.error('Student app error:', sErr);
  else console.log('Aarav Sharma applications count:', studentApps.length);

  // 2. Recruiter Priya
  await supabase.auth.signInWithPassword({ email: 'priya.nair@novatech.io', password: 'CampusFlow2026!' });
  const { data: recruiterApps, error: rErr } = await supabase
    .from('applications')
    .select(`
      id,
      job_id,
      student_id,
      status,
      applied_at,
      job_postings!inner (
        id,
        title,
        companies!inner (
          name,
          logo_path
        )
      ),
      student_profiles!inner (
        id,
        full_name,
        roll_number,
        branch,
        cgpa,
        student_skills (
          skill_name
        ),
        profiles (
          email
        )
      ),
      application_status_history (
        id,
        previous_status,
        new_status,
        change_reason,
        changed_at,
        profiles (
          full_name,
          role
        )
      ),
      interviews (
        id,
        scheduled_at,
        round,
        mode,
        location,
        meeting_url,
        status
      )
    `);

  if (rErr) console.error('Recruiter app error:', rErr);
  else console.log('Priya Nair (NovaTech) applications count:', recruiterApps.length);

  // 3. Admin Dr. Rajesh Rao
  await supabase.auth.signInWithPassword({ email: 'placements@campus.edu', password: 'CampusFlow2026!' });
  const { data: adminApps, error: aErr } = await supabase
    .from('applications')
    .select(`
      id,
      job_id,
      student_id,
      status,
      applied_at,
      job_postings!inner (
        id,
        title,
        companies!inner (
          name,
          logo_path
        )
      ),
      student_profiles!inner (
        id,
        full_name,
        roll_number,
        branch,
        cgpa,
        student_skills (
          skill_name
        ),
        profiles (
          email
        )
      ),
      application_status_history (
        id,
        previous_status,
        new_status,
        change_reason,
        changed_at,
        profiles (
          full_name,
          role
        )
      ),
      interviews (
        id,
        scheduled_at,
        round,
        mode,
        location,
        meeting_url,
        status
      )
    `);

  if (aErr) console.error('Admin app error:', aErr);
  else {
    console.log('Dr. Rajesh Rao (Admin) applications count:', adminApps.length);
    console.log('Sample mapped app:', {
      id: adminApps[0].id,
      jobTitle: adminApps[0].job_postings?.title,
      company: adminApps[0].job_postings?.companies?.name,
      student: adminApps[0].student_profiles?.full_name,
      cgpa: adminApps[0].student_profiles?.cgpa,
      skills: adminApps[0].student_profiles?.student_skills?.map(s => s.skill_name),
      status: adminApps[0].status,
      historyCount: adminApps[0].application_status_history?.length,
      interviewCount: adminApps[0].interviews?.length
    });
  }
}

testFetchApps().catch(console.error);
