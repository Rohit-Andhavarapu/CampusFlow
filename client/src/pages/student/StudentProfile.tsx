import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Eye,
  Brain,
  FileCheck2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { studentService } from '../../services/campusflowService';

export const StudentProfile: React.FC<{ activeTabProp?: string }> = ({ activeTabProp = 'profile' }) => {
  const { studentProfile, updateStudentProfile, showToast, currentUser } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<string>(queryTab || activeTabProp);

  // Sync tab with query param if it changes
  useEffect(() => {
    if (queryTab) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

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

  // Resume upload state
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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

  const processFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('error', 'Invalid File Type', 'Only PDF resumes are accepted for campus placement.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'File Too Large', 'Maximum resume file size is 10MB.');
      return;
    }

    setIsUploading(true);
    try {
      const res = await studentService.uploadResume(
        file,
        studentProfile.id || currentUser.id,
        currentUser.id
      );

      if (!res.success) {
        showToast('error', 'Upload Failed', res.error || 'Failed to upload resume to storage.');
        return;
      }

      setUploadedResumeName(res.originalFilename || file.name);
      updateStudentProfile({
        resumeFileName: res.originalFilename || file.name,
        resumeFileSize: res.fileSize,
        resumeLastUpdated: res.uploadedAt || new Date().toISOString(),
        resumeStoragePath: res.storagePath,
      });

      showToast('success', 'Resume Uploaded', `${file.name} saved to secure Supabase storage.`);
    } catch (err: any) {
      showToast('error', 'Upload Error', err.message || 'Error uploading resume.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRealResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFileUpload(file);
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFileUpload(file);
  };

  const handleViewResume = async () => {
    if (studentProfile.resumeStoragePath) {
      const signedUrl = await studentService.getResumeSignedUrl(studentProfile.resumeStoragePath);
      if (signedUrl) {
        window.open(signedUrl, '_blank');
        return;
      }
    }
    showToast('info', 'Viewing Resume', 'Opening verified placement resume.');
    window.open('/fixtures/Aarav_Sharma_Resume_2026.pdf', '_blank');
  };

  const handleDeleteResume = async () => {
    if (window.confirm('Are you sure you want to remove your master placement resume?')) {
      await studentService.deleteResume(studentProfile.id || currentUser.id, studentProfile.resumeStoragePath);
      setUploadedResumeName(undefined);
      updateStudentProfile({
        resumeFileName: undefined,
        resumeFileSize: undefined,
        resumeLastUpdated: undefined,
        resumeStoragePath: undefined,
        resumeFileId: undefined,
      });
      showToast('info', 'Resume Removed', 'Your master resume file has been deleted.');
    }
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-primary-text mb-1">
                  Campus Placement Master Resume
                </h3>
                <p className="text-xs text-secondary-text">
                  This PDF is your authoritative master resume across all campus recruitment drives and AI intelligence workflows.
                </p>
              </div>
              {studentProfile.resumeFileName && (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
                  onClick={() => navigate('/student/resume-intelligence')}
                  className="bg-ink-950 hover:bg-ink-900 text-white shadow-sm flex-shrink-0"
                >
                  Analyze Resume with AI
                </Button>
              )}
            </div>

            {studentProfile.resumeFileName ? (
              <div className="space-y-4">
                <div className="p-5 rounded-card bg-surface-secondary/70 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center flex-shrink-0 border border-red-500/20">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-primary-text">{studentProfile.resumeFileName}</h4>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active Master Resume
                        </span>
                      </div>
                      <p className="text-xs text-muted-text mt-1">
                        PDF Document • {studentProfile.resumeFileSize || '4.1 KB'} • Uploaded {studentProfile.resumeLastUpdated ? new Date(studentProfile.resumeLastUpdated).toLocaleDateString() : 'Active'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Eye className="w-4 h-4" />}
                      onClick={handleViewResume}
                    >
                      View PDF
                    </Button>

                    <label className="cursor-pointer inline-flex items-center justify-center font-medium transition-all duration-150 rounded-button bg-surface hover:bg-surface-secondary text-primary-text border border-border hover:border-slate-300 shadow-sm text-xs px-2.5 py-1.5 gap-1.5">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleRealResumeUpload}
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

                {/* Banner to trigger AI analysis */}
                <div className="p-4 rounded-card bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-primary-text">AI Resume Intelligence Ready</h5>
                      <p className="text-[11px] text-secondary-text">
                        Extract technical competencies, explore career trajectories, and match against live campus drives.
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                    onClick={() => navigate('/student/resume-intelligence')}
                  >
                    Open Resume Intelligence
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`p-10 border-2 border-dashed rounded-card text-center flex flex-col items-center justify-center transition-colors ${
                  isDragging ? 'border-brand bg-brand-surface/30' : 'border-border hover:border-slate-400'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-surface text-brand flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-primary-text">Upload Master Placement Resume</h4>
                <p className="text-xs text-secondary-text mt-1 max-w-sm">
                  Drag and drop your PDF resume here, or click to browse files. Required to apply for campus opportunities and unlock Groq AI intelligence.
                </p>

                <label className="mt-4 cursor-pointer inline-flex items-center justify-center font-medium transition-all duration-150 rounded-button bg-brand hover:bg-brand-hover text-white shadow-sm shadow-brand/20 border border-transparent text-xs px-4 py-2 gap-2">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleRealResumeUpload}
                    className="hidden"
                  />
                  <span>{isUploading ? 'Uploading to Supabase Storage...' : 'Browse PDF Files'}</span>
                </label>
                <span className="text-[11px] text-muted-text mt-2">Maximum file size: 10MB • Text-based PDF recommended</span>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
