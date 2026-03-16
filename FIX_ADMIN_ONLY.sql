-- ============================================
-- Fix Admin Account Only
-- Use this if you only need to fix admin login
-- ============================================

-- STEP 1: First, find your admin user ID
-- Copy the result (UUID) from this query
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin_aha@gmail.com';

-- If you see a result, copy the 'id' (UUID)
-- If you DON'T see a result, you need to create the user first in Authentication → Users

-- ============================================
-- STEP 2: Confirm the admin email
-- Run this to make sure email is confirmed
-- ============================================

UPDATE auth.users
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'admin_aha@gmail.com';

-- ============================================
-- STEP 3: Create/Update Admin Record
-- IMPORTANT: Replace 'YOUR_UUID_HERE' with the UUID from STEP 1
-- ============================================

-- First, check if admin already exists
SELECT * FROM public.admins WHERE email = 'admin_aha@gmail.com';

-- If you see a result, run this UPDATE:
UPDATE public.admins
SET is_active = true,
    role = 'super_admin'
WHERE email = 'admin_aha@gmail.com';

-- If you DON'T see a result, run this INSERT (replace YOUR_UUID_HERE):
INSERT INTO public.admins (auth_id, name, email, role, is_active)
VALUES ('YOUR_UUID_HERE', 'Super Admin', 'admin_aha@gmail.com', 'super_admin', true);

-- ============================================
-- STEP 4: Verify Admin Account
-- Run this to check if admin is set up correctly
-- ============================================

SELECT 
    a.id,
    a.auth_id,
    a.name,
    a.email,
    a.role,
    a.is_active,
    u.email_confirmed_at
FROM public.admins a
LEFT JOIN auth.users u ON a.auth_id = u.id
WHERE a.email = 'admin_aha@gmail.com';

-- You should see:
-- - is_active = true
-- - role = super_admin
-- - email_confirmed_at = (some date/time, not null)
