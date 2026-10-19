import React from 'react';

export const ClinicLogo: React.FC<{ className?: string; markOnly?: boolean }> = ({
  className = 'h-9',
  markOnly = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Refined minimalist dental & gentle smile emblem */}
      <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#0F355A] to-[#0A223B] flex items-center justify-center text-teal-400 shadow-sm border border-teal-500/20">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Subtle dental molar contour fused with gentle smile arc */}
          <path d="M12 4c-3.2 0-5.5 1.8-5.5 4.8 0 2.2 1 4.5 1.5 7.2.4 2 1.3 3.5 2.5 3.5s1.5-1.5 1.5-3.5c0-1.5.5-1.5 1-1.5s1 0 1 1.5c0 2 .3 3.5 1.5 3.5s2.1-1.5 2.5-3.5c.5-2.7 1.5-5 1.5-7.2C20 5.8 17.7 4 12 4z" />
          <path d="M9.5 9.5c1.5 1.2 3.5 1.2 5 0" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </div>
      {!markOnly && (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 tracking-tight text-lg leading-tight font-sans">
            K.M <span className="text-[#0E7490]">Dental Care</span>
          </span>
          <span className="text-[10px] tracking-wider text-slate-500 uppercase font-medium">
            Hassan, Karnataka
          </span>
        </div>
      )}
    </div>
  );
};

export const ClinicOperatoryIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1E33] via-[#102A45] to-[#081827] text-white p-6 shadow-xl border border-slate-700/40 ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Modern High-End Operatory SVG Scene */}
      <svg
        viewBox="0 0 600 400"
        className="w-full h-auto drop-shadow-md select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#132B45" />
            <stop offset="100%" stopColor="#0B1E33" />
          </linearGradient>
          <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0F243A" />
            <stop offset="100%" stopColor="#091522" />
          </linearGradient>
          <linearGradient id="chairCushion" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#0F766E" />
          </linearGradient>
          <linearGradient id="monitorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Interior background & architectural wall slats */}
        <rect x="0" y="0" width="600" height="290" fill="url(#wallGrad)" />
        <rect x="0" y="290" width="600" height="110" fill="url(#floorGrad)" />
        <line x1="0" y1="290" x2="600" y2="290" stroke="#1E3E61" strokeWidth="2" />

        {/* Ambient dental operatory window with soft daylight */}
        <rect x="360" y="30" width="200" height="180" rx="8" fill="#15324F" stroke="#25486B" strokeWidth="2" />
        <line x1="460" y1="30" x2="460" y2="210" stroke="#25486B" strokeWidth="2" />
        <line x1="360" y1="120" x2="560" y2="120" stroke="#25486B" strokeWidth="2" />
        {/* Soft mountain/sky outline through window */}
        <path d="M370 170 Q430 130 480 160 T555 140 L555 200 L370 200 Z" fill="#1C3F63" opacity="0.6" />

        {/* High-Tech Diagnostic RVG Monitor display on arm */}
        <line x1="160" y1="70" x2="160" y2="130" stroke="#64748B" strokeWidth="4" />
        <line x1="160" y1="110" x2="200" y2="110" stroke="#64748B" strokeWidth="4" />
        <rect x="200" y="65" width="130" height="90" rx="6" fill="#091421" stroke="#38BDF8" strokeWidth="2" />
        <rect x="206" y="71" width="118" height="78" rx="4" fill="url(#monitorGlow)" />
        {/* Digital X-Ray tooth visualization on screen */}
        <path d="M255 88 C250 88 244 92 244 100 C244 108 248 116 250 128 C252 134 255 137 258 137 C261 137 263 131 264 125 C266 122 268 122 270 125 C271 131 273 137 276 137 C279 137 282 134 284 128 C286 116 290 108 290 100 C290 92 284 88 279 88 C273 88 270 91 267 93 C264 91 261 88 255 88 Z" fill="#E2E8F0" opacity="0.85" />
        <circle cx="267" cy="105" r="4" fill="#38BDF8" />
        <text x="212" y="82" fill="#7DD3FC" fontSize="7" fontFamily="sans-serif" fontWeight="600">RVG DIGITAL DIAGNOSTICS</text>
        <text x="212" y="142" fill="#94A3B8" fontSize="6" fontFamily="sans-serif">K.M DENTAL CARE · HASSAN</text>

        {/* Ergonomic modern dental chair */}
        {/* Base and hydraulic column */}
        <ellipse cx="260" cy="350" rx="60" ry="14" fill="#0F172A" />
        <rect x="250" y="270" width="20" height="80" rx="4" fill="#475569" />
        
        {/* Chair backrest & seat reclining contour */}
        <path d="M140 220 C140 190 170 185 190 200 L240 235 L340 240 C365 240 380 255 375 275 L365 305 C360 315 345 320 330 320 L220 315 C190 315 160 300 150 280 L140 220 Z" fill="url(#chairCushion)" stroke="#14B8A6" strokeWidth="2" />
        
        {/* Contoured Headrest */}
        <ellipse cx="140" cy="190" rx="22" ry="14" fill="#0F766E" stroke="#2DD4BF" strokeWidth="1.5" />
        
        {/* Footrest section */}
        <path d="M340 240 L380 260 C395 270 405 285 395 295 L375 305" stroke="#0D9488" strokeWidth="14" strokeLinecap="round" />

        {/* Instrument delivery unit / assistant tray on swivel arm */}
        <path d="M260 270 Q300 240 330 200" stroke="#64748B" strokeWidth="5" fill="none" />
        <rect x="310" y="185" width="85" height="18" rx="4" fill="#E2E8F0" />
        {/* Handpiece cords */}
        <path d="M330 203 Q335 240 340 260" stroke="#94A3B8" strokeWidth="2" fill="none" />
        <path d="M350 203 Q355 245 360 265" stroke="#94A3B8" strokeWidth="2" fill="none" />
        <path d="M370 203 Q375 242 380 260" stroke="#94A3B8" strokeWidth="2" fill="none" />

        {/* Overhead LED surgical light */}
        <path d="M120 40 Q130 90 170 110" stroke="#64748B" strokeWidth="5" fill="none" />
        <ellipse cx="175" cy="112" rx="28" ry="12" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
        <ellipse cx="175" cy="114" rx="20" ry="7" fill="#FEF08A" filter="url(#softGlow)" />
        {/* Light beam */}
        <polygon points="155,120 195,120 280,260 170,260" fill="#FEF08A" opacity="0.12" />

        {/* Doctor stool in background */}
        <ellipse cx="110" cy="270" rx="22" ry="8" fill="#1E293B" />
        <line x1="110" y1="270" x2="110" y2="330" stroke="#475569" strokeWidth="6" />
        <ellipse cx="110" cy="335" rx="28" ry="8" fill="#0F172A" />

        {/* Clinic sterile packaging & cup filler station */}
        <rect x="40" y="240" width="55" height="110" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
        <rect x="46" y="250" width="43" height="30" rx="3" fill="#0F172A" />
        <circle cx="68" cy="265" r="7" fill="#38BDF8" opacity="0.6" />
      </svg>

      {/* Floating clinic badge overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-slate-200 font-medium">Sterile Operatory Environment</span>
        </div>
        <span className="text-teal-300 font-medium">Daily Autoclave Certified</span>
      </div>
    </div>
  );
};

export const ToothRestorationGraphic: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F2843] via-[#0E2034] to-[#0A1624] text-white p-6 border border-slate-700/50 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-teal-400 font-semibold">Endodontic Precision</span>
          <h4 className="text-base font-semibold text-slate-100">Preserving Your Natural Tooth</h4>
        </div>
        <div className="px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/30 text-[11px] text-teal-300 font-medium">
          Conservative Dentistry
        </div>
      </div>

      <svg viewBox="0 0 400 240" className="w-full h-auto drop-shadow" fill="none">
        <defs>
          <linearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="pulpHealed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
        </defs>

        {/* Bone & Gum Tissue boundary */}
        <path d="M20 120 Q100 135 200 130 T380 120 L380 230 L20 230 Z" fill="#1E293B" opacity="0.6" />
        <path d="M20 100 Q100 112 200 108 T380 100" stroke="#E11D48" strokeWidth="3" opacity="0.5" />

        {/* Healthy Natural Tooth Contour */}
        <path
          d="M130 50 C120 50 110 65 110 90 C110 115 125 140 135 180 C140 200 148 215 155 215 C162 215 168 195 172 170 C175 160 180 160 183 170 C187 195 193 215 200 215 C207 215 215 200 220 180 C230 140 245 115 245 90 C245 65 235 50 225 50 C210 50 200 58 178 58 C155 58 145 50 130 50 Z"
          fill="url(#toothGradient)"
          stroke="#94A3B8"
          strokeWidth="2.5"
        />

        {/* Treated and Sealed Root Canals (Clean, sanitized root fill) */}
        <path
          d="M165 75 C165 85 160 105 155 130 C150 155 148 185 152 198 C153 198 156 190 158 175 C162 150 168 120 172 95 Z"
          fill="url(#pulpHealed)"
        />
        <path
          d="M185 75 C185 85 190 105 195 130 C200 155 202 185 198 198 C197 198 194 190 192 175 C188 150 182 120 178 95 Z"
          fill="url(#pulpHealed)"
        />

        {/* Precision Crown Protection Cap */}
        <path
          d="M125 48 C115 48 107 60 107 80 L248 80 C248 60 240 48 230 48 C215 48 203 54 178 54 C153 54 140 48 125 48 Z"
          fill="#38BDF8"
          opacity="0.25"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeDasharray="4 3"
        />

        {/* Annotations */}
        <line x1="250" y1="65" x2="310" y2="65" stroke="#38BDF8" strokeWidth="1.5" />
        <circle cx="310" cy="65" r="3" fill="#38BDF8" />
        <text x="318" y="68" fill="#E2E8F0" fontSize="11" fontFamily="sans-serif">Restorative Crown</text>

        <line x1="205" y1="150" x2="310" y2="150" stroke="#2DD4BF" strokeWidth="1.5" />
        <circle cx="310" cy="150" r="3" fill="#2DD4BF" />
        <text x="318" y="153" fill="#E2E8F0" fontSize="11" fontFamily="sans-serif">Disinfected & Sealed Canal</text>

        <line x1="140" y1="210" x2="60" y2="210" stroke="#94A3B8" strokeWidth="1.5" />
        <circle cx="60" cy="210" r="3" fill="#94A3B8" />
        <text x="50" y="213" fill="#E2E8F0" fontSize="11" textAnchor="end" fontFamily="sans-serif">Natural Root Anchored</text>
      </svg>
    </div>
  );
};
