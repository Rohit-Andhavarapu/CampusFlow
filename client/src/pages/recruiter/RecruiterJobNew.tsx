import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Building2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const RecruiterJobNew: React.FC = () => {
  const navigate = useNavigate();
  const { createJobPosting, currentUser } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    workMode: 'Hybrid' as 'Remote' | 'On-site' | 'Hybrid',
    type: 'Full-time' as 'Internship' | 'Full-time' | 'Contract',
    location: 'Bengaluru / Hyderabad',
    stipendOrSalary: '₹12.0 - ₹16.0 LPA',
    duration: 'Permanent Full-time',
    openings: 5,
    applyBy: '2026-11-30T18:00',
    minCgpa: 7.5,
    skillsRequired: 'React, TypeScript, Node.js, SQL',
    eligibleBranches: 'Computer Science & Engineering, Information Technology',
    eligibleGraduationYears: '2026',
    description: '',
    websiteUrl: 'https://novatech.io',
    linkedinUrl: 'https://linkedin.com/company/novatech-systems',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJobPosting({
      title: formData.title,
      companyId: 'comp_custom',
      companyName: currentUser.companyName || 'NovaTech Systems',
      companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80',
      location: formData.location,
      workMode: formData.workMode,
      type: formData.type,
      stipendOrSalary: formData.stipendOrSalary,
      duration: formData.duration,
      openings: Number(formData.openings),
      applyBy: formData.applyBy,
      minCgpa: Number(formData.minCgpa),
      skillsRequired: formData.skillsRequired.split(',').map((s) => s.trim()),
      eligibleBranches: formData.eligibleBranches.split(',').map((s) => s.trim()),
      eligibleGraduationYears: formData.eligibleGraduationYears.split(',').map((y) => Number(y.trim())),
      description: formData.description || 'Join our engineering team to solve impactful challenges.',
      responsibilities: ['Write modular production code', 'Collaborate across cross-functional teams'],
      qualifications: ['B.Tech / B.E. in relevant engineering branches'],
      websiteUrl: formData.websiteUrl,
      linkedinUrl: formData.linkedinUrl,
      status: 'active',
    });
    navigate('/recruiter/jobs');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/recruiter/jobs')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-primary-text"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </button>
      </div>

      <div className="border-b border-border/60 pb-5">
        <h1 className="text-2xl font-extrabold text-primary-text tracking-tight">
          Create Campus Job / Internship Posting
        </h1>
        <p className="text-sm text-secondary-text mt-1">
          Define role responsibilities, compensation, and strict academic cutoff rules for automated screening.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-primary-text">Role Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Role Title"
              required
              placeholder="e.g. Associate Software Engineer Trainee"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <div>
              <label className="text-xs font-semibold text-secondary-text uppercase tracking-wide block mb-1.5">
                Work Mode
              </label>
              <select
                value={formData.workMode}
                onChange={(e) => setFormData({ ...formData, workMode: e.target.value as any })}
                className="w-full bg-surface text-primary-text text-sm rounded-button border border-border p-2 focus-ring"
              >
                <option value="Remote">Remote / WFH</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-secondary-text uppercase tracking-wide block mb-1.5">
                Employment Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full bg-surface text-primary-text text-sm rounded-button border border-border p-2 focus-ring"
              >
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
              </select>
            </div>

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            <Input
              label="Stipend / Annual CTC"
              value={formData.stipendOrSalary}
              onChange={(e) => setFormData({ ...formData, stipendOrSalary: e.target.value })}
            />

            <Input
              label="Open Vacancies"
              type="number"
              value={formData.openings}
              onChange={(e) => setFormData({ ...formData, openings: Number(e.target.value) })}
            />

            <Input
              label="Application Deadline"
              type="datetime-local"
              value={formData.applyBy}
              onChange={(e) => setFormData({ ...formData, applyBy: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary-text uppercase tracking-wide block mb-1.5">
              Role Overview & Responsibilities
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe the opportunity, technical challenges, and growth opportunities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-surface text-primary-text text-sm rounded-button border border-border p-3 focus-ring"
            />
          </div>
        </Card>

        {/* Eligibility Rules Configuration */}
        <Card className="p-6 space-y-4 border-brand/20 bg-brand-surface/20">
          <div className="flex items-center gap-2 text-brand font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Automated Eligibility Filter Rules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum CGPA Cutoff (0-10)"
              type="number"
              step="0.1"
              value={formData.minCgpa}
              onChange={(e) => setFormData({ ...formData, minCgpa: Number(e.target.value) })}
            />

            <Input
              label="Target Graduation Years (Comma-separated)"
              value={formData.eligibleGraduationYears}
              onChange={(e) => setFormData({ ...formData, eligibleGraduationYears: e.target.value })}
            />

            <div className="sm:col-span-2">
              <Input
                label="Eligible Branches (Comma-separated)"
                value={formData.eligibleBranches}
                onChange={(e) => setFormData({ ...formData, eligibleBranches: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Required Skills (Comma-separated)"
                value={formData.skillsRequired}
                onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/recruiter/jobs')}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" leftIcon={<Save className="w-4 h-4" />}>
            Publish Vacancy
          </Button>
        </div>
      </form>
    </div>
  );
};
