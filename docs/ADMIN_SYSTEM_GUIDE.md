# Admin System Implementation Guide

## Overview

The Health Assistant application now includes a comprehensive admin system that allows administrators to manage doctors, users, appointments, and system operations.

## Features

### 1. Admin Dashboard
- View system statistics (total users, doctors, appointments)
- Monitor pending doctor approvals
- Quick access to all management sections
- Real-time data updates

### 2. Doctor Approval System
- Review pending doctor registrations
- Approve or reject doctor applications
- Provide rejection reasons
- Automatic email notifications (future enhancement)

### 3. Doctor Management
- View all registered doctors
- Update doctor ratings (0-5 scale)
- Activate/deactivate doctor accounts
- Delete doctor profiles
- Monitor verification status

### 4. User Management
- View all registered patients
- Monitor user activity
- Delete user accounts
- View user demographics

### 5. Appointment Management
- View all appointments in the system
- Monitor appointment statuses
- Delete appointments if needed
- Track patient-doctor interactions

## Setup Instructions

### Step 1: Database Setup

1. Open your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `supabase_admin_schema.sql`
4. This will create the `admins` table and set up necessary permissions

### Step 2: Create First Admin User

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add User"
3. Enter admin credentials:
   - Email: `admin@healthassistant.com` (or your preferred email)
   - Password: Create a strong password
   - Confirm password
4. Click "Create User"
5. Copy the user's UUID from the users list
6. Go back to SQL Editor and run:

```sql
INSERT INTO public.admins (auth_id, name, email, role, is_active)
VALUES ('PASTE_UUID_HERE', 'Super Admin', 'admin@healthassistant.com', 'super_admin', true);
```

### Step 3: Access Admin Portal

1. Start your application
2. Go to the login page
3. Click "Admin Login" at the bottom
4. Enter your admin credentials
5. You'll be redirected to the admin dashboard

## Admin Roles

### Admin
- Can approve/reject doctors
- Can manage doctor ratings
- Can view users and appointments
- Can activate/deactivate accounts

### Super Admin (Future Enhancement)
- All admin permissions
- Can create/manage other admins
- Can access system settings
- Can view audit logs

## Key Components

### Services
- `src/services/adminAuthService.js` - Admin authentication
- `src/utils/adminApi.js` - Admin API operations

### Components
- `src/components/Admin/AdminLogin.js` - Admin login page
- `src/components/Admin/AdminDashboard.js` - Main dashboard
- `src/components/Admin/DoctorApproval.js` - Doctor approval interface
- `src/components/Admin/DoctorManagement.js` - Doctor management
- `src/components/Admin/UserManagement.js` - User management
- `src/components/Admin/AppointmentManagement.js` - Appointment management

### Main App
- `src/AdminApp.js` - Admin application wrapper

## Usage Guide

### Approving Doctors

1. Navigate to "Approvals" from the admin navbar
2. Review pending doctor applications
3. Check doctor credentials (qualification, license number, experience)
4. Click "Approve" to verify the doctor
5. Or click "Reject" and provide a reason

### Managing Doctor Ratings

1. Navigate to "Doctors" from the admin navbar
2. Find the doctor you want to rate
3. Click the pencil icon next to their current rating
4. Enter a new rating (0-5, decimals allowed)
5. Click "Update Rating"

### Activating/Deactivating Doctors

1. Navigate to "Doctors"
2. Find the doctor
3. Click "Deactivate" to temporarily disable their account
4. Click "Activate" to re-enable their account

### Managing Users

1. Navigate to "Users" from the admin navbar
2. View all registered patients
3. Delete users if necessary (use with caution)

### Managing Appointments

1. Navigate to "Appointments"
2. View all appointments across the system
3. Monitor appointment statuses
4. Delete appointments if needed

## Security Features

1. **Role-Based Access Control (RBAC)**
   - Only authenticated admins can access admin portal
   - Session validation on every request

2. **Row Level Security (RLS)**
   - Supabase RLS policies protect admin data
   - Admins can only access their own profile data

3. **Secure Authentication**
   - Uses Supabase Auth for secure login
   - Password hashing and encryption
   - Session management

4. **Audit Trail (Future Enhancement)**
   - Log all admin actions
   - Track who approved/rejected doctors
   - Monitor rating changes

## API Endpoints

### Doctor Management
- `adminAPI.getAllDoctors()` - Get all doctors
- `adminAPI.getPendingDoctors()` - Get pending approvals
- `adminAPI.approveDoctor(doctorId)` - Approve doctor
- `adminAPI.rejectDoctor(doctorId, reason)` - Reject doctor
- `adminAPI.updateDoctorRating(doctorId, rating)` - Update rating
- `adminAPI.updateDoctorStatus(doctorId, isActive)` - Toggle status
- `adminAPI.deleteDoctor(doctorId)` - Delete doctor

### User Management
- `adminAPI.getAllUsers()` - Get all users
- `adminAPI.deleteUser(userId)` - Delete user

### Appointment Management
- `adminAPI.getAllAppointments()` - Get all appointments
- `adminAPI.deleteAppointment(appointmentId)` - Delete appointment

### Statistics
- `adminAPI.getStatistics()` - Get system statistics
- `adminAPI.getRecentActivity()` - Get recent activity

## Best Practices

1. **Regular Monitoring**
   - Check pending approvals daily
   - Monitor system statistics
   - Review recent activity

2. **Doctor Verification**
   - Verify license numbers before approval
   - Check qualifications and experience
   - Provide clear rejection reasons

3. **Rating Management**
   - Base ratings on patient feedback
   - Update ratings periodically
   - Maintain fair and consistent ratings

4. **User Privacy**
   - Only delete users when absolutely necessary
   - Respect user data privacy
   - Follow data protection regulations

5. **Security**
   - Use strong admin passwords
   - Log out after each session
   - Don't share admin credentials
   - Change default passwords immediately

## Troubleshooting

### Cannot Login as Admin
- Verify admin account exists in `admins` table
- Check if `is_active` is set to `true`
- Verify email and password are correct
- Check Supabase Auth user exists

### Cannot Approve Doctors
- Check RLS policies on `doctors` table
- Verify admin has necessary permissions
- Check Supabase connection

### Statistics Not Loading
- Verify database connection
- Check if tables have data
- Review browser console for errors

## Future Enhancements

1. **Email Notifications**
   - Notify doctors of approval/rejection
   - Send welcome emails to approved doctors
   - Alert admins of new registrations

2. **Advanced Analytics**
   - Appointment trends
   - User growth metrics
   - Doctor performance analytics

3. **Audit Logs**
   - Track all admin actions
   - Export audit reports
   - Compliance monitoring

4. **Multi-Admin Management**
   - Create/manage sub-admins
   - Role-based permissions
   - Admin activity tracking

5. **Bulk Operations**
   - Bulk approve/reject doctors
   - Bulk rating updates
   - Export data to CSV

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase logs
3. Check browser console for errors
4. Contact system administrator

## Version History

- **v1.0.0** (Current)
  - Initial admin system implementation
  - Doctor approval and rating management
  - User and appointment management
  - Basic statistics dashboard
