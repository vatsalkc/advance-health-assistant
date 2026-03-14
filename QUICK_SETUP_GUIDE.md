# Quick Setup Guide - Health Assistant

## 🚀 3-Step Setup

### Step 1: Run Database Migration (2 minutes)

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Go to **SQL Editor**
3. Copy and paste this SQL:

```sql
-- Add patient details to appointments
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

-- Create index
CREATE INDEX IF NOT EXISTS idx_appointments_patient_name ON public.appointments(patient_name);
```

4. Click **Run** or press `Ctrl+Enter`

### Step 2: Restart Your App (1 minute)

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm start
```

### Step 3: Clear Browser Cache (30 seconds)

- Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Select "Cached images and files"
- Click "Clear data"
- Refresh page (`F5`)

## ✅ You're Done!

### What's New:

1. **OTP Verification** - Phone verification when booking appointments
2. **Date/Time Validation** - Can't book past dates or times
3. **Patient Names Visible** - Doctors see actual patient names (not "Unknown")
4. **Admin Login** - Click "Admin Login" at bottom of login page

## 🎯 Quick Test

### Test OTP System:
1. Login as patient
2. Go to Appointments
3. Book an appointment
4. Enter OTP when prompted
5. Appointment created!

### Test Admin Portal:
1. Logout
2. Click "Admin Login"
3. Login with admin credentials
4. See admin dashboard!

## 🐛 Troubleshooting

**Don't see "Admin Login"?**
- Clear browser cache
- Hard refresh: `Ctrl+Shift+R`

**OTP not working?**
- Add phone number in your profile first
- Go to Profile → Edit → Add phone

**Doctor sees "Unknown"?**
- Run the database migration SQL (Step 1)
- Refresh the page

## 📚 Full Documentation

- **Admin Setup**: `ADMIN_SETUP_QUICK_START.md`
- **Latest Updates**: `docs/LATEST_UPDATES.md`
- **Admin Guide**: `docs/ADMIN_SYSTEM_GUIDE.md`

## 🎉 All Features

✅ Patient Registration & Login  
✅ Doctor Registration & Login  
✅ **Admin Portal** (NEW)  
✅ Symptom Checker with AI  
✅ Doctor Recommendations  
✅ **OTP Verified Appointments** (NEW)  
✅ **Date/Time Validation** (NEW)  
✅ Medicine Reminders  
✅ User History  
✅ **Doctor Approval System** (NEW)  
✅ **Rating Management** (NEW)  
✅ Dark Mode  
✅ AI Chatbot  

---

**Need Help?** Check `docs/LATEST_UPDATES.md` for detailed information!
