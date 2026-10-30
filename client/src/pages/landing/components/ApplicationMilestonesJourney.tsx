import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  Calendar,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ApplicationMilestonesJourney: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState(3);

  const stages = [
    {
      id: 0,
      name: 'Verified Application',
      step: '1',
      icon: FileText,
      title: 'Application Cryptographically Sealed',
      actor: 'Aarav Sharma (Candidate)',
      timestamp: 'Oct 24, 2026 • 10:14 AM',
      telemetry: 'SHA-256 Verified Resume • 8.85 CGPA Pre-Screened',
      desc: 'Candidate academic scores, verified transcripts, and technical projects were evaluated against NovaTech Systems cutoffs. All requirements cleared.',
    },
    {
      id: 1,
      name: 'Recruiter Review',
      step: '2',
      icon: Search,
      title: 'Candidate Triage & Portfolio Inspection',
      actor: 'Priya Nair (NovaTech Systems)',
      timestamp: 'Oct 26, 2026 • 02:45 PM',
      telemetry: 'Split-Pane Dossier Inspected • GitHub Verified',
      desc: 'Recruiter reviewed candidate React and PostgreSQL projects in the unified split-pane view, approving candidate for technical evaluation.',
    },
    {
      id: 2,
      name: 'Shortlisted',
      step: '3',
      icon: CheckCircle2,
      title: 'Shortlisted for Campus Drive Round',
      actor: 'Talent Acquisition Team',
      timestamp: 'Oct 28, 2026 • 11:30 AM',
      telemetry: 'Direct Calendar Sync • Slot Allocation',
      desc: 'Aarav Sharma was selected for the live technical interview round among the top 15% qualified candidates in the batch.',
    },
    {
      id: 3,
      name: 'Interview Scheduled',
      step: '4',
      icon: Calendar,
      title: 'Technical Evaluation Round Confirmed',
      actor: 'Automated Interview Dispatch',
      timestamp: 'Nov 02, 2026 • 02:00 PM',
      telemetry: 'Google Meet Dispatched • Student Dashboard Alerted',
      desc: 'Virtual technical panel scheduled with NovaTech Senior Engineering Leads. Video room link dispatched directly to student dashboard.',
    },
    {
      id: 4,
      name: 'Official Offer',
      step: '5',
      icon: Award,
      title: 'Full-Time Offer Letter Extended',
      actor: 'NovaTech HR & Placement Cell',
      timestamp: 'Nov 05, 2026 • 05:00 PM',
      telemetry: '₹18.0 LPA Package • Letter Cryptographically Signed',
      desc: 'Student accepted full-time Software Engineer Trainee position. University placement statistics and accreditation records updated in real time.',
    },
  ];

  const cur = stages[selectedStage];
  const Icon = cur.icon;

  return (
    <section id="journey" className="w-full bg-[#060B12] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Every milestone. Beautifully clear.
          </h2>
          <p className="text-base text-slate-300">
            Follow an application traversing an immutable recruitment state machine from first click to official offer.
          </p>
        </div>

        {/* Continuous Segmented Journey Scrub Rail */}
        <div className="bg-[#0B111B] rounded-2xl p-2 sm:p-3 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {stages.map((st, idx) => {
              const StIcon = st.icon;
              const isSelected = selectedStage === idx;
              const isPassed = selectedStage >= idx;

              return (
                <button
                  key={st.id}
                  onClick={() => setSelectedStage(idx)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl transition-all duration-200 active:scale-[0.98] text-left ${
                    isSelected
                      ? 'bg-[#0F766E] text-white border border-[#72F4D1]/40'
                      : 'hover:bg-white/5 border border-transparent text-slate-400'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      isSelected
                        ? 'bg-white/20 text-[#72F4D1]'
                        : isPassed
                        ? 'bg-white/10 text-teal-300'
                        : 'bg-white/5 text-slate-500'
                    }`}
                  >
                    <StIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold block truncate text-white">
                      {st.name}
                    </span>
                    <span className="text-sm text-slate-300 block">
                      Stage {st.step}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Milestone Detail Dossier */}
        <div data-ui="journey-milestones" className="bg-[#0B111B] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/10 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-[#72F4D1]/30 flex items-center justify-center text-[#72F4D1]">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-teal-300 block">
                  Audit trail milestone
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  {cur.title}
                </h3>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-sm text-slate-400 font-medium block">{cur.timestamp}</span>
              <span className="text-sm text-[#72F4D1] font-semibold block">{cur.actor}</span>
            </div>
          </div>

          <p className="text-base text-slate-300 leading-relaxed">
            {cur.desc}
          </p>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-medium">{cur.telemetry}</span>
            </div>
            <span>Status: Guaranteed Audit Record</span>
          </div>
        </div>
      </div>
    </section>
  );
};
