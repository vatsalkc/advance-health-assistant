-- ============================================
-- Update Existing Appointments with Patient Names
-- Run this to fix "Unknown Patient" issue
-- ============================================

-- Update appointments that don't have patient_name set
UPDATE public.appointments apt
SET 
  patient_name = u.name,
  patient_phone = u.phone
FROM public.users u
WHERE apt.user_id = u.id
AND (apt.patient_name IS NULL OR apt.patient_name = '');

-- Verify the update
SELECT 
  id,
  patient_name,
  patient_phone,
  doctor_name,
  date,
  time,
  status
FROM public.appointments
ORDER BY created_at DESC
LIMIT 10;

-- Check how many appointments were updated
SELECT 
  COUNT(*) as total_appointments,
  COUNT(patient_name) as appointments_with_names,
  COUNT(*) - COUNT(patient_name) as appointments_without_names
FROM public.appointments;
