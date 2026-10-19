import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Navigation,
  Send,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const LocationSection: React.FC = () => {
  const { clinicConfig, openBookingModal } = useClinic();

  // Contact inquiry form
  const [inqName, setInqName] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqMessage, setInqMessage] = useState('');
  const [inqSent, setInqSent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName.trim() || !inqPhone.trim()) return;

    // Simulate inquiry submission
    setInqSent(true);
    setTimeout(() => {
      setInqName('');
      setInqPhone('');
      setInqMessage('');
    }, 3000);
  };

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=K.M+Dental+Care+Race+Course+Road+Rangoli+Halla+Hassan+Karnataka+573201`;

  const getWhatsAppChatUrl = () => {
    const text = encodeURIComponent(
      `Hello K.M Dental Care! I would like to inquire about appointments and clinic directions.`
    );
    return `https://wa.me/${clinicConfig.whatsapp.replace(/\D/g, '')}?text=${text}`;
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
            Visit or Contact Us
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Convenient Location in Hassan
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            We are easily accessible on Race Course Road, Rangoli Halla. Feel free to call us, chat on WhatsApp, or book directly online.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Clinic Contact Details & Opening Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#FBFBFA] border border-slate-200/90 shadow-2xs space-y-5">
              {/* NAP */}
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-slate-900">{clinicConfig.name}</h3>
                <p className="text-xs text-slate-500">{clinicConfig.tagline}</p>
              </div>

              <div className="space-y-3.5 pt-2 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">Clinic Address:</div>
                    <div>{clinicConfig.addressLine1},</div>
                    <div>{clinicConfig.addressLine2},</div>
                    <div>{clinicConfig.city}, {clinicConfig.state} {clinicConfig.pincode}, India</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-teal-700 shrink-0" />
                  <div>
                    <span className="text-slate-500">Phone: </span>
                    <a
                      href={`tel:${clinicConfig.phone.replace(/\s+/g, '')}`}
                      className="font-bold text-slate-900 hover:text-teal-700 hover:underline"
                    >
                      {clinicConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-200/80">
                  <Clock className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                  <div className="w-full">
                    <div className="font-semibold text-slate-900 mb-1.5">Operating Hours:</div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-700">
                        <span>Monday – Saturday:</span>
                        <strong className="text-slate-900">10:30 AM – 9:00 PM</strong>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>Sunday:</span>
                        <strong className="text-slate-900">10:30 AM – 12:00 PM</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-3 gap-2 text-xs">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[#0B1E33] hover:bg-[#132e4d] text-white rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-colors text-center"
                >
                  <Navigation className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-[11px]">Directions</span>
                </a>

                <a
                  href={`tel:${clinicConfig.phone.replace(/\s+/g, '')}`}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-colors text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-[11px]">Call Now</span>
                </a>

                <a
                  href={getWhatsAppChatUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-colors text-center"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-[11px]">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Quick General Inquiry Form */}
            <div className="p-6 rounded-2xl bg-[#FBFBFA] border border-slate-200/90 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
                Send a Quick Inquiry
              </h4>
              <p className="text-[11px] text-slate-500 mb-3">
                Have a question before booking? Leave your details and our team will get back to you.
              </p>

              {inqSent ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Thank you! Your inquiry has been sent to our Hassan clinic reception.</span>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={inqName}
                    onChange={(e) => setInqName(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-teal-600"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    value={inqPhone}
                    onChange={(e) => setInqPhone(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-teal-600"
                  />
                  <textarea
                    rows={2}
                    placeholder="Your question or message..."
                    value={inqMessage}
                    onChange={(e) => setInqMessage(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-teal-600 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#0B1E33] hover:bg-[#132e4d] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3 h-3 text-teal-400" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Location Embed */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 h-[480px] w-full">
              <iframe
                title="K.M Dental Care Hassan Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.9748956961474!2d76.0982!3d13.0068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba54859a5e8869b%3A0x6b441961eec48e58!2sRace%20Course%20Rd%2C%20Rangoli%20Halla%2C%20Hassan%2C%20Karnataka%20573201!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating Map Card */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-md text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>K.M Dental Care</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Race Course Road, Rangoli Halla, Hassan
                </div>
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900"
                >
                  <span>Open in Google Maps</span>
                  <Navigation className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Bottom note */}
            <div className="mt-3 text-right">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="text-xs font-semibold text-teal-800 hover:text-teal-950 underline"
              >
                Ready to visit? Book your consultation time slot online →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
