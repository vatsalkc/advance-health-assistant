# 🚀 Deploy to Render.com + GitHub Pages

## Why Render?
- ✅ More reliable than Railway for Python apps
- ✅ Free tier with 750 hours/month
- ✅ Automatic SSL certificates
- ✅ Easy deployment from GitHub

---

## Step 1: Deploy Backend to Render (5 minutes)

### 1.1 Create Render Account
1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub**
4. Authorize Render to access your repositories

### 1.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account if not already connected
3. Find and select **`vatsalkc/advance-health-assistant`**
4. Click **"Connect"**

### 1.3 Configure Service
Fill in these settings:

**Basic Settings:**
- **Name**: `health-assistant-backend` (or any name you like)
- **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Python 3`

**Build Settings:**
- **Build Command**: 
  ```bash
  cd backend && pip install -r requirements.txt && python create_model.py
  ```

**Start Command**:
  ```bash
  cd backend && gunicorn --bind 0.0.0.0:$PORT app:app
  ```

**Instance Type:**
- Select **"Free"** (750 hours/month)

### 1.4 Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these:
```
PYTHON_VERSION = 3.9.0
SECRET_KEY = your-secret-key-change-this-to-something-random
PORT = 10000
```

### 1.5 Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for build to complete
3. Once deployed, you'll see a URL like:
   ```
   https://health-assistant-backend.onrender.com
   ```
4. **Copy this URL** - you'll need it for the frontend

### 1.6 Test Backend
Open in browser:
```
https://YOUR-RENDER-URL.onrender.com/api/doctors
```
Should show JSON with doctors list.

---

## Step 2: Update Frontend API URL (2 minutes)

### 2.1 Update GitHub Actions Workflow
1. Open `.github/workflows/deploy.yml` in your repository
2. Find line 32 (around `REACT_APP_API_URL`)
3. Replace with your Render URL:
   ```yaml
   REACT_APP_API_URL: https://YOUR-RENDER-URL.onrender.com/api
   ```

### 2.2 Update api.js for Production
1. Open `src/utils/api.js`
2. Find the `getApiBaseUrl` function
3. Update the production URL:
   ```javascript
   if (window.location.hostname.includes('github.io')) {
     return 'https://YOUR-RENDER-URL.onrender.com/api';
   }
   ```

### 2.3 Commit and Push
```bash
git add .github/workflows/deploy.yml src/utils/api.js
git commit -m "Update API URL for Render deployment"
git push origin main
```

---

## Step 3: Enable GitHub Pages (2 minutes)

### 3.1 Enable Pages
1. Go to: https://github.com/vatsalkc/advance-health-assistant/settings/pages
2. Under **"Source"**, select **"GitHub Actions"**
3. Click **"Save"**

### 3.2 Wait for Deployment
1. Go to **"Actions"** tab: https://github.com/vatsalkc/advance-health-assistant/actions
2. Watch the deployment workflow (green checkmark = success)
3. Takes 3-5 minutes

### 3.3 Access Your Live App
Your app will be live at:
```
https://vatsalkc.github.io/advance-health-assistant/
```

---

## ✅ Verification Checklist

### Backend Health Check
- [ ] Open: `https://YOUR-RENDER-URL.onrender.com/api/doctors`
- [ ] Should return JSON with doctors list
- [ ] Status: 200 OK

### Frontend Check
- [ ] Open: `https://vatsalkc.github.io/advance-health-assistant/`
- [ ] Page loads without errors
- [ ] Can register new account
- [ ] Can login
- [ ] Can check symptoms
- [ ] Can view doctors
- [ ] Can book appointments

---

## 🎯 Important Notes

### Render Free Tier
- **750 hours/month** (enough for personal use)
- **Sleeps after 15 minutes** of inactivity
- **First request** after sleep takes 30-60 seconds to wake up
- **Automatic SSL** certificate included

### GitHub Pages
- **Unlimited** for public repositories
- **Automatic deployment** on every push to main
- **Custom domain** supported (optional)

### Auto-Deploy
Both services auto-deploy when you push to GitHub:
- **Render**: Watches `main` branch
- **GitHub Pages**: Triggered by GitHub Actions

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Build fails on Render
- Check **Logs** in Render dashboard
- Verify `requirements.txt` path is correct
- Ensure Python version is 3.9.0

**Problem**: Backend returns 500 error
- Check Render logs for Python errors
- Verify database initialization
- Check ML model creation

**Problem**: CORS errors
- Backend already configured for all origins
- Check if Render URL is correct in frontend

### Frontend Issues

**Problem**: GitHub Pages shows 404
- Wait 10 minutes after first deployment
- Check Actions tab for errors
- Verify `homepage` in `package.json`

**Problem**: Can't connect to backend
- Check browser console for API URL
- Verify Render backend is running (not sleeping)
- Test backend URL directly in browser

**Problem**: Build fails in GitHub Actions
- Check Actions logs
- Verify `REACT_APP_API_URL` is correct
- Ensure no syntax errors in code

---

## 💰 Cost Breakdown

### Free Forever
- **GitHub Pages**: Unlimited (public repos)
- **Render**: 750 hours/month free

### If You Exceed Free Tier
- **Render**: $7/month for always-on service
- **Alternative**: Use PythonAnywhere (also free tier)

---

## 🚀 Alternative: PythonAnywhere

If Render doesn't work, try PythonAnywhere:

1. Go to https://www.pythonanywhere.com
2. Create free account
3. Upload code via Git
4. Configure web app
5. Free tier: Always on, no sleep

---

## 📱 Mobile Access

Your deployed app works on:
- ✅ Desktop browsers
- ✅ Mobile browsers (iOS/Android)
- ✅ Tablets
- ✅ Any device with internet

---

## 🎉 Success!

Once deployed, share your app:
```
https://vatsalkc.github.io/advance-health-assistant/
```

**Your AI Health Assistant is now live and accessible worldwide!** 🌍

---

## 📞 Support

If you encounter issues:
1. Check Render logs
2. Check GitHub Actions logs
3. Test locally first
4. Verify all URLs are correct

**Happy Deploying! 🚀**
