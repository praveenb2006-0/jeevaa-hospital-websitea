import React from 'react';
import { Shield, Heart, Award, Users, CheckCircle2, MapPin } from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/hospitalData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#168C8C]">
              Institutional Care & Ethics
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12304A] tracking-tight">
              About Jeevaa Super Speciality Hospital
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Located on New Jewargi Road in Kalaburagi, Karnataka, <strong>Jeevaa Super Speciality Hospital</strong> is dedicated to delivering patient-centric medical treatment, advanced laparoscopic surgeries, critical care monitoring, and maternal-child health services.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our clinical facility is structured to eliminate the need for patients from Kalaburagi, Yadgir, Bidar, and surrounding regions to travel far for emergency trauma care, high-dependency intensive care, or specialized surgical intervention.
            </p>

            {/* Core Values 3-Block Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs mb-2">
                  <Heart className="w-4 h-4 text-teal-700" />
                </div>
                <div className="font-bold text-xs text-slate-900">Compassionate Care</div>
                <div className="text-[11px] text-slate-500 mt-1">Dignified, empathetic healing for every patient and family.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs mb-2">
                  <Shield className="w-4 h-4 text-indigo-700" />
                </div>
                <div className="font-bold text-xs text-slate-900">Clinical Integrity</div>
                <div className="text-[11px] text-slate-500 mt-1">Evidence-based medical choices without overtreatment.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mb-2">
                  <Users className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="font-bold text-xs text-slate-900">Patient-First Access</div>
                <div className="text-[11px] text-slate-500 mt-1">Transparent appointments and 24/7 emergency response.</div>
              </div>
            </div>

            {/* Institutional Integrity Note */}
            <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <strong>Quality Commitment:</strong> Operating in strict adherence to biomedical waste management norms, hospital infection control guidelines, and Indian national health quality protocols.
            </div>
          </div>

          {/* Right Column: Campus Highlights Box (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#12304A] text-white rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-xs text-teal-300 font-semibold uppercase tracking-wider">Hospital Overview</div>
                  <div className="text-lg font-bold">Key Campus Attributes</div>
                </div>
                <span className="text-xs bg-white/10 px-2.5 py-1 rounded-md text-teal-200">Kalaburagi</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">24/7 Emergency Casualty & Trauma</strong>
                    <span className="text-slate-300">Continuous emergency medical officers and on-call surgical readiness.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Intensive Care Units (MICU / SICU / NICU)</strong>
                    <span className="text-slate-300">Equipped for critical multi-organ support and newborn intensive monitoring.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Advanced Modular Operating Theatres</strong>
                    <span className="text-slate-300">Laminar airflow sterility, HD laparoscopic video towers, and modern anaesthesia.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">In-House Diagnostics & 24/7 Pharmacy</strong>
                    <span className="text-slate-300">Automated pathology testing and immediate emergency medication availability.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span>Address: Santosh Colony, New Jewargi Rd</span>
                <span className="text-teal-300 font-semibold">PIN: 585102</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
