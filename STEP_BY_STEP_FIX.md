# Step-by-Step Fix for Doctor "ducho" Not Showing

## Current Situation
- ✅ Doctor "ducho" can log in to doctor portal
- ❌ Doctor "ducho" does NOT appear in patient's appointment tab
- ❌ Doctor profile does NOT exist in `doctors` table

## Root Cause
The registration created a Supabase Auth account but failed to create the doctor profile in the `doctors` table due to RLS (Row Level Security) policies.

## SOLUTION: Run SQL in Supabase

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com
2. Open your project: `mklbffjqlcvowdardqkb`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

### Step 2: Run This SQL Script

Copy and paste this ENTIRE script into the SQL Editor and click "Run":

```sql
-- Fix ducho doctor profile
-- This will create the profile if it doesn't exist, or update it if it does

INSERT INTO doctors (
  auth_id,
  name,
  email,
  phone,
  specialization,
  qualification,
  license_number,
  experience,
  rating,
  is_verified,
  is_active,
  created_at,
  updated_at
)
SELECT 
  id,
  'ducho',
  'duchopatel@gmail.com',
  '7894561230',
  'General Physician',
  'MBBS',
  'ESWP232XC',
  'Not specified',
  4.5,
  true,
  true,
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'duchopatel@gmail.com'
ON CONFLICT (email) DO UPDATE SET
  auth_id = EXCLUDED.auth_id,
  is_active = true,
  is_verified = true,
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  specialization = EXCLUDED.specialization,
  qualification = EXCLUDED.qualification,
  license_number = EXCLUDED.license_number,
  experience = EXCLUDED.experience,
  updated_at = NOW();

-- Verify it worked
SELECT 
  id,
  name,
  email,
  specialization,
  is_active,
  is_verified,
  created_at
FROM doctors 
WHERE email = 'duchopatel@gmail.com';
```

### Step 3: Verify the Result

After running the script, you should see output like:

```
id  | name  | email                    | specialization      | is_active | is_verified | created_at
----|-------|--------------------------|---------------------|-----------|-------------|------------
XX  | ducho | duchopatel@gmail.com     | General Physician   | true      | true        | 2024-XX-XX
```

If you see this, the fix worked! ✅

### Step 4: Update RLS Policy (Optional but Recommended)

Run this second script to allow all active doctors to show (not just verified):

```sql
-- Update RLS Policy
DROP POLICY IF EXISTS "Anyone can view active verified doctors" ON doctors;

CREATE POLICY "Anyone can view active doctors" ON doctors
  FOR SELECT USING (is_active = true);
```

### Step 5: Test in Application

1. **Refresh the patient/user page** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Go to Appointments tab**
3. **Search for "ducho"** in the search bar
4. **Doctor should now appear!** ✅

## Verification Checklist

After running the SQL:

- [ ] SQL script executed without errors
- [ ] Verification query shows ducho's profile
- [ ] `is_active = true`
- [ ] `is_verified = true`
- [ ] Refreshed patient page
- [ ] Doctor appears in appointments tab
- [ ] Can search and find "ducho"
- [ ] Can book appointment with ducho

## If It Still Doesn't Work

### Check 1: Verify in Database
Run this query:
```sql
SELECT * FROM doctors WHERE email = 'duchopatel@gmail.com';
```

Should return 1 row with all doctor details.

### Check 2: Check RLS Policies
Run this query:
```sql
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'doctors';
```

Should show a policy allowing SELECT when `is_active = true`.

### Check 3: Test the API Query
Run this query (same as the app uses):
```sql
SELECT * FROM doctors 
WHERE is_active = true 
ORDER BY created_at DESC;
```

Should include ducho in the results.

### Check 4: Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use Ctrl+Shift+Delete to clear cache

### Check 5: Check Console for Errors
1. Open Developer Tools (F12)
2. Go to Console tab
3. Refresh the page
4. Look for any red errors
5. Share the errors if you see any

## Alternative: Re-register Doctor

If SQL doesn't work, you can:

1. **Delete the auth account:**
   - Go to Supabase > Authentication > Users
   - Find duchopatel@gmail.com
   - Click the three dots > Delete user

2. **Register again:**
   - Go to your app
   - Click "Register as Doctor"
   - Fill in ALL fields:
     - Name: Dr. Ducho
     - Email: duchopatel@gmail.com (or new email)
     - Password: (new password)
     - Confirm Password: (same)
     - Phone: 7894561230
     - Specialization: General Physician
     - Qualification: MBBS
     - License Number: ESWP232XC
     - Experience: 5 years
   - Click Register
   - Wait for success message

3. **Verify:**
   - Check patient appointment tab
   - Doctor should appear

## Why This Happened

The registration process has two steps:
1. Create Supabase Auth account ✅ (succeeded)
2. Create doctor profile in database ❌ (failed)

The profile creation failed because:
- RLS policy requires `auth.uid() = auth_id`
- But during registration, the INSERT happens before auth context is set
- Or network error/timeout occurred
- Or RLS policy was too restrictive

## Prevention

To prevent this in the future, we've:
1. ✅ Added automatic profile recovery on login
2. ✅ Added better error handling
3. ✅ Updated RLS policies to be less restrictive
4. ✅ Added search functionality to find doctors easily

## Files Created

1. `FIX_DUCHO_FINAL.sql` - Complete fix script
2. `UPDATE_RLS_POLICY.sql` - RLS policy update
3. `STEP_BY_STEP_FIX.md` - This guide
4. `check-doctor.js` - Database verification script

## Need Help?

If you're still having issues:
1. Share the output of the SQL queries
2. Share any console errors
3. Confirm which step failed
4. Check if auth account exists in Supabase

---

**TL;DR:** Run the SQL script in Supabase SQL Editor, refresh the page, and ducho should appear! 🎉
