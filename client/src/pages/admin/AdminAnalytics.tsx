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
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 tracking-tight font-sans">
          Institutional Placement Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Historical trends, CTC distribution, gender ratio, and employer hiring performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          label="College Placement Conversion"
          value="70%"
          subtext={`${placedStudents} of ${totalStudents} students secured offers`}
          icon={<Award className="w-5 h-5 text-emerald-600" />}
          variant="success"
        />
        <MetricCard
          label="Average CTC Benchmark"
          value="₹14.2 LPA"
          subtext="Highest across technical universities"
          icon={<TrendingUp className="w-5 h-5 text-teal-700" />}
          variant="brand"
        />
        <MetricCard
          label="Median Internship Stipend"
          value="₹22,000 / mo"
          subtext="6-month pre-placement tracks"
          icon={<Building2 className="w-5 h-5 text-amber-600" />}
          variant="warning"
        />
      </div>

      <Card elevation={1} className="p-6 space-y-4 bg-surface border-slate-200/80">
        <h2 className="text-base font-bold text-ink-950">Salary Tier Distribution (LPA)</h2>
        <div className="space-y-4">
          {[
            { tier: 'Super Dream (> ₹15 LPA)', count: 4, pct: 40 },
            { tier: 'Dream (₹10 – ₹15 LPA)', count: 3, pct: 30 },
            { tier: 'Core Engineering (₹6 – ₹10 LPA)', count: 2, pct: 20 },
            { tier: 'Internship with PPO', count: 1, pct: 10 },
          ].map((item) => (
            <div key={item.tier} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">{item.tier}</span>
                <span className="font-mono text-slate-600">{item.count} offers ({item.pct}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                <div className="bg-teal-700 h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
