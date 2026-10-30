import React from 'react';
import { BarChart3, TrendingUp, Users, CheckCircle2, Briefcase } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { MetricCard } from '../../components/ui/MetricCard';
import { useApp } from '../../context/AppContext';

export const RecruiterAnalytics: React.FC = () => {
  const { applications, jobs } = useApp();

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-2xl font-extrabold text-primary-text tracking-tight">
          Campus Recruitment Analytics
        </h1>
        <p className="text-sm text-secondary-text mt-1">
          Hiring funnel velocity, qualification pass-rates, and candidate distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          label="Total Funnel Throughput"
          value={applications.length}
          subtext="Processed by screening engine"
          icon={<Users className="w-5 h-5 text-brand" />}
          variant="brand"
        />
        <MetricCard
          label="Offer Acceptance Rate"
          value="100%"
          subtext="All offers accepted by candidates"
          icon={<CheckCircle2 className="w-5 h-5 text-success" />}
          variant="success"
        />
        <MetricCard
          label="Average Time to Interview"
          value="3.2 Days"
          subtext="Fast-track candidate experience"
          icon={<TrendingUp className="w-5 h-5 text-warning" />}
          variant="warning"
        />
      </div>

      <Card className="p-6">
        <h3 className="text-base font-bold text-primary-text mb-4">Branch Distribution of Candidates</h3>
        <div className="space-y-3">
          {[
            { branch: 'Computer Science & Engineering', count: 12, pct: 60 },
            { branch: 'Information Technology', count: 5, pct: 25 },
            { branch: 'Artificial Intelligence & Data Science', count: 3, pct: 15 },
          ].map((item) => (
            <div key={item.branch} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>{item.branch}</span>
                <span>{item.count} candidates ({item.pct}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-brand h-2 rounded-full" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
