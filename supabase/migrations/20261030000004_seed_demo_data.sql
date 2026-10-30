-- ==============================================================================
-- CampusFlow V4 — Supabase Migration: 004_seed_demo_data.sql
-- Demonstration Data: Companies, Jobs, 20 Students, Applications, Interviews
-- ==============================================================================

-- 1. Demo User IDs (Deterministic UUIDs for reproducibility across environments)
-- Student: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
-- Recruiter: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
-- Admin: cccccccc-cccc-cccc-cccc-cccccccccccc

-- Note: In Supabase production/local auth, these IDs can match auth.users(id).
-- If auth.users has foreign key enforcement, we insert demo entries into auth.users if accessible,
-- or use safe upserts into public.profiles.

do $$
declare
  v_student_auth_id uuid := 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
  v_recruiter_auth_id uuid := 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb';
  v_admin_auth_id uuid := 'cccccccc-cccc-4ccc-cccc-cccccccccccc';

  v_company_aetos uuid := '11111111-1111-4111-a111-111111111111';
  v_company_nova uuid := '22222222-2222-4222-a222-222222222222';
  v_company_agnext uuid := '33333333-3333-4333-a333-333333333333';
  v_company_orbit uuid := '44444444-4444-4444-a444-444444444444';
  v_company_medrenova uuid := '55555555-5555-4555-a555-555555555555';
  v_company_vertex uuid := '66666666-6666-4666-a666-666666666666';

  v_drive_aetos uuid := 'd1111111-1111-4111-a111-111111111111';
  v_drive_nova uuid := 'd2222222-2222-4222-a222-222222222222';
  v_drive_orbit uuid := 'd4444444-4444-4444-a444-444444444444';

  v_job_aetos uuid := 'j1111111-1111-4111-a111-111111111111';
  v_job_nova_swe uuid := 'j2222222-2222-4222-a222-222222222222';
  v_job_nova_cloud uuid := 'j2222222-3333-4222-a222-333333333333';
  v_job_orbit_analyst uuid := 'j4444444-1111-4444-a444-111111111111';
  v_job_agnext_ai uuid := 'j3333333-1111-4333-a333-111111111111';
  v_job_medrenova_cv uuid := 'j5555555-1111-4555-a555-111111111111';
  v_job_vertex_fs uuid := 'j6666666-1111-4666-a666-111111111111';

  v_primary_student_id uuid;
  v_app_1 uuid := 'a1111111-1111-4111-a111-111111111111';
  v_app_2 uuid := 'a2222222-2222-4222-a222-222222222222';
  v_app_3 uuid := 'a3333333-3333-4333-a333-333333333333';
  v_app_4 uuid := 'a4444444-4444-4444-a444-444444444444';
begin
  -- 1. Create or ensure auth.users entries for the three demo roles if auth schema is writable
  begin
    insert into auth.users (id, email, raw_user_meta_data, role, aud)
    values
      (v_student_auth_id, 'aarav.sharma@campus.edu', '{"role":"student","full_name":"Aarav Sharma"}'::jsonb, 'authenticated', 'authenticated'),
      (v_recruiter_auth_id, 'priya.nair@novatech.io', '{"role":"recruiter","full_name":"Priya Nair"}'::jsonb, 'authenticated', 'authenticated'),
      (v_admin_auth_id, 'placements@campus.edu', '{"role":"placement_admin","full_name":"Dr. Rajesh Rao"}'::jsonb, 'authenticated', 'authenticated')
    on conflict (id) do nothing;
  exception
    when others then
      -- If running in an environment without direct auth.users insert privileges, proceed with public.profiles
      null;
  end;

  -- 2. Insert Profiles
  insert into public.profiles (id, email, full_name, role, avatar_path)
  values
    (v_student_auth_id, 'aarav.sharma@campus.edu', 'Aarav Sharma', 'student', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    (v_recruiter_auth_id, 'priya.nair@novatech.io', 'Priya Nair', 'recruiter', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
    (v_admin_auth_id, 'placements@campus.edu', 'Dr. Rajesh Rao', 'placement_admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80')
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role;

  -- 3. Insert Student Profile for Aarav Sharma
  insert into public.student_profiles (
    id,
    user_id,
    roll_number,
    course,
    branch,
    graduation_year,
    cgpa,
    active_backlogs,
    phone,
    bio,
    github_url,
    linkedin_url,
    portfolio_url
  )
  values (
    's1111111-1111-4111-a111-111111111111',
    v_student_auth_id,
    'N25H02A0325',
    'B.Tech',
    'Computer Science & Engineering',
    2026,
    8.85,
    0,
    '+91 98765 43210',
    'Final-year computer science undergrad passionate about building high-performance web systems, Agentic AI, and distributed applications.',
    'https://github.com/aarav-sharma',
    'https://linkedin.com/in/aarav-sharma-campus',
    'https://aaravsharma.dev'
  )
  on conflict (user_id) do update set
    roll_number = excluded.roll_number,
    cgpa = excluded.cgpa
  returning id into v_primary_student_id;

  -- Insert Skills for Aarav
  insert into public.student_skills (student_id, skill_name)
  values
    (v_primary_student_id, 'React'),
    (v_primary_student_id, 'TypeScript'),
    (v_primary_student_id, 'Node.js'),
    (v_primary_student_id, 'Python'),
    (v_primary_student_id, 'Agentic AI'),
    (v_primary_student_id, 'PostgreSQL'),
    (v_primary_student_id, 'Tailwind CSS'),
    (v_primary_student_id, 'Docker')
  on conflict (student_id, skill_name) do nothing;

  -- Insert Projects for Aarav
  insert into public.student_projects (student_id, title, description, project_url, technologies)
  values
    (
      v_primary_student_id,
      'Distributed Log Aggregator',
      'High-throughput streaming analytics platform handling 15k events/sec using Go, Kafka, and ClickHouse.',
      'https://github.com/aarav-sharma/dist-logger',
      array['Go', 'Kafka', 'ClickHouse', 'Docker']
    ),
    (
      v_primary_student_id,
      'Autonomous Code Refactoring Agent',
      'LLM-powered tool using tree-sitter AST queries to automate TypeScript migrations and dead code removal.',
      'https://github.com/aarav-sharma/auto-refactor',
      array['TypeScript', 'Python', 'AST', 'OpenAI API']
    )
  on conflict do nothing;

  -- 4. Insert Companies
  insert into public.companies (id, name, industry, description, website, logo_path, status)
  values
    (v_company_aetos, 'Aetos DigiLog', 'Artificial Intelligence & Defense Tech', 'Next-generation intelligent autonomy and multi-agent coordination systems.', 'https://aetosdigilog.com', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_nova, 'NovaTech Systems', 'Enterprise Software & Cloud Platforms', 'Global cloud automation and mission-critical developer infrastructure.', 'https://novatech.io', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_agnext, 'AgNext Technologies', 'AgriTech & Automation', 'Deep-tech computer vision and spectroscopy analytics for agricultural value chains.', 'https://agnext.com', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_orbit, 'Orbit Analytics', 'Data Intelligence & Analytics', 'Enterprise business intelligence and decision-intelligence platform.', 'https://orbitanalytics.com', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_medrenova, 'MedRenova Diagnostics', 'HealthTech & Medical Imaging', 'AI-assisted medical pathology and diagnostic imaging platforms.', 'https://medrenova.health', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_vertex, 'Vertex Digital Labs', 'Full-Stack Software Engineering', 'High-velocity digital product engineering and distributed systems studio.', 'https://vertexdigital.io', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=128&auto=format&fit=crop&q=80', 'active')
  on conflict (id) do update set
    name = excluded.name,
    industry = excluded.industry;

  -- 5. Recruiter Memberships
  insert into public.recruiter_company_memberships (recruiter_user_id, company_id, membership_role, approved_at)
  values
    (v_recruiter_auth_id, v_company_nova, 'lead_recruiter', now()),
    (v_recruiter_auth_id, v_company_aetos, 'guest_interviewer', now())
  on conflict (recruiter_user_id, company_id) do nothing;

  -- 6. Recruitment Drives
  insert into public.recruitment_drives (id, company_id, title, description, start_date, end_date, status, created_by)
  values
    (v_drive_aetos, v_company_aetos, 'Aetos AI Campus Fellowship 2026', 'Campus-wide drive for undergraduate AI engineers and research fellows.', now() - interval '10 days', now() + interval '30 days', 'active', v_admin_auth_id),
    (v_drive_nova, v_company_nova, 'NovaTech Early Careers Drive 2026', 'Tier-1 recruitment for software development trainees and cloud architects.', now() - interval '5 days', now() + interval '45 days', 'active', v_admin_auth_id),
    (v_drive_orbit, v_company_orbit, 'Orbit Data Analytics Drive', 'Selection pipeline for business analysts and data engineers.', now() - interval '2 days', now() + interval '20 days', 'active', v_admin_auth_id)
  on conflict (id) do nothing;

  -- 7. Job Postings & Eligibility Rules
  -- Job 1: AI Intern (Aetos DigiLog)
  insert into public.job_postings (
    id, company_id, drive_id, created_by, title, description,
    responsibilities, employment_type, work_mode, location,
    compensation_min, compensation_max, compensation_period, currency,
    openings, deadline, status
  )
  values (
    v_job_aetos, v_company_aetos, v_drive_aetos, v_admin_auth_id,
    'AI Intern',
    'Join our Core Research Group building autonomous agentic workflows and specialized domain models for mission planning.',
    array['Design and deploy agentic decision loops with LangGraph and Python', 'Evaluate model alignment against synthetic execution benchmarks', 'Collaborate with senior researchers on latency and token optimization'],
    'Internship', 'Hybrid', 'Bengaluru, Karnataka (Hybrid)',
    25000.00, 30000.00, 'monthly', 'INR',
    4, now() + interval '14 days', 'active'
  ) on conflict (id) do nothing;

  insert into public.job_eligibility_rules (
    job_id, minimum_cgpa, maximum_backlogs, allowed_branches, allowed_graduation_years, required_skills
  )
  values (
    v_job_aetos, 8.00, 0,
    array['Computer Science & Engineering', 'Artificial Intelligence & Data Science'],
    array[2026],
    array['Python', 'Agentic AI']
  ) on conflict (job_id) do nothing;

  -- Job 2: Software Engineer Trainee (NovaTech Systems)
  insert into public.job_postings (
    id, company_id, drive_id, created_by, title, description,
    responsibilities, employment_type, work_mode, location,
    compensation_min, compensation_max, compensation_period, currency,
    openings, deadline, status
  )
  values (
    v_job_nova_swe, v_company_nova, v_drive_nova, v_recruiter_auth_id,
    'Software Engineer Trainee',
    'Design, develop, and scale high-availability enterprise services handling millions of operations daily.',
    array['Build fault-tolerant microservices in Node.js and TypeScript', 'Optimize SQL queries and PostgreSQL database indexes', 'Participate in code reviews, CI/CD pipelines, and design critiques'],
    'Full-time', 'On-site', 'Hyderabad, Telangana (On-site)',
    1400000.00, 1800000.00, 'annual', 'INR',
    10, now() + interval '21 days', 'active'
  ) on conflict (id) do nothing;

  insert into public.job_eligibility_rules (
    job_id, minimum_cgpa, maximum_backlogs, allowed_branches, allowed_graduation_years, required_skills
  )
  values (
    v_job_nova_swe, 7.50, 0,
    array['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'],
    array[2026],
    array['TypeScript', 'React', 'Node.js']
  ) on conflict (job_id) do nothing;

  -- Job 3: Data Analyst Trainee (Orbit Analytics)
  insert into public.job_postings (
    id, company_id, drive_id, created_by, title, description,
    responsibilities, employment_type, work_mode, location,
    compensation_min, compensation_max, compensation_period, currency,
    openings, deadline, status
  )
  values (
    v_job_orbit_analyst, v_company_orbit, v_drive_orbit, v_admin_auth_id,
    'Data Analyst Trainee',
    'Transform complex operational data into actionable dashboards and automated decision workflows.',
    array['Write complex analytical SQL queries and build ETL scripts', 'Create interactive executive dashboards using Tableau and Python', 'Analyze product usage trends and present insights to stakeholders'],
    'Full-time', 'Hybrid', 'Pune, Maharashtra (Hybrid)',
    900000.00, 1200000.00, 'annual', 'INR',
    5, now() + interval '25 days', 'active'
  ) on conflict (id) do nothing;

  insert into public.job_eligibility_rules (
    job_id, minimum_cgpa, maximum_backlogs, allowed_branches, allowed_graduation_years, required_skills
  )
  values (
    v_job_orbit_analyst, 7.20, 1,
    array[]::text[], -- All branches allowed
    array[2026],
    array['SQL', 'Python']
  ) on conflict (job_id) do nothing;

  -- Job 4: AI Automation Intern (AgNext Technologies)
  insert into public.job_postings (
    id, company_id, drive_id, created_by, title, description,
    responsibilities, employment_type, work_mode, location,
    compensation_min, compensation_max, compensation_period, currency,
    openings, deadline, status
  )
  values (
    v_job_agnext_ai, v_company_agnext, null, v_admin_auth_id,
    'AI Automation Intern',
    'Automate testing, instrumentation, and continuous verification of deployed edge-AI models.',
    array['Build automated edge deployment pipelines', 'Implement performance instrumentation and telemetry', 'Evaluate model drift across agricultural dataset batches'],
    'Internship', 'Remote', 'Remote (India)',
    15000.00, 20000.00, 'monthly', 'INR',
    3, now() - interval '2 days', 'closed' -- Closed drive
  ) on conflict (id) do nothing;

  insert into public.job_eligibility_rules (
    job_id, minimum_cgpa, maximum_backlogs, allowed_branches, allowed_graduation_years, required_skills
  )
  values (
    v_job_agnext_ai, 7.00, 0,
    array['Computer Science & Engineering', 'Information Technology'],
    array[2026],
    array['Python']
  ) on conflict (job_id) do nothing;

  -- 8. Seed Applications for Aarav Sharma
  -- App 1: AI Intern (Interview Scheduled)
  insert into public.applications (id, student_id, job_id, status, applied_at)
  values (v_app_1, v_primary_student_id, v_job_aetos, 'interview', now() - interval '8 days')
  on conflict (id) do nothing;

  insert into public.application_status_history (application_id, previous_status, new_status, changed_by, change_reason, changed_at)
  values
    (v_app_1, null, 'submitted', v_student_auth_id, 'Application submitted by candidate.', now() - interval '8 days'),
    (v_app_1, 'submitted', 'shortlisted', v_recruiter_auth_id, 'Profile and AI portfolio matched requirements.', now() - interval '4 days'),
    (v_app_1, 'shortlisted', 'interview', v_recruiter_auth_id, 'Round 1 Technical Interview scheduled.', now() - interval '1 day')
  on conflict do nothing;

  -- App 2: Software Engineer Trainee (Shortlisted)
  insert into public.applications (id, student_id, job_id, status, applied_at)
  values (v_app_2, v_primary_student_id, v_job_nova_swe, 'shortlisted', now() - interval '6 days')
  on conflict (id) do nothing;

  insert into public.application_status_history (application_id, previous_status, new_status, changed_by, change_reason, changed_at)
  values
    (v_app_2, null, 'submitted', v_student_auth_id, 'Application submitted by candidate.', now() - interval '6 days'),
    (v_app_2, 'submitted', 'shortlisted', v_recruiter_auth_id, 'Academic criteria verified. Shortlisted.', now() - interval '2 days')
  on conflict do nothing;

  -- App 3: Data Analyst Trainee (Submitted)
  insert into public.applications (id, student_id, job_id, status, applied_at)
  values (v_app_3, v_primary_student_id, v_job_orbit_analyst, 'submitted', now() - interval '3 days')
  on conflict (id) do nothing;

  insert into public.application_status_history (application_id, previous_status, new_status, changed_by, change_reason, changed_at)
  values
    (v_app_3, null, 'submitted', v_student_auth_id, 'Application submitted by candidate.', now() - interval '3 days')
  on conflict do nothing;

  -- App 4: AI Automation Intern (Selected)
  insert into public.applications (id, student_id, job_id, status, applied_at)
  values (v_app_4, v_primary_student_id, v_job_agnext_ai, 'selected', now() - interval '20 days')
  on conflict (id) do nothing;

  insert into public.application_status_history (application_id, previous_status, new_status, changed_by, change_reason, changed_at)
  values
    (v_app_4, null, 'submitted', v_student_auth_id, 'Application submitted.', now() - interval '20 days'),
    (v_app_4, 'submitted', 'shortlisted', v_recruiter_auth_id, 'Shortlisted for interview.', now() - interval '15 days'),
    (v_app_4, 'shortlisted', 'interview', v_recruiter_auth_id, 'Technical interview completed.', now() - interval '10 days'),
    (v_app_4, 'interview', 'selected', v_recruiter_auth_id, 'Offer extended and candidate selected.', now() - interval '4 days')
  on conflict do nothing;

  -- 9. Scheduled Interview
  insert into public.interviews (
    id, application_id, scheduled_by, scheduled_at, duration_minutes,
    mode, location, meeting_url, round, status, feedback
  )
  values (
    'i1111111-1111-4111-a111-111111111111',
    v_app_1,
    v_recruiter_auth_id,
    now() + interval '3 days',
    60,
    'Virtual',
    null,
    'https://meet.google.com/aet-osdi-log',
    'Round 1: Technical & Agentic Architecture',
    'scheduled',
    'Please keep your IDE ready with your portfolio projects and be prepared to explain LangGraph or Agentic control loops.'
  ) on conflict (id) do nothing;

  -- 10. Seed Notifications
  insert into public.notifications (user_id, title, body, category, related_entity_id, is_read, created_at)
  values
    (v_student_auth_id, 'Interview Scheduled', 'Aetos DigiLog scheduled your Round 1 Technical Interview.', 'interview', v_app_1::text, false, now() - interval '1 day'),
    (v_student_auth_id, 'Offer Extended!', 'Congratulations! You have been selected for the AI Automation Intern role at AgNext Technologies.', 'application', v_app_4::text, false, now() - interval '4 days'),
    (v_student_auth_id, 'Shortlisted by NovaTech', 'Your application for Software Engineer Trainee at NovaTech Systems has been shortlisted.', 'application', v_app_2::text, true, now() - interval '2 days'),
    (v_recruiter_auth_id, 'New Application Received', 'Aarav Sharma submitted an application for Software Engineer Trainee.', 'application', v_app_2::text, false, now() - interval '6 days')
  on conflict do nothing;

  -- 11. Seed 19 additional synthetic students across branches and placement statuses
  -- to guarantee the mandatory 20 synthetic student records
  perform public.seed_synthetic_batch();
end $$;

-- Helper Function to Seed 20 Synthetic Students
create or replace function public.seed_synthetic_batch()
returns void as $$
declare
  v_rec record;
  v_new_user_id uuid;
  v_student_id uuid;
  v_idx int := 1;
  v_students jsonb := '[
    {"name": "Bhavna Kulkarni", "roll": "N25H02A0326", "email": "bhavna.k@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 9.20, "year": 2026, "skills": ["Python", "Django", "AWS", "PostgreSQL"], "status": "selected"},
    {"name": "Chirag Mehra", "roll": "N25H02A0327", "email": "chirag.m@campus.edu", "branch": "Information Technology", "cgpa": 8.40, "year": 2026, "skills": ["Java", "Spring Boot", "Kafka", "Docker"], "status": "interview"},
    {"name": "Divya Iyer", "roll": "N25H02A0328", "email": "divya.i@campus.edu", "branch": "Artificial Intelligence & Data Science", "cgpa": 9.45, "year": 2026, "skills": ["PyTorch", "Computer Vision", "Python", "MLOps"], "status": "selected"},
    {"name": "Eshaan Gupta", "roll": "N25H02A0329", "email": "eshaan.g@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 7.65, "year": 2026, "skills": ["React", "JavaScript", "Tailwind", "HTML5"], "status": "submitted"},
    {"name": "Farhan Ali", "roll": "N25H02A0330", "email": "farhan.a@campus.edu", "branch": "Electronics & Communication", "cgpa": 8.10, "year": 2026, "skills": ["C++", "Embedded C", "IoT", "Python"], "status": "shortlisted"},
    {"name": "Gayatri Joshi", "roll": "N25H02A0331", "email": "gayatri.j@campus.edu", "branch": "Information Technology", "cgpa": 8.75, "year": 2026, "skills": ["Go", "Kubernetes", "Linux", "SQL"], "status": "selected"},
    {"name": "Harsh Vardhan", "roll": "N25H02A0332", "email": "harsh.v@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 6.95, "year": 2026, "skills": ["Python", "SQL", "Excel", "Tableau"], "status": "rejected"},
    {"name": "Ishita Sen", "roll": "N25H02A0333", "email": "ishita.s@campus.edu", "branch": "Artificial Intelligence & Data Science", "cgpa": 8.90, "year": 2026, "skills": ["SQL", "R", "Tableau", "PowerBI"], "status": "selected"},
    {"name": "Jayant Patel", "roll": "N25H02A0334", "email": "jayant.p@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 7.80, "year": 2026, "skills": ["Node.js", "MongoDB", "Express", "React"], "status": "submitted"},
    {"name": "Kavya Pillai", "roll": "N25H02A0335", "email": "kavya.p@campus.edu", "branch": "Information Technology", "cgpa": 9.05, "year": 2026, "skills": ["Rust", "C++", "Systems", "Networks"], "status": "selected"},
    {"name": "Lokesh Nair", "roll": "N25H02A0336", "email": "lokesh.n@campus.edu", "branch": "Electronics & Communication", "cgpa": 7.30, "year": 2026, "skills": ["Python", "VLSI", "Verilog", "MATLAB"], "status": "unplaced"},
    {"name": "Meera Nambiar", "roll": "N25H02A0337", "email": "meera.n@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 8.60, "year": 2026, "skills": ["React Native", "Swift", "Flutter", "Firebase"], "status": "interview"},
    {"name": "Nikhil Saxena", "roll": "N25H02A0338", "email": "nikhil.s@campus.edu", "branch": "Information Technology", "cgpa": 8.35, "year": 2026, "skills": ["TypeScript", "GraphQL", "Next.js", "Jest"], "status": "selected"},
    {"name": "Ojas Deshmukh", "roll": "N25H02A0339", "email": "ojas.d@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 7.40, "year": 2026, "skills": ["Java", "SQL", "HTML/CSS", "Git"], "status": "unplaced"},
    {"name": "Prerna Singhania", "roll": "N25H02A0340", "email": "prerna.s@campus.edu", "branch": "Artificial Intelligence & Data Science", "cgpa": 9.30, "year": 2026, "skills": ["LLMs", "Prompt Engineering", "LangChain", "Python"], "status": "selected"},
    {"name": "Rohan Bose", "roll": "N25H02A0341", "email": "rohan.b@campus.edu", "branch": "Mechanical Engineering", "cgpa": 8.15, "year": 2026, "skills": ["Python", "Data Analytics", "AutoCAD", "SQL"], "status": "submitted"},
    {"name": "Sneha Chatterjee", "roll": "N25H02A0342", "email": "sneha.c@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 8.70, "year": 2026, "skills": ["Cybersecurity", "Linux", "Network Security", "Python"], "status": "selected"},
    {"name": "Tanmay Bhatt", "roll": "N25H02A0343", "email": "tanmay.b@campus.edu", "branch": "Information Technology", "cgpa": 7.10, "year": 2026, "skills": ["PHP", "MySQL", "JavaScript", "Bootstrap"], "status": "unplaced"},
    {"name": "Urvi Shah", "roll": "N25H02A0344", "email": "urvi.s@campus.edu", "branch": "Computer Science & Engineering", "cgpa": 9.15, "year": 2026, "skills": ["Kubernetes", "Cloud Architecture", "Go", "GCP"], "status": "selected"}
  ]'::jsonb;
begin
  for v_rec in select * from jsonb_to_recordset(v_students) as x(
    name text, roll text, email text, branch text, cgpa numeric, year int, skills text[], status text
  )
  loop
    v_new_user_id := gen_random_uuid();

    -- Create profile
    insert into public.profiles (id, email, full_name, role)
    values (v_new_user_id, v_rec.email, v_rec.name, 'student')
    on conflict (email) do update set full_name = excluded.full_name
    returning id into v_new_user_id;

    -- Create student_profile
    insert into public.student_profiles (
      user_id, roll_number, course, branch, graduation_year, cgpa, active_backlogs
    )
    values (
      v_new_user_id, v_rec.roll, 'B.Tech', v_rec.branch, v_rec.year, v_rec.cgpa, 0
    )
    on conflict (roll_number) do update set cgpa = excluded.cgpa
    returning id into v_student_id;

    -- Skills
    insert into public.student_skills (student_id, skill_name)
    select v_student_id, unnest(v_rec.skills)
    on conflict do nothing;

    -- If placed (selected), link an application to NovaTech SWE
    if v_rec.status = 'selected' then
      insert into public.applications (student_id, job_id, status, applied_at)
      values (v_student_id, 'j2222222-2222-4222-a222-222222222222'::uuid, 'selected', now() - interval '10 days')
      on conflict (student_id, job_id) do nothing;
    elsif v_rec.status in ('submitted', 'shortlisted', 'interview', 'rejected') then
      insert into public.applications (student_id, job_id, status, applied_at)
      values (v_student_id, 'j2222222-2222-4222-a222-222222222222'::uuid, v_rec.status::application_status_type, now() - interval '5 days')
      on conflict (student_id, job_id) do nothing;
    end if;
  end loop;
end;
$$ language plpgsql security definer set search_path = public;
