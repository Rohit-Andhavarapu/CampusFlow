import React, { useState } from 'react';
import { CheckCircle2, Clock, Calendar, Award, XCircle, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';

export const ApplicationJourneyTimeline: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number>(2); // Default to Interview stage

  const stages = [
    {
      id: 0,
      name: 'Submitted',
      statusKey: 'submitted',
      icon: Clock,
      color: '#59D9FF',
      title: 'Application Received & Validated',
      timestamp: 'Oct 25, 2026 • 09:30 AM',
      author: 'Aarav Sharma (Student)',
      desc: 'Candidate academic credentials cryptographically verified against employer criteria. Profile entered into company screening queue.',
      telemetry: 'Status: submitted • CGPA Verified: 8.85 • Backlogs: 0',
    },
    {
      id: 1,
      name: 'Shortlisted',
      statusKey: 'shortlisted',
      icon: UserCheck,
      color: '#72F4D1',
      title: 'Advanced by Recruitment Panel',
      timestamp: 'Oct 27, 2026 • 02:15 PM',
      author: 'Priya Nair (Senior Technical Recruiter)',
      desc: 'Candidate portfolio, distributed systems projects, and competitive programming profile evaluated. Approved for technical round.',
      telemetry: 'Transition: submitted -> shortlisted • Audit ID: aud_7102',
    },
    {
      id: 2,
      name: 'Interview Scheduled',
      statusKey: 'interview',
      icon: Calendar,
      color: '#72F4D1',
      title: 'Technical Round 1: Systems Design',
      timestamp: 'Nov 02, 2026 • 02:00 PM',
      author: 'Evaluation Panel • Google Meet',
      desc: '45-minute live architecture and microservices evaluation with senior engineering leads. Candidate received calendar invite with meeting link.',
      telemetry: 'Mode: Virtual • URL: https://meet.google.com/nova-live-eval',
    },
    {
      id: 3,
      name: 'Selected & Offered',
      statusKey: 'selected',
      icon: Award,
      color: '#10B981',
      title: 'Official Full-Time Offer Extended',
      timestamp: 'Nov 05, 2026 • 05:00 PM',
      author: 'Talent Acquisition Director',
      desc: 'Candidate successfully passed technical and leadership rounds. Formal offer letter extended: ₹14.0 - ₹18.0 LPA with full benefits.',
      telemetry: 'Outcome: selected • Institutional Placement Counter Incremented',
    },
  ];

  const currentStageData = stages[selectedStage];

  return (
    <div data-ui="journey-timeline" className="w-full max-w-5xl mx-auto bg-[#0B111B] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Interactive Timeline Stepper Rail */}
      <div className="relative mb-8 p-1.5 rounded-2xl bg-[#060B12] border border-white/10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = selectedStage === idx;
            const isCompleted = idx <= selectedStage;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(idx)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 text-left ${
                  isSelected
                    ? 'bg-[#0F766E]/40 border border-[#72F4D1]/40 text-white'
                    : 'hover:bg-white/5 border border-transparent text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-[#0F766E] text-[#72F4D1] ' + (isSelected ? 'animate-pulse' : '')
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Icon className="w-3.5 h-3.5 text-[#72F4D1]" /> : `0${idx + 1}`}
                </div>
                <div className="min-w-0">
                  <span className={`text-xs sm:text-sm font-bold block truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {stage.name}
                  </span>
                  <span className="text-xs font-medium text-slate-400 block">Stage 0{idx + 1}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Dossier */}
      <div className="bg-[#060B12] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#72F4D1] block">
              Audit Trail Record
            </span>
            <h4 className="text-xl font-extrabold text-white mt-1">{currentStageData.title}</h4>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 font-medium block">{currentStageData.timestamp}</span>
            <span className="text-[11px] text-[#59D9FF] font-medium block">Author: {currentStageData.author}</span>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed py-5">
          {currentStageData.desc}
        </p>

        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px]">{currentStageData.telemetry}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>Alternate Branch: Withdrawn (Student Retracted)</span>
            <span>•</span>
            <span>Archived (Cycle Complete)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
