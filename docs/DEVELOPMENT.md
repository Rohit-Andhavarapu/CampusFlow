# CampusFlow — Local Development & Testing Guide

> **Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Node.js 22 + PostgreSQL 15+ (Supabase)  
> **Package Architecture:** npm Workspaces (`client`, `server`)

---

## 1. Prerequisites

Before setting up CampusFlow locally, ensure you have the following installed:
- **Node.js:** v18.0.0 or higher (v20+ or v22+ recommended)
- **npm:** v9.0.0 or higher
- **Git:** v2.30+
- **Browser:** Modern Chromium-based browser (Chrome, Edge, Brave)

---

## 2. Quickstart Installation

```bash
# 1. Clone the repository
git clone https://github.com/Rohit-Andhavarapu/CampusFlow.git
cd CampusFlow

# 2. Install root workspace dependencies
npm install

# 3. Install client dependencies
cd client
npm install
cd ..
```

---

## 3. Environment Variables Configuration

CampusFlow strictly separates **client-accessible public variables** from **backend-only secret credentials**:

### Project Root `.env` (Backend Server & Provisioning Scripts)
Create a `.env` file in the project root:
```env
# Supabase Cloud Project URL
SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co

# Supabase Public Anonymous API Key (Safe for frontend)
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_publishable_key

# Supabase Service Role Secret Key (TRUSTED BACKEND ONLY - NEVER COMMIT)
SUPABASE_SECRET_KEY=your_supabase_service_role_secret_key

# Groq LPU™ Cloud AI Configuration
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b

# Local Intelligence Microservice Port
PORT=3001

# Enable fallback demo mode when Supabase is not reachable
VITE_ENABLE_DEMO_FALLBACK=true
```

### Client Directory `client/.env` (Frontend Only)
Create a `client/.env` file:
```env
# Public Supabase Connection
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_publishable_key
```

> [!WARNING]
> **Never** place `SUPABASE_SECRET_KEY` or `GROQ_API_KEY` in `client/.env`. Vite embeds all `VITE_` variables directly into client-side JavaScript bundles, which would expose your secret credentials to any browser visitor.

---

## 4. Running the Development Environment

CampusFlow operates with two synchronized processes:

### Terminal 1: Backend Intelligence & Security Microservice
```bash
node server/src/index.mjs
```
- Starts the HTTP microservice on `http://localhost:3001`.
- Handles PDF parsing via `pdf-parse`, prompt injection sanitization, and Groq LPU™ API requests.

### Terminal 2: Frontend Web Application
```bash
npm run dev --prefix client
```
- Starts Vite development server on `http://localhost:5173`.
- In `client/vite.config.ts`, requests to `/functions/v1/*` are automatically reverse-proxied to `http://localhost:3001`.

---

## 5. Verification & Test Suite Execution

CampusFlow provides an extensive suite of automated test harnesses:

### 1. Client TypeScript Compilation & Production Build
```bash
npm run build --prefix client
```
- Executes `tsc -b` for type verification followed by `vite build`.
- Generates production bundle in `client/dist/` with zero warnings or errors.

### 2. Real PostgreSQL Engine In-Memory Harness
```bash
node scripts/test_real_postgresql_execution.js
```
- Boots an embedded PostgreSQL 16.4 WASM instance using `@electric-sql/pglite`.
- Executes `CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql`.
- Verifies all 14 base tables, 11 enums, 18 stored functions, 8 triggers, and RLS policies on real PostgreSQL.

### 3. Supabase Integration & Security Suite (68 Assertions)
```bash
node tests/supabase_integration_test.js
```
- Asserts AST and syntax validity of SQL migrations.
- Tests state machine transition rules.
- Simulates server-side eligibility evaluation across passing, failing, and incomplete student profiles.
- Validates mathematical consistency of placement analytics (zero double-counting).

### 4. End-to-End Recruitment Lifecycle Simulation (11 Steps)
```bash
node tests/e2e_recruitment_lifecycle.js
```
- Simulates the full journey: Admin empanelment → Recruiter posting → Eligibility check → Failure scenarios (ineligible student, expired deadline, duplicate application) → Atomic submission → Recruiter shortlist → Interview scheduling → Final offer selection → Real-time analytics update.

### 5. V5 Migration & Table Verification
```bash
node scripts/test_v5_sql_migration.cjs
```
- Validates `resume_analyses` and `recruiter_invitations` tables and RLS policies on real PostgreSQL.

---

## 6. Project Directory Tree

```
CampusFlow/
├── .env.example                               # Environment variable reference
├── LICENSE                                    # MIT License
├── package.json                               # Root workspace configuration
├── README.md                                  # Architectural & Project Documentation
│
├── client/                                    # Frontend React 18 Application
│   ├── public/                                # Favicons & public static assets
│   ├── src/
│   │   ├── components/                        # UI and Layout Components
│   │   │   ├── charts/                        # Custom Recharts Data Visualizations
│   │   │   │   ├── ChartBarHorizontal.tsx     # Horizontal CTC and Department distribution
│   │   │   │   ├── ChartFunnel.tsx            # Candidate conversion throughput funnel
│   │   │   │   ├── ChartPieDonut.tsx          # Status pipeline donut chart
│   │   │   │   ├── ChartRoleAlignment.tsx     # AI career fit alignment
│   │   │   │   └── InterviewTimeline.tsx      # Chronological interview round tracker
│   │   │   ├── layout/                        # Workstation Shell
│   │   │   │   ├── AppShell.tsx               # Framed-Sheet layout container
│   │   │   │   ├── Header.tsx                 # Breadcrumb & Demo persona switcher
│   │   │   │   └── Sidebar.tsx                # Context-aware navigation sidebar
│   │   │   ├── recruiter/                     # Recruiter-specific components
│   │   │   │   └── CandidateCompare.tsx       # Side-by-side applicant comparison matrix
│   │   │   ├── student/                       # Student-specific components
│   │   │   │   └── CareerCompass.tsx          # Priority action radar component
│   │   │   ├── ui/                            # Atomic design primitives
│   │   │   │   ├── Badge.tsx, Button.tsx, Card.tsx, Dialog.tsx, Input.tsx, Tabs.tsx
│   │   │   └── ProtectedRoute.tsx             # Role and session router guard
│   │   ├── context/
│   │   │   └── AppContext.tsx                 # Centralized state provider & auth bridge
│   │   ├── data/
│   │   │   └── mockData.ts                    # Pre-seeded demonstration datasets
│   │   ├── pages/                             # Route Page Controllers
│   │   │   ├── admin/                         # Placement Administrator Views
│   │   │   │   ├── AdminAnalytics.tsx         # Placement Pulse & Department breakdown
│   │   │   │   ├── AdminApplications.tsx      # Central application audit table
│   │   │   │   ├── AdminCompanies.tsx         # Corporate partner directory
│   │   │   │   ├── AdminDashboard.tsx         # Executive command center
│   │   │   │   ├── AdminDrives.tsx            # Placement drive scheduler
│   │   │   │   ├── AdminInterviews.tsx        # Campus-wide interview schedule
│   │   │   │   ├── AdminRecruiters.tsx        # Recruiter access provisioning & revoke
│   │   │   │   ├── AdminReports.tsx           # NIRF / NAAC accreditation report generator
│   │   │   │   └── AdminStudents.tsx          # Student academic standing directory
│   │   │   ├── auth/                          # Authentication Controllers
│   │   │   │   ├── AuthCallbackPage.tsx       # Google OAuth exchange handler
│   │   │   │   ├── DemoLoginPage.tsx          # 1-click evaluation persona sandbox
│   │   │   │   ├── ForgotPasswordPage.tsx     # Password recovery initiator
│   │   │   │   ├── LoginPage.tsx              # Email/password authentication
│   │   │   │   ├── ResetPasswordPage.tsx      # Token-based password updater
│   │   │   │   └── SignupPage.tsx             # Public student registration
│   │   │   ├── landing/                       # Public Editorial Prestige Landing
│   │   │   │   ├── components/                # Storyline, Simulator & Showcase
│   │   │   │   └── LandingPage.tsx            # Cinematic public portal
│   │   │   ├── recruiter/                     # Recruiter Workstation Views
│   │   │   │   ├── RecruiterAnalytics.tsx     # Throughput funnel & pipeline metrics
│   │   │   │   ├── RecruiterApplicants.tsx    # ATS applicant table & Compare Matrix
│   │   │   │   ├── RecruiterCompany.tsx       # Employer profile editor
│   │   │   │   ├── RecruiterDashboard.tsx     # Hiring pipeline overview
│   │   │   │   ├── RecruiterInterviews.tsx    # Round scheduling & video links
│   │   │   │   ├── RecruiterJobDetails.tsx    # Posting details & applicants
│   │   │   │   ├── RecruiterJobNew.tsx        # Job posting creation wizard
│   │   │   │   └── RecruiterJobs.tsx          # Active postings manager
│   │   │   └── student/                       # Student Career Portal Views
│   │   │       ├── ApplicationDetails.tsx     # Application stage history & audit log
│   │   │       ├── EligibilityLab.tsx         # What-If scenario simulation lab
│   │   │       ├── ExploreOpportunities.tsx   # Searchable job drive catalog
│   │   │       ├── JobDetails.tsx             # Explainable eligibility evaluation
│   │   │       ├── MyApplications.tsx         # Candidate application pipeline
│   │   │       ├── OpportunityWatchlist.tsx   # Bookmarked drives with deadline radar
│   │   │       ├── ResumeIntelligence.tsx     # Groq AI resume parser & match engine
│   │   │       ├── StudentDashboard.tsx       # Career Compass action radar
│   │   │       ├── StudentInterviews.tsx      # Scheduled rounds & .ics export
│   │   │       ├── StudentNotifications.tsx   # In-app notification center
│   │   │       ├── StudentProfile.tsx         # Academic profile & resume upload
│   │   │       └── StudentSettings.tsx        # Password & notification preferences
│   │   ├── services/
│   │   │   ├── campusflowService.ts           # Typed RPC calls, adapters & services
│   │   │   └── supabase.ts                    # Supabase client instantiation
│   │   ├── types/
│   │   │   ├── database.types.ts              # PostgREST generated schema typings
│   │   │   └── index.ts                       # UI domain models and interfaces
│   │   └── utils/
│   │       ├── cn.ts                          # Tailwind class merge helper
│   │       └── formatters.ts                  # Currency, date, and eligibility helpers
│   ├── tailwind.config.js                     # Tailored color palette tokens
│   ├── tsconfig.json                          # TypeScript compiler settings
│   └── vite.config.ts                         # Dev server & reverse proxy config
│
├── server/                                    # Intelligence Backend Microservice
│   └── src/
│       └── index.mjs                          # PDF text parser, Groq AI & recruiter API
│
├── supabase/                                  # Database & Cloud Assets
│   ├── functions/                             # Deno Edge Functions
│   │   ├── analyze-resume/index.ts            # Serverless resume analysis
│   │   └── manage-recruiter/index.ts          # Serverless recruiter provisioning
│   ├── migrations/                            # Version-Controlled SQL Migrations
│   │   ├── 20261030000001_initial_schema.sql  # 14 base relational entities & enums
│   │   ├── 20261030000002_row_level_security.sql # Multi-role RLS & security helpers
│   │   ├── 20261030000003_functions_and_rpc.sql  # Eligibility, submit_app & analytics RPCs
│   │   ├── 20261030000004_seed_demo_data.sql  # Demo ecosystem & synthetic records
│   │   ├── 20261031000001_resume_intelligence.sql # AI analyses & recruiter invites
│   │   └── 20261031_student_watchlist.sql     # Student bookmark table & RLS
│   ├── CAMPUSFLOW_MASTER_DEPLOYMENT_FIXED.sql # Master idempotent deployment script
│   └── DEPLOYMENT_GUIDE.md                    # Database runbook
│
├── docs/                                      # Technical Documentation & Assets
│   ├── assets/screenshots/                    # Verified real application screenshots
│   ├── ARCHITECTURE.md                        # High-level system topology
│   ├── DATABASE_SCHEMA.md                     # Schema, constraints & RLS reference
│   ├── API_REFERENCE.md                       # RPC & Edge Function documentation
│   ├── AUTHENTICATION.md                      # Auth flows, OAuth & anti-escalation
│   ├── RESUME_INTELLIGENCE.md                 # Groq LPU™ AI pipeline & security
│   ├── DEPLOYMENT.md                          # Supabase Cloud deployment runbook
│   └── DEVELOPMENT.md                         # Local dev setup and test guide
│
├── scripts/                                   # Verification, Provisioning & QA Scripts
│   ├── provision_demo_users.js                # GoTrue Admin API account creator
│   ├── test_real_postgresql_execution.js      # PGlite real PostgreSQL engine harness
│   ├── test_v5_sql_migration.cjs              # V5 table migration verification
│   └── capture_responsive_viewports.mjs       # Headless screenshot automation
│
└── tests/                                     # Automated Test Suites
    ├── supabase_integration_test.js           # 68 SQL, RLS & RPC integrity assertions
    └── e2e_recruitment_lifecycle.js           # 11-step recruitment journey simulation
```
