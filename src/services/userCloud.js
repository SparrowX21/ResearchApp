import { supabase } from '../config/supabase';
import { isSupabaseConfigured } from '../config/appConfig';
import { mapUserFromDb, mapUserToDb, buildNewUserFromFirebase } from '../lib/userMapper';

export function isUserCloudAvailable() {
  return Boolean(supabase && isSupabaseConfigured);
}

/** Fetch user row by Firebase UID (requires Supabase session linked) */
export async function fetchUserById(uid) {
  if (!isUserCloudAvailable()) return { user: null, error: 'not_configured' };

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', uid)
    .maybeSingle();

  if (error) return { user: null, error };
  return { user: mapUserFromDb(data), error: null };
}

/** Create user profile row after first Firebase sign-in */
export async function createUserProfile(firebaseUser) {
  if (!isUserCloudAvailable()) return { user: null, error: 'not_configured' };

  const appUser = buildNewUserFromFirebase(firebaseUser);
  const row = mapUserToDb(appUser);

  const { data, error } = await supabase
    .from('users')
    .insert([row])
    .select()
    .single();

  if (error) return { user: null, error };
  return { user: mapUserFromDb(data), error: null };
}

export async function upsertUserProfile(appUser) {
  if (!isUserCloudAvailable()) return { user: null, error: 'not_configured' };

  const row = mapUserToDb(appUser);
  const { data, error } = await supabase
    .from('users')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();

  if (error) return { user: null, error };
  return { user: mapUserFromDb(data), error: null };
}

export async function updateStudentDataInCloud(userId, studentData) {
  if (!isUserCloudAvailable()) return { error: 'not_configured' };

  const { error } = await supabase
    .from('users')
    .update({ student_data: studentData })
    .eq('id', userId);

  return { error };
}

export async function updateResearchStateInCloud(userId, researchState) {
  if (!isUserCloudAvailable()) return { error: 'not_configured' };

  const { error } = await supabase
    .from('users')
    .update({ research_state: researchState })
    .eq('id', userId);

  return { error };
}
