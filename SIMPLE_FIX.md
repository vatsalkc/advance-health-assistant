# Simple Fix - 5 Steps

## 🚀 Fix Admin Login & Appointment Booking

### Step 1: Create Admin User (2 min)
1. Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add User"**
3. Email: `admin_aha@gmail.com`
4. Password: `Admin@123456`
5. ✅ Check **"Auto Confirm User"**
6. Click **"Create User"**
7. **COPY THE UUID** (from ID column)

### Step 2: Run This SQL (2 min)
Supabase → **SQL Editor** → Paste this (replace UUID):

```sql
-- Add columns
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_name TEXT,
ADD COLUMN IF NOT EXISTS patient_phone TEXT;

-- Create admin (REPLACE 'YOUR_UUID' WITH ACTUAL UUID!)
INSERT INTO public.admins (auth_id, name, email, role, is_active)
VALUES ('YOUR_UUID', 'Super Admin', 'admin_aha@gmail.com', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET auth_id = EXCLUDED.auth_id;

-- Fix policies
DROP POLICY IF EXISTS "Users can create own appointments" ON public.appointments;
CREATE POLICY "Users can create own appointments"
ON public.appointments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);
```

Click **Run** ✅

### Step 3: Disable Email Confirmation (1 min)
Supabase → **Authentication** → **Settings** → 
UNCHECK "Enable email confirmations" → **Save** ✅

### Step 4: Restart App (30 sec)
```bash
npm start
```

### Step 5: Test (30 sec)
- Admin Login: `admin_aha@gmail.com` / `Admin@123456` ✅
- Book Appointment: Should work! ✅

---

## ⚠️ IMPORTANT
In Step 2, you MUST replace `'YOUR_UUID'` with the actual UUID you copied in Step 1!

Example:
```sql
VALUES ('5c313f6d-d21b-41b9-ad3d-a9e7694ad4ae', 'Super Admin', ...
```

---

**That's it! 5 simple steps!** 🎉
