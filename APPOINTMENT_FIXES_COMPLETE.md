# Complete Appointment System Fixes

## Issues Fixed

### 1. Appointment Booking Foreign Key Error
**Error**: `Failed to book appointment: insert or update on table 'appointments' violates foreign key constraint 'appointments_user_id_fkey'`

**Root Cause**: The `user_id` from the authenticated session doesn't exist in the `public.users` table, causing the foreign key constraint to fail.

**Solution**: 
- Sync all users from `auth.users` to `public.users`
- Fix RLS policies to allow proper insert/select operations
- Run the SQL script: `FIX_APPOINTMENT_BOOKING_COMPLETE.sql`

### 2. Today's Appointment Count Not Decreasing on Rejection
**Issue**: When a doctor rejects an appointment scheduled for today, the "Appointments Today" count doesn't decrease.

**Root Cause**: The count was including all appointments regardless of status.

**Solution**: 
- Updated `doctorStatsAPI.get()` to exclude rejected appointments from today's count
- Added `.neq('status', 'Rejected')` filter to the query
- Dashboard now properly recalculates count after rejection

### 3. Today's Appointments Not Sorted by Time
**Issue**: Today's appointments were displayed in random order instead of chronologically.

**Solution**: 
- Added time-based sorting to today's appointments
- Appointments now display in ascending time order (earliest first)
- Uses `localeCompare()` for proper time string comparison

## Changes Made

### Frontend Code Changes

#### File: `src/utils/doctorApi.js`

**1. Updated `doctorStatsAPI.get()`**
```javascript
// Today's appointments (excluding rejected ones)
supabase
  .from('appointments')
  .select('*', { count: 'exact', head: true })
  .eq('doctor_id', doctorId)
  .eq('date', todayDate)
  .neq('status', 'Rejected') // Exclude rejected appointments
```

**Benefits**:
- Today's count now accurately reflects active appointments
- Rejected appointments don't inflate the count
- Real-time updates when status changes

#### File: `src/components/Doctor/DoctorDashboard.js`

**1. Added Time-Based Sorting**
```javascript
const todayAppts = allAppointments
  .filter(apt => apt.date === today)
  .sort((a, b) => {
    const timeA = a.time || '00:00:00';
    const timeB = b.time || '00:00:00';
    return timeA.localeCompare(timeB);
  });
```

**2. Added Local Count Calculation**
```javascript
const todayActiveCount = todayAppts.filter(apt => apt.status !== 'Rejected').length;
setStats(prevStats => ({
  ...prevStats,
  todayAppointments: todayActiveCount
}));
```

**Benefits**:
- Appointments display in chronological order
- Easier for doctors to see their schedule
- Count updates immediately after rejection

### Database Fixes

#### File: `FIX_APPOINTMENT_BOOKING_COMPLETE.sql`

This comprehensive SQL script:

**1. Syncs Users**
- Copies all users from `auth.users` to `public.users`
- Ensures every authenticated user has a record in public.users
- Prevents foreign key constraint violations

**2. Fixes RLS Policies**
- Drops old conflicting policies
- Creates proper policies for users and doctors
- Allows users to insert their own appointments
- Allows doctors to view and update their appointments

**3. Verification Queries**
- Checks for orphaned appointments
- Verifies user sync status
- Shows appointment statistics
- Validates RLS policies

## How to Apply the Fixes

### Step 1: Run the SQL Script

1. Open your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the entire contents of `FIX_APPOINTMENT_BOOKING_COMPLETE.sql`
4. Paste into the SQL Editor
5. Click "Run" to execute all queries
6. Review the output to ensure:
   - Users are synced
   - RLS policies are created
   - No orphaned appointments exist

### Step 2: Verify Frontend Changes

The frontend code changes are already applied. To verify:

1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache if needed
3. Log out and log back in

### Step 3: Test the Fixes

#### Test Appointment Booking:
1. Log in as a patient
2. Try to book an appointment with a doctor
3. Should succeed without foreign key errors
4. Check that appointment appears in patient's list

#### Test Today's Count:
1. Log in as a doctor
2. Note the "Appointments Today" count
3. Reject a pending appointment scheduled for today
4. Count should decrease by 1
5. Rejected appointment should still appear in the list with "Rejected" badge

#### Test Time Sorting:
1. Log in as a doctor with multiple appointments today
2. Check the "Today's Appointments" section
3. Appointments should be sorted by time (earliest first)
4. Example: 09:00, 10:30, 14:00, 16:45

## Expected Results

### ✅ Appointment Booking
- Patients can book appointments without errors
- All required fields are properly saved
- Patient name and phone are stored correctly
- Appointments appear immediately in both patient and doctor views

### ✅ Today's Appointment Count
- Shows only active appointments (Pending + Confirmed)
- Excludes rejected appointments
- Updates immediately when status changes
- Matches the actual number of appointments in the list

### ✅ Time-Based Sorting
- Today's appointments display in chronological order
- Earliest appointments appear first
- Makes it easy for doctors to see their schedule
- Consistent sorting across all views

## Troubleshooting

### If appointment booking still fails:

1. **Check browser console for errors**
   - Open DevTools (F12)
   - Look for red error messages
   - Note the specific error message

2. **Verify user exists in public.users**
   ```sql
   SELECT * FROM public.users WHERE id = 'YOUR_USER_ID';
   ```

3. **Check RLS policies**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'appointments';
   ```

4. **Verify auth session**
   - Log out completely
   - Clear browser cache
   - Log back in
   - Try booking again

### If today's count doesn't update:

1. **Check browser console logs**
   - Look for: `[doctorStatsAPI] Today appointments count`
   - Verify the count matches expectations

2. **Hard refresh the page**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

3. **Verify appointment status in database**
   ```sql
   SELECT id, date, time, status 
   FROM appointments 
   WHERE date = CURRENT_DATE 
   ORDER BY time;
   ```

### If appointments aren't sorted by time:

1. **Check appointment time format**
   - Should be in HH:MM:SS format
   - Example: "09:30:00", "14:15:00"

2. **Verify time data exists**
   ```sql
   SELECT id, date, time 
   FROM appointments 
   WHERE time IS NULL OR time = '';
   ```

3. **Check browser console**
   - Look for: `[DoctorDashboard] Today appointments (sorted by time)`
   - Verify the array is properly sorted

## Technical Details

### Foreign Key Constraint
```sql
-- The constraint that was causing issues:
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

-- Solution: Ensure all auth.users exist in public.users
INSERT INTO public.users (id, email, name, created_at)
SELECT au.id, au.email, COALESCE(au.raw_user_meta_data->>'name', au.email), au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;
```

### RLS Policy for Insert
```sql
CREATE POLICY "Users can insert their own appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

### Today's Count Query
```javascript
// Excludes rejected appointments
.eq('date', todayDate)
.neq('status', 'Rejected')
```

### Time Sorting Logic
```javascript
.sort((a, b) => {
  const timeA = a.time || '00:00:00';
  const timeB = b.time || '00:00:00';
  return timeA.localeCompare(timeB);
})
```

## Maintenance Tips

### Prevent Future Issues:

1. **Keep auth.users and public.users in sync**
   - Consider creating a database trigger
   - Auto-insert into public.users when auth.users gets a new record

2. **Always use local timezone for dates**
   - Avoid `new Date().toISOString().split('T')[0]`
   - Use the local date formatting we implemented

3. **Validate appointment data before insert**
   - Ensure user_id exists
   - Verify doctor_id is valid
   - Check date/time format

4. **Monitor RLS policies**
   - Regularly review policies in Supabase
   - Test with different user roles
   - Ensure proper access control

## Additional Features

### Future Enhancements:

1. **Appointment Reminders**
   - Send notifications 1 hour before appointment
   - Email/SMS reminders to patients

2. **Cancellation by Patients**
   - Allow patients to cancel appointments
   - Update count automatically

3. **Rescheduling**
   - Allow both doctors and patients to reschedule
   - Maintain appointment history

4. **Time Slot Management**
   - Show available time slots
   - Prevent double-booking
   - Block unavailable times

## Support

If you encounter any issues not covered in this guide:

1. Check the browser console for detailed error messages
2. Review the Supabase logs in the dashboard
3. Verify all SQL scripts ran successfully
4. Ensure you're using the latest code version
5. Try logging out and back in
6. Clear browser cache and cookies

## Summary

All three major issues have been resolved:
- ✅ Appointment booking works without foreign key errors
- ✅ Today's count decreases when rejecting appointments
- ✅ Today's appointments are sorted by time

The system now provides a smooth experience for both patients and doctors!
