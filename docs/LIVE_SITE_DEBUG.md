# 🔍 Live Site Debugging Guide

## 🎯 Issues Reported
1. **Symptom checker not working on live GitHub Pages**
2. **Dashboard not showing data properly**

---

## ✅ Fixes Applied

### 1. Symptom Checker - Made More Robust
- ✅ Prediction now works even if database save fails
- ✅ Added detailed console logging with `[SymptomChecker]` prefix
- ✅ Database save is non-fatal (won't stop prediction)
- ✅ Better error messages

### 2. Dashboard - Better Error Handling
- ✅ Added detailed console logging with `[Dashboard]` prefix
- ✅ Better date comparison for upcoming appointments
- ✅ Handles missing session gracefully
- ✅ Shows user name even if metadata is missing

---

## 🧪 How to Debug Live Site

### Step 1: Open Live Site with Console
1. Go to: https://vatsalkc.github.io/advance-health-assistant/
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Keep it open while testing

### Step 2: Check for Errors on Load
Look for these messages in console:
```
[Dashboard] Fetching dashboard data...
[Dashboard] User ID: [your-id]
[Dashboard] Appointments result: {...}
[Dashboard] Medicines result: {...}
[Dashboard] Symptom checks result: {...}
[Dashboard] Dashboard data loaded successfully
```

**If you see errors:**
- Copy the exact error message
- Check if it's a Supabase connection error
- Check if it's an authentication error

### Step 3: Test Symptom Checker
1. Go to Symptom Checker page
2. Add symptoms: fever, cough, fatigue
3. Click "Check Symptoms"
4. Watch console for:
```
[SymptomChecker] Checking symptoms: ["fever", "cough", "fatigue"]
[SymptomChecker] Prediction result: {disease: "...", ...}
[SymptomChecker] User logged in, saving to database
[SymptomChecker] Saved successfully: {...}
[SymptomChecker] Passing result to parent
```

**If prediction doesn't show:**
- Check if you see the prediction result in console
- Check if there's an error after "Passing result to parent"
- Copy any error messages

### Step 4: Check Network Tab
1. Open DevTools → **Network** tab
2. Filter by "supabase"
3. Look for requests to Supabase
4. Check status codes:
   - ✅ 200 = Success
   - ❌ 401 = Not authenticated
   - ❌ 403 = Permission denied (RLS policy)
   - ❌ 500 = Server error

---

## 🔧 Common Issues & Solutions

### Issue 1: "No session found"
**Symptom**: Dashboard shows loading forever, console shows "No session found"

**Solution**:
1. Clear browser cache and cookies
2. Go to Application tab → Storage → Clear site data
3. Refresh page
4. Register/Login again

### Issue 2: "RLS policy violation"
**Symptom**: Console shows "new row violates row-level security policy"

**Solution**:
This means Supabase RLS policies are blocking the operation.

**Check in Supabase Dashboard**:
1. Go to: https://supabase.com/dashboard/project/mklbffjqlcvowdardqkb
2. Click "Authentication" → Check if user exists
3. Click "Table Editor" → Check if tables have data
4. Click "Database" → "Policies" → Verify RLS policies exist

**If policies are missing, run this SQL**:
```sql
-- Enable RLS
ALTER TABLE symptom_checks ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own symptom checks" ON symptom_checks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own symptom checks" ON symptom_checks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Issue 3: Symptom checker shows prediction but doesn't navigate
**Symptom**: Console shows prediction result but page doesn't change

**Solution**:
This is likely a navigation issue in the parent component.

**Check**:
1. Look for errors after "[SymptomChecker] Passing result to parent"
2. Check if DoctorRecommendation component loads
3. Check browser console for React errors

### Issue 4: Dashboard counts show 0 but data exists
**Symptom**: Dashboard shows 0 for all counts, but you have data

**Solution**:
1. Check console for "[Dashboard] Loaded X appointments" messages
2. If it says "Loaded 0" but you have data:
   - Check if user_id matches in Supabase tables
   - Go to Supabase → Table Editor → symptom_checks
   - Check if user_id column matches your auth user ID

**Get your user ID**:
```javascript
// Run in browser console:
supabase.auth.getSession().then(({data}) => console.log(data.session.user.id))
```

### Issue 5: Environment variables not loaded
**Symptom**: Console shows "undefined" for Supabase URL or key

**Solution**:
1. Check if GitHub secret was added correctly
2. Verify secret name is exactly: `SUPABASE_ANON_KEY`
3. Re-run GitHub Actions workflow
4. Check build logs in GitHub Actions

---

## 📊 What to Check in Supabase Dashboard

### 1. Authentication
Go to: Authentication → Users
- ✅ Check if your user exists
- ✅ Check user ID
- ✅ Check email confirmed status

### 2. Database Tables
Go to: Table Editor

**Check `symptom_checks` table**:
- ✅ Has rows with your user_id
- ✅ `symptoms` column is array type
- ✅ `precautions` column is array type
- ✅ Data looks correct

**Check `appointments` table**:
- ✅ Has your appointments
- ✅ user_id matches your auth user

**Check `medicines` table**:
- ✅ Has your medicines
- ✅ user_id matches your auth user

### 3. RLS Policies
Go to: Database → Policies

**Verify these policies exist**:
- ✅ symptom_checks: "Users can view own symptom checks"
- ✅ symptom_checks: "Users can create own symptom checks"
- ✅ appointments: "Users can view own appointments"
- ✅ medicines: "Users can view own medicines"

---

## 🧪 Manual Testing Steps

### Test 1: Fresh User Registration
1. Open live site in incognito/private window
2. Register new account
3. Check console for errors
4. Should redirect to dashboard
5. Dashboard should show 0 for all counts (normal for new user)

### Test 2: Symptom Checker
1. Go to Symptom Checker
2. Add symptoms: fever, cough, fatigue, body aches
3. Click "Check Symptoms"
4. Should see prediction result
5. Should see doctor recommendations
6. Check console for success messages

### Test 3: Dashboard Update
1. After symptom check, go back to Dashboard
2. "Symptoms Checked" should now be 1
3. Recent symptom check should appear in list
4. Check console for dashboard data

### Test 4: Appointment Booking
1. Book an appointment
2. Go to Dashboard
3. "Total Appointments" should increase
4. Appointment should appear in upcoming list

---

## 📝 Information to Collect

If issues persist, collect this information:

### 1. Browser Console Logs
Copy ALL console messages, especially:
- Lines starting with `[Dashboard]`
- Lines starting with `[SymptomChecker]`
- Any red error messages
- Any yellow warnings

### 2. Network Tab
- Screenshot of Supabase requests
- Status codes of failed requests
- Response data of failed requests

### 3. Supabase Dashboard
- Screenshot of symptom_checks table
- Screenshot of RLS policies
- Screenshot of auth users

### 4. Steps to Reproduce
- Exact steps you followed
- What you expected to happen
- What actually happened

---

## 🚀 Quick Fixes to Try

### Fix 1: Clear Everything and Start Fresh
```javascript
// Run in browser console on live site:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Fix 2: Force Re-authentication
1. Logout
2. Clear browser data
3. Close browser
4. Open browser again
5. Go to live site
6. Register new account

### Fix 3: Rebuild and Redeploy
1. Make a small change to code (add a comment)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Trigger rebuild"
   git push origin main
   ```
3. Wait for GitHub Actions to complete
4. Clear browser cache
5. Test again

---

## 🎯 Expected Console Output

### On Dashboard Load (Success):
```
[Dashboard] Fetching dashboard data...
[Dashboard] User ID: abc123-def456-...
[Dashboard] Appointments result: {data: Array(0), error: null, ...}
[Dashboard] Medicines result: {data: Array(0), error: null, ...}
[Dashboard] Symptom checks result: {data: Array(0), error: null, ...}
[Dashboard] Loaded 0 appointments
[Dashboard] Loaded 0 active medicines
[Dashboard] Loaded 0 symptom checks
[Dashboard] Dashboard data loaded successfully
```

### On Symptom Check (Success):
```
[SymptomChecker] Checking symptoms: ["fever", "cough", "fatigue"]
[SymptomChecker] Prediction result: {
  disease: "Influenza (Flu)",
  specialization: "General Physician",
  confidence: 75,
  ...
}
[SymptomChecker] User logged in, saving to database
[SymptomChecker] Saving data: {...}
[SymptomChecker] Saved successfully: {id: 1, ...}
[SymptomChecker] Passing result to parent
```

---

## 📞 Next Steps

1. **Test on live site** with console open
2. **Copy all console messages**
3. **Take screenshots** of any errors
4. **Check Supabase dashboard** for data
5. **Report back** with collected information

---

**The code is now more robust and should work on GitHub Pages. Test it and let me know what you see in the console!**

---

*Last Updated: January 30, 2026*
