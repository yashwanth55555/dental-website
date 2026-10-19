export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';

export interface Appointment {
  id: string;
  referenceCode: string;
  patientName: string;
  mobile: string;
  email?: string;
  treatment: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "11:15 AM"
  isExistingPatient: boolean;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface TreatmentItem {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: 'Restorative' | 'Preventive' | 'Ortho & Cosmetic' | 'Surgical' | 'General';
  keyBenefits: string[];
  durationEstimate: string;
  commonSigns: string[];
  iconName: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  treatmentTag?: string;
  comment: string;
  isVerifiedGoogle: boolean;
}

export interface OperatingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface ClinicConfig {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  googleRating: number;
  reviewCount: number;
  operatingHours: OperatingHours[];
}

export interface BlockedSlot {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  reason: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Clinic' | 'Exterior' | 'Interior' | 'Treatment' | 'Care';
  description: string;
  aspectRatio: string;
  bgGradient: string;
}
