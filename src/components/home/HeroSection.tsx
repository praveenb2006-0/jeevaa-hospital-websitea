import React, { useState } from 'react';
import { Calendar, Phone, ArrowRight, Shield, HeartPulse, Clock, Sparkles } from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/hospitalData';
import { Department, Doctor } from '../../types/hospital';
import { Language, TRANSLATIONS } from '../../utils/translations';
import { HospitalCampusVisual } from '../common/MedicalVisuals';
import { HospitalCampus3D } from '../common/HospitalCampus3D';

interface HeroSectionProps {
  currentLang: Language;
  departments: Department[];
  doctors: Doctor[];
  onOpenBooking: (deptId?: string, doctorId?: string, preferredDate?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  departments,
  doctors,
  onOpenBooking
}) => {
  const t = TRANSLATIONS[currentLang];
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const filteredDoctors = selectedDeptId
    ? doctors.filter(d => d.departmentId === selectedDeptId && d.isAvailable)
    : doctors.filter(d => d.isAvailable);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBooking(selectedDeptId || undefined, selectedDocId || undefined, selectedDate || undefined);
  };

  // Default minimum date to today (Asia/Kolkata)
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section id="home" className="relative pt-6 pb-14 bg-gradient-to-b from-slate-900 via-[#0B1E33] to-[#0A1A2F] text-white border-b border-teal-900/40 overflow-hidden">
      
      {/* Animated Vibrant Ambient Glow Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid: Split column with Hero Copy & Interactive 3D Campus */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
          
          {/* Left Column: Proposition & CTAs (7 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Tagline Status Marker with Neon Gradient Border */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md border border-teal-400/40 rounded-full text-xs font-semibold text-teal-300 shadow-lg shadow-teal-900/30">
              <Sparkles className="w-4 h-4 text-teal-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-bold tracking-wide">{HOSPITAL_METADATA.name}</span>
              <span className="text-teal-400/60">·</span>
              <span className="text-cyan-200 font-medium">Kalaburagi, Karnataka</span>
            </div>

            {/* Headline with text-wrap: balance & vibrant glowing gradient */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]" style={{ textWrap: 'balance' }}>
              Advanced Care. <span className="bg-gradient-to-r from-teal-300 via-cyan-200 to-emerald-400 bg-clip-text text-transparent">Compassionate Healing.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {t.taglineSubtitle} Providing Kalaburagi and North Karnataka with round-the-clock Level-1 trauma casualty, intensive care units (MICU/SICU/NICU), and advanced laparoscopic surgery.
            </p>

            {/* Proposed Tagline Label */}
            <div className="text-xs text-slate-400 italic">
              * Note: “{HOSPITAL_METADATA.tagline}” represents the proposed institutional brand positioning.
            </div>

            {/* Primary & Secondary Actions with 3D Depth & Color */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="px-6 py-3.5 bg-gradient-to-r from-teal-500 via-[#168C8C] to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200 flex items-center gap-2.5 active:scale-95 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>{t.nav.bookAppointment}</span>
                <ArrowRight className="w-4 h-4 text-slate-900 stroke-[2.5]" />
              </button>

              <a
                href="#specialties"
                className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all duration-200 flex items-center gap-2 hover:border-teal-400/50"
              >
                <span>{t.actions.viewAllSpecialties}</span>
              </a>

              <a
                href={`tel:${HOSPITAL_METADATA.emergencyPhoneRaw}`}
                className="px-4 py-3.5 text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 font-bold text-sm rounded-xl shadow-md shadow-rose-900/40 transition-all flex items-center gap-2 active:scale-95"
              >
                <Phone className="w-4 h-4 text-white animate-bounce" />
                <span>Emergency: {HOSPITAL_METADATA.emergencyPhone}</span>
              </a>
            </div>

            {/* Hospital Verified Coordinates */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-teal-300 font-medium">
                <Shield className="w-4 h-4 text-teal-400" />
                <span>NABH-Ready Standards</span>
              </div>
              <span>·</span>
              <span>New Jewargi Road, Santosh Colony</span>
              <span>·</span>
              <a
                href={HOSPITAL_METADATA.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 font-semibold hover:text-cyan-200 underline inline-flex items-center gap-1"
              >
                Open Google Maps
              </a>
            </div>
          </div>

          {/* Right Column: Interactive 3D Medical Campus (6 cols) */}
          <div className="lg:col-span-6">
            <HospitalCampus3D
              className="h-[420px] sm:h-[460px]"
              onExploreWing={(wingName) => {
                if (wingName.includes('Casualty')) {
                  onOpenBooking('dept-emergency');
                } else if (wingName.includes('OT')) {
                  onOpenBooking('dept-surgery');
                } else if (wingName.includes('ICU')) {
                  onOpenBooking('dept-critical-care');
                } else {
                  onOpenBooking();
                }
              }}
            />
          </div>
        </div>

        {/* Compact Appointment Search Module - Vibrant Glassmorphism card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-teal-500/20 text-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-lg font-black text-[#12304A] flex items-center gap-2">
                <div className="p-1.5 bg-teal-100 text-[#168C8C] rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <span>{t.hero.quickBookTitle}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Instant OPD slot availability & consultant booking at New Jewargi Road campus
              </p>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>OPD Desk: <strong className="text-slate-800">Open for Bookings</strong></span>
            </div>
          </div>

          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Department Selector */}
            <div>
              <label htmlFor="hero-dept-select" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.hero.selectDept}
              </label>
              <select
                id="hero-dept-select"
                value={selectedDeptId}
                onChange={(e) => {
                  setSelectedDeptId(e.target.value);
                  setSelectedDocId('');
                }}
                className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">All Verified Specialties</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Selector */}
            <div>
              <label htmlFor="hero-doc-select" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.hero.selectDoctor}
              </label>
              <select
                id="hero-doc-select"
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Any Available Specialist</option>
                {filteredDoctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.medicalTitle.split(' ')[0]} {doc.medicalTitle.split(' ')[1] || ''})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selector */}
            <div>
              <label htmlFor="hero-date-input" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.hero.selectDate}
              </label>
              <input
                id="hero-date-input"
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Submit Action Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#168C8C] hover:bg-[#127272] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{t.hero.searchSlots}</span>
              </button>
            </div>
          </form>
        </div>

        {/* 4-Column Clinical Capability Strip */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{t.stats.roundTheClock}</div>
              <div className="text-xs text-slate-500">{t.stats.roundTheClockSub}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-teal-50 text-teal-600 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Advanced Surgical Care</div>
              <div className="text-xs text-slate-500">Laminar Airflow Operation Suites</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{t.stats.opdSchedule}</div>
              <div className="text-xs text-slate-500">{t.stats.opdScheduleSub}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{t.stats.pharmacy}</div>
              <div className="text-xs text-slate-500">{t.stats.pharmacySub}</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
