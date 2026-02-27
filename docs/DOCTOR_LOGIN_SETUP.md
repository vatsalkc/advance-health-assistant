# 🏥 Doctor Login Setup Guide

## ⚠️ Important: Doctors Need to Register First!

The sample doctors in `DOCTOR_CREDENTIALS.txt` are NOT yet registered in the authentication system. They need to register through the app first.

---

## 🚀 Quick Setup (2 Options)

### Option 1: Register Through the App (RECOMMENDED)

This is the easiest way to get started:

1. **Start your app**
   ```bash
   npm start
   ```

2. **Go to Doctor Registration**
   - Click "Login as Doctor"
   - Click "Register as Doctor"

3. **Use Sample Doctor Credentials**
   - Pick any doctor from `DOCTOR_CREDENTIALS.txt`
   - Example: Dr. Sarah Johnson (Cardiologist)
   
4. **Fill the Registration Form**
   ```
   Full Name: Dr. Sarah Johnson
   Email: sarah.johnson@hospital.com
   Password: doctor123
   Confirm Password: doctor123
   Phone: +1-555-0101
   Specialization: Cardiologist
   Qualification: MBBS, MD (Cardiology)
   License Number: MED-CARD-2018-001
   Experience: 12 years
   ```

5. **Submit Registration**
   - Doctor account is created
   - Auto-login to doctor dashboard
   - Now you can login anytime with these credentials!

---

### Option 2: Add Sample Doctors to Database (Advanced)

If you want to pre-populate doctors in the database:

1. **Run the SQL file in Supabase**
   - Go to: https://supabase.com/dashboard/project/mklbffjqlcvowdardqkb
   - Click "SQL Editor"
   - Copy content from `sample_doctors_data.sql`
   - Run it

2. **Doctors will appear in patient's doctor list**
   - But they still can't login yet
   - They need to register to create auth accounts

3. **Register each doctor**
   - Use the registration form
   - The system will link the existing doctor profile
   - Now they can login!

---

## 🎯 Quick Test (3 Doctors)

Register these 3 doctors for quick testing:

### 1. General Physician (Most Common)
```
Name: Dr. Thomas Brown
Email: thomas.brown@hospital.com
Password: doctor123
Specialization: General Physician
```

### 2. Cardiologist (Heart Specialist)
```
Name: Dr. Sarah Johnson
Email: sarah.johnson@hospital.com
Password: doctor123
Specialization: Cardiologist
```

### 3. Neurologist (Brain Specialist)
```
Name: Dr. Emily Rodriguez
Email: emily.rodriguez@hospital.com
Password: doctor123
Specialization: Neurologist
```

---

## 📋 Step-by-Step Registration

### Step 1: Open Doctor Registration
1. Start app: `npm start`
2. Click "Login as Doctor" (bottom of patient login)
3. Click "Register as Doctor"

### Step 2: Fill the Form
- **Full Name**: Copy from DOCTOR_CREDENTIALS.txt
- **Email**: Copy from DOCTOR_CREDENTIALS.txt
- **Password**: doctor123
- **Confirm Password**: doctor123
- **Phone**: Optional (or copy from file)
- **Specialization**: Select from dropdown
- **Qualification**: Optional (or copy from file)
- **License Number**: Optional
- **Experience**: Optional (or copy from file)

### Step 3: Submit
- Click "Register"
- Wait for success message
- Auto-login to doctor dashboard

### Step 4: Test Login
- Logout
- Click "Login as Doctor"
- Enter email and password
- Should login successfully!

---

## 🔧 Troubleshooting

### Issue: "Invalid email or password"
**Reason**: Doctor hasn't registered yet
**Solution**: Register the doctor first through the app

### Issue: "This email is already registered"
**Reason**: Doctor already registered
**Solution**: Just login with the credentials

### Issue: "Doctor profile not found"
**Reason**: Logged in as patient, not doctor
**Solution**: Use "Login as Doctor" link

### Issue: "Failed to create doctor profile"
**Reason**: Database schema not run
**Solution**: Run `supabase_doctor_schema.sql` in Supabase

---

## 🎨 Visual Guide

### Patient Login Page:
```
┌─────────────────────────────────┐
│         Patient Login           │
│                                 │
│  Email: [____________]          │
│  Password: [____________]       │
│                                 │
│  [Login]                        │
│                                 │
│  Don't have account? Register   │
│  Login as Doctor  ← Click here  │
└─────────────────────────────────┘
```

### Doctor Login Page:
```
┌─────────────────────────────────┐
│    🏥 Doctor Login              │
│                                 │
│  Email: [____________]          │
│  Password: [____________]       │
│                                 │
│  [Login]                        │
│                                 │
│  Don't have account?            │
│  Register as Doctor ← Click here│
│  Login as Patient               │
└─────────────────────────────────┘
```

### Doctor Registration Page:
```
┌─────────────────────────────────┐
│    🏥 Doctor Registration       │
│                                 │
│  Full Name: [____________]      │
│  Email: [____________]          │
│  Password: [____________]       │
│  Confirm: [____________]        │
│  Phone: [____________]          │
│  Specialization: [▼]            │
│  Qualification: [____________]  │
│  License: [____________]        │
│  Experience: [____________]     │
│                                 │
│  [Register]                     │
└─────────────────────────────────┘
```

---

## ✅ Verification Checklist

After registering a doctor:

- [ ] Registration successful message appears
- [ ] Auto-login to doctor dashboard
- [ ] Can see doctor name in navbar
- [ ] Dashboard shows statistics
- [ ] Can navigate to Appointments
- [ ] Can navigate to Patients
- [ ] Can logout successfully
- [ ] Can login again with same credentials

---

## 🎯 Why This Happens

### The System Design:

1. **Doctors Table** (in database)
   - Stores doctor information
   - Name, specialization, experience, etc.
   - Visible to patients for booking

2. **Auth Users** (Supabase Auth)
   - Stores login credentials
   - Email and password
   - Required for authentication

3. **Link Between Them**
   - `auth_id` field in doctors table
   - Links doctor profile to auth account
   - Created during registration

### The Flow:

```
Sample Data (SQL) → Doctors Table (no auth_id)
                         ↓
                    Registration
                         ↓
              Auth Account Created
                         ↓
              auth_id linked to profile
                         ↓
                  Can Login Now!
```

---

## 🚀 Automated Solution (Future)

In the future, you could:

1. Create a script to auto-register all sample doctors
2. Use Supabase Admin API to create auth users
3. Link them automatically

But for now, manual registration through the app is the safest and easiest method.

---

## 📞 Need Help?

### Quick Commands:

**Start app:**
```bash
npm start
```

**Check if doctor exists in database:**
```sql
SELECT * FROM doctors WHERE email = 'sarah.johnson@hospital.com';
```

**Check if auth account exists:**
```sql
SELECT * FROM auth.users WHERE email = 'sarah.johnson@hospital.com';
```

---

## 🎉 Summary

**To login as a doctor:**
1. ✅ Register through the app first
2. ✅ Use credentials from DOCTOR_CREDENTIALS.txt
3. ✅ Then you can login anytime

**Don't:**
❌ Try to login without registering first
❌ Use patient login for doctors
❌ Expect sample data to work without registration

---

**Created**: February 11, 2026
**Status**: ✅ Working as Designed
**Solution**: Register doctors through the app

---

*For more help, see: DOCTOR_PORTAL_SETUP.md*
