import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = 
  supabaseUrl && 
  supabaseUrl !== 'your_supabase_url' && 
  supabaseUrl !== '' &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your_supabase_anon_key' &&
  supabaseAnonKey !== '';

let supabase = null;

if (isConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn("Failed to initialize Supabase Client:", error);
  }
} else {
  console.log("Supabase is unconfigured or using placeholders. Sync running in Simulated Local Mode.");
}

export { supabase };
