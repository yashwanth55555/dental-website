import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { ToothRestorationGraphic } from './DentalGraphics';
import { CheckCircle2, Calendar, Phone, ShieldCheck, Clock } from 'lucide-react';

export const FeaturedRCT: React.FC = () => {
  const { openBookingModal, clinicConfig } = useClinic();

  return (
    <section className="py-16 lg:py-24 bg-[#F4F7F9] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Anatomical & Precision Illustration */}
          <div className="lg:col-span-6">
            <ToothRestorationGraphic />
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Rotary endodontics & digital apex locator</span>
              </span>
              <span>K.M Dental Care, Hassan</span>
            </div>
          </div>

          {/* Right Column: Copy & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                Featured Dental Care
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Save Your Natural Smile
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              When deep decay, cracked enamel, or trauma reaches the inner pulp of a tooth, root canal treatment offers a vital path to preserve your natural tooth structure rather than resorting to an extraction.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              At K.M Dental Care, we plan each root canal procedure meticulously using high-resolution digital X-rays and precision rotary systems. Our focus is on removing infected tissue, thoroughly disinfecting the canals, and sealing them securely so you can bite and chew naturally.
            </p>

            {/* Clinical highlights */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Tooth Preservation:</strong> Retains your natural jawbone stimulation and natural bite alignment.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Comfort-Centered Approach:</strong> Guided local anesthesia to maximize comfort throughout the treatment.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Crown Reinforcement:</strong> Custom-fitted dental crowns to protect treated teeth from future fractures.
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => openBookingModal('Root Canal Treatment')}
                className="px-6 py-3 bg-[#0B1E33] hover:bg-[#132e4d] text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>Book an RCT Consultation</span>
              </button>

              <a
                href={`tel:${clinicConfig.phone.replace(/\s+/g, '')}`}
                className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-teal-600" />
                <span>Call for Pain Relief Guidance</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
