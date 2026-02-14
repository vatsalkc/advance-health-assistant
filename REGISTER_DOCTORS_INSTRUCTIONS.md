# 🏥 Register All Doctors - Instructions

## 🚀 Quick Method: Use the Registration Script

I've created a script that will register all 15 sample doctors automatically.

---

## 📋 Option 1: Run the Node.js Script (Recommended)

### Step 1: Install Dependencies (if not already installed)

```bash
npm install
```

### Step 2: Run the Registration Script

```bash
node register-all-doctors.js
```

### What It Does:

- Registers all 15 doctors from DOCTOR_CREDENTIALS.txt
- Creates auth accounts for each doctor
- Links them to doctor profiles
- Shows progress for each doctor
- Displays summary at the end

### Expected Output:

```
═══════════════════════════════════════════════════════════
           REGISTERING ALL SAMPLE DOCTORS
═══════════════════════════════════════════════════════════

Total doctors to register: 15
Password for all: doctor123

📝 Registering: Dr. Sarah Johnson (sarah.johnson@hospital.com)
   ✅ Auth account created: xxx-xxx-xxx
   ✅ Profile created successfully
   🎉 Dr. Sarah Johnson registered successfully!

📝 Registering: Dr. Michael Chen (michael.chen@hospital.com)
   ✅ Auth account created: xxx-xxx-xxx
   ✅ Profile created successfully
   🎉 Dr. Michael Chen registered successfully!

... (continues for all 15 doctors)

═══════════════════════════════════════════════════════════
                    REGISTRATION SUMMARY
═══════════════════════════════════════════════════════════
✅ Successfully registered: 15
⚠️  Skipped (already exist): 0
❌ Failed: 0
═══════════════════════════════════════════════════════════

🎉 SUCCESS! Doctors can now login with:
   Email: [doctor email from DOCTOR_CREDENTIALS.txt]
   Password: doctor123
```

---

## 📋 Option 2: Manual Registration Through App

If the script doesn't work, you can register doctors manually:

### Quick Registration (3 Most Important Doctors):

1. **Dr. Thomas Brown** (General Physician)
   - Email: thomas.brown@hospital.com
   - Password: doctor123
   - Specialization: General Physician

2. **Dr. Sarah Johnson** (Cardiologist)
   - Email: sarah.johnson@hospital.com
   - Password: doctor123
   - Specialization: Cardiologist

3. **Dr. Emily Rodriguez** (Neurologist)
   - Email: emily.rodriguez@hospital.com
   - Password: doctor123
   - Specialization: Neurologist

### Steps:
1. Start app: `npm start`
2. Click "Login as Doctor"
3. Click "Register as Doctor"
4. Fill form with doctor details
5. Submit
6. Repeat for each doctor

---

## 📋 Option 3: Use Supabase Admin Panel

### Step 1: Create Auth Users in Supabase

1. Go to: https://supabase.com/dashboard/project/mklbffjqlcvowdardqkb
2. Click "Authentication" → "Users"
3. Click "Add user"
4. For each doctor:
   - Email: [from DOCTOR_CREDENTIALS.txt]
   - Password: doctor123
   - Auto Confirm User: Yes
   - Click "Create user"

### Step 2: Link to Doctor Profiles

Run this SQL in Supabase SQL Editor:

```sql
-- Update doctors with auth_id
-- Replace USER_ID with actual auth user ID from step 1

UPDATE doctors 
SET auth_id = 'USER_ID_FROM_AUTH', 
    is_verified = true, 
    is_active = true
WHERE email = 'sarah.johnson@hospital.com';

-- Repeat for each doctor
```

---

## 🐛 Troubleshooting

### Issue: "User already registered"
**Solution**: Doctor already registered, just login with credentials

### Issue: "Failed to create profile"
**Solution**: Run `supabase_doctor_schema.sql` first

### Issue: "Rate limit exceeded"
**Solution**: Wait a few minutes and try again

### Issue: Script doesn't run
**Solution**: 
1. Make sure you're in the project directory
2. Run `npm install` first
3. Check if Node.js is installed: `node --version`

---

## ✅ Verification

After registration, verify doctors can login:

1. Go to app
2. Click "Login as Doctor"
3. Try logging in with:
   - Email: thomas.brown@hospital.com
   - Password: doctor123
4. Should see doctor dashboard

---

## 📊 All 15 Doctors to Register

1. Dr. Sarah Johnson - sarah.johnson@hospital.com (Cardiologist)
2. Dr. Michael Chen - michael.chen@hospital.com (Dermatologist)
3. Dr. Emily Rodriguez - emily.rodriguez@hospital.com (Neurologist)
4. Dr. James Wilson - james.wilson@hospital.com (Orthopedic)
5. Dr. Lisa Anderson - lisa.anderson@hospital.com (Pediatrician)
6. Dr. Robert Taylor - robert.taylor@hospital.com (Psychiatrist)
7. Dr. Maria Garcia - maria.garcia@hospital.com (ENT Specialist)
8. Dr. David Kim - david.kim@hospital.com (Ophthalmologist)
9. Dr. Jennifer Lee - jennifer.lee@hospital.com (Gynecologist)
10. Dr. Thomas Brown - thomas.brown@hospital.com (General Physician)
11. Dr. Amanda White - amanda.white@hospital.com (Dentist)
12. Dr. Christopher Martinez - christopher.martinez@hospital.com (Pulmonologist)
13. Dr. Rachel Green - rachel.green@hospital.com (Gastroenterologist)
14. Dr. Kevin Patel - kevin.patel@hospital.com (Urologist)
15. Dr. Sophia Davis - sophia.davis@hospital.com (Endocrinologist)

All use password: **doctor123**

---

## 🎯 Recommended Approach

**For Quick Testing**: Register 3 doctors manually (Option 2)
**For Full Setup**: Run the script (Option 1)
**For Production**: Use Supabase Admin Panel (Option 3)

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs
3. Verify database schema is run
4. Try registering one doctor manually first

---

**Created**: February 11, 2026
**Status**: Ready to Use
**Estimated Time**: 5-10 minutes for all doctors

---
