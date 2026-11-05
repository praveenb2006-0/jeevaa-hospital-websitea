import React from 'react';

export const HospitalLogo: React.FC<{ className?: string; iconOnly?: boolean }> = ({
  className = 'h-10',
  iconOnly = false
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Hospital Monogram Embellishment */}
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#12304A] to-[#168C8C] flex items-center justify-center text-white shadow-sm shrink-0">
        <svg viewBox="0 0 40 40" className="w-6 h-6 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Medical Cross with Gentle Pulse Flow */}
          <path d="M20 7v26M7 20h26" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
          <path d="M12 20h4l2-4 4 8 2-4h4" stroke="#7ee8e8" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col text-left">
          <span className="text-lg font-bold tracking-tight text-[#12304A] leading-tight">
            JEEVAA
          </span>
          <span className="text-[11px] font-semibold text-[#168C8C] tracking-wide uppercase">
            Super Speciality Hospital
          </span>
        </div>
      )}
    </div>
  );
};

export const HospitalCampusVisual: React.FC<{ className?: string }> = ({ className = 'h-72' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F273E] via-[#12304A] to-[#165668] text-white p-6 md:p-8 flex flex-col justify-between shadow-sm ${className}`}>
      {/* Background Architectural Vector Grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="arch-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arch-grid)" />
        </svg>
      </div>

      {/* Top Banner Tag */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-xs font-medium text-teal-200 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          Kalaburagi Medical Campus
        </div>
        <span className="text-xs text-slate-300">New Jewargi Road</span>
      </div>

      {/* Graphic representation of modern multi-storey hospital facade */}
      <div className="relative z-10 my-4 flex justify-center items-end h-40">
        <svg viewBox="0 0 500 180" className="w-full max-w-md h-full filter drop-shadow-md">
          {/* Main Hospital Multi-Storey Block */}
          <rect x="120" y="20" width="260" height="150" rx="4" fill="#1b4163" stroke="#2c5c8a" strokeWidth="2" />
          
          {/* Hospital Windows Grid */}
          {[0, 1, 2, 3].map(row => (
            <g key={row}>
              {[0, 1, 2, 3, 4].map(col => (
                <rect
                  key={col}
                  x={145 + col * 44}
                  y={40 + row * 26}
                  width="28"
                  height="16"
                  rx="2"
                  fill="#7de2df"
                  opacity={0.35 + ((row + col) % 3) * 0.15}
                />
              ))}
            </g>
          ))}

          {/* Roof Heli-pad / AC Plant line */}
          <rect x="180" y="14" width="140" height="6" rx="1" fill="#2c5c8a" />
          <rect x="220" y="8" width="60" height="6" rx="1" fill="#168C8C" />

          {/* Emergency / Main Entrance Canopy */}
          <rect x="200" y="140" width="100" height="30" rx="2" fill="#0d2235" />
          <path d="M190 140 h120 l-10 -15 h-100 z" fill="#168C8C" />
          <text x="250" y="135" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700" letterSpacing="0.5">
            JEEVAA CASUALTY
          </text>

          {/* Ground level landscape accents */}
          <path d="M20 170 h460" stroke="#254d73" strokeWidth="3" />
          <circle cx="80" cy="155" r="14" fill="#14524c" />
          <circle cx="420" cy="155" r="14" fill="#14524c" />
          <rect x="50" y="150" width="35" height="20" rx="4" fill="#dc2626" opacity="0.8" />
          <text x="67" y="163" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">AMB</text>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-slate-300 border-t border-white/10 pt-3 gap-2">
        <span className="font-medium text-white">Full-Fledged Multispecialty Hospital</span>
        <span className="text-teal-300">24/7 Trauma • MICU / SICU / NICU • Modular OT</span>
      </div>
    </div>
  );
};
