-- ============================================
-- DIAGNOSE RLS POLICY ISSUES
-- Run this to identify what's causing the RLS errors
-- ============================================

-- ============================================
-- PART 1: CHECK CURRENT USER
-- ============================================

SELECT 
  '=== CURRENT USER INFO ===' as section,
  auth.uid() as current_user_id,
  (SELECT email FROM auth.users WHERE id = auth.uid()) as current_user_email;

-- ============================================
-- PART 2: CHECK USER SYNC STATUS
-- ============================================

SELECT 
  '=== USER SYNC STATUS ===' as section,
  COUNT(DISTINCT au.id) as auth_users_count,
  COUNT(DISTINCT pu.id) as public_users_count,
  COUNT(DISTINCT au.id) - COUNT(DISTINCT pu.id) as missing_users
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id;

-- Show missing users
SELECT 
  '=== MISSING USERS IN PUBLIC.USERS ===' as section,
  au.id,
  au.email,
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
LIMIT 10;

-- ============================================
-- PART 3: CHECK RLS STATUS
-- ============================================

SELECT 
  '=== RLS STATUS ===' as section,
  tablename,
  CASE 
    WHEN rowsecurity THEN '🔒 ENABLED'
    ELSE '🔓 DISABLED'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'doctors', 'appointments', 'symptom_checks', 'medicines')
ORDER BY tablename;

-- ============================================
-- PART 4: CHECK EXISTING POLICIES
-- ============================================

SELECT 
  '=== EXISTING RLS POLICIES ===' as section,
  tablename,
  policyname,
  cmd as operation,
  roles,
  permissive
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users', 'doctors', 'appointments', 'symptom_checks', 'medicines')
ORDER BY tablename, cmd, policyname;

-- Count policies per table
SELECT 
  '=== POLICY COUNT PER TABLE ===' as section,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users', 'doctors', 'appointments', 'symptom_checks', 'medicines')
GROUP BY tablename
ORDER BY tablename;

-- ============================================
-- PART 5: CHECK CURRENT USER'S DATA ACCESS
-- ============================================

-- Check if current user exists in public.users
SELECT 
  '=== CURRENT USER IN PUBLIC.USERS ===' as section,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()) 
    THEN '✅ User exists'
    ELSE '❌ User NOT found'
  END as user_status,
  (SELECT name FROM public.users WHERE id = auth.uid()) as user_name,
  (SELECT email FROM public.users WHERE id = auth.uid()) as user_email;

-- Check if current user is a doctor
SELECT 
  '=== CURRENT USER AS DOCTOR ===' as section,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.doctors 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    ) 
    THEN '✅ User is a doctor'
    ELSE '❌ User is NOT a doctor'
  END as doctor_status,
  (SELECT name FROM public.doctors WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())) as doctor_name,
  (SELECT specialization FROM public.doctors WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())) as specialization;

-- ============================================
-- PART 6: CHECK APPOINTMENTS ACCESS
-- ============================================

-- Try to count user's appointments
SELECT 
  '=== USER APPOINTMENTS ACCESS ===' as section,
  COUNT(*) as appointment_count,
  COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN status = 'Confirmed' THEN 1 END) as confirmed_count,
  COUNT(CASE WHEN status = 'Rejected' THEN 1 END) as rejected_count
FROM public.appointments
WHERE user_id = auth.uid();

-- Try to count doctor's appointments (if user is a doctor)
SELECT 
  '=== DOCTOR APPOINTMENTS ACCESS ===' as section,
  COUNT(*) as appointment_count,
  COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN status = 'Confirmed' THEN 1 END) as confirmed_count
FROM public.appointments
WHERE doctor_id IN (
  SELECT id FROM public.doctors 
  WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- ============================================
-- PART 7: CHECK DOCTORS TABLE ACCESS
-- ============================================

-- Try to count visible doctors
SELECT 
  '=== DOCTORS TABLE ACCESS ===' as section,
  COUNT(*) as total_doctors,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_doctors,
  COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_doctors
FROM public.doctors;

-- ============================================
-- PART 8: CHECK FOREIGN KEY CONSTRAINTS
-- ============================================

SELECT 
  '=== FOREIGN KEY CONSTRAINTS ===' as section,
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

-- ============================================
-- PART 9: CHECK ORPHANED APPOINTMENTS
-- ============================================

SELECT 
  '=== ORPHANED APPOINTMENTS ===' as section,
  COUNT(*) as orphaned_count
FROM public.appointments a
LEFT JOIN public.users u ON a.user_id = u.id
WHERE u.id IS NULL;

-- Show orphaned appointments
SELECT 
  '=== ORPHANED APPOINTMENT DETAILS ===' as section,
  a.id,
  a.user_id,
  a.patient_name,
  a.date,
  a.status
FROM public.appointments a
LEFT JOIN public.users u ON a.user_id = u.id
WHERE u.id IS NULL
LIMIT 5;

-- ============================================
-- PART 10: CHECK PERMISSIONS
-- ============================================

SELECT 
  '=== TABLE PERMISSIONS ===' as section,
  grantee,
  table_name,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('users', 'doctors', 'appointments')
  AND grantee IN ('authenticated', 'anon', 'postgres')
ORDER BY table_name, grantee, privilege_type;

-- ============================================
-- PART 11: SAMPLE DATA CHECK
-- ============================================

-- Show recent appointments (if accessible)
SELECT 
  '=== RECENT APPOINTMENTS ===' as section,
  a.id,
  a.user_id,
  a.patient_name,
  a.doctor_name,
  a.date,
  a.time,
  a.status,
  CASE 
    WHEN u.id IS NOT NULL THEN '✅ User exists'
    ELSE '❌ User missing'
  END as user_status
FROM public.appointments a
LEFT JOIN public.users u ON a.user_id = u.id
ORDER BY a.created_at DESC
LIMIT 5;

-- ============================================
-- SUMMARY AND RECOMMENDATIONS
-- ============================================

DO $$
DECLARE
  missing_users INT;
  rls_enabled_count INT;
  policy_count INT;
  orphaned_count INT;
BEGIN
  -- Count missing users
  SELECT COUNT(*) INTO missing_users
  FROM auth.users au
  LEFT JOIN public.users pu ON au.id = pu.id
  WHERE pu.id IS NULL;
  
  -- Count tables with RLS enabled
  SELECT COUNT(*) INTO rls_enabled_count
  FROM pg_tables
  WHERE schemaname = 'public'
    AND tablename IN ('users', 'doctors', 'appointments')
    AND rowsecurity = true;
  
  -- Count policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN ('users', 'doctors', 'appointments');
  
  -- Count orphaned appointments
  SELECT COUNT(*) INTO orphaned_count
  FROM public.appointments a
  LEFT JOIN public.users u ON a.user_id = u.id
  WHERE u.id IS NULL;
  
  RAISE NOTICE '';
  RAISE NOTICE '=== DIAGNOSIS SUMMARY ===';
  RAISE NOTICE '';
  
  IF missing_users > 0 THEN
    RAISE NOTICE '❌ ISSUE: % users in auth.users are missing from public.users', missing_users;
    RAISE NOTICE '   FIX: Run the user sync query from FIX_RLS_POLICIES_COMPLETE.sql';
  ELSE
    RAISE NOTICE '✅ All auth users are synced to public.users';
  END IF;
  
  IF rls_enabled_count = 0 THEN
    RAISE NOTICE '⚠️  WARNING: RLS is disabled on all tables';
    RAISE NOTICE '   This means no security policies are enforced';
  ELSIF rls_enabled_count < 3 THEN
    RAISE NOTICE '⚠️  WARNING: RLS is only enabled on % out of 3 key tables', rls_enabled_count;
  ELSE
    RAISE NOTICE '✅ RLS is enabled on all key tables';
  END IF;
  
  IF policy_count = 0 THEN
    RAISE NOTICE '❌ ISSUE: No RLS policies found';
    RAISE NOTICE '   FIX: Run FIX_RLS_POLICIES_COMPLETE.sql to create policies';
  ELSIF policy_count < 10 THEN
    RAISE NOTICE '⚠️  WARNING: Only % policies found (expected ~10+)', policy_count;
    RAISE NOTICE '   FIX: Run FIX_RLS_POLICIES_COMPLETE.sql to create missing policies';
  ELSE
    RAISE NOTICE '✅ RLS policies are configured (% policies)', policy_count;
  END IF;
  
  IF orphaned_count > 0 THEN
    RAISE NOTICE '❌ ISSUE: % appointments have invalid user_id references', orphaned_count;
    RAISE NOTICE '   FIX: Run the user sync query first';
  ELSE
    RAISE NOTICE '✅ No orphaned appointments found';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '=== RECOMMENDED ACTIONS ===';
  RAISE NOTICE '';
  
  IF missing_users > 0 OR orphaned_count > 0 THEN
    RAISE NOTICE '1. Run FIX_RLS_POLICIES_COMPLETE.sql (syncs users and fixes policies)';
  END IF;
  
  IF policy_count < 10 THEN
    RAISE NOTICE '2. Run FIX_RLS_POLICIES_COMPLETE.sql (creates all necessary policies)';
  END IF;
  
  IF rls_enabled_count = 0 THEN
    RAISE NOTICE '3. For testing only: Run DISABLE_RLS_FOR_TESTING.sql';
    RAISE NOTICE '   (Then re-enable with FIX_RLS_POLICIES_COMPLETE.sql later)';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '4. After running fixes:';
  RAISE NOTICE '   - Refresh your application (Ctrl+Shift+R)';
  RAISE NOTICE '   - Log out and log back in';
  RAISE NOTICE '   - Test appointment booking';
  
END $$;
