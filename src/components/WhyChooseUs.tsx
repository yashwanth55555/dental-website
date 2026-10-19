import React from 'react';
import {
  Heart,
  Stethoscope,
  Sparkles,
  MessageSquare,
  Users2,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const WhyChooseUs: React.FC = () => {
  const { openBookingModal } = useClinic();

  const reasons = [
    {
      icon: <Heart className="w-5 h-5 text-teal-700" />,
      title: 'Patient Comfort',
      description: 'A welcoming, empathetic clinical approach designed to make dental visits significantly less stressful.',
    },
    {
      icon: <Stethoscope className="w-5 h-5 text-teal-700" />,
      title: 'Experienced Clinical Care',
      description: 'Professional dental treatment tailored carefully to individual oral health requirements.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-teal-700" />,
      title: 'Modern Treatment Options',
      description: 'A broad spectrum of contemporary dental services including rotary endodontics and digital imaging.',
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-teal-700" />,
      title: 'Clear Communication',
      description: 'We explain treatment options, steps, and care instructions thoroughly before initiating any procedure.',
    },
    {
      icon: <Users2 className="w-5 h-5 text-teal-700" />,
      title: 'Family-Friendly Care',
      description: 'Comprehensive dental services suitable for children, teenagers, working adults, and seniors under one roof.',
    },
    {
      icon: <MapPin className="w-5 h-5 text-teal-700" />,
      title: 'Convenient Location',
      description: 'Central and easily accessible on Race Course Road, Rangoli Halla, Hassan, with convenient operating hours.',
    },
  ];

  return (
    <section id="why-us" className="py-16 lg:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
            Why Choose K.M Dental Care
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Thoughtful Care for Every Patient
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            We focus on creating a reassuring, high-trust dental practice where every family member feels heard, respected, and expertly cared for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-[#FBFBFA] border border-slate-200/90 hover:border-teal-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => openBookingModal()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1E33] hover:bg-[#132e4d] text-white text-xs font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4 text-teal-400" />
            <span>Schedule Your Next Appointment</span>
          </button>
        </div>
      </div>
    </section>
  );
};
