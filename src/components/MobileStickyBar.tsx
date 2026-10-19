import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { Phone, MessageSquare, Calendar } from 'lucide-react';

export const MobileStickyBar: React.FC = () => {
  const { clinicConfig, openBookingModal } = useClinic();

  const whatsappUrl = `https://wa.me/${clinicConfig.whatsapp.replace(/\D/g, '')}?text=Hello%20K.M%20Dental%20Care!%20I%20would%20like%20to%20book%20an%20appointment.`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-3 py-2">
      <div className="grid grid-cols-3 gap-2 items-center max-w-md mx-auto h-11">
        {/* Call Now */}
        <a
          href={`tel:${clinicConfig.phone.replace(/\s+/g, '')}`}
          className="flex flex-col items-center justify-center text-slate-700 hover:text-teal-800 transition-colors py-1 rounded-lg active:bg-slate-100"
          aria-label="Call clinic directly"
        >
          <Phone className="w-4 h-4 text-teal-700" />
          <span className="text-[10px] font-semibold mt-0.5 whitespace-nowrap">Call</span>
        </a>

        {/* WhatsApp Us */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-slate-700 hover:text-emerald-700 transition-colors py-1 rounded-lg active:bg-slate-100"
          aria-label="Message clinic on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] font-semibold mt-0.5 whitespace-nowrap">WhatsApp</span>
        </a>

        {/* Book Appointment Primary */}
        <button
          type="button"
          onClick={() => openBookingModal()}
          className="flex items-center justify-center gap-1.5 bg-[#0B1E33] active:bg-[#132e4d] text-white rounded-lg h-9 px-2 shadow-xs transition-colors"
          aria-label="Book dental appointment"
        >
          <Calendar className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-xs font-bold whitespace-nowrap">Book</span>
        </button>
      </div>
    </div>
  );
};
