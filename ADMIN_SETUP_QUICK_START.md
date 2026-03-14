# Admin System - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Run Database Script
1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the entire content from `supabase_admin_schema.sql`
5. Click **Run** or press `Ctrl+Enter`

### Step 2: Create Your First Admin
1. In Supabase Dashboard, go to **Authentication** > **Users**
2. Click **Add User** button
3. Fill in:
   - **Email**: `admin@yourdomain.com` (use your email)
   - **Password**: Create a strong password (min 6 characters)
   - **Auto Confirm User**: ✅ Check this box
4. Click **Create User**
5. **Copy the UUID** from the users list (it looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 3: Link Admin to Database
1. Go back to **SQL Editor**
2. Run this query (replace `YOUR_UUID_HERE` with the UUID you copied):

```sql
INSERT INTO public.admins (auth_id, name, email, role, is_active)
VALUES ('YOUR_UUID_HERE', 'Admin Name', 'admin@yourdomain.com', 'super_admin', true);
```

3. Click **Run**

### Step 4: Login to Admin Portal
1. Start your application: `npm start`
2. Go to the login page
3. Click **"Admin Login"** at the bottom
4. Enter your admin email and password
5. Click **Login as Admin**

## ✅ You're Done!

You should now see the Admin Dashboard with:
- Total Users count
- Total Doctors count
- Total Appointments count
- Pending Approvals count

## 🎯 What You Can Do Now

### Approve Doctors
1. Click **"Approvals"** in the navbar
2. Review pending doctor applications
3. Click **Approve** or **Reject**

### Manage Doctor Ratings
1. Click **"Doctors"** in the navbar
2. Click the pencil icon next to any doctor's rating
3. Enter new rating (0-5)
4. Click **Update Rating**

### View Users
1. Click **"Users"** in the navbar
2. See all registered patients

### Monitor Appointments
1. Click **"Appointments"** in the navbar
2. View all appointments in the system

## 🔒 Security Tips

1. **Change Default Password**: If you used a simple password, change it immediately
2. **Use Strong Password**: Minimum 12 characters with mix of letters, numbers, symbols
3. **Don't Share Credentials**: Keep admin login details private
4. **Log Out**: Always log out after using admin portal

## 🐛 Troubleshooting

### "Admin profile not found"
- Make sure you ran the INSERT query in Step 3
- Verify the UUID matches the auth user
- Check if `is_active` is `true`

### "Failed to fetch"
- Check your internet connection
- Verify Supabase project is active (not paused)
- Check browser console for errors

### Cannot see pending doctors
- Make sure doctors have registered
- Check if `is_verified` is `false` in doctors table
- Refresh the page

## 📚 Full Documentation

For detailed information, see: `docs/ADMIN_SYSTEM_GUIDE.md`

## 🆘 Need Help?

1. Check browser console (F12) for errors
2. Check Supabase logs in dashboard
3. Review the full documentation
4. Check database tables in Supabase Table Editor

---

**Congratulations! Your admin system is ready to use! 🎉**
