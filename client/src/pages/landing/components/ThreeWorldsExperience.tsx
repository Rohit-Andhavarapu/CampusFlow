import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Layers,
  CheckCircle2,
  Calendar,
  FileCheck2,
  Download,
  Building2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const ThreeWorldsExperience: React.FC = () => {
  const [activeWorld, setActiveWorld] = useState<'student' | 'recruiter' | 'admin'>('student');
  const [isCrossfading, setIsCrossfading] = useState(false);

  const handleSelectWorld = (world: 'student' | 'recruiter' | 'admin') => {
    if (world === activeWorld) return;
    setIsCrossfading(true);
    setTimeout(() => {
      setActiveWorld(world);
      setIsCrossfading(false);
    }, 180);
  };

  return (
    <section id="students" className="w-full bg-[#060B12] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Three perspectives. One unified truth.
          </h2>
          <p className="text-base text-slate-300">
            Engineered specifically for each participant in the university hiring ecosystem.
          </p>
        </div>

        {/* Tactile World Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#0B111B]">
            {[
              { id: 'student', label: 'For Students', icon: GraduationCap },
              { id: 'recruiter', label: 'For Recruiters', icon: Briefcase },
              { id: 'admin', label: 'For Placement Teams', icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeWorld === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectWorld(tab.id as any)}
                  className={`flex items-center gap-2.5 px-5 sm:px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
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

        {/* Stage Content with Emil Kowalski Blur Crossfade */}
        <div
          className={`transition-all duration-200 ${
            isCrossfading
              ? 'opacity-40 filter blur-[2px] scale-[0.99]'
              : 'opacity-100 filter blur-0 scale-100'
          }`}
        >
          {/* 1. STUDENT WORLD */}
          {activeWorld === 'student' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0B111B] rounded-3xl p-6 sm:p-10">
              <div className="lg:col-span-5 space-y-5">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Know where you qualify before applying.
                </h3>
                <p className="text-base text-slate-300 leading-relaxed">
                  CampusFlow inspects your academic credentials against employer criteria in real time. Never face arbitrary rejections—review transparent pass/fail scores on CGPA, branch, backlogs, and verified technical skills.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#72F4D1] flex-shrink-0 mt-1" />
                    <p className="text-sm text-slate-300">
                      <strong className="text-white">Pre-Application Verification:</strong> 100% transparent qualification check before resume submission.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#72F4D1] flex-shrink-0 mt-1" />
                    <p className="text-sm text-slate-300">
                      <strong className="text-white">Live Career Milestones:</strong> Track from initial screening through technical interviews to selection.
                    </p>
                  </div>
                </div>
              </div>

              {/* Real Student Product Artifact */}
              <div data-ui="student-product-preview" className="lg:col-span-7 bg-[#060B12] rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-900/60 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold">
                      NT
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Software Engineer Trainee</h4>
                      <p className="text-sm text-slate-400">NovaTech Systems • Bengaluru / Hybrid</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-sm font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 animate-pulse">
                    ELIGIBLE TO APPLY
                  </span>
                </div>

                <div className="py-4 space-y-3">
                  <p className="text-sm text-slate-300 font-semibold">
                    Explainable criteria checklist
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2.5 rounded-lg bg-white/5">
                      <span className="text-slate-400 text-sm block">Minimum CGPA (Cutoff: 8.00)</span>
                      <span className="text-[#72F4D1] font-bold">8.85 — PASSED</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5">
                      <span className="text-slate-400 text-sm block">Eligible Branch</span>
                      <span className="text-[#72F4D1] font-bold">CSE — PASSED</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5">
                      <span className="text-slate-400 text-sm block">Active Backlogs (Max: 0)</span>
                      <span className="text-[#72F4D1] font-bold">0 Backlogs — PASSED</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5">
                      <span className="text-slate-400 text-sm block">Graduation Batch</span>
                      <span className="text-[#72F4D1] font-bold">2026 — PASSED</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">₹14.0 - ₹18.0 LPA</span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-[#0F766E] text-white text-sm font-semibold">
                    One-Click Verified Apply
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. RECRUITER WORLD */}
          {activeWorld === 'recruiter' && (
            <div id="recruiters" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0B111B] rounded-3xl p-6 sm:p-10">
              <div className="lg:col-span-5 space-y-5">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  High-density applicant review with Ashby precision.
                </h3>
                <p className="text-base text-slate-300 leading-relaxed">
                  Filter and inspect candidates without context-switching. Our split-pane workstation reveals verified academic scores, GitHub projects, and PDF resumes side-by-side with instantaneous shortlist and interview triggers.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#59D9FF] flex-shrink-0 mt-1" />
                    <p className="text-sm text-slate-300">
                      <strong className="text-white">Zero Clutter Split-Pane:</strong> Candidate queue on the left, full dossier on the right.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#59D9FF] flex-shrink-0 mt-1" />
                    <p className="text-sm text-slate-300">
                      <strong className="text-white">Integrated Interview Dispatch:</strong> Schedule Google Meet rounds directly into candidate dashboards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Real Recruiter Product Artifact */}
              <div data-ui="recruiter-product-preview" className="lg:col-span-7 bg-[#060B12] rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h4 className="text-sm font-bold text-white">Aarav Sharma</h4>
                    <p className="text-sm text-slate-400">Roll: N25H02A0325 • B.Tech CSE (8.85 CGPA)</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-950/80 border border-teal-500/30 animate-pulse">
                    Shortlisted for Interview
                  </span>
                </div>

                <div className="py-4 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'].map((skill) => (
                      <span key={skill} className="px-2.5 py-1 rounded-md text-sm bg-white/5 text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#72F4D1]" />
                      <span className="text-sm text-slate-200">Technical Round: Nov 02, 2026 • 2:00 PM</span>
                    </div>
                    <span className="text-sm font-semibold text-[#72F4D1]">Google Meet</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm text-slate-400">Status: Interview Scheduled</span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-[#0F766E] text-white text-sm font-semibold">
                    Extend Official Offer
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. ADMIN WORLD */}
          {activeWorld === 'admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0B111B] rounded-3xl p-6 sm:p-10">
              <div className="lg:col-span-5 space-y-5">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Institutional command over every campus drive.
                </h3>
                <p className="text-base text-slate-300 leading-relaxed">
                  Coordinate multi-company hiring schedules, oversee student eligibility allocations, prevent candidate hoarding, and generate one-click NIRF and NAAC accreditation compliance datasets with mathematical audit integrity.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />
                    <p className="text-sm text-slate-300">
                      <strong className="text-white">Real-Time Aggregation:</strong> Instant zero-discrepancy placement statistics calculated by live database queries.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />
                    <p className="text-sm text-slate-300">
                      <strong className="text-white">Accreditation Ready:</strong> Export verified student placement records for institutional regulatory audits.
                    </p>
                  </div>
                </div>
              </div>

              {/* Real Admin Product Artifact */}
              <div data-ui="admin-product-preview" className="lg:col-span-7 bg-[#060B12] rounded-2xl p-6 relative overflow-hidden">
                <div className="grid grid-cols-3 gap-3 pb-4 border-b border-white/10 text-center">
                  <div className="p-3 rounded-xl bg-white/5">
                    <span className="text-2xl font-extrabold text-emerald-400">55.0%</span>
                    <span className="text-xs text-slate-300 block mt-1 font-medium">Placement rate</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <span className="text-2xl font-extrabold text-white">11 / 20</span>
                    <span className="text-xs text-slate-300 block mt-1 font-medium">Placed students</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <span className="text-2xl font-extrabold text-teal-300">6</span>
                    <span className="text-xs text-slate-300 block mt-1 font-medium">Active partners</span>
                  </div>
                </div>

                <div className="py-4 space-y-2">
                  <div className="flex justify-between text-sm text-slate-400 font-semibold pb-1 border-b border-white/5">
                    <span>Department</span>
                    <span>Placed / Total</span>
                    <span>Rate</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-white font-medium">Computer Science & Eng.</span>
                    <span className="text-slate-300 font-medium">4 / 9</span>
                    <span className="text-emerald-400 font-bold">44.4%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-white font-medium">Information Technology</span>
                    <span className="text-slate-300 font-medium">3 / 5</span>
                    <span className="text-emerald-400 font-bold">60.0%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-white font-medium">AI & Data Science</span>
                    <span className="text-slate-300 font-medium">3 / 3</span>
                    <span className="text-emerald-400 font-bold">100.0%</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm text-slate-400">Class of 2026 Batch</span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-semibold flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    Export NAAC/NIRF CSV
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
