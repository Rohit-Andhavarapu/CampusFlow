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

async function testFetchNotifications() {
  console.log('Testing notifications fetch...');
  await supabase.auth.signInWithPassword({ email: 'aarav.sharma@campus.edu', password: 'CampusFlow2026!' });
  const { data: notifs, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching notifications:', error);
  else {
    console.log('Notifications count for Aarav:', notifs.length);
    if (notifs.length > 0) {
      console.log('Sample notification:', notifs[0]);
    }
  }
}

testFetchNotifications().catch(console.error);
