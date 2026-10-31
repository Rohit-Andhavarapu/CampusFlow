import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.resolve(__dirname, '../../.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
      }
    }
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = process.env.SUPABASE_URL || env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing Supabase configuration in .env');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function seedDemoResume() {
  console.log('--- SEEDING SYNTHETIC DEMO RESUME (AARAV SHARMA) ---');

  // 1. Locate Aarav Profile & Student Profile
  const { data: prof, error: profErr } = await supabaseAdmin
    .from('profiles')
    .select('id, email, full_name')
    .eq('email', 'aarav.sharma@campus.edu')
    .single();

  if (profErr || !prof) {
    throw new Error(`Could not find profile for aarav.sharma@campus.edu: ${profErr?.message}`);
  }

  const { data: studentProf, error: studentErr } = await supabaseAdmin
    .from('student_profiles')
    .select('id, user_id, full_name')
    .eq('user_id', prof.id)
    .single();

  if (studentErr || !studentProf) {
    throw new Error(`Could not find student_profiles for user ${prof.id}: ${studentErr?.message}`);
  }

  console.log(`Found Student Record: ${studentProf.full_name} (${studentProf.id})`);

  // 2. Read fixture PDF
  const fixturePath = path.resolve(__dirname, 'Aarav_Sharma_Resume_2026.pdf');
  if (!fs.existsSync(fixturePath)) {
    throw new Error(`Fixture not found at ${fixturePath}`);
  }
  const fileBytes = fs.readFileSync(fixturePath);
  const storagePath = `${prof.id}/Aarav_Sharma_Resume_2026.pdf`;

  // 3. Ensure bucket exists
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.some((b) => b.name === 'resumes')) {
    console.log('Creating "resumes" storage bucket...');
    await supabaseAdmin.storage.createBucket('resumes', { public: false });
  }

  // 4. Upload PDF to Storage
  console.log(`Uploading ${fileBytes.length} bytes to storage: resumes/${storagePath}...`);
  const { error: uploadErr } = await supabaseAdmin.storage
    .from('resumes')
    .upload(storagePath, fileBytes, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadErr) {
    throw new Error(`Failed to upload resume to storage: ${uploadErr.message}`);
  }
  console.log('✓ Successfully uploaded resume PDF to Supabase Storage');

  // 5. Upsert resume_files table record
  const { data: existingFiles } = await supabaseAdmin
    .from('resume_files')
    .select('id')
    .eq('student_id', studentProf.id);

  if (existingFiles && existingFiles.length > 0) {
    await supabaseAdmin
      .from('resume_files')
      .update({
        storage_path: storagePath,
        original_filename: 'Aarav_Sharma_Resume_2026.pdf',
        file_size: fileBytes.length,
        content_type: 'application/pdf',
        uploaded_at: new Date().toISOString(),
      })
      .eq('id', existingFiles[0].id);
    console.log(`✓ Updated existing resume_files record ${existingFiles[0].id}`);
  } else {
    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from('resume_files')
      .insert({
        student_id: studentProf.id,
        storage_path: storagePath,
        original_filename: 'Aarav_Sharma_Resume_2026.pdf',
        file_size: fileBytes.length,
        content_type: 'application/pdf',
        uploaded_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (insertErr) {
      throw new Error(`Failed to insert resume_files record: ${insertErr.message}`);
    }
    console.log(`✓ Inserted new resume_files record ${inserted.id}`);
  }

  console.log('🎉 Synthetic Demo Resume Seed Completed Successfully!');
}

seedDemoResume().catch((err) => {
  console.error('Error seeding demo resume:', err);
  process.exit(1);
});
