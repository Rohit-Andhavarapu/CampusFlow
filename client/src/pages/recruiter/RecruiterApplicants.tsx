import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Calendar,
  ExternalLink,
  ChevronDown,
  FileText,
  UserCheck,
  Video,
  Award,
  X,
  Clock,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { formatDate, getStatusBadgeStyle } from '../../utils/formatters';
import { Application, ApplicationStatus } from '../../types';
import { CandidateCompare } from '../../components/recruiter/CandidateCompare';
import { Scale } from 'lucide-react';

export const RecruiterApplicants: React.FC = () => {
  const {
    applications,
    jobs,
    shortlistApplication,
    rejectApplication,
    markSelected,
    scheduleInterview,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Split-pane selected applicant ID (defaults to first applicant if available)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    applications.length > 0 ? applications[0].id : null
  );

  // Interview scheduling state for active candidate
  const [interviewDate, setInterviewDate] = useState('2026-11-04T10:00');
  const [interviewMode, setInterviewMode] = useState<'Virtual' | 'In-Person'>('Virtual');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/nov-atec-hrec');
  const [interviewRound, setInterviewRound] = useState('Round 1: Technical & Architecture');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const filteredApplicants = useMemo(() => {
    return applications.filter((app) => {
      if (selectedJobId !== 'all' && app.jobId !== selectedJobId) return false;
      if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = app.studentName.toLowerCase().includes(q);
        const matchesBranch = app.studentBranch.toLowerCase().includes(q);
        const matchesSkills = app.studentSkills.some((s) => s.toLowerCase().includes(q));
        const matchesRole = app.jobTitle.toLowerCase().includes(q);
        if (!matchesName && !matchesBranch && !matchesSkills && !matchesRole) return false;
      }

      return true;
    });
  }, [applications, selectedJobId, selectedStatus, searchQuery]);

  const selectedApp = useMemo(() => {
    return applications.find((a) => a.id === selectedAppId) || (filteredApplicants.length > 0 ? filteredApplicants[0] : null);
  }, [applications, selectedAppId, filteredApplicants]);

  const handleConfirmSchedule = () => {
    if (!selectedApp) return;
    scheduleInterview(selectedApp.id, {
      dateTime: interviewDate,
      mode: interviewMode,
      locationOrLink: interviewLink,
      round: interviewRound,
      notes: interviewNotes,
    });
    setIsSchedulingOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Editorial Header */}
      <div className="border-b border-slate-200/80 pb-5 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Applicant Evaluation Table
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Review student credentials, inspect verified resumes, and advance candidates through recruitment stages.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-600 bg-white border border-slate-200/90 px-3 py-1.5 rounded-lg shadow-2xs self-start md:self-auto">
          <span>Total Pool: <strong className="text-slate-900 font-bold">{applications.length}</strong></span>
          <span className="text-slate-300">•</span>
          <span>Filtered: <strong className="text-slate-900 font-bold">{filteredApplicants.length}</strong></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="w-full md:flex-1 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, university roll number, or technical competency..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus-ring-refined"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus-ring-refined cursor-pointer"
          >
            <option value="all">Role: All Postings</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus-ring-refined cursor-pointer"
          >
            <option value="all">Status: All Stages</option>
            <option value="Submitted">Submitted</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected / Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Ashby-Style 2-Pane ATS Workspace (Master Table + Docked Candidate Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Candidate Queue Table (Takes 7 cols when inspector is open) */}
        <div className={selectedApp ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold tracking-wide">
                  <tr>
                    <th className="py-3 px-3 w-8 text-center" title="Compare selection">
                      <Scale className="w-3.5 h-3.5 text-slate-400 mx-auto" />
                    </th>
                    <th className="py-3 px-3.5">Candidate</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Branch & CGPA</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplicants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No candidates match the specified filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApplicants.map((app) => {
                      const isSelected = selectedApp?.id === app.id;
                      const badgeStyle = getStatusBadgeStyle(app.status);

                      return (
                        <tr
                          key={app.id}
                          onClick={() => setSelectedAppId(app.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-teal-50/70 hover:bg-teal-50'
                              : 'hover:bg-slate-50/70'
                          }`}
                        >
                          {/* Checkbox for Compare */}
                          <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={compareList.includes(app.id)}
                              onChange={() => {
                                if (compareList.includes(app.id)) {
                                  setCompareList((prev) => prev.filter((id) => id !== app.id));
                                } else {
                                  if (compareList.length >= 3) {
                                    showToast('warning', 'Maximum Reached', 'You can compare at most 3 candidates simultaneously.');
                                    return;
                                  }
                                  setCompareList((prev) => [...prev, app.id]);
                                }
                              }}
                              className="rounded border-slate-300 text-teal-700 focus:ring-teal-700 h-4 w-4 cursor-pointer accent-teal-700"
                            />
                          </td>

                          {/* Candidate Identity (2-line stacked) */}
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center flex-shrink-0 text-xs border ${
                                isSelected ? 'bg-teal-700 text-white border-teal-800' : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                {app.studentName.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 leading-tight truncate">{app.studentName}</p>
                                <p className="text-[10px] font-mono text-slate-400 leading-tight mt-0.5 truncate">
                                  {app.studentRollNo}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Target Role */}
                          <td className="py-3 px-3 font-medium text-slate-800 truncate max-w-[130px]">
                            {app.jobTitle}
                          </td>

                          {/* Branch & CGPA */}
                          <td className="py-3 px-3">
                            <p className="text-slate-600 truncate">{app.studentBranch.split(' ')[0]}</p>
                            <p className="text-[11px] font-mono font-bold text-teal-800 tabular-nums">
                              {app.studentCgpa} CGPA
                            </p>
                          </td>

                          {/* Status Pill */}
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                              {app.status}
                            </span>
                          </td>

                          {/* Quick Actions */}
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                              {app.status === 'Submitted' && (
                                <button
                                  onClick={() => shortlistApplication(app.id)}
                                  className="text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 px-2 py-1 rounded transition-colors"
                                >
                                  Shortlist
                                </button>
                              )}

                              {app.status === 'Shortlisted' && (
                                <button
                                  onClick={() => {
                                    setSelectedAppId(app.id);
                                    setIsSchedulingOpen(true);
                                  }}
                                  className="text-[11px] font-semibold text-white bg-amber-600 hover:bg-amber-700 px-2 py-1 rounded transition-colors flex items-center gap-1"
                                >
                                  <Calendar className="w-3 h-3" />
                                  Schedule
                                </button>
                              )}

                              {app.status === 'Interview' && (
                                <button
                                  onClick={() => markSelected(app.id)}
                                  className="text-[11px] font-semibold text-white bg-emerald-700 hover:bg-emerald-800 px-2 py-1 rounded transition-colors flex items-center gap-1"
                                >
                                  <Award className="w-3 h-3" />
                                  Offer
                                </button>
                              )}

                              <button
                                onClick={() => setSelectedAppId(app.id)}
                                className="text-[11px] font-medium text-slate-500 hover:text-slate-900 p-1 rounded hover:bg-slate-100"
                                title="Inspect candidate dossier"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Pane: Docked Evaluation Inspector (Ashby-Style Split-Pane) */}
        {selectedApp && (
          <div className="lg:col-span-5 rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-5 lg:sticky lg:top-4">
            {/* Dossier Header */}
            <div className="flex items-start justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {selectedApp.studentName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {selectedApp.studentName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {selectedApp.studentRollNo} • {selectedApp.studentBranch}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadgeStyle(selectedApp.status).bg} ${getStatusBadgeStyle(selectedApp.status).text} ${getStatusBadgeStyle(selectedApp.status).border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${getStatusBadgeStyle(selectedApp.status).dot}`} />
                  {selectedApp.status}
                </span>
                <button
                  onClick={() => setSelectedAppId(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  title="Close inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Academic Credentials Telemetry Card */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200/90 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Academic CGPA</span>
                <p className="text-base font-extrabold text-slate-900 mt-0.5 tabular-nums">
                  {selectedApp.studentCgpa} <span className="text-xs font-normal text-slate-400">/ 10.0</span>
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Applied Position</span>
                <p className="font-bold text-slate-900 mt-0.5 truncate">{selectedApp.jobTitle}</p>
              </div>
            </div>

            {/* Verified Skills */}
            <div>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono mb-2">
                Verified Technical Competencies
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.studentSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Master Placement Resume Document */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Verified Master Resume</p>
                  <p className="text-[10px] text-slate-500">Official university placement credentials</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => showToast('info', 'Resume Preview', `Viewing verified PDF for ${selectedApp.studentName}`)}
              >
                Inspect PDF
              </Button>
            </div>

            {/* Stage Advancement & Inline Interview Scheduling */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Recruitment Workflow Actions
              </p>

              {/* Action 1: Submitted -> Shortlist */}
              {selectedApp.status === 'Submitted' && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => shortlistApplication(selectedApp.id)}
                  >
                    Shortlist Candidate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 text-xs"
                    onClick={() => rejectApplication(selectedApp.id)}
                  >
                    Reject
                  </Button>
                </div>
              )}

              {/* Action 2: Shortlisted -> Inline Scheduling */}
              {selectedApp.status === 'Shortlisted' && (
                <div className="space-y-3">
                  {!isSchedulingOpen ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Calendar className="w-3.5 h-3.5" />}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 border-amber-700"
                        onClick={() => setIsSchedulingOpen(true)}
                      >
                        Schedule Interview Round
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 text-xs"
                        onClick={() => rejectApplication(selectedApp.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900">Configure Interview Slot</span>
                        <button
                          onClick={() => setIsSchedulingOpen(false)}
                          className="text-amber-700 hover:text-amber-950"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                          Round Title
                        </label>
                        <input
                          type="text"
                          value={interviewRound}
                          onChange={(e) => setInterviewRound(e.target.value)}
                          className="w-full bg-white text-xs border border-slate-200 rounded p-1.5"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                            Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            value={interviewDate}
                            onChange={(e) => setInterviewDate(e.target.value)}
                            className="w-full bg-white text-xs border border-slate-200 rounded p-1.5"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                            Format
                          </label>
                          <select
                            value={interviewMode}
                            onChange={(e) => setInterviewMode(e.target.value as any)}
                            className="w-full bg-white text-xs border border-slate-200 rounded p-1.5"
                          >
                            <option value="Virtual">Virtual (Google Meet)</option>
                            <option value="In-Person">In-Person (T&P)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                          Google Meet Link
                        </label>
                        <input
                          type="text"
                          value={interviewLink}
                          onChange={(e) => setInterviewLink(e.target.value)}
                          className="w-full bg-white text-xs border border-slate-200 rounded p-1.5"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full bg-amber-600 hover:bg-amber-700 border-amber-700 font-semibold"
                          onClick={handleConfirmSchedule}
                        >
                          Confirm & Notify Student
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action 3: Interview -> Extend Offer */}
              {selectedApp.status === 'Interview' && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    leftIcon={<Award className="w-3.5 h-3.5" />}
                    className="flex-1"
                    onClick={() => markSelected(selectedApp.id)}
                  >
                    Extend Formal Campus Offer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 text-xs"
                    onClick={() => rejectApplication(selectedApp.id)}
                  >
                    Reject
                  </Button>
                </div>
              )}

              {/* Action 4: Selected */}
              {selectedApp.status === 'Selected' && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Official campus offer extended. Pending student acceptance.</span>
                </div>
              )}

              {/* Action 5: Rejected */}
              {selectedApp.status === 'Rejected' && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>Candidate not advanced for this vacancy.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Compare Action Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-4 border border-stone-800 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-semibold">
              {compareList.length} candidate{compareList.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Compare Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCompareList([])}
            className="text-stone-400 hover:text-white text-xs transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Candidate Compare Modal */}
      <CandidateCompare
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        applicants={applications.filter((a) => compareList.includes(a.id))}
        onRemove={(id) => setCompareList((prev) => prev.filter((cId) => cId !== id))}
        onShortlist={shortlistApplication}
        onReject={rejectApplication}
        onScheduleInterview={(app) => {
          setSelectedAppId(app.id);
          setIsSchedulingOpen(true);
          setIsCompareModalOpen(false);
        }}
        onMarkSelected={markSelected}
      />
    </div>
  );
};
