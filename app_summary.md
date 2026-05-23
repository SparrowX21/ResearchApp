# EduSuite.ai: System Capabilities & Architecture Summary

EduSuite.ai is an enterprise-grade, patent-worthy, unified college readiness portfolio and academic writing assistant tailored for high school students. The platform leverages Socratic AI feedback methodologies, heuristic academic profiling, and cloud integrations to provide high schoolers with a state-of-the-art college admissions edge.

---

## 1. Core Architecture & Tech Stack

- **Frontend Core**: React 18 with Vite (ES Modules) for sub-millisecond hot reloading and production bundling.
- **Styling Paradigm**: Custom Vanilla CSS Tokens providing a sleek, modern, unified **Matte-Black / Indigo / HSL-harmonized** dark mode layout. Fully responsive across desktop devices.
- **State Management**: React Context Auth Provider (`AuthContext.jsx`) synchronizing student data across the entire system.
- **Micro-Animations**: Framer Motion for premium card entries, tab transitions, and upload loaders.
- **Backend Services**:
  - **Firebase Authentication**: Integrated Google OAuth 2.0 Sign-In Gateway with automatic login session handling.
  - **Supabase PostgreSQL Database**: Cloud database syncing personal student details, courses, extracurriculars, volunteer logs, custom milestones, and shortlisted colleges in real-time.
  - **Supabase Cloud Storage (Document Vault)**: Secure document storage bucket allowing students to drag, upload, download, and delete certificates, drafts, and transcripts directly from the cloud.
  - **Offline/No-Key Fallback**: Features a built-in simulation layer. If API keys are missing or invalid, the app runs gracefully with simulated mock uploads, offline states, and local state sync, ensuring zero startup crashes!

---

## 2. Integrated Features & Modules (Exactly 11 Screens)

EduSuite.ai fuses the Student Portfolio Tracker and the interactive Research Coach into a single, cohesive, 11-screen workspace accessed directly upon secure authentication (with NO transitional launcher page):

### 1. Dashboard (`dashboard`)
- **AI Profile Scoring System**: Evaluates the student's entire portfolio (skills, courses, volunteering, achievements) using a proprietary admissions readiness heuristic to assign an academic score (0-100) and letter grade (A+ through D).
- **AI Recommendations & Insights**: Generates specific, personalized next-steps (e.g. "complete your research outline", "add 3 more technical skills") based on current academic index gaps.
- **Interactive Metric Panels**: Real-time counter panels showing strength percentage, skills tracked, trophies earned, and competition registrations.
- **Top Career Match Meters**: Displays top matches mapped to high-growth futuristic careers.

### 2. Socratic Research Coach (`research`)
- **7 Guided Writing Stages**: Telescope-to-Scope progression mapping Topic Discovery, Thesis Builder, Research Planning, Source Tracker, Outline Builder, Drafting, and Revision.
- **Dr. Morgan (Socratic Topic Mentor)**: Socratically questions students to help them narrow down vague interests into a sharp, debatable research question.
- **Professor Chen (Thesis Evaluator)**: Provides line-item feedback scoring thesis statement Clarity, Arguability, Specificity, and Sophistication (1-10) using a real-time Gemini LLM analyzer.
- **Dr. Rivera (Research Librarian)**: Generates customized research roadmaps specifying primary/secondary sources, search keywords, timelines, and pitfalls.
- **Dr. Kim (SIFT + CRAAP Fact-Checker)**: Automatically evaluates online source credentials, assigning credibility ratings and formatting bibliography citations.
- **Maya & Dr. Taylor (Drafting & Revision Experts)**: Performs line-level developmental edits using PEEL structures and compiles comprehensive weighted editing checklists.
- **Cloud State Syncing**: Debounces and auto-saves the entire 7-stage writing state directly to Supabase every 1.5 seconds. Includes an animated status bar ("Cloud Syncing", "Saved", or "Offline").

### 3. Skills & Courses (`skills`)
- **Proficiency Log**: Adds technical, research, humanities, or leadership skills with Beginner, Intermediate, Advanced, and Expert ratings.
- **Grade & Course Tracker**: Log high school courses (Honors, AP, IB, Regular) with letter grades.
- **Dynamic GPA Calculator**: Automatically calculates unweighted and weighted GPA, adding proper coursework weights (+1.0 for AP/IB, +0.5 for Honors) to dynamically feed into the AI Profile Score.

### 4. Projects & Portfolio (`projects`)
- **Grid Portfolio Card System**: Showcases student independent projects, research, or apps with descriptions, category tags, and statuses (In Progress vs Completed).
- **Research Coach Sync Link**: Single-click linking mechanism that automatically packages their active Research Coach draft and copies it directly into their portfolio list.

### 5. Elite Competitions Tracker (`competitions`)
- **High-Impact Database**: List of elite global science/humanities competitions (e.g. USACO, ISEF, MIT Think, Congressional App Challenge) with direct links, dates, and categories.
- **Registration Metrics**: Syncs registration clicks to the AI Profile completeness rating.

### 6. Activities Log (`extracurriculars`)
- **extracurricular list**: Logs sports, internships, clubs, and student government.
- **Time Commitment Calculator**: Calculates cumulative weekly commitments and annual hours.
- **Leadership Tracking**: Tracks and highlights executive positions (Founders, Presidents, Captains) to increase the student's Leadership profile index.

### 7. Universities List (`universities`)
- **College Shortlist Board**: Categorize colleges as Reach, Match, or Safety.
- **AI Admissions Probability Index**: Advanced custom algorithm calculating admission probability (5% - 98%) based on their current high school GPA, average target SAT/ACT requirements, and their real-time AI Profile Score.

### 8. Career Pathways (`career`)
- **Passions Assessment Questionnaire**: Interactive checklist mapping student academic interests (AI, Computational Biology, Tech Law, Quantitative Finance).
- **futuristic career cards**: Recommends high-growth careers showing salary levels, job growth rates, required college degrees, and concrete actions they can take right now.

### 9. Social Impact (`community`)
- **Volunteering Service Log**: Track volunteering dates, organizations, and service hours.
- **PVSA Milestones**: Tracks progress toward the elite President's Volunteer Service Award (Bronze, Silver, Gold) based on cumulative logged hours (100, 175, and 250 hours).

### 10. Admissions Timeline (`collegeGuide`)
- **Expert-curated Checklist**: Grade-by-grade milestones for Grades 9, 10, 11, and 12 college prep.
- **Admissions Readiness Boost**: Checking off timeline roadmaps updates their AI completeness score.

### 11. Profile & Vault (`profile`)
- **Student Profile Editor**: View and modify name, school, weighted GPA, target major, and bio.
- **Supabase Cloud Vault**: Secure cloud storage dashboard for uploading transcripts, essays, and certificates. Displays size details, upload times, custom icons (PDF, Word, zip), download buttons, and deletion triggers.
