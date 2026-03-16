-- Complete Fix for All Issues
-- Run this entire script in Supabase SQL Editor

-- ============================================
-- FIX 1: Add Missing Columns to Appointments
-- ============================================

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_name TEXT,
ADD COLUMN IF NOT EXISTS patient_phone TEXT;

-- Update existing appointments with patient data
UPDATE public.appointments apt
SET 
  patient_name = u.name,
  patient_phone = u.phone
FROM public.users u
WHERE apt.user_id = u.id
AND apt.patient_name IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient_name ON public.appointments(patient_name);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_phone ON public.appointments(patient_phone);

-- ============================================
-- FIX 2: Fix RLS Policies for Appointments
-- ============================================

-- Drop existing policies if they exist
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
-- FIX 3: Create Admin Account
-- ============================================

-- First, get the auth user ID
DO $$
DECLARE
    admin_uuid UUID;
BEGIN
    -- Get the UUID of the admin user from auth.users
    SELECT id INTO admin_uuid 
    FROM auth.users 
    WHERE email = 'admin_aha@gmail.com';
    
    -- If admin user exists in auth, create/update admin record
    IF admin_uuid IS NOT NULL THEN
        -- Confirm the email
        UPDATE auth.users
        SET email_confirmed_at = NOW(),
            confirmed_at = NOW()
        WHERE id = admin_uuid;
        
        -- Insert or update admin record
        INSERT INTO public.admins (auth_id, name, email, role, is_active)
        VALUES (admin_uuid, 'Super Admin', 'admin_aha@gmail.com', 'super_admin', true)
        ON CONFLICT (email) 
        DO UPDATE SET 
            auth_id = EXCLUDED.auth_id,
            is_active = true,
            role = 'super_admin';
            
        RAISE NOTICE 'Admin account created/updated successfully!';
    ELSE
        RAISE NOTICE 'Admin user not found in auth.users. Please create user first in Authentication → Users';
    END IF;
END $$;

-- ============================================
-- FIX 4: Verify Everything
-- ============================================

-- Check appointments table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'appointments'
ORDER BY ordinal_position;

-- Check admin account
SELECT * FROM public.admins WHERE email = 'admin_aha@gmail.com';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'appointments';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ All fixes applied successfully!';
    RAISE NOTICE '1. Appointments table updated with patient_name and patient_phone columns';
    RAISE NOTICE '2. RLS policies fixed for appointments';
    RAISE NOTICE '3. Admin account created/updated';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. If admin user does not exist, create it in Authentication → Users';
    RAISE NOTICE '2. Restart your application: npm start';
    RAISE NOTICE '3. Test appointment booking';
    RAISE NOTICE '4. Test admin login';
END $$;
