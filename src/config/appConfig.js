/** Shared environment / feature flags for Firebase + Supabase */

const placeholder = (v) =>
  !v ||
  v === '' ||
  v === 'your_firebase_api_key' ||
  v === 'your_firebase_auth_domain' ||
  v === 'your_firebase_project_id' ||
  v === 'your_supabase_url' ||
  v === 'your_supabase_anon_key';

export const isFirebaseConfigured =
  !placeholder(import.meta.env.VITE_FIREBASE_API_KEY) &&
  !placeholder(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) &&
  !placeholder(import.meta.env.VITE_FIREBASE_PROJECT_ID) &&
  !placeholder(import.meta.env.VITE_FIREBASE_APP_ID);

export const isSupabaseConfigured =
  !placeholder(import.meta.env.VITE_SUPABASE_URL) &&
  !placeholder(import.meta.env.VITE_SUPABASE_ANON_KEY);

export const isCloudFullyConfigured = isFirebaseConfigured && isSupabaseConfigured;

export const DOCUMENTS_BUCKET = 'documents';
