import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { ClinicLogo } from './DentalGraphics';
import { Phone, MapPin, Clock, MessageSquare, ExternalLink, X, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  const { clinicConfig, openBookingModal, setIsAdminModalOpen } = useClinic();

  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=K.M+Dental+Care+Race+Course+Road+Rangoli+Halla+Hassan+Karnataka+573201`;
  const whatsappUrl = `https://wa.me/${clinicConfig.whatsapp.replace(/\D/g, '')}?text=Hello%20K.M%20Dental%20Care`;

  return (
    <>
      <footer className="bg-[#0B1E33] text-slate-300 pt-16 pb-24 md:pb-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            {/* Column 1: Brand & NAP */}
            <div className="lg:col-span-4 space-y-4">
              <div className="brightness-125 invert-0">
                <ClinicLogo className="h-9 [&_span]:text-white [&_span.text-slate-500]:text-slate-400" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Comfortable dental care for healthier teeth and confident smiles. Modern clinical treatments delivered with gentle precision in Hassan, Karnataka.
              </p>
              <div className="pt-2 text-xs text-slate-400">
                <span className="text-slate-200 font-semibold">{clinicConfig.googleRating}★ Google Rating</span> · Based on {clinicConfig.reviewCount} verified patient reviews.
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="lg:col-span-2 space-y-3 text-xs">
              <h4 className="font-semibold text-white tracking-wider uppercase text-[11px]">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-teal-400 transition-colors">About Us</a></li>
                <li><a href="#treatments" className="hover:text-teal-400 transition-colors">Treatments</a></li>
                <li><a href="#why-us" className="hover:text-teal-400 transition-colors">Why Choose Us</a></li>
                <li><a href="#gallery" className="hover:text-teal-400 transition-colors">Clinic Gallery</a></li>
                <li><a href="#reviews" className="hover:text-teal-400 transition-colors">Patient Reviews</a></li>
                <li><a href="#contact" className="hover:text-teal-400 transition-colors">Contact & Directions</a></li>
              </ul>
            </div>

            {/* Column 3: Treatments */}
            <div className="lg:col-span-3 space-y-3 text-xs">
              <h4 className="font-semibold text-white tracking-wider uppercase text-[11px]">Key Treatments</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => openBookingModal('Root Canal Treatment')} className="hover:text-teal-400 transition-colors text-left">
                    Root Canal Treatment
                  </button>
                </li>
                <li>
                  <button onClick={() => openBookingModal('Dental Implants')} className="hover:text-teal-400 transition-colors text-left">
                    Dental Implants
                  </button>
                </li>
                <li>
                  <button onClick={() => openBookingModal('Orthodontic Treatment')} className="hover:text-teal-400 transition-colors text-left">
                    Orthodontics & Aligners
                  </button>
                </li>
                <li>
                  <button onClick={() => openBookingModal('Teeth Cleaning & Scaling')} className="hover:text-teal-400 transition-colors text-left">
                    Teeth Cleaning & Scaling
                  </button>
                </li>
                <li>
                  <button onClick={() => openBookingModal('Teeth Filling & Restoration')} className="hover:text-teal-400 transition-colors text-left">
                    Tooth Colored Fillings
                  </button>
                </li>
                <li>
                  <button onClick={() => openBookingModal('Dental Crowns / Capping')} className="hover:text-teal-400 transition-colors text-left">
                    Dental Crowns & Caps
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Hours */}
            <div className="lg:col-span-3 space-y-3 text-xs">
              <h4 className="font-semibold text-white tracking-wider uppercase text-[11px]">Contact & Timings</h4>
              <div className="space-y-2 text-slate-400">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                  <span>{clinicConfig.addressLine1}, {clinicConfig.city}, Karnataka {clinicConfig.pincode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <a href={`tel:${clinicConfig.phone.replace(/\s+/g, '')}`} className="text-white hover:text-teal-400">
                    {clinicConfig.phone}
                  </a>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <Clock className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                  <div>
                    <div>Mon–Sat: 10:30 AM – 9:00 PM</div>
                    <div>Sunday: 10:30 AM – 12:00 PM</div>
                  </div>
                </div>
                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © {new Date().getFullYear()} K.M Dental Care. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              <button
                onClick={() => setLegalModal('privacy')}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setLegalModal('terms')}
                className="hover:text-white transition-colors"
              >
                Terms
              </button>
              <button
                onClick={() => setLegalModal('disclaimer')}
                className="hover:text-white transition-colors"
              >
                Medical Disclaimer
              </button>
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="text-slate-600 hover:text-slate-400 transition-colors"
              >
                Staff Portal
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal & Medical Disclaimer Modals */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {legalModal === 'privacy' && 'Privacy Policy'}
                {legalModal === 'terms' && 'Terms of Service'}
                {legalModal === 'disclaimer' && 'Medical Disclaimer'}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2.5 max-h-80 overflow-y-auto leading-relaxed">
              {legalModal === 'disclaimer' && (
                <>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      The information provided on this website is for general informational and educational purposes only and does not constitute formal medical or dental diagnosis, treatment, or clinical advice.
                    </span>
                  </div>
                  <p>
                    Every patient has unique anatomical characteristics and oral health conditions. Individual outcomes, pain thresholds, and recovery durations vary. No procedure guarantees 100% painless experience or specific cosmetic results without clinical examination.
                  </p>
                  <p>
                    Always consult directly with our qualified dental surgeons at K.M Dental Care in Hassan regarding any medical condition, oral discomfort, or planned treatment.
                  </p>
                </>
              )}

              {legalModal === 'privacy' && (
                <>
                  <p>
                    K.M Dental Care respects the confidentiality of all patient inquiries and appointment records. Information collected through our appointment booking system (name, mobile number, email, and dental concern) is strictly used for appointment scheduling, patient reminder notifications, and clinical record-keeping.
                  </p>
                  <p>
                    We never sell, rent, or publicly disclose patient contact numbers or medical history to external marketing third parties.
                  </p>
                </>
              )}

              {legalModal === 'terms' && (
                <>
                  <p>
                    Online appointments booked through this website are reservations subject to clinic confirmation and in-person clinical assessment. We request patients to arrive 5 to 10 minutes prior to scheduled slot times.
                  </p>
                  <p>
                    Operating hours may be adjusted on public holidays. If an unexpected emergency procedure causes a delay in slot timing, our clinic team will keep you informed.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
