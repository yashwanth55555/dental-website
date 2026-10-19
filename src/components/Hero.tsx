import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { ClinicOperatoryIllustration } from './DentalGraphics';
import { Phone, Calendar, Star, Clock, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  const { clinicConfig, openBookingModal } = useClinic();

  // Check current open status
  const getClinicOpenStatus = () => {
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const dayConfig = clinicConfig.operatingHours.find(
      (h) => h.day.toLowerCase() === dayName.toLowerCase()
    );
    if (!dayConfig || !dayConfig.isOpen) {
      return { isOpen: false, text: 'Opens Tomorrow 10:30 AM' };
    }
    return {
      isOpen: true,
      text: `Open Today until ${dayConfig.closeTime}`,
    };
  };

  const status = getClinicOpenStatus();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-[#FBFBFA] via-[#F4F7F9] to-[#FBFBFA]">
      {/* Decorative ambient subtle radial backdrop */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-sky-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-900 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>Trusted Dental Care in Hassan</span>
              <span className="text-teal-400">·</span>
              <span className="text-slate-500 font-normal">Rangoli Halla</span>
            </div>

            {/* Main headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-slate-900 tracking-tight leading-[1.12] text-balance">
              A Healthier Smile <br className="hidden sm:inline" />
              <span className="text-[#0E7490]">Starts Here.</span>
            </h1>

            {/* Supporting copy */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Modern dental care focused on comfort, precision and confident smiles. Personalized dental treatments delivered in a calm, welcoming environment.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="px-6 py-3.5 bg-[#0B1E33] hover:bg-[#132e4d] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>Book an Appointment</span>
              </button>

              <a
                href={`tel:${clinicConfig.phone.replace(/\s+/g, '')}`}
                className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl border border-slate-200/90 shadow-sm transition-all flex items-center gap-2 hover:border-slate-300 active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 text-teal-600" />
                <span>Call {clinicConfig.phone}</span>
              </a>
            </div>

            {/* Small trust row beneath CTAs */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                <span className="font-medium text-slate-800">Highly rated by patients</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Comfortable care</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Modern treatments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Hassan location</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Focal Carrier with Operatory Scene & Live Status */}
          <div className="lg:col-span-5 relative">
            {/* Visual illustration of high-end operatory */}
            <ClinicOperatoryIllustration />

            {/* Subtle floating appointment card / "Now accepting appointments" element */}
            <div className="mt-4 p-4 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Now Accepting Appointments</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{status.text}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openBookingModal()}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Choose Slot →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
