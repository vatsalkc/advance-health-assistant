# 🔧 Troubleshooting Guide

## Issues Reported

### 1. Symptom Checker Not Working
### 2. Dashboard Not Showing Counts

---

## ✅ Fixes Applied

### Dashboard Fix:
**Problem**: Dashboard was trying to use old Flask backend API with axios
**Solution**: Updated to use Supabase API

**Changes Made**:
- Removed `axios` imports
- Replaced API calls with `statsAPI.get()`, `appointmentsAPI.getAll()`, etc.
- Fixed symptom checks display format (symptoms are stored as comma-separated string)
- Added proper error handling

### Symptom Checker Fix:
**Problem**: Component was trying to fetch symptoms from Flask backend
**Solution**: Use local disease database

**Changes Made**:
- Import `allSymptoms` from `diseaseDatabase.js`
- Remove `fetchAllSymptoms()` function
- Update API response handling

---

## 🧪 How to Test

### Test Dashboard:
1. Login to the application
2. You should see the dashboard with:
   - Total Appointments count
   - Active Medicines count
   - Symptoms Checked count
3. All counts should be 0 if you're a new user

### Test Symptom Checker:
1. Go to "Symptom Checker" from navigation
2. Type a symptom (e.g., "fever")
3. You should see autocomplete suggestions
4. Click "Add" or press Enter
5. Add more symptoms (e.g., "cough", "fatigue")
6. Click "Check Symptoms"
7. You should see:
   - Disease prediction
   - Confidence percentage
   - Recommended specialist
   - Precautions list
   - Doctor recommendations

---

## 🔍 Debugging Steps

### If Dashboard Counts Are Still 0:

**Step 1: Check Browser Console**
```
1. Press F12 to open DevTools
2. Go to Console tab
3. Look for errors (red text)
4. Look for these log messages:
   - "Stats fetched: {totalAppointments: X, ...}"
   - "Appointments fetched: X"
   - "Medicines fetched: X"
   - "Symptom checks fetched: X"
```

**Step 2: Check Supabase Connection**
```
1. Open DevTools → Network tab
2. Refresh the page
3. Look for requests to "supabase.co"
4. Check if they return 200 status
5. Click on a request to see response data
```

**Step 3: Verify Data in Supabase**
```
1. Go to: https://supabase.com/dashboard/project/mklbffjqlcvowdardqkb
2. Click "Table Editor"
3. Check these tables:
   - appointments (should have your appointments)
   - medicines (should have your medicines)
   - symptom_checks (should have your symptom checks)
4. Verify user_id matches your user
```

**Step 4: Test API Manually**
```javascript
// Open browser console and run:
import { statsAPI } from './utils/api';
statsAPI.get().then(console.log).catch(console.error);
```

### If Symptom Checker Doesn't Work:

**Step 1: Check Console for Errors**
```
1. Open symptom checker page
2. Press F12 → Console
3. Look for errors when:
   - Page loads
   - You type symptoms
   - You click "Check Symptoms"
```

**Step 2: Verify Disease Database Loaded**
```javascript
// Open browser console and run:
import { predictDisease } from './data/diseaseDatabase';
console.log(predictDisease(['fever', 'cough', 'fatigue']));
```

**Step 3: Test Symptom Check API**
```javascript
// Open browser console and run:
import { symptomCheckAPI } from './utils/api';
symptomCheckAPI.check(['fever', 'cough']).then(console.log).catch(console.error);
```

**Step 4: Check Network Requests**
```
1. Open DevTools → Network tab
2. Click "Check Symptoms"
3. Look for POST request to Supabase
4. Check if it returns 200 or error
5. View response data
```

---

## 🐛 Common Issues & Solutions

### Issue: "Not authenticated" error
**Solution**: 
```javascript
// Check if user is logged in
console.log(localStorage.getItem('supabase.auth.token'));
// If null, login again
```

### Issue: "RLS policy violation" error
**Solution**: 
```sql
-- Run this in Supabase SQL Editor:
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('appointments', 'medicines', 'symptom_checks');

-- If policies are missing, re-run supabase_schema.sql
```

### Issue: Counts show 0 but data exists
**Solution**:
```javascript
// Check if user_id matches
// In Supabase Table Editor, check user_id column
// Compare with your auth user ID:
import { supabase } from './config/supabase';
supabase.auth.getSession().then(({data}) => console.log(data.session.user.id));
```

### Issue: Symptom checker shows "Unable to connect to server"
**Solution**:
```javascript
// This error is from old code trying to reach Flask backend
// Make sure you have the latest code:
// 1. Check src/components/SymptomChecker/SymptomChecker.js
// 2. Should import from diseaseDatabase, not use axios
// 3. Should call symptomCheckAPI.check() not axios.post()
```

---

## 📊 Expected Behavior

### Dashboard After Fresh Login:
```
Total Appointments: 0
Active Medicines: 0
Symptoms Checked: 0
Upcoming Appointments: No upcoming appointments
Active Medicines: No active medicines
Recent Symptom Checks: No symptom checks yet
```

### Dashboard After Adding Data:
```
Total Appointments: 1 (after booking appointment)
Active Medicines: 1 (after adding medicine)
Symptoms Checked: 1 (after checking symptoms)
Lists show recent items
```

### Symptom Checker Flow:
```
1. User adds symptoms → Symptoms appear as badges
2. User clicks "Check Symptoms" → Loading state
3. Prediction appears → Disease name, confidence, specialist
4. Doctor recommendations load → List of doctors
5. User can book appointment → Opens appointment modal
```

---

## 🔄 If Nothing Works

### Nuclear Option - Clear Everything:
```javascript
// Open browser console and run:
localStorage.clear();
sessionStorage.clear();
// Then refresh page and login again
```

### Verify Latest Code:
```bash
# Check if files were updated
git status
git log --oneline -5

# If needed, pull latest changes
git pull origin main
```

### Reinstall Dependencies:
```bash
# Stop the app (Ctrl+C)
rm -rf node_modules
npm install
npm start
```

---

## 📞 Still Having Issues?

### Collect Debug Information:

1. **Browser Console Logs**
   - Copy all errors (red text)
   - Copy all warnings (yellow text)

2. **Network Tab**
   - Screenshot of failed requests
   - Copy request/response data

3. **Supabase Dashboard**
   - Check if tables have data
   - Check if RLS policies exist
   - Check Auth users list

4. **Code Version**
   - Run: `git log --oneline -1`
   - Check file timestamps

### Share This Information:
- Browser console errors
- Network request failures
- Supabase table data
- Steps to reproduce

---

## ✅ Verification Checklist

After fixes, verify:
- [ ] App compiles without errors
- [ ] Can login successfully
- [ ] Dashboard loads without errors
- [ ] Dashboard shows correct counts
- [ ] Can navigate to Symptom Checker
- [ ] Can add symptoms
- [ ] Can check symptoms
- [ ] Prediction appears
- [ ] Doctor recommendations load
- [ ] Can book appointment
- [ ] Dashboard counts update after actions

---

**Last Updated**: January 30, 2026
