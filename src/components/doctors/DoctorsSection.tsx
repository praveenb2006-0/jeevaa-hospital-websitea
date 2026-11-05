import React, { useState } from 'react';
import { Search, Calendar, User, Clock, CheckCircle2, ChevronRight, X, Phone } from 'lucide-react';
import { Doctor } from '../../types/hospital';
import { Language, TRANSLATIONS } from '../../utils/translations';
import { HOSPITAL_METADATA } from '../../data/hospitalData';

interface DoctorsSectionProps {
  doctors: Doctor[];
  currentLang: Language;
  onOpenBooking: (deptId?: string, doctorId?: string) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  doctors,
  currentLang,
  onOpenBooking
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const t = TRANSLATIONS[currentLang];

  const uniqueDepartments = Array.from(new Set(doctors.map(d => d.departmentName)));

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.qualifications.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.medicalTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialInterests.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedDeptFilter !== 'all' && doc.departmentName !== selectedDeptFilter) return false;
    return true;
  });

  return (
    <section id="doctors" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#168C8C] mb-1">
              Medical Roster & Clinical Faculty
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A] tracking-tight">
              Consultant Specialists & Surgeons
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Meet our qualified clinical team providing specialized outpatient consultations and advanced inpatient care in Kalaburagi.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctor or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5 mb-8 p-1 bg-slate-100 rounded-xl max-w-fit">
          <button
            onClick={() => setSelectedDeptFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedDeptFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Specialists ({doctors.length})
          </button>
          {uniqueDepartments.map(deptName => (
            <button
              key={deptName}
              onClick={() => setSelectedDeptFilter(deptName)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedDeptFilter === deptName
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {deptName}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <div
              key={doctor.id}
              className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 hover:border-teal-400 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle 3D background color reflection */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-teal-500/10 via-cyan-400/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

              <div className="relative z-10">
                {/* Header Profile Info */}
                <div className="flex items-start gap-4">
                  {/* Doctor Avatar Container with Vibrant Multi-Color Ring & Gradient */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#12304A] via-[#168C8C] to-[#0ea5e9] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-teal-900/20 shrink-0 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300">
                      {doctor.name.split(' ').map(n => n[0]).filter((_, i) => i === 1 || i === 2).join('') || 'DR'}
                    </div>
                    {/* Live Online Doctor Status Dot */}
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                      doctor.dutyStatus === 'on-leave' || !doctor.isAvailable ? 'bg-rose-500' : 'bg-emerald-500 ring-2 ring-emerald-300/40'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-teal-700 font-extrabold tracking-wide uppercase truncate">
                      {doctor.departmentName}
                    </div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-teal-800 transition-colors truncate">
                      {doctor.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      {doctor.qualifications}
                    </div>
                  </div>
                </div>

                {/* Sub-title & Experience */}
                <div className="mt-3 text-xs text-slate-600 leading-snug">
                  {doctor.medicalTitle}
                </div>

                {/* Clean Unboxed Metadata */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                  <span>{doctor.experienceYears} Years Exp.</span>
                  <span aria-hidden="true">·</span>
                  <span>{doctor.languagesSpoken.slice(0, 2).join(', ')}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-slate-700">₹{doctor.consultationFee} OPD</span>
                </div>

                {/* Duty Shift Timings & Location */}
                <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-teal-600" />
                      Duty Shift Hours
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      doctor.dutyStatus === 'on-leave' || !doctor.isAvailable
                        ? 'bg-rose-50 text-rose-700'
                        : doctor.dutyStatus === 'in-surgery'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {doctor.dutyStatus === 'on-leave' || !doctor.isAvailable ? 'On Leave' : doctor.dutyStatus === 'in-surgery' ? 'In Surgery' : 'On-Duty'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    {doctor.opdSchedule.dutyJoiningTimeMorning && doctor.opdSchedule.dutyEndingTimeMorning && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Morning Shift:</span>
                        <span className="font-medium text-slate-800">{doctor.opdSchedule.dutyJoiningTimeMorning} – {doctor.opdSchedule.dutyEndingTimeMorning}</span>
                      </div>
                    )}
                    {doctor.opdSchedule.dutyJoiningTimeEvening && doctor.opdSchedule.dutyEndingTimeEvening && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Evening Shift:</span>
                        <span className="font-medium text-slate-800">{doctor.opdSchedule.dutyJoiningTimeEvening} – {doctor.opdSchedule.dutyEndingTimeEvening}</span>
                      </div>
                    )}
                    {doctor.opdSchedule.roomLocation && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                        <span className="text-slate-500">OPD Room:</span>
                        <span className="font-medium text-teal-800">{doctor.opdSchedule.roomLocation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Schedule Days */}
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                  <span className="font-medium text-slate-700">Days:</span>
                  <span className="truncate">{doctor.opdSchedule.days.join(', ')}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="text-xs font-semibold text-slate-700 hover:text-teal-700 transition-colors"
                >
                  View Profile
                </button>

                {doctor.dutyStatus === 'on-leave' || !doctor.isAvailable ? (
                  <button
                    disabled
                    className="px-3.5 py-2 text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl cursor-not-allowed"
                    title={doctor.leaveReason || 'Doctor is currently on leave'}
                  >
                    On Leave
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenBooking(doctor.departmentId, doctor.id)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#12304A] hover:bg-[#194366] rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-teal-300" />
                    <span>Book Slot</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-600">No doctors match your search or filter.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedDeptFilter('all'); }}
              className="mt-3 text-xs font-semibold text-teal-700 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}

      </div>

      {/* Doctor Detailed Profile Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl relative animate-in fade-in duration-150">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute right-5 top-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4 pr-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#12304A] to-[#168C8C] flex items-center justify-center text-white font-bold text-xl shadow-sm shrink-0">
                {selectedDoctor.name.split(' ').map(n => n[0]).filter((_, i) => i === 1 || i === 2).join('') || 'DR'}
              </div>

              <div>
                <div className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                  {selectedDoctor.departmentName}
                </div>
                <h3 className="text-xl font-bold text-[#12304A]">
                  {selectedDoctor.name}
                </h3>
                <div className="text-xs text-slate-600 font-medium">
                  {selectedDoctor.qualifications}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selectedDoctor.medicalTitle}
                </div>
              </div>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-3 gap-2 mt-5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
              <div>
                <div className="text-slate-500 text-[11px]">Experience</div>
                <div className="font-bold text-slate-900 mt-0.5">{selectedDoctor.experienceYears} Years</div>
              </div>
              <div className="border-x border-slate-200">
                <div className="text-slate-500 text-[11px]">Consultation Fee</div>
                <div className="font-bold text-teal-800 mt-0.5">₹{selectedDoctor.consultationFee}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[11px]">Consultation Mode</div>
                <div className="font-bold text-slate-900 mt-0.5">In-Person OPD</div>
              </div>
            </div>

            {/* Biography */}
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Professional Background
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedDoctor.bio}
              </p>
            </div>

            {/* Special Interests */}
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Clinical Focus & Areas of Practice
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedDoctor.specialInterests.map((interest, i) => (
                  <span key={i} className="text-xs text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>Outpatient Consultation Timings</span>
              </h4>
              <div className="text-xs text-slate-700 space-y-1">
                <div>
                  <span className="font-semibold">Consulting Days:</span> {selectedDoctor.opdSchedule.days.join(', ')}
                </div>
                {selectedDoctor.opdSchedule.morningSlots.length > 0 && (
                  <div>
                    <span className="font-semibold">Morning Session:</span> {selectedDoctor.opdSchedule.morningSlots[0]} – {selectedDoctor.opdSchedule.morningSlots[selectedDoctor.opdSchedule.morningSlots.length - 1]}
                  </div>
                )}
                {selectedDoctor.opdSchedule.eveningSlots.length > 0 && (
                  <div>
                    <span className="font-semibold">Evening Session:</span> {selectedDoctor.opdSchedule.eveningSlots[0]} – {selectedDoctor.opdSchedule.eveningSlots[selectedDoctor.opdSchedule.eveningSlots.length - 1]}
                  </div>
                )}
                <div className="text-[11px] text-slate-500 mt-2 italic">
                  * Consultation slots run approximately {selectedDoctor.opdSchedule.slotDurationMinutes} minutes per patient.
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="mt-4 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Languages Spoken: </span>
              {selectedDoctor.languagesSpoken.join(', ')}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const doc = selectedDoctor;
                  setSelectedDoctor(null);
                  onOpenBooking(doc.departmentId, doc.id);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#12304A] hover:bg-[#194366] rounded-xl flex items-center gap-2 transition-colors shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-teal-300" />
                <span>Book Appointment with {selectedDoctor.name}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
