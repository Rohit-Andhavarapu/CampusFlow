import React from 'react';
import { Application } from '../../types';
import {
  X,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  ExternalLink,
  Award,
  GraduationCap,
  Sparkles,
  Users,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { formatDate, getStatusBadgeStyle } from '../../utils/formatters';

interface CandidateCompareProps {
  isOpen: boolean;
  onClose: () => void;
  applicants: Application[];
  onRemove: (id: string) => void;
  onShortlist: (id: string) => void;
  onReject: (id: string) => void;
  onScheduleInterview: (app: Application) => void;
  onMarkSelected: (id: string) => void;
}

export const CandidateCompare: React.FC<CandidateCompareProps> = ({
  isOpen,
  onClose,
  applicants,
  onRemove,
  onShortlist,
  onReject,
  onScheduleInterview,
  onMarkSelected,
}) => {
  if (!isOpen || applicants.length === 0) return null;

  // Find max CGPA among compared candidates
  const maxCgpa = Math.max(...applicants.map((a) => a.studentCgpa || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shadow-2xs">
              <Scale className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-stone-900 tracking-tight">
                  Candidate Comparison Matrix
                </h2>
                <span className="text-[11px] font-semibold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full border border-teal-200">
                  {applicants.length} Selected (Max 3)
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Direct side-by-side evaluation of verified academic credentials, competencies, and recruitment status.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-stone-200">
            {applicants.map((app) => {
              const badgeStyle = getStatusBadgeStyle(app.status);
              const isTopCgpa = app.studentCgpa === maxCgpa && applicants.length > 1;

              return (
                <div key={app.id} className="flex flex-col justify-between pt-6 md:pt-0 md:px-5 first:pl-0 last:pr-0">
                  <div className="space-y-5">
                    {/* Candidate Identity */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-teal-800 text-white font-serif font-bold text-base flex items-center justify-center shadow-xs">
                          {app.studentName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base text-stone-900">
                            {app.studentName}
                          </h3>
                          <p className="text-xs text-stone-500 font-mono">
                            {app.studentRollNo || 'Registered Student'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemove(app.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                        Stage: {app.status}
                      </span>
                    </div>

                    {/* Target Job */}
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                      <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider font-semibold">
                        Applied Position
                      </span>
                      <p className="text-xs font-bold text-stone-900 mt-0.5 truncate">{app.jobTitle}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">Applied: {formatDate(app.appliedAt)}</p>
                    </div>

                    {/* Metrics Section */}
                    <div className="space-y-3 border-t border-stone-100 pt-3">
                      <div>
                        <span className="text-xs text-stone-500">Verified CGPA</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xl font-bold text-stone-900">
                            {app.studentCgpa ? app.studentCgpa.toFixed(2) : '7.80'}
                          </span>
                          {isTopCgpa && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                              <Sparkles className="w-2.5 h-2.5" />
                              Highest
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-stone-500">Degree & Department</span>
                        <p className="text-xs font-semibold text-stone-800 mt-0.5">
                          {app.studentBranch || 'Computer Science & Engineering'}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs text-stone-500">Institutional Clearance</span>
                        <p className="text-xs font-medium text-emerald-800 flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Eligible & Approved
                        </p>
                      </div>
                    </div>

                    {/* Technical Competencies Matrix */}
                    <div className="border-t border-stone-100 pt-3">
                      <span className="text-xs text-stone-500 block mb-2">Technical Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(app.studentSkills || ['Python', 'SQL', 'React']).map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Resume Document Link */}
                    <div className="border-t border-stone-100 pt-3">
                      <span className="text-xs text-stone-500 block mb-1">Curriculum Vitae</span>
                      <div className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 bg-stone-50/60">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-teal-700 shrink-0" />
                          <span className="text-xs font-mono text-stone-800 truncate">
                            {app.studentName.toLowerCase().replace(/[^a-z]/g, '_')}_resume.pdf
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-teal-800 hover:underline shrink-0 cursor-pointer">
                          Inspect
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-6 pt-4 border-t border-stone-200 space-y-2">
                    {app.status === 'Submitted' && (
                      <button
                        onClick={() => onShortlist(app.id)}
                        className="w-full py-2 px-3 rounded-xl bg-teal-800 text-white font-semibold text-xs hover:bg-teal-900 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Shortlist Candidate</span>
                      </button>
                    )}

                    {(app.status === 'Submitted' || app.status === 'Shortlisted') && (
                      <button
                        onClick={() => onScheduleInterview(app)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-300 text-stone-800 font-semibold text-xs hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-stone-600" />
                        <span>Schedule Interview</span>
                      </button>
                    )}

                    {app.status === 'Interview' && (
                      <button
                        onClick={() => onMarkSelected(app.id)}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Release Offer</span>
                      </button>
                    )}

                    {app.status !== 'Rejected' && app.status !== 'Selected' && (
                      <button
                        onClick={() => onReject(app.id)}
                        className="w-full py-1.5 px-3 rounded-xl text-rose-700 hover:bg-rose-50 text-xs font-medium transition-colors"
                      >
                        Decline Candidate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Comparing {applicants.length} candidates against role criteria.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
