-- ============================================
-- COMPLETE RLS POLICY FIX FOR ALL TABLES
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- PART 1: SYNC AUTH USERS TO PUBLIC USERS
-- ============================================

-- First, ensure all authenticated users exist in public.users
INSERT INTO public.users (id, email, name, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', SPLIT_PART(au.email, '@', 1)),
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = COALESCE(public.users.name, EXCLUDED.name);

-- Verify sync
SELECT 
  COUNT(DISTINCT au.id) as auth_users,
  COUNT(DISTINCT pu.id) as public_users
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id;

-- ============================================
-- PART 2: FIX USERS TABLE RLS POLICIES
-- ============================================

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.users;

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own data
CREATE POLICY "Users can view their own data"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy: Users can insert their own data (for signup)
CREATE POLICY "Users can insert their own data"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update their own data"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- PART 3: FIX DOCTORS TABLE RLS POLICIES
-- ============================================

-- Drop existing policies on doctors table
DROP POLICY IF EXISTS "Anyone can view active doctors" ON public.doctors;
DROP POLICY IF EXISTS "Doctors can view their own data" ON public.doctors;
DROP POLICY IF EXISTS "Doctors can update their own data" ON public.doctors;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.doctors;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.doctors;
DROP POLICY IF EXISTS "Enable update for doctors based on email" ON public.doctors;

-- Enable RLS on doctors table
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone (authenticated) can view active doctors
CREATE POLICY "Anyone can view active doctors"
ON public.doctors
FOR SELECT
TO authenticated
USING (is_active = true OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Policy: Doctors can update their own profile
CREATE POLICY "Doctors can update their own data"
ON public.doctors
FOR UPDATE
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()))
WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- ============================================
-- PART 4: FIX APPOINTMENTS TABLE RLS POLICIES
-- ============================================

-- Drop ALL existing policies on appointments table
DROP POLICY IF EXISTS "Users can insert their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Doctors can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Doctors can update their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.appointments;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.appointments;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.appointments;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.appointments;

-- Enable RLS on appointments table
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can INSERT their own appointments
CREATE POLICY "Users can insert their own appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

-- Policy 2: Users can SELECT (view) their own appointments
CREATE POLICY "Users can view their own appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);

-- Policy 3: Users can UPDATE their own appointments (for cancellation, etc.)
CREATE POLICY "Users can update their own appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Doctors can SELECT appointments assigned to them
CREATE POLICY "Doctors can view their appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  doctor_id IN (
    SELECT id FROM public.doctors 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Policy 5: Doctors can UPDATE appointments assigned to them
CREATE POLICY "Doctors can update their appointments"
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
-- PART 5: FIX SYMPTOM_CHECKS TABLE RLS POLICIES
-- ============================================

-- Drop existing policies on symptom_checks table
DROP POLICY IF EXISTS "Users can view their own symptom checks" ON public.symptom_checks;
DROP POLICY IF EXISTS "Users can insert their own symptom checks" ON public.symptom_checks;
DROP POLICY IF EXISTS "Users can update their own symptom checks" ON public.symptom_checks;

-- Enable RLS on symptom_checks table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'symptom_checks') THEN
    ALTER TABLE public.symptom_checks ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Users can view their own symptom checks
    EXECUTE 'CREATE POLICY "Users can view their own symptom checks"
    ON public.symptom_checks
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id)';
    
    -- Policy: Users can insert their own symptom checks
    EXECUTE 'CREATE POLICY "Users can insert their own symptom checks"
    ON public.symptom_checks
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id)';
    
    -- Policy: Users can update their own symptom checks
    EXECUTE 'CREATE POLICY "Users can update their own symptom checks"
    ON public.symptom_checks
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id)';
  END IF;
END $$;

-- ============================================
-- PART 6: FIX MEDICINES TABLE RLS POLICIES
-- ============================================

-- Drop existing policies on medicines table
DROP POLICY IF EXISTS "Users can view their own medicines" ON public.medicines;
DROP POLICY IF EXISTS "Users can insert their own medicines" ON public.medicines;
DROP POLICY IF EXISTS "Users can update their own medicines" ON public.medicines;
DROP POLICY IF EXISTS "Users can delete their own medicines" ON public.medicines;

-- Enable RLS on medicines table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'medicines') THEN
    ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Users can view their own medicines
    EXECUTE 'CREATE POLICY "Users can view their own medicines"
    ON public.medicines
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id)';
    
    -- Policy: Users can insert their own medicines
    EXECUTE 'CREATE POLICY "Users can insert their own medicines"
    ON public.medicines
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id)';
    
    -- Policy: Users can update their own medicines
    EXECUTE 'CREATE POLICY "Users can update their own medicines"
    ON public.medicines
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id)';
    
    -- Policy: Users can delete their own medicines
    EXECUTE 'CREATE POLICY "Users can delete their own medicines"
    ON public.medicines
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id)';
  END IF;
END $$;

-- ============================================
-- PART 7: VERIFY ALL POLICIES
-- ============================================

-- Show all RLS policies for key tables
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || qual
    ELSE 'No USING clause'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check
    ELSE 'No WITH CHECK clause'
  END as with_check_clause
FROM pg_policies
WHERE tablename IN ('users', 'doctors', 'appointments', 'symptom_checks', 'medicines')
ORDER BY tablename, policyname;

-- ============================================
-- PART 8: TEST QUERIES
-- ============================================

-- Test 1: Check if current user can see their own data
SELECT 
  'Current User Data' as test_name,
  id,
  email,
  name
FROM public.users
WHERE id = auth.uid();

-- Test 2: Check if user can see active doctors
SELECT 
  'Active Doctors' as test_name,
  COUNT(*) as doctor_count
FROM public.doctors
WHERE is_active = true;

-- Test 3: Check user's appointments
SELECT 
  'User Appointments' as test_name,
  COUNT(*) as appointment_count
FROM public.appointments
WHERE user_id = auth.uid();

-- ============================================
-- PART 9: GRANT NECESSARY PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.doctors TO authenticated;
GRANT UPDATE ON public.doctors TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.appointments TO authenticated;

-- Grant permissions on sequences (for auto-increment IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- PART 10: FINAL VERIFICATION
-- ============================================

-- Check RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'doctors', 'appointments', 'symptom_checks', 'medicines')
ORDER BY tablename;

-- Count policies per table
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users', 'doctors', 'appointments', 'symptom_checks', 'medicines')
GROUP BY tablename
ORDER BY tablename;

-- Show sample appointments with user info
SELECT 
  a.id,
  a.user_id,
  u.email as user_email,
  a.patient_name,
  a.doctor_name,
  a.date,
  a.time,
  a.status
FROM public.appointments a
LEFT JOIN public.users u ON a.user_id = u.id
ORDER BY a.created_at DESC
LIMIT 5;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS POLICIES FIXED SUCCESSFULLY!';
  RAISE NOTICE '✅ All users synced from auth.users to public.users';
  RAISE NOTICE '✅ RLS policies created for users, doctors, and appointments';
  RAISE NOTICE '✅ Permissions granted to authenticated users';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next Steps:';
  RAISE NOTICE '1. Refresh your application (Ctrl+Shift+R)';
  RAISE NOTICE '2. Log out and log back in';
  RAISE NOTICE '3. Try booking an appointment';
  RAISE NOTICE '4. Check if data loads properly';
END $$;
