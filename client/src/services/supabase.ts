import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseUrl.includes('your-project-ref') &&
    typeof supabaseKey === 'string' &&
    supabaseKey.trim().length > 0 &&
    !supabaseKey.includes('your-supabase')
  );
};

// Fallback dummy URL and anon key to prevent createClient crashes if unconfigured
const clientUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder-campusflow.supabase.co';
const clientKey = isSupabaseConfigured() ? supabaseKey : 'placeholder-anon-key';

export const supabase = createClient<Database>(clientUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
