# Roadmap — CampusFlow (HACK-P410)

## Phase Structure

```
PHASE 1: Repository analysis, design foundation, app shell & navigation [COMPLETED]
PHASE 2: Premium student portal frontend (Dashboard, Explore, Details, Applications, Interviews, Profile) [COMPLETED]
PHASE 3: Recruiter and placement administrator frontend [COMPLETED]
PHASE 4: Complete frontend interactions, validation & visual QA [COMPLETED]
PHASE 5: Supabase Full-Stack Integration (PostgreSQL, Auth, RLS, Storage, RPC, TypeScript Client) [IN PROGRESS]
PHASE 6: Verification, Multi-Role Journey, Testing & Final Polish [UP NEXT]
```

---

### Phase 1 Breakdown: Design Foundation & App Shell [COMPLETED]
- [x] Project structure initialization (Vite, React 18, TypeScript, Tailwind CSS, Lucide React).
- [x] Design tokens configuration (Framed-Sheet `#F4F5F7`, `#0F766E`, `#090E17`, `#F8FAFC`).
- [x] Atomic UI primitives: Button, Card, Badge, Input, Select, Dialog/Modal, Tabs, Toast, Avatar, Skeleton.
- [x] App Shell layout with Framed-Sheet workstation architecture and neutral sidebar.
- [x] Routing architecture for all student, recruiter, and admin routes.
- [x] Visual verification across desktop (1440x900) and mobile (375x812).

### Phase 2 Breakdown: Premium Student Experience [COMPLETED]
- [x] Student Overview Dashboard with Active Next Action Command Hero.
- [x] Explore Opportunities Board with high-density tabular compensation and criteria manifests.
- [x] Job Details & Explainable Eligibility Breakdown.
- [x] My Applications Tracker with interactive step pipeline and withdrawal flow.
- [x] Interview Schedule with chronological events and Google Meet launcher.
- [x] Student Profile & Resume Manager.

### Phase 3 Breakdown: Recruiter & Admin Portals [COMPLETED]
- [x] Recruiter Dashboard & Active Posting Ribbon.
- [x] Recruiter Ashby Split-Pane ATS Inspector (60% table queue, 40% docked evaluation dossier).
- [x] Placement Administrator Dashboard & Interactive Analytics Charts.
- [x] Student Directory and Company Empanelment views.

### Phase 4 Breakdown: Frontend Interactions & Visual QA [COMPLETED]
- [x] Direction 1 Framed-Sheet & Ashby ATS overhaul verified across 14 screenshots.
- [x] Zero kickers / eyebrows, zero `border-l-4`, WCAG AA contrast compliance.
- [x] Mobile responsiveness with zero horizontal overflow on 375px screens.

---

### Phase 5 Breakdown: Supabase Full-Stack Integration [CURRENT]
- [x] **Checkpoint 1 — Supabase Foundation:**
  - [x] Inspect existing repository, types, and state engine.
  - [x] Create Git checkpoint tag (`checkpoint-pre-supabase-integration`).
  - [x] Configure Supabase project structure (`supabase/config.toml`).
  - [x] Create SQL migrations with full schema, constraints, indexes (`001_initial_schema.sql`).
  - [x] Configure generated TypeScript Database types (`database.types.ts`).
  - [x] Document environment variables (`.env.example` in root and client).
  - [x] Install `@supabase/supabase-js`.
- [x] **Checkpoint 2 — Auth and Security:**
  - [x] Profiles table linked to `auth.users(id)` with auto-provisioning trigger (`handle_new_user()`).
  - [x] Row Level Security (RLS) policies on every table (`002_row_level_security.sql`).
  - [x] Non-recursive security-definer helper functions (`current_user_role`, `is_recruiter_for_company`, etc.).
  - [x] Dedicated demo users provisioning for Student, Recruiter, and Admin.
- [x] **Checkpoint 3 — Core Recruitment Data & Resume Storage:**
  - [x] Student profiles, skills, projects, and resume files schema.
  - [x] Private Supabase Storage bucket `resumes` with secure RLS policies (5 MB limit, PDF only).
  - [x] Companies, recruiter company memberships, and recruitment drives.
  - [x] Job postings with structured eligibility rules.
  - [x] Typed Supabase data-access layer (`campusflowService.ts`).
- [x] **Checkpoint 4 — Application Workflow & Atomic Submission:**
  - [x] Server-side trusted eligibility evaluation RPC (`evaluate_job_eligibility`).
  - [x] Atomic transactional application submission RPC (`submit_application`) with deadline, eligibility, duplicate check, and audit trail.
  - [x] Recruiter candidate evaluation with state machine enforcement (`update_application_status`).
  - [x] Candidate withdrawal RPC (`withdraw_application`).
- [x] **Checkpoint 5 — Interviews & Notifications:**
  - [x] Interview scheduling RPC (`schedule_interview`) stored in UTC with timezone formatting.
  - [x] Real in-app notifications schema and notification dispatch triggers.
- [x] **Checkpoint 6 — Database-Derived Analytics:**
  - [x] Placement Administrator Analytics RPC (`get_placement_analytics`) with zero double counting.
  - [x] Student and Recruiter performance queries.
- [ ] **Checkpoint 7 — Verification & Testing:**
  - [ ] Client build verification (`tsc -b && vite build`).
  - [ ] Role-based access testing & end-to-end recruitment journey.
  - [ ] Mobile responsive verification.
  - [ ] Final documentation.
