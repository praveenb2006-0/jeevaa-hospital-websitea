import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  User,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Phone,
  Printer,
  CalendarPlus,
  Shield,
  MapPin,
  Share2
} from 'lucide-react';
import { Department, Doctor, Appointment } from '../../types/hospital';
import { StorageService } from '../../services/storageService';
import { HOSPITAL_METADATA } from '../../data/hospitalData';
import { Language, TRANSLATIONS } from '../../utils/translations';
import confetti from 'canvas-confetti';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  doctors: Doctor[];
  initialDeptId?: string;
  initialDoctorId?: string;
  initialDate?: string;
  currentLang: Language;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  departments,
  doctors,
  initialDeptId,
  initialDoctorId,
  initialDate,
  currentLang
}) => {
  const t = TRANSLATIONS[currentLang];

  // 7 Steps: 1..7
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState<string>(initialDeptId || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId || '');
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Patient Details
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientType, setPatientType] = useState<'new' | 'followup'>('new');
  const [reason, setReason] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(false);

  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Reset or initialize when opened
  useEffect(() => {
    if (isOpen) {
      if (initialDeptId) setSelectedDeptId(initialDeptId);
      if (initialDoctorId) setSelectedDoctorId(initialDoctorId);
      if (initialDate) setSelectedDate(initialDate);

      // Advance to step 2 or 3 if pre-selected
      if (initialDeptId && initialDoctorId) {
        setCurrentStep(3);
      } else if (initialDeptId) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
      setConfirmedAppointment(null);
      setSubmissionError(null);
      setErrors({});
    }
  }, [isOpen, initialDeptId, initialDoctorId, initialDate]);

  if (!isOpen) return null;

  // Selected Department & Doctor Objects
  const selectedDept = departments.find(d => d.id === selectedDeptId);
  const deptDoctors = selectedDeptId
    ? doctors.filter(d => d.departmentId === selectedDeptId && d.isAvailable)
    : doctors.filter(d => d.isAvailable);

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  // Date constraints (Asia/Kolkata)
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30); // 30 days ahead booking
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Fetch live slot availability for selected doctor and date
  const availability = selectedDoctorId && selectedDate
    ? StorageService.getDoctorAvailability(selectedDoctorId, selectedDate)
    : null;

  // --- STEP VALIDATIONS ---
  const handleNext = () => {
    setErrors({});
    setSubmissionError(null);

    if (currentStep === 1) {
      if (!selectedDeptId) {
        setErrors({ dept: 'Please select a medical department to continue.' });
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedDoctorId) {
        setErrors({ doctor: 'Please choose a specialist or select Any Available Specialist.' });
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!selectedDate) {
        setErrors({ date: 'Please select an appointment date.' });
        return;
      }
      // Check if Sunday
      const chosenDay = new Date(selectedDate + 'T00:00:00').getDay();
      if (chosenDay === 0) {
        setErrors({ date: 'Regular OPD is closed on Sundays. In emergencies, please visit Casualty directly.' });
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!selectedTimeSlot) {
        setErrors({ timeSlot: 'Please select an available consultation time slot.' });
        return;
      }
      setCurrentStep(5);
    } else if (currentStep === 5) {
      const errs: { [key: string]: string } = {};
      if (!patientName.trim()) {
        errs.name = 'Patient name is required.';
      }
      const cleanPhone = patientPhone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        errs.phone = 'Please provide a valid 10-digit Indian mobile number.';
      }
      if (!consentAgreed) {
        errs.consent = 'Patient consent is required to process booking.';
      }

      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      setCurrentStep(6);
    }
  };

  const handleBack = () => {
    setErrors({});
    setSubmissionError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // --- STEP 6: SUBMIT ---
  const handleSubmitBooking = () => {
    if (!selectedDoctor || !selectedDept) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const formattedPhone = patientPhone.startsWith('+91')
        ? patientPhone
        : `+91 ${patientPhone.replace(/\D/g, '').slice(-10)}`;

      const result = StorageService.createAppointment({
        patientName: patientName.trim(),
        patientPhone: formattedPhone,
        patientEmail: patientEmail.trim() || undefined,
        patientAge: patientAge ? Number(patientAge) : undefined,
        patientGender,
        patientType,
        departmentId: selectedDept.id,
        departmentName: selectedDept.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        reason: reason.trim() || undefined
      });

      if (!result.success || !result.appointment) {
        setSubmissionError(result.error || 'Failed to complete appointment request.');
        setIsSubmitting(false);
        return;
      }

      setConfirmedAppointment(result.appointment);
      setCurrentStep(7);
      setIsSubmitting(false);

      // Trigger colorful celebration confetti burst
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#14b8a6', '#06b6d4', '#3b82f6', '#10b981', '#f59e0b']
        });
      } catch {
        // Safe fallback
      }
    } catch (e) {
      console.error(e);
      setSubmissionError('A system error occurred while recording the appointment. Please call the front desk.');
      setIsSubmitting(false);
    }
  };

  // Generate iCal ICS calendar download
  const downloadIcsFile = () => {
    if (!confirmedAppointment) return;
    const { bookingReference, doctorName, departmentName, date, timeSlot } = confirmedAppointment;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Jeevaa Super Speciality Hospital//Appointment//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:Hospital Appointment: ${doctorName} (${departmentName})`,
      `DESCRIPTION:Appointment Ref: ${bookingReference}\\nPatient: ${confirmedAppointment.patientName}\\nLocation: Jeevaa Super Speciality Hospital, New Jewargi Road, Kalaburagi`,
      `LOCATION:Jeevaa Super Speciality Hospital, Kalaburagi`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Jeevaa_Appointment_${bookingReference}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="bg-[#12304A] text-white p-5 sm:px-6 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-teal-300 font-medium">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{t.bookingModal.subtitle}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight mt-0.5">
              {t.bookingModal.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar (Steps 1 to 6) */}
        {currentStep < 7 && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-600 shrink-0 overflow-x-auto">
            <span className={currentStep === 1 ? 'text-[#168C8C] font-bold' : ''}>1. Dept</span>
            <span className="text-slate-300">›</span>
            <span className={currentStep === 2 ? 'text-[#168C8C] font-bold' : ''}>2. Doctor</span>
            <span className="text-slate-300">›</span>
            <span className={currentStep === 3 ? 'text-[#168C8C] font-bold' : ''}>3. Date</span>
            <span className="text-slate-300">›</span>
            <span className={currentStep === 4 ? 'text-[#168C8C] font-bold' : ''}>4. Slot</span>
            <span className="text-slate-300">›</span>
            <span className={currentStep === 5 ? 'text-[#168C8C] font-bold' : ''}>5. Details</span>
            <span className="text-slate-300">›</span>
            <span className={currentStep === 6 ? 'text-[#168C8C] font-bold' : ''}>6. Review</span>
          </div>
        )}

        {/* Step Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">

          {/* STEP 1: Select Department */}
          {currentStep === 1 && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">Step 1 — Select Medical Department</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose the clinical speciality matching your medical concern.
                </p>
              </div>

              {errors.dept && (
                <div className="p-3 mb-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.dept}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {departments.map(dept => {
                  const isSelected = selectedDeptId === dept.id;
                  return (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => {
                        setSelectedDeptId(dept.id);
                        setSelectedDoctorId('');
                        setErrors({});
                      }}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-[#168C8C] bg-teal-50/50 ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">{dept.name}</div>
                      <div className="text-[11px] text-teal-700 mt-0.5">{dept.kannadaName}</div>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{dept.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Select Doctor */}
          {currentStep === 2 && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">Step 2 — Select Specialist</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selected Department: <strong className="text-slate-800">{selectedDept?.name}</strong>
                </p>
              </div>

              {errors.doctor && (
                <div className="p-3 mb-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.doctor}</span>
                </div>
              )}

              <div className="space-y-2.5">
                {deptDoctors.map(doc => {
                  const isSelected = selectedDoctorId === doc.id;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => {
                        setSelectedDoctorId(doc.id);
                        setErrors({});
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-[#168C8C] bg-teal-50/50 ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#12304A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {doc.name.split(' ').map(n => n[0]).filter((_, i) => i === 1 || i === 2).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{doc.name}</div>
                          <div className="text-xs text-slate-600">{doc.qualifications}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {doc.experienceYears} Years Exp. · {doc.languagesSpoken.join(', ')}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-slate-900">₹{doc.consultationFee}</div>
                        <div className="text-[10px] text-slate-500">OPD Fee</div>
                      </div>
                    </button>
                  );
                })}

                {deptDoctors.length === 0 && (
                  <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-600">
                      Visiting specialist clinic schedules for this department are arranged directly by front desk triage.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        // fallback to senior surgeon or internist
                        if (doctors[0]) setSelectedDoctorId(doctors[0].id);
                      }}
                      className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
                    >
                      Assign Available On-Duty Specialist
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Select Date */}
          {currentStep === 3 && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">Step 3 — Select Appointment Date</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Doctor: <strong className="text-slate-800">{selectedDoctor?.name}</strong> · {selectedDept?.name}
                </p>
              </div>

              {errors.date && (
                <div className="p-3 mb-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.date}</span>
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label htmlFor="modal-date-picker" className="block text-xs font-semibold text-slate-700">
                  Select Consultation Date (Mon to Sat):
                </label>
                <input
                  id="modal-date-picker"
                  type="date"
                  min={todayStr}
                  max={maxDateStr}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTimeSlot('');
                    setErrors({});
                  }}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>• Regular OPD consultations take place Monday through Saturday.</div>
                  <div>• Sundays: Dedicated to emergency casualty, trauma resuscitation, and on-call ICU rounds.</div>
                  <div>• Timezone: Asia/Kolkata (IST).</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Select Time Slot */}
          {currentStep === 4 && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">Step 4 — Select Available Time Slot</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Date: <strong className="text-slate-800">{selectedDate}</strong> with <strong className="text-slate-800">{selectedDoctor?.name}</strong>
                </p>
              </div>

              {errors.timeSlot && (
                <div className="p-3 mb-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.timeSlot}</span>
                </div>
              )}

              {availability && !availability.isWorkDay ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                  <AlertCircle className="w-4 h-4 mb-1" />
                  {availability.message || 'Doctor is not available on this day.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Morning Slots */}
                  {availability && availability.availableMorningSlots.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Morning Outpatient Session (09:00 AM – 01:30 PM)
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availability.availableMorningSlots.map(slot => {
                          const isSelected = selectedTimeSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setSelectedTimeSlot(slot);
                                setErrors({});
                              }}
                              className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
                                isSelected
                                  ? 'bg-[#168C8C] text-white border-[#168C8C] shadow-sm'
                                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Evening Slots */}
                  {availability && availability.availableEveningSlots.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Evening Outpatient Session (04:30 PM – 08:00 PM)
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availability.availableEveningSlots.map(slot => {
                          const isSelected = selectedTimeSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setSelectedTimeSlot(slot);
                                setErrors({});
                              }}
                              className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
                                isSelected
                                  ? 'bg-[#168C8C] text-white border-[#168C8C] shadow-sm'
                                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Booked Slots Notice */}
                  {availability && availability.bookedSlots.length > 0 && (
                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      * Note: {availability.bookedSlots.length} slot(s) already booked on this date to prevent waiting and overcrowding.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Patient Details */}
          {currentStep === 5 && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">Step 5 — Patient Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Please provide necessary contact details for your hospital appointment pass.
                </p>
              </div>

              <div className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label htmlFor="patient-full-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    id="patient-full-name"
                    type="text"
                    placeholder="Enter patient full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>

                {/* Mobile Number with +91 Indian format */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="patient-mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (+91) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                        +91
                      </span>
                      <input
                        id="patient-mobile"
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={patientPhone.replace('+91 ', '')}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full text-xs pl-12 pr-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="patient-email-address" className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      id="patient-email-address"
                      type="email"
                      placeholder="patient@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Age & Gender & Status */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="patient-age-input" className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                    <input
                      id="patient-age-input"
                      type="number"
                      min={0}
                      max={120}
                      placeholder="e.g. 35"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="patient-gender-select" className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      id="patient-gender-select"
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="patient-visit-type-select" className="block text-xs font-semibold text-slate-700 mb-1">Patient Status</label>
                    <select
                      id="patient-visit-type-select"
                      value={patientType}
                      onChange={(e) => setPatientType(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900"
                    >
                      <option value="new">First Time / New</option>
                      <option value="followup">Follow-up Visit</option>
                    </select>
                  </div>
                </div>

                {/* Reason for consultation (Brief non-sensitive note) */}
                <div>
                  <label htmlFor="patient-chief-complaint" className="block text-xs font-semibold text-slate-700 mb-1">
                    Chief Complaint / Primary Reason for Consultation (Brief)
                  </label>
                  <textarea
                    id="patient-chief-complaint"
                    rows={2}
                    maxLength={200}
                    placeholder="e.g. Abdominal pain, routine sugar checkup, post-operative review..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900"
                  />
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    * Do not submit detailed medical history or sensitive clinical documents online.
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentAgreed}
                      onChange={(e) => setConsentAgreed(e.target.checked)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>
                      I consent to Jeevaa Super Speciality Hospital processing this information strictly for appointment scheduling and communication, adhering to patient privacy standards.
                    </span>
                  </label>
                  {errors.consent && <p className="text-[11px] text-rose-600 mt-1">{errors.consent}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Submit */}
          {currentStep === 6 && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">Step 6 — Review & Confirm Booking</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify the consultation summary before submitting your request.
                </p>
              </div>

              {submissionError && (
                <div className="p-3 mb-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Department:</span>
                    <strong className="text-slate-900">{selectedDept?.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Consultant Specialist:</span>
                    <strong className="text-slate-900">{selectedDoctor?.name}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Appointment Date:</span>
                    <strong className="text-slate-900">{selectedDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Time Slot:</span>
                    <strong className="text-teal-700 font-bold">{selectedTimeSlot} (IST)</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Patient Name:</span>
                    <strong className="text-slate-900">{patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Contact Phone:</span>
                    <strong className="text-slate-900">+91 {patientPhone.replace(/\D/g, '').slice(-10)}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-slate-500 block">Consultation Fee:</span>
                    <span className="text-[11px] text-slate-500">Payable at hospital reception</span>
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    ₹{selectedDoctor?.consultationFee}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs flex items-start gap-2">
                <Shield className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Appointment Status Notice:</strong>
                  Your booking request will be securely saved into the hospital scheduling system. Authorized hospital staff verify the queue and confirm the slot upon arrival or via SMS/call.
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Confirmation */}
          {currentStep === 7 && confirmedAppointment && (
            <div className="text-center py-2 space-y-4">
              <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold rounded-lg mb-2">
                  Status: Request Recorded ({confirmedAppointment.status.toUpperCase()})
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Appointment Request Submitted!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your official hospital appointment reference has been generated.
                </p>
              </div>

              {/* Printable Pass Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 print-include">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Booking Reference
                    </div>
                    <div className="text-lg font-mono font-extrabold text-[#12304A]">
                      {confirmedAppointment.bookingReference}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500">Hospital Location</div>
                    <div className="text-xs font-bold text-slate-800">Kalaburagi Campus</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Patient:</span>
                    <strong className="text-slate-900">{confirmedAppointment.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Specialist:</span>
                    <strong className="text-slate-900">{confirmedAppointment.doctorName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Department:</span>
                    <strong className="text-slate-900">{confirmedAppointment.departmentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date & Time:</span>
                    <strong className="text-teal-700">{confirmedAppointment.date} at {confirmedAppointment.timeSlot}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span>Room: Ground Floor / 1st Floor OPD Wing</span>
                  <span>Reporting: 15 mins prior</span>
                </div>
              </div>

              {/* Action Buttons for Confirmed Pass */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={downloadIcsFile}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-teal-600" />
                  <span>Add to Calendar</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-600" />
                  <span>Print Pass</span>
                </button>

                <a
                  href={HOSPITAL_METADATA.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>View Directions</span>
                </a>
              </div>

              {/* Notification & Helpline Assistance */}
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 text-left flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  Need to reschedule or have questions? Contact hospital reception directly at <strong>{HOSPITAL_METADATA.emergencyPhone}</strong> or <strong>{HOSPITAL_METADATA.deskPhone}</strong> quoting reference <strong>{confirmedAppointment.bookingReference}</strong>.
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Action Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {currentStep < 7 ? (
            <>
              <button
                type="button"
                onClick={currentStep === 1 ? onClose : handleBack}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                {currentStep === 1 ? 'Cancel' : <><ArrowLeft className="w-3.5 h-3.5" /> Back</>}
              </button>

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-[#12304A] hover:bg-[#194366] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitBooking}
                  className="px-6 py-2.5 bg-[#168C8C] hover:bg-[#127272] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Recording Request...' : 'Confirm & Submit'}</span>
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-[#12304A] hover:bg-[#194366] text-white text-xs font-bold rounded-xl transition-colors text-center"
            >
              Done / Close Window
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
