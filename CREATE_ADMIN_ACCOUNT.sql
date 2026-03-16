-- Create Admin Account - Complete Setup
-- Run these queries in Supabase SQL Editor

-- Step 1: Check if admin user exists in auth.users
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin_aha@gmail.com';

-- If the user doesn't exist or email is not confirmed, run this:
-- (Replace 'YOUR_UUID' with the actual UUID from the query above)

-- Step 2: Confirm the email if not confirmed
UPDATE auth.users
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'admin_aha@gmail.com';

-- Step 3: Get the user ID (UUID) - COPY THIS!
SELECT id FROM auth.users WHERE email = 'admin_aha@gmail.com';

-- Step 4: Insert into admins table
-- IMPORTANT: Replace 'PASTE_UUID_HERE' with the UUID from Step 3
INSERT INTO public.admins (auth_id, name, email, role, is_active)
VALUES ('PASTE_UUID_HERE', 'Super Admin', 'admin_aha@gmail.com', 'super_admin', true)
ON CONFLICT (email) DO UPDATE 
SET auth_id = EXCLUDED.auth_id,
    is_active = true;

-- Step 5: Verify admin was created
SELECT * FROM public.admins WHERE email = 'admin_aha@gmail.com';

-- If you see the admin record, you're done! ✅

-- ALTERNATIVE: If you want to create a NEW admin from scratch:
-- 1. Go to Authentication → Users in Supabase Dashboard
-- 2. Click "Add User"
-- 3. Email: admin_aha@gmail.com
-- 4. Password: Admin@123456 (or your choice)
-- 5. Check "Auto Confirm User"
-- 6. Click "Create User"
-- 7. Copy the UUID
-- 8. Run the INSERT query above with that UUID
