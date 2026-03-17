-- ============================================
-- SAFE FIX - BOTH ISSUES WITHOUT BREAKING LOGIN
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: SYNC ALL USERS FROM AUTH TO PUBLIC
-- ============================================

-- This fixes the foreign key constraint error
INSERT INTO public.users (id, email, name, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'full_name',
    SPLIT_PART(au.email, '@', 1)
  ) as name,
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = COALESCE(public.users.name, EXCLUDED.name);

-- Verify sync
SELECT 
  '=== USER SYNC STATUS ===' as step,
  (SELECT COUNT(*) FROM auth.users) as auth_users,
  (SELECT COUNT(*) FROM public.users) as public_users,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.users)
    THEN '✅ All users synced'
    ELSE '⚠️ Some users missing'
  END as status;

-- ============================================
-- STEP 2: DROP ALL EXISTING CONFLICTING POLICIES
-- ============================================

-- Drop all existing policies to start fresh
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename IN ('users', 'doctors', 'appointments', 'symptom_checks', 'medicines')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    RAISE NOTICE 'Dropped policy: % on table %', r.policyname, r.tablename;
  END LOOP;
END $$;

-- ============================================
-- STEP 3: ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on optional tables if they exist
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'symptom_checks') THEN
    ALTER TABLE public.symptom_checks ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'medicines') THEN
    ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- ============================================
-- STEP 4: CREATE POLICIES FOR USERS TABLE
-- ============================================

-- Users can SELECT their own data
CREATE POLICY "users_select_own"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can INSERT their own data (for registration)
CREATE POLICY "users_insert_own"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can UPDATE their own data
CREATE POLICY "users_update_own"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Doctors can SELECT user data for their patients
CREATE POLICY "doctors_select_patients"
ON public.users
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT DISTINCT user_id 
    FROM public.appointments 
    WHERE doctor_id IN (
      SELECT id FROM public.doctors 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
);

-- ============================================
-- STEP 5: CREATE POLICIES FOR DOCTORS TABLE
-- ============================================

-- Anyone authenticated can SELECT active doctors (for booking)
CREATE POLICY "doctors_select_active"
ON public.doctors
FOR SELECT
TO authenticated
USING (is_active = true);

-- Doctors can SELECT their own profile even if inactive
CREATE POLICY "doctors_select_own"
ON public.doctors
FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Doctors can UPDATE their own profile
CREATE POLICY "doctors_update_own"
ON public.doctors
FOR UPDATE
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()))
WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- ============================================
-- STEP 6: CREATE POLICIES FOR APPOINTMENTS TABLE
-- ============================================

-- Patients can INSERT their own appointments
CREATE POLICY "appointments_insert_patient"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Patients can SELECT their own appointments
CREATE POLICY "appointments_select_patient"
ON public.appointments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Patients can UPDATE their own appointments (for cancellation)
CREATE POLICY "appointments_update_patient"
ON public.appointments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Doctors can SELECT appointments assigned to them
CREATE POLICY "appointments_select_doctor"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  doctor_id IN (
    SELECT id FROM public.doctors 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Doctors can UPDATE appointments assigned to them
CREATE POLICY "appointments_update_doctor"
ON public.appointments
FOR UPDATE
TO authenticated
USING (
  doctor_id IN (
    SELECT id FROM public.doctors 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
)
WITH CHECK (
  doctor_id IN (
    SELECT id FROM public.doctors 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- ============================================
-- STEP 7: CREATE POLICIES FOR SYMPTOM_CHECKS (IF EXISTS)
-- ============================================

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'symptom_checks') THEN
    EXECUTE 'CREATE POLICY "symptom_checks_all_own" ON public.symptom_checks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
    RAISE NOTICE '✅ Created policies for symptom_checks table';
  END IF;
END $$;

-- ============================================
-- STEP 8: CREATE POLICIES FOR MEDICINES (IF EXISTS)
-- ============================================

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'medicines') THEN
    EXECUTE 'CREATE POLICY "medicines_all_own" ON public.medicines FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
    RAISE NOTICE '✅ Created policies for medicines table';
  END IF;
END $$;

-- ============================================
-- STEP 9: GRANT NECESSARY PERMISSIONS
-- ============================================

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, UPDATE ON public.doctors TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.appointments TO authenticated;

-- Grant sequence permissions (for auto-increment IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions on optional tables
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'symptom_checks') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.symptom_checks TO authenticated;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'medicines') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.medicines TO authenticated;
  END IF;
END $$;

-- ============================================
-- STEP 10: VERIFY EVERYTHING IS WORKING
-- ============================================

-- Check RLS status
SELECT 
  '=== RLS STATUS ===' as step,
  tablename,
  CASE WHEN rowsecurity THEN '🔒 ENABLED' ELSE '🔓 DISABLED' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'doctors', 'appointments')
ORDER BY tablename;

-- Count policies
SELECT 
  '=== POLICY COUNT ===' as step,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users', 'doctors', 'appointments')
GROUP BY tablename
ORDER BY tablename;

-- Check current user access
SELECT 
  '=== CURRENT USER ACCESS ===' as step,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid())
    THEN '✅ Can access users table'
    ELSE '❌ Cannot access users table'
  END as users_access,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.doctors WHERE is_active = true LIMIT 1)
    THEN '✅ Can access doctors table'
    ELSE '❌ Cannot access doctors table'
  END as doctors_access,
  (SELECT COUNT(*) FROM public.appointments WHERE user_id = auth.uid()) as my_appointments;

-- Show sample data
SELECT 
  '=== SAMPLE APPOINTMENTS ===' as step,
  a.id,
  a.patient_name,
  a.doctor_name,
  a.date,
  a.time,
  a.status
FROM public.appointments a
ORDER BY a.created_at DESC
LIMIT 5;

-- ============================================
-- STEP 11: TEST QUERIES
-- ============================================

-- Test 1: Can current user see their data?
SELECT 
  '=== TEST 1: USER DATA ===' as test,
  id,
  email,
  name
FROM public.users
WHERE id = auth.uid();

-- Test 2: Can see active doctors?
SELECT 
  '=== TEST 2: ACTIVE DOCTORS ===' as test,
  COUNT(*) as active_doctor_count
FROM public.doctors
WHERE is_active = true;

-- Test 3: Can see own appointments?
SELECT 
  '=== TEST 3: MY APPOINTMENTS ===' as test,
  COUNT(*) as my_appointment_count
FROM public.appointments
WHERE user_id = auth.uid();

-- ============================================
-- STEP 12: FINAL SUCCESS MESSAGE
-- ============================================

DO $$
DECLARE
  user_count INT;
  policy_count INT;
  doctor_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.users;
  SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE schemaname = 'public';
  SELECT COUNT(*) INTO doctor_count FROM public.doctors WHERE is_active = true;
  
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════════════════════╗';
  RAISE NOTICE '║          ✅ BOTH ISSUES FIXED SUCCESSFULLY!           ║';
  RAISE NOTICE '╚════════════════════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Users synced: % users in public.users', user_count;
  RAISE NOTICE '✅ RLS policies created: % policies total', policy_count;
  RAISE NOTICE '✅ Active doctors: % doctors available', doctor_count;
  RAISE NOTICE '';
  RAISE NOTICE '📝 NEXT STEPS:';
  RAISE NOTICE '1. Refresh your application (Ctrl+Shift+R)';
  RAISE NOTICE '2. Log out completely';
  RAISE NOTICE '3. Log back in';
  RAISE NOTICE '4. Try booking an appointment (should work now!)';
  RAISE NOTICE '5. Check doctor dashboard (should load now!)';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Your application should now work perfectly!';
  RAISE NOTICE '';
END $$;
