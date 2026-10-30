import React, { useEffect, useRef, useState } from 'react';
import {
  FileSpreadsheet,
  Network,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ScrollStorylineStage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const storySteps = [
    {
      id: 'fracture',
      badge: 'The Legacy Placement Crisis',
      title: 'Spreadsheets to connected reality.',
      desc: 'Traditional campus recruitment relies on disconnected spreadsheets, missed deadlines, candidate hoarding, and unverified resumes. Students face arbitrary black-box rejections with zero transparency into employer cutoffs.',
      stats: [
        { label: 'Opaque Rejections', val: '78%' },
        { label: 'Recruiter Admin Overhead', val: '40+ hrs' },
        { label: 'Accreditation Discrepancies', val: 'Frequent' },
      ],
      icon: FileSpreadsheet,
      accent: '#F87171',
    },
    {
      id: 'orchestration',
      badge: 'The CampusFlow Solution',
      title: 'Instant matching against real cutoffs.',
      desc: 'CampusFlow evaluates student CGPA, major, active backlogs, and technical skills against real company criteria. Students know where they qualify before applying, eliminating wasted effort and recruitment friction.',
      stats: [
        { label: 'Instant Qualification Checks', val: '100%' },
        { label: 'Review Speedup', val: '3.8x' },
        { label: 'Placement Accuracy', val: 'Guaranteed' },
      ],
      icon: Network,
      accent: '#72F4D1',
    },
    {
      id: 'certainty',
      badge: 'Cryptographic Integrity',
      title: 'Verified milestones on an immutable trail.',
      desc: 'Row Level Security ensures multi-tenant data boundaries between competing firms. Real-time candidate stage transitions from Application to Offer provide universities with one-click NIRF and NAAC accreditation data.',
      stats: [
        { label: 'Audit Trail Certainty', val: '100%' },
        { label: 'Accreditation Export', val: '1-Click CSV' },
        { label: 'Multi-Tenant Isolation', val: 'Strict RLS' },
      ],
      icon: ShieldCheck,
      accent: '#59D9FF',
    },
  ];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.33) {
            setActiveStep(0);
          } else if (progress < 0.66) {
            setActiveStep(1);
          } else {
            setActiveStep(2);
          }
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const cur = storySteps[activeStep];
  const Icon = cur.icon;

  return (
    <section
      id="platform"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#080D15] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Step Indicator Navigation Rail */}
        <div className="flex items-center justify-between pb-6 gap-2 sm:gap-3 px-2 sm:px-0">
          {storySteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`flex-1 text-left pb-2.5 transition-all duration-200 border-b-2 ${
                activeStep === idx
                  ? 'border-[#72F4D1] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider block text-slate-400">
                Stage {idx + 1}
              </span>
              <span className="text-xs sm:text-sm font-semibold truncate block">
                <span className="sm:hidden">{idx === 0 ? 'Crisis' : idx === 1 ? 'Solution' : 'Trust'}</span>
                <span className="hidden sm:inline">{idx === 0 ? 'Placement Crisis' : idx === 1 ? 'Unified Solution' : 'Cryptographic Trust'}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic Story Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8">
          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {cur.title}
            </h2>

            <p className="text-base text-slate-300 leading-relaxed font-normal">
              {cur.desc}
            </p>

            {/* Micro-Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {cur.stats.map((s) => (
                <div key={s.label} className="bg-white/5 rounded-xl p-3">
                  <span className="text-xl sm:text-2xl font-black text-white block">
                    {s.val}
                  </span>
                  <span className="text-sm text-slate-300 font-medium block mt-0.5">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Real Artifact Preview Column */}
          <div data-ui="orchestration-hub" className="lg:col-span-6 bg-[#0B111B] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            {/* Visual Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-sm font-medium text-slate-300 ml-2">
                  CampusFlow Orchestration Hub
                </span>
              </div>
              <span className="text-sm font-bold text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                ACTIVE STATE
              </span>
            </div>

            {/* Scene-Specific Interface Fragment */}
            <div className="py-6 space-y-4">
              {activeStep === 0 && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">Manual Application Triage</p>
                      <p className="text-sm text-slate-300">142 PDF Resumes in shared email inbox</p>
                    </div>
                    <span className="text-sm font-bold text-rose-400">UNSORTED</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">Candidate Hoarding Conflict</p>
                      <p className="text-sm text-slate-300">Student shortlisted for 3 overlapping drives</p>
                    </div>
                    <span className="text-sm font-bold text-amber-400">COLLISION</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">Black-Box Rejection</p>
                      <p className="text-sm text-slate-300">Disqualified after 3 weeks with no cutoff feedback</p>
                    </div>
                    <span className="text-sm font-bold text-rose-300">NO AUDIT</span>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-teal-950/50 border border-teal-500/40 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">Pre-Application Verification</p>
                      <p className="text-sm text-slate-300">Aarav Sharma meets 8.00 CGPA cutoff (8.85 verified)</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">PASSED</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/30 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">Academic Discipline Matching</p>
                      <p className="text-sm text-slate-300">B.Tech CSE matches allowed majors (CSE, IT, AI&DS)</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">ELIGIBLE</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">Backlog Verification</p>
                      <p className="text-sm text-slate-300">Strict 0 active backlog policy enforced</p>
                    </div>
                    <span className="text-sm font-bold text-teal-300">CLEARED</span>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">Tamper-Proof Offer Extended</p>
                      <p className="text-sm text-slate-300">NovaTech Systems • ₹18.0 LPA • Full-Time SWE</p>
                    </div>
                    <span className="text-sm font-bold text-cyan-300">OFFERED</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">Institutional Accreditation Record</p>
                      <p className="text-sm text-slate-300">NIRF Criterion 5.2 record verified and signed</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">AUDITED</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">Cross-Tenant Isolation</p>
                      <p className="text-sm text-slate-300">Competing recruiters cannot view peer pipelines</p>
                    </div>
                    <span className="text-sm font-bold text-purple-300">ENFORCED</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm text-slate-300">
              <span>Scroll to traverse workflow stages</span>
              <span className="font-semibold text-white">Stage {activeStep + 1} of 3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
