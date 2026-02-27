# 🚀 Deployment Guide - GitHub Pages + Railway

## Overview
This guide will help you deploy the Health Assistant application:
- **Frontend**: GitHub Pages (free, static hosting)
- **Backend**: Railway (free tier, Python Flask server)

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Verify your email

### Step 2: Deploy Backend
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **`vatsalkc/advance-health-assistant`**
4. Railway will automatically detect the Python app

### Step 3: Configure Backend
1. Go to your project settings
2. Add these environment variables:
   ```
   PORT=5000
   SECRET_KEY=your-secret-key-here-change-this
   ```
3. In **Settings** → **Networking**:
   - Click **"Generate Domain"**
   - Copy the domain (e.g., `your-app.up.railway.app`)

### Step 4: Update Frontend API URL
1. Open `.github/workflows/deploy.yml`
2. Find line with `REACT_APP_API_URL`
3. Replace with your Railway domain:
   ```yaml
   REACT_APP_API_URL: https://YOUR-RAILWAY-DOMAIN.up.railway.app/api
   ```

---

## Part 2: Deploy Frontend to GitHub Pages

### Step 1: Enable GitHub Pages
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Source**, select **"GitHub Actions"**
4. Click **Save**

### Step 2: Push Changes
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### Step 3: Wait for Deployment
1. Go to **Actions** tab in GitHub
2. Watch the deployment workflow
3. Wait for green checkmark (3-5 minutes)

### Step 4: Access Your App
Your app will be live at:
```
https://vatsalkc.github.io/advance-health-assistant/
```

---

## Part 3: Verify Deployment

### Test Backend
1. Open: `https://YOUR-RAILWAY-DOMAIN.up.railway.app/api/doctors`
2. Should return JSON with doctors list

### Test Frontend
1. Open: `https://vatsalkc.github.io/advance-health-assistant/`
2. Register a new account
3. Test all features:
   - ✅ Login/Register
   - ✅ Symptom Checker
   - ✅ Doctor Appointments
   - ✅ Medicine Reminders
   - ✅ Profile

---

## Troubleshooting

### Backend Issues

**Problem**: Railway build fails
- Check logs in Railway dashboard
- Ensure `requirements.txt` is in `backend/` folder
- Verify Python version compatibility

**Problem**: CORS errors
- Backend CORS is configured for all origins
- Check Railway logs for errors

### Frontend Issues

**Problem**: GitHub Pages shows 404
- Wait 5-10 minutes after first deployment
- Check Actions tab for deployment status
- Ensure `homepage` in `package.json` is correct

**Problem**: API connection fails
- Verify Railway backend is running
- Check browser console for API URL
- Ensure REACT_APP_API_URL is correct in workflow

---

## Cost

### Free Tier Limits
- **GitHub Pages**: Unlimited (for public repos)
- **Railway**: 
  - $5 free credit per month
  - 500 hours execution time
  - Enough for personal projects

### Upgrade Options
If you exceed free tier:
- Railway: $5/month for more resources
- Alternative: Use Render.com (also has free tier)

---

## Alternative: Render.com Backend

If Railway doesn't work, use Render:

1. Go to [render.com](https://render.com)
2. Create **New Web Service**
3. Connect GitHub repo
4. Configure:
   - **Build Command**: `cd backend && pip install -r requirements.txt && python create_model.py`
   - **Start Command**: `cd backend && python app.py`
   - **Environment**: Python 3
5. Add environment variables
6. Deploy

---

## Maintenance

### Update Backend
1. Make changes to backend code
2. Push to GitHub
3. Railway auto-deploys

### Update Frontend
1. Make changes to frontend code
2. Push to GitHub
3. GitHub Actions auto-deploys

---

## Support

If you encounter issues:
1. Check Railway logs
2. Check GitHub Actions logs
3. Test locally first: `npm start` and `python app.py`

---

**Your app will be live and accessible worldwide! 🌍**
