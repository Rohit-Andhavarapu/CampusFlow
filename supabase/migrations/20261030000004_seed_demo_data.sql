-- ==============================================================================
-- CampusFlow V4 - Supabase Migration: 004_seed_demo_data.sql
-- Problem Statement: HACK-P410 (Campus Recruitment Portal)
-- Seed Data: Synthetic University Directory & Enterprise Recruitment Infrastructure
-- ==============================================================================

-- ==============================================================================
-- 10. SYNTHETIC BATCH SEED HELPER (DEFINED BEFORE EXECUTION)
-- ==============================================================================
create or replace function public.seed_synthetic_batch()
returns void as $$
declare
  v_rec record;
  v_student_id uuid;
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
    insert into public.student_profiles (
      full_name, email, roll_number, course, branch, graduation_year, cgpa, active_backlogs
    )
    values (
      v_rec.name, v_rec.email, v_rec.roll, 'B.Tech', v_rec.branch, v_rec.year, v_rec.cgpa, 0
    )
    on conflict (roll_number) do update set
      cgpa = excluded.cgpa,
      full_name = excluded.full_name
    returning id into v_student_id;

    insert into public.student_skills (student_id, skill_name)
    select v_student_id, unnest(v_rec.skills)
    on conflict do nothing;

    if v_rec.status = 'selected' then
      insert into public.applications (student_id, job_id, status, applied_at)
      values (v_student_id, '20000000-0000-4000-a000-000000000001'::uuid, 'selected', now() - interval '10 days')
      on conflict (student_id, job_id) do nothing;
    elsif v_rec.status in ('submitted', 'shortlisted', 'interview', 'rejected') then
      insert into public.applications (student_id, job_id, status, applied_at)
      values (v_student_id, '20000000-0000-4000-a000-000000000001'::uuid, v_rec.status::application_status_type, now() - interval '5 days')
      on conflict (student_id, job_id) do nothing;
    end if;
  end loop;
end;
$$ language plpgsql security definer set search_path = public;


-- ==============================================================================
-- 11. RECRUITMENT ECOSYSTEM SEED DATA (INDEPENDENT OF AUTH PROVISIONING)
-- ==============================================================================
do $$
declare
  -- STRICTLY VALID HEXADECIMAL UUIDS FOR RECRUITMENT INFRASTRUCTURE
  v_company_aetos uuid := '11111111-1111-4111-a111-111111111111';
  v_company_nova uuid := '22222222-2222-4222-a222-222222222222';
  v_company_agnext uuid := '33333333-3333-4333-a333-333333333333';
  v_company_orbit uuid := '44444444-4444-4444-a444-444444444444';
  v_company_medrenova uuid := '55555555-5555-4555-a555-555555555555';
  v_company_vertex uuid := '66666666-6666-4666-a666-666666666666';

  v_drive_aetos uuid := 'd1111111-1111-4111-a111-111111111111';
  v_drive_nova uuid := 'd2222222-2222-4222-a222-222222222222';
  v_drive_orbit uuid := 'd4444444-4444-4444-a444-444444444444';

  v_job_aetos uuid := '10000000-0000-4000-a000-000000000001';
  v_job_nova_swe uuid := '20000000-0000-4000-a000-000000000001';
  v_job_nova_cloud uuid := '20000000-0000-4000-a000-000000000002';
  v_job_agnext_ai uuid := '30000000-0000-4000-a000-000000000001';
  v_job_orbit_analyst uuid := '40000000-0000-4000-a000-000000000001';
  v_job_medrenova_cv uuid := '50000000-0000-4000-a000-000000000001';
  v_job_vertex_fs uuid := '60000000-0000-4000-a000-000000000001';
begin
  -- 1. Empaneled Hiring Organizations (Companies)
  insert into public.companies (id, name, industry, description, website, logo_path, status)
  values
    (v_company_aetos, 'Aetos DigiLog', 'Artificial Intelligence & Defense Tech', 'Next-generation intelligent autonomy and multi-agent coordination systems.', 'https://aetosdigilog.com', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_nova, 'NovaTech Systems', 'Enterprise Software & Cloud Platforms', 'Global cloud automation and mission-critical developer infrastructure.', 'https://novatech.io', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_agnext, 'AgNext Technologies', 'AgriTech & Automation', 'Deep-tech computer vision and spectroscopy analytics for agricultural value chains.', 'https://agnext.com', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_orbit, 'Orbit Analytics', 'Data Intelligence & Analytics', 'Enterprise business intelligence and decision-intelligence platform.', 'https://orbitanalytics.com', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_medrenova, 'MedRenova Diagnostics', 'HealthTech & Medical Imaging', 'AI-assisted medical pathology and diagnostic imaging platforms.', 'https://medrenova.health', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80', 'active'),
    (v_company_vertex, 'Vertex Solutions', 'FinTech & High-Frequency Trading', 'Ultra-low-latency financial systems and quantitative risk management.', 'https://vertexsolutions.com', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80', 'active')
  on conflict (id) do update set
    name = excluded.name,
    industry = excluded.industry,
    status = excluded.status;

  -- 2. Campus Recruitment Drives
  insert into public.recruitment_drives (id, company_id, title, start_date, end_date, status)
  values
    (v_drive_aetos, v_company_aetos, 'Aetos Autonomous Systems Campus Drive 2026', now() - interval '14 days', now() + interval '30 days', 'active'),
    (v_drive_nova, v_company_nova, 'NovaTech Enterprise Engineering Hiring 2026', now() - interval '20 days', now() + interval '25 days', 'active'),
    (v_drive_orbit, v_company_orbit, 'Orbit Data & Analytics Placement Drive 2026', now() - interval '5 days', now() + interval '40 days', 'active')
  on conflict (id) do update set
    title = excluded.title,
    status = excluded.status;

  -- 3. Job Postings
  insert into public.job_postings (
    id, company_id, drive_id, title, description,
    responsibilities, employment_type, work_mode, location,
    compensation_min, compensation_max, compensation_period, currency,
    openings, deadline, status
  )
  values
    (
      v_job_aetos, v_company_aetos, v_drive_aetos,
      'Graduate AI Engineer (Agentic Systems)',
      'Design, benchmark, and deploy multi-agent coordination systems, autonomous workflows, and LLM orchestration tools for enterprise and defense applications.',
      array['Design multi-agent autonomous control loops', 'Implement evaluation harnesses for LLM reasoning', 'Build production distributed services in Python and TypeScript'],
      'Full-time', 'Hybrid', 'Bengaluru, Karnataka (Hybrid)',
      1800000.00, 2400000.00, 'annual', 'INR',
      5, now() + interval '21 days', 'active'
    ),
    (
      v_job_nova_swe, v_company_nova, v_drive_nova,
      'Software Engineer Trainee',
      'Design, develop, and scale high-availability enterprise services handling millions of operations daily.',
      array['Build fault-tolerant microservices in Node.js and TypeScript', 'Optimize SQL queries and PostgreSQL database indexes', 'Participate in code reviews, CI/CD pipelines, and design critiques'],
      'Full-time', 'On-site', 'Hyderabad, Telangana (On-site)',
      1400000.00, 1800000.00, 'annual', 'INR',
      10, now() + interval '21 days', 'active'
    ),
    (
      v_job_nova_cloud, v_company_nova, v_drive_nova,
      'Cloud Infrastructure Specialist',
      'Architect Kubernetes-native infrastructure, automate CI/CD pipelines, and manage hybrid multi-region cloud networks.',
      array['Manage cloud environments and Kubernetes clusters', 'Implement infrastructure as code with Terraform', 'Build automated observability and alerting with Prometheus'],
      'Full-time', 'Remote', 'Remote (India)',
      1500000.00, 2000000.00, 'annual', 'INR',
      4, now() + interval '18 days', 'active'
    ),
    (
      v_job_orbit_analyst, v_company_orbit, v_drive_orbit,
      'Data Analyst Trainee',
      'Transform complex operational data into actionable dashboards and automated decision workflows.',
      array['Write complex analytical SQL queries and build ETL scripts', 'Create interactive executive dashboards using Tableau and Python', 'Analyze product usage trends and present insights to stakeholders'],
      'Full-time', 'Hybrid', 'Pune, Maharashtra (Hybrid)',
      900000.00, 1200000.00, 'annual', 'INR',
      5, now() + interval '25 days', 'active'
    ),
    (
      v_job_agnext_ai, v_company_agnext, null,
      'AI Automation Intern',
      'Automate testing, instrumentation, and continuous verification of deployed edge-AI models.',
      array['Build automated edge deployment pipelines', 'Implement performance instrumentation and telemetry', 'Evaluate model drift across agricultural dataset batches'],
      'Internship', 'Remote', 'Remote (India)',
      15000.00, 20000.00, 'monthly', 'INR',
      3, now() - interval '2 days', 'closed'
    ),
    (
      v_job_medrenova_cv, v_company_medrenova, null,
      'Medical Imaging AI Research Engineer',
      'Train deep neural networks for digital pathology scan classification and anatomical structure segmentation under HIPAA guidelines.',
      array['Develop computer vision models with PyTorch', 'Annotate medical scan datasets', 'Optimize models for edge inference on clinical hardware'],
      'Full-time', 'Hybrid', 'Bengaluru, Karnataka (Hybrid)',
      2000000.00, 2800000.00, 'annual', 'INR',
      2, now() + interval '30 days', 'active'
    ),
    (
      v_job_vertex_fs, v_company_vertex, null,
      'Quantitative Systems Engineer',
      'Build low-latency execution engines, order-matching algorithms, and high-frequency risk monitoring pipelines using modern C++ and Rust.',
      array['Implement low-latency socket networking', 'Optimize cache locality and data structures', 'Maintain 99.999% uptime trading services'],
      'Full-time', 'On-site', 'Mumbai, Maharashtra (On-site)',
      2400000.00, 3200000.00, 'annual', 'INR',
      4, now() + interval '15 days', 'active'
    )
  on conflict (id) do update set
    title = excluded.title,
    status = excluded.status;

  -- 4. Job Eligibility Rules
  insert into public.job_eligibility_rules (
    job_id, minimum_cgpa, maximum_backlogs, allowed_branches, allowed_graduation_years, required_skills
  )
  values
    (
      v_job_aetos, 8.00, 0,
      array['Computer Science & Engineering', 'Artificial Intelligence & Data Science', 'Information Technology'],
      array[2026],
      array['Python', 'Agentic AI', 'PostgreSQL']
    ),
    (
      v_job_nova_swe, 7.50, 0,
      array['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'],
      array[2026],
      array['TypeScript', 'React', 'Node.js']
    ),
    (
      v_job_nova_cloud, 7.00, 1,
      array['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering'],
      array[2026],
      array['Docker', 'Kubernetes', 'Linux']
    ),
    (
      v_job_orbit_analyst, 7.20, 1,
      array[]::text[],
      array[2026],
      array['SQL', 'Python']
    ),
    (
      v_job_agnext_ai, 7.00, 0,
      array['Computer Science & Engineering', 'Information Technology'],
      array[2026],
      array['Python']
    ),
    (
      v_job_medrenova_cv, 8.20, 0,
      array['Computer Science & Engineering', 'Artificial Intelligence & Data Science'],
      array[2026],
      array['PyTorch', 'Computer Vision']
    ),
    (
      v_job_vertex_fs, 8.50, 0,
      array['Computer Science & Engineering', 'Information Technology'],
      array[2026],
      array['C++', 'Rust', 'Algorithms']
    )
  on conflict (job_id) do update set
    minimum_cgpa = excluded.minimum_cgpa,
    allowed_branches = excluded.allowed_branches;

  -- 5. Seed 19 Non-Login Synthetic Directory Students
  perform public.seed_synthetic_batch();

end $$;

-- ==============================================================================
-- 12. VERIFICATION QUERIES
-- ============================================================================== 
select 'Deployment verification complete.' as status,
       (select count(*) from public.companies) as companies_count,
       (select count(*) from public.recruitment_drives) as drives_count,
       (select count(*) from public.job_postings) as jobs_count,
       (select count(*) from public.student_profiles) as students_count,
       (select count(*) from public.applications) as applications_count;
