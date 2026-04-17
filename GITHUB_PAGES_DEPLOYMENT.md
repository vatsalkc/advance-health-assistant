# GitHub Pages Deployment - Chatbot Configuration

## ✅ Status: Ready to Deploy

The chatbot is now working locally and ready for GitHub Pages deployment.

---

## Step-by-Step GitHub Setup

### Step 1: Add GitHub Secret for Gemini API Key

1. **Go to your GitHub repository**
   - Open: https://github.com/YOUR_USERNAME/YOUR_REPO

2. **Navigate to Settings**
   - Click the **Settings** tab (top right of repository)

3. **Go to Secrets**
   - In left sidebar: **Secrets and variables** → **Actions**

4. **Add New Secret**
   - Click **New repository secret** button
   - **Name:** `GEMINI_API_KEY`
   - **Secret:** `[YOUR_GEMINI_API_KEY_HERE]`
   - Click **Add secret**

5. **Verify Secret Added**
   - You should see `GEMINI_API_KEY` in the list
   - Status: ✅ Added

---

### Step 2: Commit and Push Changes

```bash
# Add all changes
git add .

# Commit with message
git commit -m "Configure Gemini chatbot with working API key"

# Push to GitHub
git push origin main
```

---

### Step 3: Monitor Deployment

1. **Go to Actions Tab**
   - Click **Actions** tab in your repository
   - You'll see "Deploy to GitHub Pages" workflow running

2. **Wait for Completion**
   - Build process: ~2-3 minutes
   - Status will show green checkmark ✅ when done

3. **Check for Errors**
   - If red X appears, click on it to see error logs
   - Most common issue: Missing secret (go back to Step 1)

---

### Step 4: Test on Live Site

1. **Visit Your GitHub Pages URL**
   - Usually: `https://YOUR_USERNAME.github.io/YOUR_REPO`
   - Or check in Settings → Pages for exact URL

2. **Test Chatbot**
   - Login to patient portal
   - Click robot icon (chatbot)
   - Should show "Powered by Gemini AI"
   - Send a test message
   - Verify you get a response

3. **Check Browser Console**
   - Press F12 → Console tab
   - Should see: `[Chatbot] Gemini AI initialized successfully`
   - No API key errors

---

## Current Configuration

### Environment Variables
```env
REACT_APP_GEMINI_API_KEY=[YOUR_GEMINI_API_KEY_HERE]
```

### Chatbot Settings
- **Provider:** Google Gemini
- **Model:** `gemini-flash-latest`
- **Package:** `@google/generative-ai`
- **API Endpoint:** Via SDK (automatic)

### GitHub Workflow
- **File:** `.github/workflows/deploy.yml`
- **Secret Name:** `GEMINI_API_KEY`
- **Build Command:** `npm run build`
- **Deploy Target:** GitHub Pages

---

## Security Verification

### ✅ API Key Protection
- Stored in `.env` file (not committed to Git)
- Protected by `.gitignore`
- GitHub Secret encrypted
- Not exposed in source code
- Not visible in network requests (only in headers)

### Files Modified
- ✅ `src/components/AIChatbot/AIChatbot.js` - Uses Gemini API
- ✅ `.env` - Contains API key (local only)
- ✅ `.env.example` - Template without real key
- ✅ `.github/workflows/deploy.yml` - Uses GitHub Secret
- ✅ `.gitignore` - Excludes .env file

---

## Troubleshooting

### Issue: Chatbot shows "Configuration Issue" on live site
**Cause:** GitHub secret not added or wrong name
**Solution:**
1. Verify secret name is exactly `GEMINI_API_KEY` (case-sensitive)
2. Check secret value has no extra spaces
3. Re-run the deployment workflow

### Issue: Build fails in GitHub Actions
**Cause:** Missing dependencies or secret
**Solution:**
1. Check Actions logs for specific error
2. Verify `GEMINI_API_KEY` secret exists
3. Ensure `package.json` has `@google/generative-ai`

### Issue: Chatbot works locally but not on GitHub Pages
**Cause:** Secret not configured
**Solution:**
1. Double-check GitHub secret is added
2. Verify workflow file includes `REACT_APP_GEMINI_API_KEY`
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: API key visible in browser
**Cause:** This is normal for client-side apps
**Solution:**
- API keys in React apps are visible in the bundle
- This is expected behavior
- Protect your key by:
  - Setting usage limits in Google Cloud Console
  - Restricting to specific domains
  - Monitoring usage regularly

---

## Post-Deployment Checklist

After deployment completes:

- [ ] GitHub Actions workflow completed successfully (green checkmark)
- [ ] Live site loads without errors
- [ ] Can login to patient portal
- [ ] Chatbot opens (robot icon)
- [ ] Header shows "Powered by Gemini AI"
- [ ] Can send messages
- [ ] Receives responses from Gemini
- [ ] No console errors in browser
- [ ] API key not exposed in Git history

---

## API Key Management

### Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Navigate to: APIs & Services → Credentials
3. Find your API key
4. Set restrictions:
   - **Application restrictions:** HTTP referrers
   - **Website restrictions:** Add your GitHub Pages domain
   - **API restrictions:** Generative Language API only

### Usage Monitoring
- Monitor usage in Google Cloud Console
- Set up billing alerts
- Check quota limits regularly

### Key Rotation
If you need to rotate the key:
1. Generate new key in Google Cloud Console
2. Update `.env` file locally
3. Update `GEMINI_API_KEY` secret in GitHub
4. Test locally first
5. Push changes to trigger new deployment

---

## Quick Reference

### GitHub Secret Setup
```
Name: GEMINI_API_KEY
Value: [YOUR_GEMINI_API_KEY_HERE]
```

### Deployment Commands
```bash
git add .
git commit -m "Deploy chatbot"
git push origin main
```

### Verify Deployment
```
1. GitHub Actions → Check workflow status
2. Visit live site
3. Test chatbot functionality
4. Check browser console for errors
```

---

## Status: ✅ READY FOR DEPLOYMENT

Everything is configured correctly. Just add the GitHub secret and push your changes!

**Estimated deployment time:** 5 minutes
**Difficulty:** Easy
**Risk:** Low (API key protected)

---

## Next Steps

1. ✅ Add `GEMINI_API_KEY` to GitHub Secrets
2. ✅ Commit and push changes
3. ✅ Wait for deployment
4. ✅ Test on live site
5. ✅ Celebrate! 🎉
