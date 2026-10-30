import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { checkJobEligibility } from '../../utils/formatters';
import { StudentProfileData, JobPosting } from '../../types';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Briefcase,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Info,
  ShieldAlert,
} from 'lucide-react';

const COMMON_SKILLS = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Docker',
  'SQL',
  'Machine Learning',
  'AWS',
  'Java',
  'C++',
  'Go',
  'GraphQL',
  'Kubernetes',
  'Figma',
];

const BRANCHES = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Chemical Engineering',
];

export const EligibilityLab: React.FC = () => {
  const { studentProfile, jobs } = useApp();
  const navigate = useNavigate();

  // Hypothetical state initialized with student profile values
  const [hypoCgpa, setHypoCgpa] = useState<number>(studentProfile.cgpa || 7.5);
  const [hypoBranch, setHypoBranch] = useState<string>(studentProfile.branch || 'Computer Science & Engineering');
  const [hypoBacklogs, setHypoBacklogs] = useState<number>(studentProfile.backlogs || 0);
  const [hypoGradYear, setHypoGradYear] = useState<number>(studentProfile.graduationYear || 2026);
  const [hypoSkills, setHypoSkills] = useState<string[]>(
    studentProfile.skills && studentProfile.skills.length > 0 ? studentProfile.skills : ['Python', 'SQL', 'React']
  );

  // Reset to verified profile
  const resetToProfile = () => {
    setHypoCgpa(studentProfile.cgpa || 7.5);
    setHypoBranch(studentProfile.branch || 'Computer Science & Engineering');
    setHypoBacklogs(studentProfile.backlogs || 0);
    setHypoGradYear(studentProfile.graduationYear || 2026);
    setHypoSkills(studentProfile.skills || []);
  };

  const toggleSkill = (skill: string) => {
    setHypoSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Build synthetic profile for simulation
  const simulatedProfile: StudentProfileData = useMemo(() => {
    return {
      ...studentProfile,
      cgpa: hypoCgpa,
      branch: hypoBranch,
      backlogs: hypoBacklogs,
      graduationYear: hypoGradYear,
      skills: hypoSkills,
    };
  }, [studentProfile, hypoCgpa, hypoBranch, hypoBacklogs, hypoGradYear, hypoSkills]);

  // Active campus jobs
  const activeJobs = useMemo(() => jobs.filter((j) => j.status === 'active'), [jobs]);

  // Baseline evaluation with verified profile
  const baselineResults = useMemo(() => {
    const map = new Map<string, boolean>();
    activeJobs.forEach((job) => {
      const res = checkJobEligibility(job, studentProfile);
      map.set(job.id, res.isEligible);
    });
    return map;
  }, [activeJobs, studentProfile]);

  // Simulated evaluation with hypothetical profile
  const simulatedResults = useMemo(() => {
    return activeJobs.map((job) => {
      const simCheck = checkJobEligibility(job, simulatedProfile);
      const wasEligible = baselineResults.get(job.id) || false;
      const isNewlyUnlocked = !wasEligible && simCheck.isEligible;
      const isNewlyLocked = wasEligible && !simCheck.isEligible;

      return {
        job,
        check: simCheck,
        wasEligible,
        isNewlyUnlocked,
        isNewlyLocked,
      };
    });
  }, [activeJobs, simulatedProfile, baselineResults]);

  const totalEligible = simulatedResults.filter((r) => r.check.isEligible).length;
  const baselineEligibleCount = Array.from(baselineResults.values()).filter(Boolean).length;
  const delta = totalEligible - baselineEligibleCount;
  const unlockPercentage = activeJobs.length > 0 ? Math.round((totalEligible / activeJobs.length) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100/70 text-teal-900 border border-teal-200">
              <Sliders className="w-3.5 h-3.5 text-teal-700" />
              Recruitment Intelligence Sandbox
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            What-If Eligibility Lab
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Simulate how academic improvements, clearing backlogs, or acquiring high-demand skills expand your access to campus recruitment drives.
          </p>
        </div>

        <button
          onClick={resetToProfile}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:text-stone-900 hover:bg-stone-50 font-medium text-xs shadow-xs transition-all self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Official Profile</span>
        </button>
      </div>

      {/* Non-Mutating Disclaimer Notice */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-semibold text-amber-950">Hypothetical Simulation Mode:</strong> Adjusting controls here simulates placement outcomes across active campus drives. These parameters are strictly non-mutating and do not modify your verified student profile or alter server-side application eligibility.
        </div>
      </div>

      {/* Simulation Playground & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="font-serif text-lg font-semibold text-stone-900">Simulation Variables</h2>
            <span className="text-[11px] font-mono font-medium text-stone-400 uppercase tracking-wider">Parameters</span>
          </div>

          {/* CGPA Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Hypothetical CGPA
              </label>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-teal-800">{hypoCgpa.toFixed(2)}</span>
                <span className="text-xs text-stone-400">/ 10.00</span>
              </div>
            </div>
            <input
              type="range"
              min="5.0"
              max="10.0"
              step="0.05"
              value={hypoCgpa}
              onChange={(e) => setHypoCgpa(parseFloat(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-mono">
              <span>5.00</span>
              <span>6.50 (First Class)</span>
              <span>7.50 (Distinction)</span>
              <span>10.00</span>
            </div>
          </div>

          {/* Branch Select */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Academic Department
            </label>
            <select
              value={hypoBranch}
              onChange={(e) => setHypoBranch(e.target.value)}
              className="w-full text-xs font-medium rounded-xl border-stone-300 bg-stone-50/50 p-2.5 focus:border-teal-600 focus:ring-teal-600 shadow-2xs"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Standing Backlogs Counter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Active Standing Backlogs
              </label>
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${hypoBacklogs === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {hypoBacklogs === 0 ? 'Clean Record (0)' : `${hypoBacklogs} Backlog${hypoBacklogs > 1 ? 's' : ''}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setHypoBacklogs(num)}
                  className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                    hypoBacklogs === num
                      ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Graduation Batch */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Graduation Year
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[2025, 2026, 2027].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setHypoGradYear(yr)}
                  className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                    hypoGradYear === yr
                      ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Class of {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Technical Skills ({hypoSkills.length} selected)
              </label>
              <span className="text-[11px] text-stone-400">Click to toggle</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 border border-stone-100 rounded-xl">
              {COMMON_SKILLS.map((sk) => {
                const isSelected = hypoSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-50 text-teal-900 border-teal-300 font-semibold'
                        : 'bg-stone-50/60 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {sk}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results & Delta Matrix Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Scoreboard */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
                  Simulated Eligibility
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold text-stone-900">
                    {totalEligible}
                  </span>
                  <span className="text-sm font-medium text-stone-500">
                    of {activeJobs.length} active roles
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-3">
                  <div
                    className="bg-teal-700 h-full rounded-full transition-all duration-500"
                    style={{ width: `${unlockPercentage}%` }}
                  />
                </div>
              </div>

              <div className="border-y sm:border-y-0 sm:border-x border-stone-100 py-4 sm:py-0 sm:px-6">
                <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
                  Placement Delta
                </p>
                <div className="flex items-center gap-2">
                  {delta > 0 ? (
                    <span className="inline-flex items-center gap-1 text-base font-bold text-emerald-700">
                      <TrendingUp className="w-4 h-4" />
                      +{delta} Unlocked
                    </span>
                  ) : delta < 0 ? (
                    <span className="inline-flex items-center gap-1 text-base font-bold text-rose-700">
                      {delta} Locked
                    </span>
                  ) : (
                    <span className="text-base font-bold text-stone-600">No Change (0)</span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  vs {baselineEligibleCount} roles on verified records
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
                  Qualification Rate
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-bold text-teal-800">
                    {unlockPercentage}%
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Market accessibility index
                </p>
              </div>
            </div>
          </div>

          {/* Job-by-Job Breakdown Matrix */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Drive-by-Drive Qualification Matrix
              </h3>
              <span className="text-xs text-stone-500">
                {simulatedResults.length} campus opportunities
              </span>
            </div>

            {simulatedResults.map(({ job, check, wasEligible, isNewlyUnlocked, isNewlyLocked }) => {
              const cgpaPass = hypoCgpa >= job.minCgpa;
              const branchPass =
                job.eligibleBranches.length === 0 ||
                job.eligibleBranches.includes(hypoBranch) ||
                job.eligibleBranches.includes('All Branches');
              const backlogsPass = hypoBacklogs === 0;
              const gradPass =
                job.eligibleGraduationYears.length === 0 ||
                job.eligibleGraduationYears.includes(hypoGradYear);
              const matchedSkills = job.skillsRequired.filter((s) => hypoSkills.includes(s));

              return (
                <div
                  key={job.id}
                  className={`p-5 rounded-2xl border transition-all duration-200 ${
                    check.isEligible
                      ? isNewlyUnlocked
                        ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200'
                        : 'bg-white border-stone-200/90 shadow-xs'
                      : isNewlyLocked
                      ? 'bg-rose-50/40 border-rose-300'
                      : 'bg-stone-50/60 border-stone-200/70 opacity-90'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center font-serif font-bold text-stone-800">
                        {job.companyName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-stone-900 text-sm">{job.title}</h4>
                          {isNewlyUnlocked && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <Sparkles className="w-2.5 h-2.5" />
                              Unlocked
                            </span>
                          )}
                          {isNewlyLocked && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                              Locked
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500">
                          {job.companyName} • {job.location} ({job.workMode}) • {job.stipendOrSalary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          check.isEligible
                            ? 'bg-emerald-100/80 text-emerald-900 border-emerald-200'
                            : 'bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        {check.isEligible ? 'Eligible to Apply' : 'Criteria Gap'}
                      </span>
                      <button
                        onClick={() => navigate(`/student/opportunities/${job.id}`)}
                        className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                        title="View Opportunity"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Criteria Checklist Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-stone-100 text-xs">
                    <div className="flex items-center gap-1.5">
                      {cgpaPass ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )}
                      <span className={cgpaPass ? 'text-stone-700' : 'text-rose-700 font-medium'}>
                        Min {job.minCgpa} CGPA ({hypoCgpa.toFixed(2)})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {branchPass ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )}
                      <span className={branchPass ? 'text-stone-700 truncate' : 'text-rose-700 font-medium truncate'}>
                        Branch Match
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {backlogsPass ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )}
                      <span className={backlogsPass ? 'text-stone-700' : 'text-rose-700 font-medium'}>
                        0 Backlogs
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {gradPass ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )}
                      <span className={gradPass ? 'text-stone-700' : 'text-rose-700 font-medium'}>
                        Batch {hypoGradYear}
                      </span>
                    </div>
                  </div>

                  {/* Skills Tag Overlap */}
                  {job.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-stone-100/60 text-[11px]">
                      <span className="text-stone-400 font-medium">Stack overlap:</span>
                      {job.skillsRequired.map((s) => {
                        const hasSkill = hypoSkills.includes(s);
                        return (
                          <span
                            key={s}
                            className={`px-2 py-0.5 rounded-md font-mono ${
                              hasSkill
                                ? 'bg-teal-50 text-teal-800 border border-teal-200 font-semibold'
                                : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {s}
                          </span>
                        );
                      })}
                      <span className="text-stone-400 text-[10px] ml-auto">
                        {matchedSkills.length}/{job.skillsRequired.length} matched
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
