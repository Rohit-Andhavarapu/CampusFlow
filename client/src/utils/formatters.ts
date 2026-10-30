import { ApplicationStatus, JobEligibilityCheck, JobPosting, StudentProfileData } from '../types';

export function formatCurrency(amount: string): string {
  return amount;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getStatusBadgeStyle(status: ApplicationStatus): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'Submitted':
      return {
        bg: 'bg-info-surface',
        text: 'text-info-text',
        border: 'border-info-border',
        dot: 'bg-info',
      };
    case 'Shortlisted':
      return {
        bg: 'bg-brand-surface',
        text: 'text-brand',
        border: 'border-brand/20',
        dot: 'bg-brand',
      };
    case 'Interview':
      return {
        bg: 'bg-warning-surface',
        text: 'text-warning-text',
        border: 'border-warning-border',
        dot: 'bg-warning',
      };
    case 'Selected':
      return {
        bg: 'bg-success-surface',
        text: 'text-success-text',
        border: 'border-success-border',
        dot: 'bg-success',
      };
    case 'Rejected':
      return {
        bg: 'bg-error-surface',
        text: 'text-error-text',
        border: 'border-error-border',
        dot: 'bg-error',
      };
    case 'Withdrawn':
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
      };
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}

export function checkJobEligibility(
  job: JobPosting,
  student: StudentProfileData
): JobEligibilityCheck {
  const criteria = [];
  const reasons: string[] = [];

  // Check 1: CGPA
  const cgpaPassed = student.cgpa >= job.minCgpa;
  criteria.push({
    id: 'cgpa',
    label: 'Minimum CGPA Required',
    requiredValue: `${job.minCgpa.toFixed(1)} CGPA`,
    studentValue: `${student.cgpa.toFixed(1)} CGPA`,
    passed: cgpaPassed,
    details: cgpaPassed
      ? `Your CGPA (${student.cgpa}) meets or exceeds the cutoff (${job.minCgpa}).`
      : `Your CGPA (${student.cgpa}) is below the minimum threshold (${job.minCgpa}).`,
  });
  if (!cgpaPassed) {
    reasons.push(`Minimum CGPA of ${job.minCgpa} required (Current: ${student.cgpa})`);
  }

  // Check 2: Branch
  const branchPassed =
    job.eligibleBranches.length === 0 ||
    job.eligibleBranches.some(
      (b) =>
        b.toLowerCase() === student.branch.toLowerCase() ||
        b.toLowerCase() === 'all branches' ||
        student.branch.toLowerCase().includes(b.toLowerCase())
    );
  criteria.push({
    id: 'branch',
    label: 'Eligible Academic Branches',
    requiredValue: job.eligibleBranches.join(', '),
    studentValue: student.branch,
    passed: branchPassed,
    details: branchPassed
      ? `Your branch (${student.branch}) is included in the eligible branches.`
      : `Your branch (${student.branch}) is not listed in the eligible branches.`,
  });
  if (!branchPassed) {
    reasons.push(`Branch not eligible. Required: ${job.eligibleBranches.join(', ')}`);
  }

  // Check 3: Graduation Year
  const yearPassed =
    job.eligibleGraduationYears.length === 0 ||
    job.eligibleGraduationYears.includes(student.graduationYear);
  criteria.push({
    id: 'year',
    label: 'Graduation Batch',
    requiredValue: `Class of ${job.eligibleGraduationYears.join(' / ')}`,
    studentValue: `Class of ${student.graduationYear}`,
    passed: yearPassed,
    details: yearPassed
      ? `Your graduation year (${student.graduationYear}) is eligible.`
      : `This posting is only open to batches ${job.eligibleGraduationYears.join(', ')}.`,
  });
  if (!yearPassed) {
    reasons.push(
      `Graduation year mismatch. Open to batches: ${job.eligibleGraduationYears.join(', ')}`
    );
  }

  // Check 4: Skills match (at least 1 key skill match or profile skill presence)
  const matchingSkills = job.skillsRequired.filter((skill) =>
    student.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
  );
  const skillPassed = job.skillsRequired.length === 0 || matchingSkills.length > 0;
  criteria.push({
    id: 'skills',
    label: 'Required Skills Match',
    requiredValue: job.skillsRequired.slice(0, 3).join(', ') + (job.skillsRequired.length > 3 ? '...' : ''),
    studentValue: `${matchingSkills.length} of ${job.skillsRequired.length} matched`,
    passed: skillPassed,
    details: skillPassed
      ? `You match ${matchingSkills.length} required skill(s): ${matchingSkills.join(', ')}.`
      : `You haven't added required skills (${job.skillsRequired.join(', ')}) to your profile.`,
  });
  if (!skillPassed) {
    reasons.push(`Missing key skill: ${job.skillsRequired[0]}`);
  }

  const isEligible = cgpaPassed && branchPassed && yearPassed;
  const isIncomplete = !student.resumeFileName || student.skills.length === 0;

  return {
    isEligible,
    isIncomplete,
    reasons,
    criteria,
  };
}
