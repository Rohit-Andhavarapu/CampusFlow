import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  Search,
  Filter,
  ExternalLink,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { formatDate, getStatusBadgeStyle } from '../../utils/formatters';
import { ApplicationStatus } from '../../types';

export const MyApplications: React.FC = () => {
  const { applications } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Overview Counts
  const totalCount = applications.length;
  const submittedCount = applications.filter((a) => a.status === 'Submitted').length;
  const inProgressCount = applications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Interview'
  ).length;
  const selectedCount = applications.filter((a) => a.status === 'Selected').length;
  const terminalCount = applications.filter(
    (a) => a.status === 'Rejected' || a.status === 'Withdrawn'
  ).length;

  const tabs = [
    { id: 'all', label: 'All Applications', count: totalCount },
    { id: 'submitted', label: 'Submitted', count: submittedCount },
    { id: 'in_progress', label: 'In Progress / Interviews', count: inProgressCount },
    { id: 'selected', label: 'Offers / Selected', count: selectedCount },
    { id: 'terminal', label: 'Archived / Withdrawn', count: terminalCount },
  ];

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Tab filter
      if (activeTab === 'submitted' && app.status !== 'Submitted') return false;
      if (activeTab === 'in_progress' && app.status !== 'Shortlisted' && app.status !== 'Interview')
        return false;
      if (activeTab === 'selected' && app.status !== 'Selected') return false;
      if (activeTab === 'terminal' && app.status !== 'Rejected' && app.status !== 'Withdrawn')
        return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = app.jobTitle.toLowerCase().includes(q);
        const matchesCompany = app.companyName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany) return false;
      }

      return true;
    });
  }, [applications, activeTab, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-border/60 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Application Lifecycle</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight mt-1">
              My Applications
            </h1>
            <p className="text-sm text-secondary-text mt-1">
              Track the exact real-time stage, interview invites, and company responses for all your campus drives.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/student/opportunities')}
          >
            Explore More Openings
          </Button>
        </div>

        {/* Status Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-card bg-surface border border-border">
            <p className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">
              Submitted
            </p>
            <p className="text-2xl font-bold text-primary-text mt-1">{submittedCount}</p>
          </div>
          <div className="p-3.5 rounded-card bg-brand-surface/40 border border-brand/20">
            <p className="text-[11px] font-semibold text-brand uppercase tracking-wider">
              Under Review / Interview
            </p>
            <p className="text-2xl font-bold text-brand mt-1">{inProgressCount}</p>
          </div>
          <div className="p-3.5 rounded-card bg-success-surface/40 border border-success-border">
            <p className="text-[11px] font-semibold text-success-text uppercase tracking-wider">
              Offers Extended
            </p>
            <p className="text-2xl font-bold text-success-text mt-1">{selectedCount}</p>
          </div>
          <div className="p-3.5 rounded-card bg-surface-secondary/60 border border-border">
            <p className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider">
              Total Recorded
            </p>
            <p className="text-2xl font-bold text-primary-text mt-1">{totalCount}</p>
          </div>
        </div>

        {/* Tab Row */}
        <div className="mt-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-muted-text absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role or company..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded-button text-primary-text placeholder:text-muted-text focus-ring"
          />
        </div>

        <span className="text-xs text-muted-text">
          Showing {filteredApplications.length} of {applications.length}
        </span>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center">
          <FileText className="w-10 h-10 text-muted-text mb-3" />
          <h3 className="text-base font-semibold text-primary-text">No applications found</h3>
          <p className="text-xs text-secondary-text mt-1 max-w-sm">
            You don't have any applications matching this filter category.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const badgeStyle = getStatusBadgeStyle(app.status);

            return (
              <Card
                key={app.id}
                hoverable
                onClick={() => navigate(`/student/applications/${app.id}`)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={app.companyLogo}
                    alt={app.companyName}
                    className="w-12 h-12 rounded-xl object-cover border border-border shadow-sm flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-secondary-text">
                        {app.companyName}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-muted-text">
                        Applied {formatDate(app.appliedAt)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-primary-text hover:text-brand transition-colors mt-0.5">
                      {app.jobTitle}
                    </h3>

                    <p className="text-xs text-muted-text mt-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand" />
                      <span>{app.nextAction || 'Under recruiter review.'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-border/50">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                    {app.status}
                  </span>

                  <span className="text-xs font-semibold text-brand flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View Progress Pipeline <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
