import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  Plus,
  X,
  ExternalLink,
  Save,
  AlertCircle,
  Briefcase,
  Code2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';

export const StudentProfile: React.FC<{ activeTabProp?: string }> = ({ activeTabProp = 'profile' }) => {
  const { studentProfile, updateStudentProfile, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<string>(activeTabProp);

  // Form states
  const [formData, setFormData] = useState({
    fullName: studentProfile.fullName,
    rollNo: studentProfile.rollNo,
    email: studentProfile.email,
    phone: studentProfile.phone,
    degree: studentProfile.degree,
    branch: studentProfile.branch,
    graduationYear: studentProfile.graduationYear,
    cgpa: studentProfile.cgpa,
    backlogs: studentProfile.backlogs,
    bio: studentProfile.bio,
    githubUrl: studentProfile.githubUrl,
    linkedinUrl: studentProfile.linkedinUrl,
    portfolioUrl: studentProfile.portfolioUrl,
  });

  const [skills, setSkills] = useState<string[]>(studentProfile.skills);
  const [newSkill, setNewSkill] = useState('');

  // Simulated resume upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedResumeName, setUploadedResumeName] = useState(studentProfile.resumeFileName);

  // Sync state whenever studentProfile updates from database
  useEffect(() => {
    setFormData({
      fullName: studentProfile.fullName,
      rollNo: studentProfile.rollNo,
      email: studentProfile.email,
      phone: studentProfile.phone,
      degree: studentProfile.degree,
      branch: studentProfile.branch,
      graduationYear: studentProfile.graduationYear,
      cgpa: studentProfile.cgpa,
      backlogs: studentProfile.backlogs,
      bio: studentProfile.bio,
      githubUrl: studentProfile.githubUrl,
      linkedinUrl: studentProfile.linkedinUrl,
      portfolioUrl: studentProfile.portfolioUrl,
    });
    setSkills(studentProfile.skills);
    setUploadedResumeName(studentProfile.resumeFileName);
  }, [studentProfile]);

  const tabs = [
    { id: 'profile', label: 'Academic & Personal Info' },
    { id: 'skills', label: 'Skills & Tech Stack', count: skills.length },
    { id: 'projects', label: 'Projects & Experience', count: studentProfile.projects.length },
    { id: 'resume', label: 'Resume & Documents' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      showToast('warning', 'Skill Exists', 'This skill is already in your profile.');
      return;
    }
    const updated = [...skills, newSkill.trim()];
    setSkills(updated);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveAll = () => {
    updateStudentProfile({
      ...formData,
      graduationYear: Number(formData.graduationYear),
      cgpa: Number(formData.cgpa),
      backlogs: Number(formData.backlogs),
      skills,
      resumeFileName: uploadedResumeName,
    });
  };

  const handleSimulateResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      showToast('error', 'Invalid File Type', 'Only PDF resumes are accepted for campus placement.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'File Too Large', 'Maximum resume file size is 5MB.');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setUploadedResumeName(file.name);
      updateStudentProfile({
        resumeFileName: file.name,
        resumeFileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        resumeLastUpdated: new Date().toISOString(),
      });
      setIsUploading(false);
      showToast('success', 'Resume Uploaded', `${file.name} saved and verified.`);
    }, 600);
  };

  const handleDeleteResume = () => {
    setUploadedResumeName(undefined);
    updateStudentProfile({
      resumeFileName: undefined,
      resumeFileSize: undefined,
      resumeLastUpdated: undefined,
    });
    showToast('info', 'Resume Removed', 'Your resume file has been deleted.');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Without Banned Kickers */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 tracking-tight font-sans">
              Profile & Placement Resume
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Keep your academic credentials, verified CGPA, and technical skills updated for automated eligibility matching.
            </p>
          </div>

          <Button
            variant="primary"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSaveAll}
          >
            Save All Changes
          </Button>
        </div>

        <div className="mt-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Tab 1: Personal & Academic Credentials */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <Card className="p-6">
            <h3 className="text-base font-bold text-primary-text mb-1">
              Verified Academic Credentials
            </h3>
            <p className="text-xs text-secondary-text mb-6">
              Official records synced with college examination database.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Input
                label="Full Legal Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
              <Input
                label="College Roll / Registration No"
                value={formData.rollNo}
                disabled
                helperText="Verified by registrar office (Immutable)"
              />
              <Input
                label="Official Campus Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              <Input
                label="Contact Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
              <Input
                label="Degree Program"
                value={formData.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
              />
              <Input
                label="Academic Branch / Specialization"
                value={formData.branch}
                onChange={(e) => handleInputChange('branch', e.target.value)}
              />
              <Input
                label="Graduation Year (Batch)"
                type="number"
                value={formData.graduationYear}
                onChange={(e) => handleInputChange('graduationYear', e.target.value)}
              />
              <Input
                label="Cumulative CGPA (Out of 10.0)"
                type="number"
                step="0.01"
                value={formData.cgpa}
                onChange={(e) => handleInputChange('cgpa', e.target.value)}
                helperText="Used for automated cutoff checks"
              />
              <Input
                label="Active Backlogs"
                type="number"
                value={formData.backlogs}
                onChange={(e) => handleInputChange('backlogs', e.target.value)}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-bold text-primary-text mb-1">
              Online Profiles & Portfolio
            </h3>
            <p className="text-xs text-secondary-text mb-6">
              Recruiters inspect these links during candidate shortlisting.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="GitHub Profile URL"
                value={formData.githubUrl}
                onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                placeholder="https://github.com/..."
              />
              <Input
                label="LinkedIn Profile URL"
                value={formData.linkedinUrl}
                onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
              <Input
                label="Portfolio / Personal Site"
                value={formData.portfolioUrl}
                onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold text-secondary-text uppercase tracking-wide block mb-1.5">
                Executive Professional Bio
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full bg-surface text-primary-text text-sm rounded-button border border-border p-3 focus-ring"
                placeholder="Write a brief summary of your technical interests and engineering background..."
              />
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Skills & Tech Stack */}
      {activeTab === 'skills' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <Card className="p-6">
            <h3 className="text-base font-bold text-primary-text mb-1">
              Verified Technical Skills
            </h3>
            <p className="text-xs text-secondary-text mb-5">
              Skills configured here are compared against recruiter posting requirements.
            </p>

            {/* Add Skill bar */}
            <div className="flex items-center gap-3 max-w-md">
              <Input
                placeholder="e.g. Agentic AI, PyTorch, Docker, Next.js..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={handleAddSkill}
              >
                Add
              </Button>
            </div>

            {/* Current Skills Cloud */}
            <div className="mt-6 pt-5 border-t border-border/60">
              <p className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-3">
                Active Skills ({skills.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary text-primary-text border border-border text-xs font-medium group hover:border-slate-400 transition-colors"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-muted-text hover:text-error transition-colors"
                      title="Remove skill"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Projects & Experience */}
      {activeTab === 'projects' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-primary-text">Showcase Projects</h3>
              <p className="text-xs text-secondary-text">Featured work highlights attached to your campus application dossier.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {studentProfile.projects.map((proj) => (
              <Card key={proj.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-brand" />
                      <h4 className="text-sm font-bold text-primary-text">{proj.title}</h4>
                    </div>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand hover:underline text-xs flex items-center gap-1 font-semibold"
                      >
                        Code <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-secondary-text mt-2.5 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap gap-1.5">
                  {proj.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-surface-secondary text-secondary-text border border-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Resume & Documents */}
      {activeTab === 'resume' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <Card className="p-6">
            <h3 className="text-base font-bold text-primary-text mb-1">
              Campus Placement Master Resume
            </h3>
            <p className="text-xs text-secondary-text mb-6">
              Recruiters download this verified PDF during campus screening and technical review.
            </p>

            {uploadedResumeName ? (
              <div className="p-5 rounded-card bg-surface-secondary/50 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-error-surface text-error flex items-center justify-center flex-shrink-0 border border-error-border">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary-text">{uploadedResumeName}</h4>
                    <p className="text-xs text-muted-text mt-0.5">
                      PDF Document • {studentProfile.resumeFileSize || '1.4 MB'} • Verified for Placement 2026
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center justify-center font-medium transition-all duration-150 rounded-button bg-surface hover:bg-surface-secondary text-primary-text border border-border hover:border-slate-300 shadow-sm text-xs px-2.5 py-1.5 gap-1.5">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleSimulateResumeUpload}
                      className="hidden"
                    />
                    <span>{isUploading ? 'Uploading...' : 'Replace PDF'}</span>
                  </label>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-error hover:bg-error-surface"
                    onClick={handleDeleteResume}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-10 border-2 border-dashed border-border rounded-card text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-brand-surface text-brand flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-primary-text">Upload Master Placement Resume</h4>
                <p className="text-xs text-secondary-text mt-1 max-w-sm">
                  Upload your latest PDF resume (Max 5MB). Required to apply for campus opportunities.
                </p>

                <label className="mt-4 cursor-pointer inline-flex items-center justify-center font-medium transition-all duration-150 rounded-button bg-brand hover:bg-brand-hover text-white shadow-sm shadow-brand/20 border border-transparent text-xs px-3.5 py-2 gap-2">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleSimulateResumeUpload}
                    className="hidden"
                  />
                  <span>{isUploading ? 'Uploading...' : 'Select PDF File'}</span>
                </label>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
