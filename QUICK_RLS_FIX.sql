-- ============================================
-- QUICK RLS FIX - Run this first!
-- This is the fastest way to fix most RLS issues
-- ============================================

-- Step 1: Sync users from auth to public
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

-- Step 2: Drop all existing policies
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename IN ('users', 'doctors', 'appointments')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Step 3: Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple policies for users
CREATE POLICY "users_select" ON public.users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "users_insert" ON public.users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Step 5: Create simple policies for doctors
CREATE POLICY "doctors_select" ON public.doctors FOR SELECT TO authenticated USING (true);
CREATE POLICY "doctors_update" ON public.doctors FOR UPDATE TO authenticated USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Step 6: Create simple policies for appointments
CREATE POLICY "appointments_select_user" ON public.appointments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "appointments_insert_user" ON public.appointments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "appointments_update_user" ON public.appointments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "appointments_select_doctor" ON public.appointments FOR SELECT TO authenticated USING (doctor_id IN (SELECT id FROM public.doctors WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())));
CREATE POLICY "appointments_update_doctor" ON public.appointments FOR UPDATE TO authenticated USING (doctor_id IN (SELECT id FROM public.doctors WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- Step 7: Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, UPDATE ON public.doctors TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.appointments TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Step 8: Verify
SELECT 
  '✅ QUICK FIX COMPLETE!' as status,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'appointments') as appointment_policies,
  (SELECT COUNT(*) FROM public.users) as total_users,
  (SELECT COUNT(*) FROM public.doctors WHERE is_active = true) as active_doctors;

-- Show what was created
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
