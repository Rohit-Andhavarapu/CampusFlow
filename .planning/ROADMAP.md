# Roadmap — CampusFlow (HACK-P410)

## Phase Structure

```
PHASE 1: Repository analysis, design foundation, app shell & navigation [CURRENT]
PHASE 2: Premium student portal frontend (Dashboard, Explore, Details, Applications, Interviews, Profile)
PHASE 3: Recruiter and placement administrator frontend
PHASE 4: Complete frontend interactions, validation & visual QA
PHASE 5: Backend architecture, Prisma schema & REST API implementation
PHASE 6: Full-stack integration & end-to-end sync across roles
PHASE 7: Automated testing, verification, demo preparation & documentation
```

### Phase 1 Breakdown: Design Foundation & App Shell
- [x] Project structure initialization (Vite, React 18, TypeScript, Tailwind CSS, Lucide React).
- [ ] Design tokens configuration (`#F8FAFC`, `#635BFF`, `#0F172A`, `#E2E8F0`, etc.).
- [ ] Atomic UI primitives: Button, Card, Badge, Input, Select, Dialog/Modal, Tabs, Toast, Avatar, Skeleton.
- [ ] App Shell layout:
  - Collapsible, polished sidebar with brand identity, role-based nav links, active states.
  - Top navigation bar with role switcher, search, notifications trigger, and user profile popover.
  - Mobile responsive drawer and smooth viewport handling.
- [ ] Routing architecture with placeholder views for all student, recruiter, and admin routes.
- [ ] Visual verification of shell at mobile, tablet, and desktop viewports.

### Phase 2 Breakdown: Premium Student Experience
- [ ] Student Overview Dashboard (Greeting, Metrics, Recommendations, Timeline, Profile completeness).
- [ ] Explore Opportunities Board (Rich filters, search, sorting, high-fidelity job cards).
- [ ] Job Details & Explainable Eligibility Modal/Panel.
- [ ] My Applications Tracker (Interactive step pipeline, status history, withdrawal dialog).
- [ ] Interview Schedule Calendar/List.
- [ ] Student Profile & Resume Manager.

### Phase 3 Breakdown: Recruiter & Admin Portals
- [ ] Recruiter Dashboard & Job Creation/Management.
- [ ] Recruiter Applicant Management Table & Candidate Actions.
- [ ] Placement Administrator Dashboard & Interactive Analytics Charts.
- [ ] Drive & Company Management views.

### Phase 4 Breakdown: Frontend Interactions & Visual QA
- [ ] Centralized mock state engine with reactive event updates.
- [ ] Form validation with Zod + React Hook Form.
- [ ] Visual QA against 1440px desktop, 768px tablet, and 375px mobile.

### Phase 5 Breakdown: Real Backend & Database
- [ ] Express.js API server with TypeScript.
- [ ] Prisma ORM with SQLite/Postgres persistence.
- [ ] Complete REST endpoints for Auth, Students, Jobs, Applications, Interviews, Analytics.
- [ ] Server-side eligibility engine.

### Phase 6 Breakdown: Full-Stack Integration
- [ ] Wire frontend queries to live REST endpoints.
- [ ] Verify multi-role live cycle: Admin drive -> Recruiter posting -> Student application -> Recruiter review/interview -> Admin stats update.

### Phase 7 Breakdown: Polish & Delivery
- [ ] Seed script with 20+ students, 3+ companies, 8+ jobs.
- [ ] Verification suite (Unit/API tests).
- [ ] Comprehensive README, architecture diagrams, and submission documentation.
