import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Dialog } from '../../components/ui/Dialog';
import { formatDate, formatDateTime, getStatusBadgeStyle } from '../../utils/formatters';
import { ApplicationStatus } from '../../types';

export const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, interviews, withdrawApplication } = useApp();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const application = applications.find((a) => a.id === id);

  if (!application) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-bold text-ink-950">Application Record Not Found</h2>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/student/applications')}>
          Return to Applications
        </Button>
      </div>
    );
  }

  const linkedInterview = interviews.find((i) => i.applicationId === application.id);
  const badgeStyle = getStatusBadgeStyle(application.status);

  const standardStages: ApplicationStatus[] = ['Submitted', 'Shortlisted', 'Interview', 'Selected'];

  const getStageStatus = (stage: ApplicationStatus) => {
    if (application.status === 'Withdrawn' || application.status === 'Rejected') {
      const hasReached = application.history.some((h) => h.status === stage);
      return hasReached ? 'completed' : 'archived';
    }

    const stageOrder: Record<ApplicationStatus, number> = {
      Submitted: 1,
      Shortlisted: 2,
      Interview: 3,
      Selected: 4,
      Rejected: 99,
      Withdrawn: 99,
    };

    const currentOrder = stageOrder[application.status];
    const targetOrder = stageOrder[stage];

    if (currentOrder > targetOrder) return 'completed';
    if (currentOrder === targetOrder) return 'current';
    return 'upcoming';
  };

  const handleWithdraw = () => {
    withdrawApplication(application.id);
    setIsWithdrawModalOpen(false);
  };

  const canWithdraw =
    application.status !== 'Withdrawn' &&
    application.status !== 'Rejected' &&
    application.status !== 'Selected';

  return (
    <div className="space-y-6 pb-16">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student/applications')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 hover:text-ink-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </button>

        {canWithdraw && (
          <Button
            variant="outline"
            size="sm"
            className="text-error border-error/30 hover:bg-error-surface text-xs"
            onClick={() => setIsWithdrawModalOpen(true)}
          >
            Withdraw Application
          </Button>
        )}
      </div>

      {/* Hero Header Card */}
      <Card className="p-6 border border-border shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={application.companyLogo}
              alt={application.companyName}
              className="w-16 h-16 rounded-xl object-cover border border-border flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-ink-800">
                  {application.companyName}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-mono text-ink-500">
                  REF #{application.id.slice(-6).toUpperCase()}
                </span>
              </div>

              <h1 className="text-2xl font-extrabold text-ink-950 tracking-tight mt-1 font-sans">
                {application.jobTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-600 mt-2.5">
                <span>Applied {formatDate(application.appliedAt)}</span>
                <span>•</span>
                <span>Candidate: {application.studentName} ({application.studentRollNo})</span>
                <span>•</span>
                <span>Verified CGPA: <strong>{application.studentCgpa}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-1.5 border-t md:border-t-0 pt-3 md:pt-0 border-border">
            <span
              className={`text-xs px-3.5 py-1.5 rounded-badge font-bold border flex items-center gap-2 ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
            >
              <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`} />
              {application.status}
            </span>
            <p className="text-[11px] font-mono text-ink-400">
              Updated {formatDate(application.history[application.history.length - 1]?.timestamp || application.appliedAt)}
            </p>
          </div>
        </div>

        {/* Stepper Pipeline */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {standardStages.map((stage, idx) => {
              const status = getStageStatus(stage);
              return (
                <div key={stage} className="flex flex-col">
                  <div className="flex items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        status === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : status === 'current'
                          ? 'bg-brand text-white ring-4 ring-indigo-100 shadow-sm'
                          : 'bg-surface-secondary text-ink-400 border border-border'
                      }`}
                    >
                      {status === 'completed' ? '✓' : idx + 1}
                    </div>
                    {idx < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded ${
                          status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={`text-xs font-semibold mt-2.5 ${
                      status === 'current'
                        ? 'text-brand'
                        : status === 'completed'
                        ? 'text-ink-950'
                        : 'text-ink-400'
                    }`}
                  >
                    {stage}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Terminal state alerts */}
          {application.status === 'Withdrawn' && (
            <div className="mt-6 p-4 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>Application withdrawn at candidate request. Candidacy archived.</span>
            </div>
          )}

          {application.status === 'Rejected' && (
            <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2.5">
              <XCircle className="w-4 h-4 text-error flex-shrink-0" />
              <span>Recruiter evaluation completed for this batch; candidate not selected to advance.</span>
            </div>
          )}
        </div>
      </Card>

      {/* Two Columns: Official Timestamped History vs Dossier Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-6 border border-border shadow-subtle">
            <h3 className="text-base font-bold text-ink-950 mb-1">
              Application Transition History
            </h3>
            <p className="text-xs text-ink-500 mb-6">
              Timestamped audit log recorded by placement cell and company recruiters.
            </p>

            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {application.history.map((event, index) => {
                const isLatest = index === application.history.length - 1;
                return (
                  <div key={index} className="relative pl-8">
                    <span
                      className={`absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                        isLatest
                          ? 'border-brand ring-4 ring-indigo-100'
                          : 'border-slate-400'
                      }`}
                    />

                    <div className="bg-surface border border-border rounded-card p-4 shadow-subtle">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-xs font-bold text-ink-950">
                          {event.status} Stage Reached
                        </span>
                        <span className="text-[11px] font-mono text-ink-400">
                          {formatDateTime(event.timestamp)}
                        </span>
                      </div>

                      <p className="text-xs text-ink-600 mt-1.5 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between text-[11px] text-ink-400">
                        <span>Recorded by: <strong className="text-ink-700">{event.author}</strong></span>
                        <span className="text-brand font-medium">Placement Verified ✓</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Next Steps & Interview card */}
        <div className="space-y-6">
          {linkedInterview && (
            <Card className="p-5 border border-amber-200 bg-amber-50/40">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Scheduled Interview</span>
              </div>
              <h4 className="text-sm font-bold text-ink-950 mt-1">
                {linkedInterview.round}
              </h4>
              <p className="text-xs text-ink-600 mt-1 font-mono">
                {new Date(linkedInterview.dateTime).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
              </p>
              <div className="mt-4 pt-3 border-t border-amber-200">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full text-xs bg-amber-600 hover:bg-amber-700"
                  onClick={() => navigate('/student/interviews')}
                >
                  View Meeting Link & Instructions
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-5 space-y-4 border border-border shadow-subtle">
            <h4 className="text-xs font-bold text-ink-950 uppercase tracking-wide">Submitted Dossier</h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-500">Degree & Branch</span>
                <span className="font-semibold text-ink-950">{application.studentBranch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Undergrad CGPA</span>
                <span className="font-semibold text-ink-950">{application.studentCgpa}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Campus Email</span>
                <span className="font-semibold text-ink-950">{application.studentEmail}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <p className="text-xs font-semibold text-ink-950 mb-2">Evaluated Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {application.studentSkills.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-2 py-0.5 rounded bg-surface-secondary text-ink-700 border border-border"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate(`/student/opportunities/${application.jobId}`)}
              >
                Inspect Opportunity Details
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Withdrawal Dialog */}
      <Dialog
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Withdraw Application?"
        description="Please confirm you wish to cancel this job application."
        footer={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsWithdrawModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleWithdraw}>
              Confirm Withdrawal
            </Button>
          </div>
        }
      >
        <p className="text-xs text-ink-600 leading-relaxed">
          Are you certain you want to withdraw your application for <strong>{application.jobTitle}</strong> at <strong>{application.companyName}</strong>?
          Once withdrawn, employer recruiters will be alerted and your candidacy will be archived.
        </p>
      </Dialog>
    </div>
  );
};
