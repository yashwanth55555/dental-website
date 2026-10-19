import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import {
  Activity,
  Zap,
  ShieldCheck,
  Smile,
  Sparkles,
  Crown,
  Scissors,
  Droplet,
  HeartHandshake,
  ScanLine,
  Stethoscope,
  Sparkle,
  ArrowRight,
  Calendar,
  Clock,
} from 'lucide-react';
import { TreatmentItem } from '../types';

export const Treatments: React.FC = () => {
  const { treatments, openBookingModal, setSelectedTreatmentForDetail } = useClinic();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filterTabs = [
    'All',
    'Restorative',
    'Preventive',
    'Ortho & Cosmetic',
    'Surgical',
  ];

  const filteredTreatments = treatments.filter((t) => {
    if (selectedFilter === 'All') return true;
    return t.category === selectedFilter;
  });

  const getTreatmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-5 h-5 text-teal-600" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-teal-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-teal-600" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-teal-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-teal-600" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-teal-600" />;
      case 'Scissors':
        return <Scissors className="w-5 h-5 text-teal-600" />;
      case 'Droplet':
        return <Droplet className="w-5 h-5 text-teal-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-teal-600" />;
      case 'ScanLine':
        return <ScanLine className="w-5 h-5 text-teal-600" />;
      case 'Stethoscope':
        return <Stethoscope className="w-5 h-5 text-teal-600" />;
      case 'Sparkle':
      default:
        return <Sparkle className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <section id="treatments" className="py-16 lg:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Filter Segmented Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
              Our Clinical Services
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Complete Dental Care Under One Roof
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Modern dental treatments tailored to your individual oral health needs. Explore our comprehensive care options below.
            </p>
          </div>

          {/* Interactive filter tabs (Buttons conforming to zero-pill rules) */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl self-start md:self-auto border border-slate-200/60">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedFilter(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedFilter === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTreatments.map((treatment: TreatmentItem) => (
            <div
              key={treatment.id}
              className="group p-5 rounded-2xl bg-[#FBFBFA] border border-slate-200/90 hover:border-teal-300 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Top Icon & Unboxed Category */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getTreatmentIcon(treatment.iconName)}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {treatment.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                  {treatment.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {treatment.shortDescription}
                </p>

                {/* Key benefit bullet preview */}
                <div className="pt-1 flex items-center gap-1.5 text-[11px] text-teal-800 font-medium">
                  <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{treatment.durationEstimate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedTreatmentForDetail(treatment)}
                  className="font-semibold text-slate-700 hover:text-teal-700 flex items-center gap-1 transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => openBookingModal(treatment.name)}
                  className="px-3 py-1.5 bg-[#0B1E33] hover:bg-[#132e4d] text-white font-medium rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <Calendar className="w-3 h-3 text-teal-400" />
                  <span>Book</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Contextual CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0F2D4A] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-slate-100">Unsure which treatment fits your symptoms?</h4>
            <p className="text-xs text-slate-300">Schedule a general dental consultation for a thorough examination and doctor evaluation.</p>
          </div>
          <button
            type="button"
            onClick={() => openBookingModal('General Dental Consultation')}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg shadow-sm whitespace-nowrap transition-colors"
          >
            Book Consultation
          </button>
        </div>
      </div>
    </section>
  );
};
