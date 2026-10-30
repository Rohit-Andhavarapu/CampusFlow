import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Layers,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';

export const RoleShowcaseStage: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'student' | 'recruiter' | 'admin'>('student');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleRoleSelect = (role: 'student' | 'recruiter' | 'admin') => {
    if (role === activeRole) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveRole(role);
      setIsTransitioning(false);
    }, 180);
  };

  return (
    <div data-ui="role-showcase-stage" className="w-full max-w-6xl mx-auto">
      {/* Role Navigation Toggle with Emil Kowalski Button Physics */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 rounded-2xl bg-[#0B111B] border border-white/10 shadow-2xl backdrop-blur-xl">
          {[
            { id: 'student', label: 'For Students', icon: GraduationCap },
            { id: 'recruiter', label: 'For Recruiters', icon: Briefcase },
            { id: 'admin', label: 'For Placement Teams', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeRole === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleRoleSelect(tab.id as any)}
                className={`relative flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-[#0F766E] text-white border border-[#72F4D1]/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#72F4D1]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage with Subtle Blur Crossfade */}
      <div
        className={`transition-all duration-200 ${
          isTransitioning ? 'opacity-40 filter blur-[2px] scale-[0.99]' : 'opacity-100 filter blur-0 scale-100'
        }`}
      >
        {activeRole === 'student' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0B111B] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-[#72F4D1] bg-[#72F4D1]/10 border border-[#72F4D1]/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Student Experience
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Know where you qualify before clicking apply.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                CampusFlow inspects your academic credentials against employer criteria in real time. Never face arbitrary rejections—review transparent pass/fail scores on CGPA, branch, backlogs, and verified technical skills.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#72F4D1] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">Pre-Application Verification:</strong> 100% transparent algorithmic check before resume submission.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#72F4D1] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">Live Career Milestones:</strong> Track from initial screening through technical interviews to selection.</p>
                </div>
              </div>
            </div>

            {/* Simulated Live Product Artifact */}
            <div className="lg:col-span-7 bg-[#060B12] border border-white/10 rounded-2xl p-6 shadow-inner relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-900/60 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold">
                    NT
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Software Engineer Trainee</h4>
                    <p className="text-xs text-slate-400">NovaTech Systems • Bengaluru / Hybrid</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 animate-pulse">
                  ELIGIBLE TO APPLY
                </span>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Explainable Criteria Checklist</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[11px] block">Minimum CGPA (Cutoff: 8.00)</span>
                    <span className="text-[#72F4D1] font-bold">8.85 — PASSED</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[11px] block">Eligible Branch</span>
                    <span className="text-[#72F4D1] font-bold">CSE — PASSED</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[11px] block">Active Backlogs (Max: 0)</span>
                    <span className="text-[#72F4D1] font-bold">0 Backlogs — PASSED</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[11px] block">Graduation Batch</span>
                    <span className="text-[#72F4D1] font-bold">2026 — PASSED</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-white">₹14.0 - ₹18.0 LPA</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#0F766E] text-white text-xs font-semibold shadow-md">
                  One-Click Verified Apply
                </span>
              </div>
            </div>
          </div>
        )}

        {activeRole === 'recruiter' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0B111B] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-[#59D9FF] bg-[#59D9FF]/10 border border-[#59D9FF]/30">
                <Briefcase className="w-3.5 h-3.5" />
                Recruiter Workstation
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                High-density applicant review with Ashby precision.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Filter and inspect candidates without context-switching. Our split-pane workstation reveals verified academic scores, GitHub projects, and PDF resumes side-by-side with instantaneous shortlist and interview triggers.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#59D9FF] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">Zero Clutter Split-Pane:</strong> Candidate queue on the left, full dossier on the right.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#59D9FF] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">Integrated Interview Dispatch:</strong> Schedule Google Meet rounds directly into candidate dashboards.</p>
                </div>
              </div>
            </div>

            {/* Simulated Live Product Artifact */}
            <div className="lg:col-span-7 bg-[#060B12] border border-white/10 rounded-2xl p-6 shadow-inner relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-white">Aarav Sharma</h4>
                  <p className="text-xs text-slate-400">Roll: N25H02A0325 • B.Tech CSE (8.85 CGPA)</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-950/80 border border-teal-500/30 animate-pulse">
                  Shortlisted for Interview
                </span>
              </div>

              <div className="py-4 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'].map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded text-[11px] bg-white/5 border border-white/10 text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#72F4D1]" />
                    <span className="text-xs text-slate-200">Technical Round: Nov 02, 2026 • 2:00 PM</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#72F4D1]">Google Meet</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">Status: Interview Scheduled</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#0F766E] text-white text-xs font-semibold">
                  Extend Official Offer
                </span>
              </div>
            </div>
          </div>
        )}

        {activeRole === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0B111B] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-purple-300 bg-purple-900/30 border border-purple-500/30">
                <Layers className="w-3.5 h-3.5" />
                Placement Administration
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Institutional command over every campus drive.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Coordinate multi-company hiring schedules, oversee student eligibility allocations, prevent candidate hoarding, and generate one-click NIRF and NAAC accreditation compliance datasets with mathematical audit integrity.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">Real-Time Aggregation:</strong> Instant zero-discrepancy placement statistics calculated by PostgreSQL RPC.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">Accreditation Ready:</strong> Export verified student placement records for institutional regulatory audits.</p>
                </div>
              </div>
            </div>

            {/* Simulated Live Product Artifact */}
            <div className="lg:col-span-7 bg-[#060B12] border border-white/10 rounded-2xl p-6 shadow-inner relative overflow-hidden">
              <div className="grid grid-cols-3 gap-3 pb-4 border-b border-white/10 text-center">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-2xl font-extrabold text-emerald-400">55.0%</span>
                  <span className="text-[10px] text-slate-400 block mt-1 uppercase font-semibold">Placement Rate</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-2xl font-extrabold text-white">11 / 20</span>
                  <span className="text-[10px] text-slate-400 block mt-1 uppercase font-semibold">Placed Students</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-2xl font-extrabold text-teal-300">6</span>
                  <span className="text-[10px] text-slate-400 block mt-1 uppercase font-semibold">Active Partners</span>
                </div>
              </div>

              <div className="py-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-semibold pb-1 border-b border-white/5">
                  <span>DEPARTMENT</span>
                  <span>PLACED / TOTAL</span>
                  <span>RATE</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-white font-medium">Computer Science & Eng.</span>
                  <span className="text-slate-300 font-medium">4 / 9</span>
                  <span className="text-emerald-400 font-bold">44.4%</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-white font-medium">Information Technology</span>
                  <span className="text-slate-300 font-medium">3 / 5</span>
                  <span className="text-emerald-400 font-bold">60.0%</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-white font-medium">AI & Data Science</span>
                  <span className="text-slate-300 font-medium">3 / 3</span>
                  <span className="text-emerald-400 font-bold">100.0%</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">Class of 2026 Batch</span>
                <span className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10">
                  Export NAAC/NIRF CSV
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
