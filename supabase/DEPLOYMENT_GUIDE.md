# CampusFlow V4 — Supabase Deployment & Runbook Guide
**Problem Statement:** HACK-P410 (Campus Recruitment Management Portal)  
**Target Environment:** Supabase Cloud (PostgreSQL 15+)  
**Frontend Architecture:** React 18, TypeScript, Tailwind CSS, Ashby/Linear Workstation Design  
**Backend Architecture:** Supabase Auth (GoTrue v2), PostgreSQL 15+, Row Level Security (RLS), Storage & Atomic RPCs  

---

## 1. Architecture & Safe Deployment Overview

CampusFlow V4 strictly separates **Database Schema Initialization** from **Authenticated Identity Provisioning**:

1. **Phase 1: Master SQL Initialization (SQL Editor)**  
   The master SQL script initializes 100% of the relational schema, tables, triggers, helper functions, restricted RPCs, storage bucket, and enterprise recruitment ecosystem (companies, drives, jobs, rules, and 19 non-login synthetic directory students). It contains **zero direct modifications to `auth.users` or `auth.identities`** and executes cleanly on any pristine database.

2. **Phase 2: Supported Demo Identity Provisioning (Admin API Script)**  
   Demo users are provisioned through the official Supabase GoTrue Admin API via `scripts/provision_demo_users.js`. This captures real, cryptographically signed user IDs, updates profile roles with `service_role` authority, links recruiter company memberships, and attaches Aarav Sharma's verified student records and application history.

3. **Phase 3: Frontend Synchronization**  
   The application shell features an interactive three-role demo switcher (`Student`, `Recruiter`, `Placement Admin`). When connected to Supabase, switching roles in the UI automatically synchronizes the underlying Supabase Auth session, ensuring that every database query and RPC call is executed with the proper authenticated JWT identity.

---

## 2. Environment Configuration & Secret Key Rotation

### Project Endpoints & Public Keys:
- **Project URL:** `https://apqkpvjelffpbjdkgtsz.supabase.co`
- **Publishable API Key (Frontend):** `sb_publishable_jE9tLcQOyxoqot3KdzF0iw_yZA5hiMw` (in `client/.env` and `.env`)

### Secret Key Rotation Requirement:
> [!IMPORTANT]
> If you rotate your Supabase service secret key in the Supabase Dashboard (**Project Settings** → **API** → **service_role secret**):
> 1. Copy the newly generated secret key.
> 2. Paste it into your root `.env` file only:
>    ```env
>    SUPABASE_SECRET_KEY=<your_newly_rotated_secret_key>
>    ```
> 3. **Never** paste the secret key into `client/.env` or commit `.env` to Git. (The root `.env` is already protected by `.gitignore`).

---

## 3. Step-by-Step Deployment Procedure

### Step 1: Execute Master Database Initialization (Phase 1)

1. Open your browser and navigate to the [Supabase SQL Editor](https://supabase.com/dashboard/project/apqkpvjelffpbjdkgtsz/sql/new).
2. Open [`supabase/CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql`](file:///c:/Users/ROHIT/Downloads/campus%20recruitement/supabase/CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql) in your code editor.
3. Copy the entire file contents (1,722 lines).
4. Paste into the Supabase SQL Editor query window.
5. Click **Run** (`Ctrl + Enter`).
6. Verify the execution output table:
   ```
   status: "Deployment verification complete."
   companies_count: 6
   drives_count: 3
   jobs_count: 7
   students_count: 19
   applications_count: 15
   ```
   *(Note: The 19 students are non-login synthetic directory entries with `user_id = NULL`).*

---

### Step 2: Provision Authenticated Demo Accounts (Phase 2)

Once Phase 1 finishes successfully, provision the 3 authenticated accounts via the official GoTrue Admin API:

```bash
node scripts/provision_demo_users.js
```

**What this script performs automatically:**
- Connects using `SUPABASE_SECRET_KEY` (service role).
- Creates/confirms the 3 accounts in GoTrue:
  - `aarav.sharma@campus.edu` (Password: `CampusFlow2026!`)
  - `priya.nair@novatech.io` (Password: `CampusFlow2026!`)
  - `placements@campus.edu` (Password: `CampusFlow2026!`)
- Captures the real generated user IDs.
- Updates `profiles` roles (`student`, `recruiter`, `placement_admin`).
- Links Priya Nair to NovaTech Systems in `recruiter_company_memberships`.
- Links Aarav Sharma in `student_profiles` (Roll: `N25H02A0325`, CGPA: `8.85`), seeds his 8 core skills, 2 projects, and application/interview records.

---

### Step 3: Start and Verify Frontend Application (Phase 3)

1. Ensure the dev server is active:
   ```bash
   cd client
   npm run dev
   ```
2. Open `http://localhost:5173/` in your browser.
3. Use the top-right persona switcher to switch between **Student (Aarav Sharma)**, **Recruiter (Priya Nair)**, and **Placement Admin (Dr. Rajesh Rao)**.
4. Each role automatically authenticates with its corresponding Supabase JWT session, providing real database-backed recruitment workflows.

---

## 4. Test Suite Verification & Audit Boundaries

| Test Suite / Simulation | Mode | Scope | Live Database Status |
|---|---|---|---|
| `tests/supabase_integration_test.js` (68 Tests) | **Static / AST Analysis** | SQL syntax, table coverage, RLS declarations, non-recursive helpers, in-memory state transitions | Validated locally against files; **Did NOT execute on remote DB** |
| `tests/e2e_recruitment_lifecycle.js` (11 Steps) | **In-Memory Simulation** | 11-step recruitment journey, cutoff enforcement, atomic submissions, Ashby split-pane review | Validated locally in Node.js; **Did NOT execute on remote DB** |
| Supabase Remote Health Check | **Read-Only HTTP** | Reachability of GoTrue v2.197.0 and PostgREST v14.18 | Confirmed online & responsive (200 OK) |
| Client Production Build (`tsc -b && vite build`) | **Compilation** | TypeScript type safety, bundle optimization | **Passed (0 errors)** |

---

## 5. Security & Permission Architecture

1. **Anti-Escalation Profile Trigger:**
   Trigger `protect_profile_role` restricts role modifications exclusively to trusted database roles (`postgres`, `supabase_admin`), backend `service_role` sessions, or authenticated placement administrators (`public.is_admin()`).
2. **Academic Standing Immutability:**
   Trigger `protect_student_academic_records` prohibits students from modifying verified academic metrics (CGPA, roll number, branch, graduation year, and backlogs).
3. **RPC Execution Restrictions:**
   `REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM public, anon;` ensures that anonymous public callers cannot invoke sensitive stored procedures. Only `authenticated` users and `service_role` have execution rights.
4. **Private Resume Storage:**
   The `resumes` bucket enforces PDF-only MIME types and path-based ownership. Recruiters can only download resumes belonging to students who have applied to their company's job postings.
