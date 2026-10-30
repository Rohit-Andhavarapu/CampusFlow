import React, { useState } from 'react';
import {
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Check,
  Info,
} from 'lucide-react';

export const LiveEligibilitySimulator: React.FC = () => {
  const [cgpa, setCgpa] = useState<number>(8.5);
  const [branch, setBranch] = useState<string>('CSE');
  const [backlogs, setBacklogs] = useState<number>(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'Node.js', 'PostgreSQL']);

  // Target Job Criteria: NovaTech Systems Software Engineer Trainee
  const targetMinCgpa = 8.0;
  const targetAllowedBranches = ['CSE', 'IT', 'AI&DS'];
  const targetMaxBacklogs = 0;
  const targetRequiredSkills = ['React', 'Node.js', 'Python', 'PostgreSQL'];

  // Instantaneous real-time rule calculation
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
    <section id="eligibility" className="w-full bg-[#080D15] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Know where you stand. Before you apply.
          </h2>
          <p className="text-base text-slate-300">
            Simulate how our eligibility algorithm evaluates candidates against genuine employer cutoffs.
          </p>
        </div>

        {/* Hypothetical vs Real Disclaimer Card */}
        <div className="mb-6 p-4 rounded-2xl bg-teal-950/40 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#72F4D1] flex-shrink-0 mt-0.5" />
          <div className="text-base leading-relaxed text-slate-300">
            <strong className="text-white block font-semibold">Hypothetical Simulation Mode</strong>
            Adjust the sliders below to explore cutoffs for <strong className="text-white">NovaTech Systems</strong>. In the real portal, authenticated students have their official university academic scores and backlog records automatically pre-verified.
          </div>
        </div>

        <div className="bg-[#0B111B] rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                NovaTech Systems • Software Engineer Trainee
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Employer Cutoffs: Minimum 8.00 CGPA • Allowed: CSE, IT, AI&DS • 0 Active Backlogs • $\ge$ 2 Core Skills
              </p>
            </div>

            {/* Dynamic Status Pill */}
            <div
              className={`px-5 py-3 rounded-2xl border text-center transition-all duration-300 ${
                isOverallEligible
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {isOverallEligible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <span className="text-sm font-extrabold tracking-wide">
                  {isOverallEligible ? 'Eligible to Apply' : 'Cutoff Not Satisfied'}
                </span>
              </div>
              <p className="text-sm opacity-80 mt-0.5">
                {isOverallEligible ? 'All criteria requirements satisfied' : 'One or more cutoffs not met'}
              </p>
            </div>
          </div>

          {/* Interactive Controls & Output Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8">
            {/* Controls Column */}
            <div className="md:col-span-6 space-y-6">
              {/* CGPA Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-300">
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
                <div className="flex justify-between text-sm text-slate-300 mt-1">
                  <span>5.00</span>
                  <span className="text-teal-300 font-semibold">Cutoff: 8.00</span>
                  <span>10.00</span>
                </div>
              </div>

              {/* Branch Selector */}
              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-2">
                  Academic Major
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {['CSE', 'IT', 'AI&DS', 'ECE', 'ME'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBranch(b)}
                      className={`py-2 px-2 rounded-xl text-sm font-semibold transition-all ${
                        branch === b
                          ? 'bg-[#0F766E] text-white border border-[#72F4D1]/40'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Backlogs Selector */}
              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-2">
                  Active Backlog Standing
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBacklogs(0)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                      backlogs === 0
                        ? 'bg-[#0F766E] text-white border border-[#72F4D1]/40'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    0 Backlogs (Cleared)
                  </button>
                  <button
                    onClick={() => setBacklogs(1)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                      backlogs > 0
                        ? 'bg-rose-900/60 text-white border border-rose-500/40'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    1+ Active Backlog
                  </button>
                </div>
              </div>

              {/* Technical Skills Checklist */}
              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-2">
                  Technical Skillset (Need $\ge$ 2 core)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'].map((s) => {
                    const isSelected = selectedSkills.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSkill(s)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                          isSelected
                            ? 'bg-white/15 text-white border border-[#72F4D1]/40 font-semibold'
                            : 'bg-white/5 text-slate-400 border border-white/5'
                        }`}
                      >
                        <span>{s}</span>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-[#72F4D1]" />
                        ) : (
                          <span className="text-slate-400 font-bold">+</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Verdict Breakdown Column */}
            <div data-ui="eligibility-simulator" className="md:col-span-6 bg-[#060B12] rounded-2xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-sm text-slate-300 font-semibold block">
                  Transparent Evaluation Breakdown
                </span>

                {/* CGPA Criterion */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div>
                    <p className="text-sm font-bold text-white">CGPA Requirement</p>
                    <p className="text-sm text-slate-300">
                      Cutoff: $\ge$ 8.00 • Candidate: {cgpa.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isCgpaPassed ? (
                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> PASSED
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> SHORT {(targetMinCgpa - cgpa).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Branch Criterion */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div>
                    <p className="text-sm font-bold text-white">Academic Major</p>
                    <p className="text-sm text-slate-300">
                      Allowed: CSE, IT, AI&DS • Selected: {branch}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isBranchPassed ? (
                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> ELIGIBLE
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> RESTRICTED
                      </span>
                    )}
                  </div>
                </div>

                {/* Backlog Criterion */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div>
                    <p className="text-sm font-bold text-white">Backlog Standing</p>
                    <p className="text-sm text-slate-300">Strict 0 Backlog Policy</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isBacklogsPassed ? (
                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> 0 ACTIVE
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> DISQUALIFIED
                      </span>
                    )}
                  </div>
                </div>

                {/* Skills Criterion */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div>
                    <p className="text-sm font-bold text-white">Core Skill Competencies</p>
                    <p className="text-sm text-slate-300">
                      {matchedSkills.length} of {targetRequiredSkills.length} core competencies selected
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isSkillsPassed ? (
                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> MATCHED
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> NEED 2+
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-sm text-slate-300 italic">
                  Deterministic qualification engine with 100% explainable algorithmic evaluation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
