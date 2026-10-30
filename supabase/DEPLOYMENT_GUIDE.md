# CampusFlow V4 — Supabase Deployment & Runbook Guide
**Problem Statement:** HACK-P410 (Campus Recruitment Portal)  
**Target Environment:** Supabase Cloud (PostgreSQL 15+)  
**Frontend Architecture:** React 18, TypeScript, Tailwind CSS, Ashby/Linear Workstation Design  
**Backend Architecture:** Supabase Auth, PostgreSQL 15+, Row Level Security (RLS), Storage & RPCs  

---

## 1. Executive Summary

CampusFlow V4 features a production-grade PostgreSQL database schema designed specifically to meet the strict security, isolation, and auditability requirements of collegiate campus placement management.

This guide provides step-by-step instructions for executing the finalized, idempotent deployment script:
```
supabase/CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql
```
or executing the sequenced modular migrations located in `supabase/migrations/`.

---

## 2. Prerequisites & Environment Configuration

### Target Supabase Project:
- **Project URL:** `https://apqkpvjelffpbjdkgtsz.supabase.co`
- **Publishable API Key (Client):** `sb_publishable_jE9tLcQOyxoqot3KdzF0iw_yZA5hiMw`
- **Secret Administrative Key (Server/Test Suite only):** Securely stored in `.env` as `SUPABASE_SECRET_KEY`

> [!CAUTION]
> Never expose administrative secret keys in client-side bundles or commit them to public Git repositories. The secret key is stored only in the root `.env` (which is excluded from Git via `.gitignore`) for running verification tests and backend administrative scripts.

---

## 3. Step-by-Step Deployment Instructions

### Method A: Supabase Web Dashboard SQL Editor (Recommended)

1. **Log in to Supabase:**
   - Navigate to [https://supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
   - Select your project: `apqkpvjelffpbjdkgtsz`.

2. **Open the SQL Editor:**
   - In the left sidebar navigation, click on the **SQL Editor** icon (`>_`).
   - Click **+ New Query** to open a blank query tab.

3. **Load the Master Deployment Script:**
   - Open [`supabase/CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql`](file:///c:/Users/ROHIT/Downloads/campus%20recruitement/supabase/CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql) in your editor.
   - Copy the entire contents of the file.
   - Paste the contents into the Supabase SQL Editor query window.

4. **Execute the Script:**
   - Click the green **Run** button (or press `Ctrl + Enter` / `Cmd + Enter`).
   - The query execution will take approximately 2–5 seconds.

5. **Verify the Deployment Output:**
   - At the bottom of the editor, inspect the Results table. You will see the verification row:
     ```
     status: "Deployment verification complete."
     companies_count: 6
     drives_count: 3
     jobs_count: 7
     students_count: 20
     applications_count: 4
     interviews_count: 2
     ```
   - If this result table appears, your entire database schema, security policies, triggers, RPC functions, demo accounts, and synthetic university batch have been provisioned without errors.

6. **(Optional) Auth GoTrue Provisioning Verification:**
   - If you wish to guarantee GoTrue identity records through the official Supabase Admin API:
     ```bash
     node scripts/provision_demo_users.js
     ```
   - This script creates or synchronizes the 3 demo users directly via GoTrue's admin endpoint.

---

### Method B: Supabase CLI Migrations

If you prefer deploying via the Supabase command-line tool, the schema is organized into four sequential migrations in [`supabase/migrations/`](file:///c:/Users/ROHIT/Downloads/campus%20recruitement/supabase/migrations/):

1. `20261030000001_initial_schema.sql`: Extensions, enums, 14 tables, constraints, and indexes.
2. `20261030000002_row_level_security.sql`: Security helper functions, table RLS policies, storage bucket & storage RLS policies.
3. `20261030000003_functions_and_rpc.sql`: Anti-escalation triggers, academic record locks, and atomic business RPCs.
4. `20261030000004_seed_demo_data.sql`: Synthetic student directory, pre-configured demo auth accounts, jobs, and applications.

To push all migrations to your linked Supabase project:
```bash
supabase link --project-ref apqkpvjelffpbjdkgtsz
supabase db push
```

---

## 4. Deployed Database Architecture

The deployment provisions 14 relational tables in the `public` schema with 100% explicit Row Level Security:

| Table | Purpose | RLS Access Summary |
|---|---|---|
| `public.profiles` | Core user identity & roles | Public read for names; update self only; role locked |
| `public.student_profiles` | Verified academic & contact details | Public student read; self update (except CGPA/branch/backlogs); admin full |
| `public.student_skills` | Student technical skills | Public read; self edit |
| `public.student_projects` | Student portfolio projects | Public read; self edit |
| `public.companies` | Empaneled hiring organizations | Public read; empaneled recruiters & admins manage |
| `public.recruiter_company_memberships` | Association between recruiters & companies | Admin manages; recruiters view their memberships |
| `public.recruitment_drives` | Institutional recruitment seasons | Students & recruiters view active; admins manage |
| `public.job_postings` | Specific job openings | Students view published; recruiters edit company jobs |
| `public.job_eligibility_rules` | Strict CGPA, branch, backlog cutoffs | Students view for self-check; recruiters edit for their jobs |
| `public.applications` | Job applications submitted by students | Student views own; recruiters view company apps; admins view all |
| `public.application_status_history` | Immutable audit trail of status changes | Same read boundaries as applications; append-only via RPC |
| `public.interviews` | Scheduled interview rounds | Student candidate & hiring recruiter read/write; admin full |
| `public.notifications` | In-app alerts and notifications | User views and marks own notifications as read |
| `public.resume_files` | Metadata for uploaded PDF resumes | Student views own; hiring recruiter views for applied candidates |

---

## 5. Pre-Configured Demo Accounts & Personas

The script automatically provisions 3 authenticated demo accounts with encrypted credentials (`CampusFlow2026!`):

| Role Persona | Email Address | Password | Profile Name / Affiliation |
|---|---|---|---|
| **Student** | `aarav.sharma@campus.edu` | `CampusFlow2026!` | Aarav Sharma (B.Tech CSE, CGPA 8.85, 0 Backlogs) |
| **Recruiter** | `priya.nair@novatech.io` | `CampusFlow2026!` | Priya Nair (Lead Recruiter, NovaTech Systems) |
| **Placement Admin** | `placements@campus.edu` | `CampusFlow2026!` | Dr. Rajesh Rao (Placement Officer / Dean) |

### Dual Role Architecture:
1. **Interactive Demo Switcher:** The client interface provides an instant persona toggle in the top-right navigation for friction-free jury evaluation and presentation testing without repeated password logins.
2. **True Supabase Auth:** You can also sign in directly using the email and password above via standard Supabase Auth session flows (`supabase.auth.signInWithPassword()`).

---

## 6. Business Logic RPC Functions

Six server-side stored procedures encapsulate critical business operations inside atomic transactions:

### 1. `evaluate_job_eligibility(p_job_id uuid, p_student_id uuid)`
- Evaluates student CGPA, allowed branches, graduation year, and active backlog limits against job requirements.
- Returns JSON with `is_eligible` (boolean), `score` (0–100 match percentage), and explainable breakdown reasons (e.g. `"CGPA 7.10 is below required 8.00"`).

### 2. `submit_application(p_job_id uuid, p_student_id uuid, p_resume_id uuid, p_cover_letter text)`
- Enforces deadline validity and server-side eligibility check before allowing submission.
- Atomically creates `applications` row, records the initial status in `application_status_history`, and creates an in-app notification.
- Guaranteed unique constraint on `(student_id, job_id)` prevents duplicate applications.

### 3. `update_application_status(p_application_id uuid, p_new_status application_status_type, p_feedback text, p_round_name text)`
- Strict state machine validator. Enforces valid forward transitions:
  - `submitted` → `shortlisted` or `rejected`
  - `shortlisted` → `interview` or `rejected`
  - `interview` → `selected` or `rejected`
- Blocks illegal skipping (e.g. `submitted` → `selected`) and prevents tampering with terminal states (`selected`, `rejected`, `withdrawn`).

### 4. `withdraw_application(p_application_id uuid, p_reason text)`
- Allows a student to cleanly withdraw an application in progress, recording audit reasons.

### 5. `schedule_interview(p_application_id uuid, p_round_name text, p_scheduled_at timestamptz, p_format text, p_location_or_url text, p_instructions text)`
- Creates an interview event linked to the candidate's application.
- Automatically transitions application status to `interview` and dispatches in-app candidate notification.

### 6. `get_placement_analytics(p_drive_id uuid)`
- Computes comprehensive institutional metrics with zero double-counting: total registered students, placed count, in-process count, unplaced count, official placement percentage, highest package, and average package.

---

## 7. Storage Bucket Configuration (Private Resumes)

The deployment script registers a private storage bucket named `resumes`:
- **File size limit:** 5 MB (5,242,880 bytes).
- **Allowed MIME types:** `application/pdf`.
- **Public:** `false` (Private bucket).
- **RLS Access Rules:**
  - **Upload:** Authenticated users can upload to their own folder path (`resumes/<user_id>/*`).
  - **Download/Read:** The resume owner, placement administrators, or empaneled recruiters who have active applications from the student can access the resume. Unrelated recruiters or public users receive 403 Forbidden.

---

## 8. Verifying Frontend Connection

1. Ensure `.env` and `client/.env` contain:
   ```env
   VITE_SUPABASE_URL=https://apqkpvjelffpbjdkgtsz.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_jE9tLcQOyxoqot3KdzF0iw_yZA5hiMw
   ```
2. Start or view the frontend:
   ```bash
   cd client
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.
3. Observe live data synchronization across Student, Recruiter, and Admin portals!
