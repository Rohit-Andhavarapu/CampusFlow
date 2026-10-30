import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronDown,
  FileText,
  UserCheck,
  Video,
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
  const [interviewRound, setInterviewRound] = useState('Round 1: Technical & Problem Solving');
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
      {/* Header */}
      <div className="border-b border-border/60 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Candidate Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight mt-1">
            Applicant Management Pipeline
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Review submitted student credentials, download resumes, advance shortlists, and trigger calendar invites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="brand" size="md">
            {applications.length} Total Candidates
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-card">
        <div className="w-full md:flex-1 relative">
          <Search className="w-4 h-4 text-muted-text absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll no, skills or role..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface-secondary/40 border border-border rounded-button text-primary-text focus-ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="text-xs bg-surface border border-border rounded-button px-3 py-2 text-secondary-text font-medium focus-ring"
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
            className="text-xs bg-surface border border-border rounded-button px-3 py-2 text-secondary-text font-medium focus-ring"
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

      {/* High Density Candidate Table */}
      <Card className="overflow-hidden border-border shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/70 border-b border-border/80 text-secondary-text uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Target Role</th>
                <th className="py-3 px-4">Branch & CGPA</th>
                <th className="py-3 px-4">Top Skills</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-text">
                    No applicants match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => {
                  const badgeStyle = getStatusBadgeStyle(app.status);

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-surface-secondary/40 transition-colors group"
                    >
                      {/* Candidate */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-surface text-brand font-bold flex items-center justify-center flex-shrink-0">
                            {app.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-primary-text">{app.studentName}</p>
                            <p className="text-[11px] text-muted-text">{app.studentRollNo}</p>
                          </div>
                        </div>
                      </td>

                      {/* Target Role */}
                      <td className="py-3.5 px-4 font-semibold text-primary-text">
                        {app.jobTitle}
                      </td>

                      {/* Branch & CGPA */}
                      <td className="py-3.5 px-4">
                        <p className="text-primary-text font-medium">{app.studentBranch}</p>
                        <p className="text-[11px] text-brand font-bold">CGPA: {app.studentCgpa}</p>
                      </td>

                      {/* Skills */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {app.studentSkills.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-surface-secondary text-secondary-text border border-border"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Applied Date */}
                      <td className="py-3.5 px-4 text-muted-text">
                        {formatDate(app.appliedAt)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border text-[11px] ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                          {app.status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Dossier */}
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

                          {/* Shortlist */}
                          {app.status === 'Submitted' && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-[11px] px-2 py-1"
                              onClick={() => shortlistApplication(app.id)}
                            >
                              Shortlist
                            </Button>
                          )}

                          {/* Schedule Interview */}
                          {(app.status === 'Shortlisted' || app.status === 'Interview') && (
                            <Button
                              variant="primary"
                              size="sm"
                              leftIcon={<Calendar className="w-3 h-3" />}
                              className="text-[11px] px-2 py-1 bg-warning hover:bg-amber-600 text-white"
                              onClick={() => handleOpenScheduleModal(app)}
                            >
                              Interview
                            </Button>
                          )}

                          {/* Select / Hire */}
                          {app.status === 'Interview' && (
                            <Button
                              variant="success"
                              size="sm"
                              className="text-[11px] px-2 py-1"
                              onClick={() => markSelected(app.id)}
                            >
                              Offer
                            </Button>
                          )}

                          {/* Reject */}
                          {app.status !== 'Rejected' && app.status !== 'Selected' && app.status !== 'Withdrawn' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[11px] text-error hover:bg-error-surface px-2 py-1"
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

      {/* Schedule Interview Modal Dialog */}
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
              Confirm & Notify Student
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
              <label className="text-xs font-semibold text-secondary-text uppercase tracking-wide block mb-1.5">
                Interview Mode
              </label>
              <select
                value={interviewMode}
                onChange={(e) => setInterviewMode(e.target.value as any)}
                className="w-full bg-surface text-primary-text text-sm rounded-button border border-border p-2 focus-ring"
              >
                <option value="Virtual">Virtual (Google Meet / Zoom)</option>
                <option value="In-Person">In-Person (Campus Placement Cell)</option>
              </select>
            </div>
          </div>

          <Input
            label="Meeting Link / Location Venue"
            value={interviewLink}
            onChange={(e) => setInterviewLink(e.target.value)}
          />

          <div>
            <label className="text-xs font-semibold text-secondary-text uppercase tracking-wide block mb-1.5">
              Candidate Preparation Instructions
            </label>
            <textarea
              rows={2}
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              placeholder="e.g. Please be ready to screen share your portfolio projects and code..."
              className="w-full bg-surface text-primary-text text-sm rounded-button border border-border p-2.5 focus-ring"
            />
          </div>
        </div>
      </Dialog>

      {/* Candidate Dossier & Resume Quickview Modal */}
      <Dialog
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        title={`Candidate Dossier: ${selectedApp?.studentName}`}
        description={`Roll No: ${selectedApp?.studentRollNo} • ${selectedApp?.studentBranch}`}
        footer={
          <Button variant="outline" size="sm" onClick={() => setIsDossierModalOpen(false)}>
            Close Dossier
          </Button>
        }
      >
        {selectedApp && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-surface-secondary/70 border border-border">
              <div>
                <span className="text-muted-text">Verified Undergrad CGPA:</span>
                <p className="text-sm font-bold text-primary-text">{selectedApp.studentCgpa} / 10.0</p>
              </div>
              <div>
                <span className="text-muted-text">Campus Email:</span>
                <p className="font-semibold text-primary-text truncate">{selectedApp.studentEmail}</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-primary-text mb-2">Technical Competencies</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.studentSkills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded bg-brand-surface text-brand font-medium border border-brand/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-card border border-border bg-surface flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-error" />
                <div>
                  <p className="font-bold text-primary-text">Master Placement Resume</p>
                  <p className="text-[11px] text-muted-text">PDF document verified by placement office</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => showToast('info', 'Viewing Resume', 'Opening verified candidate resume in viewer.')}
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
