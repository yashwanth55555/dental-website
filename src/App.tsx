/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ClinicProvider } from './context/ClinicContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { About } from './components/About';
import { Treatments } from './components/Treatments';
import { FeaturedRCT } from './components/FeaturedRCT';
import { WhyChooseUs } from './components/WhyChooseUs';
import { PatientExperience } from './components/PatientExperience';
import { EmergencyCTA } from './components/EmergencyCTA';
import { Gallery } from './components/Gallery';
import { Reviews } from './components/Reviews';
import { LocationSection } from './components/LocationSection';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { ManageBookingModal } from './components/ManageBookingModal';
import { TreatmentDetailModal } from './components/TreatmentDetailModal';
import { AdminModal } from './components/AdminModal';
import { MobileStickyBar } from './components/MobileStickyBar';

export default function App() {
  return (
    <ClinicProvider>
      <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-slate-800 antialiased font-sans selection:bg-teal-100 selection:text-teal-900">
        <Header />
        <main className="flex-1">
          <Hero />
          <TrustStrip />
          <About />
          <Treatments />
          <FeaturedRCT />
          <WhyChooseUs />
          <PatientExperience />
          <EmergencyCTA />
          <Gallery />
          <Reviews />
          <LocationSection />
          <FAQ />
        </main>
        <Footer />

        {/* Global Functional Modals & Mobile Bottom Bar */}
        <BookingModal />
        <ManageBookingModal />
        <TreatmentDetailModal />
        <AdminModal />
        <MobileStickyBar />
      </div>
    </ClinicProvider>
  );
}
