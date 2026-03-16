-- ============================================
-- COMPLETE FIX FOR PATIENT NAMES
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Step 1: Check current state
SELECT 
  id,
  user_id,
  doctor_id,
  patient_name,
  patient_phone,
  date,
  status,
  created_at
FROM public.appointments
ORDER BY created_at DESC
LIMIT 5;

-- Step 2: Check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'appointments' 
AND column_name IN ('patient_name', 'patient_phone');

-- Step 3: Add columns if they don't exist
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_name TEXT;

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_phone TEXT;

-- Step 4: Update ALL appointments with patient info
UPDATE public.appointments apt
SET 
  patient_name = u.name,
  patient_phone = u.phone,
  updated_at = NOW()
FROM public.users u
WHERE apt.user_id = u.id;

-- Step 5: Verify the update worked
SELECT 
  COUNT(*) as total_appointments,
  COUNT(patient_name) as with_patient_name,
  COUNT(patient_phone) as with_patient_phone
FROM public.appointments;

-- Step 6: Show sample of updated appointments
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

-- Step 7: Check for any NULL patient names
SELECT 
  id,
  user_id,
  patient_name,
  date,
  status
FROM public.appointments
WHERE patient_name IS NULL
LIMIT 5;

-- If you see any NULL patient names above, run this:
-- UPDATE public.appointments 
-- SET patient_name = 'Patient ' || SUBSTRING(user_id::text, 1, 8)
-- WHERE patient_name IS NULL;
