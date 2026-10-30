import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  Layers,
  FileText,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { MetricCard } from '../../components/ui/MetricCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { syntheticStudents } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { jobs, applications } = useApp();
  const navigate = useNavigate();

  const totalStudents = syntheticStudents.length;
  const placedStudents = syntheticStudents.filter((s) => s.status === 'Placed').length;
  const placementRate = Math.round((placedStudents / totalStudents) * 100);
  const activeDrives = 6;
  const participatingCompanies = 14;

  const departmentStats = [
    { name: 'Computer Science', total: 10, placed: 8, rate: 80 },
    { name: 'Information Technology', total: 5, placed: 3, rate: 60 },
    { name: 'Artificial Intelligence', total: 3, placed: 2, rate: 67 },
    { name: 'Electronics & Comm.', total: 2, placed: 0, rate: 0 },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-border/60 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Placement Cell Executive Suite • NIT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight mt-1">
            Placement Administration Command Center
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Campus-wide recruitment drive analytics, company accreditations, and student placement progress for 2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => navigate('/admin/reports')}
          >
            Export NAAC/NIRF Report
          </Button>
          <Button
            variant="primary"
            leftIcon={<GraduationCap className="w-4 h-4" />}
            onClick={() => navigate('/admin/students')}
          >
            Student Directory
          </Button>
        </div>
      </div>

      {/* KPI Metrics Row (Mandatory 3+ useful metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricCard
          label="Placement Rate"
          value={`${placementRate}%`}
          subtext={`${placedStudents} of ${totalStudents} students placed`}
          icon={<Award className="w-5 h-5 text-success" />}
          trend={{ value: '12% vs 2025', isPositive: true }}
          variant="success"
        />
        <MetricCard
          label="Total Eligible Students"
          value={totalStudents}
          subtext="Graduating Class of 2026"
          icon={<GraduationCap className="w-5 h-5 text-brand" />}
          variant="brand"
          onClick={() => navigate('/admin/students')}
        />
        <MetricCard
          label="Participating Companies"
          value={participatingCompanies}
          subtext="Tier-1 & Dream Recruiters"
          icon={<Building2 className="w-5 h-5 text-info" />}
          onClick={() => navigate('/admin/companies')}
        />
        <MetricCard
          label="Active Recruitment Drives"
          value={activeDrives}
          subtext="Ongoing campus rounds"
          icon={<Layers className="w-5 h-5 text-warning" />}
          variant="warning"
          onClick={() => navigate('/admin/drives')}
        />
      </div>

      {/* Analytics Charts & Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department-wise Placement Graph */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-primary-text">Department-Wise Placement Progress</h3>
              <p className="text-xs text-secondary-text">Batch 2026 placement achievement across engineering disciplines</p>
            </div>
            <Badge variant="brand" size="sm">
              Live Audited
            </Badge>
          </div>

          <div className="space-y-5">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-primary-text">{dept.name}</span>
                  <span className="text-secondary-text">
                    {dept.placed} / {dept.total} placed ({dept.rate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                  <div
                    className="bg-brand h-full rounded-full transition-all duration-700"
                    style={{ width: `${dept.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-border/60 grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <p className="text-muted-text">Highest Package</p>
              <p className="text-base font-bold text-primary-text mt-0.5">₹28.0 LPA</p>
            </div>
            <div>
              <p className="text-muted-text">Average Package</p>
              <p className="text-base font-bold text-primary-text mt-0.5">₹14.2 LPA</p>
            </div>
            <div>
              <p className="text-muted-text">Median Package</p>
              <p className="text-base font-bold text-primary-text mt-0.5">₹12.0 LPA</p>
            </div>
          </div>
        </Card>

        {/* Recent Placed Champions */}
        <Card className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <h3 className="text-sm font-bold text-primary-text">Latest Offers Extended</h3>
            <span
              className="text-xs font-semibold text-brand hover:underline cursor-pointer"
              onClick={() => navigate('/admin/students')}
            >
              All Students
            </span>
          </div>

          <div className="divide-y divide-border/50 mt-2">
            {syntheticStudents
              .filter((s) => s.status === 'Placed')
              .slice(0, 5)
              .map((st) => (
                <div key={st.id} className="py-3 first:pt-2 last:pb-1 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-primary-text">{st.name}</p>
                    <p className="text-[11px] text-muted-text">{st.company}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-success-text">{st.package}</span>
                    <p className="text-[10px] text-muted-text">{st.branch.split(' ')[0]}</p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
