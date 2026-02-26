-- Fix RLS Policies to Allow Doctor Registration from Website
-- This will allow doctors to register and automatically appear in patient list

-- ============================================
-- STEP 1: Update RLS Policy for Doctor INSERT
-- ============================================

-- Drop the old restrictive INSERT policy
DROP POLICY IF EXISTS "Doctors can insert own profile" ON doctors;

-- Create new policy that allows authenticated users to insert their own profile
CREATE POLICY "Authenticated users can create doctor profile" ON doctors
  FOR INSERT 
  WITH CHECK (auth.uid() = auth_id);

-- ============================================
-- STEP 2: Update RLS Policy for Doctor SELECT
-- ============================================

-- Drop the old policy that required is_verified = true
DROP POLICY IF EXISTS "Anyone can view active verified doctors" ON doctors;
DROP POLICY IF EXISTS "Anyone can view active doctors" ON doctors;

-- Create new policy that shows ALL active doctors (verified or not)
CREATE POLICY "Anyone can view active doctors" ON doctors
  FOR SELECT 
  USING (is_active = true);

-- Keep the policy for doctors to view their own profile
-- (This already exists, but let's make sure)
DROP POLICY IF EXISTS "Doctors can view own profile" ON doctors;
CREATE POLICY "Doctors can view own profile" ON doctors
  FOR SELECT 
  USING (auth.uid() = auth_id);

-- ============================================
-- STEP 3: Verify Policies
-- ============================================

-- Check all policies on doctors table
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'doctors'
ORDER BY cmd, policyname;

-- ============================================
-- STEP 4: Test Query (Same as App Uses)
-- ============================================

-- This should return all active doctors
SELECT 
  id,
  name,
  email,
  specialization,
  experience,
  qualification,
  license_number,
  phone,
  rating,
  is_verified,
  is_active,
  created_at
FROM doctors 
WHERE is_active = true 
ORDER BY created_at DESC;

-- ============================================
-- EXPECTED RESULT
-- ============================================

-- After running this:
-- ✓ Doctors can register from website
-- ✓ Profile is automatically created
-- ✓ Doctor appears in patient appointment list immediately
-- ✓ No manual SQL needed for each registration
