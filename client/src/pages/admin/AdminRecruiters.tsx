import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Building2,
  Mail,
  ShieldCheck,
  Clock,
  Trash2,
  Send,
  Search,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Dialog } from '../../components/ui/Dialog';
import {
  recruiterManagementService,
  companyService,
  ManagedRecruiter,
} from '../../services/campusflowService';

export const AdminRecruiters: React.FC = () => {
  const [recruiters, setRecruiters] = useState<ManagedRecruiter[]>([]);
  const [companies, setCompanies] = useState<Array<{ id: string; name: string; industry?: string; logo_path?: string | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending'>('all');

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [designation, setDesignation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recruiterRes, companyList] = await Promise.all([
        recruiterManagementService.listRecruiters(),
        companyService.fetchCompanies(),
      ]);

      if (recruiterRes.success) {
        setRecruiters(recruiterRes.recruiters);
      }
      setCompanies(companyList);
      if (companyList.length > 0 && !selectedCompanyId) {
        setSelectedCompanyId(companyList[0].id);
      }
    } catch (err) {
      console.error('Failed to load recruiter data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !email.trim() || !selectedCompanyId || !designation.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const company = companies.find((c) => c.id === selectedCompanyId);

    setSubmitting(true);
    const res = await recruiterManagementService.inviteRecruiter({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      companyId: selectedCompanyId,
      companyName: company?.name || 'Partner Enterprise',
      designation: designation.trim(),
    });
    setSubmitting(false);

    if (!res.success) {
      setFormError(res.error || 'Failed to provision recruiter access.');
      return;
    }

    setIsInviteOpen(false);
    setFullName('');
    setEmail('');
    setDesignation('');
    setActionNotice({
      message: res.message || `Recruiter access provisioned for ${fullName}!`,
      type: 'success',
    });
    setTimeout(() => setActionNotice(null), 5000);
    loadData();
  };

  const handleResend = async (emailToResend: string) => {
    const res = await recruiterManagementService.resendInvitation(emailToResend);
    if (res.success) {
      setActionNotice({
        message: `Invitation resent to ${emailToResend}.`,
        type: 'success',
      });
    } else {
      setActionNotice({
        message: res.error || 'Failed to resend invitation.',
        type: 'error',
      });
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleRevoke = async (recruiterId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to revoke recruitment access for ${name}? They will lose access to corporate applicant data immediately.`)) {
      return;
    }

    const res = await recruiterManagementService.revokeRecruiter(recruiterId);
    if (res.success) {
      setActionNotice({
        message: `Access revoked for ${name}.`,
        type: 'success',
      });
      loadData();
    } else {
      setActionNotice({
        message: res.error || 'Failed to revoke access.',
        type: 'error',
      });
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Filtered recruiters
  const filteredRecruiters = recruiters.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.designation.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'active') {
      return matchesSearch && (r.status === 'active' || r.status === 'accepted');
    }
    if (filterStatus === 'pending') {
      return matchesSearch && (r.status === 'pending' || r.status === 'invited');
    }
    return matchesSearch;
  });

  const totalActive = recruiters.filter((r) => r.status === 'active' || r.status === 'accepted').length;
  const totalPending = recruiters.filter((r) => r.status === 'pending' || r.status === 'invited').length;
  const uniqueCompanies = new Set(recruiters.map((r) => r.companyName)).size;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="border-b border-border/60 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="success" className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-xs font-semibold px-2.5 py-0.5">
              Placement Cell Authorization
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> RLS Isolated
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight font-serif">
            Recruiter Access Management
          </h1>
          <p className="text-sm text-secondary-text mt-1 max-w-2xl leading-relaxed">
            Provision verified corporate talent partners, issue secure company-scoped credentials, and monitor recruitment access across verified enterprise hiring teams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="gap-1.5 text-xs text-secondary-text hover:text-primary-text"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setIsInviteOpen(true)}
            className="gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium shadow-sm transition-all text-sm px-4 py-2"
          >
            <UserPlus className="w-4 h-4" />
            Invite Recruiter
          </Button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{actionNotice.message}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-xs opacity-70 hover:opacity-100 font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-border/80 shadow-xs bg-card">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Recruiters</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-primary-text">{totalActive}</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Authenticated corporate users
          </p>
        </Card>

        <Card className="p-4 border-border/80 shadow-xs bg-card">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Corporate Partners</span>
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary-text">{uniqueCompanies || companies.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Verified partner enterprises</p>
        </Card>

        <Card className="p-4 border-border/80 shadow-xs bg-card">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Pending Invites</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{totalPending}</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting initial corporate login</p>
        </Card>

        <Card className="p-4 border-border/80 shadow-xs bg-card">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Security Guard</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-primary-text">100%</div>
          <p className="text-xs text-muted-foreground mt-1">Single-company scoped RLS</p>
        </Card>
      </div>

      {/* Directory Controls & Table */}
      <Card className="border-border/80 shadow-xs overflow-hidden">
        {/* Table Header Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by recruiter name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-border bg-card text-primary-text placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium mr-1">Status:</span>
            {(['all', 'active', 'pending'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors capitalize ${
                  filterStatus === s
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-muted/60 text-secondary-text hover:bg-muted hover:text-primary-text'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Recruiter List */}
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-700" />
            <p className="text-sm">Synchronizing authorized recruiters...</p>
          </div>
        ) : filteredRecruiters.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-semibold text-primary-text">No recruiters found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {searchQuery
                ? 'No recruiter matches your current search filters.'
                : 'Click "Invite Recruiter" above to grant recruitment credentials to a corporate talent partner.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 sm:px-6">Recruiter</th>
                  <th className="py-3.5 px-4">Partner Company</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredRecruiters.map((recruiter) => {
                  const isActive = recruiter.status === 'active' || recruiter.status === 'accepted';
                  return (
                    <tr
                      key={recruiter.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-center text-xs shrink-0 ring-1 ring-emerald-600/20">
                            {recruiter.fullName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-primary-text flex items-center gap-1.5">
                              {recruiter.fullName}
                              {recruiter.email === 'priya.nair@novatech.io' && (
                                <span className="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 px-1.5 py-0.2 rounded font-mono">
                                  Demo
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {recruiter.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span className="font-medium text-primary-text">{recruiter.companyName}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs text-secondary-text">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                          {recruiter.designation}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <Badge
                          variant={isActive ? 'success' : 'warning'}
                          className={
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-[11px] font-medium'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-800 text-[11px] font-medium'
                          }
                        >
                          {isActive ? 'Active Member' : 'Pending Invite'}
                        </Badge>
                      </td>

                      <td className="py-4 px-4 text-xs text-muted-foreground">
                        {new Date(recruiter.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResend(recruiter.email)}
                              className="text-xs text-secondary-text hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 gap-1 h-8 px-2.5"
                              title="Resend corporate invitation email"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Resend</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevoke(recruiter.id, recruiter.fullName)}
                            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1 h-8 px-2.5"
                            title="Revoke recruitment access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Revoke</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Invite Recruiter Modal */}
      <Dialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite Corporate Recruiter"
        description="Issue verified recruitment credentials tied to an authorized hiring partner organization."
        maxWidth="md"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 pt-2">
          {formError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-primary-text mb-1 uppercase tracking-wider">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Malhotra"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card text-primary-text placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary-text mb-1 uppercase tracking-wider">
              Corporate Work Email *
            </label>
            <input
              type="email"
              required
              placeholder="recruiter@enterprise-partner.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card text-primary-text placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              An invitation with initial credentials will be provisioned for this email.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary-text mb-1 uppercase tracking-wider">
              Partner Company *
            </label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card text-primary-text focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.industry ? `(${c.industry})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary-text mb-1 uppercase tracking-wider">
              Corporate Designation / Role *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lead University Talent Acquisition"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card text-primary-text placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          <div className="p-3 bg-muted/50 rounded-lg border border-border/80 text-xs text-secondary-text space-y-1">
            <div className="font-semibold text-primary-text flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Corporate Security Guarantee
            </div>
            <p>
              Recruiter accounts can only view student applicants for jobs posted by their assigned organization. Row Level Security guarantees data isolation between corporate competitors.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsInviteOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-medium gap-2"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Provisioning...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Provision Access
                </>
              )}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
