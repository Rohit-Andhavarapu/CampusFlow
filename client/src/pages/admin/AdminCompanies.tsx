import React from 'react';
import { Building2, Plus, ExternalLink, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AdminCompanies: React.FC = () => {
  const companies = [
    {
      name: 'NovaTech Systems',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80',
      category: 'Tier-1 Enterprise Partner',
      roles: 3,
      avgPackage: '₹16.5 LPA',
      hiredCount: 5,
      status: 'Drive Completed',
    },
    {
      name: 'Aetos DigiLog',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
      category: 'AI & Machine Learning Partner',
      roles: 2,
      avgPackage: '₹25K/month',
      hiredCount: 2,
      status: 'Interviews Ongoing',
    },
    {
      name: 'Orbit Analytics',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
      category: 'Fintech Analytics',
      roles: 2,
      avgPackage: '₹11.5 LPA',
      hiredCount: 3,
      status: 'Offers Released',
    },
    {
      name: 'Vertex Digital Labs',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80',
      category: 'SaaS & Web Systems',
      roles: 1,
      avgPackage: '₹28K/month',
      hiredCount: 1,
      status: 'Shortlisting',
    },
    {
      name: 'MedRenova Private Limited',
      logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=128&auto=format&fit=crop&q=80',
      category: 'HealthTech & Bio-AI',
      roles: 1,
      avgPackage: '₹20K/month',
      hiredCount: 1,
      status: 'Drive Completed',
    },
    {
      name: 'AgNext Technologies',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80',
      category: 'AgriTech Automation',
      roles: 1,
      avgPackage: '₹15K/month',
      hiredCount: 1,
      status: 'Selected',
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-border/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-text tracking-tight">
            Corporate Hiring Partners
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Empanelled organizations participating in university on-campus placement sessions.
          </p>
        </div>

        <Badge variant="brand" size="md">
          {companies.length} Empanelled Partners
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map((c) => (
          <Card key={c.name} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={c.logo}
                  alt={c.name}
                  className="w-12 h-12 rounded-xl object-cover border border-border shadow-sm flex-shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold text-primary-text">{c.name}</h3>
                  <p className="text-xs text-muted-text">{c.category}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-text">Active Openings:</span>
                  <p className="font-semibold text-primary-text">{c.roles} Roles</p>
                </div>
                <div>
                  <span className="text-muted-text">Average Package:</span>
                  <p className="font-semibold text-primary-text">{c.avgPackage}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
              <Badge variant="success" dot size="sm">
                {c.hiredCount} Students Placed
              </Badge>
              <span className="text-xs text-muted-text">{c.status}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
