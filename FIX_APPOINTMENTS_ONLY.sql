-- ============================================
-- Fix Appointments Only
-- Use this if you only need to fix appointment booking
-- ============================================

-- STEP 1: Check if columns already exist
SELECT column_name 
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'appointments'
AND column_name IN ('patient_name', 'patient_phone');

-- If you see 2 results (patient_name and patient_phone), skip to STEP 4
-- If you see 0 or 1 result, continue to STEP 2

-- ============================================
-- STEP 2: Add Missing Columns
-- ============================================

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_name TEXT;

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_phone TEXT;

-- ============================================
-- STEP 3: Update Existing Appointments
-- ============================================

UPDATE public.appointments apt
SET 
  patient_name = u.name,
  patient_phone = u.phone
FROM public.users u
WHERE apt.user_id = u.id
AND apt.patient_name IS NULL;

-- ============================================
-- STEP 4: Check RLS Policies
-- ============================================

SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'appointments';

-- You should see policies for: INSERT, SELECT, UPDATE, DELETE
-- If you DON'T see "Users can create own appointments", continue to STEP 5

-- ============================================
-- STEP 5: Fix RLS Policies (if needed)
-- ============================================

-- Drop old policy if it exists
DROP POLICY IF EXISTS "Users can create own appointments" ON public.appointments;

-- Create new policy
CREATE POLICY "Users can create own appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STEP 6: Verify Everything Works
-- ============================================

-- Check columns exist
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'appointments'
AND column_name IN ('patient_name', 'patient_phone');

-- Should show 2 rows

-- Check RLS policy exists
SELECT policyname 
FROM pg_policies
WHERE tablename = 'appointments'
AND policyname = 'Users can create own appointments';

-- Should show 1 row
