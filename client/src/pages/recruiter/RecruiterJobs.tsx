import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Users, Clock, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';

export const RecruiterJobs: React.FC = () => {
  const { jobs } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-border/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Openings Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary-text tracking-tight mt-1">
            Job & Internship Postings
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Publish openings, calibrate academic cutoff criteria, and monitor real-time candidate applications.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/recruiter/jobs/new')}
        >
          Create New Posting
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {jobs.map((job) => (
          <Card
            key={job.id}
            hoverable
            onClick={() => navigate(`/recruiter/jobs/${job.id}`)}
            className="p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-secondary-text">{job.companyName}</span>
                    <Badge variant="brand" size="sm">
                      {job.workMode}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-primary-text mt-1">{job.title}</h3>
                </div>
                <Badge variant={job.status === 'active' ? 'success' : 'neutral'} dot size="sm">
                  {job.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-lg bg-surface-secondary/40 border border-border/50 text-xs">
                <div>
                  <span className="text-muted-text">Stipend / CTC:</span>
                  <p className="font-semibold text-primary-text mt-0.5">{job.stipendOrSalary}</p>
                </div>
                <div>
                  <span className="text-muted-text">Openings:</span>
                  <p className="font-semibold text-primary-text mt-0.5">{job.openings} positions</p>
                </div>
                <div>
                  <span className="text-muted-text">Min CGPA Cutoff:</span>
                  <p className="font-semibold text-primary-text mt-0.5">{job.minCgpa}</p>
                </div>
                <div>
                  <span className="text-muted-text">Application Deadline:</span>
                  <p className="font-semibold text-primary-text mt-0.5">{formatDate(job.applyBy)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-brand flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {job.applicantsCount || 0} Candidates Applied
              </span>

              <span className="text-xs font-semibold text-secondary-text flex items-center gap-1">
                Manage Opening <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
