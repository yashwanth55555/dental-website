import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { Star, HeartHandshake, Users, Sparkles, MapPin } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const { clinicConfig } = useClinic();

  return (
    <section className="bg-white border-y border-slate-200/90 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Main Google Rating Proof Unit */}
          <div className="flex items-center gap-3 pr-6 border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 w-full sm:w-auto">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 font-bold text-lg font-sans">
              {clinicConfig.googleRating}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                <strong className="text-slate-900">{clinicConfig.reviewCount} Google reviews</strong> · Hassan
              </div>
            </div>
          </div>

          {/* 4 Trust statements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">Patient-Focused Care</div>
                <div className="text-[11px] text-slate-500">Gentle & reassuring</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">Friendly Clinical Team</div>
                <div className="text-[11px] text-slate-500">Warm & attentive staff</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">Modern Treatment Options</div>
                <div className="text-[11px] text-slate-500">Precision diagnostics</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">Convenient Location</div>
                <div className="text-[11px] text-slate-500">Race Course Road</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
