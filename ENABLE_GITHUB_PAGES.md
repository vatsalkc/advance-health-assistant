# 🚀 Enable GitHub Pages - Quick Guide

Your "Launch Live Demo" button will work once GitHub Pages is enabled. Follow these simple steps:

## ⚡ Quick Setup (2 minutes)

### Step 1: Go to Repository Settings
Click here: [Repository Settings](https://github.com/vatsalkc/advance-health-assistant/settings/pages)

Or manually:
1. Go to your repository: https://github.com/vatsalkc/advance-health-assistant
2. Click **"Settings"** tab (top right)
3. Click **"Pages"** in the left sidebar

### Step 2: Configure GitHub Pages

Under **"Build and deployment"**:

1. **Source**: Select **"GitHub Actions"** from the dropdown
   - ⚠️ Do NOT select "Deploy from a branch"
   - ✅ Select "GitHub Actions"

2. Click **"Save"** (if there's a save button)

### Step 3: Wait for Deployment

1. Go to **Actions** tab: https://github.com/vatsalkc/advance-health-assistant/actions
2. You'll see "Deploy to GitHub Pages" workflow running
3. Wait 3-5 minutes for it to complete (green checkmark ✅)

### Step 4: Access Your Live Demo

Once deployment is complete, your app will be live at:
**https://vatsalkc.github.io/advance-health-assistant/**

The "Launch Live Demo" button will now work! 🎉

## 🔍 Troubleshooting

### If the workflow doesn't start automatically:
1. Go to Actions tab
2. Click "Deploy to GitHub Pages" workflow
3. Click "Run workflow" button
4. Select "main" branch
5. Click "Run workflow"

### If you see a 404 error:
- Wait a few more minutes (first deployment can take up to 10 minutes)
- Clear your browser cache
- Try in incognito/private mode

### If the workflow fails:
1. Check the error message in Actions tab
2. Make sure GitHub Pages is set to "GitHub Actions" (not "Deploy from a branch")
3. Try running the workflow again

## ✅ Verification

Once it's working, you should see:
- ✅ Green checkmark in Actions tab
- ✅ Live URL accessible: https://vatsalkc.github.io/advance-health-assistant/
- ✅ "Launch Live Demo" button works
- ✅ Full health assistant application loads

## 📞 Need Help?

If you're still having issues:
1. Check that GitHub Pages is enabled in Settings > Pages
2. Verify the workflow completed successfully in Actions tab
3. Wait 10 minutes after first deployment
4. Try accessing the URL directly: https://vatsalkc.github.io/advance-health-assistant/

---

**Once enabled, your health assistant will be live and accessible to anyone!** 🌟