import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, SlidersHorizontal, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export const EligibilitySandbox: React.FC = () => {
  const [cgpa, setCgpa] = useState<number>(8.5);
  const [branch, setBranch] = useState<string>('CSE');
  const [backlogs, setBacklogs] = useState<number>(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'Node.js', 'PostgreSQL']);

  // NovaTech Criteria
  const targetMinCgpa = 8.0;
  const targetAllowedBranches = ['CSE', 'IT', 'AI&DS'];
  const targetMaxBacklogs = 0;
  const targetRequiredSkills = ['React', 'Node.js', 'Python', 'PostgreSQL'];

  // Real-time evaluation logic
  const isCgpaPassed = cgpa >= targetMinCgpa;
  const isBranchPassed = targetAllowedBranches.includes(branch);
  const isBacklogsPassed = backlogs <= targetMaxBacklogs;
  const matchedSkills = selectedSkills.filter((s) => targetRequiredSkills.includes(s));
  const isSkillsPassed = matchedSkills.length >= 2;

  const isOverallEligible = isCgpaPassed && isBranchPassed && isBacklogsPassed && isSkillsPassed;

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div data-ui="eligibility-sandbox" className="w-full max-w-5xl mx-auto bg-[#0B111B] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-[#72F4D1] bg-[#72F4D1]/10 border border-[#72F4D1]/30">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Interactive Eligibility Sandbox
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mt-2">
              Simulate the Eligibility Algorithm Live
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Target Job: <strong className="text-white">NovaTech Systems • Software Engineer Trainee</strong> (Cutoff: 8.00 CGPA, CSE/IT/AI, 0 Backlogs)
            </p>
          </div>

          {/* Dynamic Status Pill */}
          <div className={`px-5 py-3 rounded-2xl border text-center transition-all duration-300 ${
            isOverallEligible
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-950/50'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-950/50'
          }`}>
            <div className="flex items-center justify-center gap-2">
              {isOverallEligible ? <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" /> : <XCircle className="w-5 h-5 text-rose-400" />}
              <span className="text-sm font-extrabold tracking-wide uppercase font-sans">
                {isOverallEligible ? 'Eligible to Apply' : 'Ineligible for Job'}
              </span>
            </div>
            <p className="text-xs opacity-80 mt-0.5">
              {isOverallEligible ? 'All criteria requirements satisfied' : 'One or more cutoffs not met'}
            </p>
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8">
        {/* Controls Column */}
        <div className="md:col-span-6 space-y-6">
          {/* CGPA Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-sans">
                Student CGPA Score
              </label>
              <span className="text-sm font-bold text-[#72F4D1] bg-white/5 px-2.5 py-0.5 rounded border border-white/10">
                {cgpa.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="5.0"
              max="10.0"
              step="0.05"
              value={cgpa}
              onChange={(e) => setCgpa(parseFloat(e.target.value))}
              className="w-full accent-[#72F4D1] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 font-sans mt-1">
              <span>5.00</span>
              <span className="text-teal-300 font-semibold">Cutoff: 8.00</span>
              <span>10.00</span>
            </div>
          </div>

          {/* Branch Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-sans block mb-2">
              Engineering Branch
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {['CSE', 'IT', 'AI&DS', 'ECE', 'ME'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBranch(b)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    branch === b
                      ? 'bg-[#0F766E] text-white border border-[#72F4D1]/40 shadow-md'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Active Backlogs Toggle */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-sans block mb-2">
              Active Backlogs
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setBacklogs(0)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  backlogs === 0
                    ? 'bg-[#0F766E] text-white border border-[#72F4D1]/40 shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                0 Active Backlogs (Cleared)
              </button>
              <button
                onClick={() => setBacklogs(1)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  backlogs > 0
                    ? 'bg-rose-900/60 text-white border border-rose-500/40 shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                1+ Active Backlog
              </button>
            </div>
          </div>

          {/* Skills Checklist */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-sans block mb-2">
              Technical Skillset (Need &gt;= 2 core)
            </label>
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'].map((s) => {
                const isSelected = selectedSkills.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSkill(s)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-white/15 text-white border border-[#72F4D1]/30 font-semibold'
                        : 'bg-white/5 text-slate-400 border border-white/5'
                    }`}
                  >
                    <span>{s}</span>
                    {isSelected ? (
                      <Check className="w-3 h-3 text-[#72F4D1]" />
                    ) : (
                      <span className="text-slate-500 font-bold">+</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Criteria Breakdown Column */}
        <div className="md:col-span-6 bg-[#060B12] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-inner">
          <div className="space-y-4">
            <span className="text-xs font-sans uppercase tracking-wider text-slate-400 font-bold block">
              Transparent Evaluation Breakdown
            </span>

            {/* CGPA Criterion */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div>
                <p className="text-xs font-bold text-white">CGPA Requirement</p>
                <p className="text-[11px] text-slate-400">Cutoff: &ge; 8.00 • Candidate: {cgpa.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {isCgpaPassed ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> PASSED
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> SHORT {(targetMinCgpa - cgpa).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Branch Criterion */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div>
                <p className="text-xs font-bold text-white">Academic Discipline</p>
                <p className="text-[11px] text-slate-400">Allowed: CSE, IT, AI&amp;DS • Selected: {branch}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {isBranchPassed ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> ELIGIBLE
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> RESTRICTED
                  </span>
                )}
              </div>
            </div>

            {/* Backlogs Criterion */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div>
                <p className="text-xs font-bold text-white">Backlog Standing</p>
                <p className="text-[11px] text-slate-400">Strict 0 Backlog Policy</p>
              </div>
              <div className="flex items-center gap-1.5">
                {isBacklogsPassed ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> 0 ACTIVE
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> DISQUALIFIED
                  </span>
                )}
              </div>
            </div>

            {/* Skills Match Criterion */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div>
                <p className="text-xs font-bold text-white">Core Skill Match</p>
                <p className="text-[11px] text-slate-400">{matchedSkills.length} of {targetRequiredSkills.length} core competencies present</p>
              </div>
              <div className="flex items-center gap-1.5">
                {isSkillsPassed ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> MATCHED
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> NEED 2+
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-400 italic">
              Powered by PostgreSQL RPC <code className="text-[#72F4D1] font-mono">evaluate_job_eligibility()</code> with explainable rule evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
