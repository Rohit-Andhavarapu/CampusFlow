import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Layers,
  ArrowRight,
  Filter,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChartPieDonut } from '../../components/charts/ChartPieDonut';
import { ChartBarHorizontal } from '../../components/charts/ChartBarHorizontal';
import { ChartFunnel } from '../../components/charts/ChartFunnel';
import { ChartSegmentedBar } from '../../components/charts/ChartSegmentedBar';

export const RecruiterAnalytics: React.FC = () => {
  const { applications, jobs, currentUser } = useApp();
  const navigate = useNavigate();

  // 1. Application status distribution
  const statusCounts = useMemo(() => {
    return applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [applications]);

  // 2. Ranked job postings by applicant volume
  const jobPostingsData = useMemo(() => {
    return jobs.map((j) => ({
      name: `${j.title} (${j.type})`,
      value: applications.filter((a) => a.jobId === j.id).length,
    })).sort((a, b) => b.value - a.value);
  }, [jobs, applications]);

  const pipelineSegments = useMemo(() => {
    return [
      { name: 'Screening', count: statusCounts['Applied'] || 0, color: '#0284C7' },
      { name: 'Shortlisted', count: statusCounts['Shortlisted'] || 0, color: '#6366F1' },
      { name: 'Interview', count: statusCounts['Interview Scheduled'] || 0, color: '#D97706' },
      { name: 'Offered', count: statusCounts['Selected'] || 0, color: '#059669' },
      { name: 'Declined', count: statusCounts['Rejected'] || 0, color: '#94A3B8' },
    ];
  }, [statusCounts]);

  // 2. Selection Funnel Progression (Step through)
  const funnelData = useMemo(() => {
    const applied = applications.length;
    const shortlisted = applications.filter(
      (a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected'
    ).length;
    const interviewed = applications.filter(
      (a) => a.status === 'Interview' || a.status === 'Selected'
    ).length;
    const selected = applications.filter((a) => a.status === 'Selected').length;

    return [
      { name: 'Applied Pool', value: applied, color: '#0F766E' },
      { name: 'Shortlisted for Review', value: shortlisted, color: '#0284C7' },
      { name: 'Interview Evaluation', value: interviewed, color: '#D97706' },
      { name: 'Formal Campus Offers', value: selected, color: '#059669' },
    ];
  }, [applications]);

  // 3. Branch distribution computed dynamically
  const branchData = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((a) => {
      const b = a.studentBranch || 'Unspecified';
      counts[b] = (counts[b] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [applications]);

  // Derived KPIs
  const totalApps = applications.length;
  const totalOffers = applications.filter((a) => a.status === 'Selected').length;
  const offerRate = totalApps > 0 ? Math.round((totalOffers / totalApps) * 100) : 0;
  const activePostings = jobs.filter((j) => j.status === 'active').length;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-5 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100/70 text-teal-900 border border-teal-200">
              <TrendingUp className="w-3.5 h-3.5 text-teal-700" />
              Recruitment Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Corporate Hiring Analytics
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {currentUser.companyName || 'NovaTech Systems'} • Conversion velocity, candidate pipeline distribution, and academic demographics.
          </p>
        </div>

        <button
          onClick={() => navigate('/recruiter/applicants')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 text-white hover:bg-teal-900 font-semibold text-xs shadow-xs transition-all self-start md:self-auto"
        >
          <span>Evaluate Applicants</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Ribbons */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
          <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
            Total Applicants
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-stone-900">{totalApps}</span>
            <span className="text-xs text-stone-400">across {activePostings} drives</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
          <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
            Shortlist Velocity
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-teal-800">
              {applications.filter((a) => a.status === 'Shortlisted').length}
            </span>
            <span className="text-xs text-stone-400">candidates advanced</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
          <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
            In Evaluation Rounds
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-amber-700">
              {applications.filter((a) => a.status === 'Interview').length}
            </span>
            <span className="text-xs text-stone-400">interviews booked</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
          <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
            Conversion Yield
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-emerald-700">
              {offerRate}%
            </span>
            <span className="text-xs text-stone-400">offers ({totalOffers})</span>
          </div>
        </div>
      </div>

      {/* Row 1: Funnel & Compact Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <ChartFunnel
            title="Recruitment Throughput Funnel"
            description="Progression from candidate submission through technical interviews to verified offer release."
            data={funnelData}
            height={320}
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <ChartSegmentedBar
            title="Candidate Pipeline Status"
            description="Distribution of applicant submissions across live recruitment stages."
            segments={pipelineSegments}
            totalLabel="Applicants"
          />

          <ChartBarHorizontal
            title="Job Postings by Applicant Volume"
            description="Ranked volume of candidate applications received per active job drive."
            data={jobPostingsData}
            barColor="#0284C7"
            height={220}
          />
        </div>
      </div>

      {/* Row 2: Branch Demographics */}
      <div className="grid grid-cols-1 gap-8">
        <ChartBarHorizontal
          title="Applicant Academic Distribution by Branch"
          description="Volume of candidate submissions received across college engineering departments."
          data={branchData}
          barColor="#0F766E"
          height={280}
        />
      </div>
    </div>
  );
};
