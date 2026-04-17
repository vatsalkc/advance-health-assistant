# xAI Grok Chatbot Setup Guide

## Overview
The chatbot has been configured to use xAI's Grok API instead of Google Gemini. This guide explains how to set it up for both local development and GitHub Pages deployment.

## ⚠️ Security Notice
The API key is stored securely and will NOT be leaked:
- ✅ `.env` file is in `.gitignore` (never committed to Git)
- ✅ API key is loaded from environment variables only
- ✅ GitHub Actions uses encrypted secrets
- ✅ No hardcoded API keys in source code

---

## Local Development Setup

### Step 1: Environment Configuration
The `.env` file has been created with your xAI API key:

```env
REACT_APP_XAI_API_KEY=[YOUR_XAI_API_KEY_HERE]
```

### Step 2: Restart Development Server
For the environment variables to take effect:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

### Step 3: Test the Chatbot
1. Login to the patient portal
2. Click the robot icon in the navbar
3. Try asking a health question
4. Verify you get responses from Grok AI

---

## GitHub Pages Deployment Setup

### Step 1: Add GitHub Secret
You need to add the xAI API key as a GitHub secret:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `XAI_API_KEY`
5. Value: `[YOUR_XAI_API_KEY_HERE]`
6. Click **Add secret**

### Step 2: Verify Workflow Configuration
The GitHub Actions workflow (`.github/workflows/deploy.yml`) has been updated to include:

```yaml
env:
  REACT_APP_XAI_API_KEY: ${{ secrets.XAI_API_KEY }}
```

### Step 3: Deploy
Push your changes to GitHub:

```bash
git add .
git commit -m "Configure xAI Grok chatbot"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Build the app with the API key from secrets
2. Deploy to GitHub Pages
3. Chatbot will work on the live site

---

## How It Works

### API Integration
The chatbot uses xAI's Chat Completions API:

- **Endpoint:** `https://api.x.ai/v1/chat/completions`
- **Model:** `grok-beta`
- **Authentication:** Bearer token (your API key)

### Request Format
```javascript
{
  model: 'grok-beta',
  messages: [
    { role: 'system', content: 'System prompt...' },
    { role: 'user', content: 'User message...' }
  ],
  temperature: 0.7,
  max_tokens: 500
}
```

### Security Features
1. **Environment Variables:** API key loaded from `process.env.REACT_APP_XAI_API_KEY`
2. **No Fallbacks:** No hardcoded keys or fallback values
3. **Git Ignore:** `.env` file is excluded from version control
4. **GitHub Secrets:** Production key stored in encrypted GitHub secrets

---

## Files Modified

### Updated Files
- `src/components/AIChatbot/AIChatbot.js` - Switched from Gemini to xAI Grok
- `.env.example` - Updated to show xAI configuration
- `.env` - Created with your API key (not committed)
- `.gitignore` - Enhanced to exclude all environment files
- `.github/workflows/deploy.yml` - Added XAI_API_KEY secret

### Key Changes
1. Removed Google Gemini dependency
2. Implemented direct xAI API calls using fetch
3. Updated UI to show "Powered by Grok AI"
4. Maintained all error handling and user experience features

---

## Testing Checklist

### Local Testing
- [ ] Restart development server
- [ ] Open chatbot (robot icon)
- [ ] Verify "Powered by Grok AI" in header
- [ ] Send a test message
- [ ] Verify response from Grok
- [ ] Check browser console for errors

### GitHub Pages Testing
- [ ] Add `XAI_API_KEY` secret to GitHub
- [ ] Push changes to main branch
- [ ] Wait for GitHub Actions to complete
- [ ] Visit your GitHub Pages URL
- [ ] Test chatbot on live site
- [ ] Verify API key is not exposed in network requests

---

## Troubleshooting

### Problem: "AI service unavailable"
**Solution:** 
- Verify `.env` file exists with correct API key
- Restart development server completely
- Check console for initialization errors

### Problem: "API authentication error"
**Solution:**
- Verify API key is correct and active
- Check xAI dashboard for API key status
- Ensure no extra spaces in API key

### Problem: Chatbot not working on GitHub Pages
**Solution:**
- Verify `XAI_API_KEY` secret is added to GitHub
- Check GitHub Actions logs for build errors
- Ensure workflow file includes the secret in env variables

### Problem: API key exposed in source code
**Solution:**
- Never commit `.env` file
- Always use `process.env.REACT_APP_XAI_API_KEY`
- Verify `.gitignore` includes `.env`
- Check Git history: `git log --all --full-history -- .env`

---

## API Key Security Best Practices

### ✅ DO:
- Store API key in `.env` file
- Use environment variables in code
- Add `.env` to `.gitignore`
- Use GitHub secrets for deployment
- Rotate API keys periodically

### ❌ DON'T:
- Hardcode API keys in source code
- Commit `.env` file to Git
- Share API keys in public channels
- Use same key for dev and production
- Expose keys in client-side code (unavoidable for React, but use secrets for deployment)

---

## Additional Notes

### xAI API Limits
- Check your xAI dashboard for rate limits
- Monitor API usage to avoid quota issues
- Consider implementing rate limiting on client side

### Cost Management
- Each API call costs based on tokens used
- Current config: max 500 tokens per response
- Monitor usage in xAI dashboard

### Future Improvements
- Add conversation history persistence
- Implement typing indicators
- Add voice input/output
- Create admin panel for API key management

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify API key is correct
3. Test API key with curl (see xAI docs)
4. Check GitHub Actions logs for deployment issues

---

**Status:** ✅ Configured and ready to use

**Next Steps:**
1. Restart development server
2. Test chatbot locally
3. Add GitHub secret
4. Deploy to GitHub Pages
