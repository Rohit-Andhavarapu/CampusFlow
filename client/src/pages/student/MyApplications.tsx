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
  Calendar,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { formatDate, getStatusBadgeStyle } from '../../utils/formatters';

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
    { id: 'in_progress', label: 'Under Review / Rounds', count: inProgressCount },
    { id: 'selected', label: 'Offers Extended', count: selectedCount },
    { id: 'terminal', label: 'Archived / Withdrawn', count: terminalCount },
  ];

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (activeTab === 'submitted' && app.status !== 'Submitted') return false;
      if (activeTab === 'in_progress' && app.status !== 'Shortlisted' && app.status !== 'Interview')
        return false;
      if (activeTab === 'selected' && app.status !== 'Selected') return false;
      if (activeTab === 'terminal' && app.status !== 'Rejected' && app.status !== 'Withdrawn')
        return false;

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
    <div className="space-y-6 pb-16">
      {/* Header Without Banned Kickers */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 tracking-tight font-sans">
              My Applications
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Track the exact stage, interview invitations, and verified evaluation outcomes for all campus applications.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/student/opportunities')}
          >
            Explore Openings
          </Button>
        </div>

        {/* Status Metrics Strip (Connected Ribbon) */}
        <Card elevation={1} className="divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 grid grid-cols-2 sm:grid-cols-4 bg-surface mt-6">
          <div className="p-4">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Submitted
            </p>
            <p className="text-2xl font-extrabold text-ink-950 font-sans mt-0.5 tabular-nums">{submittedCount}</p>
          </div>
          <div className="p-4 bg-teal-50/30">
            <p className="text-[11px] font-medium text-teal-800 uppercase tracking-wider">
              Under Review / Interview
            </p>
            <p className="text-2xl font-extrabold text-teal-800 font-sans mt-0.5 tabular-nums">{inProgressCount}</p>
          </div>
          <div className="p-4 bg-emerald-50/30">
            <p className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider">
              Offers Extended
            </p>
            <p className="text-2xl font-extrabold text-emerald-700 font-sans mt-0.5 tabular-nums">{selectedCount}</p>
          </div>
          <div className="p-4">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Total Logged
            </p>
            <p className="text-2xl font-extrabold text-ink-950 font-sans mt-0.5 tabular-nums">{totalCount}</p>
          </div>
        </Card>

        {/* Tab Row */}
        <div className="mt-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search submitted applications..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface border border-slate-200 rounded-button text-ink-950 placeholder:text-slate-400 focus-ring-refined"
          />
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Showing {filteredApplications.length} of {applications.length}
        </span>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card elevation={1} className="p-12 text-center flex flex-col items-center justify-center border-slate-200/80">
          <FileText className="w-8 h-8 text-slate-400 mb-2.5" />
          <h3 className="text-sm font-bold text-ink-950">No applications found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            You do not currently have any applications under this category tab.
          </p>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {filteredApplications.map((app) => {
            const badgeStyle = getStatusBadgeStyle(app.status);

            return (
              <Card
                key={app.id}
                elevation={1}
                hoverable
                onClick={() => navigate(`/student/applications/${app.id}`)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border-slate-200/80 card-lift transition-colors"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={app.companyLogo}
                    alt={app.companyName}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">
                        {app.companyName}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-mono">
                        Applied {formatDate(app.appliedAt)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-ink-950 hover:text-teal-700 transition-colors mt-0.5">
                      {app.jobTitle}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-700" />
                      <span>{app.nextAction || 'Under recruiter review.'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-2.5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <span
                    className={`text-xs px-3 py-1 rounded font-semibold border flex items-center gap-1.5 ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                    {app.status}
                  </span>

                  <span className="text-xs font-semibold text-teal-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Inspect Timeline <ChevronRight className="w-3.5 h-3.5" />
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
