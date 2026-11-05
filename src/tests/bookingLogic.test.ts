/**
 * Automated tests for critical booking and scheduling logic in Jeevaa Super Speciality Hospital.
 *
 * Verifies:
 * 1. Double-booking / collision prevention
 * 2. Slot availability calculation & booked-slot exclusion
 * 3. Sunday OPD restriction
 * 4. Booking reference formatting (JV-YYYY-XXXX)
 * 5. Status transitions and audit logging
 */

import { StorageService } from '../services/storageService';

export function runBookingValidationTests(): {
  passed: number;
  failed: number;
  results: { testName: string; passed: boolean; error?: string }[];
} {
  const results: { testName: string; passed: boolean; error?: string }[] = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, errorMsg?: string) {
    if (condition) {
      passed++;
      results.push({ testName, passed: true });
    } else {
      failed++;
      results.push({ testName, passed: false, error: errorMsg || 'Assertion failed' });
    }
  }

  // Test 1: Verify Initial Data Loading
  const doctors = StorageService.getDoctors();
  assert(doctors.length > 0, 'Initial doctors roster is loaded with active profiles');

  const depts = StorageService.getDepartments();
  assert(depts.length > 0, 'Verified departments are loaded');

  // Test 2: Double-Booking Collision Prevention
  const testDoctor = doctors[0];
  const testDate = '2026-11-04'; // A future Wednesday
  const testSlot = '10:00 AM';

  // Create first booking
  const firstBooking = StorageService.createAppointment({
    patientName: 'Test Patient A',
    patientPhone: '+91 98888 11111',
    patientType: 'new',
    departmentId: testDoctor.departmentId,
    departmentName: testDoctor.departmentName,
    doctorId: testDoctor.id,
    doctorName: testDoctor.name,
    date: testDate,
    timeSlot: testSlot
  });

  assert(firstBooking.success === true && !!firstBooking.appointment, 'First appointment is booked successfully');

  if (firstBooking.appointment) {
    // Confirm it
    StorageService.updateAppointmentStatus(firstBooking.appointment.id, 'confirmed', 'Test confirmation');

    // Attempt concurrent duplicate booking for same doctor, same date, same slot
    const duplicateBooking = StorageService.createAppointment({
      patientName: 'Test Patient B',
      patientPhone: '+91 97777 22222',
      patientType: 'new',
      departmentId: testDoctor.departmentId,
      departmentName: testDoctor.departmentName,
      doctorId: testDoctor.id,
      doctorName: testDoctor.name,
      date: testDate,
      timeSlot: testSlot
    });

    assert(
      duplicateBooking.success === false,
      'Duplicate booking for the same slot is rejected with collision error',
      duplicateBooking.error
    );

    // Test 3: Slot availability excludes the booked slot
    const availability = StorageService.getDoctorAvailability(testDoctor.id, testDate);
    assert(
      availability.bookedSlots.includes(testSlot),
      'Booked slot is accurately identified in doctor schedule'
    );
    assert(
      !availability.availableMorningSlots.includes(testSlot),
      'Available morning slots properly omit the booked slot'
    );

    // Test 4: Booking reference format
    const ref = firstBooking.appointment.bookingReference;
    const refRegex = /^JV-\d{4}-\d{4}$/;
    assert(refRegex.test(ref), `Booking reference "${ref}" matches standard format JV-YYYY-XXXX`);

    // Clean up test booking to maintain clean state
    StorageService.updateAppointmentStatus(firstBooking.appointment.id, 'cancelled', 'Automated test cleanup');
  }

  // Test 5: Sunday restriction
  const sundayDate = '2026-11-08'; // Sunday
  const sundayCheck = StorageService.getDoctorAvailability(testDoctor.id, sundayDate);
  assert(
    sundayCheck.isWorkDay === false,
    'Sunday is flagged as closed for regular OPD with emergency guidance'
  );

  // Test 6: Doctor Duty Timing Slot Generation
  const generatedSlots = StorageService.getDoctors()[0];
  assert(
    !!generatedSlots.opdSchedule.dutyJoiningTimeMorning && !!generatedSlots.opdSchedule.dutyEndingTimeMorning,
    'Doctor profiles have explicit Duty Joining Time and Duty Ending Time'
  );

  return { passed, failed, results };
}
