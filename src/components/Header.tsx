import React, { useState, useEffect } from 'react';
import { useClinic } from '../context/ClinicContext';
import { ClinicLogo } from './DentalGraphics';
import { Phone, Calendar, Menu, X, UserCheck, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    clinicConfig,
    openBookingModal,
    setIsManageBookingOpen,
    setIsAdminModalOpen,
    isAdminLoggedIn,
  } = useClinic();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Treatments', href: '#treatments' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-slate-200 shadow-sm py-2.5'
            : 'bg-[#FBFBFA]/90 backdrop-blur-sm border-slate-200/80 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Zone 1: Single text element Brand mark */}
            <a href="#" className="flex items-center group">
              <ClinicLogo />
            </a>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-teal-700 transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => setIsManageBookingOpen(true)}
                className="text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>My Booking</span>
              </button>
            </nav>

            {/* Zone 3: Primary Actions */}
            <div className="flex items-center gap-3">
              <a
                href={`tel:${clinicConfig.phone.replace(/\s+/g, '')}`}
                className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-teal-700 px-3 py-1.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors"
                title="Call K.M Dental Care"
              >
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>{clinicConfig.phone}</span>
              </a>

              <button
                type="button"
                onClick={() => openBookingModal()}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0B1E33] hover:bg-[#132e4d] rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 whitespace-nowrap active:scale-[0.98]"
              >
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={() => setIsAdminModalOpen(true)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  isAdminLoggedIn
                    ? 'border-teal-500 text-teal-700 bg-teal-50'
                    : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="Staff Admin Portal"
                aria-label="Staff Portal"
              >
                <Shield className="w-3.5 h-3.5" />
              </button>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsManageBookingOpen(true);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-slate-500" />
                <span>Find / Manage Booking</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={`tel:${clinicConfig.phone.replace(/\s+/g, '')}`}
                className="w-full py-2.5 px-3 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-teal-700" />
                <span>Call {clinicConfig.phone}</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBookingModal();
                }}
                className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-teal-700 rounded-lg flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book an Appointment</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
