const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const lines = envFile.split('\n');
const env = {};
for (const line of lines) {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*?)\s*$/);
  if (match) env[match[1]] = match[2];
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseSecret = env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, supabaseSecret);

async function test() {
  const { data, error } = await supabase.from('student_watchlists').select('*').limit(1);
  console.log('Result:', { data, error });
}
test();
