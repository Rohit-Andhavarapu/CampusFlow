// ==============================================================================
// CampusFlow V4 — Official Supabase Auth Demo User Provisioning & Relational Linking
// Provisions the 3 authenticated accounts via GoTrue Admin API and links
// profiles, recruiter company memberships, and student credentials using REAL user IDs
// ==============================================================================

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error('Root .env file not found.');
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

async function provisionDemoUsers() {
  console.log('\n====================================================================');
  console.log('🚀 CAMPUSFLOW V4: PROVISIONING AUTHENTICATED DEMO ACCOUNTS');
  console.log('====================================================================\n');

  const env = loadEnv();
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const secretKey = env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be configured in .env.');
  }

  const supabase = createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const demoAccounts = [
    {
      email: 'aarav.sharma@campus.edu',
      password: 'CampusFlow2026!',
      fullName: 'Aarav Sharma',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      email: 'priya.nair@novatech.io',
      password: 'CampusFlow2026!',
      fullName: 'Priya Nair',
      role: 'recruiter',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    {
      email: 'placements@campus.edu',
      password: 'CampusFlow2026!',
      fullName: 'Dr. Rajesh Rao',
      role: 'placement_admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
  ];

  // 1. Fetch existing users to determine create vs update
  const { data: existingData, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });

  if (listError) {
    console.error('Failed to list existing auth users:', listError.message);
    process.exit(1);
  }

  const existingUsers = existingData?.users || [];
  const resolvedUserIds = {};

  // 2. Provision or update GoTrue users
  for (const account of demoAccounts) {
    const existing = existingUsers.find((u) => u.email?.toLowerCase() === account.email.toLowerCase());

    if (existing) {
      console.log(`[EXISTS] User ${account.email} found (ID: ${existing.id}). Synchronizing password...`);
      const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
        password: account.password,
        email_confirm: true,
        user_metadata: { full_name: account.fullName },
      });

      if (updateError) {
        console.error(`  [ERROR] Failed to update ${account.email}: ${updateError.message}`);
      } else {
        resolvedUserIds[account.role] = existing.id;
        console.log(`  ✓ Updated password & confirmed email for ${account.email}`);
      }
    } else {
      console.log(`[CREATING] Provisioning ${account.role.toUpperCase()}: ${account.email}...`);
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { full_name: account.fullName },
      });

      if (createError) {
        console.error(`  [ERROR] Failed to create ${account.email}: ${createError.message}`);
      } else {
        resolvedUserIds[account.role] = newUser.user.id;
        console.log(`  ✓ Created user ${account.email} with Real ID: ${newUser.user.id}`);
      }
    }
  }

  const studentUserId = resolvedUserIds['student'];
  const recruiterUserId = resolvedUserIds['recruiter'];
  const adminUserId = resolvedUserIds['admin'] || resolvedUserIds['placement_admin'];

  console.log('\n--- Linking Database Profiles with Real GoTrue User IDs ---');

  // 3. Update Profiles with verified administrative roles using service_role privileges
  for (const account of demoAccounts) {
    const userId = resolvedUserIds[account.role];
    if (!userId) continue;

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: account.email,
        full_name: account.fullName,
        role: account.role,
        avatar_path: account.avatar,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (profileError) {
      console.error(`  [ERROR] Could not upsert profile for ${account.email}:`, profileError.message);
    } else {
      console.log(`  ✓ Profile set for ${account.email} -> Role: ${account.role}`);
    }
  }

  // 4. Remove any accidental student_profiles created by triggers for recruiter/admin
  if (recruiterUserId && adminUserId) {
    await supabase.from('student_profiles').delete().in('user_id', [recruiterUserId, adminUserId]);
  }

  // 5. Link Recruiter Company Membership (Priya Nair -> NovaTech Systems)
  if (recruiterUserId) {
    const novaTechCompanyId = '22222222-2222-4222-a222-222222222222';
    const { error: memberError } = await supabase
      .from('recruiter_company_memberships')
      .upsert({
        recruiter_user_id: recruiterUserId,
        company_id: novaTechCompanyId,
        membership_role: 'recruiter',
        approved_at: new Date().toISOString(),
      }, { onConflict: 'recruiter_user_id,company_id' });

    if (memberError) {
      console.error('  [ERROR] Recruiter membership linking failed:', memberError.message);
    } else {
      console.log('  ✓ Recruiter Priya Nair linked to NovaTech Systems (Approved)');
    }
  }

  // 6. Link Aarav Sharma in student_profiles with verified academic metrics
  if (studentUserId) {
    let studentProfileId;

    const { data: existingSp } = await supabase
      .from('student_profiles')
      .select('id')
      .or(`user_id.eq.${studentUserId},email.eq.aarav.sharma@campus.edu`)
      .limit(1)
      .single();

    if (existingSp) {
      studentProfileId = existingSp.id;
      const { error: spUpdateError } = await supabase
        .from('student_profiles')
        .update({
          user_id: studentUserId,
          full_name: 'Aarav Sharma',
          email: 'aarav.sharma@campus.edu',
          roll_number: 'N25H02A0325',
          course: 'B.Tech',
          branch: 'Computer Science & Engineering',
          graduation_year: 2026,
          cgpa: 8.85,
          active_backlogs: 0,
          phone: '+91 98765 43210',
          bio: 'Final-year CS undergrad passionate about high-performance systems and Agentic AI.',
          github_url: 'https://github.com/aarav-sharma',
          linkedin_url: 'https://linkedin.com/in/aarav-sharma-campus',
          portfolio_url: 'https://aaravsharma.dev',
          updated_at: new Date().toISOString(),
        })
        .eq('id', studentProfileId);

      if (spUpdateError) console.error('  [ERROR] Updating student profile:', spUpdateError.message);
      else console.log(`  ✓ Updated Aarav Sharma's verified student profile (ID: ${studentProfileId})`);
    } else {
      const { data: newSp, error: spInsertError } = await supabase
        .from('student_profiles')
        .insert({
          user_id: studentUserId,
          full_name: 'Aarav Sharma',
          email: 'aarav.sharma@campus.edu',
          roll_number: 'N25H02A0325',
          course: 'B.Tech',
          branch: 'Computer Science & Engineering',
          graduation_year: 2026,
          cgpa: 8.85,
          active_backlogs: 0,
          phone: '+91 98765 43210',
          bio: 'Final-year CS undergrad passionate about high-performance systems and Agentic AI.',
          github_url: 'https://github.com/aarav-sharma',
          linkedin_url: 'https://linkedin.com/in/aarav-sharma-campus',
          portfolio_url: 'https://aaravsharma.dev',
        })
        .select()
        .single();

      if (spInsertError) console.error('  [ERROR] Inserting student profile:', spInsertError.message);
      else {
        studentProfileId = newSp.id;
        console.log(`  ✓ Created Aarav Sharma's student profile (ID: ${studentProfileId})`);
      }
    }

    // 7. Seed Skills for Aarav
    if (studentProfileId) {
      const skills = ['React', 'TypeScript', 'Node.js', 'Python', 'Agentic AI', 'PostgreSQL', 'Tailwind CSS', 'Docker'];
      for (const skill of skills) {
        await supabase
          .from('student_skills')
          .upsert({ student_id: studentProfileId, skill_name: skill }, { onConflict: 'student_id,skill_name' });
      }
      console.log('  ✓ Seeded 8 core skills for Aarav Sharma');

      // 8. Seed Projects for Aarav
      await supabase.from('student_projects').upsert([
        {
          student_id: studentProfileId,
          title: 'Distributed Log Aggregator',
          description: 'High-throughput streaming analytics platform handling 15k events/sec using Go, Kafka, and ClickHouse.',
          project_url: 'https://github.com/aarav-sharma/dist-logger',
          technologies: ['Go', 'Kafka', 'ClickHouse', 'Docker'],
        },
        {
          student_id: studentProfileId,
          title: 'Autonomous Code Refactoring Agent',
          description: 'LLM-powered tool using tree-sitter AST queries to automate TypeScript migrations and dead code removal.',
          project_url: 'https://github.com/aarav-sharma/auto-refactor',
          technologies: ['TypeScript', 'Python', 'AST', 'OpenAI API'],
        },
      ]);
      console.log('  ✓ Seeded 2 portfolio projects for Aarav Sharma');

      // 9. Seed Demo Applications & Status History
      const sweJobId = '20000000-0000-4000-a000-000000000001'; // NovaTech SWE
      const aetosJobId = '10000000-0000-4000-a000-000000000001'; // Aetos AI

      const { data: app1 } = await supabase
        .from('applications')
        .upsert({
          student_id: studentProfileId,
          job_id: sweJobId,
          status: 'interview',
          applied_at: new Date(Date.now() - 6 * 86400000).toISOString(),
        }, { onConflict: 'student_id,job_id' })
        .select()
        .single();

      if (app1) {
        await supabase.from('interviews').upsert({
          application_id: app1.id,
          scheduled_by: recruiterUserId,
          scheduled_at: new Date(Date.now() + 3 * 86400000).toISOString(),
          duration_minutes: 60,
          mode: 'Virtual',
          meeting_url: 'https://meet.google.com/nov-atech-swe',
          round: 'Round 1: Technical & System Design',
          status: 'scheduled',
          feedback: 'Please prepare to discuss distributed systems and high-throughput microservices.',
        }, { onConflict: 'id' });
        console.log('  ✓ Seeded Interview Application with NovaTech Systems');
      }

      await supabase
        .from('applications')
        .upsert({
          student_id: studentProfileId,
          job_id: aetosJobId,
          status: 'selected',
          applied_at: new Date(Date.now() - 15 * 86400000).toISOString(),
        }, { onConflict: 'student_id,job_id' });
      console.log('  ✓ Seeded Selected Offer Application with Aetos DigiLog');
    }
  }

  console.log('\n====================================================================');
  console.log('✅ ALL DEMO ACCOUNTS & RELATIONAL LINKS FULLY PROVISIONED');
  console.log('====================================================================\n');
}

if (require.main === module) {
  provisionDemoUsers().catch((err) => {
    console.error('Provisioning failed:', err);
    process.exit(1);
  });
}

module.exports = { provisionDemoUsers };
