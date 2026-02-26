-- ============================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- ============================================
-- This will fix doctor registration so they appear in patient list
-- Go to: https://supabase.com > Your Project > SQL Editor > New Query
-- Copy ALL of this and click RUN

-- ============================================
-- PART 1: Fix RLS Policies (For Future Registrations)
-- ============================================

-- Allow authenticated users to create doctor profiles
DROP POLICY IF EXISTS "Doctors can insert own profile" ON doctors;
DROP POLICY IF EXISTS "Authenticated users can create doctor profile" ON doctors;

CREATE POLICY "Authenticated users can create doctor profile" ON doctors
  FOR INSERT 
  WITH CHECK (auth.uid() = auth_id);

-- Allow anyone to view active doctors
DROP POLICY IF EXISTS "Anyone can view active verified doctors" ON doctors;
DROP POLICY IF EXISTS "Anyone can view active doctors" ON doctors;

CREATE POLICY "Anyone can view active doctors" ON doctors
  FOR SELECT 
  USING (is_active = true);

-- Allow doctors to view their own profile
DROP POLICY IF EXISTS "Doctors can view own profile" ON doctors;

CREATE POLICY "Doctors can view own profile" ON doctors
  FOR SELECT 
  USING (auth.uid() = auth_id);

-- ============================================
-- PART 2: Create Profile for Existing Doctor "ducho"
-- ============================================

INSERT INTO doctors (
  auth_id, name, email, phone, specialization, 
  qualification, license_number, experience, 
  rating, is_verified, is_active, created_at, updated_at
)
SELECT 
  id, 'ducho', 'duchopatel@gmail.com', '7894561230',
  'General Physician', 'MBBS', 'ESWP232XC', 'Not specified',
  4.5, false, true, NOW(), NOW()
FROM auth.users 
WHERE email = 'duchopatel@gmail.com'
ON CONFLICT (email) DO UPDATE SET
  auth_id = EXCLUDED.auth_id,
  is_active = true,
  updated_at = NOW();

-- ============================================
-- PART 3: Verify Everything Worked
-- ============================================

-- Check policies
SELECT 
  policyname,
  cmd
FROM pg_policies 
WHERE tablename = 'doctors'
ORDER BY cmd, policyname;

-- Check ducho's profile
SELECT 
  id, name, email, specialization, is_active, is_verified
FROM doctors 
WHERE email = 'duchopatel@gmail.com';

-- Check all active doctors (what patients see)
SELECT 
  id, name, email, specialization, is_active
FROM doctors 
WHERE is_active = true 
ORDER BY created_at DESC;

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- 1. Should see 3 policies created
-- 2. Should see ducho's profile with is_active = true
-- 3. Should see ducho in the list of active doctors
-- 
-- After this:
-- - Refresh patient page
-- - Go to Appointments tab
-- - Search for "ducho"
-- - Doctor should appear!
-- 
-- Future doctor registrations will work automatically!
-- ============================================
