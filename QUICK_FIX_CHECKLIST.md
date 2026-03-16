# Quick Fix Checklist ✅

## 🎯 Fix Appointment Booking (5 minutes)

### Step 1: Add Database Columns (2 min)
Go to **Supabase Dashboard** → **SQL Editor** → Run this:

```sql
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_name TEXT,
ADD COLUMN IF NOT EXISTS patient_phone TEXT;
```

Click **Run** ✅

### Step 2: Disable Email Confirmation (2 min)
1. **Supabase Dashboard** → **Authentication** → **Settings**
2. Scroll to **"Email Auth"**
3. **UNCHECK** "Enable email confirmations"
4. Click **Save** ✅

### Step 3: Restart App (1 min)
```bash
npm start
```
✅

## ✅ Done!

Now test:
1. Register a new user → Should login immediately
2. Book an appointment → Should work without errors

---

## 🐛 If Still Not Working:

### Check Browser Console (F12):
Look for error messages and share them

### Check Supabase Project:
Make sure it's not paused (Dashboard → Project Settings)

### Verify Columns Added:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'appointments';
```

Should see `patient_name` and `patient_phone` in the list

---

**That's it! Just 3 steps and everything should work!** 🚀
