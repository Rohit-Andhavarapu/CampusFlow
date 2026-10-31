# CampusFlow — University Recruitment Intelligence & Career Ecosystem

> A modern, data-driven campus placement platform uniting Students, Corporate Recruiters, and University Placement Administrators with Groq LPU™ AI resume intelligence, interactive analytics, and verified institutional workflows.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![Groq AI](https://img.shields.io/badge/Groq_LPU™-AI_Inference-F05A28.svg)](https://groq.com/)

---

## 🏛️ Overview

**CampusFlow** reimagines the collegiate placement drive from a fragmented administrative process into a high-status, cinematic digital ecosystem. Designed with the **Editorial Prestige** aesthetic—warm ivory surfaces, deep forest-green accents, refined typography, and purposeful data visualizations—it provides each recruitment stakeholder with dedicated tools.

---

## 🚀 Key Features

### 1. 🧠 Groq-Powered AI Resume Intelligence
- **High-Speed Inference**: Leverages Groq's LPU™ cloud running `openai/gpt-oss-120b` for near-instant resume parsing and skill mapping.
- **Evidence-Based Extraction**: Extracts text directly from uploaded PDF documents via `PDFParse` and normalizes competencies across frontend, backend, databases, cloud, and developer platforms.
- **Dual-Badge Opportunity Matching**: Distinguishes between:
  - **AI Resume Suitability %** (demonstrated skills vs job requirements)
  - **Academic Cutoff Eligibility** (CGPA threshold, allowed engineering branches, backlogs)
- **Career Trajectories & Skill Gaps**: Highlights top career alignment tiers with actionable interview preparation roadmaps.
- **Enterprise Security**: Strict prompt injection sanitization, zero PII persistence, explicit student consent enforcement, and SHA-256 analysis caching.

### 2. 🛡️ Recruiter Access Management (Placement Admin)
- **Corporate Account Provisioning**: Placement directors can invite verified enterprise talent acquisition partners.
- **Company-Scoped RLS**: Recruiter permissions are strictly bounded to their assigned company; competitors cannot access cross-corporate applicant data.
- **Credential Lifecycle**: Real-time listing, invitation resending, and instant credential revocation.

### 3. 📊 Purposeful Recruitment Analytics
- **Elimination of Redundant Pie Charts**: Uses purposeful, modern data visualizations:
  - **Segmented Pipeline Bars**: Visual tracking of application stages (Submitted → Shortlisted → Technical Rounds → Selected).
  - **Chronological Interview Timelines**: Schedules with meeting links and one-click `.ics` calendar sync.
  - **Horizontal Partner CTC Rankings**: Differentiating annual packages (LPA) from monthly internship stipends.
  - **Placement Drive Milestone Schedules**: Real-time university placement velocity tracking.
- **Zero-CGPA Cutoff Clarity**: Clean presentation of "No Min CGPA" instead of ambiguous numerical thresholds.

### 4. 🔒 Strict Multi-Tenant Data Isolation
- **Real User Privacy**: Real registered email and Google OAuth users start with an authentic 0-application empty state and account-isolated profiles.
- **Designated Demo Sandbox**: Pre-configured evaluation personas for rapid hackathon and institutional walkthroughs.

---

## 🛠️ Tech Stack & Architecture

```
CampusFlow/
├── client/                     # Frontend React 18 + TypeScript Application
│   ├── src/
│   │   ├── components/         # Reusable UI & Layout Components
│   │   │   ├── charts/         # Segmented bars, timelines, horizontal rankings
│   │   │   ├── layout/         # Fixed Sidebar, AppShell, TopNav
│   │   │   └── ui/             # Card, Badge, Button, Dialog, Select
│   │   ├── context/            # AppContext (Auth, Student, Recruiter state)
│   │   ├── pages/
│   │   │   ├── admin/          # Command Center, Recruiter Access, Analytics
│   │   │   ├── auth/           # Login, Signup, OAuth, Demo personas
│   │   │   ├── landing/        # Approved Editorial Prestige Landing Page
│   │   │   ├── recruiter/      # Job Manager, Candidate Compare, Analytics
│   │   │   └── student/        # Resume Intelligence, What-If Lab, Watchlist
│   │   └── services/           # Supabase API, Groq AI & Recruiter services
│   └── vite.config.ts          # Vite build config with /functions/v1 reverse proxy
├── server/                     # Backend Intelligence & Security Microservice
│   └── src/index.mjs           # Node.js backend handling PDF parsing & Groq AI
├── supabase/
│   ├── functions/              # Deno Edge Functions (analyze-resume, manage-recruiter)
│   └── migrations/             # SQL Migrations with Row Level Security (RLS)
└── scripts/                    # End-to-end automated CDP test verification suite
```

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v18+ (Node 22+ recommended)
- **npm** or **pnpm**
- **Supabase Account**: With PostgreSQL project created
- **Groq API Key**: For resume intelligence inference

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Rohit-Andhavarapu/CampusFlow.git
cd CampusFlow

# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_publishable_key
SUPABASE_SECRET_KEY=your_supabase_service_role_secret_key

# Groq AI Cloud
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b

# Ports
PORT=3001
VITE_ENABLE_DEMO_FALLBACK=true
```

### 3. Run the Development Servers
In two separate terminals:

**Terminal 1 — Intelligence Backend:**
```bash
node server/src/index.mjs
# Running on http://localhost:3001
```

**Terminal 2 — Frontend Application:**
```bash
npm run dev --prefix client
# Running on http://localhost:5173
```

---

## 🎭 Evaluation Demo Accounts

Access pre-seeded demonstration data instantly via [`/demo`](http://localhost:5173/demo):

| Persona | Credentials | Key Workspaces |
| :--- | :--- | :--- |
| **Student** | `aarav.sharma@campus.edu`<br>`CampusFlow2026!` | Resume Intelligence, What-If Eligibility Lab, Watchlist, Applications |
| **Recruiter** | `priya.nair@novatech.io`<br>`CampusFlow2026!` | Candidate Comparison Matrix, Job Postings, Applicant Pipeline |
| **Placement Dean** | `placements@campus.edu`<br>`CampusFlow2026!` | Recruiter Access Management, NIRF/NAAC Reports, Placement Pulse |

---

## 🧪 Testing & Verification

Run the automated Chrome DevTools Protocol verification suite:
```bash
node scripts/verify_v5_intelligence.mjs
```

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
