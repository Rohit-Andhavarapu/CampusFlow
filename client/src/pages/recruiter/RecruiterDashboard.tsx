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
  Sparkles,
  Building2,
  ExternalLink,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { MetricCard } from '../../components/ui/MetricCard';
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
      {/* Editorial Header */}
      <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-ink-500 uppercase tracking-wider">
            <span>{currentUser.companyName || 'NovaTech Systems'}</span>
            <span>•</span>
            <span className="text-brand font-semibold">Campus Talent Acquisition Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 tracking-tight mt-1.5 font-sans">
            Recruitment Command Center
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 mt-1 max-w-2xl">
            Manage your open campus vacancies, review verified student applications, and conduct interview evaluations.
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

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Active Campus Postings"
          value={activePostings}
          subtext="Published vacancies accepting applicants"
          variant="brand"
          onClick={() => navigate('/recruiter/jobs')}
        />
        <MetricCard
          label="Candidate Pool Size"
          value={totalApplicants}
          subtext="Verified student applications"
          trend={{ value: '14% vs last drive', isPositive: true }}
          onClick={() => navigate('/recruiter/applicants')}
        />
        <MetricCard
          label="Shortlisted for Rounds"
          value={shortlistedCount}
          subtext="Passed criteria screening"
          variant="warning"
          onClick={() => navigate('/recruiter/applicants')}
        />
        <MetricCard
          label="Interviews Scheduled"
          value={scheduledInterviews}
          subtext="Virtual rooms & slots booked"
          variant="success"
          onClick={() => navigate('/recruiter/interviews')}
        />
      </div>

      {/* Funnel & Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Candidate Conversion Funnel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-border shadow-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div>
                <h3 className="text-sm font-bold text-ink-950 uppercase tracking-wide">
                  Candidate Selection Funnel
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">
                  Throughput and conversion across recruitment milestones
                </p>
              </div>
              <Badge variant="brand" size="sm">
                Active Drive
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { stage: 'Applied', count: applications.length, pct: '100%', color: 'border-l-indigo-500' },
                {
                  stage: 'Shortlisted',
                  count: applications.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected').length,
                  pct: '75%',
                  color: 'border-l-blue-500',
                },
                {
                  stage: 'Interviewing',
                  count: applications.filter((a) => a.status === 'Interview' || a.status === 'Selected').length,
                  pct: '50%',
                  color: 'border-l-amber-500',
                },
                {
                  stage: 'Offers Extended',
                  count: applications.filter((a) => a.status === 'Selected').length,
                  pct: '25%',
                  color: 'border-l-emerald-500',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg bg-surface-secondary/60 border border-border border-l-4 ${item.color}`}
                >
                  <p className="text-[11px] font-medium text-ink-500 uppercase">{item.stage}</p>
                  <p className="text-2xl font-extrabold text-ink-950 mt-1 font-sans">{item.count}</p>
                  <p className="text-[10px] text-ink-400 mt-0.5 font-mono">{item.pct} throughput</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Job Postings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink-950">Active Campus Openings</h3>
                <p className="text-xs text-ink-500">Live vacancies accepting student submissions</p>
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
                  hoverable
                  onClick={() => navigate(`/recruiter/jobs/${job.id}`)}
                  className="card-lift p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border shadow-subtle"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-ink-950">{job.title}</h4>
                      <Badge variant="brand" size="sm">
                        {job.workMode}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500 mt-1.5">
                      <span className="font-semibold text-ink-950">{job.stipendOrSalary}</span>
                      <span>Min CGPA: <strong>{job.minCgpa}</strong></span>
                      <span>Deadline: {formatDate(job.applyBy)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-brand">
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
          <Card className="p-5 border border-border shadow-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wide">
                Candidates Awaiting Review
              </h3>
              <span
                className="text-[11px] font-medium text-brand hover:underline cursor-pointer"
                onClick={() => navigate('/recruiter/applicants')}
              >
                View ATS Table
              </span>
            </div>

            <div className="divide-y divide-border mt-1">
              {applications.slice(0, 4).map((app) => {
                const badgeStyle = getStatusBadgeStyle(app.status);
                return (
                  <div
                    key={app.id}
                    onClick={() => navigate('/recruiter/applicants')}
                    className="py-3 first:pt-2 last:pb-0 cursor-pointer hover:bg-surface-secondary/50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-ink-950">{app.studentName}</p>
                        <p className="text-[11px] text-ink-600 truncate">{app.jobTitle}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-badge font-semibold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-ink-500 mt-1.5">
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
