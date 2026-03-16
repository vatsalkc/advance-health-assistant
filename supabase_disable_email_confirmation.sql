-- Disable email confirmation requirement in Supabase
-- This allows users to login immediately after registration without email verification

-- NOTE: This is a configuration change that needs to be done in Supabase Dashboard
-- You cannot change this via SQL

-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to Authentication → Settings
-- 4. Scroll down to "Email Auth"
-- 5. Find "Enable email confirmations"
-- 6. UNCHECK the box "Enable email confirmations"
-- 7. Click "Save"

-- After this change, users can login immediately after registration
-- without needing to verify their email address

-- Alternative: If you want to keep email confirmation but auto-confirm users
-- You can use the Supabase Admin API or create a database trigger
-- But the easiest way is to disable email confirmation in the dashboard

COMMENT ON SCHEMA public IS 'To disable email confirmation, go to Supabase Dashboard → Authentication → Settings → Disable "Enable email confirmations"';
