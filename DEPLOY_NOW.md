# 🚀 Quick Deploy - 3 Steps

## Step 1: Deploy Backend (5 minutes)

1. **Go to Railway**: https://railway.app
2. **Sign in** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select**: `vatsalkc/advance-health-assistant`
5. **Wait** for build to complete
6. **Settings** → **Networking** → **Generate Domain**
7. **Copy** your domain (e.g., `your-app.up.railway.app`)

## Step 2: Update Frontend API URL (1 minute)

1. **Open** `.github/workflows/deploy.yml` in your repo
2. **Find** line 32: `REACT_APP_API_URL:`
3. **Replace** with your Railway domain:
   ```yaml
   REACT_APP_API_URL: https://YOUR-DOMAIN.up.railway.app/api
   ```
4. **Commit** and push:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Update API URL for production"
   git push origin main
   ```

## Step 3: Enable GitHub Pages (2 minutes)

1. **Go to**: https://github.com/vatsalkc/advance-health-assistant/settings/pages
2. **Source**: Select **"GitHub Actions"**
3. **Save**
4. **Go to Actions tab**: Watch deployment (3-5 minutes)
5. **Done!** Your app is live at:
   ```
   https://vatsalkc.github.io/advance-health-assistant/
   ```

---

## ✅ Verification

### Test Backend
Open: `https://YOUR-DOMAIN.up.railway.app/api/doctors`
- Should show JSON with doctors list

### Test Frontend
Open: `https://vatsalkc.github.io/advance-health-assistant/`
- Register and test all features

---

## 🎉 That's It!

Your app is now live and accessible worldwide!

**Frontend**: https://vatsalkc.github.io/advance-health-assistant/
**Backend**: https://YOUR-DOMAIN.up.railway.app

---

## 💡 Tips

- Railway free tier: $5 credit/month (enough for personal use)
- GitHub Pages: Unlimited for public repos
- Both auto-deploy when you push to GitHub

---

## 🆘 Need Help?

Check `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.
