import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from './appConfig';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
  }
} else {
  console.info(
    'Supabase not configured — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env (see docs/CLOUD_SETUP.md).'
  );
}

export { supabase };
