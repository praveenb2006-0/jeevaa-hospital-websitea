import React, { useState } from 'react';
import { Search, X, CheckCircle, Clock, AlertCircle, Phone, Printer, Calendar } from 'lucide-react';
import { Appointment } from '../../types/hospital';
import { StorageService } from '../../services/storageService';
import { HOSPITAL_METADATA } from '../../data/hospitalData';

interface AppointmentTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const AppointmentTracker: React.FC<AppointmentTrackerProps> = ({
  isOpen,
  onClose,
  onOpenBooking
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedAppointment, setSearchedAppointment] = useState<Appointment | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const apt = StorageService.getAppointmentByReference(searchQuery.trim());
    setSearchedAppointment(apt || null);
    setHasSearched(true);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-semibold">Confirmed</span>;
      case 'pending':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-semibold">Pending Verification</span>;
      case 'rescheduled':
        return <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-semibold">Rescheduled</span>;
      case 'completed':
        return <span className="text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold">Completed</span>;
      case 'cancelled':
        return <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md text-xs font-semibold">Cancelled</span>;
      default:
        return <span className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md text-xs">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#12304A] text-white p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-teal-300 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Real-Time Patient Lookup</span>
            </div>
            <h2 className="text-lg font-bold mt-0.5">Track Appointment Status</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Enter Booking Reference or Registered Mobile Number:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. JV-2026-1042 or 9448123456"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#168C8C] hover:bg-[#127272] text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Track
              </button>
            </div>
            <div className="text-[11px] text-slate-500">
              * Try demo reference: <button type="button" onClick={() => setSearchQuery('JV-2026-1042')} className="text-teal-700 font-semibold underline">JV-2026-1042</button> or <button type="button" onClick={() => setSearchQuery('JV-2026-1089')} className="text-teal-700 font-semibold underline">JV-2026-1089</button>
            </div>
          </form>

          {/* Result Card */}
          {hasSearched && searchedAppointment && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Booking Reference</div>
                  <div className="text-base font-mono font-bold text-[#12304A]">{searchedAppointment.bookingReference}</div>
                </div>
                <div>
                  {getStatusBadge(searchedAppointment.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Patient Name:</span>
                  <strong className="text-slate-900">{searchedAppointment.patientName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Registered Phone:</span>
                  <strong className="text-slate-900">{searchedAppointment.patientPhone}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Consultant:</span>
                  <strong className="text-slate-900">{searchedAppointment.doctorName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Department:</span>
                  <strong className="text-slate-900">{searchedAppointment.departmentName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Consultation Date:</span>
                  <strong className="text-slate-900">{searchedAppointment.date}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Time Slot:</span>
                  <strong className="text-teal-700 font-bold">{searchedAppointment.timeSlot}</strong>
                </div>
              </div>

              {searchedAppointment.reason && (
                <div className="text-xs pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block">Visit Purpose:</span>
                  <span className="text-slate-700">{searchedAppointment.reason}</span>
                </div>
              )}

              {/* Status Explanation */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                {searchedAppointment.status === 'confirmed' ? (
                  <div className="text-emerald-800 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Your appointment has been confirmed by hospital staff. Please arrive 15 minutes prior to {searchedAppointment.timeSlot} with previous medical records.</span>
                  </div>
                ) : searchedAppointment.status === 'pending' ? (
                  <div className="text-amber-800 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Your booking request is queued and awaiting verification by the OPD reception desk. You will be sent an update shortly.</span>
                  </div>
                ) : (
                  <div>Status note: Appointment is marked as {searchedAppointment.status}.</div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-600" />
                  <span>Print Slip</span>
                </button>
                <a
                  href={`tel:${HOSPITAL_METADATA.emergencyPhoneRaw}`}
                  className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Reception</span>
                </a>
              </div>
            </div>
          )}

          {hasSearched && !searchedAppointment && (
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">No booking found matching "{searchQuery}"</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Please verify your 10-digit mobile number or booking reference format (e.g. JV-2026-XXXX).
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="mt-4 px-4 py-2 bg-[#12304A] text-white text-xs font-semibold rounded-xl"
              >
                Book New Appointment
              </button>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
