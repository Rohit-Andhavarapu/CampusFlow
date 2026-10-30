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

async function testInterviewsMapping() {
  await supabase.auth.signInWithPassword({ email: 'aarav.sharma@campus.edu', password: 'CampusFlow2026!' });
  const { data, error } = await supabase
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

  if (error) {
    console.error('Error:', error);
    return;
  }

  const mapped = data.map((i) => ({
    id: i.id,
    applicationId: i.application_id,
    jobId: i.applications?.job_id || '',
    jobTitle: i.applications?.job_postings?.title || 'Software Role',
    companyName: i.applications?.job_postings?.companies?.name || 'Company',
    companyLogo: i.applications?.job_postings?.companies?.logo_path || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
    studentId: i.applications?.student_id || '',
    studentName: i.applications?.student_profiles?.full_name || 'Candidate',
    studentRollNo: i.applications?.student_profiles?.roll_number || 'N/A',
    dateTime: i.scheduled_at,
    mode: i.mode,
    locationOrLink: i.mode === 'Virtual' ? (i.meeting_url || 'https://meet.google.com/interview') : (i.location || 'Campus Tech Block'),
    round: i.round,
    status: i.status === 'scheduled' ? 'Scheduled' : i.status === 'completed' ? 'Completed' : 'Cancelled',
    interviewer: 'Technical Evaluation Panel',
    notes: i.feedback || undefined,
  }));

  console.log('Mapped interviews count:', mapped.length);
  console.log(JSON.stringify(mapped[0], null, 2));
}

testInterviewsMapping().catch(console.error);
