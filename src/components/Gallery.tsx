import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { X, ZoomIn, ChevronLeft, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';
import { GalleryItem } from '../types';

export const Gallery: React.FC = () => {
  const { galleryItems } = useClinic();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Treatment', 'Interior', 'Exterior', 'Clinic', 'Care'];

  const filteredItems = galleryItems.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
    }
  };

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
              Clinic Tour & Environment
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              A Glimpse Inside K.M Dental Care
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Take a visual tour of our modern operatory, patient lounge, diagnostic imaging systems, and sterile treatment environment in Hassan.
            </p>
          </div>

          {/* Category Tabs (Clean button controls) */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl self-start md:self-auto border border-slate-200/60">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-[#FBFBFA] shadow-xs hover:shadow-md transition-all duration-300"
            >
              {/* Responsive Styled Clinical Card Canvas with domain iconography */}
              <div
                className={`w-full aspect-[4/3] bg-gradient-to-br ${item.bgGradient} p-6 flex flex-col justify-between text-white relative overflow-hidden`}
              >
                {/* Subtle visual lines */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.15),transparent_60%)] pointer-events-none" />

                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] tracking-wider uppercase bg-white/10 backdrop-blur-md px-2.5 py-1 rounded text-teal-200 font-semibold border border-white/15">
                    {item.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 group-hover:scale-110 group-hover:bg-teal-600 transition-all">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                {/* SVG Clinic Representation */}
                <div className="my-auto text-center opacity-85 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-teal-500/15 border border-teal-400/20 flex items-center justify-center text-teal-300">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="text-xs font-mono text-teal-200">K.M Dental Care · Hassan</div>
                </div>

                <div className="z-10 bg-slate-950/70 backdrop-blur-md -mx-6 -mb-6 p-4 border-t border-white/10">
                  <h3 className="font-bold text-sm text-white">{item.title}</h3>
                  <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <div
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-white"
            >
              {/* Header */}
              <div className="p-4 bg-slate-950/80 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                    {filteredItems[lightboxIndex].category}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400">
                    {lightboxIndex + 1} of {filteredItems.length}
                  </span>
                </div>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                  aria-label="Close image viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main View Area */}
              <div
                className={`w-full aspect-[16/10] bg-gradient-to-br ${filteredItems[lightboxIndex].bgGradient} p-8 flex flex-col justify-center items-center text-center relative`}
              >
                <div className="w-24 h-24 rounded-3xl bg-teal-500/15 border border-teal-400/20 flex items-center justify-center text-teal-300 mb-4 shadow-xl">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-white max-w-md">
                  {filteredItems[lightboxIndex].title}
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mt-2 leading-relaxed">
                  {filteredItems[lightboxIndex].description}
                </p>

                {/* Left/Right buttons */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>Race Course Road, Rangoli Halla, Hassan</span>
                </span>
                <span className="text-[11px] text-teal-400">Sanitized Treatment Suite</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
