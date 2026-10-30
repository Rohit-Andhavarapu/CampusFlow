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
  Users,
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
  const inProcessStudents = syntheticStudents.filter((s) => s.status === 'In Process').length;
  const unplacedStudents = syntheticStudents.filter((s) => s.status === 'Unplaced').length;
  const placementRate = Math.round((placedStudents / totalStudents) * 100);

  const departmentStats = [
    { name: 'Computer Science & Engineering', total: 10, placed: 8, rate: 80 },
    { name: 'Information Technology', total: 5, placed: 3, rate: 60 },
    { name: 'Artificial Intelligence & Data Science', total: 3, placed: 2, rate: 67 },
    { name: 'Electronics & Communication', total: 2, placed: 0, rate: 0 },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Editorial Header */}
      <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-ink-500 uppercase tracking-wider">
            <span>Training & Placement Cell</span>
            <span>•</span>
            <span className="text-brand font-semibold">Institutional Analytics</span>
            <span>•</span>
            <span className="text-ink-400 font-normal">Demonstration Dataset</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 tracking-tight mt-1.5 font-sans">
            Placement Administration Command Center
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 mt-1 max-w-2xl">
            Campus-wide recruitment drive analytics, company empanelment, and student placement progression for Class of 2026.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => navigate('/admin/reports')}
          >
            Export NAAC / NIRF Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<GraduationCap className="w-3.5 h-3.5" />}
            onClick={() => navigate('/admin/students')}
          >
            Student Directory ({totalStudents})
          </Button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Institutional Placement Rate"
          value={`${placementRate}%`}
          subtext={`${placedStudents} of ${totalStudents} graduating students placed`}
          trend={{ value: '12% vs 2025', isPositive: true }}
          variant="success"
        />
        <MetricCard
          label="Registered Batch Size"
          value={totalStudents}
          subtext={`${inProcessStudents} currently interviewing in drives`}
          variant="brand"
          onClick={() => navigate('/admin/students')}
        />
        <MetricCard
          label="Empanelled Partners"
          value={6}
          subtext="Active Tier-1 & Core corporate recruiters"
          onClick={() => navigate('/admin/companies')}
        />
        <MetricCard
          label="Placement Drive Phases"
          value={3}
          subtext="Super-Dream, AI, & Mass hiring tracks"
          variant="warning"
          onClick={() => navigate('/admin/drives')}
        />
      </div>

      {/* Department Analytics & Recent Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Placement Breakdown */}
        <Card className="lg:col-span-2 p-6 border border-border shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-6">
            <div>
              <h3 className="text-sm font-bold text-ink-950 uppercase tracking-wide">
                Department-Wise Placement Conversion
              </h3>
              <p className="text-xs text-ink-500 mt-0.5">
                Class of 2026 verified placement achievement across disciplines
              </p>
            </div>
            <Badge variant="brand" size="sm">
              Batch 2026
            </Badge>
          </div>

          <div className="space-y-5">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-ink-950">{dept.name}</span>
                  <span className="font-mono text-ink-600">
                    {dept.placed} / {dept.total} placed ({dept.rate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-brand h-full rounded-full transition-all duration-500"
                    style={{ width: `${dept.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <p className="text-ink-500 font-medium">Highest Package</p>
              <p className="text-base font-extrabold text-ink-950 font-sans mt-0.5">₹28.0 LPA</p>
            </div>
            <div>
              <p className="text-ink-500 font-medium">Average Package</p>
              <p className="text-base font-extrabold text-ink-950 font-sans mt-0.5">₹14.2 LPA</p>
            </div>
            <div>
              <p className="text-ink-500 font-medium">Median Package</p>
              <p className="text-base font-extrabold text-ink-950 font-sans mt-0.5">₹12.0 LPA</p>
            </div>
          </div>
        </Card>

        {/* Latest Offers Extended List */}
        <Card className="p-6 border border-border shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wide">
              Recent Offers Released
            </h3>
            <span
              className="text-[11px] font-medium text-brand hover:underline cursor-pointer"
              onClick={() => navigate('/admin/students')}
            >
              All Students
            </span>
          </div>

          <div className="divide-y divide-border mt-1">
            {syntheticStudents
              .filter((s) => s.status === 'Placed')
              .slice(0, 5)
              .map((st) => (
                <div key={st.id} className="py-3 first:pt-2 last:pb-0 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-ink-950">{st.name}</p>
                    <p className="text-[11px] text-ink-500">{st.company}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-emerald-700">{st.package}</span>
                    <p className="text-[10px] text-ink-400 font-mono">{st.branch.split(' ')[0]}</p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
