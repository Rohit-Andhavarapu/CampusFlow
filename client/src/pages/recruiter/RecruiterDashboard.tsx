import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  Building2,
  ExternalLink,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate, getStatusBadgeStyle } from '../../utils/formatters';

export const RecruiterDashboard: React.FC = () => {
  const { currentUser, jobs, applications, interviews } = useApp();
  const navigate = useNavigate();

  // Metrics
  const activePostings = jobs.filter((j) => j.status === 'active').length;
  const totalApplicants = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const scheduledInterviews = interviews.filter((i) => i.status === 'Scheduled').length;

  const awaitingReview = applications.filter((a) => a.status === 'Submitted');

  return (
    <div className="space-y-8 pb-16">
      {/* Header Without Banned Kickers */}
      <div className="border-b border-slate-200/80 pb-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 tracking-tight font-sans">
            Recruitment Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {currentUser.companyName || 'NovaTech Systems'} • Manage open campus vacancies, review verified student applications, and conduct interview evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Users className="w-3.5 h-3.5" />}
            onClick={() => navigate('/recruiter/applicants')}
          >
            Review Pipeline ({applications.length})
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => navigate('/recruiter/jobs/new')}
          >
            Publish New Opening
          </Button>
        </div>
      </div>

      {/* Connected Performance Ribbon (Breaking Card-on-Card) */}
      <Card elevation={1} className="divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-surface">
        <div
          onClick={() => navigate('/recruiter/jobs')}
          className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Postings</span>
            <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
              Accepting
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-ink-950 tabular-nums">
              {activePostings}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 truncate">Published campus vacancies</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/recruiter/applicants')}
          className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Candidate Pool</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              +14% vs last drive
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-ink-950 tabular-nums">
              {totalApplicants}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 truncate">Verified student submissions</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/recruiter/applicants')}
          className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Shortlisted for Rounds</span>
            <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
              Screened
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-ink-950 tabular-nums">
              {shortlistedCount}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 truncate">Passed criteria benchmark</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/recruiter/interviews')}
          className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Interviews Scheduled</span>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-ink-950 tabular-nums">
              {scheduledInterviews}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 truncate">Virtual rooms & slots booked</p>
          </div>
        </div>
      </Card>

      {/* Funnel & Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Candidate Conversion Funnel */}
        <div className="lg:col-span-2 space-y-6">
          <Card elevation={1} className="p-6 bg-surface border-slate-200/80">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-sm font-bold text-ink-950 tracking-tight">
                  Candidate Selection Funnel
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Throughput and conversion across recruitment milestones
                </p>
              </div>
              <Badge variant="brand" size="sm">
                Active Drive
              </Badge>
            </div>

            {/* Funnel without banned border-l-4 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { stage: 'Applied', count: applications.length, pct: '100%', bg: 'bg-slate-50', text: 'text-ink-950' },
                {
                  stage: 'Shortlisted',
                  count: applications.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected').length,
                  pct: '75%',
                  bg: 'bg-blue-50/60',
                  text: 'text-blue-900',
                },
                {
                  stage: 'Interviewing',
                  count: applications.filter((a) => a.status === 'Interview' || a.status === 'Selected').length,
                  pct: '50%',
                  bg: 'bg-amber-50/60',
                  text: 'text-amber-900',
                },
                {
                  stage: 'Offers Extended',
                  count: applications.filter((a) => a.status === 'Selected').length,
                  pct: '25%',
                  bg: 'bg-emerald-50/60',
                  text: 'text-emerald-900',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border border-slate-200/80 ${item.bg}`}
                >
                  <p className="text-[11px] font-medium text-slate-500 uppercase">{item.stage}</p>
                  <p className={`text-2xl font-extrabold mt-1 font-sans tabular-nums ${item.text}`}>{item.count}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{item.pct} throughput</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Job Postings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-ink-950 tracking-tight">Active Campus Openings</h2>
                <p className="text-xs text-slate-500">Live vacancies accepting student submissions</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => navigate('/recruiter/jobs')}
              >
                Manage All ({jobs.length})
              </Button>
            </div>

            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <Card
                  key={job.id}
                  elevation={1}
                  hoverable
                  onClick={() => navigate(`/recruiter/jobs/${job.id}`)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface border-slate-200/80 card-lift transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-ink-950">{job.title}</h3>
                      <Badge variant="neutral" size="sm">
                        {job.workMode}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5">
                      <span className="font-semibold text-ink-950 tabular-nums">{job.stipendOrSalary}</span>
                      <span>Min CGPA: <strong>{job.minCgpa}</strong></span>
                      <span>Deadline: {formatDate(job.applyBy)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-teal-700 tabular-nums">
                      {job.applicantsCount || 0} applicants
                    </span>
                    <Button variant="outline" size="sm" className="text-xs">
                      Inspect Pipeline
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Attention / Recent Applicants */}
        <div className="space-y-6">
          <Card elevation={1} className="p-5 bg-surface border-slate-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-ink-950 uppercase tracking-wide">
                Candidates Awaiting Review
              </h2>
              <span
                className="text-[11px] font-medium text-teal-700 hover:underline cursor-pointer"
                onClick={() => navigate('/recruiter/applicants')}
              >
                View ATS Table
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-1">
              {applications.slice(0, 4).map((app) => {
                const badgeStyle = getStatusBadgeStyle(app.status);
                return (
                  <div
                    key={app.id}
                    onClick={() => navigate('/recruiter/applicants')}
                    className="py-3 first:pt-2 last:pb-0 cursor-pointer hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-ink-950">{app.studentName}</p>
                        <p className="text-[11px] text-slate-600 truncate">{app.jobTitle}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 font-mono">
                      <span>CGPA: <strong>{app.studentCgpa}</strong> • {app.studentBranch.split(' ')[0]}</span>
                      <span>{formatDate(app.appliedAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
