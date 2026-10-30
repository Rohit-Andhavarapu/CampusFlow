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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { formatDate, getStatusBadgeStyle } from '../../utils/formatters';
import { Application, ApplicationStatus } from '../../types';

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

  // Modals
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);

  // Interview scheduling form state
  const [interviewDate, setInterviewDate] = useState('2026-11-04T10:00');
  const [interviewMode, setInterviewMode] = useState<'Virtual' | 'In-Person'>('Virtual');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/nov-atec-hrec');
  const [interviewRound, setInterviewRound] = useState('Round 1: Technical & Architecture');
  const [interviewNotes, setInterviewNotes] = useState('');

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

  const handleOpenScheduleModal = (app: Application) => {
    setSelectedApp(app);
    setIsInterviewModalOpen(true);
  };

  const handleConfirmSchedule = () => {
    if (!selectedApp) return;
    scheduleInterview(selectedApp.id, {
      dateTime: interviewDate,
      mode: interviewMode,
      locationOrLink: interviewLink,
      round: interviewRound,
      notes: interviewNotes,
    });
    setIsInterviewModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Without Banned Kickers */}
      <div className="border-b border-slate-200/80 pb-5 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 tracking-tight font-sans">
            Applicant Evaluation Table
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Review student credentials, inspect verified resumes, and advance candidates through recruitment stages.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-button shadow-elevation-1">
          <span>Total Pool: <strong>{applications.length}</strong></span>
          <span className="text-slate-300">•</span>
          <span>Filtered: <strong>{filteredApplicants.length}</strong></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card elevation={1} className="p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 bg-surface border-slate-200/80">
        <div className="w-full md:flex-1 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, or skills..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-button text-ink-950 focus-ring-refined"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="text-xs bg-surface border border-slate-200 rounded-button px-2.5 py-2 text-slate-700 font-medium focus-ring-refined cursor-pointer"
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
            className="text-xs bg-surface border border-slate-200 rounded-button px-2.5 py-2 text-slate-700 font-medium focus-ring-refined cursor-pointer"
          >
            <option value="all">Status: All Stages</option>
            <option value="Submitted">Submitted</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected / Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* High Density Professional ATS Table */}
      <Card elevation={1} className="overflow-hidden bg-surface border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold tracking-wide">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Target Role</th>
                <th className="py-3 px-4">Branch & CGPA</th>
                <th className="py-3 px-4">Skills Match</th>
                <th className="py-3 px-4">Applied</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Stage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No candidates match the specified filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => {
                  const badgeStyle = getStatusBadgeStyle(app.status);

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Candidate */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                            {app.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-ink-950 leading-tight">{app.studentName}</p>
                            <p className="text-[10px] font-mono text-slate-400 leading-tight mt-0.5">
                              {app.studentRollNo}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Target Role */}
                      <td className="py-3 px-4 font-semibold text-ink-950">
                        {app.jobTitle}
                      </td>

                      {/* Branch & CGPA */}
                      <td className="py-3 px-4">
                        <p className="text-slate-700">{app.studentBranch.split(' ')[0]}</p>
                        <p className="text-[11px] font-mono font-bold text-teal-700 mt-0.5">
                          {app.studentCgpa} CGPA
                        </p>
                      </td>

                      {/* Skills */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {app.studentSkills.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200/60 font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Applied Date */}
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {formatDate(app.appliedAt)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-semibold border text-[11px] ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                          {app.status}
                        </span>
                      </td>

                      {/* Streamlined Stage Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[11px] px-2 py-1"
                            onClick={() => {
                              setSelectedApp(app);
                              setIsDossierModalOpen(true);
                            }}
                          >
                            Inspect
                          </Button>

                          {/* Dynamic Primary Action Based on Stage */}
                          {app.status === 'Submitted' && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-[11px] px-2.5 py-1 font-semibold"
                              onClick={() => shortlistApplication(app.id)}
                            >
                              Shortlist
                            </Button>
                          )}

                          {app.status === 'Shortlisted' && (
                            <Button
                              variant="primary"
                              size="sm"
                              leftIcon={<Calendar className="w-3 h-3" />}
                              className="text-[11px] px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold border-amber-700/40"
                              onClick={() => handleOpenScheduleModal(app)}
                            >
                              Schedule
                            </Button>
                          )}

                          {app.status === 'Interview' && (
                            <Button
                              variant="success"
                              size="sm"
                              leftIcon={<Award className="w-3 h-3" />}
                              className="text-[11px] px-2.5 py-1 font-semibold"
                              onClick={() => markSelected(app.id)}
                            >
                              Extend Offer
                            </Button>
                          )}

                          {/* Secondary Reject Action */}
                          {app.status !== 'Rejected' && app.status !== 'Selected' && app.status !== 'Withdrawn' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[11px] text-red-600 hover:bg-red-50 px-1.5 py-1"
                              onClick={() => rejectApplication(app.id)}
                            >
                              Reject
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Schedule Interview Modal */}
      <Dialog
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        title="Schedule Campus Interview Round"
        description={`Candidate: ${selectedApp?.studentName} for ${selectedApp?.jobTitle}`}
        footer={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsInterviewModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmSchedule}>
              Confirm & Alert Candidate
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Round Title"
            value={interviewRound}
            onChange={(e) => setInterviewRound(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date & Time"
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
            />

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Interview Mode
              </label>
              <select
                value={interviewMode}
                onChange={(e) => setInterviewMode(e.target.value as any)}
                className="w-full bg-surface text-ink-950 text-sm rounded-button border border-slate-200 p-2 focus-ring-refined"
              >
                <option value="Virtual">Virtual (Google Meet)</option>
                <option value="In-Person">In-Person (Placement Cell)</option>
              </select>
            </div>
          </div>

          <Input
            label="Meeting Link / Venue"
            value={interviewLink}
            onChange={(e) => setInterviewLink(e.target.value)}
          />

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
              Candidate Preparation Instructions
            </label>
            <textarea
              rows={2}
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              placeholder="e.g. Please be prepared to screen share projects and discuss system architecture..."
              className="w-full bg-surface text-ink-950 text-sm rounded-button border border-slate-200 p-2.5 focus-ring-refined"
            />
          </div>
        </div>
      </Dialog>

      {/* Candidate Dossier & Resume Quickview Modal */}
      <Dialog
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        title={`Candidate Dossier: ${selectedApp?.studentName}`}
        description={`Roll: ${selectedApp?.studentRollNo} • ${selectedApp?.studentBranch}`}
        footer={
          <Button variant="outline" size="sm" onClick={() => setIsDossierModalOpen(false)}>
            Close Dossier
          </Button>
        }
      >
        {selectedApp && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-500">Academic CGPA:</span>
                <p className="text-sm font-bold text-ink-950">{selectedApp.studentCgpa} / 10.0</p>
              </div>
              <div>
                <span className="text-slate-500">Campus Email:</span>
                <p className="font-semibold text-ink-950 truncate">{selectedApp.studentEmail}</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-ink-950 mb-2">Verified Technical Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.studentSkills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-medium border border-teal-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-card border border-slate-200 bg-surface flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-7 h-7 text-red-600" />
                <div>
                  <p className="font-bold text-ink-950">Master Placement Resume</p>
                  <p className="text-[11px] text-slate-500">PDF document verified by placement office</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => showToast('info', 'Viewing Resume', 'Opening candidate verified resume.')}
              >
                Inspect PDF
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
