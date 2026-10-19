import React, { useState } from 'react';
import { faqsData } from '../data/clinicData';
import { ChevronDown, HelpCircle, Calendar, Phone } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const FAQ: React.FC = () => {
  const { openBookingModal, clinicConfig } = useClinic();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first item open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-16 lg:py-24 bg-[#FBFBFA] border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Common Patient Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Clear, transparent answers about our clinical treatments, appointment booking, and what to expect during your dental visit.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {faqsData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:text-teal-900 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.question}</span>
                  <div
                    className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-teal-50 text-teal-700' : 'text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-sm">Have a question not listed here?</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Our Hassan clinic reception is happy to assist you with treatment inquiries, timings, and directions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="px-4 py-2 bg-[#0B1E33] hover:bg-[#132e4d] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>Book Appointment</span>
            </button>
            <a
              href={`tel:${clinicConfig.phone.replace(/\s+/g, '')}`}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>Call +91 81722 35807</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
