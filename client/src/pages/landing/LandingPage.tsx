import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  ChevronRight,
  ExternalLink,
  Laptop,
  Layers,
  GraduationCap,
  Briefcase,
  Play,
  FileCheck2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LandingHeader } from './components/LandingHeader';
import { LandingFooter } from './components/LandingFooter';
import { HeroCoreCanvas } from './components/HeroCoreCanvas';
import { RoleShowcaseStage } from './components/RoleShowcaseStage';
import { EligibilitySandbox } from './components/EligibilitySandbox';
import { ApplicationJourneyTimeline } from './components/ApplicationJourneyTimeline';
import { CampusEcosystemNetwork } from './components/CampusEcosystemNetwork';

export const LandingPage: React.FC = () => {
  const { currentRole, switchRole } = useApp();
  const navigate = useNavigate();

  const handleQuickDemo = (role: 'student' | 'recruiter' | 'admin') => {
    switchRole(role, false);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[#060B12] text-slate-100 selection:bg-[#0F766E]/40 selection:text-[#72F4D1] font-sans overflow-x-hidden">
      {/* Navigation Header */}
      <LandingHeader />

      {/* =========================================================================
          SECTION 1 — CINEMATIC OPENING (HERO)
          ========================================================================= */}
      <section id="hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Subtle Ambient Radial Lighting Behind All Text */}
        <div className="absolute top-10 w-96 h-96 bg-[#0F766E]/15 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-32 w-80 h-80 bg-[#59D9FF]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Hero Title with High Z-Index to Prevent Layer Overlap */}
        <div className="relative z-20 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
            Your Future. <span className="text-[#72F4D1]">In Motion.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 mt-6 max-w-[62ch] mx-auto font-normal leading-relaxed">
            One connected ecosystem for students, recruiters, and placement teams—where every opportunity, application, and career milestone moves forward with clarity.
          </p>
        </div>

        {/* Action Controls with Emil Kowalski Button Physics */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-9 relative z-20">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-bold border border-[#72F4D1]/40 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 text-[#72F4D1]" />
          </Link>

          <a
            href="#story"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-semibold border border-white/10 transition-colors active:scale-95 text-center"
          >
            Explore Architecture
          </a>

          <button
            onClick={() => handleQuickDemo('student')}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#0B111B] hover:bg-white/10 text-[#72F4D1] text-sm font-bold border border-[#72F4D1]/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-[#72F4D1]" />
            <span>Judge Demo Tour</span>
          </button>
        </div>

        {/* Visual Centerpiece: Original Animated Recruitment Core */}
        <div className="w-full mt-6 relative z-10">
          <HeroCoreCanvas />
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — THE TRANSFORMATION STORY
          ========================================================================= */}
      <section id="story" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Scattered opportunities to one connected future.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed max-w-[62ch] mx-auto">
            Campus recruitment was historically fractured across siloed WhatsApp groups, unverified resumes, opaque shortlisting criteria, and manual Excel spreadsheets. CampusFlow replaces fragmentation with an authoritative digital workstation.
          </p>
        </div>

        {/* Transformation Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Legacy Paradigm */}
          <div className="p-8 rounded-3xl bg-[#0B111B]/60 border border-rose-500/20 relative overflow-hidden">
            <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              The Legacy Status Quo
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Siloed, Opaque & High-Friction</h3>
            <ul className="space-y-3.5 text-sm text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Students apply blindly without knowing if they satisfy strict company eligibility cutoffs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Recruiters download hundred-page spreadsheets with unverified, self-reported academic scores.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Placement offices manually consolidate hiring stats over weeks for NIRF/NAAC reporting.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Silent rejections and dropped interview notifications damage student trust and morale.</span>
              </li>
            </ul>
          </div>

          {/* CampusFlow Paradigm */}
          <div className="p-8 rounded-3xl bg-[#0B111B] border border-[#72F4D1]/30 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none -z-10" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[#72F4D1] text-sm font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-[#72F4D1] animate-ping" />
                The CampusFlow Standard
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Unified, Verifiable & Instant</h3>
              <ul className="space-y-3.5 text-sm text-slate-200 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#72F4D1] flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Pre-Application Transparency:</strong> Explainable criteria evaluation calculates eligibility before submission.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#72F4D1] flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Ashby High-Density Review:</strong> Screen candidate dossiers, GitHub projects, and PDF resumes side-by-side.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#72F4D1] flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">PostgreSQL Integrity:</strong> Institutional placement rates calculate via atomic RPCs with zero mathematical discrepancy.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#72F4D1] flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Continuous Audit Trail:</strong> Every status transition records exact timestamp, reason, and evaluator identity.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — THREE WORLDS, ONE PLATFORM
          ========================================================================= */}
      <section id="roles" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Three perspectives. One unified truth.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed max-w-[62ch] mx-auto">
            CampusFlow orchestrates tailored workflows for every participant in the recruitment journey without duplicating data or breaking institutional access boundaries.
          </p>
        </div>

        {/* Interactive Three Worlds Showcase */}
        <RoleShowcaseStage />
      </section>

      {/* =========================================================================
          SECTION 4 — THE CAMPUSFLOW PRODUCT REVEAL
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            The Recruitment Workstation.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed max-w-[62ch] mx-auto">
            Engineered with Linear's visual discipline and Emil Kowalski's interaction physics. High information density without visual clutter.
          </p>
        </div>

        {/* Framed-Sheet Hardware-Grade Presentation */}
        <div data-ui="workstation-preview" className="relative mx-auto rounded-3xl bg-[#0B111B] p-2 sm:p-4 border border-white/15">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#060B12]">
            {/* Top Browser Sheet Bar */}
            <div className="h-10 bg-[#0B111B] border-b border-white/10 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-sans text-slate-400 ml-3">app.campusflow.io/recruiter/applicants</span>
              </div>
              <span className="text-[10px] font-semibold text-[#72F4D1] bg-[#72F4D1]/10 px-2 py-0.5 rounded border border-[#72F4D1]/20">
                PROD v4.0 • LIVE POSTGRES
              </span>
            </div>

            {/* Workstation UI Preview */}
            <div className="p-6 sm:p-8 bg-slate-900/50">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Candidate Queue */}
                <div className="md:col-span-5 space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400 pb-2 border-b border-white/10">
                    <span>CANDIDATES (18)</span>
                    <span>SORT: CGPA ↓</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0F766E]/20 border border-[#72F4D1]/40 text-left">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-white">Aarav Sharma</span>
                      <span className="text-[10px] font-bold text-[#72F4D1] bg-[#72F4D1]/20 px-1.5 py-0.5 rounded">8.85 CGPA</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">B.Tech Computer Science & Eng. • Class 2026</p>
                    <span className="inline-block mt-2 text-[10px] font-semibold text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-500/30">
                      Technical Round Scheduled
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-left opacity-75">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-white">Bhavna Kulkarni</span>
                      <span className="text-[10px] font-bold text-teal-300 bg-white/10 px-1.5 py-0.5 rounded">9.20 CGPA</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">B.Tech IT • Python, Django, AWS</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-left opacity-60">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-white">Devansh Mehta</span>
                      <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">8.45 CGPA</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">B.Tech AI & Data Science • PyTorch, SQL</p>
                  </div>
                </div>

                {/* Candidate Inspector Dossier */}
                <div className="md:col-span-7 bg-[#0B111B] border border-white/10 rounded-2xl p-5 space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h4 className="text-sm font-bold text-white">Aarav Sharma</h4>
                      <p className="text-[11px] text-slate-400">aarav.sharma@campus.edu • +91 98765 43210</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-teal-300 bg-teal-950 border border-teal-500/40">
                      Verified Academic Profile
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Technical Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'].map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded text-[11px] bg-white/5 border border-white/10 text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">Interview: Round 1 Systems Design</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Nov 02, 2026 • 2:00 PM • Google Meet</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#0F766E] text-white text-[11px] font-semibold">
                      Join Link
                    </span>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => handleQuickDemo('recruiter')}
                      className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold transition-all active:scale-95"
                    >
                      Open Live Recruiter Portal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — ELIGIBILITY ENGINE (ONE LIVE THING)
          ========================================================================= */}
      <section id="eligibility" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Know where you stand. Before you apply.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed max-w-[62ch] mx-auto">
            CampusFlow's explainable eligibility engine checks student metrics against employer cutoffs dynamically. Test the algorithm below by adjusting credentials in real time.
          </p>
        </div>

        {/* The Live Interactive Sandbox */}
        <EligibilitySandbox />
      </section>

      {/* =========================================================================
          SECTION 6 — APPLICATION JOURNEY
          ========================================================================= */}
      <section id="journey" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Every milestone. Beautifully clear.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed max-w-[62ch] mx-auto">
            Eliminate ghosting and ambiguous hiring cycles. Every candidate's status advances through an immutable state machine with transparent feedback and timestamped accountability.
          </p>
        </div>

        {/* Interactive Career Progression Timeline */}
        <ApplicationJourneyTimeline />
      </section>

      {/* =========================================================================
          SECTION 7 — A CONNECTED CAMPUS ECOSYSTEM
          ========================================================================= */}
      <section id="ecosystem" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            An ecosystem built on institutional trust.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed max-w-[62ch] mx-auto">
            Engineered with multi-tenant Row Level Security, ensuring student privacy, corporate candidate separation, and automated NIRF & NAAC regulatory compliance.
          </p>
        </div>

        {/* Security & Network Topology */}
        <CampusEcosystemNetwork />
      </section>

      {/* =========================================================================
          SECTION 8 — THE FINAL CALL TO ACTION
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative overflow-hidden">
        {/* Luminous Horizon Ambient Behind Content */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#0F766E]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="relative z-20 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            The next opportunity starts here.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mt-5 max-w-[62ch] mx-auto leading-relaxed">
            Step into a recruitment platform designed with Apple-grade storytelling, Linear-level density, and enterprise PostgreSQL security.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 relative z-20">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-bold border border-[#72F4D1]/40 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Create Student Account</span>
            <ArrowRight className="w-4 h-4 text-[#72F4D1]" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-semibold border border-white/10 transition-colors active:scale-95 text-center"
          >
            Sign In to Workspace
          </Link>

          <button
            onClick={() => handleQuickDemo('admin')}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#0B111B] hover:bg-white/10 text-[#72F4D1] text-sm font-bold border border-[#72F4D1]/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-[#72F4D1]" />
            <span>Placement Admin Tour</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9 — PREMIUM FOOTER
          ========================================================================= */}
      <LandingFooter />
    </div>
  );
};
