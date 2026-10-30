# Requirements — CampusFlow (HACK-P410)

## 1. Functional Requirements

### 1.1 Authentication & Role-Based Access Control
- [ ] Multi-role authentication (Student, Recruiter, Placement Admin).
- [ ] Instant demo role-switcher for presentation and judging.
- [ ] Protected routes ensuring unauthorized users cannot access privileged views.

### 1.2 Student Experience
- [ ] **Student Dashboard:** Greeting, KPI metric cards (Applications, Eligible Roles, Interviews, Shortlists), Recommended Opportunities, Application Activity timeline, Interview schedule preview, Profile completion gauge.
- [ ] **Explore Opportunities (Signature Screen):** Search, multi-dimensional filters (Role/Keyword, Location, Work Mode [Remote/On-site/Hybrid], Type [Internship/Full-time], Stipend/CTC range, Eligibility, Skills), sorting, responsive grid.
- [ ] **Job Details Screen:** Two-column Linear/Ashby style layout, company metadata, role description, stipend/salary, duration, deadlines, transparent criteria inspection.
- [ ] **Explainable Eligibility Engine:** Line-item breakdown of student credentials vs job requirements (CGPA check, Branch check, Passing year check, Required skills check) with pass/fail/incomplete status and actionable guidance.
- [ ] **One-Click Application & Validation:** Verify eligibility and required fields, prevent duplicate applications, update status.
- [ ] **My Applications (Signature Tracker):** Visual progress pipeline (`Submitted` → `Shortlisted` → `Interview` → `Selected`, with `Rejected` and `Withdrawn` terminal states), status change audit history, withdrawal option with modal confirmation.
- [ ] **Interview Scheduling:** View upcoming and past interviews, mode (Virtual / In-Person), meeting links / locations, preparation notes.
- [ ] **Student Profile & Resume:** Comprehensive profile management (Degree, Branch, CGPA, Year of Graduation, Skills tag cloud, Projects), resume preview/upload/delete simulation with file validation.

### 1.3 Recruiter Experience
- [ ] **Recruiter Dashboard:** Active postings KPI, Total applicants, Shortlisted count, Scheduled interviews, visual applicant funnel.
- [ ] **Job Management:** Create job/internship posting with detailed eligibility criteria rules, salary/stipend ranges, location mode, deadline, publish/unpublish toggle.
- [ ] **Applicant Review Table:** High-density candidate table with search, status filters, CGPA, branch, resume quick-view, actions (Shortlist, Reject, Schedule Interview, Select).

### 1.4 Placement Administrator Experience
- [ ] **Admin Dashboard & Analytics:** Total students, Placed students, Placement percentage, Active drives, Partner companies, Recharts-powered graphs (department-wise placements, salary distribution, monthly drive trends).
- [ ] **Company & Drive Management:** Register company profiles, manage placement drive calendar and participating tiers.
- [ ] **Student & Application Oversight:** Search and filter all college applications, exportable reports.

### 1.5 Backend & Database (Phases 5–6)
- [ ] Prisma schema with models: `User`, `StudentProfile`, `Company`, `RecruiterProfile`, `JobPosting`, `EligibilityRule`, `Application`, `ApplicationStatusHistory`, `Interview`, `Notification`.
- [ ] Express REST API endpoints with Zod validation, error handling middleware, JWT/session auth.
- [ ] Server-side eligibility calculation and audit trail logging.
- [ ] Persistent storage and synthetic seed data with 20+ realistic student profiles, 3+ fictional tech enterprises, 8+ jobs.

## 2. Non-Functional Requirements
- **Performance:** Sub-second page navigation, optimized bundle sizes.
- **Accessibility:** WCAG AA compliant contrast ratios, keyboard accessible dialogs and dropdowns.
- **Responsiveness:** Flawless layout scaling from mobile (375px) to tablet (768px) and desktop (1440px+).
- **Design Quality:** Distinctive SaaS aesthetic avoiding generic AI or Bootstrap template look.
