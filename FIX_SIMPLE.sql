-- ============================================
-- SIMPLE FIX - Run Each Step Separately
-- ============================================

-- ============================================
-- STEP 1: Add Missing Columns to Appointments
-- Copy and run this first
-- ============================================

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_name TEXT;

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_phone TEXT;


-- ============================================
-- STEP 2: Update Existing Appointments
-- Copy and run this second
-- ============================================

UPDATE public.appointments apt
SET 
  patient_name = u.name,
  patient_phone = u.phone
FROM public.users u
WHERE apt.user_id = u.id
AND apt.patient_name IS NULL;


-- ============================================
-- STEP 3: Confirm Admin Email (FIXED VERSION)
-- Copy and run this third
-- ============================================

UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'admin_aha@gmail.com'
AND email_confirmed_at IS NULL;


-- ============================================
-- STEP 4: Check if Admin User Exists
-- Copy and run this to see the admin UUID
-- ============================================

SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin_aha@gmail.com';

-- COPY THE 'id' (UUID) FROM THE RESULT ABOVE
-- You'll need it for the next step


-- ============================================
-- STEP 5: Create Admin Record
-- IMPORTANT: Replace 'YOUR_UUID_HERE' with the UUID from STEP 4
-- ============================================

INSERT INTO public.admins (auth_id, name, email, role, is_active)
VALUES ('YOUR_UUID_HERE', 'Super Admin', 'admin_aha@gmail.com', 'super_admin', true)
ON CONFLICT (email) 
DO UPDATE SET 
    auth_id = EXCLUDED.auth_id,
    is_active = true,
    role = 'super_admin';


-- ============================================
-- STEP 6: Fix RLS Policies
-- Copy and run this
-- ============================================

DROP POLICY IF EXISTS "Users can create own appointments" ON public.appointments;

CREATE POLICY "Users can create own appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);


-- ============================================
-- STEP 7: Verify Everything
-- Run this to check if everything worked
-- ============================================

-- Check admin exists
SELECT * FROM public.admins WHERE email = 'admin_aha@gmail.com';

-- Check columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'appointments' 
AND column_name IN ('patient_name', 'patient_phone');
