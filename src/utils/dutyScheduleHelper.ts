/**
 * Doctor Duty Timing & Roster Utilities
 * Handles slot generation from duty joining (start) and ending hours,
 * calculating duty duration, and formatting schedules.
 */

// Helper to convert "HH:MM AM/PM" to minutes from midnight
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const cleaned = timeStr.trim().toUpperCase();
  const match = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === 'PM' && hours < 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

// Helper to convert minutes from midnight to "HH:MM AM/PM"
export function minutesToTimeString(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  const period = hours24 >= 12 ? 'PM' : 'AM';
  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;

  const padH = hours12.toString().padStart(2, '0');
  const padM = minutes.toString().padStart(2, '0');

  return `${padH}:${padM} ${period}`;
}

/**
 * Automatically generates consultation time slots between Duty Joining Time and Duty Ending Time.
 * Ensures the last slot fits within the ending duty time.
 */
export function generateSlotsFromDutyTimes(
  joiningTime: string,
  endingTime: string,
  slotIntervalMinutes: number = 20
): string[] {
  if (!joiningTime || !endingTime || slotIntervalMinutes <= 0) return [];

  const startMin = timeStringToMinutes(joiningTime);
  const endMin = timeStringToMinutes(endingTime);

  if (endMin <= startMin) {
    return [];
  }

  const slots: string[] = [];
  let current = startMin;

  // We add slots as long as the slot starts before or at the end time minus slot duration,
  // or at least leaves room for patient consultation.
  while (current + slotIntervalMinutes <= endMin) {
    slots.push(minutesToTimeString(current));
    current += slotIntervalMinutes;
  }

  return slots;
}

/**
 * Calculates total daily duty hours across morning and evening shifts.
 * Example: Morning 09:30 AM to 01:30 PM (4h) + Evening 04:30 PM to 08:00 PM (3.5h) = "7.5 hrs/day"
 */
export function calculateDutyHours(
  morningJoin?: string,
  morningEnd?: string,
  eveningJoin?: string,
  eveningEnd?: string
): string {
  let totalMin = 0;

  if (morningJoin && morningEnd) {
    const mStart = timeStringToMinutes(morningJoin);
    const mEnd = timeStringToMinutes(morningEnd);
    if (mEnd > mStart) {
      totalMin += (mEnd - mStart);
    }
  }

  if (eveningJoin && eveningEnd) {
    const eStart = timeStringToMinutes(eveningJoin);
    const eEnd = timeStringToMinutes(eveningEnd);
    if (eEnd > eStart) {
      totalMin += (eEnd - eStart);
    }
  }

  if (totalMin === 0) return '0 hrs';

  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;

  if (mins === 0) return `${hours} hrs/day`;
  return `${hours}h ${mins}m/day`;
}

// Preset standard time options for duty joining and ending selects
export const STANDARD_DUTY_TIMES: string[] = [
  '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
  '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM',
  '10:00 PM'
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];
