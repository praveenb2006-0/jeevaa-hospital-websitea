import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, ExternalLink, Navigation } from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/hospitalData';
import { StorageService } from '../../services/storageService';

export const ContactLocation: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Consultation Inquiry');
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please write your question or inquiry.');
      return;
    }

    try {
      StorageService.saveInquiry({
        name: name.trim(),
        phone: `+91 ${cleanPhone.slice(-10)}`,
        email: email.trim(),
        subject,
        message: message.trim()
      });
      setSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (e) {
      console.error(e);
      setErrorMsg('Could not submit message. Please call the front desk directly.');
    }
  };

  return (
    <section id="contact" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#168C8C] mb-1">
            Reach Our Hospital Campus
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A] tracking-tight">
            Contact Details & Location Directions
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Conveniently situated on New Jewargi Road in Kalaburagi, easily reachable by city bus, auto-rickshaw, or private transport.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Hospital Contact Details & Map Card (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Emergency Helpline Card */}
              <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase mb-2">
                  <Phone className="w-4 h-4 text-rose-600" />
                  <span>24/7 Emergency Casualty</span>
                </div>
                <a
                  href={`tel:${HOSPITAL_METADATA.emergencyPhoneRaw}`}
                  className="text-lg font-bold text-rose-900 hover:text-rose-700 block transition-colors"
                >
                  {HOSPITAL_METADATA.emergencyPhone}
                </a>
                <p className="text-xs text-rose-700 mt-1">
                  Immediate emergency response, trauma triage, and on-call ambulance dispatch.
                </p>
              </div>

              {/* General Reception Card */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase mb-2">
                  <Phone className="w-4 h-4 text-[#168C8C]" />
                  <span>OPD Desk & General Enquiries</span>
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {HOSPITAL_METADATA.deskPhone}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Inpatient enquiries, doctor OPD timings, and general billing support.
                </p>
              </div>

            </div>

            {/* Address & Timings Details */}
            <div className="bg-[#F7F9FB] rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#168C8C] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sm text-slate-900 block">Verified Address:</strong>
                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                    {HOSPITAL_METADATA.address}
                  </p>
                  <div className="mt-2 text-xs text-slate-500 space-y-0.5">
                    <div>• Landmark: Near Shangri-La Apartment / Varghese Apartment</div>
                    <div>• Transit: Kalaburagi Junction Railway Station (~4.2 km) | KSRTC Central Bus Stand (~3.8 km)</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                <Clock className="w-5 h-5 text-[#168C8C] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 space-y-1">
                  <div>
                    <strong className="text-slate-900">Emergency & Critical Care:</strong> 24 Hours Open Daily (365 Days)
                  </div>
                  <div>
                    <strong className="text-slate-900">Outpatient Consultation (OPD):</strong> Mon to Sat, 09:00 AM – 01:30 PM & 04:30 PM – 08:00 PM
                  </div>
                  <div>
                    <strong className="text-slate-900">Email:</strong> {HOSPITAL_METADATA.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Map Visual / Direct Route Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs text-teal-400 font-semibold uppercase tracking-wider">
                  Navigation & Driving Route
                </div>
                <div className="text-base font-bold">
                  Open Official Google Maps Listing
                </div>
                <p className="text-xs text-slate-300">
                  Accurate GPS navigation to the hospital main entrance on New Jewargi Road.
                </p>
              </div>

              <a
                href={HOSPITAL_METADATA.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#168C8C] hover:bg-[#127272] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shrink-0 transition-colors shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Driving Directions</span>
                <ExternalLink className="w-3 h-3 text-teal-200" />
              </a>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
              <div className="mb-5">
                <h3 className="text-base font-bold text-[#12304A]">
                  Send Hospital Inquiry
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Our front desk team will review your query and respond via phone or email.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 text-center bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto" />
                  <h4 className="text-sm font-bold text-teal-900">Message Received!</h4>
                  <p className="text-xs text-teal-800 leading-relaxed">
                    Thank you. Your message has been logged in the hospital inquiry desk. A representative will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-xs font-semibold text-teal-700 underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {errorMsg && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div>
                    <label htmlFor="inquiry-full-name" className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      id="inquiry-full-name"
                      type="text"
                      placeholder="e.g. Ramesh Kulkarni"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="inquiry-mobile" className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                      <input
                        id="inquiry-mobile"
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiry-email" className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        id="inquiry-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inquiry-subject" className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Topic</label>
                    <select
                      id="inquiry-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900"
                    >
                      <option value="General Consultation Inquiry">General Consultation Inquiry</option>
                      <option value="Surgical & Procedure Estimation">Surgical & Procedure Estimation</option>
                      <option value="Insurance / Cashless TPA Help">Insurance / Cashless TPA Help</option>
                      <option value="Diagnostic Reports Support">Diagnostic Reports Support</option>
                      <option value="Other Assistance">Other Assistance</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="inquiry-message" className="block text-xs font-semibold text-slate-700 mb-1">How can we assist you? *</label>
                    <textarea
                      id="inquiry-message"
                      rows={3}
                      placeholder="Describe your question or requirement..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#12304A] hover:bg-[#194366] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-teal-300" />
                    <span>Send Message to Hospital</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
