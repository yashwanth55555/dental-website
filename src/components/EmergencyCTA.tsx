import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { Phone, AlertCircle, MessageSquare } from 'lucide-react';

export const EmergencyCTA: React.FC = () => {
  const { clinicConfig } = useClinic();

  const getWhatsAppEmergencyLink = () => {
    const text = encodeURIComponent(
      `Hello K.M Dental Care! I have an urgent dental emergency/severe tooth pain. Are you available for a same-day visit?`
    );
    return `https://wa.me/${clinicConfig.whatsapp.replace(/\D/g, '')}?text=${text}`;
  };

  return (
    <section className="py-12 bg-gradient-to-r from-[#0F2338] via-[#0A1A2B] to-[#0B1E33] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl border border-slate-700/60 bg-slate-900/40 backdrop-blur-sm">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Urgent Dental Care</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Experiencing a Dental Emergency?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              If you are experiencing severe dental pain, sudden swelling, facial trauma, or another urgent dental problem, contact our clinic directly to discuss the appropriate next step and immediate care options.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={`tel:${clinicConfig.phone.replace(/\s+/g, '')}`}
              className="px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Call the Clinic ({clinicConfig.phone})</span>
            </a>

            <a
              href={getWhatsAppEmergencyLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-600 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
