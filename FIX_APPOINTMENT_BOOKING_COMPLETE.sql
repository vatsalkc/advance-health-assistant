-- ============================================
-- COMPLETE FIX FOR APPOINTMENT BOOKING ISSUES
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Check current appointments table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'appointments'
ORDER BY ordinal_position;

-- Step 2: Check foreign key constraints
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'appointments' 
  AND tc.constraint_type = 'FOREIGN KEY';

-- Step 3: Check if there are any orphaned appointments (user_id not in users table)
SELECT 
  a.id,
  a.user_id,
  a.patient_name,
  a.date,
  a.status,
  CASE 
    WHEN u.id IS NULL THEN 'User not found in users table'
    ELSE 'User exists'
  END as user_status
FROM public.appointments a
LEFT JOIN public.users u ON a.user_id = u.id
WHERE u.id IS NULL;

-- Step 4: Check auth.users vs public.users sync
SELECT 
  COUNT(DISTINCT au.id) as auth_users_count,
  COUNT(DISTINCT pu.id) as public_users_count,
  COUNT(DISTINCT au.id) - COUNT(DISTINCT pu.id) as missing_in_public
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id;

-- Step 5: Sync missing users from auth.users to public.users
-- This ensures all authenticated users exist in the public.users table
INSERT INTO public.users (id, email, name, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', au.email),
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 6: Verify the sync worked
SELECT 
  COUNT(*) as total_auth_users,
  (SELECT COUNT(*) FROM public.users) as total_public_users
FROM auth.users;

-- Step 7: Check RLS policies on appointments table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'appointments';

-- Step 8: Drop and recreate RLS policies for appointments
-- This ensures users can insert their own appointments
DROP POLICY IF EXISTS "Users can insert their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Doctors can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Doctors can update their appointments" ON public.appointments;

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own appointments
CREATE POLICY "Users can insert their own appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own appointments
CREATE POLICY "Users can view their own appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can update their own appointments
CREATE POLICY "Users can update their own appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Doctors can view their appointments
CREATE POLICY "Doctors can view their appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  doctor_id IN (
    SELECT id FROM public.doctors WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Policy: Doctors can update their appointments
CREATE POLICY "Doctors can update their appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (
  doctor_id IN (
    SELECT id FROM public.doctors WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
)
WITH CHECK (
  doctor_id IN (
    SELECT id FROM public.doctors WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Step 9: Verify RLS policies are created
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'appointments'
ORDER BY policyname;

-- Step 10: Test appointment insertion (replace with actual values)
-- This is a test query - comment out if not needed
/*
INSERT INTO public.appointments (
  user_id,
  doctor_id,
  doctor_name,
  patient_name,
  patient_phone,
  specialization,
  date,
  time,
  reason,
  status
) VALUES (
  auth.uid(), -- Current user's ID
  1, -- Replace with actual doctor_id
  'Test Doctor',
  'Test Patient',
  '1234567890',
  'General',
  CURRENT_DATE + INTERVAL '1 day',
  '10:00:00',
  'Test appointment',
  'Pending'
);
*/

-- Step 11: Show recent appointments with user info
SELECT 
  a.id,
  a.user_id,
  a.patient_name,
  u.email as user_email,
  a.doctor_name,
  a.date,
  a.time,
  a.status,
  a.created_at
FROM public.appointments a
LEFT JOIN public.users u ON a.user_id = u.id
ORDER BY a.created_at DESC
LIMIT 10;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if all appointments have valid user_ids
SELECT 
  COUNT(*) as total_appointments,
  COUNT(CASE WHEN u.id IS NOT NULL THEN 1 END) as with_valid_user,
  COUNT(CASE WHEN u.id IS NULL THEN 1 END) as with_invalid_user
FROM public.appointments a
LEFT JOIN public.users u ON a.user_id = u.id;

-- Show appointments grouped by status
SELECT 
  status,
  COUNT(*) as count,
  COUNT(CASE WHEN date = CURRENT_DATE THEN 1 END) as today_count
FROM public.appointments
GROUP BY status
ORDER BY status;
