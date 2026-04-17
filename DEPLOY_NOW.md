# 🚀 Deploy to GitHub Pages - Quick Start

## ✅ Chatbot is Working Locally!

Now let's make it work on GitHub Pages in 3 simple steps.

---

## Step 1: Add GitHub Secret (2 minutes)

### Go to GitHub Repository Settings
1. Open your repository on GitHub
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Add the Secret
- **Name:** `GEMINI_API_KEY`
- **Value:** `[YOUR_GEMINI_API_KEY_HERE]`
- Click **Add secret**

✅ Done! You should see `GEMINI_API_KEY` in the secrets list.

---

## Step 2: Push Changes (1 minute)

Open your terminal and run:

```bash
git add .
git commit -m "Configure Gemini chatbot"
git push origin main
```

✅ Done! Changes are pushed to GitHub.

---

## Step 3: Wait for Deployment (2-3 minutes)

1. Go to **Actions** tab in your GitHub repository
2. You'll see "Deploy to GitHub Pages" workflow running
3. Wait for green checkmark ✅
4. Visit your GitHub Pages URL
5. Test the chatbot!

✅ Done! Chatbot is live on GitHub Pages.

---

## Test Checklist

On your live site:
- [ ] Login to patient portal
- [ ] Click robot icon
- [ ] See "Powered by Gemini AI"
- [ ] Send a test message
- [ ] Get a response from Gemini

---

## If Something Goes Wrong

### Chatbot shows "Configuration Issue"
→ Make sure you added the GitHub secret with exact name: `GEMINI_API_KEY`

### Build fails in GitHub Actions
→ Check the Actions logs for specific error message

### Works locally but not on live site
→ Clear browser cache (Ctrl+Shift+R) and try again

---

## Summary

✅ Local chatbot: Working
✅ API key: Secured in .env (not committed)
✅ GitHub workflow: Configured
✅ Model: gemini-flash-latest
✅ Ready to deploy!

**Total time:** ~5 minutes
**Difficulty:** Easy

---

## What Happens Next?

1. You add the GitHub secret
2. You push your code
3. GitHub Actions builds your app with the API key
4. App deploys to GitHub Pages
5. Chatbot works on live site! 🎉

---

**Need help?** Check `GITHUB_PAGES_DEPLOYMENT.md` for detailed instructions.
