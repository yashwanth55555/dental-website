import React, { useState, useEffect } from 'react';
import { useClinic } from '../context/ClinicContext';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  X,
  Phone,
  MessageSquare,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Download,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Appointment } from '../types';

export const BookingModal: React.FC = () => {
  const {
    bookingModal,
    closeBookingModal,
    clinicConfig,
    treatments,
    getAvailableSlotsForDate,
    addAppointment,
  } = useClinic();

  // Multi-step state: 1 to 5
  const [step, setStep] = useState<number>(1);
  const [selectedTreatment, setSelectedTreatment] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Patient info state
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [isExistingPatient, setIsExistingPatient] = useState(false);
  const [concern, setConcern] = useState('');

  // Result & validation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);

  // Initialize preselected treatment if modal opened with one
  useEffect(() => {
    if (bookingModal.isOpen) {
      if (bookingModal.preselectedTreatment) {
        setSelectedTreatment(bookingModal.preselectedTreatment);
      } else if (!selectedTreatment) {
        setSelectedTreatment('General Dental Consultation');
      }

      // Default date to tomorrow if not set
      if (!selectedDate) {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        setSelectedDate(d.toISOString().split('T')[0]);
      }
      setStep(1);
      setErrorMsg(null);
      setConfirmedApt(null);
    }
  }, [bookingModal.isOpen, bookingModal.preselectedTreatment]);

  if (!bookingModal.isOpen) return null;

  // Available dates (next 14 days, excluding completely closed days)
  const getUpcomingDates = () => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayFull = d.toLocaleDateString('en-US', { weekday: 'long' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });

      // check if clinic is open
      const dayConfig = clinicConfig.operatingHours.find(
        (h) => h.day.toLowerCase() === dayFull.toLowerCase()
      );
      const isOpen = dayConfig ? dayConfig.isOpen : true;

      list.push({
        iso,
        dayName,
        dayNum,
        monthName,
        dayFull,
        isOpen,
        isToday: i === 0,
      });
    }
    return list;
  };

  const upcomingDates = getUpcomingDates();
  const availableSlots = selectedDate ? getAvailableSlotsForDate(selectedDate) : [];

  const handleStep1Next = () => {
    if (!selectedTreatment) {
      setErrorMsg('Please select a dental service or consultation.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!selectedDate) {
      setErrorMsg('Please select an appointment date.');
      return;
    }
    setErrorMsg(null);
    setStep(3);
  };

  const handleStep3Next = () => {
    if (!selectedTimeSlot) {
      setErrorMsg('Please select a consultation time slot.');
      return;
    }
    setErrorMsg(null);
    setStep(4);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate phone: 10 digits
    const cleanedPhone = mobile.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const res = addAppointment({
      patientName: fullName.trim(),
      mobile: cleanedPhone,
      email: email.trim() || undefined,
      treatment: selectedTreatment,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      isExistingPatient,
      notes: concern.trim() || undefined,
    });

    if (res.success && res.appointment) {
      setConfirmedApt(res.appointment);
      setStep(5);
    } else {
      setErrorMsg(res.error || 'Failed to book slot. Please pick another time.');
    }
  };

  // Calendar .ics download
  const downloadCalendarFile = () => {
    if (!confirmedApt) return;
    const [year, month, day] = confirmedApt.date.split('-');
    // Build approx start and end date
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//K.M Dental Care//Hassan Dental Appointment//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Dental Appointment: ${confirmedApt.treatment}`,
      `DESCRIPTION:K.M Dental Care Appointment for ${confirmedApt.patientName}. Ref: ${confirmedApt.referenceCode}. Phone: ${clinicConfig.phone}`,
      `LOCATION:${clinicConfig.addressLine1}, ${clinicConfig.city}, Karnataka ${clinicConfig.pincode}`,
      `DTSTART:${year}${month}${day}T103000Z`,
      `DTEND:${year}${month}${day}T113000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `KM-Dental-${confirmedApt.referenceCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp prefilled message link
  const getWhatsAppBookingLink = () => {
    if (!confirmedApt) return '#';
    const text = encodeURIComponent(
      `Hello K.M Dental Care! I have booked an appointment.\n\nRef: ${confirmedApt.referenceCode}\nName: ${confirmedApt.patientName}\nTreatment: ${confirmedApt.treatment}\nDate: ${confirmedApt.date}\nTime: ${confirmedApt.timeSlot}\n\nPlease confirm my visit.`
    );
    return `https://wa.me/${clinicConfig.whatsapp.replace(/\D/g, '')}?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0B1E33] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">
                {step === 5 ? 'Appointment Confirmed' : 'Book Dental Appointment'}
              </h3>
              <p className="text-xs text-slate-300">
                K.M Dental Care · Race Course Road, Hassan
              </p>
            </div>
          </div>
          <button
            onClick={closeBookingModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator (Steps 1 to 4) */}
        {step < 5 && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className={step >= 1 ? 'text-teal-700 font-semibold' : ''}>1. Treatment</span>
              <span className="text-slate-300">→</span>
              <span className={step >= 2 ? 'text-teal-700 font-semibold' : ''}>2. Date</span>
              <span className="text-slate-300">→</span>
              <span className={step >= 3 ? 'text-teal-700 font-semibold' : ''}>3. Time</span>
              <span className="text-slate-300">→</span>
              <span className={step >= 4 ? 'text-teal-700 font-semibold' : ''}>4. Details</span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-teal-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Body content based on step */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Select Treatment */}
          {step === 1 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">
                Select Consultation or Treatment
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Choose the primary reason for your visit. Our doctors will conduct an in-depth oral examination.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedTreatment('General Dental Consultation')}
                  className={`text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                    selectedTreatment === 'General Dental Consultation'
                      ? 'border-teal-600 bg-teal-50/60 text-teal-950 font-medium ring-1 ring-teal-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900">General Dental Consultation</div>
                    <div className="text-[11px] text-slate-500">Comprehensive examination & diagnosis</div>
                  </div>
                  {selectedTreatment === 'General Dental Consultation' && (
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  )}
                </button>

                {treatments.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTreatment(t.name)}
                    className={`text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                      selectedTreatment === t.name
                        ? 'border-teal-600 bg-teal-50/60 text-teal-950 font-medium ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{t.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{t.shortDescription}</div>
                    </div>
                    {selectedTreatment === t.name && (
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    )}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setSelectedTreatment('Other / Emergency Dental Checkup')}
                  className={`text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                    selectedTreatment === 'Other / Emergency Dental Checkup'
                      ? 'border-teal-600 bg-teal-50/60 text-teal-950 font-medium ring-1 ring-teal-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900">Other / Urgent Checkup</div>
                    <div className="text-[11px] text-slate-500">Toothache, swelling or other inquiry</div>
                  </div>
                  {selectedTreatment === 'Other / Emergency Dental Checkup' && (
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  )}
                </button>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleStep1Next}
                  className="px-5 py-2.5 bg-[#0B1E33] hover:bg-[#122c4a] text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
                >
                  <span>Select Date</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Date */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Select Preferred Date</h4>
                  <p className="text-xs text-slate-500">Operating hours: Mon–Sat 10:30 AM–9:00 PM, Sun 10:30 AM–12:00 PM</p>
                </div>
                <span className="text-xs font-medium text-teal-800 bg-teal-50 px-2.5 py-1 rounded">
                  {selectedTreatment}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 my-4">
                {upcomingDates.map((d) => (
                  <button
                    key={d.iso}
                    type="button"
                    disabled={!d.isOpen}
                    onClick={() => setSelectedDate(d.iso)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                      selectedDate === d.iso
                        ? 'border-teal-600 bg-teal-600 text-white shadow-sm ring-2 ring-teal-600/30'
                        : d.isOpen
                        ? 'border-slate-200 hover:border-teal-300 hover:bg-slate-50 text-slate-800'
                        : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-semibold ${selectedDate === d.iso ? 'text-teal-100' : 'text-slate-400'}`}>
                      {d.dayName}
                    </span>
                    <span className="text-lg font-bold my-0.5">{d.dayNum}</span>
                    <span className={`text-[10px] ${selectedDate === d.iso ? 'text-teal-100' : 'text-slate-500'}`}>
                      {d.monthName}
                    </span>
                    {d.isToday && (
                      <span className={`text-[9px] mt-1 px-1 rounded ${selectedDate === d.iso ? 'bg-teal-700 text-teal-100' : 'bg-slate-200 text-slate-600'}`}>
                        Today
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleStep2Next}
                  className="px-5 py-2.5 bg-[#0B1E33] hover:bg-[#122c4a] text-white text-xs font-semibold rounded-lg flex items-center gap-2"
                >
                  <span>Select Time Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Select Time Slot */}
          {step === 3 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Select Available Time Slot</h4>
                  <p className="text-xs text-slate-500">
                    Date: <strong className="text-slate-700">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>Available</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 ml-2" />
                  <span>Booked</span>
                </div>
              </div>

              {availableSlots.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-slate-200">
                  The clinic is closed or no appointment slots remain on this day. Please select another date.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-all ${
                        selectedTimeSlot === slot.time
                          ? 'border-teal-600 bg-teal-600 text-white shadow-sm ring-1 ring-teal-600'
                          : slot.available
                          ? 'border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-slate-800'
                          : 'border-slate-100 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{slot.time}</span>
                      </div>
                      {!slot.available && (
                        <span className="text-[10px] text-slate-400">Filled</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={!selectedTimeSlot}
                  onClick={handleStep3Next}
                  className="px-5 py-2.5 bg-[#0B1E33] hover:bg-[#122c4a] disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
                >
                  <span>Patient Information</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Patient Information */}
          {step === 4 && (
            <form onSubmit={handleBookSubmit}>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-900">Patient Information</h4>
                <p className="text-xs text-slate-500">
                  Please provide your contact details so our clinic team can verify and confirm your appointment.
                </p>
              </div>

              {/* Summary pill */}
              <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400">Treatment:</span> <strong className="text-slate-900">{selectedTreatment}</strong>
                </div>
                <div>
                  <span className="text-slate-400">When:</span> <strong className="text-slate-900">{selectedDate} at {selectedTimeSlot}</strong>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="text-xs text-slate-400 font-medium absolute left-3 top-2.5">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full pl-11 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <span className="text-xs text-slate-700 font-medium">Have you visited K.M Dental Care before?</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="patientType"
                        checked={!isExistingPatient}
                        onChange={() => setIsExistingPatient(false)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>First visit</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="patientType"
                        checked={isExistingPatient}
                        onChange={() => setIsExistingPatient(true)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>Existing patient</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Describe your dental concern or notes <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Tooth sensitivity on lower right molar, pain while eating sweets..."
                    value={concern}
                    onChange={(e) => setConcern(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Appointment Booking</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Confirmation Success */}
          {step === 5 && confirmedApt && (
            <div className="text-center py-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="text-lg font-bold text-slate-900">Appointment Request Received!</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                Thank you, <strong>{confirmedApt.patientName}</strong>. Your dental appointment has been recorded. Our team will prepare your operatory suite on time.
              </p>

              {/* Reference Details Card */}
              <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left max-w-lg mx-auto space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Booking Reference:</span>
                  <span className="font-mono font-bold text-teal-800 text-sm tracking-wider">{confirmedApt.referenceCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Treatment:</span>
                  <span className="font-semibold text-slate-800">{confirmedApt.treatment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Date & Time:</span>
                  <span className="font-semibold text-slate-800">{confirmedApt.date} at {confirmedApt.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Phone:</span>
                  <span className="font-semibold text-slate-800">+91 {confirmedApt.mobile}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location:</span>
                  </span>
                  <span className="text-right text-slate-700">{clinicConfig.addressLine1}, {clinicConfig.city}</span>
                </div>
                <div className="pt-1 text-[10px] text-emerald-700 flex items-center justify-center gap-1 bg-emerald-50/70 p-1 rounded">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Recorded in Supabase Clinic Database</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 max-w-lg mx-auto">
                <button
                  type="button"
                  onClick={downloadCalendarFile}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Add to Calendar</span>
                </button>

                <a
                  href={`tel:${clinicConfig.phone.replace(/\s+/g, '')}`}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span>Call Clinic</span>
                </a>

                <a
                  href={getWhatsAppBookingLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>WhatsApp Us</span>
                </a>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=K.M+Dental+Care+Race+Course+Road+Rangoli+Halla+Hassan+Karnataka+573201"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-slate-600" />
                  <span>Directions</span>
                </a>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex justify-center">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="px-6 py-2 bg-[#0B1E33] text-white text-xs font-medium rounded-lg hover:bg-slate-800"
                >
                  Done & Return to Website
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
