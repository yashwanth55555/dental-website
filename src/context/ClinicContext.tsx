import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ClinicConfig,
  Appointment,
  BlockedSlot,
  ReviewItem,
  GalleryItem,
  TreatmentItem,
} from '../types';
import {
  initialClinicConfig,
  treatmentsData,
  initialReviews,
  defaultGalleryItems,
} from '../data/clinicData';
import {
  insertAppointmentToSupabase,
  fetchAppointmentsFromSupabase,
  updateAppointmentInSupabase,
  deleteAppointmentFromSupabase,
  SUPABASE_URL,
} from '../lib/supabase';

interface BookingModalState {
  isOpen: boolean;
  preselectedTreatment?: string;
}

interface SupabaseSyncInfo {
  isConfigured: boolean;
  status: 'connected' | 'syncing' | 'offline_ready' | 'error';
  lastSyncedAt?: string;
  projectId: string;
  errorMessage?: string;
}

interface ClinicContextType {
  clinicConfig: ClinicConfig;
  updateClinicConfig: (newConfig: ClinicConfig) => void;
  treatments: TreatmentItem[];
  appointments: Appointment[];
  deletedAppointments: Appointment[];
  addAppointment: (data: Omit<Appointment, 'id' | 'referenceCode' | 'status' | 'createdAt'>) => {
    success: boolean;
    appointment?: Appointment;
    error?: string;
  };
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => boolean;
  cancelAppointmentByPatient: (referenceCode: string, reason?: string) => boolean;
  deleteAppointment: (id: string) => boolean;
  deleteOldAppointments: (filter: 'all_past' | 'completed_cancelled' | 'older_than_30_days') => number;
  restoreDeletedAppointment: (id: string) => boolean;
  undoLastDelete: () => boolean;
  clearDeletedAppointments: () => void;
  permanentlyDeleteOne: (id: string) => void;
  lastDeletedCount: number;
  blockedSlots: BlockedSlot[];
  addBlockedSlot: (date: string, timeSlot: string, reason: string) => void;
  removeBlockedSlot: (id: string) => void;
  getAvailableSlotsForDate: (dateStr: string) => { time: string; available: boolean; reason?: string }[];
  reviews: ReviewItem[];
  addReview: (review: Omit<ReviewItem, 'id' | 'date' | 'isVerifiedGoogle'>) => void;
  galleryItems: GalleryItem[];
  isAdminLoggedIn: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  bookingModal: BookingModalState;
  openBookingModal: (preselectedTreatment?: string) => void;
  closeBookingModal: () => void;
  selectedTreatmentForDetail: TreatmentItem | null;
  setSelectedTreatmentForDetail: (t: TreatmentItem | null) => void;
  isManageBookingOpen: boolean;
  setIsManageBookingOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  supabaseSyncInfo: SupabaseSyncInfo;
  refreshFromSupabase: () => Promise<void>;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    referenceCode: 'KM-8421',
    patientName: 'Ramesh Gowda',
    mobile: '9845123456',
    email: 'ramesh.g@example.com',
    treatment: 'Root Canal Treatment',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '11:15 AM',
    isExistingPatient: true,
    notes: 'Mild discomfort on upper molar for 3 days',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'apt-2',
    referenceCode: 'KM-9102',
    patientName: 'Meenakshi Shetty',
    mobile: '9481987654',
    treatment: 'Teeth Cleaning & Scaling',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '04:00 PM',
    isExistingPatient: false,
    notes: 'Routine 6-month checkup and cleaning',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'apt-3',
    referenceCode: 'KM-7245',
    patientName: 'Karthik N.',
    mobile: '9740567890',
    treatment: 'Dental Crowns / Capping',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '02:00 PM',
    isExistingPatient: true,
    notes: 'Fitting permanent zirconia crown following RCT',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 48200000).toISOString(),
  },
];

// Helper for standard operating time slots
export const ALL_DAILY_SLOTS = [
  '10:30 AM',
  '11:15 AM',
  '12:00 PM',
  '12:45 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
];

export const SUNDAY_SLOTS = ['10:30 AM', '11:15 AM', '11:45 AM'];

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clinicConfig, setClinicConfig] = useState<ClinicConfig>(() => {
    try {
      const saved = localStorage.getItem('km_clinic_config');
      return saved ? JSON.parse(saved) : initialClinicConfig;
    } catch {
      return initialClinicConfig;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('km_appointments');
      return saved ? JSON.parse(saved) : SEED_APPOINTMENTS;
    } catch {
      return SEED_APPOINTMENTS;
    }
  });

  const [deletedAppointments, setDeletedAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('km_deleted_appointments');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastDeletedBatch, setLastDeletedBatch] = useState<Appointment[]>([]);

  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>(() => {
    try {
      const saved = localStorage.getItem('km_blocked_slots');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem('km_reviews');
      return saved ? JSON.parse(saved) : initialReviews;
    } catch {
      return initialReviews;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('km_admin_auth') === 'true';
  });

  const [bookingModal, setBookingModal] = useState<BookingModalState>({
    isOpen: false,
    preselectedTreatment: undefined,
  });

  const [selectedTreatmentForDetail, setSelectedTreatmentForDetail] = useState<TreatmentItem | null>(null);
  const [isManageBookingOpen, setIsManageBookingOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Supabase sync tracking
  const [supabaseSyncInfo, setSupabaseSyncInfo] = useState<SupabaseSyncInfo>({
    isConfigured: true,
    status: 'connected',
    projectId: 'lqngukvdzidpsdenqqhl',
  });

  // Fetch from Supabase on mount
  useEffect(() => {
    refreshFromSupabase();
  }, []);

  const refreshFromSupabase = async () => {
    try {
      setSupabaseSyncInfo((prev) => ({ ...prev, status: 'syncing' }));
      const res = await fetchAppointmentsFromSupabase();

      if (res.success && res.data && res.data.length > 0) {
        // Merge Supabase appointments with local appointments (avoid duplicates by referenceCode)
        setAppointments((prev) => {
          const map = new Map<string, Appointment>();
          // Put seed/local appointments first
          prev.forEach((a) => map.set(a.referenceCode, a));
          // Overwrite/add Supabase records
          res.data.forEach((a: Appointment) => map.set(a.referenceCode, a));
          return Array.from(map.values());
        });

        setSupabaseSyncInfo({
          isConfigured: true,
          status: 'connected',
          projectId: 'lqngukvdzidpsdenqqhl',
          lastSyncedAt: new Date().toLocaleTimeString(),
        });
      } else if (res.success) {
        setSupabaseSyncInfo({
          isConfigured: true,
          status: 'connected',
          projectId: 'lqngukvdzidpsdenqqhl',
          lastSyncedAt: new Date().toLocaleTimeString(),
        });
      } else {
        // Table may not have been created yet or permission error
        setSupabaseSyncInfo({
          isConfigured: true,
          status: 'offline_ready',
          projectId: 'lqngukvdzidpsdenqqhl',
          errorMessage: res.error,
        });
      }
    } catch (err: any) {
      setSupabaseSyncInfo({
        isConfigured: true,
        status: 'offline_ready',
        projectId: 'lqngukvdzidpsdenqqhl',
        errorMessage: err?.message,
      });
    }
  };

  useEffect(() => {
    localStorage.setItem('km_clinic_config', JSON.stringify(clinicConfig));
  }, [clinicConfig]);

  useEffect(() => {
    localStorage.setItem('km_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('km_deleted_appointments', JSON.stringify(deletedAppointments));
  }, [deletedAppointments]);

  useEffect(() => {
    localStorage.setItem('km_blocked_slots', JSON.stringify(blockedSlots));
  }, [blockedSlots]);

  useEffect(() => {
    localStorage.setItem('km_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const updateClinicConfig = (newConfig: ClinicConfig) => {
    setClinicConfig(newConfig);
  };

  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getAvailableSlotsForDate = (dateStr: string) => {
    const dayName = getDayName(dateStr);
    const dayConfig = clinicConfig.operatingHours.find((d) => d.day.toLowerCase() === dayName.toLowerCase());

    if (!dayConfig || !dayConfig.isOpen) {
      return [];
    }

    const baseSlots = dayName.toLowerCase() === 'sunday' ? SUNDAY_SLOTS : ALL_DAILY_SLOTS;

    return baseSlots.map((time) => {
      // Check if blocked by admin
      const isBlocked = blockedSlots.some((b) => b.date === dateStr && b.timeSlot === time);
      if (isBlocked) {
        return { time, available: false, reason: 'Reserved / Doctor on call' };
      }

      // Check if already booked with active status
      const isBooked = appointments.some(
        (a) =>
          a.date === dateStr &&
          a.timeSlot === time &&
          a.status !== 'Cancelled'
      );

      if (isBooked) {
        return { time, available: false, reason: 'Already booked' };
      }

      return { time, available: true };
    });
  };

  const addAppointment = (data: Omit<Appointment, 'id' | 'referenceCode' | 'status' | 'createdAt'>) => {
    // Validate availability
    const slots = getAvailableSlotsForDate(data.date);
    const targetSlot = slots.find((s) => s.time === data.timeSlot);

    if (!targetSlot) {
      return { success: false, error: 'Selected time slot is outside clinic operating hours.' };
    }

    if (!targetSlot.available) {
      return { success: false, error: `This slot is no longer available (${targetSlot.reason || 'unavailable'}). Please choose another slot.` };
    }

    const randNum = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `KM-${randNum}`;
    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      referenceCode,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // Update local state immediately
    setAppointments((prev) => [newAppointment, ...prev]);

    // Send to Supabase asynchronously
    insertAppointmentToSupabase({
      referenceCode,
      patientName: data.patientName,
      mobile: data.mobile,
      email: data.email,
      treatment: data.treatment,
      date: data.date,
      timeSlot: data.timeSlot,
      isExistingPatient: data.isExistingPatient,
      notes: data.notes,
      status: 'Pending',
    }).then((res) => {
      if (res.success) {
        setSupabaseSyncInfo((prev) => ({
          ...prev,
          status: 'connected',
          lastSyncedAt: new Date().toLocaleTimeString(),
          errorMessage: undefined,
        }));
      } else {
        console.warn('Appointment saved locally, Supabase note:', res.error);
        setSupabaseSyncInfo((prev) => ({
          ...prev,
          status: 'offline_ready',
          errorMessage: res.error,
        }));
      }
    });

    return { success: true, appointment: newAppointment };
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    const apt = appointments.find((a) => a.id === id);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );

    if (apt) {
      updateAppointmentInSupabase(apt.referenceCode, { status });
    }
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return false;

    // Check if new slot available
    const slots = getAvailableSlotsForDate(newDate);
    const target = slots.find((s) => s.time === newTime);
    if (!target || !target.available) return false;

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, date: newDate, timeSlot: newTime, status: 'Confirmed' } : a
      )
    );

    updateAppointmentInSupabase(apt.referenceCode, {
      date: newDate,
      timeSlot: newTime,
      status: 'Confirmed',
    });

    return true;
  };

  const cancelAppointmentByPatient = (referenceCode: string, reason?: string) => {
    const found = appointments.find(
      (a) => a.referenceCode.trim().toUpperCase() === referenceCode.trim().toUpperCase()
    );
    if (!found) return false;

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === found.id
          ? {
              ...a,
              status: 'Cancelled',
              notes: reason ? `${a.notes ? a.notes + ' | ' : ''}Cancelled by patient: ${reason}` : a.notes,
            }
          : a
      )
    );

    updateAppointmentInSupabase(referenceCode, {
      status: 'Cancelled',
      notes: reason ? `Cancelled by patient: ${reason}` : undefined,
    });

    return true;
  };

  const deleteAppointment = (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return false;

    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setDeletedAppointments((prev) => [apt, ...prev]);
    setLastDeletedBatch([apt]);

    deleteAppointmentFromSupabase(apt.referenceCode);
    return true;
  };

  const deleteOldAppointments = (filter: 'all_past' | 'completed_cancelled' | 'older_than_30_days') => {
    const todayStr = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

    const toDelete = appointments.filter((apt) => {
      if (filter === 'all_past') {
        return apt.date < todayStr;
      }
      if (filter === 'completed_cancelled') {
        return apt.status === 'Completed' || apt.status === 'Cancelled';
      }
      if (filter === 'older_than_30_days') {
        return apt.date < thirtyDaysAgo;
      }
      return false;
    });

    if (toDelete.length === 0) return 0;

    const idsToDelete = new Set(toDelete.map((a) => a.id));
    setAppointments((prev) => prev.filter((a) => !idsToDelete.has(a.id)));
    setDeletedAppointments((prev) => [...toDelete, ...prev]);
    setLastDeletedBatch(toDelete);

    toDelete.forEach((apt) => {
      deleteAppointmentFromSupabase(apt.referenceCode);
    });

    return toDelete.length;
  };

  const restoreDeletedAppointment = (id: string) => {
    const target = deletedAppointments.find((a) => a.id === id);
    if (!target) return false;

    setDeletedAppointments((prev) => prev.filter((a) => a.id !== id));
    setAppointments((prev) => [target, ...prev]);
    setLastDeletedBatch((prev) => prev.filter((a) => a.id !== id));

    insertAppointmentToSupabase(target);
    return true;
  };

  const undoLastDelete = () => {
    if (lastDeletedBatch.length === 0 && deletedAppointments.length === 0) {
      return false;
    }

    const batchToRestore =
      lastDeletedBatch.length > 0 ? lastDeletedBatch : [deletedAppointments[0]];

    const batchIds = new Set(batchToRestore.map((a) => a.id));

    setDeletedAppointments((prev) => prev.filter((a) => !batchIds.has(a.id)));
    setAppointments((prev) => {
      const map = new Map<string, Appointment>();
      batchToRestore.forEach((a) => map.set(a.id, a));
      prev.forEach((a) => map.set(a.id, a));
      return Array.from(map.values());
    });
    setLastDeletedBatch([]);

    batchToRestore.forEach((apt) => {
      insertAppointmentToSupabase(apt);
    });

    return true;
  };

  const clearDeletedAppointments = () => {
    setDeletedAppointments([]);
    setLastDeletedBatch([]);
  };

  const permanentlyDeleteOne = (id: string) => {
    setDeletedAppointments((prev) => prev.filter((a) => a.id !== id));
    setLastDeletedBatch((prev) => prev.filter((a) => a.id !== id));
  };

  const addBlockedSlot = (date: string, timeSlot: string, reason: string) => {
    const newBlocked: BlockedSlot = {
      id: `block-${Date.now()}`,
      date,
      timeSlot,
      reason: reason || 'Clinic blocked slot',
    };
    setBlockedSlots((prev) => [...prev, newBlocked]);
  };

  const removeBlockedSlot = (id: string) => {
    setBlockedSlots((prev) => prev.filter((b) => b.id !== id));
  };

  const addReview = (newReview: Omit<ReviewItem, 'id' | 'date' | 'isVerifiedGoogle'>) => {
    const created: ReviewItem = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      isVerifiedGoogle: false,
    };
    setReviews((prev) => [created, ...prev]);
  };

  const loginAdmin = (password: string) => {
    // Clinic Staff Administration Password
    if (password.trim() === 'KMdental@5') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('km_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('km_admin_auth');
  };

  const openBookingModal = (preselectedTreatment?: string) => {
    setBookingModal({
      isOpen: true,
      preselectedTreatment,
    });
  };

  const closeBookingModal = () => {
    setBookingModal({
      isOpen: false,
      preselectedTreatment: undefined,
    });
  };

  return (
    <ClinicContext.Provider
      value={{
        clinicConfig,
        updateClinicConfig,
        treatments: treatmentsData,
        appointments,
        deletedAppointments,
        addAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        cancelAppointmentByPatient,
        deleteAppointment,
        deleteOldAppointments,
        restoreDeletedAppointment,
        undoLastDelete,
        clearDeletedAppointments,
        permanentlyDeleteOne,
        lastDeletedCount: lastDeletedBatch.length,
        blockedSlots,
        addBlockedSlot,
        removeBlockedSlot,
        getAvailableSlotsForDate,
        reviews,
        addReview,
        galleryItems: defaultGalleryItems,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        bookingModal,
        openBookingModal,
        closeBookingModal,
        selectedTreatmentForDetail,
        setSelectedTreatmentForDetail,
        isManageBookingOpen,
        setIsManageBookingOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        supabaseSyncInfo,
        refreshFromSupabase,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};

