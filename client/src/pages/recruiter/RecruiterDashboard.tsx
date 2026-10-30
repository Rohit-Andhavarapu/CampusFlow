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

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-border/60 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recruiter Portal • {currentUser.companyName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight mt-1">
            Talent Acquisition Command Center
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Manage your open campus vacancies, review verified student applications, and conduct interview evaluations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            leftIcon={<Users className="w-4 h-4" />}
            onClick={() => navigate('/recruiter/applicants')}
          >
            Review Candidates
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/recruiter/jobs/new')}
          >
            Post New Opening
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricCard
          label="Active Job Postings"
          value={activePostings}
          subtext="Published on campus portal"
          icon={<Briefcase className="w-5 h-5 text-brand" />}
          variant="brand"
          onClick={() => navigate('/recruiter/jobs')}
        />
        <MetricCard
          label="Total Candidates Applied"
          value={totalApplicants}
          subtext="Across all company openings"
          icon={<Users className="w-5 h-5 text-info" />}
          trend={{ value: '14% vs last drive', isPositive: true }}
          onClick={() => navigate('/recruiter/applicants')}
        />
        <MetricCard
          label="Shortlisted Candidates"
          value={shortlistedCount}
          subtext="Cleared initial academic screening"
          icon={<CheckCircle2 className="w-5 h-5 text-success" />}
          variant="success"
          onClick={() => navigate('/recruiter/applicants')}
        />
        <MetricCard
          label="Interviews Scheduled"
          value={scheduledInterviews}
          subtext="Virtual meeting links active"
          icon={<Calendar className="w-5 h-5 text-warning" />}
          variant="warning"
          onClick={() => navigate('/recruiter/interviews')}
        />
      </div>

      {/* Funnel & Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Candidate Pipeline Funnel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-primary-text">Candidate Selection Pipeline</h3>
                <p className="text-xs text-secondary-text">
                  Conversion metrics across each stage of evaluation
                </p>
              </div>
              <Badge variant="brand" size="sm">
                Active Cycle
              </Badge>
            </div>

            <div className="space-y-4 pt-2">
              {[
                { label: 'Applications Received', count: applications.length, pct: 100, color: 'bg-brand' },
                {
                  label: 'Shortlisted for Assessment',
                  count: applications.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected').length,
                  pct: 75,
                  color: 'bg-info',
                },
                {
                  label: 'Interview Round In Progress',
                  count: applications.filter((a) => a.status === 'Interview' || a.status === 'Selected').length,
                  pct: 45,
                  color: 'bg-warning',
                },
                {
                  label: 'Final Offer Extended',
                  count: applications.filter((a) => a.status === 'Selected').length,
                  pct: 25,
                  color: 'bg-success',
                },
              ].map((stage, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-primary-text">{stage.label}</span>
                    <span className="font-bold text-primary-text">{stage.count} candidates ({stage.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`${stage.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${stage.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Job Postings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-primary-text">Your Campus Postings</h3>
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
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-primary-text">{job.title}</h4>
                      <Badge variant="brand" size="sm">
                        {job.workMode}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-text mt-1">
                      {job.stipendOrSalary} • Deadline: {formatDate(job.applyBy)} • Min CGPA: {job.minCgpa}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-secondary-text">
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

        {/* Right 1 Col: Recent Applicant Activity */}
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="text-sm font-bold text-primary-text">Recent Applicants</h3>
              <span
                className="text-xs font-semibold text-brand hover:underline cursor-pointer"
                onClick={() => navigate('/recruiter/applicants')}
              >
                View Table
              </span>
            </div>

            <div className="divide-y divide-border/50 mt-2">
              {applications.slice(0, 4).map((app) => {
                const badgeStyle = getStatusBadgeStyle(app.status);
                return (
                  <div
                    key={app.id}
                    onClick={() => navigate('/recruiter/applicants')}
                    className="py-3 first:pt-2 last:pb-1 cursor-pointer hover:bg-surface-secondary/40 rounded-lg px-2 transition-colors -mx-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-primary-text">{app.studentName}</p>
                        <p className="text-[11px] text-secondary-text truncate">{app.jobTitle}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-text mt-1.5">
                      <span>CGPA: <strong>{app.studentCgpa}</strong> • {app.studentBranch}</span>
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
