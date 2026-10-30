import React, { useState } from 'react';
import { Building2, Save, Sparkles, ExternalLink, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const RecruiterCompany: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const [companyData, setCompanyData] = useState({
    name: currentUser.companyName || 'NovaTech Systems',
    industry: 'Enterprise Cloud & Distributed Systems',
    hq: 'Bengaluru, India',
    website: 'https://novatech.io',
    linkedin: 'https://linkedin.com/company/novatech-systems',
    about: 'NovaTech Systems provides high-throughput cloud infrastructure, telemetry microservices, and AI workflow orchestration for Fortune 500 enterprises.',
  });

  return (
    <div className="space-y-6 pb-16 max-w-3xl">
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-2xl font-extrabold text-primary-text tracking-tight">
          Employer Brand Profile
        </h1>
        <p className="text-sm text-secondary-text mt-1">
          This information is displayed to students on the campus opportunities directory.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-border/60">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80"
            alt="Company"
            className="w-16 h-16 rounded-2xl object-cover border border-border"
          />
          <div>
            <h3 className="text-lg font-bold text-primary-text">{companyData.name}</h3>
            <p className="text-xs text-muted-text">{companyData.industry}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            value={companyData.name}
            onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
          />
          <Input
            label="Industry Domain"
            value={companyData.industry}
            onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
          />
          <Input
            label="Headquarters"
            value={companyData.hq}
            onChange={(e) => setCompanyData({ ...companyData, hq: e.target.value })}
          />
          <Input
            label="Official Website"
            value={companyData.website}
            onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-secondary-text uppercase tracking-wide block mb-1.5">
            About Company
          </label>
          <textarea
            rows={3}
            value={companyData.about}
            onChange={(e) => setCompanyData({ ...companyData, about: e.target.value })}
            className="w-full bg-surface text-primary-text text-sm rounded-button border border-border p-3 focus-ring"
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => showToast('success', 'Profile Saved', 'Company branding updated.')}
          >
            Save Profile
          </Button>
        </div>
      </Card>
    </div>
  );
};
