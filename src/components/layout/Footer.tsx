import React from 'react';
import { Phone, MapPin, Mail, ShieldCheck, Heart, ExternalLink, Calendar } from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/hospitalData';
import { HospitalLogo } from '../common/MedicalVisuals';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenTracker,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-[#0D2235] text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
                J
              </div>
              <div>
                <div className="text-base font-bold text-white tracking-tight">
                  Jeevaa Super Speciality Hospital
                </div>
                <div className="text-[11px] text-teal-400 font-semibold uppercase tracking-wider">
                  Kalaburagi, Karnataka
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Providing round-the-clock emergency casualty care, high-dependency intensive care units (MICU/SICU/NICU), and advanced general and laparoscopic surgical services for North Karnataka.
            </p>

            <div className="text-[11px] text-slate-500 italic">
              Proposed Tagline: “{HOSPITAL_METADATA.tagline}”
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#about" className="hover:text-white transition-colors">About Hospital</a>
              </li>
              <li>
                <a href="#specialties" className="hover:text-white transition-colors">Specialties & Care</a>
              </li>
              <li>
                <a href="#doctors" className="hover:text-white transition-colors">Medical Specialists</a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-white transition-colors">Hospital Facilities</a>
              </li>
              <li>
                <a href="#patient-guide" className="hover:text-white transition-colors">Patient & Visitor Guide</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Location Directions</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Patient Actions & Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Patient Services
            </div>
            <div className="space-y-2 text-xs">
              <button
                onClick={onOpenBooking}
                className="w-full text-left py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-between transition-colors"
              >
                <span>Book Outpatient Visit</span>
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
              </button>

              <button
                onClick={onOpenTracker}
                className="w-full text-left py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-between transition-colors"
              >
                <span>Track Booking Reference</span>
                <span className="text-[10px] text-teal-400">Status Lookup</span>
              </button>

              <div className="pt-2 text-[11px] text-slate-400">
                <span className="font-semibold text-white block">Cashless Insurance Desk:</span>
                TPA authorization and cashless admission assistance on Ground Floor.
              </div>
            </div>
          </div>

          {/* Col 4: Verified Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Emergency & Campus Contact
            </div>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">24/7 Casualty Emergency:</span>
                  <a href={`tel:${HOSPITAL_METADATA.emergencyPhoneRaw}`} className="font-bold text-white hover:text-teal-300">
                    {HOSPITAL_METADATA.emergencyPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Hospital General Desk:</span>
                  <span className="text-white font-medium">{HOSPITAL_METADATA.deskPhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  {HOSPITAL_METADATA.shortAddress}, Karnataka — 585102
                </div>
              </div>

              <div className="pt-1">
                <a
                  href={HOSPITAL_METADATA.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-300 hover:underline inline-flex items-center gap-1"
                >
                  <span>Google Maps Pin</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Quiet Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Jeevaa Super Speciality Hospital, Kalaburagi. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Patient Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Consultation</span>
            <span>·</span>
            <button
              onClick={onOpenAdmin}
              className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
