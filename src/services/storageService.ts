import {
  Appointment,
  AppointmentStatus,
  AuditLog,
  ContactInquiry,
  Department,
  Doctor
} from '../types/hospital';
import {
  INITIAL_AUDIT_LOGS,
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_SAMPLE_APPOINTMENTS
} from '../data/hospitalData';
import { SupabaseService } from './supabaseClient';

const STORAGE_KEYS = {
  APPOINTMENTS: 'jeevaa_hospital_appointments_v1',
  DOCTORS: 'jeevaa_hospital_doctors_v1',
  DEPARTMENTS: 'jeevaa_hospital_departments_v1',
  AUDIT_LOGS: 'jeevaa_hospital_audit_logs_v1',
  INQUIRIES: 'jeevaa_hospital_inquiries_v1'
};

function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to read from localStorage key "${key}":`, e);
    return defaultValue;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write to localStorage key "${key}":`, e);
  }
}

// Generate unique reference JV-YYYY-XXXX
function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `JV-${year}-${randomNum}`;
}

export const StorageService = {
  // --- DEPARTMENTS ---
  getDepartments(): Department[] {
    return safeGetItem<Department[]>(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },

  getDepartmentById(id: string): Department | undefined {
    return this.getDepartments().find(d => d.id === id);
  },

  updateDepartment(updated: Department, user = 'Hospital Admin'): void {
    const list = this.getDepartments();
    const index = list.findIndex(d => d.id === updated.id);
    if (index >= 0) {
      list[index] = updated;
      safeSetItem(STORAGE_KEYS.DEPARTMENTS, list);
      this.addAuditLog('UPDATE_DEPARTMENT', `Updated department: ${updated.name}`, user);
    }
  },

  // --- DOCTORS ---
  getDoctors(): Doctor[] {
    const rawList = safeGetItem<Doctor[]>(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    // Ensure all doctors have duty timing and status fields
    return rawList.map(doc => {
      const initialMatch = INITIAL_DOCTORS.find(d => d.id === doc.id);
      const schedule = doc.opdSchedule || initialMatch?.opdSchedule || {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        morningSlots: [],
        eveningSlots: [],
        slotDurationMinutes: 20
      };

      return {
        ...doc,
        dutyStatus: doc.dutyStatus || (doc.isAvailable ? 'on-duty' : 'on-leave'),
        opdSchedule: {
          ...schedule,
          dutyJoiningTimeMorning: schedule.dutyJoiningTimeMorning || initialMatch?.opdSchedule.dutyJoiningTimeMorning || '09:30 AM',
          dutyEndingTimeMorning: schedule.dutyEndingTimeMorning || initialMatch?.opdSchedule.dutyEndingTimeMorning || '01:30 PM',
          dutyJoiningTimeEvening: schedule.dutyJoiningTimeEvening ?? initialMatch?.opdSchedule.dutyJoiningTimeEvening ?? '04:30 PM',
          dutyEndingTimeEvening: schedule.dutyEndingTimeEvening ?? initialMatch?.opdSchedule.dutyEndingTimeEvening ?? '07:30 PM',
          roomLocation: schedule.roomLocation || initialMatch?.opdSchedule.roomLocation || 'OPD Consultation Wing',
        }
      };
    });
  },

  getDoctorById(id: string): Doctor | undefined {
    return this.getDoctors().find(doc => doc.id === id);
  },

  getDoctorsByDepartment(deptId: string): Doctor[] {
    return this.getDoctors().filter(doc => doc.departmentId === deptId && doc.isAvailable && doc.dutyStatus !== 'on-leave');
  },

  updateDoctor(updated: Doctor, user = 'Hospital Admin'): void {
    const list = this.getDoctors();
    const index = list.findIndex(d => d.id === updated.id);
    if (index >= 0) {
      list[index] = updated;
      safeSetItem(STORAGE_KEYS.DOCTORS, list);
      this.addAuditLog('UPDATE_DOCTOR', `Updated duty schedule/availability for ${updated.name}: ${updated.dutyStatus?.toUpperCase() || 'ON-DUTY'} (Duty: ${updated.opdSchedule.dutyJoiningTimeMorning || '09:30 AM'} - ${updated.opdSchedule.dutyEndingTimeMorning || '01:30 PM'})`, user);
    }
  },

  addDoctor(newDoctor: Doctor, user = 'Hospital Admin'): void {
    const list = this.getDoctors();
    list.push(newDoctor);
    safeSetItem(STORAGE_KEYS.DOCTORS, list);
    this.addAuditLog('ADD_DOCTOR', `Added new doctor: ${newDoctor.name} (${newDoctor.departmentName}) with duty hours ${newDoctor.opdSchedule.dutyJoiningTimeMorning} - ${newDoctor.opdSchedule.dutyEndingTimeMorning}`, user);
  },

  deleteDoctor(id: string, user = 'Hospital Admin'): boolean {
    const list = this.getDoctors();
    const index = list.findIndex(d => d.id === id);
    if (index === -1) return false;
    const [deleted] = list.splice(index, 1);
    safeSetItem(STORAGE_KEYS.DOCTORS, list);
    this.addAuditLog('DELETE_DOCTOR', `Removed doctor ${deleted.name} from hospital roster`, user);
    return true;
  },

  // --- APPOINTMENTS & SLOT AVAILABILITY ---
  getAppointments(): Appointment[] {
    return safeGetItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_SAMPLE_APPOINTMENTS);
  },

  getAppointmentById(id: string): Appointment | undefined {
    return this.getAppointments().find(a => a.id === id);
  },

  getAppointmentByReference(refOrPhone: string): Appointment | undefined {
    const cleaned = refOrPhone.trim().toLowerCase();
    return this.getAppointments().find(a => 
      a.bookingReference.toLowerCase() === cleaned ||
      a.patientPhone.replace(/\s+/g, '').includes(cleaned.replace(/\s+/g, ''))
    );
  },

  /**
   * Calculates slot availability for a given doctor on a specific date.
   * Excludes slots that are already booked (pending or confirmed).
   */
  getDoctorAvailability(doctorId: string, dateStr: string): {
    isWorkDay: boolean;
    dayName: string;
    availableMorningSlots: string[];
    availableEveningSlots: string[];
    bookedSlots: string[];
    message?: string;
  } {
    const doctor = this.getDoctorById(doctorId);
    if (!doctor) {
      return {
        isWorkDay: false,
        dayName: '',
        availableMorningSlots: [],
        availableEveningSlots: [],
        bookedSlots: [],
        message: 'Doctor not found.'
      };
    }

    if (!doctor.isAvailable || doctor.dutyStatus === 'on-leave') {
      return {
        isWorkDay: false,
        dayName: '',
        availableMorningSlots: [],
        availableEveningSlots: [],
        bookedSlots: [],
        message: `${doctor.name} is currently on leave${doctor.leaveReason ? ` (${doctor.leaveReason})` : ''}. For urgent consultation, please contact emergency casualty desk.`
      };
    }

    if (doctor.dutyStatus === 'in-surgery') {
      return {
        isWorkDay: false,
        dayName: '',
        availableMorningSlots: [],
        availableEveningSlots: [],
        bookedSlots: [],
        message: `${doctor.name} is engaged in scheduled surgical procedures / Operation Theatre.`
      };
    }

    // Parse date in Asia/Kolkata context
    const parts = dateStr.split('-');
    if (parts.length !== 3) {
      return {
        isWorkDay: false,
        dayName: '',
        availableMorningSlots: [],
        availableEveningSlots: [],
        bookedSlots: []
      };
    }
    const [year, month, day] = parts.map(Number);
    const dateObj = new Date(year, month - 1, day);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[dateObj.getDay()];

    if (dayName === 'Sunday') {
      return {
        isWorkDay: false,
        dayName,
        availableMorningSlots: [],
        availableEveningSlots: [],
        bookedSlots: [],
        message: 'Regular OPD is closed on Sundays. Emergency and on-call specialist services are active 24/7 at the casualty desk.'
      };
    }

    const scheduledDays = doctor.opdSchedule.days;
    const isScheduled = scheduledDays.includes(dayName);

    if (!isScheduled) {
      return {
        isWorkDay: false,
        dayName,
        availableMorningSlots: [],
        availableEveningSlots: [],
        bookedSlots: [],
        message: `${doctor.name} does not hold routine OPD consultations on ${dayName}s.`
      };
    }

    // Existing active bookings for this doctor on this date
    const allAppointments = this.getAppointments();
    const existingBookings = allAppointments.filter(a => 
      a.doctorId === doctorId && 
      a.date === dateStr && 
      (a.status === 'confirmed' || a.status === 'pending')
    );

    const bookedTimes = new Set(existingBookings.map(a => a.timeSlot));

    const availableMorning = doctor.opdSchedule.morningSlots.filter(s => !bookedTimes.has(s));
    const availableEvening = doctor.opdSchedule.eveningSlots.filter(s => !bookedTimes.has(s));

    return {
      isWorkDay: true,
      dayName,
      availableMorningSlots: availableMorning,
      availableEveningSlots: availableEvening,
      bookedSlots: Array.from(bookedTimes)
    };
  },

  /**
   * Creates an appointment after performing server-side/transaction check for collisions.
   * Immediately saves locally and synchronizes to Supabase.
   */
  createAppointment(payload: Omit<Appointment, 'id' | 'bookingReference' | 'status' | 'createdAt' | 'updatedAt'>): {
    success: boolean;
    appointment?: Appointment;
    error?: string;
  } {
    const list = this.getAppointments();

    // Collision check: verify slot is not already taken
    const conflict = list.find(a => 
      a.doctorId === payload.doctorId &&
      a.date === payload.date &&
      a.timeSlot === payload.timeSlot &&
      (a.status === 'confirmed' || a.status === 'pending')
    );

    if (conflict) {
      return {
        success: false,
        error: `The selected time slot (${payload.timeSlot} on ${payload.date}) was just reserved. Please select an alternate slot.`
      };
    }

    const newAppointment: Appointment = {
      ...payload,
      id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingReference: generateBookingReference(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    list.unshift(newAppointment);
    safeSetItem(STORAGE_KEYS.APPOINTMENTS, list);

    this.addAuditLog(
      'CREATE_APPOINTMENT_REQUEST',
      `New booking ${newAppointment.bookingReference} for ${newAppointment.patientName} with ${newAppointment.doctorName} on ${newAppointment.date} at ${newAppointment.timeSlot}`,
      'Patient Online Portal'
    );

    // Save automatically to Supabase backend
    SupabaseService.insertAppointment(newAppointment).then(res => {
      if (res.success) {
        console.log(`[Supabase Live] Appointment ${newAppointment.bookingReference} saved to Supabase`);
      } else {
        console.info(`[Supabase Notice] Remote sync note: ${res.error}`);
      }
    }).catch(e => {
      console.warn('[Supabase Sync Exception]', e);
    });

    return {
      success: true,
      appointment: newAppointment
    };
  },

  updateAppointmentStatus(id: string, status: AppointmentStatus, reason?: string, user = 'Hospital Staff'): boolean {
    const list = this.getAppointments();
    const index = list.findIndex(a => a.id === id);
    if (index === -1) return false;

    const current = list[index];
    const prevStatus = current.status;
    current.status = status;
    current.statusUpdateReason = reason;
    current.updatedAt = new Date().toISOString();

    list[index] = current;
    safeSetItem(STORAGE_KEYS.APPOINTMENTS, list);

    this.addAuditLog(
      'STATUS_CHANGE',
      `Booking ${current.bookingReference} status changed from ${prevStatus} to ${status}${reason ? ` (Reason: ${reason})` : ''}`,
      user
    );

    // Sync status change to Supabase
    SupabaseService.updateAppointmentStatus(current.bookingReference, status, reason);

    return true;
  },

  rescheduleAppointment(id: string, newDate: string, newSlot: string, user = 'Hospital Staff'): {
    success: boolean;
    error?: string;
  } {
    const list = this.getAppointments();
    const index = list.findIndex(a => a.id === id);
    if (index === -1) return { success: false, error: 'Appointment not found' };

    const current = list[index];

    // Conflict check
    const conflict = list.find(a => 
      a.id !== id &&
      a.doctorId === current.doctorId &&
      a.date === newDate &&
      a.timeSlot === newSlot &&
      (a.status === 'confirmed' || a.status === 'pending')
    );

    if (conflict) {
      return { success: false, error: 'The new slot is already booked. Please choose another time.' };
    }

    const oldDetails = `${current.date} at ${current.timeSlot}`;
    current.date = newDate;
    current.timeSlot = newSlot;
    current.status = 'rescheduled';
    current.updatedAt = new Date().toISOString();

    list[index] = current;
    safeSetItem(STORAGE_KEYS.APPOINTMENTS, list);

    this.addAuditLog(
      'RESCHEDULE_APPOINTMENT',
      `Booking ${current.bookingReference} rescheduled from [${oldDetails}] to [${newDate} at ${newSlot}]`,
      user
    );

    // Sync reschedule to Supabase
    SupabaseService.updateAppointmentStatus(current.bookingReference, 'rescheduled', `Rescheduled to ${newDate} at ${newSlot}`);

    return { success: true };
  },

  updateFullAppointment(updated: Appointment, user = 'Hospital Admin'): boolean {
    const list = this.getAppointments();
    const index = list.findIndex(a => a.id === updated.id);
    if (index === -1) return false;

    updated.updatedAt = new Date().toISOString();
    list[index] = updated;
    safeSetItem(STORAGE_KEYS.APPOINTMENTS, list);

    this.addAuditLog(
      'EDIT_APPOINTMENT',
      `Booking ${updated.bookingReference} for ${updated.patientName} edited by ${user}`,
      user
    );

    // Sync full update to Supabase
    SupabaseService.updateAppointment(updated);

    return true;
  },

  deleteAppointment(id: string, user = 'Hospital Admin'): boolean {
    const list = this.getAppointments();
    const index = list.findIndex(a => a.id === id);
    if (index === -1) return false;

    const [deleted] = list.splice(index, 1);
    safeSetItem(STORAGE_KEYS.APPOINTMENTS, list);

    this.addAuditLog(
      'DELETE_APPOINTMENT',
      `Booking ${deleted.bookingReference} for ${deleted.patientName} deleted by ${user}`,
      user
    );

    // Sync deletion to Supabase
    SupabaseService.deleteAppointment(deleted.bookingReference);

    return true;
  },

  // --- AUDIT LOGS ---
  getAuditLogs(): AuditLog[] {
    return safeGetItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  addAuditLog(action: string, details: string, user: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
      action,
      details,
      user
    };
    logs.unshift(newLog);
    // Keep max 200 logs
    safeSetItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 200));
  },

  // --- CONTACT INQUIRIES ---
  getInquiries(): ContactInquiry[] {
    return safeGetItem<ContactInquiry[]>(STORAGE_KEYS.INQUIRIES, []);
  },

  saveInquiry(inquiry: Omit<ContactInquiry, 'id' | 'createdAt'>): ContactInquiry {
    const list = this.getInquiries();
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    list.unshift(newInquiry);
    safeSetItem(STORAGE_KEYS.INQUIRIES, list);
    this.addAuditLog('CONTACT_FORM_SUBMISSION', `Inquiry from ${newInquiry.name} (${newInquiry.phone}): ${newInquiry.subject}`, 'Website Visitor');

    // Sync to Supabase
    SupabaseService.insertInquiry(newInquiry);

    return newInquiry;
  },

  // --- SUPABASE BI-DIRECTIONAL SYNC ---
  async syncWithSupabase(): Promise<{ synced: number; error?: string }> {
    try {
      const remoteAppointments = await SupabaseService.fetchAppointments();
      if (!remoteAppointments || remoteAppointments.length === 0) {
        return { synced: 0 };
      }

      const localList = this.getAppointments();
      const localRefs = new Set(localList.map(a => a.bookingReference));
      let newCount = 0;

      for (const remote of remoteAppointments) {
        if (!localRefs.has(remote.bookingReference)) {
          localList.unshift(remote);
          localRefs.add(remote.bookingReference);
          newCount++;
        }
      }

      if (newCount > 0) {
        safeSetItem(STORAGE_KEYS.APPOINTMENTS, localList);
        console.log(`[Supabase Sync] Merged ${newCount} appointment(s) from Supabase into local state`);
      }

      return { synced: newCount };
    } catch (e: any) {
      console.warn('Sync with Supabase failed:', e);
      return { synced: 0, error: e?.message };
    }
  },

  // --- CSV EXPORT FOR AUTHORIZED STAFF ---
  exportAppointmentsToCsv(): string {
    const appointments = this.getAppointments();
    const headers = ['Booking Reference', 'Patient Name', 'Phone', 'Email', 'Age', 'Gender', 'Type', 'Department', 'Doctor', 'Date', 'Time Slot', 'Status', 'Booked At'];
    const rows = appointments.map(a => [
      a.bookingReference,
      `"${a.patientName.replace(/"/g, '""')}"`,
      `"${a.patientPhone}"`,
      `"${a.patientEmail || ''}"`,
      a.patientAge || '',
      a.patientGender || '',
      a.patientType,
      `"${a.departmentName.replace(/"/g, '""')}"`,
      `"${a.doctorName.replace(/"/g, '""')}"`,
      a.date,
      a.timeSlot,
      a.status,
      a.createdAt
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  // Reset to default sample
  resetToSampleData(): void {
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.DOCTORS);
    localStorage.removeItem(STORAGE_KEYS.DEPARTMENTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
  }
};
