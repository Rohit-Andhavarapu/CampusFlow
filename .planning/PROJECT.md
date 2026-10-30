# CampusFlow — Premium Campus Recruitment Management Platform

## Project Overview
- **Project Name:** CampusFlow
- **Tagline:** "Your career journey, beautifully connected."
- **Hackathon Problem Statement:** HACK-P410 (Campus Recruitment Portal)
- **Category:** Job & Recruitment (Intermediate–Advanced Full-Stack Prototype)
- **Primary Mission:** Centralize disconnected placement cell workflows (spreadsheets, emails, manual updates) into an elite, responsive, full-stack recruitment SaaS platform with role-based access for Students, Recruiters, and Placement Administrators.

## Design Philosophy & Visual Personality
- Inspired by the restraint, typography, and UX precision of **Linear, Vercel, Ashby, Greenhouse, and Notion**.
- Light, clean, refined palette:
  - Base: `#F8FAFC`
  - Surface: `#FFFFFF`
  - Secondary Surface: `#F1F5F9`
  - Primary Accent: `#635BFF` (Iris / Indigo SaaS)
  - Accent Hover: `#5148E5`
  - Accent Surface: `#EEF0FF`
  - Semantic: Success (`#16A34A`), Warning (`#D97706`), Error (`#DC2626`), Info (`#2563EB`), Border (`#E2E8F0`).
- Geist/Inter typography, 8px spacing grid, subtle borders, intentional whitespace, zero generic dashboard tropes.

## User Roles
1. **Student:** Explore jobs/internships, explainable eligibility check, 1-click apply, application status pipeline, interview schedules, profile & resume management.
2. **Recruiter:** Post & manage jobs/internships, candidate pipeline, review applicants, evaluate resumes, shortlist/reject, schedule interviews, record final hiring selections.
3. **Placement Administrator:** College-wide oversight, company relationship management, recruitment drives, placement statistics & department analytics, audit trails.

## Technical Architecture
- **Frontend:** React 18/19, TypeScript, Vite, Tailwind CSS, Lucide React, React Router v6/7, Radix UI primitives, Recharts.
- **Backend:** Node.js, Express.js, TypeScript, RESTful architecture.
- **Database:** Prisma ORM, SQLite (local development zero-friction persistence) / PostgreSQL ready.
- **State Management & Data:** Centralized reactive store / mock data engine for instant prototyping advancing to real API layer.

## Development Roadmap
- **PHASE 1:** Repository analysis, design tokens, shared application shell, and atomic UI foundation.
- **PHASE 2:** Premium student portal frontend (Dashboard, Explore Opportunities, Job Details, My Applications, Interviews, Profile, Resume).
- **PHASE 3:** Recruiter and placement administrator portals.
- **PHASE 4:** Complete frontend interactions, validation, edge cases, and visual QA.
- **PHASE 5:** Backend and persistent database implementation (Prisma + Express + Auth + Business Rules).
- **PHASE 6:** Full-stack integration and end-to-end sync across roles.
- **PHASE 7:** Automated testing, demo seeding, documentation, and presentation prep.
