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

async function test() {
  console.log('Testing live queries...');
  // 1. Student sign in
  await supabase.auth.signInWithPassword({ email: 'aarav.sharma@campus.edu', password: 'CampusFlow2026!' });
  
  // Test interviews query
  const { data: ints, error: intErr } = await supabase
    .from('interviews')
    .select(`
      id,
      application_id,
      scheduled_at,
      duration_minutes,
      mode,
      location,
      meeting_url,
      round,
      status,
      feedback,
      applications!inner (
        id,
        student_id,
        job_id,
        job_postings (
          title,
          companies (name, logo_path)
        ),
        student_profiles (
          full_name,
          roll_number
        )
      )
    `)
    .order('scheduled_at', { ascending: true });

  if (intErr) console.error('Interview error:', intErr);
  else console.log('Interviews for Aarav:', ints.length, ints[0]?.round);

  // Test notifications query
  const { data: notifs, error: notifErr } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (notifErr) console.error('Notification error:', notifErr);
  else console.log('Notifications for Aarav:', notifs.length);

  // 2. Recruiter sign in
  await supabase.auth.signInWithPassword({ email: 'priya.nair@novatech.io', password: 'CampusFlow2026!' });
  const { data: rInts, error: rIntErr } = await supabase
    .from('interviews')
    .select(`
      id,
      application_id,
      scheduled_at,
      round,
      applications!inner (
        job_postings (
          title,
          companies (name)
        )
      )
    `);
  if (rIntErr) console.error('Recruiter interview error:', rIntErr);
  else console.log('Interviews for Recruiter:', rInts.length);
}

test().catch(console.error);
