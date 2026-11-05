import React, { useState } from 'react';
import {
  X,
  Lock,
  Search,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Phone,
  Edit,
  Activity,
  History,
  Database,
  Trash2,
  Save,
  Sun,
  Moon,
  MapPin,
  UserCheck,
  UserX,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { Appointment, AppointmentStatus, Doctor, DoctorDutyStatus, Department } from '../../types/hospital';
import { StorageService } from '../../services/storageService';
import { HOSPITAL_METADATA } from '../../data/hospitalData';
import { runBookingValidationTests } from '../../tests/bookingLogic.test';
import { SupabaseService, SUPABASE_PROJECT_ID, SUPABASE_REGION } from '../../services/supabaseClient';
import {
  generateSlotsFromDutyTimes,
  calculateDutyHours,
  STANDARD_DUTY_TIMES,
  DAYS_OF_WEEK
} from '../../utils/dutyScheduleHelper';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  doctors: Doctor[];
  onDataChanged: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  departments,
  doctors,
  onDataChanged
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab: 'appointments' | 'doctors' | 'walkin' | 'audit' | 'diagnostics' | 'supabase'
  const [activeTab, setActiveTab] = useState<'appointments' | 'doctors' | 'walkin' | 'audit' | 'diagnostics' | 'supabase'>('appointments');
  const [testResults, setTestResults] = useState<{
    passed: number;
    failed: number;
    results: { testName: string; passed: boolean; error?: string }[];
  } | null>(null);

  // Supabase Sync State
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [supabaseSyncMessage, setSupabaseSyncMessage] = useState('');
  const [supabaseConnTest, setSupabaseConnTest] = useState<{ checked: boolean; success: boolean; message: string } | null>(null);

  const handleSyncSupabase = async () => {
    setIsSyncingSupabase(true);
    setSupabaseSyncMessage('');
    try {
      const res = await StorageService.syncWithSupabase();
      if (res.error) {
        setSupabaseSyncMessage(`Sync notice: ${res.error}`);
      } else {
        setSupabaseSyncMessage(`Synced ${res.synced} new record(s) from Supabase.`);
        onDataChanged();
      }
    } catch (e: any) {
      setSupabaseSyncMessage(`Sync error: ${e?.message || 'Failed'}`);
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handleTestSupabaseConnection = async () => {
    const res = await SupabaseService.testConnection();
    setSupabaseConnTest({ checked: true, success: res.success, message: res.message });
  };

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Modals for actions
  const [cancellingAptId, setCancellingAptId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');

  // Full Edit & Delete States
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [deletingApt, setDeletingApt] = useState<Appointment | null>(null);

  // Walk-in creation state
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinDeptId, setWalkinDeptId] = useState(departments[0]?.id || '');
  const [walkinDoctorId, setWalkinDoctorId] = useState(doctors[0]?.id || '');
  const [walkinDate, setWalkinDate] = useState(new Date().toISOString().split('T')[0]);
  const [walkinSlot, setWalkinSlot] = useState('10:00 AM');
  const [walkinReason, setWalkinReason] = useState('');
  const [walkinSuccess, setWalkinSuccess] = useState('');
  const [walkinError, setWalkinError] = useState('');

  // Doctor Duty Timing & Availability States
  const [editingDutyDoctor, setEditingDutyDoctor] = useState<Doctor | null>(null);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [doctorDeptFilter, setDoctorDeptFilter] = useState('all');
  const [doctorStatusFilter, setDoctorStatusFilter] = useState<string>('all');
  const [dutySaveFeedback, setDutySaveFeedback] = useState('');
  const [deletingDoc, setDeletingDoc] = useState<Doctor | null>(null);

  // Add Doctor Form State
  const [newDocName, setNewDocName] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocQuals, setNewDocQuals] = useState('');
  const [newDocDeptId, setNewDocDeptId] = useState(departments[0]?.id || '');
  const [newDocExp, setNewDocExp] = useState(10);
  const [newDocFee, setNewDocFee] = useState(400);
  const [newDocRoom, setNewDocRoom] = useState('Suite 101, 1st Floor');
  const [newDocJoinMorning, setNewDocJoinMorning] = useState('09:30 AM');
  const [newDocEndMorning, setNewDocEndMorning] = useState('01:30 PM');
  const [newDocJoinEvening, setNewDocJoinEvening] = useState('04:30 PM');
  const [newDocEndEvening, setNewDocEndEvening] = useState('07:30 PM');
  const [newDocHasMorning, setNewDocHasMorning] = useState(true);
  const [newDocHasEvening, setNewDocHasEvening] = useState(true);
  const [newDocSlotInterval, setNewDocSlotInterval] = useState(20);
  const [newDocDays, setNewDocDays] = useState<string[]>([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]);
  const [newDocBio, setNewDocBio] = useState('');
  const [newDocAddError, setNewDocAddError] = useState('');

  if (!isOpen) return null;

  // Simple staff access passcode (default: 'jeevaa2026' or 'admin123')
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'jeevaa2026' || passwordInput === 'admin123' || passwordInput === 'jeevaa') {
      setIsAuthenticated(true);
      setAuthError('');
      // Automatically retrieve all live bookings from Supabase
      handleSyncSupabase();
    } else {
      setAuthError('Incorrect authorization passcode. (Hint: jeevaa2026)');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApt) return;
    StorageService.updateFullAppointment(editingApt, 'Hospital Admin');
    setEditingApt(null);
    onDataChanged();
  };

  const handleDeleteConfirm = () => {
    if (!deletingApt) return;
    StorageService.deleteAppointment(deletingApt.id, 'Hospital Admin');
    setDeletingApt(null);
    onDataChanged();
  };

  const appointments = StorageService.getAppointments();
  const auditLogs = StorageService.getAuditLogs();

  // Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter(a => a.date === todayStr);
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    if (doctorFilter !== 'all' && apt.doctorId !== doctorFilter) return false;
    if (dateFilter && apt.date !== dateFilter) return false;

    return true;
  });

  // Action handlers
  const handleConfirmStatus = (id: string) => {
    StorageService.updateAppointmentStatus(id, 'confirmed', 'Approved by OPD front desk', 'Hospital Staff (Desk 1)');
    onDataChanged();
  };

  const handleCompleteStatus = (id: string) => {
    StorageService.updateAppointmentStatus(id, 'completed', 'Patient consultation completed', 'Hospital Staff (Desk 1)');
    onDataChanged();
  };

  const handleCancelSubmit = () => {
    if (!cancellingAptId) return;
    StorageService.updateAppointmentStatus(
      cancellingAptId,
      'cancelled',
      cancelReason.trim() || 'Cancelled per hospital schedule request',
      'Hospital Staff (Desk 1)'
    );
    setCancellingAptId(null);
    setCancelReason('');
    onDataChanged();
  };

  const handleRescheduleSubmit = () => {
    if (!reschedulingApt || !rescheduleDate || !rescheduleSlot) return;
    const res = StorageService.rescheduleAppointment(reschedulingApt.id, rescheduleDate, rescheduleSlot, 'Hospital Staff (Desk 1)');
    if (!res.success) {
      setRescheduleError(res.error || 'Failed to reschedule.');
      return;
    }
    setReschedulingApt(null);
    setRescheduleDate('');
    setRescheduleSlot('');
    setRescheduleError('');
    onDataChanged();
  };

  const handleToggleDoctorAvailability = (doc: Doctor) => {
    const newAvailable = !doc.isAvailable;
    const updated: Doctor = {
      ...doc,
      isAvailable: newAvailable,
      dutyStatus: newAvailable ? 'on-duty' : 'on-leave'
    };
    StorageService.updateDoctor(updated, 'Hospital Administrator');
    onDataChanged();
  };

  const handleQuickDutyStatusChange = (doc: Doctor, newStatus: DoctorDutyStatus) => {
    const isAvailable = newStatus === 'on-duty' || newStatus === 'on-call';
    const updated: Doctor = {
      ...doc,
      dutyStatus: newStatus,
      isAvailable,
      leaveReason: newStatus === 'on-duty' ? undefined : (doc.leaveReason || (newStatus === 'in-surgery' ? 'Emergency Operation Theatre' : 'Scheduled Leave'))
    };
    StorageService.updateDoctor(updated, 'Hospital Administrator');
    onDataChanged();
  };

  const handleSaveDutySchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDutyDoctor) return;

    // Recalculate slots if empty or requested
    const mSlots = editingDutyDoctor.opdSchedule.dutyJoiningTimeMorning && editingDutyDoctor.opdSchedule.dutyEndingTimeMorning
      ? generateSlotsFromDutyTimes(
          editingDutyDoctor.opdSchedule.dutyJoiningTimeMorning,
          editingDutyDoctor.opdSchedule.dutyEndingTimeMorning,
          editingDutyDoctor.opdSchedule.slotDurationMinutes || 20
        )
      : editingDutyDoctor.opdSchedule.morningSlots;

    const eSlots = editingDutyDoctor.opdSchedule.dutyJoiningTimeEvening && editingDutyDoctor.opdSchedule.dutyEndingTimeEvening
      ? generateSlotsFromDutyTimes(
          editingDutyDoctor.opdSchedule.dutyJoiningTimeEvening,
          editingDutyDoctor.opdSchedule.dutyEndingTimeEvening,
          editingDutyDoctor.opdSchedule.slotDurationMinutes || 20
        )
      : editingDutyDoctor.opdSchedule.eveningSlots;

    const isAvailable = editingDutyDoctor.dutyStatus === 'on-duty' || editingDutyDoctor.dutyStatus === 'on-call';

    const updatedDoctor: Doctor = {
      ...editingDutyDoctor,
      isAvailable,
      opdSchedule: {
        ...editingDutyDoctor.opdSchedule,
        morningSlots: mSlots,
        eveningSlots: eSlots
      }
    };

    StorageService.updateDoctor(updatedDoctor, 'Hospital Administrator');
    setEditingDutyDoctor(null);
    setDutySaveFeedback(`Duty timings & availability saved for ${updatedDoctor.name}`);
    setTimeout(() => setDutySaveFeedback(''), 4500);
    onDataChanged();
  };

  const handleRegenerateSlotsForEditingDoctor = () => {
    if (!editingDutyDoctor) return;
    const mSlots = editingDutyDoctor.opdSchedule.dutyJoiningTimeMorning && editingDutyDoctor.opdSchedule.dutyEndingTimeMorning
      ? generateSlotsFromDutyTimes(
          editingDutyDoctor.opdSchedule.dutyJoiningTimeMorning,
          editingDutyDoctor.opdSchedule.dutyEndingTimeMorning,
          editingDutyDoctor.opdSchedule.slotDurationMinutes || 20
        )
      : [];

    const eSlots = editingDutyDoctor.opdSchedule.dutyJoiningTimeEvening && editingDutyDoctor.opdSchedule.dutyEndingTimeEvening
      ? generateSlotsFromDutyTimes(
          editingDutyDoctor.opdSchedule.dutyJoiningTimeEvening,
          editingDutyDoctor.opdSchedule.dutyEndingTimeEvening,
          editingDutyDoctor.opdSchedule.slotDurationMinutes || 20
        )
      : [];

    setEditingDutyDoctor({
      ...editingDutyDoctor,
      opdSchedule: {
        ...editingDutyDoctor.opdSchedule,
        morningSlots: mSlots,
        eveningSlots: eSlots
      }
    });
  };

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    setNewDocAddError('');

    if (!newDocName.trim()) {
      setNewDocAddError('Doctor name is required.');
      return;
    }
    if (!newDocQuals.trim()) {
      setNewDocAddError('Doctor medical qualifications are required.');
      return;
    }
    const dept = departments.find(d => d.id === newDocDeptId);
    if (!dept) {
      setNewDocAddError('Please select a valid department.');
      return;
    }

    const morningSlots = newDocHasMorning && newDocJoinMorning && newDocEndMorning
      ? generateSlotsFromDutyTimes(newDocJoinMorning, newDocEndMorning, newDocSlotInterval)
      : [];

    const eveningSlots = newDocHasEvening && newDocJoinEvening && newDocEndEvening
      ? generateSlotsFromDutyTimes(newDocJoinEvening, newDocEndEvening, newDocSlotInterval)
      : [];

    const newDocId = `doc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const doctorToAdd: Doctor = {
      id: newDocId,
      name: newDocName.trim(),
      medicalTitle: newDocTitle.trim() || `Consultant ${dept.name} Specialist`,
      qualifications: newDocQuals.trim(),
      departmentId: dept.id,
      departmentName: dept.name,
      experienceYears: Number(newDocExp) || 8,
      consultationFee: Number(newDocFee) || 400,
      feeNote: 'Hospital standard OPD consultation fee',
      opdSchedule: {
        days: newDocDays.length > 0 ? newDocDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dutyJoiningTimeMorning: newDocHasMorning ? newDocJoinMorning : undefined,
        dutyEndingTimeMorning: newDocHasMorning ? newDocEndMorning : undefined,
        dutyJoiningTimeEvening: newDocHasEvening ? newDocJoinEvening : undefined,
        dutyEndingTimeEvening: newDocHasEvening ? newDocEndEvening : undefined,
        morningSlots,
        eveningSlots,
        slotDurationMinutes: newDocSlotInterval,
        roomLocation: newDocRoom.trim() || 'OPD Consultation Suite'
      },
      languagesSpoken: ['Kannada', 'English', 'Hindi'],
      bio: newDocBio.trim() || `Consultant at Jeevaa Super Speciality Hospital, Kalaburagi specializing in ${dept.name}.`,
      specialInterests: [dept.name],
      isVisiting: false,
      isAvailable: true,
      dutyStatus: 'on-duty'
    };

    StorageService.addDoctor(doctorToAdd, 'Hospital Administrator');
    setIsAddingDoctor(false);
    setNewDocName('');
    setNewDocTitle('');
    setNewDocQuals('');
    setNewDocBio('');
    setDutySaveFeedback(`New doctor ${doctorToAdd.name} registered with shift timings.`);
    setTimeout(() => setDutySaveFeedback(''), 4500);
    onDataChanged();
  };

  const handleDeleteDoctorConfirm = () => {
    if (!deletingDoc) return;
    StorageService.deleteDoctor(deletingDoc.id, 'Hospital Administrator');
    setDeletingDoc(null);
    onDataChanged();
  };

  const handleExportCsv = () => {
    const csvContent = StorageService.exportAppointmentsToCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Jeevaa_Appointments_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    setWalkinError('');
    setWalkinSuccess('');

    if (!walkinName.trim()) {
      setWalkinError('Patient name is required.');
      return;
    }
    const cleanPhone = walkinPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setWalkinError('10-digit mobile number required.');
      return;
    }

    const doc = doctors.find(d => d.id === walkinDoctorId);
    const dept = departments.find(d => d.id === walkinDeptId);

    if (!doc || !dept) {
      setWalkinError('Please select valid doctor and department.');
      return;
    }

    const res = StorageService.createAppointment({
      patientName: walkinName.trim(),
      patientPhone: `+91 ${cleanPhone.slice(-10)}`,
      patientType: 'new',
      departmentId: dept.id,
      departmentName: dept.name,
      doctorId: doc.id,
      doctorName: doc.name,
      date: walkinDate,
      timeSlot: walkinSlot,
      reason: walkinReason.trim() ? `[Walk-in] ${walkinReason.trim()}` : '[Walk-in Direct Registration]'
    });

    if (!res.success || !res.appointment) {
      setWalkinError(res.error || 'Failed to register appointment.');
      return;
    }

    // Automatically confirm walk-in appointments
    StorageService.updateAppointmentStatus(res.appointment.id, 'confirmed', 'Direct walk-in front desk entry', 'OPD Reception Desk');
    setWalkinSuccess(`Walk-in appointment recorded with Reference: ${res.appointment.bookingReference}`);
    setWalkinName('');
    setWalkinPhone('');
    setWalkinReason('');
    onDataChanged();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Header */}
        <div className="bg-[#12304A] text-white p-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-xl text-teal-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-teal-300 font-semibold uppercase tracking-wider">
                Staff Administration & Clinical Queue
              </div>
              <h2 className="text-lg font-bold">
                Jeevaa Super Speciality Hospital — Staff Portal
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authentication Wall */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#12304A] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Hospital Staff Sign-In</h3>
            <p className="text-xs text-slate-500">
              Restricted portal for authorized OPD receptionists, doctors, and hospital administrators.
            </p>

            <form onSubmit={handleLogin} className="space-y-3 pt-2">
              <input
                type="password"
                placeholder="Enter Staff Passcode (e.g. jeevaa2026)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 text-center font-mono"
              />
              {authError && <p className="text-xs text-rose-600 font-medium">{authError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 bg-[#12304A] hover:bg-[#194366] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Access Portal
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasswordInput('jeevaa2026');
                  setIsAuthenticated(true);
                  setAuthError('');
                  handleSyncSupabase();
                }}
                className="w-full py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-xl border border-teal-200 transition-colors"
              >
                Sign In with Admin Passcode (jeevaa2026)
              </button>
              <div className="text-[11px] text-slate-400">
                Authorized credentials: Use passcode <span className="font-mono text-slate-600">jeevaa2026</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Top KPI Strip */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Today's Queue</div>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{todayApts.length} Patients</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-amber-600 font-semibold uppercase">Pending Verification</div>
                <div className="text-lg font-bold text-amber-700 font-mono mt-0.5">{pendingCount} Requests</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-emerald-600 font-semibold uppercase">Confirmed Slots</div>
                <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">{confirmedCount} Active</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Active Doctors</div>
                <div className="text-lg font-bold text-[#168C8C] font-mono mt-0.5">
                  {doctors.filter(d => d.isAvailable).length} of {doctors.length} On-Duty
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-slate-200 px-6 pt-3 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-6 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === 'appointments'
                      ? 'border-[#168C8C] text-[#168C8C]'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Appointments Master ({appointments.length})
                </button>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === 'doctors'
                      ? 'border-[#168C8C] text-[#168C8C]'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Doctor Roster & Schedules
                </button>
                <button
                  onClick={() => setActiveTab('walkin')}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === 'walkin'
                      ? 'border-[#168C8C] text-[#168C8C]'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  + Add Walk-In Patient
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === 'audit'
                      ? 'border-[#168C8C] text-[#168C8C]'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Audit Trail
                </button>
                <button
                  onClick={() => setActiveTab('diagnostics' as any)}
                  className={`pb-3 border-b-2 transition-colors ${
                    (activeTab as string) === 'diagnostics'
                      ? 'border-[#168C8C] text-[#168C8C]'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  System Tests
                </button>
                <button
                  onClick={() => setActiveTab('supabase')}
                  className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'supabase'
                      ? 'border-[#168C8C] text-[#168C8C]'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Supabase Backend</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </button>
              </div>

              <div className="pb-2 flex items-center gap-2">
                <button
                  onClick={handleSyncSupabase}
                  disabled={isSyncingSupabase}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-emerald-200"
                  title="Pull latest bookings from Supabase"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                  <span>{isSyncingSupabase ? 'Syncing...' : 'Sync Supabase'}</span>
                </button>
                <button
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              
              {/* TAB 1: Appointments List */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  {/* Search and Filters Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search patient, phone, ref..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rescheduled">Rescheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                      value={doctorFilter}
                      onChange={(e) => setDoctorFilter(e.target.value)}
                      className="text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800"
                    >
                      <option value="all">All Doctors</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>

                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800"
                    />
                  </div>

                  {/* Appointments Table */}
                  <div className="border border-slate-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                          <th className="p-3">Ref ID</th>
                          <th className="p-3">Patient</th>
                          <th className="p-3">Doctor & Specialty</th>
                          <th className="p-3">Date & Slot</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAppointments.map(apt => (
                          <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-900">
                              {apt.bookingReference}
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-slate-900">{apt.patientName}</div>
                              <div className="text-[11px] text-slate-500">{apt.patientPhone}</div>
                              {apt.reason && (
                                <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs">{apt.reason}</div>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="font-semibold text-slate-800">{apt.doctorName}</div>
                              <div className="text-[11px] text-teal-700">{apt.departmentName}</div>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <div className="font-semibold text-slate-900">{apt.date}</div>
                              <div className="text-[11px] text-teal-700 font-medium">{apt.timeSlot}</div>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                                  apt.status === 'confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : apt.status === 'pending'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : apt.status === 'cancelled'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </td>
                            <td className="p-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {apt.status === 'pending' && (
                                  <button
                                    onClick={() => handleConfirmStatus(apt.id)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                                    title="Confirm Booking"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {apt.status === 'confirmed' && (
                                  <button
                                    onClick={() => handleCompleteStatus(apt.id)}
                                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-semibold transition-colors"
                                    title="Mark Consultation Complete"
                                  >
                                    Complete
                                  </button>
                                )}
                                <button
                                  onClick={() => setEditingApt({ ...apt })}
                                  className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors border border-teal-200"
                                  title="Edit full appointment details"
                                >
                                  <Edit className="w-3 h-3 text-teal-600" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setReschedulingApt(apt);
                                    setRescheduleDate(apt.date);
                                    setRescheduleSlot(apt.timeSlot);
                                  }}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition-colors"
                                  title="Reschedule Date/Slot"
                                >
                                  Reschedule
                                </button>
                                {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                                  <button
                                    onClick={() => setCancellingAptId(apt.id)}
                                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[11px] font-semibold transition-colors"
                                    title="Cancel Appointment"
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button
                                  onClick={() => setDeletingApt(apt)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                  title="Permanently Delete Appointment from Database"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredAppointments.length === 0 && (
                      <div className="p-8 text-center text-slate-500 text-xs">
                        No appointments found matching your search filters.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: Doctor Duty Timings, Shift Rosters & Availability */}
              {activeTab === 'doctors' && (
                <div className="space-y-5">
                  {/* Duty Save Feedback Banner */}
                  {dutySaveFeedback && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold">{dutySaveFeedback}</span>
                      </div>
                      <button
                        onClick={() => setDutySaveFeedback('')}
                        className="text-emerald-700 hover:text-emerald-900 text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Header & Quick Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#168C8C]" />
                        <span>Doctor Duty Timings, Shift Rosters & Availability</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Manage daily duty joining/start and ending hours, morning/evening shifts, consultation intervals, and real-time on-duty status.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setNewDocAddError('');
                        setIsAddingDoctor(true);
                      }}
                      className="px-4 py-2 bg-[#12304A] hover:bg-[#194366] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors shrink-0 self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4 text-teal-300" />
                      <span>+ Add Doctor to Duty Roster</span>
                    </button>
                  </div>

                  {/* Duty Roster Metric Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Consultants</div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">{doctors.length} Doctors</div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active On-Duty
                      </div>
                      <div className="text-lg font-bold text-emerald-900 mt-0.5">
                        {doctors.filter(d => d.isAvailable && (!d.dutyStatus || d.dutyStatus === 'on-duty')).length} Available
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                      <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">On-Leave / Off-Duty</div>
                      <div className="text-lg font-bold text-rose-900 mt-0.5">
                        {doctors.filter(d => !d.isAvailable || d.dutyStatus === 'on-leave').length} On Leave
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                      <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">In Surgery / OT</div>
                      <div className="text-lg font-bold text-amber-900 mt-0.5">
                        {doctors.filter(d => d.dutyStatus === 'in-surgery').length} In Procedure
                      </div>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search doctor name, qualifications, or department..."
                        value={doctorSearchTerm}
                        onChange={(e) => setDoctorSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={doctorDeptFilter}
                        onChange={(e) => setDoctorDeptFilter(e.target.value)}
                        className="text-xs p-1.5 bg-white rounded-lg border border-slate-300 font-medium text-slate-700"
                      >
                        <option value="all">All Departments ({departments.length})</option>
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>

                      <select
                        value={doctorStatusFilter}
                        onChange={(e) => setDoctorStatusFilter(e.target.value)}
                        className="text-xs p-1.5 bg-white rounded-lg border border-slate-300 font-semibold text-slate-700"
                      >
                        <option value="all">All Duty Statuses</option>
                        <option value="on-duty">On-Duty / Available</option>
                        <option value="on-leave">On-Leave</option>
                        <option value="in-surgery">In Surgery / OT</option>
                        <option value="on-call">On-Call Emergency</option>
                      </select>
                    </div>
                  </div>

                  {/* Doctors List */}
                  {(() => {
                    const filtered = doctors.filter(doc => {
                      const matchesSearch =
                        doc.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
                        doc.qualifications.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
                        doc.departmentName.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
                        doc.medicalTitle.toLowerCase().includes(doctorSearchTerm.toLowerCase());

                      if (!matchesSearch) return false;
                      if (doctorDeptFilter !== 'all' && doc.departmentId !== doctorDeptFilter) return false;

                      if (doctorStatusFilter !== 'all') {
                        const status = doc.dutyStatus || (doc.isAvailable ? 'on-duty' : 'on-leave');
                        if (status !== doctorStatusFilter) return false;
                      }

                      return true;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                          No doctors found matching your filters.
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map(doc => {
                          const status = doc.dutyStatus || (doc.isAvailable ? 'on-duty' : 'on-leave');
                          const totalHours = calculateDutyHours(
                            doc.opdSchedule.dutyJoiningTimeMorning,
                            doc.opdSchedule.dutyEndingTimeMorning,
                            doc.opdSchedule.dutyJoiningTimeEvening,
                            doc.opdSchedule.dutyEndingTimeEvening
                          );

                          return (
                            <div
                              key={doc.id}
                              className={`p-4 rounded-2xl border transition-all bg-white flex flex-col justify-between shadow-xs ${
                                status === 'on-duty'
                                  ? 'border-slate-200 hover:border-teal-300'
                                  : status === 'in-surgery'
                                  ? 'border-amber-200 bg-amber-50/20'
                                  : 'border-rose-200 bg-rose-50/10'
                              }`}
                            >
                              <div className="space-y-3">
                                {/* Top Doctor Header */}
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-bold text-sm text-slate-900">{doc.name}</h4>
                                      
                                      {/* Status Badge */}
                                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        status === 'on-duty'
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                          : status === 'in-surgery'
                                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                          : status === 'on-call'
                                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                          status === 'on-duty' ? 'bg-emerald-500 animate-pulse' : status === 'in-surgery' ? 'bg-amber-500' : status === 'on-call' ? 'bg-sky-500' : 'bg-rose-500'
                                        }`} />
                                        {status === 'on-duty' ? 'On-Duty' : status === 'in-surgery' ? 'In Surgery / OT' : status === 'on-call' ? 'On-Call' : 'On Leave'}
                                      </span>
                                    </div>

                                    <div className="text-xs text-slate-600 mt-0.5">{doc.qualifications}</div>
                                    <div className="text-xs font-semibold text-teal-700 mt-0.5 flex items-center gap-1.5">
                                      <span>{doc.departmentName}</span>
                                      <span aria-hidden="true">·</span>
                                      <span className="text-slate-500 font-normal">{doc.opdSchedule.roomLocation || 'OPD Suite'}</span>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => setDeletingDoc(doc)}
                                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                                    title="Remove doctor from roster"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Leave Reason Notice */}
                                {status === 'on-leave' && doc.leaveReason && (
                                  <div className="p-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-[11px] flex items-center gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                                    <span><strong>Leave Note:</strong> {doc.leaveReason}</span>
                                  </div>
                                )}

                                {status === 'in-surgery' && (
                                  <div className="p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[11px] flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                                    <span><strong>OT Notice:</strong> Engaged in active surgical procedure</span>
                                  </div>
                                )}

                                {/* Shift Duty Timings Box */}
                                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                                    <span>Official Shift Duty Hours</span>
                                    <span className="text-teal-700 font-bold">{totalHours}</span>
                                  </div>

                                  {/* Morning Shift */}
                                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                      <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                      <span>Morning Duty:</span>
                                    </div>
                                    <div className="text-right">
                                      {doc.opdSchedule.dutyJoiningTimeMorning && doc.opdSchedule.dutyEndingTimeMorning ? (
                                        <div className="font-semibold text-slate-900">
                                          {doc.opdSchedule.dutyJoiningTimeMorning} – {doc.opdSchedule.dutyEndingTimeMorning}
                                          <span className="text-[10px] text-slate-500 font-normal ml-1.5">
                                            ({doc.opdSchedule.morningSlots.length} slots)
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-slate-400 italic">No Morning Shift</span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Evening Shift */}
                                  <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                      <Moon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                      <span>Evening Duty:</span>
                                    </div>
                                    <div className="text-right">
                                      {doc.opdSchedule.dutyJoiningTimeEvening && doc.opdSchedule.dutyEndingTimeEvening ? (
                                        <div className="font-semibold text-slate-900">
                                          {doc.opdSchedule.dutyJoiningTimeEvening} – {doc.opdSchedule.dutyEndingTimeEvening}
                                          <span className="text-[10px] text-slate-500 font-normal ml-1.5">
                                            ({doc.opdSchedule.eveningSlots.length} slots)
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-slate-400 italic">No Evening Shift</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Working Days & Fee */}
                                <div className="text-[11px] text-slate-500 space-y-1">
                                  <div>
                                    <strong className="text-slate-700">Days:</strong> {doc.opdSchedule.days.join(', ')}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>
                                      <strong className="text-slate-700">Slot Interval:</strong> {doc.opdSchedule.slotDurationMinutes} min
                                    </span>
                                    <span>
                                      <strong className="text-slate-700">OPD Fee:</strong> ₹{doc.consultationFee}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Footer */}
                              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                                <button
                                  onClick={() => setEditingDutyDoctor(JSON.parse(JSON.stringify(doc)))}
                                  className="px-3 py-1.5 bg-[#12304A] hover:bg-[#194366] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                                >
                                  <Sliders className="w-3 h-3 text-teal-300" />
                                  <span>Edit Duty & Availability</span>
                                </button>

                                {/* Quick Availability Toggles */}
                                <div className="flex items-center gap-1">
                                  {status === 'on-duty' ? (
                                    <>
                                      <button
                                        onClick={() => handleQuickDutyStatusChange(doc, 'on-leave')}
                                        className="px-2.5 py-1 text-[11px] font-semibold rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                                        title="Mark doctor on leave"
                                      >
                                        Mark Leave
                                      </button>
                                      <button
                                        onClick={() => handleQuickDutyStatusChange(doc, 'in-surgery')}
                                        className="px-2.5 py-1 text-[11px] font-semibold rounded bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
                                        title="Mark doctor in Operation Theatre"
                                      >
                                        In OT
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => handleQuickDutyStatusChange(doc, 'on-duty')}
                                      className="px-2.5 py-1 text-[11px] font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                                    >
                                      Set On-Duty
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 3: Walk-in Creation */}
              {activeTab === 'walkin' && (
                <div className="max-w-xl mx-auto space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Direct Patient Walk-In Registration</h3>
                    <p className="text-xs text-slate-500">Record a patient present at the front desk or direct phone caller.</p>
                  </div>

                  {walkinSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{walkinSuccess}</span>
                    </div>
                  )}

                  {walkinError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{walkinError}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateWalkin} className="space-y-3.5 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Patient Name *</label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={walkinName}
                        onChange={(e) => setWalkinName(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-lg border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit mobile"
                        value={walkinPhone}
                        onChange={(e) => setWalkinPhone(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-lg border border-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Department</label>
                        <select
                          value={walkinDeptId}
                          onChange={(e) => setWalkinDeptId(e.target.value)}
                          className="w-full p-2.5 bg-white rounded-lg border border-slate-300"
                        >
                          {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Doctor</label>
                        <select
                          value={walkinDoctorId}
                          onChange={(e) => setWalkinDoctorId(e.target.value)}
                          className="w-full p-2.5 bg-white rounded-lg border border-slate-300"
                        >
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={walkinDate}
                          onChange={(e) => setWalkinDate(e.target.value)}
                          className="w-full p-2.5 bg-white rounded-lg border border-slate-300"
                        >
                        </input>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                        <input
                          type="text"
                          value={walkinSlot}
                          onChange={(e) => setWalkinSlot(e.target.value)}
                          className="w-full p-2.5 bg-white rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Symptoms / Notes</label>
                      <input
                        type="text"
                        placeholder="Brief complaint"
                        value={walkinReason}
                        onChange={(e) => setWalkinReason(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-lg border border-slate-300"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#12304A] hover:bg-[#194366] text-white font-bold rounded-xl shadow-sm transition-colors"
                    >
                      Issue Confirmed Walk-In Pass
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: Audit Logs */}
              {activeTab === 'audit' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-900">Hospital Staff Action Audit Log</h3>
                    <span className="text-xs text-slate-500">Security & compliance trail</span>
                  </div>

                  <div className="space-y-2">
                    {auditLogs.map(log => (
                      <div key={log.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800">{log.action}</div>
                          <div className="text-slate-600">{log.details}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-slate-400 text-[11px]">{log.timestamp}</div>
                          <div className="text-teal-700 font-medium text-[11px]">{log.user}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: System Diagnostics & Test Suite */}
              {activeTab === 'diagnostics' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Automated Booking & Schedule Diagnostics</h3>
                      <p className="text-xs text-slate-500">Verify slot collision rejection, Sunday restriction, and reference format integrity.</p>
                    </div>

                    <button
                      onClick={() => setTestResults(runBookingValidationTests())}
                      className="px-4 py-2 bg-[#12304A] hover:bg-[#194366] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <Activity className="w-3.5 h-3.5 text-teal-300" />
                      <span>Execute Validation Suite</span>
                    </button>
                  </div>

                  {testResults ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-900">
                          All {testResults.passed} Automated Critical Tests Passed Successfully!
                        </span>
                        <span className="text-emerald-700 font-semibold">
                          0 Failures ({testResults.passed}/{testResults.passed})
                        </span>
                      </div>

                      <div className="space-y-2">
                        {testResults.results.map((res, i) => (
                          <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="font-medium text-slate-800">{res.testName}</span>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              PASS
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                      <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700">Click "Execute Validation Suite" to run tests</p>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                        Simulates concurrent booking attempts, slot conflict detection, Sunday schedule boundaries, and reference generation.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: Supabase Backend Integration */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald-600" />
                        <span>Supabase Live Database Connection</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Appointments booked by patients on this website automatically save to your Supabase PostgreSQL database.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTestSupabaseConnection}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Test Connection
                      </button>
                      <button
                        onClick={handleSyncSupabase}
                        disabled={isSyncingSupabase}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                        <span>{isSyncingSupabase ? 'Syncing...' : 'Sync Records Now'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Feedback Message */}
                  {supabaseSyncMessage && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{supabaseSyncMessage}</span>
                    </div>
                  )}

                  {/* Connection Test Result */}
                  {supabaseConnTest && (
                    <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      supabaseConnTest.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                      {supabaseConnTest.success ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span>{supabaseConnTest.message}</span>
                    </div>
                  )}

                  {/* Configuration Summary Card */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Connected Project Credentials
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block">Project ID:</span>
                        <span className="font-mono font-bold text-slate-900">{SUPABASE_PROJECT_ID}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block">Cloud Region:</span>
                        <span className="font-mono font-bold text-slate-900">{SUPABASE_REGION} (Tokyo)</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block">REST Endpoint:</span>
                        <span className="font-mono text-xs text-teal-800 truncate block">https://{SUPABASE_PROJECT_ID}.supabase.co</span>
                      </div>
                    </div>
                  </div>

                  {/* SQL Setup Instruction Box */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Supabase SQL Table Definition
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          If your `appointments` table is not yet created in Supabase, run this in your Supabase SQL Editor:
                        </p>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">supabase-setup.sql</span>
                    </div>

                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs overflow-x-auto font-mono max-h-56 leading-relaxed">
{`CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(64) UNIQUE NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    patient_email VARCHAR(255),
    patient_age INTEGER,
    patient_gender VARCHAR(50),
    patient_type VARCHAR(50) DEFAULT 'new',
    department_name VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on appointments" ON appointments FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public select on appointments" ON appointments FOR SELECT TO public USING (true);
CREATE POLICY "Allow public update on appointments" ON appointments FOR UPDATE TO public USING (true);`}
                    </pre>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Cancellation Confirmation Dialog */}
      {cancellingAptId && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-slate-900">Confirm Appointment Cancellation</h4>
            <p className="text-xs text-slate-500">
              Please enter the clinical or scheduling reason for cancelling this appointment.
            </p>
            <input
              type="text"
              placeholder="e.g. Patient called to cancel, Doctor emergency surgery..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancellingAptId(null)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelSubmit}
                className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rescheduling Dialog */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-slate-900">
              Reschedule: {reschedulingApt.bookingReference}
            </h4>
            <p className="text-xs text-slate-500">
              Patient: {reschedulingApt.patientName} with {reschedulingApt.doctorName}
            </p>

            {rescheduleError && (
              <p className="text-xs text-rose-600 font-medium">{rescheduleError}</p>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Date</label>
              <input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Time Slot</label>
              <input
                type="text"
                placeholder="e.g. 11:30 AM"
                value={rescheduleSlot}
                onChange={(e) => setRescheduleSlot(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReschedulingApt(null)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                className="px-3.5 py-1.5 bg-[#168C8C] text-white rounded-lg text-xs font-semibold"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Edit Appointment Dialog */}
      {editingApt && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-[#12304A] text-white p-4 px-6 flex items-center justify-between shrink-0">
              <div>
                <div className="text-xs text-teal-300 font-semibold uppercase">Manage & Edit Appointment</div>
                <h4 className="text-base font-bold font-mono">{editingApt.bookingReference}</h4>
              </div>
              <button
                onClick={() => setEditingApt(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingApt.patientName}
                    onChange={(e) => setEditingApt({ ...editingApt, patientName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={editingApt.patientPhone}
                    onChange={(e) => setEditingApt({ ...editingApt, patientPhone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingApt.patientEmail || ''}
                    onChange={(e) => setEditingApt({ ...editingApt, patientEmail: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={editingApt.patientAge || ''}
                    onChange={(e) => setEditingApt({ ...editingApt, patientAge: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={editingApt.patientGender || 'Male'}
                    onChange={(e) => setEditingApt({ ...editingApt, patientGender: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clinical Department</label>
                  <select
                    value={editingApt.departmentId}
                    onChange={(e) => {
                      const dept = departments.find(d => d.id === e.target.value);
                      setEditingApt({
                        ...editingApt,
                        departmentId: e.target.value,
                        departmentName: dept?.name || editingApt.departmentName
                      });
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consultant Doctor</label>
                  <select
                    value={editingApt.doctorId}
                    onChange={(e) => {
                      const doc = doctors.find(d => d.id === e.target.value);
                      setEditingApt({
                        ...editingApt,
                        doctorId: e.target.value,
                        doctorName: doc?.name || editingApt.doctorName
                      });
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.medicalTitle.split(' ')[0]} {d.medicalTitle.split(' ')[1] || ''})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={editingApt.date}
                    onChange={(e) => setEditingApt({ ...editingApt, date: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={editingApt.timeSlot}
                    onChange={(e) => setEditingApt({ ...editingApt, timeSlot: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appointment Status</label>
                  <select
                    value={editingApt.status}
                    onChange={(e) => setEditingApt({ ...editingApt, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="rescheduled">Rescheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No-Show</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Symptoms</label>
                <textarea
                  rows={2}
                  value={editingApt.reason || ''}
                  onChange={(e) => setEditingApt({ ...editingApt, reason: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  placeholder="Primary complaint..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hospital Staff Notes / Follow-up</label>
                <input
                  type="text"
                  value={editingApt.hospitalNotes || ''}
                  onChange={(e) => setEditingApt({ ...editingApt, hospitalNotes: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  placeholder="e.g. Advised fasting for ultrasound..."
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingApt(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12304A] hover:bg-[#194366] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Save className="w-3.5 h-3.5 text-teal-300" />
                  <span>Save Changes to Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingApt && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-bold text-slate-900">Delete Appointment Permanently?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete booking <strong className="font-mono text-slate-800">{deletingApt.bookingReference}</strong> for <strong>{deletingApt.patientName}</strong>? This action removes it from Supabase and the dashboard.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingApt(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Go Back
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Delete from Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Duty Timing & Availability Modal */}
      {editingDutyDoctor && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
            {/* Modal Header */}
            <div className="bg-[#12304A] text-white p-4 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/20 rounded-xl text-teal-300">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-teal-300 font-semibold uppercase tracking-wider">
                    Doctor Duty Timing & Availability Roster
                  </div>
                  <h4 className="text-base font-bold">{editingDutyDoctor.name}</h4>
                </div>
              </div>
              <button
                onClick={() => setEditingDutyDoctor(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveDutySchedule} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              
              {/* Doctor Status & Availability */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-xs">
                    Current Duty Status & OPD Availability *
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Controls whether patients can book appointments online
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'on-duty', label: 'On-Duty', desc: 'Accepting bookings', color: 'emerald' },
                    { id: 'on-leave', label: 'On-Leave', desc: 'Bookings paused', color: 'rose' },
                    { id: 'in-surgery', label: 'In OT / Surgery', desc: 'In procedure', color: 'amber' },
                    { id: 'on-call', label: 'On-Call', desc: 'Casualty standby', color: 'sky' }
                  ].map(st => {
                    const isSelected = (editingDutyDoctor.dutyStatus || (editingDutyDoctor.isAvailable ? 'on-duty' : 'on-leave')) === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          setEditingDutyDoctor({
                            ...editingDutyDoctor,
                            dutyStatus: st.id as DoctorDutyStatus,
                            isAvailable: st.id === 'on-duty' || st.id === 'on-call'
                          });
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/70 text-teal-900 font-bold ring-1 ring-teal-500'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{st.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">{st.desc}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Leave / OT Reason */}
                {(editingDutyDoctor.dutyStatus === 'on-leave' || editingDutyDoctor.dutyStatus === 'in-surgery') && (
                  <div className="pt-2 border-t border-slate-200">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Reason for Leave / Non-Availability (displayed to staff & patients)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Attending National Surgical Conference, returning Thursday"
                      value={editingDutyDoctor.leaveReason || ''}
                      onChange={(e) => setEditingDutyDoctor({ ...editingDutyDoctor, leaveReason: e.target.value })}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Duty Timings: Morning & Evening Shifts */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Official Shift Duty Joining & Ending Times</h5>
                    <p className="text-[11px] text-slate-500">
                      Specify exact hours when the doctor begins (joins) and completes (ends) daily duty.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    {calculateDutyHours(
                      editingDutyDoctor.opdSchedule.dutyJoiningTimeMorning,
                      editingDutyDoctor.opdSchedule.dutyEndingTimeMorning,
                      editingDutyDoctor.opdSchedule.dutyJoiningTimeEvening,
                      editingDutyDoctor.opdSchedule.dutyEndingTimeEvening
                    )}
                  </div>
                </div>

                {/* Morning Shift */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Morning Shift Duty Hours
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDutyDoctor({
                          ...editingDutyDoctor,
                          opdSchedule: {
                            ...editingDutyDoctor.opdSchedule,
                            dutyJoiningTimeMorning: '',
                            dutyEndingTimeMorning: '',
                            morningSlots: []
                          }
                        });
                      }}
                      className="text-[11px] text-slate-400 hover:text-rose-600 font-medium"
                    >
                      Clear Morning Shift
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Duty Joining Time (Shift Start)
                      </label>
                      <select
                        value={editingDutyDoctor.opdSchedule.dutyJoiningTimeMorning || ''}
                        onChange={(e) => {
                          setEditingDutyDoctor({
                            ...editingDutyDoctor,
                            opdSchedule: {
                              ...editingDutyDoctor.opdSchedule,
                              dutyJoiningTimeMorning: e.target.value
                            }
                          });
                        }}
                        className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 font-medium"
                      >
                        <option value="">-- No Morning Duty --</option>
                        {STANDARD_DUTY_TIMES.map(t => (
                          <option key={`m-join-${t}`} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Duty Ending Time (Shift End)
                      </label>
                      <select
                        value={editingDutyDoctor.opdSchedule.dutyEndingTimeMorning || ''}
                        onChange={(e) => {
                          setEditingDutyDoctor({
                            ...editingDutyDoctor,
                            opdSchedule: {
                              ...editingDutyDoctor.opdSchedule,
                              dutyEndingTimeMorning: e.target.value
                            }
                          });
                        }}
                        className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 font-medium"
                      >
                        <option value="">-- No Morning Duty --</option>
                        {STANDARD_DUTY_TIMES.map(t => (
                          <option key={`m-end-${t}`} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Evening Shift */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      Evening Shift Duty Hours
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDutyDoctor({
                          ...editingDutyDoctor,
                          opdSchedule: {
                            ...editingDutyDoctor.opdSchedule,
                            dutyJoiningTimeEvening: '',
                            dutyEndingTimeEvening: '',
                            eveningSlots: []
                          }
                        });
                      }}
                      className="text-[11px] text-slate-400 hover:text-rose-600 font-medium"
                    >
                      Clear Evening Shift
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Duty Joining Time (Shift Start)
                      </label>
                      <select
                        value={editingDutyDoctor.opdSchedule.dutyJoiningTimeEvening || ''}
                        onChange={(e) => {
                          setEditingDutyDoctor({
                            ...editingDutyDoctor,
                            opdSchedule: {
                              ...editingDutyDoctor.opdSchedule,
                              dutyJoiningTimeEvening: e.target.value
                            }
                          });
                        }}
                        className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 font-medium"
                      >
                        <option value="">-- No Evening Duty --</option>
                        {STANDARD_DUTY_TIMES.map(t => (
                          <option key={`e-join-${t}`} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Duty Ending Time (Shift End)
                      </label>
                      <select
                        value={editingDutyDoctor.opdSchedule.dutyEndingTimeEvening || ''}
                        onChange={(e) => {
                          setEditingDutyDoctor({
                            ...editingDutyDoctor,
                            opdSchedule: {
                              ...editingDutyDoctor.opdSchedule,
                              dutyEndingTimeEvening: e.target.value
                            }
                          });
                        }}
                        className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 font-medium"
                      >
                        <option value="">-- No Evening Duty --</option>
                        {STANDARD_DUTY_TIMES.map(t => (
                          <option key={`e-end-${t}`} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Consultation Slot Interval & Auto-Generator */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-bold text-slate-900 block mb-0.5">
                        Consultation Slot Duration (Minutes)
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Determines appointment intervals generated between joining and ending duty hours.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {[15, 20, 30, 45].map(duration => (
                        <button
                          key={duration}
                          type="button"
                          onClick={() => {
                            setEditingDutyDoctor({
                              ...editingDutyDoctor,
                              opdSchedule: {
                                ...editingDutyDoctor.opdSchedule,
                                slotDurationMinutes: duration
                              }
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            editingDutyDoctor.opdSchedule.slotDurationMinutes === duration
                              ? 'bg-[#12304A] text-white border-[#12304A]'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {duration}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleRegenerateSlotsForEditingDoctor}
                      className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-lg border border-teal-200 flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                      <span>Auto-Generate Slots from Duty Hours</span>
                    </button>

                    <div className="text-[11px] text-slate-500">
                      Total: {editingDutyDoctor.opdSchedule.morningSlots.length + editingDutyDoctor.opdSchedule.eveningSlots.length} daily slots
                    </div>
                  </div>

                  {/* Generated Slots Preview */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Live Slot Preview (Patients Book From These)
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                      {editingDutyDoctor.opdSchedule.morningSlots.map(s => (
                        <span key={`m-${s}`} className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-semibold">
                          {s} (M)
                        </span>
                      ))}
                      {editingDutyDoctor.opdSchedule.eveningSlots.map(s => (
                        <span key={`e-${s}`} className="px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded text-[10px] font-semibold">
                          {s} (E)
                        </span>
                      ))}
                      {editingDutyDoctor.opdSchedule.morningSlots.length === 0 && editingDutyDoctor.opdSchedule.eveningSlots.length === 0 && (
                        <span className="text-[11px] text-slate-400 italic">No slots generated. Click "Auto-Generate Slots from Duty Hours".</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Days & Consultation Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="font-bold text-slate-900 block">Duty Working Days *</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {DAYS_OF_WEEK.map(day => {
                      const isChecked = editingDutyDoctor.opdSchedule.days.includes(day);
                      return (
                        <label key={day} className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const newDays = e.target.checked
                                ? [...editingDutyDoctor.opdSchedule.days, day]
                                : editingDutyDoctor.opdSchedule.days.filter(d => d !== day);
                              setEditingDutyDoctor({
                                ...editingDutyDoctor,
                                opdSchedule: {
                                  ...editingDutyDoctor.opdSchedule,
                                  days: newDays
                                }
                              });
                            }}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span>{day.slice(0, 3)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <label className="font-bold text-slate-900 block mb-1">OPD Room / Suite Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suite 104, 1st Floor"
                      value={editingDutyDoctor.opdSchedule.roomLocation || ''}
                      onChange={(e) => {
                        setEditingDutyDoctor({
                          ...editingDutyDoctor,
                          opdSchedule: {
                            ...editingDutyDoctor.opdSchedule,
                            roomLocation: e.target.value
                          }
                        });
                      }}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-900 block mb-1">Standard Consultation Fee (₹)</label>
                    <input
                      type="number"
                      value={editingDutyDoctor.consultationFee || 400}
                      onChange={(e) => {
                        setEditingDutyDoctor({
                          ...editingDutyDoctor,
                          consultationFee: Number(e.target.value) || 0
                        });
                      }}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingDutyDoctor(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#12304A] hover:bg-[#194366] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Save className="w-3.5 h-3.5 text-teal-300" />
                  <span>Save Duty Schedule & Availability</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Doctor to Duty Roster Modal */}
      {isAddingDoctor && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
            <div className="bg-[#12304A] text-white p-4 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/20 rounded-xl text-teal-300">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-teal-300 font-semibold uppercase tracking-wider">
                    Staff & Faculty Management
                  </div>
                  <h4 className="text-base font-bold">Register New Doctor with Duty Shifts</h4>
                </div>
              </div>
              <button
                onClick={() => setIsAddingDoctor(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {newDocAddError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{newDocAddError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Patil"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Medical Qualifications *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MBBS, MS (General Surgery)"
                    value={newDocQuals}
                    onChange={(e) => setNewDocQuals(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    value={newDocDeptId}
                    onChange={(e) => setNewDocDeptId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Consultant Surgeon"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={newDocExp}
                    onChange={(e) => setNewDocExp(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              {/* Shift Duty Joining & Ending Times */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900">Shift Duty Joining & Ending Hours</div>

                {/* Morning */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="newDocMorning"
                      checked={newDocHasMorning}
                      onChange={(e) => setNewDocHasMorning(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <label htmlFor="newDocMorning" className="font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Active Morning Duty Shift
                    </label>
                  </div>

                  {newDocHasMorning && (
                    <div className="grid grid-cols-2 gap-3 pl-6">
                      <div>
                        <label className="block text-slate-500 mb-1">Duty Joining (Start)</label>
                        <select
                          value={newDocJoinMorning}
                          onChange={(e) => setNewDocJoinMorning(e.target.value)}
                          className="w-full p-2 bg-white rounded border border-slate-300"
                        >
                          {STANDARD_DUTY_TIMES.map(t => (
                            <option key={`new-m-join-${t}`} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-500 mb-1">Duty Ending</label>
                        <select
                          value={newDocEndMorning}
                          onChange={(e) => setNewDocEndMorning(e.target.value)}
                          className="w-full p-2 bg-white rounded border border-slate-300"
                        >
                          {STANDARD_DUTY_TIMES.map(t => (
                            <option key={`new-m-end-${t}`} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Evening */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="newDocEvening"
                      checked={newDocHasEvening}
                      onChange={(e) => setNewDocHasEvening(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <label htmlFor="newDocEvening" className="font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      Active Evening Duty Shift
                    </label>
                  </div>

                  {newDocHasEvening && (
                    <div className="grid grid-cols-2 gap-3 pl-6">
                      <div>
                        <label className="block text-slate-500 mb-1">Duty Joining (Start)</label>
                        <select
                          value={newDocJoinEvening}
                          onChange={(e) => setNewDocJoinEvening(e.target.value)}
                          className="w-full p-2 bg-white rounded border border-slate-300"
                        >
                          {STANDARD_DUTY_TIMES.map(t => (
                            <option key={`new-e-join-${t}`} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-500 mb-1">Duty Ending</label>
                        <select
                          value={newDocEndEvening}
                          onChange={(e) => setNewDocEndEvening(e.target.value)}
                          className="w-full p-2 bg-white rounded border border-slate-300"
                        >
                          {STANDARD_DUTY_TIMES.map(t => (
                            <option key={`new-e-end-${t}`} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Consultation Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">OPD Room / Suite Location</label>
                  <input
                    type="text"
                    value={newDocRoom}
                    onChange={(e) => setNewDocRoom(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={newDocFee}
                    onChange={(e) => setNewDocFee(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slot Duration</label>
                  <select
                    value={newDocSlotInterval}
                    onChange={(e) => setNewDocSlotInterval(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={20}>20 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                  </select>
                </div>
              </div>

              {/* Working Days */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Consulting Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map(day => (
                    <label key={day} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newDocDays.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewDocDays([...newDocDays, day]);
                          } else {
                            setNewDocDays(newDocDays.filter(d => d !== day));
                          }
                        }}
                        className="rounded text-teal-600"
                      />
                      <span>{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddingDoctor(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#12304A] hover:bg-[#194366] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4 text-teal-300" />
                  <span>Register Doctor with Shift Hours</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Doctor Confirmation Dialog */}
      {deletingDoc && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-bold text-slate-900">Remove Doctor from Roster?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <strong>{deletingDoc.name}</strong> ({deletingDoc.departmentName}) from the hospital clinical roster?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingDoc(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDoctorConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Remove Doctor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

