import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import {
  Heart,
  MessageCircle,
  Stethoscope,
  Smile,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';

export const About: React.FC = () => {
  const { openBookingModal } = useClinic();
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  return (
    <section id="about" className="py-16 lg:py-24 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Authentic Clinic Setting & Hygiene Focus Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-gradient-to-br from-[#0F2843] to-[#0A1A2B] p-6 text-white">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                    Clinical Standards
                  </span>
                </div>
                <span className="text-[11px] text-slate-300 font-mono">Rangoli Halla, Hassan</span>
              </div>

              {/* Graphic Representation of Modern Consultation Lounge & Sterilization Protocol */}
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-2">
                  <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>Hospital-Grade Sterilization Protocols</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Every instrument undergoes vacuum autoclave sterilization, monitored with biological indicators and packaged in hermetically sealed pouches until chairside opening.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-2">
                  <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold">
                    <MessageCircle className="w-4 h-4 text-teal-400" />
                    <span>Unrushed Pre-Treatment Discussions</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    We listen carefully to symptoms, walk you through digital X-rays on screen, and explain alternatives before beginning any procedure.
                  </p>
                </div>
              </div>

              {/* Clinic Location Stamp */}
              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
                <span>Serving families across Hassan district</span>
                <span className="font-semibold text-teal-300">Mon–Sun Care</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                About K.M Dental Care
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Dental Care Designed Around You
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              K.M Dental Care is a dental clinic situated on Race Course Road, Rangoli Halla, Hassan, dedicated to delivering comfortable, professional dental care for patients seeking healthier teeth and confident smiles.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              We understand that visiting a dentist can sometimes cause apprehension. That is why our clinical philosophy centers around gentle techniques, open communication, and individualized treatment planning—taking the time to understand your dental health goals and ensuring you are completely at ease.
            </p>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3">
                <Heart className="w-5 h-5 text-teal-700 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Patient Comfort First</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Gentle chairside manner to help minimize apprehension during visits.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-teal-700 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Clear Communication</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Every option and step is explained clearly with no confusing jargon.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-teal-700 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Professional Treatment</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Thorough clinical protocols adhering to evidence-based dentistry.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3">
                <Smile className="w-5 h-5 text-teal-700 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Individualized Planning</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Custom care tailored to your specific oral anatomy and schedule.</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setTeamModalOpen(true)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <span>Meet Your Dental Team</span>
                <span className="text-slate-400">→</span>
              </button>

              <button
                type="button"
                onClick={() => openBookingModal()}
                className="px-4 py-2.5 bg-[#0B1E33] hover:bg-[#132e4d] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Book a Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Meet Your Dental Team Modal (Carefully presented without fabricating external credentials) */}
      {teamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  KM
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Clinical Team at K.M Dental Care</h3>
                  <p className="text-xs text-slate-500">Race Course Road, Rangoli Halla, Hassan</p>
                </div>
              </div>
              <button
                onClick={() => setTeamModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>
                At <strong>K.M Dental Care</strong>, our clinical team and dental nursing assistants are dedicated to patient-first dentistry. We place great emphasis on welcoming every patient with empathy, keeping treatments gentle, and answering every question you have regarding oral hygiene and procedures.
              </p>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Our Practice Commitments:</span>
                </div>
                <ul className="space-y-1.5 pl-5 list-disc text-slate-600">
                  <li>Transparent explanations of treatment necessities, stages, and options.</li>
                  <li>Gentle local anesthesia technique to ensure comfortable procedures.</li>
                  <li>Strict autoclave sterilization and single-use disposable consumables.</li>
                  <li>Post-treatment check-ins and hygiene guidance for lasting oral wellness.</li>
                </ul>
              </div>

              <p className="text-slate-500 italic text-[11px]">
                Have a specific question about your dental condition? Schedule a consultation to discuss your smile directly with our clinical team.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setTeamModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setTeamModalOpen(false);
                  openBookingModal();
                }}
                className="px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-semibold hover:bg-teal-800"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
