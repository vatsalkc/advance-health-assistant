# Step-by-Step Fix Guide

## 🎯 Fix Both Issues in 10 Minutes

### Issue 1: Admin Login - "Admin profile not found"
### Issue 2: Cannot Book Appointments

---

## 📋 Step 1: Create Admin User in Supabase (3 minutes)

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click **Authentication** in the left sidebar
4. Click **Users** tab
5. Click **"Add User"** button (green button, top right)
6. Fill in the form:
   ```
   Email: admin_aha@gmail.com
   Password: Admin@123456
   ```
7. ✅ **IMPORTANT**: Check the box **"Auto Confirm User"**
8. Click **"Create User"**
9. **Copy the UUID** from the users list (it's in the ID column)
   - It looks like: `5c313f6d-d21b-41b9-ad3d-a9e7694ad4ae`

---

## 📋 Step 2: Run SQL Script (3 minutes)

1. Go to **SQL Editor** in Supabase (left sidebar)
2. Click **"New Query"**
3. Copy and paste this ENTIRE script:

```sql
-- Fix All Issues Script
-- Replace 'YOUR_UUID_HERE' with the UUID you copied in Step 1

-- Add missing columns to appointments
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_name TEXT,
ADD COLUMN IF NOT EXISTS patient_phone TEXT;

-- Update existing appointments
UPDATE public.appointments apt
SET 
  patient_name = u.name,
  patient_phone = u.phone
FROM public.users u
WHERE apt.user_id = u.id
AND apt.patient_name IS NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_appointments_patient_name ON public.appointments(patient_name);

-- Fix RLS policies
DROP POLICY IF EXISTS "Users can create own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete own appointments" ON public.appointments;

CREATE POLICY "Users can create own appointments"
ON public.appointments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own appointments"
ON public.appointments FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
ON public.appointments FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments"
ON public.appointments FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Create admin account
-- ⚠️ REPLACE 'YOUR_UUID_HERE' WITH THE UUID YOU COPIED!
INSERT INTO public.admins (auth_id, name, email, role, is_active)
VALUES ('YOUR_UUID_HERE', 'Super Admin', 'admin_aha@gmail.com', 'super_admin', true)
ON CONFLICT (email) DO UPDATE 
SET auth_id = EXCLUDED.auth_id, is_active = true;

-- Verify admin created
SELECT * FROM public.admins WHERE email = 'admin_aha@gmail.com';
```

4. **IMPORTANT**: Replace `'YOUR_UUID_HERE'` with the actual UUID you copied
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see "Success" message

---

## 📋 Step 3: Disable Email Confirmation (2 minutes)

1. Still in Supabase Dashboard
2. Go to **Authentication** → **Settings**
3. Scroll down to **"Email Auth"** section
4. Find **"Enable email confirmations"**
5. **UNCHECK** the box
6. Click **"Save"** at the bottom

---

## 📋 Step 4: Restart Your App (1 minute)

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

---

## ✅ Step 5: Test Everything (2 minutes)

### Test Admin Login:

1. Open your app: http://localhost:3000
2. You should see **"Admin Login"** button (red) at bottom
3. Click it
4. Enter:
   ```
   Email: admin_aha@gmail.com
   Password: Admin@123456
   ```
5. Click **"Login as Admin"**
6. Should see admin dashboard! ✅

### Test Appointment Booking:

1. Logout from admin
2. Login as a regular patient
3. Go to **Appointments** page
4. Click on any doctor
5. Fill in:
   - Date: Tomorrow's date
   - Time: Any time
   - Reason: "Test booking"
6. Click **"Confirm Booking"**
7. Should see success message! ✅

---

## 🐛 Troubleshooting

### Admin Login Still Not Working?

**Check if admin was created:**
```sql
SELECT * FROM public.admins WHERE email = 'admin_aha@gmail.com';
```

If no results:
- Make sure you replaced `YOUR_UUID_HERE` with actual UUID
- Make sure UUID matches the one in Authentication → Users
- Run the INSERT query again with correct UUID

**Check if email is confirmed:**
```sql
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin_aha@gmail.com';
```

If `email_confirmed_at` is NULL:
```sql
UPDATE auth.users
SET email_confirmed_at = NOW(), confirmed_at = NOW()
WHERE email = 'admin_aha@gmail.com';
```

### Appointment Booking Still Not Working?

**Check if columns exist:**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'appointments' 
AND column_name IN ('patient_name', 'patient_phone');
```

Should return 2 rows. If not, run:
```sql
ALTER TABLE public.appointments 
ADD COLUMN patient_name TEXT,
ADD COLUMN patient_phone TEXT;
```

**Check RLS policies:**
```sql
SELECT policyname FROM pg_policies 
WHERE tablename = 'appointments';
```

Should see 4 policies. If not, run the CREATE POLICY commands again.

**Check browser console (F12):**
- Look for error messages
- Share the error if you see one

---

## 📞 Quick Reference

### Admin Credentials:
```
Email: admin_aha@gmail.com
Password: Admin@123456
```

### SQL to Check Admin:
```sql
SELECT * FROM public.admins WHERE email = 'admin_aha@gmail.com';
```

### SQL to Check Appointments Table:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'appointments';
```

---

## 🎉 Success Checklist

- ✅ Admin user created in Authentication
- ✅ Admin record created in admins table
- ✅ Email confirmation disabled
- ✅ Appointments table has patient_name and patient_phone columns
- ✅ RLS policies created
- ✅ App restarted
- ✅ Admin login works
- ✅ Appointment booking works

---

**If you follow all 5 steps exactly, everything will work!** 🚀

**Still having issues?** Share:
1. The error message from browser console (F12)
2. Screenshot of the error
3. Result of: `SELECT * FROM public.admins WHERE email = 'admin_aha@gmail.com';`
