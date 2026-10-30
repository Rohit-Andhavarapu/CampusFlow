import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Sliders, ArrowRight, Building, Award } from 'lucide-react';

interface CompanyRule {
  id: string;
  name: string;
  role: string;
  packageLPA: string;
  minCgpa: number;
  maxBacklogs: number;
  allowedBranches: string[];
}

const COMPANIES: CompanyRule[] = [
  {
    id: 'novatech',
    name: 'NovaTech Systems',
    role: 'Software Engineer Trainee',
    packageLPA: '₹18.0 LPA',
    minCgpa: 8.0,
    maxBacklogs: 0,
    allowedBranches: ['CSE', 'IT', 'ECE'],
  },
  {
    id: 'cloudscale',
    name: 'CloudScale Systems',
    role: 'Platform & Infrastructure Engineer',
    packageLPA: '₹16.5 LPA',
    minCgpa: 7.5,
    maxBacklogs: 0,
    allowedBranches: ['CSE', 'IT'],
  },
  {
    id: 'apex',
    name: 'Apex Global Labs',
    role: 'Distributed Systems Associate',
    packageLPA: '₹14.0 LPA',
    minCgpa: 7.0,
    maxBacklogs: 1,
    allowedBranches: ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL'],
  },
  {
    id: 'quantum',
    name: 'QuantumEdge Dynamics',
    role: 'Systems & Embedded Engineer',
    packageLPA: '₹19.5 LPA',
    minCgpa: 8.25,
    maxBacklogs: 0,
    allowedBranches: ['CSE', 'ECE'],
  },
];

export const EditorialCutoffSandbox: React.FC = () => {
  const [cgpa, setCgpa] = useState<number>(8.85);
  const [backlogs, setBacklogs] = useState<number>(0);
  const [branch, setBranch] = useState<string>('CSE');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('novatech');

  const selectedCompany = COMPANIES.find((c) => c.id === selectedCompanyId) || COMPANIES[0];

  const cgpaPass = cgpa >= selectedCompany.minCgpa;
  const backlogPass = backlogs <= selectedCompany.maxBacklogs;
  const branchPass = selectedCompany.allowedBranches.includes(branch);
  const isEligible = cgpaPass && backlogPass && branchPass;
  const delta = (cgpa - selectedCompany.minCgpa).toFixed(2);

  return (
    <section id="cutoff" className="py-20 md:py-32 bg-[#FAF8F5] border-t linen-rule">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 md:mb-18">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#14432A] py-1 px-3.5 rounded-full bg-[#14432A]/8 border border-[#14432A]/15">
            <Sliders className="w-3.5 h-3.5 text-[#14432A]" />
            <span>Interactive Cutoff Sandbox</span>
          </div>

          <h2 className="font-serif-prestige text-3xl sm:text-5xl text-[#14432A] leading-tight font-semibold">
            Test candidate eligibility against <span className="italic font-normal">enterprise cutoffs.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
            Adjust your academic credentials and target company below to experience CampusFlow's explainable qualification engine in real-time.
          </p>
        </div>

        {/* The Diagnostic Engine Card */}
        <div className="max-w-5xl mx-auto bg-[#FFFDF9] parchment-border rounded-xl p-6 sm:p-10 shadow-folio">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Input Controls Column (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B7280] block pb-2 border-b linen-rule">
                Candidate Parameters
              </span>

              {/* Target Company Selector */}
              <div>
                <label className="text-xs font-semibold text-[#14432A] block mb-2">
                  Visiting Enterprise
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COMPANIES.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedCompanyId(comp.id)}
                      className={`p-3 rounded-lg text-left text-xs transition-all ${
                        selectedCompanyId === comp.id
                          ? 'bg-[#14432A] text-white shadow-sm'
                          : 'bg-[#FAF8F5] parchment-border text-[#4B5563] hover:bg-[#EFECE4]'
                      }`}
                    >
                      <span className="font-bold block">{comp.name}</span>
                      <span className="text-[11px] opacity-80 block mt-0.5">{comp.packageLPA}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CGPA Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#14432A]">Cumulative GPA</span>
                  <span className="font-serif-prestige text-xl font-bold text-[#14432A]">
                    {cgpa.toFixed(2)} <span className="text-xs font-sans text-[#6B7280]">/ 10.00</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.05"
                  value={cgpa}
                  onChange={(e) => setCgpa(parseFloat(e.target.value))}
                  className="w-full accent-[#14432A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#6B7280] mt-1">
                  <span>6.00</span>
                  <span>7.00</span>
                  <span>8.00 (Standard Cutoff)</span>
                  <span>9.00</span>
                  <span>10.00</span>
                </div>
              </div>

              {/* Active Backlogs Selector */}
              <div>
                <label className="text-xs font-semibold text-[#14432A] block mb-2">
                  Active Backlogs
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBacklogs(b)}
                      className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${
                        backlogs === b
                          ? 'bg-[#14432A] text-white'
                          : 'bg-[#FAF8F5] parchment-border text-[#4B5563] hover:bg-[#EFECE4]'
                      }`}
                    >
                      {b === 3 ? '3+' : b} Backlogs
                    </button>
                  ))}
                </div>
              </div>

              {/* Department Selector */}
              <div>
                <label className="text-xs font-semibold text-[#14432A] block mb-2">
                  Academic Department
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['CSE', 'IT', 'ECE', 'MECH', 'CIVIL'].map((dep) => (
                    <button
                      key={dep}
                      onClick={() => setBranch(dep)}
                      className={`py-2 rounded text-xs font-bold transition-colors ${
                        branch === dep
                          ? 'bg-[#14432A] text-white'
                          : 'bg-[#FAF8F5] parchment-border text-[#4B5563] hover:bg-[#EFECE4]'
                      }`}
                    >
                      {dep}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Diagnostic Evaluation Display (6 Cols) */}
            <div className="lg:col-span-6 bg-[#FAF8F5] parchment-border rounded-xl p-6 space-y-6 shadow-subsheet">
              
              <div className="flex items-center justify-between pb-3 border-b linen-rule">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                  Qualification Diagnostic
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isEligible
                      ? 'text-[#047857] bg-[#ECFDF5] border-[#A7F3D0]'
                      : 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]'
                  }`}
                >
                  {isEligible ? 'QUALIFIED TO APPLY' : 'CRITERIA NOT MET'}
                </span>
              </div>

              {/* Delta Banner */}
              <div className="p-4 bg-[#FFFDF9] parchment-border rounded-lg">
                <span className="text-[11px] text-[#6B7280] uppercase tracking-wider font-semibold block">
                  Cutoff Margin Analysis
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className={`font-serif-prestige text-3xl font-bold ${
                      isEligible ? 'text-[#047857]' : 'text-[#DC2626]'
                    }`}
                  >
                    {parseFloat(delta) >= 0 ? `+${delta}` : delta} CGPA
                  </span>
                  <span className="text-xs text-[#6B7280]">
                    relative to {selectedCompany.name}'s {selectedCompany.minCgpa.toFixed(2)} threshold
                  </span>
                </div>
              </div>

              {/* Requirement Checklist */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-white rounded border border-[#ECE8E0]">
                  <span className="font-medium text-[#4B5563]">
                    CGPA Requirement (Min: {selectedCompany.minCgpa.toFixed(2)})
                  </span>
                  <span className={cgpaPass ? 'font-bold text-[#047857]' : 'font-bold text-[#DC2626]'}>
                    {cgpaPass ? `Cleared (${cgpa.toFixed(2)}) ✓` : `Failed (${cgpa.toFixed(2)}) ✗`}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-white rounded border border-[#ECE8E0]">
                  <span className="font-medium text-[#4B5563]">
                    Backlog Limit (Max: {selectedCompany.maxBacklogs})
                  </span>
                  <span className={backlogPass ? 'font-bold text-[#047857]' : 'font-bold text-[#DC2626]'}>
                    {backlogPass ? `Cleared (${backlogs} Backlogs) ✓` : `Failed (${backlogs} Backlogs) ✗`}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-white rounded border border-[#ECE8E0]">
                  <span className="font-medium text-[#4B5563]">
                    Eligible Branches ({selectedCompany.allowedBranches.join(', ')})
                  </span>
                  <span className={branchPass ? 'font-bold text-[#047857]' : 'font-bold text-[#DC2626]'}>
                    {branchPass ? `Eligible (${branch}) ✓` : `Not Eligible (${branch}) ✗`}
                  </span>
                </div>
              </div>

              {/* Explanatory Conclusion */}
              <div className="pt-2 text-xs text-[#6B7280] leading-relaxed">
                {isEligible ? (
                  <p className="text-[#047857] font-medium">
                    ✓ You meet all specified qualification parameters for {selectedCompany.name}. In CampusFlow, this unlocks 1-click verified application dispatch with zero spreadsheet latency.
                  </p>
                ) : (
                  <p className="text-[#DC2626] font-medium">
                    ✗ One or more criteria are currently not cleared. CampusFlow guarantees 100% explainability so students understand exact requirements without silent rejections.
                  </p>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
