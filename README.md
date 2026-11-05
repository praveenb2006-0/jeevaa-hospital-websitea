# Jeevaa Super Speciality Hospital — Kalaburagi

A modern, production-grade web platform and hospital management system for **Jeevaa Super Speciality Hospital**, located on New Jewargi Road, Santosh Colony, Kalaburagi (Gulbarga), Karnataka, India.

---

## 🌟 Key Features

### 1. Interactive 3D Medical Campus (Three.js)
- **360° Interactive Orbit**: Drag/swipe 3D model of the multi-storey hospital campus with ambient medical lighting, solar rooftop, emergency casualty bay, and illuminated beacons.
- **3D Exploded-View**: Interactive layer-by-layer separation of Ground Floor (Casualty/Emergency), 1st Floor (OT & Laparoscopy), 2nd Floor (ICU/NICU), and Rooftop Helipad.
- **Multiple Camera Angles**: Real-time smooth animated camera transitions between Angled, Front, and Top views.

### 2. Multi-Speciality Clinical Directory
- Full profiles for General & Laparoscopic Surgery, Orthopaedics & Trauma, Obstetrics & Gynaecology, Pediatrics & Neonatology, General Medicine & Diabetology, and Gastroenterology.
- Detailed consultation fee transparency, languages spoken, qualifications, and department FAQs.
- Bilingual support: **English** and **Kannada (ಕನ್ನಡ)**.

### 3. Patient Appointment Booking Engine
- **7-step structured booking flow**:
  1. Department Selection
  2. Specialist Selection
  3. Real-time Date & Time Slot Picker (automatically excludes Sunday regular OPD & booked slots)
  4. Patient Information
  5. Primary Reason & Symptoms
  6. Review & Submission
  7. Instant Booking Confirmation with formatted Reference Code (`JV-YYYY-XXXX`), print receipt option, and iCal (.ics) calendar sync.
- Conflict prevention algorithm preventing double bookings.

### 4. Staff Admin Dashboard & Doctor Duty Roster
- Secure staff login portal (passcode: `jeevaa2026`).
- **Doctor Duty Timing & Shift Management**:
  - Configure **Duty Joining Time** and **Duty Ending Time** for both Morning and Evening shifts.
  - Automatic calculation of daily duty hours.
  - Dynamic slot generator based on customizable intervals (15m, 20m, 30m, 45m).
  - Status management: `Active On-Duty`, `On-Leave / Off-Duty` (with public leave reason), `In Surgery / OT`, and `On-Call Emergency`.
- Walk-in patient direct registration.
- Appointment modification, reschedule with slot verification, status transitions, and cancellation with reason logging.
- CSV export for front-office reporting.
- Comprehensive audit trail recording all clinical and scheduling actions.

### 5. Supabase Database Integration
- Full integration with Supabase project `nkjjlltuwrpfntenvdjh` (`ap-northeast-1`).
- Automatic bi-directional synchronization between local storage and remote PostgreSQL database.
- Complete PostgreSQL schema with Row Level Security (RLS) policies provided in `database-schema.sql` and `supabase-setup.sql`.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4
- **3D Graphics**: Three.js (r182)
- **Icons & UI**: Lucide React, Motion, Canvas-Confetti
- **Backend / Database**: Supabase (@supabase/supabase-js), PostgreSQL
- **Testing**: In-app automated booking validation test suite

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun

### Installation

```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL>
cd jeevaa-hospital-website

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be running at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

---

## 🔐 Credentials & Configuration

- **Admin Passcode**: `jeevaa2026`
- **Location**: New Jewargi Road, Near Shangri-La / Varghese Apartment, Santosh Colony, Kalaburagi, Karnataka — 585102
- **24/7 Casualty Hotline**: `+91 93807 39005`
