import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import {
  X,
  Lock,
  Calendar,
  Clock,
  Search,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Star,
  Users,
  LogOut,
  Ban,
  FileSpreadsheet,
  Database,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  ArchiveRestore,
} from 'lucide-react';
import { AppointmentStatus, OperatingHours } from '../types';
import { ALL_DAILY_SLOTS } from '../context/ClinicContext';

export const AdminModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    appointments,
    deletedAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    deleteOldAppointments,
    restoreDeletedAppointment,
    undoLastDelete,
    clearDeletedAppointments,
    permanentlyDeleteOne,
    blockedSlots,
    addBlockedSlot,
    removeBlockedSlot,
    clinicConfig,
    updateClinicConfig,
    reviews,
    addReview,
    addAppointment,
    supabaseSyncInfo,
    refreshFromSupabase,
  } = useClinic();

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // Admin tabs: 'appointments' | 'block_slots' | 'settings' | 'reviews' | 'database'
  const [activeTab, setActiveTab] = useState<'appointments' | 'block_slots' | 'settings' | 'reviews' | 'database'>('appointments');
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Delete & Undo state
  const [showCleanupModal, setShowCleanupModal] = useState(false);
  const [showTrashView, setShowTrashView] = useState(false);
  const [confirmPurgeTrash, setConfirmPurgeTrash] = useState(false);
  const [undoBanner, setUndoBanner] = useState<{ message: string; count: number } | null>(null);

  // Appointments filter state
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Manual appointment form state
  const [showAddApt, setShowAddApt] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualMobile, setManualMobile] = useState('');
  const [manualTreatment, setManualTreatment] = useState('General Dental Consultation');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualTime, setManualTime] = useState('11:15 AM');
  const [manualNotes, setManualNotes] = useState('');

  // Block slot form
  const [blockDate, setBlockDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockTime, setBlockTime] = useState('11:15 AM');
  const [blockReason, setBlockReason] = useState('Doctor attending surgical procedure');

  // Clinic config form draft
  const [configDraft, setConfigDraft] = useState(clinicConfig);

  // New review form
  const [showAddReview, setShowAddReview] = useState(false);
  const [revAuthor, setRevAuthor] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revTreatment, setRevTreatment] = useState('Root Canal Treatment');
  const [revComment, setRevComment] = useState('');

  if (!isAdminModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(passwordInput);
    if (!ok) {
      setLoginError(true);
    } else {
      setLoginError(false);
      setPasswordInput('');
    }
  };

  // Cleanup statistics
  const todayStr = new Date().toISOString().split('T')[0];
  const thirtyDaysAgoStr = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

  const pastAppointmentsCount = appointments.filter((a) => a.date < todayStr).length;
  const completedCancelledCount = appointments.filter(
    (a) => a.status === 'Completed' || a.status === 'Cancelled'
  ).length;
  const olderThan30DaysCount = appointments.filter((a) => a.date < thirtyDaysAgoStr).length;

  const handleDeleteSingle = (apt: any) => {
    deleteAppointment(apt.id);
    setUndoBanner({
      message: `Deleted appointment for ${apt.patientName} (${apt.referenceCode})`,
      count: 1,
    });
  };

  const handleBatchCleanup = (filter: 'all_past' | 'completed_cancelled' | 'older_than_30_days') => {
    const deletedCount = deleteOldAppointments(filter);
    setShowCleanupModal(false);
    if (deletedCount > 0) {
      const label =
        filter === 'all_past'
          ? 'past-date'
          : filter === 'completed_cancelled'
          ? 'completed/cancelled'
          : '30+ days old';
      setUndoBanner({
        message: `Deleted ${deletedCount} ${label} appointment(s)`,
        count: deletedCount,
      });
    }
  };

  const handleUndo = () => {
    const ok = undoLastDelete();
    if (ok) {
      setUndoBanner(null);
    }
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    const matchesDate = !dateFilter || apt.date === dateFilter;
    const matchesSearch =
      !searchQuery ||
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.mobile.includes(searchQuery) ||
      apt.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.treatment.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDate && matchesSearch;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Ref Code', 'Patient Name', 'Mobile', 'Email', 'Treatment', 'Date', 'Time Slot', 'Status', 'Notes', 'Created At'];
    const rows = appointments.map((a) => [
      a.referenceCode,
      `"${a.patientName.replace(/"/g, '""')}"`,
      a.mobile,
      a.email || '',
      `"${a.treatment.replace(/"/g, '""')}"`,
      a.date,
      a.timeSlot,
      a.status,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
      a.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `km_dental_appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualMobile.trim()) return;

    addAppointment({
      patientName: manualName.trim(),
      mobile: manualMobile.trim(),
      treatment: manualTreatment,
      date: manualDate,
      timeSlot: manualTime,
      isExistingPatient: false,
      notes: manualNotes ? `Walk-in / Reception booking: ${manualNotes}` : 'Walk-in / Reception entry',
    });

    setShowAddApt(false);
    setManualName('');
    setManualMobile('');
    setManualNotes('');
  };

  const handleBlockSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate || !blockTime) return;
    addBlockedSlot(blockDate, blockTime, blockReason);
    setBlockReason('');
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateClinicConfig(configDraft);
    alert('Clinic configuration updated successfully!');
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revAuthor.trim() || !revComment.trim()) return;
    addReview({
      author: revAuthor.trim(),
      rating: revRating,
      treatmentTag: revTreatment,
      comment: revComment.trim(),
    });
    setShowAddReview(false);
    setRevAuthor('');
    setRevComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#0B1E33] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">Clinic Staff Administration</h3>
              <p className="text-xs text-slate-300">K.M Dental Care Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In - Password Prompt */}
        {!isAdminLoggedIn ? (
          <div className="p-8 max-w-md mx-auto text-center w-full my-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-teal-800" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">Clinic Staff Administration</h4>
            <p className="text-xs text-slate-500 mb-6">
              Enter the staff password to access patient bookings, calendar slots, and clinic management.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  placeholder="Enter staff password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full text-center text-sm font-medium px-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  Incorrect password. Please try again.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0B1E33] hover:bg-[#122c4a] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Logged In - Full Admin Portal */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs Bar */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 bg-slate-50 shrink-0 text-xs font-medium">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'appointments'
                    ? 'border-teal-700 text-teal-900 font-semibold bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Appointments ({appointments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('block_slots')}
                className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'block_slots'
                    ? 'border-teal-700 text-teal-900 font-semibold bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Block Slots ({blockedSlots.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'settings'
                    ? 'border-teal-700 text-teal-900 font-semibold bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Operating Hours & NAP</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'reviews'
                    ? 'border-teal-700 text-teal-900 font-semibold bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Reviews & Proof</span>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'database'
                    ? 'border-teal-700 text-teal-900 font-semibold bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase Database</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB 1: APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  {/* Actions & Filters */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[300px]">
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Search patient, phone, ref or treatment..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none text-slate-700 font-medium"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="No-show">No-show</option>
                      </select>

                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
                      />
                      {dateFilter && (
                        <button
                          onClick={() => setDateFilter('')}
                          className="text-[11px] text-teal-700 underline"
                        >
                          Clear Date
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Bulk delete old appointments button */}
                      <button
                        onClick={() => setShowCleanupModal(!showCleanupModal)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Delete old or completed appointments"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete Old</span>
                        {(pastAppointmentsCount > 0 || completedCancelledCount > 0) && (
                          <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-800 text-[10px] flex items-center justify-center font-bold">
                            {pastAppointmentsCount + completedCancelledCount}
                          </span>
                        )}
                      </button>

                      {/* Recently Deleted / Trash view button */}
                      <button
                        onClick={() => setShowTrashView(true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                          deletedAppointments.length > 0
                            ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                        title="View deleted appointments and undo"
                      >
                        <ArchiveRestore className="w-3.5 h-3.5 text-amber-700" />
                        <span>Trash ({deletedAppointments.length})</span>
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Export CSV</span>
                      </button>

                      <button
                        onClick={() => setShowAddApt(!showAddApt)}
                        className="px-3 py-1.5 bg-[#0B1E33] hover:bg-[#122c4a] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Walk-In / Call</span>
                      </button>
                    </div>
                  </div>

                  {/* Floating Undo Banner */}
                  {undoBanner && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs flex items-center justify-between text-amber-900 shadow-xs">
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>{undoBanner.message}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleUndo}
                          className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Undo Deletion</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUndoBanner(null)}
                          className="p-1 text-amber-700 hover:text-amber-900"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Clean Up Old Appointments Options Panel */}
                  {showCleanupModal && (
                    <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trash2 className="w-4 h-4 text-rose-700" />
                          <h5 className="font-bold text-xs text-rose-900">
                            Clean Up Old Appointments
                          </h5>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowCleanupModal(false)}
                          className="text-slate-400 hover:text-slate-700 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-600">
                        Select which outdated appointments to remove. All deletions can be undone immediately or restored from Trash.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleBatchCleanup('all_past')}
                          disabled={pastAppointmentsCount === 0}
                          className="p-3 bg-white border border-rose-200 rounded-xl text-left hover:bg-rose-50/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="font-semibold text-xs text-rose-900">
                            Past Dates ({pastAppointmentsCount})
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Scheduled before today ({todayStr})
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBatchCleanup('completed_cancelled')}
                          disabled={completedCancelledCount === 0}
                          className="p-3 bg-white border border-rose-200 rounded-xl text-left hover:bg-rose-50/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="font-semibold text-xs text-rose-900">
                            Completed & Cancelled ({completedCancelledCount})
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Finished or cancelled visits
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBatchCleanup('older_than_30_days')}
                          disabled={olderThan30DaysCount === 0}
                          className="p-3 bg-white border border-rose-200 rounded-xl text-left hover:bg-rose-50/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="font-semibold text-xs text-rose-900">
                            Older than 30 Days ({olderThan30DaysCount})
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Scheduled before {thirtyDaysAgoStr}
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Manual add walk-in form */}
                  {showAddApt && (
                    <form onSubmit={handleAddManualSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="font-semibold text-xs text-slate-900">Add Walk-In / Phone Patient</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Patient Full Name"
                          value={manualName}
                          onChange={(e) => setManualName(e.target.value)}
                          className="p-2 border border-slate-200 rounded text-xs bg-white"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Mobile Number"
                          value={manualMobile}
                          onChange={(e) => setManualMobile(e.target.value)}
                          className="p-2 border border-slate-200 rounded text-xs bg-white"
                        />
                        <select
                          value={manualTreatment}
                          onChange={(e) => setManualTreatment(e.target.value)}
                          className="p-2 border border-slate-200 rounded text-xs bg-white"
                        >
                          <option value="General Dental Consultation">General Dental Consultation</option>
                          <option value="Root Canal Treatment">Root Canal Treatment</option>
                          <option value="Teeth Cleaning & Scaling">Teeth Cleaning & Scaling</option>
                          <option value="Teeth Filling & Restoration">Teeth Filling & Restoration</option>
                          <option value="Dental Implants">Dental Implants</option>
                          <option value="Dental Crowns / Capping">Dental Crowns / Capping</option>
                          <option value="Orthodontic Treatment">Orthodontic Treatment</option>
                          <option value="Tooth Extraction">Tooth Extraction</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="date"
                          required
                          value={manualDate}
                          onChange={(e) => setManualDate(e.target.value)}
                          className="p-2 border border-slate-200 rounded text-xs bg-white"
                        />
                        <select
                          value={manualTime}
                          onChange={(e) => setManualTime(e.target.value)}
                          className="p-2 border border-slate-200 rounded text-xs bg-white"
                        >
                          {ALL_DAILY_SLOTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Notes or clinical symptom"
                          value={manualNotes}
                          onChange={(e) => setManualNotes(e.target.value)}
                          className="p-2 border border-slate-200 rounded text-xs bg-white"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddApt(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs bg-teal-700 text-white font-semibold rounded hover:bg-teal-800"
                        >
                          Save Appointment
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Appointments Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                            <th className="py-2.5 px-3">Ref</th>
                            <th className="py-2.5 px-3">Patient</th>
                            <th className="py-2.5 px-3">Mobile</th>
                            <th className="py-2.5 px-3">Treatment</th>
                            <th className="py-2.5 px-3">Date & Time</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredAppointments.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-400">
                                No appointments found matching current filters.
                              </td>
                            </tr>
                          ) : (
                            filteredAppointments.map((apt) => (
                              <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-2.5 px-3 font-mono font-bold text-teal-800">
                                  {apt.referenceCode}
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="font-semibold text-slate-900">{apt.patientName}</div>
                                  {apt.notes && (
                                    <div className="text-[10px] text-slate-500 line-clamp-1 italic">{apt.notes}</div>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-slate-700">
                                  <a href={`tel:${apt.mobile}`} className="hover:text-teal-700 hover:underline">
                                    +91 {apt.mobile}
                                  </a>
                                </td>
                                <td className="py-2.5 px-3 text-slate-800 font-medium">
                                  {apt.treatment}
                                </td>
                                <td className="py-2.5 px-3 text-slate-700">
                                  <div>{apt.date}</div>
                                  <div className="text-[11px] text-slate-500">{apt.timeSlot}</div>
                                </td>
                                <td className="py-2.5 px-3">
                                  <select
                                    value={apt.status}
                                    onChange={(e) =>
                                      updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)
                                    }
                                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                      apt.status === 'Confirmed'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                        : apt.status === 'Completed'
                                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                                        : apt.status === 'Cancelled'
                                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                                        : apt.status === 'No-show'
                                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                                        : 'bg-amber-50 text-amber-800 border-amber-200'
                                    }`}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="No-show">No-show</option>
                                  </select>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    {apt.status === 'Pending' && (
                                      <button
                                        onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                                        title="Confirm appointment"
                                        className="p-1 rounded text-emerald-700 hover:bg-emerald-50"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                                    )}
                                    {apt.status !== 'Cancelled' && (
                                      <button
                                        onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                                        title="Cancel appointment"
                                        className="p-1 rounded text-rose-600 hover:bg-rose-50"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSingle(apt)}
                                      title="Delete appointment"
                                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-0.5"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recently Deleted / Trash Modal */}
                  {showTrashView && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
                              <ArchiveRestore className="w-5 h-5 text-amber-700" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-slate-900">
                                Deleted Appointments ({deletedAppointments.length})
                              </h4>
                              <p className="text-[11px] text-slate-500">
                                Recover or restore any deleted appointment back to your active schedule.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowTrashView(false)}
                            className="p-1 text-slate-400 hover:text-slate-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {deletedAppointments.length === 0 ? (
                          <div className="py-10 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-200">
                            Trash is empty. No deleted appointments found.
                          </div>
                        ) : (
                          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                            {deletedAppointments.map((d) => (
                              <div
                                key={d.id}
                                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                              >
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-2">
                                    <span>{d.patientName}</span>
                                    <span className="font-mono text-[11px] text-teal-800 font-semibold">
                                      {d.referenceCode}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-normal">
                                      ({d.status})
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    {d.treatment} · {d.date} at {d.timeSlot} · +91 {d.mobile}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => restoreDeletedAppointment(d.id)}
                                    className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                                    title="Restore appointment"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Restore</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => permanentlyDeleteOne(d.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    title="Delete forever from trash"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                          {!confirmPurgeTrash ? (
                            <button
                              type="button"
                              onClick={() => setConfirmPurgeTrash(true)}
                              disabled={deletedAppointments.length === 0}
                              className="px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded-lg font-medium border border-rose-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Empty Trash Permanently</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-lg text-xs">
                              <span className="font-semibold text-rose-900">
                                Delete all {deletedAppointments.length} forever?
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  clearDeletedAppointments();
                                  setConfirmPurgeTrash(false);
                                  setUndoBanner(null);
                                }}
                                className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded text-xs transition-colors shadow-2xs"
                              >
                                Yes, Empty Now
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmPurgeTrash(false)}
                                className="px-2 py-1 text-slate-600 hover:text-slate-900 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {deletedAppointments.length > 0 && !confirmPurgeTrash && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleUndo();
                                  setShowTrashView(false);
                                }}
                                className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Restore Last Batch</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setShowTrashView(false);
                                setConfirmPurgeTrash(false);
                              }}
                              className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: BLOCK SLOTS */}
              {activeTab === 'block_slots' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">Block Unavailable Clinic Hours</h4>
                    <p className="text-xs text-slate-500">
                      Reserve or prevent public patient booking for specific time slots when the doctor is in surgery, attending an emergency, or out of the operatory.
                    </p>
                  </div>

                  <form onSubmit={handleBlockSlotSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Date to Block</label>
                        <input
                          type="date"
                          required
                          value={blockDate}
                          onChange={(e) => setBlockDate(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                        <select
                          value={blockTime}
                          onChange={(e) => setBlockTime(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                        >
                          {ALL_DAILY_SLOTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Note</label>
                        <input
                          type="text"
                          placeholder="e.g. Doctor in emergency surgery"
                          value={blockReason}
                          onChange={(e) => setBlockReason(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Block This Slot</span>
                      </button>
                    </div>
                  </form>

                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Currently Blocked Slots</h5>
                    {blockedSlots.length === 0 ? (
                      <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                        No slots are currently blocked. Public schedule is fully available.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {blockedSlots.map((b) => (
                          <div key={b.id} className="p-3 bg-white border border-rose-200 rounded-lg flex items-center justify-between text-xs">
                            <div>
                              <div className="font-semibold text-slate-900">{b.date} · {b.timeSlot}</div>
                              <div className="text-[11px] text-rose-700">{b.reason}</div>
                            </div>
                            <button
                              onClick={() => removeBlockedSlot(b.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded"
                              title="Unblock slot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: CLINIC SETTINGS & HOURS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveConfig} className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">Edit Clinic Business Information</h4>
                    <p className="text-xs text-slate-500">
                      As noted in the clinic brief, hours and ratings may be updated by staff to reflect schedule revisions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Clinic Name</label>
                      <input
                        type="text"
                        value={configDraft.name}
                        onChange={(e) => setConfigDraft({ ...configDraft, name: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={configDraft.phone}
                        onChange={(e) => setConfigDraft({ ...configDraft, phone: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Address Line 1</label>
                      <input
                        type="text"
                        value={configDraft.addressLine1}
                        onChange={(e) => setConfigDraft({ ...configDraft, addressLine1: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">City, State & Pin</label>
                      <input
                        type="text"
                        value={`${configDraft.city}, ${configDraft.state} ${configDraft.pincode}`}
                        disabled
                        className="w-full p-2 border border-slate-200 rounded text-xs bg-slate-50 text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Google Rating (e.g. 4.8)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={configDraft.googleRating}
                        onChange={(e) => setConfigDraft({ ...configDraft, googleRating: parseFloat(e.target.value) || 4.8 })}
                        className="w-full p-2 border border-slate-200 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Total Reviews Count</label>
                      <input
                        type="number"
                        value={configDraft.reviewCount}
                        onChange={(e) => setConfigDraft({ ...configDraft, reviewCount: parseInt(e.target.value) || 193 })}
                        className="w-full p-2 border border-slate-200 rounded text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Weekly Operating Hours</h5>
                    <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50">
                      {configDraft.operatingHours.map((h, idx) => (
                        <div key={h.day} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0">
                          <span className="font-semibold text-slate-800 w-28">{h.day}</span>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                              <input
                                type="checkbox"
                                checked={h.isOpen}
                                onChange={(e) => {
                                  const updated = [...configDraft.operatingHours];
                                  updated[idx] = { ...h, isOpen: e.target.checked };
                                  setConfigDraft({ ...configDraft, operatingHours: updated });
                                }}
                              />
                              <span>Open</span>
                            </label>

                            <input
                              type="text"
                              value={h.openTime}
                              disabled={!h.isOpen}
                              onChange={(e) => {
                                const updated = [...configDraft.operatingHours];
                                updated[idx] = { ...h, openTime: e.target.value };
                                setConfigDraft({ ...configDraft, operatingHours: updated });
                              }}
                              className="w-24 p-1 text-xs border border-slate-200 rounded bg-white text-center"
                            />
                            <span className="text-slate-400">to</span>
                            <input
                              type="text"
                              value={h.closeTime}
                              disabled={!h.isOpen}
                              onChange={(e) => {
                                const updated = [...configDraft.operatingHours];
                                updated[idx] = { ...h, closeTime: e.target.value };
                                setConfigDraft({ ...configDraft, operatingHours: updated });
                              }}
                              className="w-24 p-1 text-xs border border-slate-200 rounded bg-white text-center"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      Save Clinic Settings
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: REVIEWS & PROOF */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">Patient Testimonials & Reviews</h4>
                      <p className="text-xs text-slate-500">Manage patient feedback displayed on the website.</p>
                    </div>
                    <button
                      onClick={() => setShowAddReview(!showAddReview)}
                      className="px-3 py-1.5 bg-[#0B1E33] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Patient Feedback</span>
                    </button>
                  </div>

                  {showAddReview && (
                    <form onSubmit={handleCreateReview} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Patient Name / Initial (e.g. Ramesh K.)"
                          value={revAuthor}
                          onChange={(e) => setRevAuthor(e.target.value)}
                          className="p-2 border border-slate-200 rounded text-xs bg-white"
                        />
                        <select
                          value={revRating}
                          onChange={(e) => setRevRating(Number(e.target.value))}
                          className="p-2 border border-slate-200 rounded text-xs bg-white"
                        >
                          <option value={5}>5.0 Stars (Excellent)</option>
                          <option value={4.8}>4.8 Stars</option>
                          <option value={4.5}>4.5 Stars</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Treatment tag (e.g. Root Canal Treatment)"
                          value={revTreatment}
                          onChange={(e) => setRevTreatment(e.target.value)}
                          className="p-2 border border-slate-200 rounded text-xs bg-white"
                        />
                      </div>
                      <textarea
                        required
                        rows={3}
                        placeholder="Verified feedback quote..."
                        value={revComment}
                        onChange={(e) => setRevComment(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded text-xs bg-white resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddReview(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs bg-teal-700 text-white font-semibold rounded hover:bg-teal-800"
                        >
                          Publish Review
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {reviews.map((r) => (
                      <div key={r.id} className="p-4 border border-slate-200 rounded-xl bg-white space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{r.author}</span>
                          <span className="text-amber-500 font-bold">{r.rating} ★</span>
                        </div>
                        {r.treatmentTag && (
                          <div className="text-[11px] text-teal-700 font-medium">{r.treatmentTag}</div>
                        )}
                        <p className="text-slate-600 italic">"{r.comment}"</p>
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex justify-between">
                          <span>{r.date}</span>
                          <span>{r.isVerifiedGoogle ? 'Verified Google' : 'Direct Patient Entry'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SUPABASE DATABASE */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">
                      Supabase Cloud Database Integration
                    </h4>
                    <p className="text-xs text-slate-500">
                      Connected to project <strong className="text-slate-800">lqngukvdzidpsdenqqhl</strong>. All appointment bookings submitted through the website automatically save into your Supabase database in real-time.
                    </p>
                  </div>

                  {/* Status Box */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0F2D4A] text-white space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <Database className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200">Supabase Connection</div>
                          <div className="text-[11px] text-emerald-300 flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Active · Ready for Appointments</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          setIsSyncing(true);
                          await refreshFromSupabase();
                          setTimeout(() => setIsSyncing(false), 600);
                        }}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>Sync / Refresh Now</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-black/25 rounded-xl border border-white/5 space-y-0.5">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Project ID</div>
                        <div className="font-mono text-teal-300 font-bold">lqngukvdzidpsdenqqhl</div>
                      </div>
                      <div className="p-3 bg-black/25 rounded-xl border border-white/5 space-y-0.5">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Backend Endpoint</div>
                        <div className="font-mono text-slate-200 text-[11px] truncate">https://lqngukvdzidpsdenqqhl.supabase.co</div>
                      </div>
                      <div className="p-3 bg-black/25 rounded-xl border border-white/5 space-y-0.5">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Auth Key Status</div>
                        <div className="text-emerald-300 font-medium">Configured (Publishable Key)</div>
                      </div>
                    </div>

                    {supabaseSyncInfo.lastSyncedAt && (
                      <div className="text-[11px] text-slate-400 text-right">
                        Last synced at: <span className="text-slate-200">{supabaseSyncInfo.lastSyncedAt}</span>
                      </div>
                    )}
                  </div>

                  {/* Schema / SQL Quick Setup Guide */}
                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-xs text-slate-900">Database Table Schema: appointments</h5>
                        <p className="text-[11px] text-slate-500">
                          If you haven't created the <code className="text-teal-700">appointments</code> table in Supabase yet, paste this SQL in your Supabase SQL Editor:
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const sql = `CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_code TEXT NOT NULL UNIQUE,
  patient_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  treatment TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  is_existing_patient BOOLEAN DEFAULT false,
  notes TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public booking insert" ON appointments
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon read" ON appointments
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon update" ON appointments
  FOR UPDATE TO anon USING (true);`;
                          navigator.clipboard.writeText(sql);
                          setCopiedSql(true);
                          setTimeout(() => setCopiedSql(false), 2000);
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs"
                      >
                        {copiedSql ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy SQL</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3.5 bg-slate-900 text-teal-300 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-48">
{`CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_code TEXT NOT NULL UNIQUE,
  patient_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  treatment TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  is_existing_patient BOOLEAN DEFAULT false,
  notes TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public booking insert" ON appointments
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon read" ON appointments
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon update" ON appointments
  FOR UPDATE TO anon USING (true);`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
