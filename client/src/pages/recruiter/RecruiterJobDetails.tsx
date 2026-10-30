import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MapPin, Clock, Briefcase, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';

export const RecruiterJobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, applications } = useApp();

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-bold text-primary-text">Opening Not Found</h2>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/recruiter/jobs')}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  const jobApplicants = applications.filter((a) => a.jobId === job.id);

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/recruiter/jobs')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-primary-text"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/recruiter/applicants')}
        >
          View All Applicants ({jobApplicants.length})
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-secondary-text">{job.companyName}</span>
              <Badge variant="brand" size="sm">
                {job.workMode}
              </Badge>
              <Badge variant="neutral" size="sm">
                {job.type}
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-primary-text tracking-tight mt-1">{job.title}</h1>
            <p className="text-xs text-secondary-text mt-2">{job.description}</p>
          </div>

          <Badge variant={job.status === 'active' ? 'success' : 'neutral'} dot size="md">
            {job.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 p-4 rounded-lg bg-surface-secondary/50 border border-border text-xs">
          <div>
            <span className="text-muted-text">Compensation:</span>
            <p className="font-bold text-primary-text mt-0.5">{job.stipendOrSalary}</p>
          </div>
          <div>
            <span className="text-muted-text">Open Positions:</span>
            <p className="font-bold text-primary-text mt-0.5">{job.openings}</p>
          </div>
          <div>
            <span className="text-muted-text">CGPA Cutoff:</span>
            <p className="font-bold text-primary-text mt-0.5">{job.minCgpa}</p>
          </div>
          <div>
            <span className="text-muted-text">Deadline:</span>
            <p className="font-bold text-primary-text mt-0.5">{formatDate(job.applyBy)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-base font-bold text-primary-text mb-4">
          Candidates Applied For This Role ({jobApplicants.length})
        </h3>

        <div className="divide-y divide-border/60">
          {jobApplicants.length === 0 ? (
            <p className="text-xs text-muted-text py-4">No candidates have applied to this specific role yet.</p>
          ) : (
            jobApplicants.map((app) => (
              <div key={app.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-primary-text">{app.studentName}</p>
                  <p className="text-[11px] text-muted-text">
                    Roll: {app.studentRollNo} • CGPA: {app.studentCgpa} • {app.studentBranch}
                  </p>
                </div>
                <Badge variant="brand" size="sm">
                  {app.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
