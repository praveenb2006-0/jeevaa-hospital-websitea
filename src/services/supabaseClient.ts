import { createClient } from '@supabase/supabase-js';
import { Appointment, ContactInquiry } from '../types/hospital';

// User-provided Supabase Project Details
export const SUPABASE_PROJECT_ID = 'nkjjlltuwrpfntenvdjh';
export const SUPABASE_REGION = 'ap-northeast-1';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_EkuKcGyeU5HMoHxinpC5OA_ukxY2DUv';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const SupabaseService = {
  /**
   * Test connection to the Supabase backend
   */
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (response.ok || response.status === 200 || response.status === 404) {
        return {
          success: true,
          message: `Connected to Supabase Project: ${SUPABASE_PROJECT_ID} (${SUPABASE_REGION})`,
        };
      }
      return {
        success: false,
        message: `HTTP ${response.status} from Supabase REST endpoint`,
      };
    } catch (err: any) {
      console.warn('Supabase test connection warning:', err);
      return {
        success: false,
        message: err?.message || 'Connection check failed',
      };
    }
  },

  /**
   * Insert appointment record into Supabase `appointments` table.
   * Handles snake_case schema with camelCase fallback.
   */
  async insertAppointment(appointment: Appointment): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Try standard snake_case schema
      const payload = {
        booking_reference: appointment.bookingReference,
        patient_name: appointment.patientName,
        patient_phone: appointment.patientPhone,
        patient_email: appointment.patientEmail || null,
        patient_age: appointment.patientAge || null,
        patient_gender: appointment.patientGender || null,
        patient_type: appointment.patientType,
        department_id: appointment.departmentId,
        department_name: appointment.departmentName,
        doctor_id: appointment.doctorId,
        doctor_name: appointment.doctorName,
        appointment_date: appointment.date,
        time_slot: appointment.timeSlot,
        status: appointment.status,
        reason: appointment.reason || null,
        hospital_notes: appointment.hospitalNotes || null,
        created_at: appointment.createdAt || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([payload])
        .select();

      if (error) {
        console.warn('Supabase insert with snake_case returned error, trying fallback:', error.message);
        
        // 2. Try camelCase fallback in case user table was created with camelCase
        const camelPayload = {
          bookingReference: appointment.bookingReference,
          patientName: appointment.patientName,
          patientPhone: appointment.patientPhone,
          patientEmail: appointment.patientEmail || null,
          patientAge: appointment.patientAge || null,
          patientGender: appointment.patientGender || null,
          patientType: appointment.patientType,
          departmentName: appointment.departmentName,
          doctorName: appointment.doctorName,
          date: appointment.date,
          timeSlot: appointment.timeSlot,
          status: appointment.status,
          reason: appointment.reason || null,
          createdAt: appointment.createdAt || new Date().toISOString(),
        };

        const fallback = await supabase
          .from('appointments')
          .insert([camelPayload])
          .select();

        if (fallback.error) {
          console.error('Supabase fallback insert also failed:', fallback.error);
          return { success: false, error: fallback.error.message };
        }
      }

      console.log(`[Supabase] Successfully saved appointment ${appointment.bookingReference} to project ${SUPABASE_PROJECT_ID}`);
      return { success: true };
    } catch (e: any) {
      console.error('Error inserting appointment into Supabase:', e);
      return { success: false, error: e?.message || 'Network error' };
    }
  },

  /**
   * Fetch all appointments from Supabase
   */
  async fetchAppointments(): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('Could not fetch appointments from Supabase:', error?.message);
        return [];
      }

      // Map rows back to Appointment interface
      return data.map((row: any) => ({
        id: row.id ? String(row.id) : `apt-${row.booking_reference || row.bookingReference}`,
        bookingReference: row.booking_reference || row.bookingReference || 'JV-REF',
        patientName: row.patient_name || row.patientName || 'Unknown',
        patientPhone: row.patient_phone || row.patientPhone || '',
        patientEmail: row.patient_email || row.patientEmail,
        patientAge: row.patient_age || row.patientAge,
        patientGender: row.patient_gender || row.patientGender,
        patientType: (row.patient_type || row.patientType || 'new') as any,
        departmentId: row.department_id || row.departmentId || 'dept-general',
        departmentName: row.department_name || row.departmentName || 'General',
        doctorId: row.doctor_id || row.doctorId || 'doc-general',
        doctorName: row.doctor_name || row.doctorName || 'Doctor',
        date: row.appointment_date || row.date || new Date().toISOString().split('T')[0],
        timeSlot: row.time_slot || row.timeSlot || '10:00 AM',
        status: (row.status || 'pending') as any,
        reason: row.reason || '',
        hospitalNotes: row.hospital_notes || row.hospitalNotes || '',
        createdAt: row.created_at || row.createdAt || new Date().toISOString(),
        updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
      }));
    } catch (e) {
      console.warn('Exception fetching from Supabase:', e);
      return [];
    }
  },

  /**
   * Update full appointment details in Supabase
   */
  async updateAppointment(appointment: Appointment): Promise<boolean> {
    try {
      const payload = {
        patient_name: appointment.patientName,
        patient_phone: appointment.patientPhone,
        patient_email: appointment.patientEmail || null,
        patient_age: appointment.patientAge || null,
        patient_gender: appointment.patientGender || null,
        patient_type: appointment.patientType,
        department_name: appointment.departmentName,
        doctor_name: appointment.doctorName,
        appointment_date: appointment.date,
        time_slot: appointment.timeSlot,
        status: appointment.status,
        reason: appointment.reason || null,
        hospital_notes: appointment.hospitalNotes || null,
        status_update_reason: appointment.statusUpdateReason || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('appointments')
        .update(payload)
        .or(`booking_reference.eq.${appointment.bookingReference},bookingReference.eq.${appointment.bookingReference}`);

      if (error) {
        console.warn('Supabase updateAppointment warning:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Exception updating full appointment in Supabase:', e);
      return false;
    }
  },

  /**
   * Delete appointment from Supabase
   */
  async deleteAppointment(bookingReference: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .or(`booking_reference.eq.${bookingReference},bookingReference.eq.${bookingReference}`);

      if (error) {
        console.warn('Supabase delete error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Exception deleting appointment in Supabase:', e);
      return false;
    }
  },

  /**
   * Update appointment status in Supabase
   */
  async updateAppointmentStatus(bookingReference: string, status: string, reason?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          status: status,
          status_update_reason: reason || null,
          updated_at: new Date().toISOString(),
        })
        .or(`booking_reference.eq.${bookingReference},bookingReference.eq.${bookingReference}`);

      if (error) {
        console.warn('Supabase update status warning:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Exception updating status in Supabase:', e);
      return false;
    }
  },

  /**
   * Insert contact inquiry into Supabase `contact_inquiries` table
   */
  async insertInquiry(inquiry: ContactInquiry): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([{
          name: inquiry.name,
          phone: inquiry.phone,
          email: inquiry.email,
          subject: inquiry.subject,
          message: inquiry.message,
          created_at: inquiry.createdAt || new Date().toISOString(),
        }]);

      if (error) {
        console.warn('Supabase contact inquiry insert notice:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Exception saving inquiry to Supabase:', e);
      return false;
    }
  }
};
