# ⚡ Quick Deploy - Render + GitHub Pages

## 🎯 3 Simple Steps (10 minutes total)

### Step 1: Deploy Backend (5 min)
1. Go to https://render.com → Sign up with GitHub
2. **New +** → **Web Service** → Select `vatsalkc/advance-health-assistant`
3. Configure:
   - **Build Command**: `cd backend && pip install -r requirements.txt && python create_model.py`
   - **Start Command**: `cd backend && gunicorn --bind 0.0.0.0:$PORT app:app`
   - **Instance Type**: Free
4. Click **Create Web Service**
5. **Copy your URL** (e.g., `https://health-assistant-backend-xyz.onrender.com`)

### Step 2: Update Frontend (2 min)
1. Edit `.github/workflows/deploy.yml` line 32:
   ```yaml
   REACT_APP_API_URL: https://YOUR-RENDER-URL.onrender.com/api
   ```
2. Edit `src/utils/api.js` line 6:
   ```javascript
   return 'https://YOUR-RENDER-URL.onrender.com/api';
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update API URL for Render"
   git push origin main
   ```

### Step 3: Enable GitHub Pages (2 min)
1. Go to: https://github.com/vatsalkc/advance-health-assistant/settings/pages
2. **Source**: Select **"GitHub Actions"**
3. Wait 5 minutes

### ✅ Done!
Your app is live at: `https://vatsalkc.github.io/advance-health-assistant/`

---

## 🔍 Test It
- Backend: `https://YOUR-RENDER-URL.onrender.com/api/doctors`
- Frontend: `https://vatsalkc.github.io/advance-health-assistant/`

---

## 📚 Need More Help?
See `RENDER_DEPLOY.md` for detailed instructions.

---

## 💡 Important
- Render free tier sleeps after 15 min inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free (enough for personal use)
