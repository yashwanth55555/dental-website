import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import {
  X,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { Appointment } from '../types';

export const ManageBookingModal: React.FC = () => {
  const {
    isManageBookingOpen,
    setIsManageBookingOpen,
    appointments,
    cancelAppointmentByPatient,
    rescheduleAppointment,
    getAvailableSlotsForDate,
    clinicConfig,
  } = useClinic();

  const [query, setQuery] = useState('');
  const [searchedApt, setSearchedApt] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reschedule sub-state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  if (!isManageBookingOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsRescheduling(false);
    setShowCancelPrompt(false);

    const clean = query.trim().toUpperCase();
    if (!clean) {
      setErrorMessage('Please enter your Reference Code (e.g. KM-8421) or 10-digit mobile number.');
      return;
    }

    const found = appointments.find(
      (a) =>
        a.referenceCode.toUpperCase() === clean ||
        a.mobile.replace(/\D/g, '') === clean.replace(/\D/g, '')
    );

    if (found) {
      setSearchedApt(found);
    } else {
      setSearchedApt(null);
      setErrorMessage('No appointment found matching this reference code or mobile number. Please check and try again or call our clinic.');
    }
  };

  const handleCancel = () => {
    if (!searchedApt) return;
    const ok = cancelAppointmentByPatient(searchedApt.referenceCode, cancelReason);
    if (ok) {
      setSuccessMessage('Your appointment has been cancelled. If you wish to visit at another time, feel free to book a new appointment.');
      setShowCancelPrompt(false);
      // update local preview
      setSearchedApt({ ...searchedApt, status: 'Cancelled' });
    } else {
      setErrorMessage('Unable to cancel appointment. Please contact our clinic directly.');
    }
  };

  const handleConfirmReschedule = () => {
    if (!searchedApt || !newDate || !newTime) {
      setErrorMessage('Please pick both a new date and time slot.');
      return;
    }
    const ok = rescheduleAppointment(searchedApt.id, newDate, newTime);
    if (ok) {
      setSuccessMessage(`Appointment rescheduled successfully to ${newDate} at ${newTime}.`);
      setIsRescheduling(false);
      setSearchedApt({ ...searchedApt, date: newDate, timeSlot: newTime, status: 'Confirmed' });
    } else {
      setErrorMessage('Selected slot is not available. Please choose another slot.');
    }
  };

  const availableSlots = newDate ? getAvailableSlotsForDate(newDate) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 bg-[#0B1E33] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">Manage Your Appointment</h3>
              <p className="text-xs text-slate-300">Lookup, reschedule, or cancel</p>
            </div>
          </div>
          <button
            onClick={() => setIsManageBookingOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Lookup Form */}
          <form onSubmit={handleSearch} className="mb-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Enter Appointment Reference (e.g. KM-8421) or Mobile Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. KM-8421 or 9845123456"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Find
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Searched Appointment Result */}
          {searchedApt && (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-mono font-bold text-teal-800 text-sm">{searchedApt.referenceCode}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    searchedApt.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : searchedApt.status === 'Cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {searchedApt.status}
                </span>
              </div>

              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-medium text-slate-900">{searchedApt.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Treatment:</span>
                  <span className="font-medium text-slate-900">{searchedApt.treatment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-medium text-slate-900">{searchedApt.date} at {searchedApt.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Clinic:</span>
                  <span className="text-slate-600">{clinicConfig.name}, {clinicConfig.city}</span>
                </div>
              </div>

              {searchedApt.status !== 'Cancelled' && !isRescheduling && !showCancelPrompt && (
                <div className="pt-3 border-t border-slate-200 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRescheduling(true);
                      setNewDate(searchedApt.date);
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-medium flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reschedule</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelPrompt(true)}
                    className="px-3 py-1.5 bg-white border border-rose-200 text-rose-700 rounded-lg hover:bg-rose-50 font-medium flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Visit</span>
                  </button>
                </div>
              )}

              {/* Cancel Confirmation Prompt */}
              {showCancelPrompt && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-2 mt-2">
                  <p className="font-semibold text-rose-900">Are you sure you want to cancel this visit?</p>
                  <input
                    type="text"
                    placeholder="Reason for cancellation (optional)"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-rose-200 rounded"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCancelPrompt(false)}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600"
                    >
                      Keep Appointment
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-3 py-1 bg-rose-600 text-white rounded font-medium hover:bg-rose-700"
                    >
                      Confirm Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Reschedule Picker */}
              {isRescheduling && (
                <div className="p-3 bg-white border border-teal-200 rounded-lg space-y-3 mt-2">
                  <div className="font-semibold text-teal-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Select New Date & Time Slot</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">New Date:</label>
                    <input
                      type="date"
                      value={newDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setNewDate(e.target.value);
                        setNewTime('');
                      }}
                      className="w-full p-2 border border-slate-200 rounded text-xs"
                    />
                  </div>

                  {newDate && (
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Available Slots:</label>
                      <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto">
                        {availableSlots.map((s) => (
                          <button
                            key={s.time}
                            type="button"
                            disabled={!s.available}
                            onClick={() => setNewTime(s.time)}
                            className={`p-1.5 text-[11px] rounded border text-center transition-all ${
                              newTime === s.time
                                ? 'bg-teal-600 text-white border-teal-600'
                                : s.available
                                ? 'bg-slate-50 hover:bg-teal-50 border-slate-200 text-slate-700'
                                : 'bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed'
                            }`}
                          >
                            {s.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(false)}
                      className="px-3 py-1.5 text-slate-600 border border-slate-200 rounded text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!newDate || !newTime}
                      onClick={handleConfirmReschedule}
                      className="px-4 py-1.5 bg-teal-700 text-white rounded text-xs font-semibold hover:bg-teal-800 disabled:opacity-50"
                    >
                      Save New Slot
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-5 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            Need urgent assistance? Call our front desk directly at{' '}
            <a href={`tel:${clinicConfig.phone.replace(/\s+/g, '')}`} className="font-semibold text-teal-800 hover:underline">
              {clinicConfig.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
