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

async function testAnalytics() {
  await supabase.auth.signInWithPassword({ email: 'placements@campus.edu', password: 'CampusFlow2026!' });
  const { data, error } = await supabase.rpc('get_placement_analytics');
  if (error) console.error('Analytics error:', error);
  else console.log('Analytics data:', JSON.stringify(data, null, 2));
}

testAnalytics().catch(console.error);
