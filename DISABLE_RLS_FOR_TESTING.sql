-- ============================================
-- DISABLE RLS FOR TESTING (TEMPORARY SOLUTION)
-- ⚠️ WARNING: This removes security - use only for testing!
-- ⚠️ DO NOT use in production!
-- ============================================

-- This script temporarily disables RLS to help you test
-- Once everything works, run FIX_RLS_POLICIES_COMPLETE.sql

-- ============================================
-- STEP 1: SYNC USERS FIRST
-- ============================================

-- Sync auth.users to public.users
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

-- ============================================
-- STEP 2: DISABLE RLS ON ALL TABLES
-- ============================================

-- Disable RLS on users table
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Disable RLS on doctors table
ALTER TABLE public.doctors DISABLE ROW LEVEL SECURITY;

-- Disable RLS on appointments table
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;

-- Disable RLS on symptom_checks table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'symptom_checks') THEN
    ALTER TABLE public.symptom_checks DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Disable RLS on medicines table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'medicines') THEN
    ALTER TABLE public.medicines DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- ============================================
-- STEP 3: GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant all permissions on tables
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.doctors TO authenticated;
GRANT ALL ON public.appointments TO authenticated;

-- Grant permissions on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- STEP 4: VERIFY
-- ============================================

-- Check RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'doctors', 'appointments', 'symptom_checks', 'medicines')
ORDER BY tablename;

-- Show recent appointments
SELECT 
  a.id,
  a.user_id,
  a.patient_name,
  a.doctor_name,
  a.date,
  a.time,
  a.status
FROM public.appointments a
ORDER BY a.created_at DESC
LIMIT 5;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '⚠️  RLS DISABLED FOR TESTING';
  RAISE NOTICE '✅ All users synced';
  RAISE NOTICE '✅ Permissions granted';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next Steps:';
  RAISE NOTICE '1. Refresh your application';
  RAISE NOTICE '2. Test appointment booking';
  RAISE NOTICE '3. Test data loading';
  RAISE NOTICE '4. Once working, run FIX_RLS_POLICIES_COMPLETE.sql to re-enable security';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANT: Re-enable RLS before going to production!';
END $$;
