import { supabase } from '../config/supabase';
import { DOCUMENTS_BUCKET, isSupabaseConfigured } from '../config/appConfig';

export function isVaultAvailable() {
  return Boolean(supabase && isSupabaseConfigured);
}

/**
 * Upload a file to the private documents bucket under {userId}/...
 * Returns metadata for storing in studentData.documents
 */
export async function uploadDocument(userId, file) {
  if (!isVaultAvailable()) {
    throw new Error('vault_unavailable');
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${userId}/${Date.now()}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  const { data: signed, error: signError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days

  if (signError) throw signError;

  return {
    name: file.name,
    size: `${(file.size / 1024).toFixed(1)} KB`,
    uploadedAt: new Date().toLocaleDateString(),
    url: signed.signedUrl,
    path,
  };
}

export async function deleteDocument(path) {
  if (!isVaultAvailable() || !path || path.startsWith('mock-')) {
    return;
  }

  const { error } = await supabase.storage.from(DOCUMENTS_BUCKET).remove([path]);
  if (error) throw error;
}

/** Refresh signed URL when loading vault (URLs expire) */
export async function refreshDocumentUrl(path) {
  if (!isVaultAvailable() || !path || path.startsWith('mock-')) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 7);

  if (error) return null;
  return data.signedUrl;
}
