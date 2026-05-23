# Firebase + Supabase setup

EduSuite uses **Firebase** for Google sign-in and **Supabase** for profile data, research progress, and document storage.

## 1. Firebase

1. Go to [Firebase Console](https://console.firebase.google.com) → **Add project**.
2. **Authentication** → **Sign-in method** → enable **Google**.
3. **Project settings** → **Your apps** → add a **Web** app.
4. Copy config into `.env` (copy from `.env.example`):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

5. **Authentication** → **Settings** → **Authorized domains** → add `localhost` for local dev.

## 2. Supabase

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. **Settings** → **API** → copy **Project URL** and **anon public** key into `.env`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

3. **SQL Editor** → run the migration file:

`supabase/migrations/001_users_and_storage.sql`

This creates the `users` table, row-level security, and the private `documents` storage bucket.

## 3. Link Firebase to Supabase (required for cloud sync)

1. Supabase Dashboard → **Authentication** → **Providers** → **Firebase**.
2. Enable Firebase and paste your Firebase **Project ID** (and service account if prompted).
3. Follow [Supabase Firebase auth docs](https://supabase.com/docs/guides/auth/third-party/firebase-auth) if you need JWT secret details.

Without this step, the app still works but saves data to **local backup** only.

## 4. Run the app

```bash
cp .env.example .env
# fill in your keys
npm install
npm run dev
```

Sign in with Google. On first login, a row is created in `public.users`. Profile edits and Research Coach auto-save sync to Supabase when cloud mode is active.

## Architecture

| Layer | Service | Purpose |
|-------|---------|---------|
| Auth | Firebase Auth | Google sign-in, session tokens |
| Data | Supabase Postgres | `users` table: `student_data`, `research_state` JSON |
| Files | Supabase Storage | Private `documents` bucket per user folder |
| Bridge | `signInWithIdToken` | Links Firebase JWT → Supabase session for RLS |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Sidebar shows **Local backup mode** | Enable Firebase provider in Supabase; check `.env` keys |
| Upload fails | Run storage migration; ensure user is signed in (cloud session) |
| `permission denied` on `users` | RLS requires linked auth — complete step 3 |
| Demo mode without `.env` | App uses `localStorage` mock user (no Firebase) |
