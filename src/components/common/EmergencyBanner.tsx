import React from 'react';
import { Phone, AlertTriangle, ShieldAlert } from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/hospitalData';

export const EmergencyBanner: React.FC = () => {
  return (
    <aside aria-label="Medical Emergency Notice" className="bg-rose-900 text-white border-y border-rose-800 py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <ShieldAlert className="w-4 h-4 text-rose-300 shrink-0" />
          <div>
            <span className="font-bold text-rose-200">Critical Medical Emergency Notice: </span>
            <span className="text-rose-100">
              Online appointment booking is for elective outpatient consultations only. For chest pain, stroke symptoms, acute breathlessness, or serious trauma, proceed directly to Casualty.
            </span>
          </div>
        </div>

        <a
          href={`tel:${HOSPITAL_METADATA.emergencyPhoneRaw}`}
          className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-600 active:scale-95 text-white font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 shadow-sm whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Casualty: {HOSPITAL_METADATA.emergencyPhone}</span>
        </a>
      </div>
    </aside>
  );
};

export const MobileQuickActions: React.FC<{
  onOpenBooking: () => void;
}> = ({ onOpenBooking }) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 flex items-center gap-2 shadow-lg">
      <a
        href={`tel:${HOSPITAL_METADATA.emergencyPhoneRaw}`}
        className="flex-1 py-2.5 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center gap-1.5 active:bg-rose-100"
      >
        <Phone className="w-3.5 h-3.5 text-rose-600" />
        <span>Emergency Call</span>
      </a>

      <button
        onClick={onOpenBooking}
        className="flex-1 py-2.5 bg-[#12304A] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 active:bg-slate-800"
      >
        <span>Book OPD Visit</span>
      </button>
    </div>
  );
};
