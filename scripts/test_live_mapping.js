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

function mapDbStatus(dbStatus) {
  switch (dbStatus) {
    case 'submitted': return 'Submitted';
    case 'shortlisted': return 'Shortlisted';
    case 'interview': return 'Interview';
    case 'selected': return 'Selected';
    case 'rejected': return 'Rejected';
    case 'withdrawn': return 'Withdrawn';
    default: return 'Submitted';
  }
}

async function testMapping() {
  await supabase.auth.signInWithPassword({ email: 'placements@campus.edu', password: 'CampusFlow2026!' });
  const { data, error } = await supabase
    .from('applications')
    .select(`
      id,
      job_id,
      student_id,
      status,
      applied_at,
      updated_at,
      withdrawn_at,
      job_postings!inner (
        id,
        title,
        company_id,
        companies!inner (
          id,
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
        ),
        resume_files (
          storage_path,
          original_filename
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
    `)
    .order('applied_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  const mapped = data.map((a) => {
    const status = mapDbStatus(a.status);
    const history = (a.application_status_history || []).map((h) => ({
      status: mapDbStatus(h.new_status),
      timestamp: h.changed_at,
      description: h.change_reason || `Status updated to ${h.new_status}`,
      author: h.profiles?.full_name || (h.profiles?.role === 'recruiter' ? 'Recruiter' : 'Placement Office'),
    }));

    if (history.length === 0) {
      history.push({
        status: status,
        timestamp: a.applied_at,
        description: `Application submitted for ${a.job_postings?.title} at ${a.job_postings?.companies?.name}.`,
        author: 'Student',
      });
    }

    const latestInterview = a.interviews?.[0];

    return {
      id: a.id,
      jobId: a.job_id,
      jobTitle: a.job_postings?.title || 'Job Posting',
      companyName: a.job_postings?.companies?.name || 'Company',
      companyLogo: a.job_postings?.companies?.logo_path || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
      studentId: a.student_id,
      studentName: a.student_profiles?.full_name || 'Candidate',
      studentEmail: a.student_profiles?.profiles?.email || 'student@campus.edu',
      studentRollNo: a.student_profiles?.roll_number || 'N/A',
      studentBranch: a.student_profiles?.branch || 'General',
      studentCgpa: Number(a.student_profiles?.cgpa) || 0,
      studentResumeUrl: a.student_profiles?.resume_files?.[0]?.original_filename
        ? `https://storage.campusflow.io/resumes/${a.student_profiles.resume_files[0].original_filename}`
        : undefined,
      studentSkills: a.student_profiles?.student_skills?.map((s) => s.skill_name) || [],
      appliedAt: a.applied_at,
      status: status,
      history: history,
      nextAction:
        status === 'Submitted'
          ? 'Application under employer screening.'
          : status === 'Shortlisted'
          ? 'Shortlisted! Awaiting technical round scheduling.'
          : status === 'Interview'
          ? latestInterview ? `${latestInterview.round} scheduled` : 'Interview scheduled'
          : status === 'Selected'
          ? 'Offer confirmed and recorded.'
          : status === 'Rejected'
          ? 'Application not selected to advance.'
          : 'Application withdrawn.',
      interviewDate: latestInterview?.scheduled_at,
    };
  });

  console.log('Successfully mapped', mapped.length, 'applications!');
  console.log('First mapped application:');
  console.log(JSON.stringify(mapped[0], null, 2));
}

testMapping().catch(console.error);
