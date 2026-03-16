-- ============================================
-- STEP 1: Add Missing Columns to Appointments
-- Run this first
-- ============================================

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_name TEXT,
ADD COLUMN IF NOT EXISTS patient_phone TEXT;

-- ============================================
-- STEP 2: Update Existing Appointments
-- Run this after Step 1
-- ============================================

UPDATE public.appointments apt
SET 
  patient_name = u.name,
  patient_phone = u.phone
FROM public.users u
WHERE apt.user_id = u.id
AND apt.patient_name IS NULL;

-- ============================================
-- STEP 3: Create Indexes
-- Run this after Step 2
-- ============================================

CREATE INDEX IF NOT EXISTS idx_appointments_patient_name ON public.appointments(patient_name);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_phone ON public.appointments(patient_phone);

-- ============================================
-- STEP 4: Fix RLS Policies
-- Run this after Step 3
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete own appointments" ON public.appointments;

-- Create new policies
CREATE POLICY "Users can create own appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- STEP 5: Verify Everything
-- Run this to check if everything worked
-- ============================================

-- Check appointments table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'appointments'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'appointments';
