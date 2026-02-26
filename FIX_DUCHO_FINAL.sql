-- FINAL FIX FOR DUCHO DOCTOR PROFILE
-- Run this in Supabase SQL Editor

-- Step 1: Check if ducho's auth account exists
SELECT 
  id as auth_id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users 
WHERE email = 'duchopatel@gmail.com';

-- Step 2: Check if doctor profile exists
SELECT * FROM doctors WHERE email = 'duchopatel@gmail.com';

-- Step 3: Insert doctor profile (this will work because we're using service role)
-- Get the auth_id from Step 1 and replace it below
INSERT INTO doctors (
  auth_id,
  name,
  email,
  phone,
  specialization,
  qualification,
  license_number,
  experience,
  rating,
  is_verified,
  is_active,
  created_at,
  updated_at
)
SELECT 
  id,  -- auth_id from auth.users
  'ducho',
  'duchopatel@gmail.com',
  '7894561230',
  'General Physician',
  'MBBS',
  'ESWP232XC',
  'Not specified',
  4.5,
  true,  -- Set to true so it appears in user list
  true,
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'duchopatel@gmail.com'
ON CONFLICT (email) DO UPDATE SET
  auth_id = EXCLUDED.auth_id,
  is_active = true,
  is_verified = true,  -- Important: must be true to show in user list
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  specialization = EXCLUDED.specialization,
  qualification = EXCLUDED.qualification,
  license_number = EXCLUDED.license_number,
  experience = EXCLUDED.experience,
  updated_at = NOW();

-- Step 4: Verify the doctor was created
SELECT 
  id,
  name,
  email,
  specialization,
  phone,
  qualification,
  license_number,
  is_active,
  is_verified,
  auth_id IS NOT NULL as has_auth_id,
  created_at
FROM doctors 
WHERE email = 'duchopatel@gmail.com';

-- Step 5: Check if doctor appears in the query used by the app
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
  is_active
FROM doctors 
WHERE is_active = true
ORDER BY created_at DESC;

-- Step 6: Count total active doctors
SELECT COUNT(*) as total_active_doctors FROM doctors WHERE is_active = true;
