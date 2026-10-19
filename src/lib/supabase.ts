import { createClient } from '@supabase/supabase-js';

// User provided credentials
const SUPABASE_PROJECT_ID = 'lqngukvdzidpsdenqqhl';
const SUPABASE_DEFAULT_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_DEFAULT_KEY = 'sb_publishable_-livFKisSq8RgU4AIAATjQ_OBnrieZR';

export const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL || SUPABASE_DEFAULT_URL;
export const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || SUPABASE_DEFAULT_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseAppointmentRow {
  id?: string;
  reference_code: string;
  patient_name: string;
  mobile: string;
  email?: string | null;
  treatment: string;
  appointment_date: string;
  time_slot: string;
  is_existing_patient?: boolean;
  notes?: string | null;
  status?: string;
  created_at?: string;
}

/**
 * Inserts an appointment into Supabase.
 * Tries the primary schema ('appointments' with snake_case columns),
 * and handles fallbacks gracefully.
 */
export async function insertAppointmentToSupabase(data: {
  referenceCode: string;
  patientName: string;
  mobile: string;
  email?: string;
  treatment: string;
  date: string;
  timeSlot: string;
  isExistingPatient: boolean;
  notes?: string;
  status: string;
}) {
  try {
    const payload: SupabaseAppointmentRow = {
      reference_code: data.referenceCode,
      patient_name: data.patientName,
      mobile: data.mobile,
      email: data.email || null,
      treatment: data.treatment,
      appointment_date: data.date,
      time_slot: data.timeSlot,
      is_existing_patient: data.isExistingPatient,
      notes: data.notes || null,
      status: data.status || 'Pending',
    };

    const { data: result, error } = await supabase
      .from('appointments')
      .insert([payload])
      .select();

    if (error) {
      // If snake_case column fails, try camelCase alternative in case table was created with camelCase
      const fallbackPayload = {
        referenceCode: data.referenceCode,
        patientName: data.patientName,
        mobile: data.mobile,
        email: data.email || null,
        treatment: data.treatment,
        date: data.date,
        timeSlot: data.timeSlot,
        isExistingPatient: data.isExistingPatient,
        notes: data.notes || null,
        status: data.status || 'Pending',
      };

      const fallbackRes = await supabase
        .from('appointments')
        .insert([fallbackPayload])
        .select();

      if (fallbackRes.error) {
        console.warn('Supabase insert warning:', error.message || fallbackRes.error.message);
        return { success: false, error: error.message || fallbackRes.error.message };
      }

      return { success: true, data: fallbackRes.data };
    }

    return { success: true, data: result };
  } catch (err: any) {
    console.error('Supabase unexpected error:', err);
    return { success: false, error: err?.message || 'Network error saving to Supabase' };
  }
}

/**
 * Fetches appointments from Supabase 'appointments' table.
 */
export async function fetchAppointmentsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    // Normalize rows to standard app format
    const normalized = (data || []).map((row: any) => ({
      id: row.id?.toString() || `apt-${Date.now()}`,
      referenceCode: row.reference_code || row.referenceCode || `KM-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: row.patient_name || row.patientName || 'Patient',
      mobile: row.mobile || '',
      email: row.email || undefined,
      treatment: row.treatment || 'General Dental Consultation',
      date: row.appointment_date || row.date || new Date().toISOString().split('T')[0],
      timeSlot: row.time_slot || row.timeSlot || '10:30 AM',
      isExistingPatient: Boolean(row.is_existing_patient ?? row.isExistingPatient),
      notes: row.notes || undefined,
      status: (row.status || 'Pending') as any,
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    }));

    return { success: true, data: normalized };
  } catch (err: any) {
    return { success: false, error: err?.message, data: [] };
  }
}

/**
 * Updates an appointment's status in Supabase
 */
export async function updateAppointmentInSupabase(referenceCode: string, updates: {
  status?: string;
  date?: string;
  timeSlot?: string;
  notes?: string;
}) {
  try {
    const payload: any = {};
    if (updates.status) payload.status = updates.status;
    if (updates.date) {
      payload.appointment_date = updates.date;
      payload.date = updates.date;
    }
    if (updates.timeSlot) {
      payload.time_slot = updates.timeSlot;
      payload.timeSlot = updates.timeSlot;
    }
    if (updates.notes) payload.notes = updates.notes;

    const { error } = await supabase
      .from('appointments')
      .update(payload)
      .eq('reference_code', referenceCode);

    if (error) {
      // try camelCase eq
      await supabase.from('appointments').update(payload).eq('referenceCode', referenceCode);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Deletes an appointment from Supabase
 */
export async function deleteAppointmentFromSupabase(referenceCode: string) {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('reference_code', referenceCode);

    if (error) {
      await supabase.from('appointments').delete().eq('referenceCode', referenceCode);
    }
    return true;
  } catch {
    return false;
  }
}

