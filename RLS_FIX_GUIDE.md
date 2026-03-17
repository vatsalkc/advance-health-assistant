# RLS Policy Issues - Complete Fix Guide

## 🚨 Problem
You're experiencing RLS (Row Level Security) policy issues that prevent:
- Patients from booking appointments
- Loading appointment data
- Viewing doctor lists
- Accessing user data

## 🎯 Quick Solution (Choose One)

### Option 1: Diagnose First (Recommended)
**Best if you want to understand the exact issue**

1. Open Supabase Dashboard → SQL Editor
2. Run `DIAGNOSE_RLS_ISSUES.sql`
3. Read the diagnosis summary at the end
4. Follow the recommended actions

### Option 2: Complete Fix (Most Common)
**Best for most cases - fixes everything**

1. Open Supabase Dashboard → SQL Editor
2. Run `FIX_RLS_POLICIES_COMPLETE.sql`
3. Wait for completion (should take 10-30 seconds)
4. Refresh your app and test

### Option 3: Disable RLS for Testing (Quick Test)
**⚠️ Only for development/testing - NOT for production**

1. Open Supabase Dashboard → SQL Editor
2. Run `DISABLE_RLS_FOR_TESTING.sql`
3. Test your app
4. Later, run `FIX_RLS_POLICIES_COMPLETE.sql` to re-enable security

## 📋 What Each Script Does

### DIAGNOSE_RLS_ISSUES.sql
- ✅ Checks if users are synced
- ✅ Shows RLS status on all tables
- ✅ Lists existing policies
- ✅ Identifies missing policies
- ✅ Checks for orphaned data
- ✅ Provides specific recommendations

**Use when**: You want to understand what's wrong before fixing

### FIX_RLS_POLICIES_COMPLETE.sql
- ✅ Syncs auth.users to public.users
- ✅ Creates proper RLS policies for all tables
- ✅ Grants necessary permissions
- ✅ Fixes foreign key issues
- ✅ Verifies everything works

**Use when**: You want to fix everything at once

### DISABLE_RLS_FOR_TESTING.sql
- ⚠️ Temporarily disables RLS
- ✅ Syncs users
- ✅ Grants full permissions
- ⚠️ Removes security (testing only!)

**Use when**: You need to test quickly without security

## 🔍 Common RLS Errors and Solutions

### Error 1: "new row violates row-level security policy"
**Cause**: User trying to insert data they don't have permission for

**Solution**: Run `FIX_RLS_POLICIES_COMPLETE.sql` - creates INSERT policies

### Error 2: "permission denied for table"
**Cause**: Missing table permissions

**Solution**: Run `FIX_RLS_POLICIES_COMPLETE.sql` - grants permissions

### Error 3: "violates foreign key constraint 'appointments_user_id_fkey'"
**Cause**: User ID doesn't exist in public.users table

**Solution**: Run `FIX_RLS_POLICIES_COMPLETE.sql` - syncs users

### Error 4: "No data returned" or empty lists
**Cause**: RLS policies blocking SELECT queries

**Solution**: Run `FIX_RLS_POLICIES_COMPLETE.sql` - creates SELECT policies

## 📝 Step-by-Step Fix Process

### Step 1: Diagnose (5 minutes)
```sql
-- Run DIAGNOSE_RLS_ISSUES.sql in Supabase SQL Editor
-- Read the output carefully
-- Note any red ❌ or yellow ⚠️ warnings
```

### Step 2: Apply Fix (2 minutes)
```sql
-- Run FIX_RLS_POLICIES_COMPLETE.sql in Supabase SQL Editor
-- Wait for "SUCCESS" message
-- Check for any errors
```

### Step 3: Verify (3 minutes)
1. Refresh your application (Ctrl+Shift+R)
2. Log out completely
3. Log back in
4. Test these actions:
   - [ ] View list of doctors
   - [ ] Book an appointment
   - [ ] View your appointments
   - [ ] (As doctor) View pending appointments

### Step 4: Test Edge Cases (5 minutes)
- [ ] Book appointment for today
- [ ] Book appointment for future date
- [ ] Cancel an appointment
- [ ] (As doctor) Accept an appointment
- [ ] (As doctor) Reject an appointment

## 🛠️ What the Fix Does

### 1. User Sync
```sql
-- Copies all users from auth.users to public.users
-- Ensures foreign key constraints work
-- Prevents "user not found" errors
```

### 2. RLS Policies Created

#### For Users Table:
- ✅ Users can view their own data
- ✅ Users can insert their own data (signup)
- ✅ Users can update their own data

#### For Doctors Table:
- ✅ Anyone can view active doctors
- ✅ Doctors can update their own profile

#### For Appointments Table:
- ✅ Users can insert their own appointments
- ✅ Users can view their own appointments
- ✅ Users can update their own appointments
- ✅ Doctors can view appointments assigned to them
- ✅ Doctors can update appointments assigned to them

### 3. Permissions Granted
```sql
-- authenticated users can:
-- - SELECT, INSERT, UPDATE on users table
-- - SELECT, UPDATE on doctors table
-- - SELECT, INSERT, UPDATE on appointments table
-- - Use sequences for auto-increment IDs
```

## 🔐 Security Considerations

### Development vs Production

**Development (Testing)**:
- Can temporarily disable RLS for faster testing
- Use `DISABLE_RLS_FOR_TESTING.sql`
- Remember to re-enable before deploying!

**Production (Live)**:
- MUST have RLS enabled
- Use `FIX_RLS_POLICIES_COMPLETE.sql`
- Never disable RLS in production

### Policy Logic

**Users can only**:
- See their own data
- Create appointments for themselves
- Update their own appointments

**Doctors can**:
- See all active doctors
- See appointments assigned to them
- Update appointments assigned to them
- Update their own profile

**Nobody can**:
- See other users' data
- Modify other users' appointments
- Access inactive doctors (except themselves)

## 🐛 Troubleshooting

### Issue: Script fails with "permission denied"
**Solution**: Make sure you're logged in as the database owner or have admin rights

### Issue: "relation does not exist"
**Solution**: Check table names - they might be different in your schema

### Issue: Policies created but still getting errors
**Solution**: 
1. Log out of your app
2. Clear browser cache
3. Log back in
4. Try again

### Issue: Works for some users but not others
**Solution**: 
1. Run the user sync part of the script again
2. Check if those users exist in public.users
3. Verify their auth.uid() matches their public.users.id

### Issue: Doctors can't see appointments
**Solution**: 
1. Verify doctor's email in doctors table matches auth.users email
2. Check doctor_id in appointments matches doctors.id
3. Run diagnosis script to check

## 📊 Verification Queries

After running the fix, verify with these queries:

### Check RLS Status
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'doctors', 'appointments');
```

### Check Policy Count
```sql
SELECT tablename, COUNT(*) as policies
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename;
```

### Check User Sync
```sql
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth_users,
  (SELECT COUNT(*) FROM public.users) as public_users;
```

### Test Appointment Access
```sql
-- As a logged-in user
SELECT COUNT(*) FROM appointments WHERE user_id = auth.uid();
```

## 🎓 Understanding RLS

### What is RLS?
Row Level Security (RLS) is a PostgreSQL feature that restricts which rows users can access in a table.

### Why use RLS?
- Prevents users from seeing other users' data
- Enforces data privacy at the database level
- Adds security even if frontend code has bugs

### How RLS works:
1. User makes a query
2. PostgreSQL checks RLS policies
3. Only rows matching the policy are returned
4. User never knows other rows exist

### Policy Types:
- **SELECT**: Controls which rows can be read
- **INSERT**: Controls which rows can be created
- **UPDATE**: Controls which rows can be modified
- **DELETE**: Controls which rows can be removed

## 📞 Still Having Issues?

If you're still experiencing problems after running the fixes:

1. **Check the browser console** (F12)
   - Look for specific error messages
   - Note the exact error text

2. **Check Supabase logs**
   - Go to Supabase Dashboard → Logs
   - Look for failed queries
   - Note the error details

3. **Run the diagnosis script again**
   - `DIAGNOSE_RLS_ISSUES.sql`
   - Share the output for help

4. **Verify your setup**
   - Supabase project is active
   - Database is accessible
   - API keys are correct
   - Environment variables are set

## ✅ Success Checklist

After applying fixes, you should be able to:
- [x] Log in as a patient
- [x] See list of active doctors
- [x] Book an appointment without errors
- [x] See your booked appointments
- [x] Log in as a doctor
- [x] See pending appointments
- [x] Accept/reject appointments
- [x] See today's appointments sorted by time
- [x] See correct appointment counts

## 🎉 Summary

**Quick Fix**: Run `FIX_RLS_POLICIES_COMPLETE.sql` → Refresh app → Test

**If issues persist**: Run `DIAGNOSE_RLS_ISSUES.sql` → Read recommendations → Apply fixes

**For testing only**: Run `DISABLE_RLS_FOR_TESTING.sql` → Test → Re-enable with `FIX_RLS_POLICIES_COMPLETE.sql`

---

**Last Updated**: March 17, 2026
**Status**: ✅ All scripts tested and working
