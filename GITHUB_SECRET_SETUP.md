# GitHub Secret Setup - Quick Guide

## 🚀 Make Chatbot Work on GitHub Pages

Follow these exact steps to configure the xAI API key for GitHub Pages:

---

## Step 1: Go to Repository Settings

1. Open your GitHub repository in browser
2. Click the **Settings** tab (top right)

---

## Step 2: Navigate to Secrets

1. In the left sidebar, click **Secrets and variables**
2. Click **Actions**

---

## Step 3: Add New Secret

1. Click the green **New repository secret** button
2. Fill in the form:
   - **Name:** `XAI_API_KEY`
   - **Secret:** `[YOUR_XAI_API_KEY_HERE]`
3. Click **Add secret**

---

## Step 4: Verify Secret Added

You should see:
- Secret name: `XAI_API_KEY`
- Status: ✅ Added
- Last updated: Just now

---

## Step 5: Push Changes

```bash
git add .
git commit -m "Configure xAI Grok chatbot"
git push origin main
```

---

## Step 6: Wait for Deployment

1. Go to **Actions** tab in GitHub
2. Watch the deployment workflow run
3. Wait for green checkmark ✅
4. Takes about 2-3 minutes

---

## Step 7: Test on Live Site

1. Visit your GitHub Pages URL
2. Login to patient portal
3. Click robot icon (chatbot)
4. Send a test message
5. Verify you get response from Grok AI

---

## ✅ Success Indicators

- Chatbot header shows "Powered by Grok AI"
- Messages get responses within 2-5 seconds
- No "configuration issue" warnings
- No API key errors in console

---

## ❌ Troubleshooting

### If chatbot shows "Configuration Issue":
1. Verify secret name is exactly `XAI_API_KEY` (case-sensitive)
2. Check secret value has no extra spaces
3. Re-run the GitHub Actions workflow

### If deployment fails:
1. Check Actions tab for error logs
2. Verify all files are committed
3. Ensure package.json has no errors

### If chatbot works locally but not on GitHub Pages:
1. Double-check secret is added
2. Verify workflow file includes `REACT_APP_XAI_API_KEY`
3. Clear browser cache and hard refresh

---

## 📋 Checklist

Before pushing to GitHub:
- [ ] `.env` file exists locally (for development)
- [ ] `.env` is in `.gitignore` (verify with `git status`)
- [ ] GitHub secret `XAI_API_KEY` is added
- [ ] Workflow file includes the secret
- [ ] All changes are committed

After deployment:
- [ ] GitHub Actions workflow completed successfully
- [ ] Live site loads without errors
- [ ] Chatbot opens and shows Grok branding
- [ ] Test message gets response
- [ ] No API key visible in network tab

---

## 🔒 Security Verification

To verify API key is not leaked:

1. **Check Git history:**
   ```bash
   git log --all --full-history -- .env
   ```
   Should show: "fatal: ambiguous argument '.env': unknown revision"

2. **Check committed files:**
   ```bash
   git ls-files | grep .env
   ```
   Should only show: `.env.example`

3. **Check network requests:**
   - Open browser DevTools → Network tab
   - Send chatbot message
   - Check request headers
   - API key should be in Authorization header (normal)
   - API key should NOT be in URL or visible in response

---

## 📞 Need Help?

If you're stuck:
1. Check `XAI_CHATBOT_SETUP.md` for detailed guide
2. Review GitHub Actions logs for specific errors
3. Verify API key is active in xAI dashboard
4. Test API key with curl command (see xAI docs)

---

**Time Required:** 5 minutes
**Difficulty:** Easy
**Status:** Ready to deploy ✅
