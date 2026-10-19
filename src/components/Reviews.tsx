import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Star, CheckCircle, MessageSquareQuote, Calendar, ExternalLink } from 'lucide-react';

export const Reviews: React.FC = () => {
  const { reviews, clinicConfig, openBookingModal } = useClinic();
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 4);

  return (
    <section id="reviews" className="py-16 lg:py-24 bg-[#FBFBFA] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Big Rating Breakdown */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
              Patient Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              What Our Patients Say
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Real feedback from individuals and families who received dental care at K.M Dental Care in Hassan.
            </p>
          </div>

          {/* Rating Summary Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-5 self-start lg:self-auto">
            <div className="text-center pr-4 border-r border-slate-200">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
                {clinicConfig.googleRating}
              </div>
              <div className="flex items-center justify-center gap-1 text-amber-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">out of 5.0</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-800">
                Google Verified Reviews
              </div>
              <div className="text-xs text-slate-500">
                Based on <strong className="text-slate-900">{clinicConfig.reviewCount} patient ratings</strong>
              </div>
              <div className="text-[11px] text-teal-700 font-semibold flex items-center gap-1 pt-0.5">
                <CheckCircle className="w-3 h-3 text-teal-600" />
                <span>Verified Local Practice</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedReviews.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Clean unboxed metadata separator */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    {r.isVerifiedGoogle && <span>Google Review</span>}
                    <span aria-hidden="true">·</span>
                    <span>{r.date}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{r.author}</div>
                  {r.treatmentTag && (
                    <div className="text-[11px] text-teal-800 font-semibold mt-0.5">
                      {r.treatmentTag}
                    </div>
                  )}
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-[10px]">
                  {r.author.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Toggle View More / CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {reviews.length > 4 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
            >
              {showAll ? 'Show Fewer Reviews' : `View All ${reviews.length} Reviews`}
            </button>
          )}

          <button
            type="button"
            onClick={() => openBookingModal()}
            className="px-5 py-2.5 bg-[#0B1E33] hover:bg-[#132e4d] text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <span>Book Your Consultation</span>
          </button>
        </div>
      </div>
    </section>
  );
};
