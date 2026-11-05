-- ============================================================================
-- JEEVAA SUPER SPECIALITY HOSPITAL — SUPABASE DATABASE SETUP
-- Project ID: nkjjlltuwrpfntenvdjh
-- Region: ap-northeast-1
-- ============================================================================
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- to ensure full table schema, indexes, and Row Level Security permissions.
-- ============================================================================

-- 1. Create Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(64) UNIQUE NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    patient_email VARCHAR(255),
    patient_age INTEGER,
    patient_gender VARCHAR(50),
    patient_type VARCHAR(50) DEFAULT 'new',
    department_id VARCHAR(100),
    department_name VARCHAR(255) NOT NULL,
    doctor_id VARCHAR(100),
    doctor_name VARCHAR(255) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, rescheduled, completed, cancelled
    reason TEXT,
    hospital_notes TEXT,
    status_update_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Index on Booking Reference and Appointment Date
CREATE INDEX IF NOT EXISTS idx_appointments_booking_ref ON appointments(booking_reference);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_phone ON appointments(patient_phone);

-- 3. Enable Row Level Security (RLS) and Allow Public Insert & Select
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Allow website visitors to insert new appointment requests
CREATE POLICY "Allow public insert on appointments" 
ON appointments FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow public read of appointments (for patient status tracking & staff dashboard)
CREATE POLICY "Allow public select on appointments" 
ON appointments FOR SELECT 
TO public 
USING (true);

-- Allow public update on appointments (for status changes / rescheduling)
CREATE POLICY "Allow public update on appointments" 
ON appointments FOR UPDATE 
TO public 
USING (true);

-- 4. Create Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on inquiries" 
ON contact_inquiries FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public select on inquiries" 
ON contact_inquiries FOR SELECT 
TO public 
USING (true);
