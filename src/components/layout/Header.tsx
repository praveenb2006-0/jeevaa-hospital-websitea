import React, { useState } from 'react';
import { Phone, Menu, X, Calendar, ShieldCheck, Globe, Clock } from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/hospitalData';
import { Language, TRANSLATIONS } from '../../utils/translations';
import { HospitalLogo } from '../common/MedicalVisuals';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenBooking: (deptId?: string, doctorId?: string) => void;
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenBooking,
  onOpenTracker,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Clinical Utility Strip */}
      <div className="bg-[#12304A] text-white text-xs px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-semibold text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            24/7 Emergency Casualty:
          </span>
          <a
            href={`tel:${HOSPITAL_METADATA.emergencyPhoneRaw}`}
            className="font-bold tracking-wide hover:text-teal-300 transition-colors inline-flex items-center gap-1 underline underline-offset-2"
          >
            <Phone className="w-3.5 h-3.5" />
            {HOSPITAL_METADATA.emergencyPhone}
          </a>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">
            {HOSPITAL_METADATA.shortAddress}
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <button
            onClick={onOpenTracker}
            className="hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
          >
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{t.nav.trackBooking}</span>
          </button>
          
          <span className="text-slate-600">|</span>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-white/10 rounded px-1.5 py-0.5">
            <Globe className="w-3 h-3 text-teal-300" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-1 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentLang === 'en' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('kn')}
              className={`px-1 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentLang === 'kn' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          <span className="text-slate-600">|</span>

          {/* Hospital Staff Portal Link */}
          <button
            onClick={onOpenAdmin}
            className="hover:text-teal-300 transition-colors text-[11px] font-medium flex items-center gap-1"
            title="Hospital Administrative Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">{t.nav.admin}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar following Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text/logo lockup element) */}
        <a href="#home" className="shrink-0 flex items-center">
          <HospitalLogo />
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
          <a href="#about" className="hover:text-[#168C8C] transition-colors whitespace-nowrap shrink-0">
            About Hospital
          </a>
          <a href="#specialties" className="hover:text-[#168C8C] transition-colors whitespace-nowrap shrink-0">
            {t.nav.specialties}
          </a>
          <a href="#doctors" className="hover:text-[#168C8C] transition-colors whitespace-nowrap shrink-0">
            {t.nav.doctors}
          </a>
          <a href="#facilities" className="hover:text-[#168C8C] transition-colors whitespace-nowrap shrink-0">
            {t.nav.facilities}
          </a>
          <a href="#patient-guide" className="hover:text-[#168C8C] transition-colors whitespace-nowrap shrink-0">
            {t.nav.patientInfo}
          </a>
          <a href="#contact" className="hover:text-[#168C8C] transition-colors whitespace-nowrap shrink-0">
            {t.nav.contact}
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100/90 hover:bg-slate-200/90 active:scale-95 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-slate-200/80 shadow-xs cursor-pointer"
            title="Open Hospital Management & Booking Admin Panel"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Admin Portal</span>
          </button>

          <button
            onClick={() => onOpenBooking()}
            className="px-5 py-2.5 text-xs font-black text-slate-950 bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 active:scale-95 rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer transform hover:-translate-y-0.5"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
            <span>{t.nav.bookAppointment}</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => onOpenBooking()}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#12304A] rounded-lg"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-600"
          >
            About Hospital
          </a>
          <a
            href="#specialties"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-600"
          >
            {t.nav.specialties}
          </a>
          <a
            href="#doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-600"
          >
            {t.nav.doctors}
          </a>
          <a
            href="#facilities"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-600"
          >
            {t.nav.facilities}
          </a>
          <a
            href="#patient-guide"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-600"
          >
            {t.nav.patientInfo}
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-teal-600"
          >
            {t.nav.contact}
          </a>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracker();
              }}
              className="w-full py-2.5 px-4 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg text-center"
            >
              {t.nav.trackBooking}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 px-4 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg text-center"
            >
              {t.nav.admin}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
