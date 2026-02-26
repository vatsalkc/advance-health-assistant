-- SQL Script to fix ducho's missing doctor profile
-- Run this in Supabase SQL Editor

-- First, let's check if the doctor exists
SELECT * FROM doctors WHERE email = 'duchopatel@gmail.com';

-- If not found, insert the doctor profile
-- Note: You'll need to get the auth_id from auth.users table
-- Run this query first to get the auth_id:
SELECT id, email, created_at FROM auth.users WHERE email = 'duchopatel@gmail.com';

-- Then insert the doctor profile with the auth_id from above
-- Replace 'YOUR_AUTH_ID_HERE' with the actual auth_id from the query above
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
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'duchopatel@gmail.com'),
  'ducho',
  'duchopatel@gmail.com',
  '7894561230',
  'General Physician',
  'MBBS',
  'ESWP232XC',
  'Not specified',
  4.5,
  false,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  is_active = true,
  auth_id = EXCLUDED.auth_id,
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  specialization = EXCLUDED.specialization,
  qualification = EXCLUDED.qualification,
  license_number = EXCLUDED.license_number,
  experience = EXCLUDED.experience,
  updated_at = NOW();

-- Verify the doctor was created/updated
SELECT 
  id,
  name,
  email,
  specialization,
  is_active,
  is_verified,
  auth_id IS NOT NULL as has_auth_id,
  created_at
FROM doctors 
WHERE email = 'duchopatel@gmail.com';

-- Check total active doctors
SELECT COUNT(*) as total_active_doctors FROM doctors WHERE is_active = true;
