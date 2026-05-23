import { supabase } from '../config/supabase';
import { isSupabaseConfigured } from '../config/appConfig';

/**
 * Links a Firebase session to Supabase so RLS policies (auth.uid()) work.
 * Requires Firebase provider enabled in Supabase Dashboard → Authentication.
 */
export async function linkFirebaseToSupabase(firebaseUser) {
  if (!supabase || !isSupabaseConfigured || !firebaseUser) {
    return { ok: false, reason: 'not_configured' };
  }

  try {
    const token = await firebaseUser.getIdToken(true);
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'firebase',
      token,
    });

    if (error) {
      console.warn('Supabase Firebase auth link failed:', error.message);
      return { ok: false, reason: error.message };
    }

    return { ok: true, session: data.session };
  } catch (err) {
    console.warn('Supabase Firebase auth link error:', err.message);
    return { ok: false, reason: err.message };
  }
}

export async function signOutSupabase() {
  if (!supabase) return;
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.warn('Supabase sign out:', e.message);
  }
}
