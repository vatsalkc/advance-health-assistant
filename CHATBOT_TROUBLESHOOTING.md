# AI Chatbot Troubleshooting Guide

## Issue: "API key not configured" Error

### Problem
The AI chatbot shows error messages like:
- "I apologize, but the AI chatbot is not properly configured"
- "The API key is missing from the environment variables"
- "API key not configured. Please contact administrator."

### Root Cause
React development server needs to be restarted to pick up new environment variables.

### Solution

#### Step 1: Verify API Key in .env File
1. Check that `.env` file exists in the root directory
2. Ensure it contains: `REACT_APP_GEMINI_API_KEY=your_api_key_here`
3. Make sure there are no spaces around the `=` sign

#### Step 2: Restart Development Server
1. Stop the current development server (Ctrl+C in terminal)
2. Start it again with: `npm start` or `yarn start`
3. Wait for the server to fully restart

#### Step 3: Test the Chatbot
1. Open the AI chatbot in the application
2. Check the browser console for debug messages:
   ```
   [Chatbot] API Key available: true
   [Chatbot] API Key length: 39
   ```
3. Try sending a test message

### Expected Behavior After Fix
- ✅ Chatbot initializes without error messages
- ✅ Quick question buttons are enabled
- ✅ Input field shows normal placeholder text
- ✅ Messages can be sent and receive AI responses
- ✅ Header shows "Powered by Gemini AI" without warning icon

### Visual Indicators
- **Working**: Normal chatbot interface with enabled input
- **Not Working**: 
  - Warning icon in header: "⚠️ Configuration Issue"
  - Disabled input field with error placeholder
  - No quick question buttons
  - Error messages in chat

### Alternative Solutions

#### Option A: Check Environment Variable Loading
```bash
# In terminal, check if variable is loaded
echo $REACT_APP_GEMINI_API_KEY
```

#### Option B: Verify .env File Location
- Ensure `.env` is in the same directory as `package.json`
- Check file permissions (should be readable)

#### Option C: Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click refresh button → "Empty Cache and Hard Reload"
3. Or use Ctrl+Shift+R

### Debug Information
The chatbot now includes:
- Visual status indicator in header
- Disabled state when API key is missing
- Clear error messages with troubleshooting hints
- Console logging for debugging

### Contact Support
If the issue persists after following these steps:
1. Check browser console for additional error messages
2. Verify the API key is valid and has proper permissions
3. Ensure network connectivity to Google's Gemini API
4. Contact the development team with console logs