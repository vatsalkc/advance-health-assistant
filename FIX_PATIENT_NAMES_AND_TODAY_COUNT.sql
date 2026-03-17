-- ============================================
-- FIX PATIENT NAMES AND TODAY'S APPOINTMENT COUNT
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Check current appointments and their patient info
SELECT 
  a.id,
  a.user_id,
  a.patient_name as "Current patient_name in appointments",
  u.name as "Name from users table",
  a.date,
  a.time,
  a.status
FROM public.appointments a
LEFT JOIN public.users u ON a.user_id = u.id
ORDER BY a.date DESC, a.time DESC
LIMIT 10;

-- Step 2: Ensure patient_name and patient_phone columns exist
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_name TEXT;

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_phone TEXT;

-- Step 3: Update ALL appointments with patient info from users table
UPDATE public.appointments a
SET 
  patient_name = u.name,
  patient_phone = u.phone,
  updated_at = NOW()
FROM public.users u
WHERE a.user_id = u.id
  AND (a.patient_name IS NULL OR a.patient_name = '');

-- Step 4: For any appointments without a matching user, set a placeholder
UPDATE public.appointments
SET patient_name = 'Patient (ID: ' || SUBSTRING(user_id::text, 1, 8) || ')'
WHERE patient_name IS NULL OR patient_name = '';

-- Step 5: Verify all appointments now have patient names
SELECT 
  COUNT(*) as total_appointments,
  COUNT(patient_name) as with_patient_name,
  COUNT(CASE WHEN patient_name IS NULL OR patient_name = '' THEN 1 END) as without_patient_name
FROM public.appointments;

-- Step 6: Check today's appointments specifically
SELECT 
  id,
  patient_name,
  doctor_name,
  date,
  time,
  status,
  reason
FROM public.appointments
WHERE date = CURRENT_DATE
ORDER BY time;

-- Step 7: Show sample of updated appointments
SELECT 
  id,
  patient_name,
  patient_phone,
  doctor_name,
  date,
  time,
  status
FROM public.appointments
ORDER BY date DESC, time DESC
LIMIT 10;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count appointments by date
SELECT 
  date,
  COUNT(*) as appointment_count,
  COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN status = 'Confirmed' THEN 1 END) as confirmed_count
FROM public.appointments
GROUP BY date
ORDER BY date DESC
LIMIT 7;

-- Check for any NULL patient names
SELECT 
  id,
  user_id,
  patient_name,
  date,
  status
FROM public.appointments
WHERE patient_name IS NULL OR patient_name = ''
LIMIT 5;
