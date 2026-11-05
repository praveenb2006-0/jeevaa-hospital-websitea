-- ============================================================================
-- JEEVAA SUPER SPECIALITY HOSPITAL, KALABURAGI
-- Relational Database Schema (PostgreSQL 14+)
-- Designed for transactional integrity, collision prevention, and audit compliance
-- ============================================================================

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    kannada_name VARCHAR(128),
    description TEXT NOT NULL,
    icon_name VARCHAR(64),
    emergency_available BOOLEAN DEFAULT FALSE,
    opd_timings VARCHAR(128) NOT NULL,
    room_location VARCHAR(128) NOT NULL,
    is_confirmed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    medical_title VARCHAR(128) NOT NULL,
    qualifications VARCHAR(256) NOT NULL,
    department_id VARCHAR(64) NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    experience_years INTEGER NOT NULL DEFAULT 0,
    consultation_fee NUMERIC(10, 2),
    fee_note VARCHAR(256),
    languages_spoken TEXT[] NOT NULL DEFAULT '{"Kannada", "English"}',
    bio TEXT NOT NULL,
    special_interests TEXT[] DEFAULT '{}',
    is_visiting BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doctor Schedules Table
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week VARCHAR(16) NOT NULL, -- Monday, Tuesday, etc.
    session_period VARCHAR(16) NOT NULL, -- 'morning' | 'evening'
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INTEGER DEFAULT 20,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT chk_day_of_week CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    CONSTRAINT chk_session_period CHECK (session_period IN ('morning', 'evening'))
);

-- 4. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(128) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email VARCHAR(128),
    age INTEGER,
    gender VARCHAR(16),
    patient_type VARCHAR(16) DEFAULT 'new', -- 'new' | 'followup'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patients_mobile ON patients(mobile_number);

-- 5. Appointments Table (Enforces unique slot booking per doctor)
CREATE TYPE appointment_status_enum AS ENUM (
    'pending',
    'confirmed',
    'rescheduled',
    'cancelled',
    'completed',
    'no-show'
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(32) UNIQUE NOT NULL, -- e.g. JV-2026-1042
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    patient_name VARCHAR(128) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    patient_email VARCHAR(128),
    patient_age INTEGER,
    patient_gender VARCHAR(16),
    patient_type VARCHAR(16) DEFAULT 'new',
    department_id VARCHAR(64) NOT NULL REFERENCES departments(id),
    department_name VARCHAR(128) NOT NULL,
    doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id),
    doctor_name VARCHAR(128) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(16) NOT NULL, -- e.g. "10:30 AM"
    status appointment_status_enum DEFAULT 'pending',
    reason VARCHAR(256),
    hospital_notes TEXT,
    status_update_reason VARCHAR(256),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CRITICAL: Prevent overlapping active bookings for the same doctor at the same slot
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_doctor_slot
ON appointments(doctor_id, appointment_date, time_slot)
WHERE status IN ('pending', 'confirmed');

CREATE INDEX IF NOT EXISTS idx_appointments_ref ON appointments(booking_reference);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_phone ON appointments(patient_phone);

-- 6. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    action VARCHAR(64) NOT NULL,
    details TEXT NOT NULL,
    authorized_user VARCHAR(128) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);

-- 7. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(128),
    subject VARCHAR(128) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
