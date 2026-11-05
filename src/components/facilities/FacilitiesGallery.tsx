import React, { useState } from 'react';
import { Shield, Activity, HeartPulse, Clock, Sparkles, Building, Layers } from 'lucide-react';

interface FacilityItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Critical Care' | 'Surgery' | 'Diagnostics' | 'Patient Support';
  description: string;
  features: string[];
}

const FACILITIES_DATA: FacilityItem[] = [
  {
    id: 'fac-ot',
    title: 'Advanced Modular Surgical Theatres',
    subtitle: 'Laminar Airflow & Laparoscopic Tower',
    category: 'Surgery',
    description: 'Equipped with HEPA filtered laminar air distribution to maintain near-zero bacterial counts, high-definition laparoscopy towers, electrocautery, and advanced anaesthesia workstations.',
    features: ['Positive pressure laminar ventilation', 'HD laparoscopic video system', 'Multiparameter surgical monitoring', 'Strict aseptic zones']
  },
  {
    id: 'fac-icu',
    title: 'Multi-Disciplinary Critical Care Units',
    subtitle: 'MICU, SICU & Neonatal ICU (NICU)',
    category: 'Critical Care',
    description: 'Round-the-clock intensive monitoring bays overseen by experienced intensivists and specialized nursing officers, equipped for invasive ventilation, central monitoring, and emergency resuscitation.',
    features: ['Invasive mechanical ventilators', 'Continuous bedside hemodynamics', 'Infant warmers & phototherapy', 'Strict barrier isolation']
  },
  {
    id: 'fac-casualty',
    title: '24/7 Emergency & Poly-Trauma Casualty',
    subtitle: 'Direct Ramp Access & Resuscitation Bay',
    category: 'Critical Care',
    description: 'Direct road-level ambulance bay facilitating immediate patient triage, minor procedure theatre, acute oxygen support, and dedicated emergency medical officers on duty 24 hours a day.',
    features: ['Immediate triage station', 'Crash cart with defibrillator', 'Central pipeline medical gases', 'Dedicated emergency team']
  },
  {
    id: 'fac-lab',
    title: 'In-House Diagnostic Pathology & Radiology',
    subtitle: 'Rapid Clinical Investigation',
    category: 'Diagnostics',
    description: 'Automated biochemistry, hematology cell counters, electrolyte analyzers, and digital X-ray services to deliver fast, verified diagnostic reports for timely medical decisions.',
    features: ['Automated hematology & biochemistry', 'Digital high-frequency X-ray', 'Rapid cardiac biomarkers', 'Sterile sample drawing bay']
  },
  {
    id: 'fac-pharmacy',
    title: '24-Hour Hospital Pharmacy',
    subtitle: 'Full Inpatient & Outpatient Medication Store',
    category: 'Patient Support',
    description: 'Fully stocked hospital dispensary carrying emergency injections, surgical consumables, critical care medications, and standard outpatient formulations with cold-chain maintenance.',
    features: ['Temperature-controlled storage', 'Full surgical consumable range', 'Round-the-clock availability', 'Direct billing integration']
  },
  {
    id: 'fac-rooms',
    title: 'Comfortable Inpatient Wards & Private Rooms',
    subtitle: 'Clean, Hygienic Recovery Suites',
    category: 'Patient Support',
    description: 'Designed for restful recovery, featuring spacious semi-private and private air-conditioned patient suites with attached amenities, attendant resting chairs, and dedicated nurse call buttons.',
    features: ['Central oxygen ports', 'Ergonomic multi-position beds', 'Attendant rest seating', '24/7 Nursing call bells']
  }
];

export const FacilitiesGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const categories = ['All', 'Critical Care', 'Surgery', 'Diagnostics', 'Patient Support'];

  const filtered = activeTab === 'All'
    ? FACILITIES_DATA
    : FACILITIES_DATA.filter(f => f.category === activeTab);

  return (
    <section id="facilities" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#168C8C] mb-1">
            Infrastructure & Technology
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A] tracking-tight">
            Hospital Facilities & Patient Care Units
          </h2>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Engineered to deliver clean, technologically reliable, and compassionate healthcare to the people of Kalaburagi and North Karnataka.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mb-8 p-1 bg-slate-100 rounded-xl max-w-fit">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === cat
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => {
            const cardPalettes = [
              { headerGrad: 'from-[#0d2238] via-[#12304A] to-[#0ea5e9]', badge: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30', border: 'hover:border-cyan-400' },
              { headerGrad: 'from-[#0d1e38] via-[#1b2f5c] to-[#6366f1]', badge: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30', border: 'hover:border-indigo-400' },
              { headerGrad: 'from-[#2e0b12] via-[#521323] to-[#ef4444]', badge: 'bg-rose-500/20 text-rose-200 border-rose-400/30', border: 'hover:border-rose-400' },
              { headerGrad: 'from-[#09261f] via-[#104a3e] to-[#10b981]', badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30', border: 'hover:border-emerald-400' },
              { headerGrad: 'from-[#2b1904] via-[#4d2d09] to-[#f59e0b]', badge: 'bg-amber-500/20 text-amber-200 border-amber-400/30', border: 'hover:border-amber-400' },
              { headerGrad: 'from-[#09222b] via-[#12384a] to-[#14b8a6]', badge: 'bg-teal-500/20 text-teal-200 border-teal-400/30', border: 'hover:border-teal-400' }
            ];
            const p = cardPalettes[idx % cardPalettes.length];

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-6 border border-slate-200/90 ${p.border} hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden`}
              >
                <div>
                  {/* Vibrant 3D Visual Header Banner */}
                  <div className={`h-36 rounded-2xl bg-gradient-to-br ${p.headerGrad} text-white p-5 flex flex-col justify-between relative overflow-hidden mb-4 shadow-md group-hover:scale-[1.02] transition-transform duration-300`}>
                    {/* Glowing background orb */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

                    <div className="flex items-center justify-between text-xs relative z-10">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${p.badge}`}>
                        {item.category}
                      </span>
                      <Building className="w-4 h-4 text-white/80" />
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="font-extrabold text-base text-white leading-tight">
                        {item.title}
                      </h3>
                      <span className="text-[11px] text-teal-200/90 font-medium">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Key Specifications:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {item.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                          <span className="font-medium text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Sanitized & Monitored
                  </span>
                  <span className="text-teal-700 font-bold">New Jewargi Rd Campus</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
