export type AppointmentStatus = 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed' | 'no-show';

export type ConsultationPeriod = 'morning' | 'evening';

export type PatientType = 'new' | 'followup';

export interface Department {
  id: string;
  slug: string;
  name: string;
  kannadaName: string;
  description: string;
  iconName: string;
  keyTreatments: string[];
  emergencyAvailable: boolean;
  opdTimings: string;
  roomLocation: string;
  faqs: { question: string; answer: string }[];
  isConfirmed: boolean;
}

export type DoctorDutyStatus = 'on-duty' | 'on-leave' | 'in-surgery' | 'on-call';

export interface DoctorSchedule {
  days: string[]; // e.g. ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  dutyJoiningTimeMorning?: string; // e.g. "09:30 AM"
  dutyEndingTimeMorning?: string;  // e.g. "01:30 PM"
  dutyJoiningTimeEvening?: string; // e.g. "04:30 PM"
  dutyEndingTimeEvening?: string;  // e.g. "08:00 PM"
  morningSlots: string[]; // e.g. ["09:30 AM", "10:00 AM", ...]
  eveningSlots: string[]; // e.g. ["04:30 PM", "05:00 PM", ...]
  slotDurationMinutes: number;
  roomLocation?: string;
}

export interface Doctor {
  id: string;
  name: string;
  medicalTitle: string;
  qualifications: string;
  departmentId: string;
  departmentName: string;
  experienceYears: number;
  consultationFee: number | null; // null if not publicly published
  feeNote: string;
  opdSchedule: DoctorSchedule;
  languagesSpoken: string[];
  bio: string;
  specialInterests: string[];
  isVisiting: boolean;
  isAvailable: boolean;
  dutyStatus?: DoctorDutyStatus;
  leaveReason?: string;
  dutyNotes?: string;
  photoUrl?: string;
}

export interface Appointment {
  id: string;
  bookingReference: string; // e.g. JV-2026-1042
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other';
  patientType: PatientType;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  status: AppointmentStatus;
  reason?: string;
  hospitalNotes?: string;
  statusUpdateReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
