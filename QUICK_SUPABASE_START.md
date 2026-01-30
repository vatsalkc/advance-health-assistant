# ⚡ Quick Start - Supabase + GitHub Pages

## 🎯 3 Steps to Deploy (15 minutes)

### Step 1: Setup Supabase (7 min)

1. **Create account**: https://supabase.com → Sign in with GitHub
2. **New Project**: Name it `health-assistant`, set password, choose region
3. **Run SQL**: 
   - Click **SQL Editor** → **New query**
   - Copy all from `supabase_schema.sql`
   - Paste and click **Run**
4. **Get Keys**:
   - Click **Settings** → **API**
   - Copy **Project URL** and **anon public** key

### Step 2: Configure App (3 min)

1. **Install Supabase**:
```bash
npm install @supabase/supabase-js
```

2. **Update `.env`**:
```env
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

3. **Update GitHub Actions** (`.github/workflows/deploy.yml` line ~30):
```yaml
env:
  CI: false
  REACT_APP_SUPABASE_URL: https://YOUR-PROJECT.supabase.co
  REACT_APP_SUPABASE_ANON_KEY: YOUR-ANON-KEY
```

### Step 3: Deploy (5 min)

1. **Push code**:
```bash
git add .
git commit -m "Configure Supabase"
git push origin main
```

2. **Enable GitHub Pages**:
   - Go to: https://github.com/YOUR-USERNAME/advance-health-assistant/settings/pages
   - Source: **"GitHub Actions"**

3. **Wait 5 minutes** → Your app is live!

---

## ✅ Done!

Your app is now at:
```
https://YOUR-USERNAME.github.io/advance-health-assistant/
```

### Test It:
1. Register a new account
2. Check Supabase dashboard → **Authentication** → See your user!
3. Book an appointment
4. Check Supabase dashboard → **Table Editor** → **appointments**

---

## 💡 What You Get

✅ **No backend server needed** - Supabase handles everything
✅ **Free hosting** - GitHub Pages + Supabase free tier
✅ **Secure** - Row Level Security enabled
✅ **Scalable** - PostgreSQL database
✅ **Real-time** - Live data updates
✅ **Global** - Works anywhere

---

## 📚 Need Help?

See `SUPABASE_SETUP.md` for detailed instructions.

---

**Your app is now live and works without any backend server!** 🎉
