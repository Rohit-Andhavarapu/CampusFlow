import React from 'react';
import { BarChart3, TrendingUp, Award, Building2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { MetricCard } from '../../components/ui/MetricCard';
import { syntheticStudents } from '../../data/mockData';

export const AdminAnalytics: React.FC = () => {
  const totalStudents = syntheticStudents.length;
  const placedStudents = syntheticStudents.filter((s) => s.status === 'Placed').length;

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-2xl font-extrabold text-primary-text tracking-tight">
          Institutional Placement Analytics
        </h1>
        <p className="text-sm text-secondary-text mt-1">
          Historical trends, CTC distribution, gender ratio, and employer hiring performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          label="College Placement Conversion"
          value="70%"
          subtext={`${placedStudents} of ${totalStudents} students secured offers`}
          icon={<Award className="w-5 h-5 text-success" />}
          variant="success"
        />
        <MetricCard
          label="Average CTC Benchmark"
          value="₹14.2 LPA"
          subtext="Highest across technical universities"
          icon={<TrendingUp className="w-5 h-5 text-brand" />}
          variant="brand"
        />
        <MetricCard
          label="Median Internship Stipend"
          value="₹22,000 / mo"
          subtext="6-month pre-placement tracks"
          icon={<Building2 className="w-5 h-5 text-warning" />}
          variant="warning"
        />
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="text-base font-bold text-primary-text">Salary Tier Distribution (LPA)</h3>
        <div className="space-y-3">
          {[
            { tier: 'Super Dream (> ₹15 LPA)', count: 4, pct: 40 },
            { tier: 'Dream (₹10 – ₹15 LPA)', count: 3, pct: 30 },
            { tier: 'Core Engineering (₹6 – ₹10 LPA)', count: 2, pct: 20 },
            { tier: 'Internship with PPO', count: 1, pct: 10 },
          ].map((item) => (
            <div key={item.tier} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>{item.tier}</span>
                <span>{item.count} offers ({item.pct}%)</span>
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
