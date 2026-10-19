import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { Star, MessageSquareQuote, CheckCircle, ArrowDown } from 'lucide-react';

export const PatientExperience: React.FC = () => {
  const { reviews } = useClinic();

  // Display top 3 verified testimonials
  const featuredReviews = reviews.slice(0, 3);

  const experiencePillars = [
    { title: 'Friendly Staff', desc: 'Warm reception from the moment you step through our doors.' },
    { title: 'Caring Approach', desc: 'Attentive, empathetic listening before any dental instrument is picked up.' },
    { title: 'Comfortable Treatment', desc: 'Careful local anesthesia administration and gentle procedural touch.' },
    { title: 'Smooth Process', desc: 'Punctual slot booking, clear treatment stages, and transparent advice.' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#FBFBFA] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
            The Patient Journey
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Care That Helps You Feel Comfortable
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every patient brings unique oral health needs and comfort levels. Here is how our clinical philosophy reflects what patients consistently appreciate during their visits.
          </p>
        </div>

        {/* 4 Pillars of Experience */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {experiencePillars.map((p, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{p.title}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredReviews.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {r.isVerifiedGoogle && (
                    <span className="text-[10px] text-slate-400 font-medium">Verified Google</span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{r.author}</div>
                  {r.treatmentTag && (
                    <div className="text-[11px] text-teal-700 font-medium">{r.treatmentTag}</div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">{r.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="#reviews"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 transition-colors"
          >
            <span>Read More Patient Reviews</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
