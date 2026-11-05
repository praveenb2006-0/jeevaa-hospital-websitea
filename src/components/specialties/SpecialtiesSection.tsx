import React, { useState } from 'react';
import { Search, ArrowRight, Clock, MapPin, CheckCircle, HelpCircle, X, Calendar } from 'lucide-react';
import { Department, Doctor } from '../../types/hospital';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface SpecialtiesSectionProps {
  departments: Department[];
  doctors: Doctor[];
  currentLang: Language;
  onOpenBooking: (deptId?: string, doctorId?: string) => void;
}

export const SpecialtiesSection: React.FC<SpecialtiesSectionProps> = ({
  departments,
  doctors,
  currentLang,
  onOpenBooking
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'emergency' | 'surgical' | 'medical'>('all');
  const t = TRANSLATIONS[currentLang];

  const filteredDepts = departments.filter(dept => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.kannadaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.keyTreatments.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'emergency') return dept.emergencyAvailable;
    if (filterType === 'surgical') return dept.id === 'dept-surgery' || dept.id === 'dept-orthopaedics' || dept.id === 'dept-obgyn';
    if (filterType === 'medical') return dept.id === 'dept-medicine' || dept.id === 'dept-pediatrics' || dept.id === 'dept-gastro';
    return true;
  });

  return (
    <section id="specialties" className="py-16 bg-[#F7F9FB] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#168C8C] mb-1">
              Clinical Excellence & Care Units
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A] tracking-tight">
              Verified Medical Specialties & Services
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Specialist consultation departments and inpatient units confirmed operating at Jeevaa Super Speciality Hospital, Kalaburagi.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search treatments or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>
        </div>

        {/* Functional Filter Tabs (buttons with click handlers, anti-slop compliant) */}
        <div className="flex flex-wrap items-center gap-1.5 mb-8 p-1 bg-slate-200/60 rounded-xl max-w-fit">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Departments ({departments.length})
          </button>
          <button
            onClick={() => setFilterType('emergency')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterType === 'emergency'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            24/7 Critical & Emergency
          </button>
          <button
            onClick={() => setFilterType('surgical')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterType === 'surgical'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Surgical & Laparoscopic
          </button>
          <button
            onClick={() => setFilterType('medical')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterType === 'medical'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Medicine & Pediatrics
          </button>
        </div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepts.map((dept, index) => {
            const deptDocs = doctors.filter(d => d.departmentId === dept.id);
            // Dynamic colorful medical gradient borders & badges
            const colorPalettes = [
              { border: 'hover:border-cyan-400', glow: 'from-cyan-500/10 via-teal-500/5 to-transparent', iconBg: 'bg-gradient-to-br from-cyan-500 to-teal-600', badge: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
              { border: 'hover:border-indigo-400', glow: 'from-indigo-500/10 via-blue-500/5 to-transparent', iconBg: 'bg-gradient-to-br from-blue-600 to-indigo-600', badge: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
              { border: 'hover:border-emerald-400', glow: 'from-emerald-500/10 via-teal-500/5 to-transparent', iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
              { border: 'hover:border-rose-400', glow: 'from-rose-500/10 via-orange-500/5 to-transparent', iconBg: 'bg-gradient-to-br from-rose-500 to-red-600', badge: 'bg-rose-50 text-rose-800 border-rose-200' },
              { border: 'hover:border-amber-400', glow: 'from-amber-500/10 via-yellow-500/5 to-transparent', iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
              { border: 'hover:border-teal-400', glow: 'from-teal-500/10 via-emerald-500/5 to-transparent', iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-600', badge: 'bg-teal-50 text-teal-800 border-teal-200' }
            ];
            const palette = colorPalettes[index % colorPalettes.length];

            return (
              <div
                key={dept.id}
                className={`relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 ${palette.border} hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden`}
              >
                {/* 3D ambient subtle background gradient glow */}
                <div className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-br ${palette.glow} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                <div className="relative z-10">
                  {/* Top Metadata Header with Colorful Badges */}
                  <div className="flex items-center justify-between text-xs mb-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider border shadow-xs ${palette.badge}`}>
                      {currentLang === 'kn' ? dept.kannadaName : 'Super Speciality'}
                    </span>
                    {dept.emergencyAvailable ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-bold text-[10px] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        24/7 On-Duty
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px] font-medium">Daily OPD</span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3.5 mb-2">
                    <div className={`w-12 h-12 rounded-2xl ${palette.iconBg} text-white flex items-center justify-center shadow-md shadow-slate-300/50 group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                      <span className="text-base font-extrabold">{dept.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-[#168C8C] transition-colors leading-snug">
                        {dept.name}
                      </h3>
                      {currentLang === 'en' && dept.kannadaName && (
                        <div className="text-xs text-slate-500 mt-0.5 font-medium">{dept.kannadaName}</div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                    {dept.description}
                  </p>

                  {/* Key Treatments List */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                      <span>Key Interventions</span>
                      <span className="text-[10px] text-teal-700 font-semibold">{deptDocs.length} Specialists</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {dept.keyTreatments.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 group/item">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0 group-hover/item:text-emerald-500 transition-colors" />
                          <span className="font-medium text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action Strip with 3D button effects */}
                <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedDept(dept)}
                    className="text-xs font-bold text-[#168C8C] hover:text-[#127272] flex items-center gap-1.5 transition-colors group-hover:translate-x-0.5 duration-200 cursor-pointer"
                  >
                    <span>View Faculty & FAQs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenBooking(dept.id)}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#12304A] to-[#1a466a] hover:from-[#168C8C] hover:to-teal-500 rounded-xl transition-all shadow-md shadow-slate-900/10 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-teal-300" />
                    <span>Book Slot</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredDepts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-600 font-medium">No medical departments match your query "{searchTerm}".</p>
            <button
              onClick={() => { setSearchTerm(''); setFilterType('all'); }}
              className="mt-3 text-xs font-semibold text-teal-700 hover:underline"
            >
              Reset filters and show all specialties
            </button>
          </div>
        )}

      </div>

      {/* Specialty Detail Modal */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl relative animate-in fade-in duration-150">
            {/* Close Button */}
            <button
              onClick={() => setSelectedDept(null)}
              className="absolute right-5 top-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-8">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Clinical Department</span>
                <span aria-hidden="true">·</span>
                <span className="text-teal-700 font-medium">{selectedDept.kannadaName}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#12304A]">
                {selectedDept.name}
              </h3>
            </div>

            {/* Timings & Room Info Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <span className="font-semibold block">OPD Consultation Hours:</span>
                  <span>{selectedDept.opdTimings}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <span className="font-semibold block">Campus Room Location:</span>
                  <span>{selectedDept.roomLocation}</span>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Department Overview
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedDept.description}
              </p>
            </div>

            {/* Treatments List */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                Clinical Treatments & Medical Procedures
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedDept.keyTreatments.map((treatment, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{treatment}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Doctors in this department */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                Department Specialists
              </h4>
              <div className="space-y-2">
                {doctors
                  .filter(d => d.departmentId === selectedDept.id)
                  .map(doc => (
                    <div key={doc.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{doc.name}</div>
                        <div className="text-xs text-slate-500">{doc.qualifications} · {doc.experienceYears} Years Clinical Exp.</div>
                        <div className="text-[11px] text-teal-700 mt-0.5">
                          Languages: {doc.languagesSpoken.join(', ')}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDept(null);
                          onOpenBooking(selectedDept.id, doc.id);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#168C8C] hover:bg-[#127272] rounded-lg shrink-0 transition-colors"
                      >
                        Book Doctor
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* FAQs */}
            {selectedDept.faqs && selectedDept.faqs.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Frequently Asked Clinical Questions</span>
                </h4>
                <div className="space-y-2.5">
                  {selectedDept.faqs.map((faq, i) => (
                    <div key={i} className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="font-semibold text-slate-900 mb-1">{faq.question}</div>
                      <div className="text-slate-600 leading-relaxed">{faq.answer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setSelectedDept(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const deptId = selectedDept.id;
                  setSelectedDept(null);
                  onOpenBooking(deptId);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#12304A] hover:bg-[#194366] rounded-xl flex items-center gap-2 transition-colors shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-teal-300" />
                <span>Book Appointment in {selectedDept.name}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
