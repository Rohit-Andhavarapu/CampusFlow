import React from 'react';
import { Layers, Calendar, Clock, Building2, Plus, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AdminDrives: React.FC = () => {
  const drives = [
    {
      title: 'Phase 1: Day Zero Super-Dream Recruitment Drive',
      date: '15 Oct – 30 Oct 2026',
      companies: ['NovaTech Systems', 'Orbit Analytics', 'MedRenova'],
      status: 'In Progress',
      eligibleBatch: '2026 Batch (B.Tech & M.Tech)',
      slots: '18 Offers Released',
    },
    {
      title: 'Agentic AI & Specialized DeepTech Campus Drive',
      date: '1 Nov – 15 Nov 2026',
      companies: ['Aetos DigiLog', 'AgNext Technologies', 'Vertex Digital Labs'],
      status: 'Upcoming',
      eligibleBatch: '2026 & 2027 Batches',
      slots: '12 Target Vacancies',
    },
    {
      title: 'Mass IT Services & Enterprise Trainee Drive',
      date: '20 Nov – 10 Dec 2026',
      companies: ['Sarabhai Information Technology', 'ReArk Digital'],
      status: 'Scheduled',
      eligibleBatch: 'All Engineering Batches (Min 6.5 CGPA)',
      slots: '50+ Vacancies',
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-border/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-text tracking-tight">
            Recruitment Drive Schedules
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Centrally manage university placement phases, batch eligibility, and slot allocations.
          </p>
        </div>

        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Schedule Placement Drive
        </Button>
      </div>

      <div className="space-y-4">
        {drives.map((d) => (
          <Card key={d.title} className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={d.status === 'In Progress' ? 'brand' : 'neutral'} dot size="sm">
                    {d.status}
                  </Badge>
                  <span className="text-xs text-muted-text flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {d.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-primary-text mt-1">{d.title}</h3>
                <p className="text-xs text-secondary-text mt-1">{d.eligibleBatch}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {d.companies.map((c) => (
                    <span
                      key={c}
                      className="text-xs px-2.5 py-0.5 rounded-md bg-surface-secondary text-primary-text border border-border font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-brand">{d.slots}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
