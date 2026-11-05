import { Department, Doctor } from '../types/hospital';

export const HOSPITAL_METADATA = {
  name: 'Jeevaa Super Speciality Hospital',
  tagline: 'Advanced Care. Compassionate Healing.',
  taglineStatus: 'Proposed Brand Tagline',
  address: 'New Jewargi Road, Near Shangri-La Apartment / Varghese Apartment, Santosh Colony, Kalaburagi (Gulbarga), Karnataka — 585102',
  shortAddress: 'New Jewargi Road, Santosh Colony, Kalaburagi',
  emergencyPhone: '+91 93807 39005',
  emergencyPhoneRaw: '+919380739005',
  deskPhone: '+91 8472 260000',
  email: 'admin@jeevaahospital.com',
  secondaryEmail: 'jeevaasuperspecialityhospital@gmail.com',
  workingHours: {
    emergency: '24 Hours Open Daily (365 Days)',
    opdGeneral: 'Monday to Saturday: 09:00 AM – 01:30 PM & 04:30 PM – 08:00 PM',
    sunday: 'Emergency, Critical Care & On-Call Specialist Coverage',
    visitingHours: '04:30 PM – 07:00 PM'
  },
  googleMapsUrl: 'https://maps.app.goo.gl/YouhMvbQ5dRYVWQ29',
  coordinates: {
    lat: 17.3125,
    lng: 76.8285
  },
  landmarks: {
    railwayStation: 'Kalaburagi Junction (~4.2 km)',
    busStand: 'Central KSRTC Bus Stand (~3.8 km)',
    airport: 'Kalaburagi Domestic Airport (~14 km)'
  }
};

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-emergency',
    slug: 'emergency-trauma',
    name: 'Emergency & Trauma Care',
    kannadaName: 'ತುರ್ತು ಮತ್ತು ಆಘಾತ ಚಿಕಿತ್ಸೆ',
    description: 'Round-the-clock emergency medical response equipped for poly-trauma, cardiac arrests, acute strokes, and urgent life-support interventions.',
    iconName: 'AlertCircle',
    keyTreatments: [
      '24/7 Level-1 Emergency Triage',
      'Advanced Cardiac Life Support (ACLS)',
      'Trauma Resuscitation & Stabilization',
      'Acute Poisoning & Snakebite Management',
      'Immediate Disaster & Accident Response'
    ],
    emergencyAvailable: true,
    opdTimings: '24 Hours Everyday',
    roomLocation: 'Ground Floor, North Casualty Wing',
    isConfirmed: true,
    faqs: [
      {
        question: 'Do I need an online appointment for emergency casualty care?',
        answer: 'No appointment is ever required for emergencies. Please proceed directly to the Ground Floor Emergency Casualty or call our 24/7 hotline at +91 93807 39005.'
      },
      {
        question: 'Is an ambulance dispatch available in Kalaburagi city?',
        answer: 'Yes, emergency ambulance support with oxygen and trained paramedic assistance is available within Kalaburagi and surrounding talukas.'
      }
    ]
  },
  {
    id: 'dept-surgery',
    slug: 'general-laparoscopic-surgery',
    name: 'General & Laparoscopic Surgery',
    kannadaName: 'ಜನರಲ್ ಮತ್ತು ಲ್ಯಾಪರೊಸ್ಕೋಪಿಕ್ ಸರ್ಜರಿ',
    description: 'Advanced minimally invasive keyhole surgeries, gastrointestinal operations, hernia repairs, and acute surgical interventions with faster recovery.',
    iconName: 'Activity',
    keyTreatments: [
      'Laparoscopic Cholecystectomy (Gallbladder)',
      'Laparoscopic Hernia Repair (Inguinal/Umbilical)',
      'Appendectomy & Abdominal Emergency Surgery',
      'Laser & Surgical Proctology (Piles, Fissure, Fistula)',
      'Thyroid & Breast Tumour Resection'
    ],
    emergencyAvailable: true,
    opdTimings: 'Mon – Sat: 10:00 AM – 01:30 PM & 05:00 PM – 07:30 PM',
    roomLocation: '1st Floor, Surgical Consultation Suite 104',
    isConfirmed: true,
    faqs: [
      {
        question: 'What are the benefits of laparoscopic surgery over open surgery?',
        answer: 'Laparoscopic surgery uses small incisions (5-10 mm), resulting in significantly reduced post-operative pain, minimal blood loss, shorter hospital stay (often 24-48 hours), and quicker return to work.'
      },
      {
        question: 'Do I need to fast before a surgical consultation?',
        answer: 'Fasting is generally not required for initial consultation unless an ultrasound abdomen or fasting blood test is specifically scheduled.'
      }
    ]
  },
  {
    id: 'dept-critical-care',
    slug: 'critical-care-icu',
    name: 'Critical Care (MICU, SICU, NICU)',
    kannadaName: 'ತೀವ್ರ ನಿಗಾ ಘಟಕ (MICU, SICU, NICU)',
    description: 'High-dependency intensive care units featuring multi-parameter monitoring, invasive mechanical ventilation, and continuous specialist monitoring.',
    iconName: 'HeartPulse',
    keyTreatments: [
      'Multi-disciplinary Intensive Care (MICU)',
      'Surgical Intensive Care Unit (SICU)',
      'Neonatal Intensive Care Unit (NICU)',
      'Invasive Hemodynamic & Vitals Monitoring',
      'Continuous Renal Replacement Therapy (CRRT)'
    ],
    emergencyAvailable: true,
    opdTimings: '24 Hours Inpatient Monitoring',
    roomLocation: '2nd Floor, Critical Care Block',
    isConfirmed: true,
    faqs: [
      {
        question: 'What are the visitor hours for patients in the ICU?',
        answer: 'To maintain sterile conditions and infection control, ICU visiting hours are strictly restricted to 05:00 PM – 06:30 PM daily for one attendant at a time.'
      }
    ]
  },
  {
    id: 'dept-orthopaedics',
    slug: 'orthopaedics-joint-care',
    name: 'Orthopaedics & Joint Care',
    kannadaName: 'ಮೂಳೆ ಮತ್ತು ಕೀಲು ರೋಗ ಚಿಕಿತ್ಸೆ',
    description: 'Comprehensive bone and joint treatment, complex trauma fixation, arthroscopic joint repairs, spinal disorder management, and arthritis therapies.',
    iconName: 'Shield',
    keyTreatments: [
      'Complex Fracture Fixation & Poly-trauma',
      'Knee & Hip Joint Pain Management',
      'Arthroscopic Sports Injury Reconstruction',
      'Spine & Cervical Spondylosis Therapy',
      'Geriatric Osteoporosis & Bone Density Care'
    ],
    emergencyAvailable: true,
    opdTimings: 'Mon – Sat: 09:30 AM – 01:00 PM & 04:30 PM – 07:30 PM',
    roomLocation: '1st Floor, Orthopaedic Suite 108',
    isConfirmed: true,
    faqs: [
      {
        question: 'What documents should I bring for knee or back pain consultation?',
        answer: 'Please bring your previous X-rays, MRI/CT scans, previous doctor prescriptions, and a list of any routine pain medications or calcium supplements.'
      }
    ]
  },
  {
    id: 'dept-obgyn',
    slug: 'obstetrics-gynaecology',
    name: 'Obstetrics & Gynaecology',
    kannadaName: 'ಪ್ರಸೂತಿ ಮತ್ತು ಸ್ತ್ರೀರೋಗ ಶಾಸ್ತ್ರ',
    description: 'Dedicated maternal and women’s health services including antenatal checkups, high-risk pregnancy monitoring, painless deliveries, and laparoscopic gynaecology.',
    iconName: 'Smile',
    keyTreatments: [
      'Comprehensive Antenatal & Postnatal Care',
      'High-Risk Pregnancy Management',
      'Normal Delivery & Cesarean Section (LSCS)',
      'Uterine Fibroid & Ovarian Cyst Management',
      'Adolescent & Menopausal Healthcare'
    ],
    emergencyAvailable: true,
    opdTimings: 'Mon – Sat: 10:00 AM – 01:30 PM & 05:00 PM – 08:00 PM',
    roomLocation: '2nd Floor, Women Care Suite 202',
    isConfirmed: true,
    faqs: [
      {
        question: 'Do you offer 24/7 obstetric emergency care for labor?',
        answer: 'Yes, our obstetric team, labor delivery suites, and neonatal standby team operate 24 hours daily for labor admissions and urgent obstetric cases.'
      }
    ]
  },
  {
    id: 'dept-pediatrics',
    slug: 'pediatrics-neonatology',
    name: 'Pediatrics & Neonatology',
    kannadaName: 'ಮಕ್ಕಳ ಮತ್ತು ನವಜಾತ ಶಿಶು ಚಿಕಿತ್ಸೆ',
    description: 'Specialised medical care for newborns, infants, children, and adolescents, featuring an advanced NICU and comprehensive childhood immunization schedules.',
    iconName: 'Heart',
    keyTreatments: [
      'Newborn Critical Care & Phototherapy',
      'National & WHO Immunization Vaccines',
      'Pediatric Respiratory Infection Treatment',
      'Growth & Developmental Milestone Screening',
      'Pediatric Nutrition & Dietary Counseling'
    ],
    emergencyAvailable: true,
    opdTimings: 'Mon – Sat: 09:30 AM – 01:30 PM & 04:30 PM – 07:30 PM',
    roomLocation: '2nd Floor, Child Health Wing 206',
    isConfirmed: true,
    faqs: [
      {
        question: 'Are all routine childhood vaccines administered at the hospital?',
        answer: 'Yes, both government schedule and recommended optional pediatric vaccines are administered with strict cold-chain compliance.'
      }
    ]
  },
  {
    id: 'dept-medicine',
    slug: 'general-medicine-diabetology',
    name: 'General Medicine & Diabetology',
    kannadaName: 'ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ ಮತ್ತು ಮಧುಮೇಹ',
    description: 'Comprehensive adult medical care for chronic lifestyle conditions, diabetes mellitus, hypertension, infectious diseases, fever evaluations, and geriatrics.',
    iconName: 'Stethoscope',
    keyTreatments: [
      'Diabetes Mellitus & Glycemic Control',
      'Hypertension & Cardiovascular Risk Management',
      'Tropical Fevers (Dengue, Typhoid, Malaria)',
      'Respiratory Illness & Asthma Management',
      'Annual Preventive Health Checkups'
    ],
    emergencyAvailable: true,
    opdTimings: 'Mon – Sat: 09:00 AM – 01:30 PM & 04:30 PM – 08:00 PM',
    roomLocation: '1st Floor, OPD Consultation Suite 101',
    isConfirmed: true,
    faqs: [
      {
        question: 'Should I do blood tests before meeting the physician?',
        answer: 'If you have existing blood test reports from the past 3 months, bring them along. If tests are required, our in-house lab can draw samples following the consultation.'
      }
    ]
  },
  {
    id: 'dept-gastro',
    slug: 'gastroenterology-endoscopy',
    name: 'Gastroenterology & Endoscopy',
    kannadaName: 'ಜಠರ ಮತ್ತು ಕರುಳು ರೋಗ ಶಾಸ್ತ್ರ',
    description: 'Diagnosis and management of liver disorders, acid peptic diseases, chronic abdominal pain, and diagnostic upper GI endoscopy.',
    iconName: 'Crosshair',
    keyTreatments: [
      'Upper GI Endoscopy & Biopsy',
      'Fatty Liver & Hepatitis Care',
      'Chronic Acidity & GERD Management',
      'Inflammatory Bowel Disease (IBD)',
      'Colonic & Digestive Health Screening'
    ],
    emergencyAvailable: false,
    opdTimings: 'Mon, Wed, Fri: 11:00 AM – 02:00 PM (By Appointment)',
    roomLocation: '1st Floor, Diagnostic Suite 112',
    isConfirmed: true,
    faqs: [
      {
        question: 'Is fasting required for Upper GI Endoscopy?',
        answer: 'Yes, at least 6 to 8 hours of overnight fasting is mandatory before an upper GI endoscopy procedure.'
      }
    ]
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-patil',
    name: 'Dr. Rajashekar Patil',
    medicalTitle: 'Senior Consultant Laparoscopic & General Surgeon',
    qualifications: 'MBBS, MS (General Surgery)',
    departmentId: 'dept-surgery',
    departmentName: 'General & Laparoscopic Surgery',
    experienceYears: 16,
    consultationFee: 400,
    feeNote: 'Hospital standard OPD consultation fee (valid for 7 days follow-up)',
    opdSchedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dutyJoiningTimeMorning: '10:00 AM',
      dutyEndingTimeMorning: '01:30 PM',
      dutyJoiningTimeEvening: '05:00 PM',
      dutyEndingTimeEvening: '07:30 PM',
      morningSlots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM'],
      eveningSlots: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'],
      slotDurationMinutes: 20,
      roomLocation: 'Suite 104, 1st Floor'
    },
    languagesSpoken: ['Kannada', 'English', 'Hindi', 'Marathi'],
    bio: 'Extensively experienced surgical specialist focusing on minimally invasive laparoscopic procedures, acute abdominal emergencies, and advanced hernia reconstructions in Kalaburagi.',
    specialInterests: ['Laparoscopic Cholecystectomy', 'Complex Ventral Hernia', 'Laser Proctology'],
    isVisiting: false,
    isAvailable: true,
    dutyStatus: 'on-duty'
  },
  {
    id: 'doc-biradar',
    name: 'Dr. Anand Biradar',
    medicalTitle: 'Consultant Orthopaedic & Trauma Surgeon',
    qualifications: 'MBBS, MS (Orthopaedics), Fellowship in Trauma',
    departmentId: 'dept-orthopaedics',
    departmentName: 'Orthopaedics & Joint Care',
    experienceYears: 12,
    consultationFee: 400,
    feeNote: 'Hospital standard OPD consultation fee',
    opdSchedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dutyJoiningTimeMorning: '09:30 AM',
      dutyEndingTimeMorning: '01:00 PM',
      dutyJoiningTimeEvening: '04:30 PM',
      dutyEndingTimeEvening: '07:30 PM',
      morningSlots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
      eveningSlots: ['04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'],
      slotDurationMinutes: 20,
      roomLocation: 'Suite 108, 1st Floor'
    },
    languagesSpoken: ['Kannada', 'English', 'Hindi'],
    bio: 'Dedicated orthopaedic surgeon specializing in complex pelvic and acetabular trauma, arthroscopic knee interventions, and comprehensive degenerative joint therapies.',
    specialInterests: ['Polytrauma Fixation', 'Knee Arthroscopy', 'Geriatric Hip Fractures'],
    isVisiting: false,
    isAvailable: true,
    dutyStatus: 'on-duty'
  },
  {
    id: 'doc-kulkarni',
    name: 'Dr. Sunita Kulkarni',
    medicalTitle: 'Senior Consultant Obstetrician & Gynaecologist',
    qualifications: 'MBBS, MD, DGO (Obstetrics & Gynaecology)',
    departmentId: 'dept-obgyn',
    departmentName: 'Obstetrics & Gynaecology',
    experienceYears: 15,
    consultationFee: 400,
    feeNote: 'Hospital standard OPD consultation fee',
    opdSchedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dutyJoiningTimeMorning: '10:00 AM',
      dutyEndingTimeMorning: '01:30 PM',
      dutyJoiningTimeEvening: '05:00 PM',
      dutyEndingTimeEvening: '08:00 PM',
      morningSlots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM'],
      eveningSlots: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'],
      slotDurationMinutes: 20,
      roomLocation: 'Suite 202, 2nd Floor'
    },
    languagesSpoken: ['Kannada', 'English', 'Hindi', 'Marathi'],
    bio: 'Distinguished obstetrician with rich clinical experience in guiding high-risk maternal pregnancies, normal physiological deliveries, and benign gynaecological procedures.',
    specialInterests: ['High-Risk Pregnancy', 'Infertility Evaluation', 'Laparoscopic Hysterectomy'],
    isVisiting: false,
    isAvailable: true,
    dutyStatus: 'on-duty'
  },
  {
    id: 'doc-mallikarjun',
    name: 'Dr. Mallikarjun S. G.',
    medicalTitle: 'Consultant Pediatrician & Neonatologist',
    qualifications: 'MBBS, MD (Pediatrics), Fellowship in Neonatology',
    departmentId: 'dept-pediatrics',
    departmentName: 'Pediatrics & Neonatology',
    experienceYears: 11,
    consultationFee: 400,
    feeNote: 'Hospital standard OPD consultation fee',
    opdSchedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dutyJoiningTimeMorning: '09:30 AM',
      dutyEndingTimeMorning: '01:30 PM',
      dutyJoiningTimeEvening: '04:30 PM',
      dutyEndingTimeEvening: '07:30 PM',
      morningSlots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
      eveningSlots: ['04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'],
      slotDurationMinutes: 20,
      roomLocation: 'Suite 206, 2nd Floor'
    },
    languagesSpoken: ['Kannada', 'English', 'Hindi'],
    bio: 'Compassionate child health specialist leading our neonatal intensive care unit and pediatric outpatient clinics with special emphasis on preventive infant wellness.',
    specialInterests: ['Preterm Neonatal Care', 'Childhood Asthma', 'Vaccination Strategy'],
    isVisiting: false,
    isAvailable: true,
    dutyStatus: 'on-duty'
  },
  {
    id: 'doc-veeresh',
    name: 'Dr. Veeresh H.',
    medicalTitle: 'Consultant Physician & Critical Care Specialist',
    qualifications: 'MBBS, MD (General Medicine), IDCCM',
    departmentId: 'dept-medicine',
    departmentName: 'General Medicine & Diabetology',
    experienceYears: 13,
    consultationFee: 400,
    feeNote: 'Hospital standard OPD consultation fee',
    opdSchedule: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dutyJoiningTimeMorning: '09:00 AM',
      dutyEndingTimeMorning: '01:30 PM',
      dutyJoiningTimeEvening: '04:30 PM',
      dutyEndingTimeEvening: '08:00 PM',
      morningSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
      eveningSlots: ['04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'],
      slotDurationMinutes: 20,
      roomLocation: 'Suite 101, 1st Floor'
    },
    languagesSpoken: ['Kannada', 'English', 'Hindi'],
    bio: 'Senior internist with special proficiency in intensive care management, chronic diabetic complications, refractory hypertension, and complicated tropical infections.',
    specialInterests: ['Diabetes Complications', 'Sepsis Management', 'Geriatric Medicine'],
    isVisiting: false,
    isAvailable: true,
    dutyStatus: 'on-duty'
  },
  {
    id: 'doc-gastro-visiting',
    name: 'Dr. Santosh Kumar',
    medicalTitle: 'Visiting Consultant Gastroenterologist',
    qualifications: 'MBBS, MD, DM (Medical Gastroenterology)',
    departmentId: 'dept-gastro',
    departmentName: 'Gastroenterology & Endoscopy',
    experienceYears: 14,
    consultationFee: 600,
    feeNote: 'Super-speciality visiting consultant fee',
    opdSchedule: {
      days: ['Monday', 'Wednesday', 'Friday'],
      dutyJoiningTimeMorning: '11:00 AM',
      dutyEndingTimeMorning: '02:00 PM',
      dutyJoiningTimeEvening: '',
      dutyEndingTimeEvening: '',
      morningSlots: ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM'],
      eveningSlots: [],
      slotDurationMinutes: 30,
      roomLocation: 'Diagnostic Suite 112, 1st Floor'
    },
    languagesSpoken: ['Kannada', 'English', 'Hindi'],
    bio: 'Visiting super-specialist providing diagnostic and therapeutic endoscopy, liver disease evaluations, and chronic inflammatory bowel disease management.',
    specialInterests: ['Therapeutic Endoscopy', 'Chronic Liver Disease', 'Pancreatitis'],
    isVisiting: true,
    isAvailable: true,
    dutyStatus: 'on-duty'
  }
];

export const INITIAL_SAMPLE_APPOINTMENTS = [
  {
    id: 'apt-001',
    bookingReference: 'JV-2026-1042',
    patientName: 'Basavaraj Patil',
    patientPhone: '+91 94481 23456',
    patientEmail: 'basavaraj.p@example.com',
    patientAge: 48,
    patientGender: 'Male' as const,
    patientType: 'followup' as const,
    departmentId: 'dept-medicine',
    departmentName: 'General Medicine & Diabetology',
    doctorId: 'doc-veeresh',
    doctorName: 'Dr. Veeresh H.',
    date: '2026-10-27',
    timeSlot: '10:00 AM',
    status: 'confirmed' as const,
    reason: 'Follow-up for HbA1c routine evaluation and medication adjustment.',
    createdAt: '2026-10-25T09:15:00Z',
    updatedAt: '2026-10-25T10:00:00Z'
  },
  {
    id: 'apt-002',
    bookingReference: 'JV-2026-1089',
    patientName: 'Kavitha Biradar',
    patientPhone: '+91 98450 78910',
    patientEmail: 'kavitha.b@example.com',
    patientAge: 32,
    patientGender: 'Female' as const,
    patientType: 'new' as const,
    departmentId: 'dept-obgyn',
    departmentName: 'Obstetrics & Gynaecology',
    doctorId: 'doc-kulkarni',
    doctorName: 'Dr. Sunita Kulkarni',
    date: '2026-10-27',
    timeSlot: '11:30 AM',
    status: 'pending' as const,
    reason: 'First trimester antenatal scan consultation and vitamins review.',
    createdAt: '2026-10-26T06:30:00Z',
    updatedAt: '2026-10-26T06:30:00Z'
  },
  {
    id: 'apt-003',
    bookingReference: 'JV-2026-1115',
    patientName: 'Mohammed Zameer',
    patientPhone: '+91 99012 34567',
    patientAge: 54,
    patientGender: 'Male' as const,
    patientType: 'new' as const,
    departmentId: 'dept-orthopaedics',
    departmentName: 'Orthopaedics & Joint Care',
    doctorId: 'doc-biradar',
    doctorName: 'Dr. Anand Biradar',
    date: '2026-10-28',
    timeSlot: '10:30 AM',
    status: 'confirmed' as const,
    reason: 'Severe persistent right knee joint pain while walking stairs.',
    createdAt: '2026-10-26T08:00:00Z',
    updatedAt: '2026-10-26T08:20:00Z'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    timestamp: '2026-10-26 08:20 AM',
    action: 'CONFIRM_APPOINTMENT',
    details: 'Booking JV-2026-1115 confirmed for Dr. Anand Biradar on 2026-10-28 at 10:30 AM',
    user: 'OPD Receptionist (Staff #1)'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-25 10:00 AM',
    action: 'CONFIRM_APPOINTMENT',
    details: 'Booking JV-2026-1042 verified and approved for Dr. Veeresh H.',
    user: 'Front Desk Admin'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-24 04:00 PM',
    action: 'UPDATE_SCHEDULE',
    details: 'Dr. Rajashekar Patil Wednesday evening slot timings updated to 05:00 PM - 07:00 PM',
    user: 'Hospital Administrator'
  }
];
