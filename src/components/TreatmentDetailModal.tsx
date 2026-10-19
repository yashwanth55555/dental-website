import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { X, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

export const TreatmentDetailModal: React.FC = () => {
  const { selectedTreatmentForDetail, setSelectedTreatmentForDetail, openBookingModal } = useClinic();

  if (!selectedTreatmentForDetail) return null;

  const t = selectedTreatmentForDetail;

  const handleBookThis = () => {
    const treatmentName = t.name;
    setSelectedTreatmentForDetail(null);
    openBookingModal(treatmentName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 bg-[#0B1E33] text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-teal-400 font-semibold">{t.category}</span>
            <h3 className="font-semibold text-lg leading-tight">{t.name}</h3>
          </div>
          <button
            onClick={() => setSelectedTreatmentForDetail(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {t.fullDescription}
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-700">
            <Clock className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Estimated Duration: <strong>{t.durationEstimate}</strong></span>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Key Clinical Benefits</h4>
            <div className="space-y-1.5">
              {t.keyBenefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">When is this Recommended?</h4>
            <div className="space-y-1.5">
              {t.commonSigns.map((sign, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span>{sign}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedTreatmentForDetail(null)}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleBookThis}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Consultation for this Treatment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
