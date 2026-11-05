/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import { Department, Doctor } from './types/hospital';
import { Language } from './utils/translations';

// Components
import { Header } from './components/layout/Header';
import { EmergencyBanner, MobileQuickActions } from './components/common/EmergencyBanner';
import { HeroSection } from './components/home/HeroSection';
import { AboutSection } from './components/about/AboutSection';
import { SpecialtiesSection } from './components/specialties/SpecialtiesSection';
import { DoctorsSection } from './components/doctors/DoctorsSection';
import { FacilitiesGallery } from './components/facilities/FacilitiesGallery';
import { PatientInformation } from './components/patient/PatientInformation';
import { ContactLocation } from './components/contact/ContactLocation';
import { Footer } from './components/layout/Footer';
import { AppointmentBookingModal } from './components/booking/AppointmentBookingModal';
import { AppointmentTracker } from './components/booking/AppointmentTracker';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentLang, setCurrentLang] = useState<Language>('en');

  // Modal States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPreselect, setBookingPreselect] = useState<{
    deptId?: string;
    doctorId?: string;
    date?: string;
  }>({});

  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load initial data and sync from Supabase
  const loadHospitalData = () => {
    setDepartments(StorageService.getDepartments());
    setDoctors(StorageService.getDoctors());
  };

  useEffect(() => {
    loadHospitalData();
    // Bi-directional sync with Supabase backend
    StorageService.syncWithSupabase().then(res => {
      if (res.synced > 0) {
        loadHospitalData();
      }
    });
  }, []);

  const handleOpenBooking = (deptId?: string, doctorId?: string, preferredDate?: string) => {
    setBookingPreselect({ deptId, doctorId, date: preferredDate });
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] text-[#253445]">
      {/* Primary Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenBooking={() => handleOpenBooking()}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Unobtrusive Emergency Casualty Notice */}
      <EmergencyBanner />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Quick Booking Widget */}
        <HeroSection
          currentLang={currentLang}
          departments={departments}
          doctors={doctors}
          onOpenBooking={handleOpenBooking}
        />

        {/* About Hospital & Care Philosophy */}
        <AboutSection />

        {/* Verified Clinical Specialties & Care Units */}
        <SpecialtiesSection
          departments={departments}
          doctors={doctors}
          currentLang={currentLang}
          onOpenBooking={(deptId, docId) => handleOpenBooking(deptId, docId)}
        />

        {/* Medical Specialists & Surgeons Directory */}
        <DoctorsSection
          doctors={doctors}
          currentLang={currentLang}
          onOpenBooking={(deptId, docId) => handleOpenBooking(deptId, docId)}
        />

        {/* Hospital Facilities & Infrastructure Showcase */}
        <FacilitiesGallery />

        {/* Patient Guide, Visiting Hours & Insurance Guidance */}
        <PatientInformation />

        {/* Campus Location, Directions & Contact Form */}
        <ContactLocation />
      </main>

      {/* Quiet Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Mobile Sticky Quick Action Bar (Under 15% Viewport Cap) */}
      <MobileQuickActions
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* 7-Step Guided Appointment Booking Modal */}
      <AppointmentBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        departments={departments}
        doctors={doctors}
        initialDeptId={bookingPreselect.deptId}
        initialDoctorId={bookingPreselect.doctorId}
        initialDate={bookingPreselect.date}
        currentLang={currentLang}
      />

      {/* Patient Booking Status Tracker */}
      <AppointmentTracker
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        onOpenBooking={() => {
          setIsTrackerOpen(false);
          handleOpenBooking();
        }}
      />

      {/* Authorized Staff Admin Portal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        departments={departments}
        doctors={doctors}
        onDataChanged={loadHospitalData}
      />
    </div>
  );
}
