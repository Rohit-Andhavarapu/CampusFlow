# CampusFlow — Production Release Checklist & Pre-Flight Verification Runbook

> **Audience:** DevOps Engineers, Release Managers, Hackathon Evaluators, Quality Assurance  
> **Status:** Release Verification Complete (100% Pass)  
> **Target Release:** CampusFlow v6.0 Production

---

## 1. Quick Verification Command Summary

Before executing a public deployment, run this validation suite locally or in CI:

```bash
# 1. Verify TypeScript types and production bundle compilation
npm run build --prefix client

# 2. Verify Database Schema & Synthetic Seed Data
node scripts/test_real_postgresql_execution.js

# 3. Verify Supabase Integration & RLS Policy Enforcement
node scripts/validate_database_deep.js

# 4. Verify Demo Persona & Real User Account Data Isolation
node scripts/verify_real_user_browser.mjs

# 5. Verify Role Authorization & Route Guard Redirection
node scripts/test_route_guard.mjs

# 6. Verify Groq AI Resume Intelligence & Matched Postings
node scripts/verify_v5_resume_fix.mjs
```

---

## 2. Release Acceptance Gates Matrix (A through J)

| Gate | Area | Acceptance Criterion | Evidence / Test Script | Status |
| :---: | :--- | :--- | :--- | :---: |
| **A** | **Public Landing Experience** | Editorial Prestige landing page renders flawlessly with smooth GSAP typography animations, live placement metrics ticker, and dark-mode aesthetic. | `scripts/verify_production_landing_qa.mjs` | **PASS** |
| **B** | **Workspace Isolation** | Real newly registered users see zero inherited applications, interviews, notifications, or resumes. Pre-seeded demo personas retain evaluation dataset. | `scripts/verify_real_user_browser.mjs` | **PASS** |
| **C** | **Route Authorization** | Non-admin users cannot access `/admin/*` or `/recruiter/*` via manual URL entry; automatically redirected to `/student/dashboard`. | `scripts/test_route_guard.mjs` | **PASS** |
| **D** | **Groq Resume Intelligence** | PDF parsing, skill extraction, and career path generation via `openai/gpt-oss-120b` functions end-to-end; dual suitability + cutoff badges match live jobs. | `scripts/verify_v5_resume_fix.mjs` | **PASS** |
| **E** | **Document Management** | Master resume upload, download via signed URLs, replacement, and deletion isolated exclusively in `Profile & Resume → Resume & Documents`. | `scripts/verify_v5_resume_fix.mjs` | **PASS** |
| **F** | **Recruiter Provisioning** | Placement Administrators can list, provision, resend invites, and revoke recruiter access with role-based validation. | `supabase/functions/manage-recruiter` | **PASS** |
| **G** | **PostgreSQL RLS & Storage** | All public tables have RLS enabled. Private `resumes` bucket restricts access to file owners and authorized recruiters/admins. | `scripts/validate_database_deep.js` | **PASS** |
| **H** | **Bundle Performance** | Vite production bundle split into dedicated vendor chunks (`vendor-react`, `vendor-charts`, `vendor-supabase`, `vendor-icons`); all under 500 kB. | `npm run build --prefix client` | **PASS** |
| **I** | **SPA Deep-Link Routing** | `vercel.json` and client routing fallbacks prevent 404 on hard browser refresh across all nested routes. | `vercel.json`, `client/vercel.json` | **PASS** |
| **J** | **Secret Hygiene** | Zero private keys or service role tokens prefixed with `VITE_` or leaked into client bundles; all private secrets secured via cloud vault. | Codebase Audit & `.gitignore` | **PASS** |

---

## 3. Step-by-Step Production Setup Checklist

### Step 1: Supabase PostgreSQL Schema & Security
- [x] Run `supabase/CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql` in Supabase SQL Editor.
- [x] Run `supabase/migrations/20261031_student_watchlist.sql` for Opportunity Watchlist.
- [x] Run `supabase/migrations/20261031000001_resume_intelligence.sql` for Resume Intelligence & Recruiter Invitations.
- [x] Confirm tables have RLS active:
  - `profiles`, `student_profiles`, `student_skills`, `student_projects`
  - `companies`, `job_postings`, `job_eligibility_rules`
  - `applications`, `application_status_history`, `interviews`
  - `notifications`, `student_watchlists`, `resume_files`, `resume_analyses`
  - `recruiter_company_memberships`, `recruiter_invitations`

### Step 2: Storage Bucket Configuration
- [x] Bucket Name: `resumes`
- [x] Public: `OFF` (Private bucket)
- [x] Allowed MIME Types: `application/pdf`
- [x] Max File Size: `5 MB`
- [x] Storage RLS policies in place for `SELECT`, `INSERT`, `UPDATE`, `DELETE`.

### Step 3: Supabase Authentication & Google OAuth
- [x] Enable Email/Password authentication.
- [x] (Optional) Configure Google OAuth in Supabase:
  - In Google Cloud Console → APIs & Services → Credentials:
    - Add Authorized Javascript Origin: `https://<your-project-id>.supabase.co` and `https://<your-domain>`
    - Add Authorized Redirect URI: `https://<your-project-id>.supabase.co/auth/v1/callback`
  - In Supabase Dashboard → Authentication → Providers → Google:
    - Paste Google Client ID and Google Client Secret.
    - Save changes.
  - In Supabase Dashboard → Authentication → URL Configuration:
    - Site URL: `https://<your-domain>`
    - Additional Redirect URLs: `https://<your-domain>/auth/callback`, `http://localhost:5173/auth/callback`

### Step 4: Demo Evaluation Accounts
- [x] Run identity provisioning script:
  ```bash
  node scripts/provision_demo_users.js
  ```
- [x] Verify the three pre-seeded accounts:
  1. Student: `aarav.sharma@campus.edu` / `CampusFlow2026!`
  2. Recruiter: `priya.nair@novatech.io` / `CampusFlow2026!`
  3. Admin: `placements@campus.edu` / `CampusFlow2026!`
- [x] Confirm `/demo` quick-login sandbox provides 1-click access to all three roles for evaluation.

### Step 5: Groq Cloud LPU™ Resume Intelligence
- [x] Acquire Groq API Key from [console.groq.com](https://console.groq.com).
- [x] Set Groq Cloud Secret in Supabase CLI or Backend daemon:
  ```bash
  supabase secrets set GROQ_API_KEY="gsk_..."
  supabase secrets set GROQ_MODEL="openai/gpt-oss-120b"
  ```
- [x] Deploy Edge Functions:
  ```bash
  supabase functions deploy analyze-resume
  supabase functions deploy manage-recruiter
  ```

### Step 6: Frontend Hosting (Vercel)
- [x] Import repository to Vercel.
- [x] Framework Preset: `Vite`.
- [x] Root Directory: `client`.
- [x] Build Command: `npm run build`.
- [x] Output Directory: `dist`.
- [x] Environment Variables:
  - `VITE_SUPABASE_URL`: `https://<your-project-id>.supabase.co`
  - `VITE_SUPABASE_ANON_KEY`: `<your-anon-key>`
  - `VITE_API_URL`: `https://<your-project-id>.supabase.co/functions/v1` (optional)
- [x] Confirm `vercel.json` rewrite rule is active:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

---

## 4. Troubleshooting & Recovery Matrix

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| Hard browser refresh on `/student/watchlist` returns 404 on host | Hosting server lacks SPA deep-link rewrite | Ensure `vercel.json` is deployed in root and client directories with `"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]`. |
| Resume upload succeeds, but AI extraction gives "Authentication required" | Expired or missing Bearer token in fetch header | Verify `supabase.auth.getSession()` returns valid access token. Ensure user has confirmed email or auto-confirm is enabled in Supabase Auth. |
| Student sees 0 matched jobs in Resume Intelligence | Supabase `job_postings` status filter mismatch | Ensure active postings have status `'active'` (CampusFlow uses `status = 'active'`). Check `job_eligibility_rules` for academic cutoffs. |
| Recruiter provisioning returns 403 Forbidden | Authenticated user lacks `placement_admin` role | Only users with `role === 'placement_admin'` or `role === 'admin'` in `profiles` can invite recruiters. Use `placements@campus.edu` for admin tasks. |
| Vite build shows `(!) Some chunks are larger than 500 kB` | Missing Rollup manual chunking configuration | Confirm `client/vite.config.ts` includes `output.manualChunks` splitting React, Recharts, Supabase, and Lucide icons. |
