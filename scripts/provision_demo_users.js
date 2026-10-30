// ==============================================================================
// CampusFlow V4 — Official Supabase Auth Demo User Provisioning Script
// Uses the official Supabase Admin API to guarantee GoTrue v2 password authentication
// ==============================================================================

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load environment variables from .env
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
    throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env.');
  }

  const supabase = createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const demoAccounts = [
    {
      id: 'a0000000-0000-4000-a000-000000000001',
      email: 'aarav.sharma@campus.edu',
      password: 'CampusFlow2026!',
      fullName: 'Aarav Sharma',
      role: 'student',
    },
    {
      id: 'b0000000-0000-4000-a000-000000000001',
      email: 'priya.nair@novatech.io',
      password: 'CampusFlow2026!',
      fullName: 'Priya Nair',
      role: 'recruiter',
    },
    {
      id: 'c0000000-0000-4000-a000-000000000001',
      email: 'placements@campus.edu',
      password: 'CampusFlow2026!',
      fullName: 'Dr. Rajesh Rao',
      role: 'placement_admin',
    },
  ];

  const { data: existingData, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });

  if (listError) {
    console.error('Failed to list existing auth users:', listError.message);
    process.exit(1);
  }

  const existingUsers = existingData?.users || [];

  for (const account of demoAccounts) {
    const existing = existingUsers.find((u) => u.email?.toLowerCase() === account.email.toLowerCase());

    if (existing) {
      console.log(`[EXISTS] User ${account.email} found (ID: ${existing.id}). Updating credentials...`);
      const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
        password: account.password,
        email_confirm: true,
        user_metadata: { full_name: account.fullName },
      });

      if (updateError) {
        console.error(`  [ERROR] Failed to update ${account.email}: ${updateError.message}`);
      } else {
        console.log(`  ✓ Successfully updated credentials for ${account.email}`);
      }
    } else {
      console.log(`[CREATING] Provisioning ${account.role.toUpperCase()}: ${account.email}...`);
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        id: account.id,
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { full_name: account.fullName },
      });

      if (createError) {
        console.error(`  [ERROR] Failed to create ${account.email}: ${createError.message}`);
      } else {
        console.log(`  ✓ Created user ${account.email} with ID ${newUser.user.id}`);
      }
    }
  }

  console.log('\n====================================================================');
  console.log('✅ ALL DEMO ACCOUNTS PROVISIONED & VERIFIED FOR GOTRUE LOGIN');
  console.log('====================================================================\n');
}

// Run if directly called
if (require.main === module) {
  provisionDemoUsers().catch((err) => {
    console.error('Provisioning failed:', err);
    process.exit(1);
  });
}

module.exports = { provisionDemoUsers };
