# 🚀 Supabase Setup Guide - Deploy to GitHub Pages

## Why Supabase?

✅ **Works with GitHub Pages** - No backend server needed
✅ **PostgreSQL Database** - Powerful and scalable
✅ **Built-in Authentication** - Secure user management
✅ **Real-time subscriptions** - Live data updates
✅ **Free tier** - 500MB database, 50,000 monthly active users
✅ **Row Level Security** - Data protection built-in

---

## Step 1: Create Supabase Project (5 minutes)

### 1.1 Sign Up
1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign in with GitHub

### 1.2 Create New Project
1. Click **"New Project"**
2. Fill in:
   - **Name**: `health-assistant`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup

---

## Step 2: Set Up Database (5 minutes)

### 2.1 Run SQL Schema
1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Copy the entire content from `supabase_schema.sql` file
4. Paste into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

### 2.2 Verify Tables
1. Click **"Table Editor"** (left sidebar)
2. You should see these tables:
   - users
   - doctors
   - appointments
   - medicines
   - symptom_checks

---

## Step 3: Get API Keys (2 minutes)

### 3.1 Find Your Keys
1. Click **"Settings"** (gear icon, left sidebar)
2. Click **"API"**
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

### 3.2 Copy Keys
Copy both values - you'll need them next!

---

## Step 4: Configure Frontend (3 minutes)

### 4.1 Update Environment Variables
1. Create/edit `.env` file in project root:
```env
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
```

2. Replace with your actual values from Step 3

### 4.2 Update GitHub Actions
Edit `.github/workflows/deploy.yml` and add environment variables (around line 30):

```yaml
- name: Build
  run: npm run build
  env:
    CI: false
    REACT_APP_SUPABASE_URL: https://YOUR-PROJECT.supabase.co
    REACT_APP_SUPABASE_ANON_KEY: YOUR-ANON-KEY-HERE
```

---

## Step 5: Install Dependencies (2 minutes)

```bash
npm install @supabase/supabase-js
```

---

## Step 6: Deploy to GitHub Pages (5 minutes)

### 6.1 Commit Changes
```bash
git add .
git commit -m "Migrate to Supabase for GitHub Pages deployment"
git push origin main
```

### 6.2 Enable GitHub Pages
1. Go to: https://github.com/YOUR-USERNAME/advance-health-assistant/settings/pages
2. **Source**: Select **"GitHub Actions"**
3. Wait 5 minutes for deployment

### 6.3 Access Your App
Your app will be live at:
```
https://YOUR-USERNAME.github.io/advance-health-assistant/
```

---

## ✅ Verification

### Test Backend Connection
1. Open your deployed app
2. Open browser console (F12)
3. Try to register a new account
4. Check Supabase dashboard → **Authentication** → **Users**
5. You should see the new user!

### Test Database
1. Login to your app
2. Book an appointment
3. Check Supabase dashboard → **Table Editor** → **appointments**
4. You should see the appointment!

---

## 🔐 Security Features

### Row Level Security (RLS)
Already configured! Each user can only:
- ✅ View their own data
- ✅ Create their own records
- ✅ Update their own records
- ✅ Delete their own records

### Public Access
- ✅ Anyone can view doctors list
- ❌ Cannot modify doctors (admin only via Supabase dashboard)

---

## 🎯 What Works Now

### ✅ Full Features on GitHub Pages
- User registration & login
- Disease prediction (client-side ML)
- Doctor appointments
- Medicine reminders
- Health history
- User profile

### ✅ No Backend Server Needed
- All data in Supabase cloud
- Direct connection from browser
- Works on any device
- No deployment costs

---

## 💰 Cost

### Free Tier Includes:
- 500MB database storage
- 50,000 monthly active users
- 2GB file storage
- 50GB bandwidth
- Unlimited API requests

### Upgrade (if needed):
- **Pro**: $25/month
- 8GB database
- 100,000 monthly active users

---

## 🔧 Troubleshooting

### "Invalid API key" error
- Check `.env` file has correct values
- Verify keys in Supabase dashboard → Settings → API
- Make sure no extra spaces in keys

### "Row Level Security" errors
- RLS is enabled by default
- Check SQL schema was run completely
- Verify user is authenticated

### Data not showing
- Check browser console for errors
- Verify Supabase project is active
- Check internet connection
- Verify API keys are correct

### GitHub Pages deployment fails
- Check GitHub Actions logs
- Verify environment variables in workflow file
- Ensure Supabase keys are added

---

## 📊 Monitor Usage

### Check Your Usage
1. Supabase dashboard → **Settings** → **Usage**
2. See:
   - Database size
   - Active users
   - API requests
   - Bandwidth

---

## 🚀 Advanced Features

### Enable Real-time (Optional)
1. Supabase dashboard → **Database** → **Replication**
2. Enable replication for tables
3. Data updates in real-time across devices!

### Add Storage (Optional)
1. Supabase dashboard → **Storage**
2. Create bucket for user files
3. Upload profile pictures, documents, etc.

---

## 📱 Mobile Access

Your app works on:
- ✅ Desktop browsers
- ✅ Mobile browsers (iOS/Android)
- ✅ Tablets
- ✅ Any device with internet

No app store needed - just share the URL!

---

## 🎉 Benefits Over Flask Backend

### Before (Flask + SQLite):
- ❌ Need to deploy backend separately
- ❌ Backend server costs money
- ❌ Complex deployment
- ❌ Need to manage server

### After (Supabase):
- ✅ One deployment (GitHub Pages)
- ✅ Free hosting
- ✅ Simple deployment
- ✅ Managed database
- ✅ Built-in authentication
- ✅ Automatic backups
- ✅ Real-time capabilities

---

## 📞 Support

### Supabase Resources
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase

### Common Issues
- Check Supabase status: https://status.supabase.com
- Review logs in Supabase dashboard
- Test API keys with Postman

---

## 🎊 You're Done!

Your Health Assistant app is now:
- ✅ Deployed on GitHub Pages
- ✅ Using Supabase database
- ✅ Accessible worldwide
- ✅ Free to use
- ✅ Secure and scalable

**Share your app**: `https://YOUR-USERNAME.github.io/advance-health-assistant/`

---

**Happy deploying! 🚀**
