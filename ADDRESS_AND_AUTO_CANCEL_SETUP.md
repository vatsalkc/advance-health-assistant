# Doctor Address & Auto-Cancel Expired Appointments - Setup Guide

## Overview
This update adds three major features:
1. **Doctor Address Field** - Doctors can add their clinic/hospital address
2. **Address Display** - Patients can see the doctor's address when booking and viewing appointments
3. **Auto-Cancel Expired Appointments** - Appointments that pass their date without being completed are automatically cancelled

## Database Changes Required

### Step 1: Run SQL Migration in Supabase

Go to your Supabase SQL Editor and run the file `add_address_and_auto_cancel.sql`:

```sql
-- Add address column to doctors table
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add address to appointments table so it's stored when booking
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS doctor_address TEXT;

-- Function to auto-cancel expired appointments
CREATE OR REPLACE FUNCTION auto_cancel_expired_appointments()
RETURNS void AS $$
BEGIN
  UPDATE appointments
  SET status = 'Cancelled'
  WHERE date < CURRENT_DATE
    AND status IN ('Pending', 'Confirmed')
    AND status != 'Completed';
END;
$$ LANGUAGE plpgsql;

-- Run it once now to cancel any existing expired appointments
SELECT auto_cancel_expired_appointments();
```

### Step 2: Update RLS Policies (if needed)

Make sure your RLS policies allow:
- Doctors to UPDATE their own address in the `doctors` table
- Patients to READ doctor addresses
- System to UPDATE appointment status to 'Cancelled'

## Features Implemented

### 1. Doctor Address Management

**Location:** `src/components/Doctor/DoctorProfile.js`

Doctors can now:
- Add/edit their clinic or hospital address in their profile
- The address field is a textarea allowing multi-line addresses
- Address is saved along with other profile information

### 2. Address Display for Patients

**Location:** `src/components/Appointments/Appointments.js`

Patients can see the address in:

**a) Booking Modal**
- When booking an appointment, the doctor's address appears below their name and specialization
- Shows with a location icon (📍)

**b) Appointment Card**
- Each appointment card shows the doctor's address (if available)
- Displayed with date, time, and reason

**c) Appointment Details Modal**
- Full appointment details include the clinic/hospital address
- Clearly labeled with "Clinic/Hospital Address"

### 3. Auto-Cancel Expired Appointments

**Location:** `src/components/Appointments/Appointments.js`

**How it works:**
- Runs automatically when the appointments page loads
- Checks every minute for expired appointments
- Cancels appointments where:
  - Date is in the past (before today)
  - Status is 'Pending' or 'Confirmed'
  - Status is NOT 'Completed'

**Function:** `autoCancelExpiredAppointments()`

```javascript
const autoCancelExpiredAppointments = async () => {
  const today = new Date().toISOString().split('T')[0];
  const expiredAppointments = appointments.filter(apt => {
    return apt.date < today && 
           (apt.status === 'Pending' || apt.status === 'Confirmed') &&
           apt.status !== 'Completed';
  });

  // Auto-cancel expired appointments
  for (const apt of expiredAppointments) {
    try {
      await appointmentsAPI.update(apt.id, { status: 'Cancelled' });
    } catch (err) {
      console.error('Error auto-cancelling appointment:', err);
    }
  }

  // Refresh if any were cancelled
  if (expiredAppointments.length > 0) {
    fetchAppointments();
  }
};
```

### 4. Back Button Issue - Already Fixed

The back button prevention is already implemented in:
- `src/App.js`
- `src/DoctorApp.js`
- `src/AdminApp.js`

All "Back to Patient" buttons use `e.preventDefault()` to prevent navigation issues.

## Testing Instructions

### Test Doctor Address Feature:
1. Login as a doctor
2. Go to Profile tab
3. Click "Edit Profile"
4. Add an address in the "Clinic/Hospital Address" field
5. Click "Save Changes"
6. Verify the address is saved

### Test Address Display for Patients:
1. Login as a patient
2. Go to Appointments tab
3. Click "Book Appointment" on any doctor
4. Verify the doctor's address appears in the booking modal (if they have one)
5. After booking, verify the address appears in the appointment card
6. Click on an appointment to view details
7. Verify the address appears in the details modal

### Test Auto-Cancel Feature:
1. Create a test appointment with a past date (you may need to manually set this in the database)
2. Set the status to 'Pending' or 'Confirmed'
3. Refresh the appointments page
4. The appointment should automatically change to 'Cancelled' status

### Test Back Button:
1. Login as patient, doctor, or admin
2. Try using the browser back button
3. Verify you stay within the application
4. Use the "Logout" button to exit properly

## Files Modified

1. `src/components/Doctor/DoctorProfile.js` - Added address field
2. `src/components/Appointments/Appointments.js` - Added address display and auto-cancel logic
3. `src/components/Appointments/Appointments.css` - Styling already supports the new fields
4. `add_address_and_auto_cancel.sql` - Database migration script

## Optional: Scheduled Auto-Cancel (Server-Side)

For production, you may want to run the auto-cancel function on the server side using pg_cron:

```sql
-- Install pg_cron extension (if not already installed)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the function to run daily at midnight
SELECT cron.schedule(
  'auto-cancel-expired',
  '0 0 * * *',
  'SELECT auto_cancel_expired_appointments()'
);
```

This ensures appointments are cancelled even if no one visits the appointments page.

## Troubleshooting

### Address not saving:
- Check Supabase SQL Editor to verify the `address` column exists in `doctors` table
- Check RLS policies allow doctors to update their own records
- Check browser console for errors

### Address not displaying:
- Verify the doctor has actually saved an address
- Check that `doctor_address` column exists in `appointments` table
- Clear browser cache and refresh

### Auto-cancel not working:
- Check browser console for errors
- Verify the appointment date is actually in the past
- Check that the appointment status is 'Pending' or 'Confirmed'
- Verify the `auto_cancel_expired_appointments()` function exists in Supabase

### Back button still exits:
- Clear browser cache
- Make sure you're using the Logout button, not the browser back button
- Check that the popstate event listener is properly attached

## Next Steps

After running the SQL migration and testing:
1. All existing appointments will have `doctor_address` as NULL (will show "Not provided")
2. New appointments will capture the doctor's current address
3. Doctors should update their profiles with addresses
4. Expired appointments will be automatically cancelled
