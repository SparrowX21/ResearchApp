# EduSuite.ai

**The all-in-one college and career planning platform for high school students.**

EduSuite combines an AI research coach, admissions tooling, and a living student profile in one cohesive web app. Students can track skills and projects, discover competitions, build a university shortlist with admission estimates, and work through a full research-paper workflow—with optional cloud sync across devices.

---

## Features

### Student passport (11 modules)

| Module | Description |
|--------|-------------|
| **Dashboard** | AI profile score with radar chart, breakdown bars, career matches, and quick actions |
| **Research Coach** | 7-stage guided research paper workflow with Gemini-powered mentoring |
| **Skills & Courses** | Track technical and academic skills plus coursework |
| **Projects Portfolio** | Log independent projects with status and descriptions |
| **Competitions** | Browse 60+ curated STEM, humanities, arts, and business competitions |
| **Activities Log** | Extracurriculars with hours-per-week tracking |
| **Universities** | 150+ preset schools; build reach/match/safety lists with AI admission estimates |
| **Career Pathways** | Interest-based career exploration and match scores |
| **Community Service** | Volunteer hour logging |
| **Admissions Guide** | College application reference content |
| **Profile & Vault** | Academic profile editor and encrypted document uploads |

### Research Coach stages

1. Topic Discovery  
2. Thesis Builder (strength meter)  
3. Research Planning  
4. Source Tracker (credibility evaluation)  
5. Outline Builder  
6. Drafting Coach  
7. Revision Checklist  

Progress auto-saves to the cloud (or local backup when offline).

### AI profile scoring

Proprietary heuristic scores profile completeness across skills, projects, extracurriculars, competitions, achievements, and profile data—surfaced on the dashboard with insights and next steps.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 5 |
| Styling | Custom CSS design system (dark / light themes) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Auth | Firebase Authentication (Google sign-in) |
| Database | Supabase (PostgreSQL + Row Level Security) |
| File storage | Supabase Storage (private document vault) |
| AI | Google Gemini (`@google/generative-ai`) |

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- (Optional) [Firebase](https://console.firebase.google.com) project for Google sign-in  
- (Optional) [Supabase](https://supabase.com) project for cloud sync  
- (Optional) [Google AI Studio](https://aistudio.google.com/) API key for Research Coach  

### Install and run

```bash
git clone https://github.com/SparrowX21/ResearchApp.git
cd ResearchApp
npm install
cp .env.example .env
# Edit .env with your keys (see below)
npm run dev
```

Open **http://localhost:3000**

### Environment variables

Copy `.env.example` to `.env` and fill in your keys locally:

> **Security:** Only `.env.example` (placeholders) belongs in git. Your real `.env` file is gitignored—never commit API keys, Firebase config, or Supabase credentials to GitHub.

```env
# Firebase (Google sign-in)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Supabase (profile sync + document vault)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Gemini (Research Coach AI)
VITE_GEMINI_API_KEY=
```

**Without `.env`:** the app runs in **demo mode** with a local mock user and `localStorage` persistence.

**With Firebase only:** Google sign-in works; data falls back to local backup per account.

**With Firebase + Supabase:** full cloud sync, RLS-protected profiles, and document vault.

Detailed cloud setup (SQL migration, Firebase ↔ Supabase linking): **[docs/CLOUD_SETUP.md](docs/CLOUD_SETUP.md)**

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 3000) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |

---

## Project structure

```
src/
├── components/       # Shared UI (HomePage, Research workspace, charts)
├── config/           # Firebase, Supabase, app feature flags
├── contexts/         # AuthProvider (Firebase + cloud sync)
├── data/             # Competitions and universities datasets
├── hooks/            # Theme toggle
├── lib/              # DB ↔ app user mapping
├── passport/         # Main app shell and 11 screens
├── services/         # Cloud auth, user sync, document vault
└── utils/            # AI scoring, Gemini service

supabase/migrations/  # Postgres schema + storage policies
docs/                 # Setup guides
```

---

## Cloud architecture

```
┌─────────────┐     Google Sign-In      ┌──────────────┐
│   Browser   │ ───────────────────────► │   Firebase   │
│  (React)    │                          │     Auth     │
└──────┬──────┘                          └──────┬───────┘
       │                                        │ ID token
       │ signInWithIdToken                      ▼
       └────────────────────────────────► ┌──────────────┐
                                          │   Supabase   │
                                          │  Postgres +  │
                                          │   Storage    │
                                          └──────────────┘
```

- **`users` table** — `student_data` and `research_state` JSON columns  
- **`documents` bucket** — per-user private folders with signed download URLs  

---

## Design

- Dark-first UI with optional light theme (sidebar toggle)  
- Inter + JetBrains Mono typography  
- Accessible form controls and dropdown contrast in both themes  
- Responsive grids for dashboard, competitions, and university shortlist  

---

## License

MIT
