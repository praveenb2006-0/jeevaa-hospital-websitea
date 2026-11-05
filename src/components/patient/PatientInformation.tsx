import React, { useState } from 'react';
import { FileText, Clock, Shield, CreditCard, HelpCircle, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/hospitalData';

export const PatientInformation: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const generalFaqs = [
    {
      q: 'How do I cancel or reschedule my appointment?',
      a: 'You can reschedule your appointment by searching your booking reference in the "Track Status" portal, or by calling our OPD front desk at +91 93807 39005 at least 2 hours before your scheduled time slot.'
    },
    {
      q: 'Does Jeevaa Hospital accept cashless health insurance and TPA?',
      a: 'Yes, our dedicated Insurance & TPA Helpdesk assists patients with pre-authorization and cashless claims for recognized private health insurers and public schemes. Please present your insurance e-card and policy document at admission.'
    },
    {
      q: 'What are the visiting hours for hospital inpatients?',
      a: 'General inpatient wards allow visits between 04:30 PM and 07:00 PM daily. For patient safety and infection prevention, only one visitor is permitted at the bedside at any given time.'
    },
    {
      q: 'Is there parking available on campus?',
      a: 'Yes, designated vehicle parking for two-wheelers and four-wheelers is available within the hospital premises along New Jewargi Road, with dedicated ramp access for ambulances and wheelchairs.'
    },
    {
      q: 'How can I get my lab test reports?',
      a: 'Routine blood test results are usually ready within 2 to 4 hours and can be collected from the Ground Floor Diagnostic Desk or shared digitally via WhatsApp/SMS to your registered mobile number.'
    }
  ];

  return (
    <section id="patient-guide" className="py-16 bg-[#F7F9FB] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#168C8C] mb-1">
            Patient Support & Guidelines
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A] tracking-tight">
            Patient Guide & Hospital Information
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Clear guidelines on consultations, admissions, required documents, and cashless insurance claims to ensure a peaceful visit.
          </p>
        </div>

        {/* 4 Cards Grid for Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Card 1: Documents to Bring */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                What to Bring
              </h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                  <span>Valid Govt ID (Aadhaar / Voter ID / Driving License)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                  <span>Previous prescriptions & medical files</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                  <span>Recent diagnostic lab / X-ray / CT reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                  <span>Insurance card / TPA authorization letter</span>
                </li>
              </ul>
            </div>
            <div className="text-[11px] text-slate-500 pt-4 mt-4 border-t border-slate-100">
              Helps our doctors review full clinical history.
            </div>
          </div>

          {/* Card 2: Visiting Hours */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Visiting Guidelines
              </h3>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div>
                  <strong className="text-slate-800 block">Inpatient Wards:</strong>
                  <span>Daily: 04:30 PM – 07:00 PM</span>
                </div>
                <div>
                  <strong className="text-slate-800 block">Intensive Care (ICU):</strong>
                  <span>Daily: 05:00 PM – 06:30 PM (1 Attendant)</span>
                </div>
                <div>
                  <strong className="text-slate-800 block">Infection Prevention:</strong>
                  <span>Children under 12 years are not encouraged in sterile ICU zones.</span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-4 mt-4 border-t border-slate-100">
              Prioritizes quiet recovery for patients.
            </div>
          </div>

          {/* Card 3: Admission & Discharge */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Admission & Discharge
              </h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                  <span>Planned admissions via doctor recommendation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                  <span>Direct emergency admissions 24 hours daily</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                  <span>Standard discharge processing: 10:00 AM – 1:00 PM</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                  <span>Comprehensive discharge summary & medicine instructions</span>
                </li>
              </ul>
            </div>
            <div className="text-[11px] text-slate-500 pt-4 mt-4 border-t border-slate-100">
              Clear handover of prescriptions upon discharge.
            </div>
          </div>

          {/* Card 4: Insurance & Billing */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Insurance & Payments
              </h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                  <span>Dedicated Cashless TPA Helpdesk on Ground Floor</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                  <span>UPI, Debit/Credit Cards, and Net Banking supported</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                  <span>Itemized transparent billing for treatments</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                  <span>Government scheme document verification support</span>
                </li>
              </ul>
            </div>
            <div className="text-[11px] text-slate-500 pt-4 mt-4 border-t border-slate-100">
              Billing desk is open 24 hours.
            </div>
          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Frequently Asked Questions by Patients & Families
            </h3>
          </div>

          <div className="space-y-3">
            {generalFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden transition-colors">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
