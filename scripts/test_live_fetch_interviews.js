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

async function testFetchInterviews() {
  console.log('Testing interviews fetch...');
  // Student
  await supabase.auth.signInWithPassword({ email: 'aarav.sharma@campus.edu', password: 'CampusFlow2026!' });
  const { data: ints, error } = await supabase
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
          id,
          title,
          companies (name, logo_path)
        ),
        student_profiles (
          id,
          full_name,
          roll_number
        )
      )
    `)
    .order('scheduled_at', { ascending: true });

  if (error) console.error('Error fetching interviews:', error);
  else {
    console.log('Interviews count:', ints.length);
    if (ints.length > 0) {
      console.log('Sample interview:', {
        id: ints[0].id,
        round: ints[0].round,
        mode: ints[0].mode,
        scheduled_at: ints[0].scheduled_at,
        jobTitle: ints[0].applications?.job_postings?.title,
        companyName: ints[0].applications?.job_postings?.companies?.name,
        candidate: ints[0].applications?.student_profiles?.full_name
      });
    }
  }
}

testFetchInterviews().catch(console.error);
