# Debug File Upload Issue

## Problem
Patients upload files but doctors see "No Files" in the reports.

## Debugging Steps

### Step 1: Check Browser Console During Upload
1. **Patient**: Open browser developer tools (F12)
2. **Go to Console tab**
3. **Upload a report with files**
4. **Look for these log messages:**
   - "Attempting to upload X files..."
   - "Uploading file 1/X: filename"
   - "File uploaded successfully to: path"
   - "Generated public URL: url"
   - "All files uploaded successfully. Final URLs: [array]"
   - "Saving report data: {object}"
   - "Report saved successfully: {object}"

### Step 2: Check Database Directly
Run this SQL in **Supabase SQL Editor**:

```sql
-- Check recent reports and their attachments
SELECT 
  id,
  report_title,
  report_type,
  attachments,
  array_length(attachments, 1) as attachment_count,
  created_at
FROM medical_reports 
ORDER BY created_at DESC 
LIMIT 5;
```

**Expected Results:**
- `attachments` should show an array of URLs
- `attachment_count` should show the number of files

### Step 3: Check Doctor View Console
1. **Doctor**: Open browser developer tools (F12)
2. **Go to patient details → Patient Reports tab**
3. **Look for these log messages:**
   - "MyReports - Fetched reports: [array]"
   - "Report 1: {id, title, attachments, attachmentsType, attachmentsLength}"
   - "ReportDownloader - Report: title"
   - "ReportDownloader - Attachments: [array]"

### Step 4: Test Storage Access
1. **Copy a file URL from the console logs**
2. **Paste it in a new browser tab**
3. **Should open/download the file**

## Common Issues and Fixes

### Issue 1: Files Not Uploading
**Symptoms:** Console shows upload errors
**Fix:** Run the storage permissions SQL:
```sql
-- Make bucket public
UPDATE storage.buckets SET public = true WHERE id = 'medical-reports';

-- Add public access policy
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'medical-reports');
```

### Issue 2: Files Upload But Not Saved to Database
**Symptoms:** Console shows successful upload but database has null/empty attachments
**Check:** Look for "Saving report data" log - attachments should be an array of URLs

### Issue 3: Database Saves But Doctor Can't See
**Symptoms:** Database has attachments but doctor sees "No Files"
**Check:** RLS policies might be filtering out the data

### Issue 4: Attachments Field Wrong Type
**Symptoms:** Database shows attachments as string instead of array
**Fix:** Check if attachments column is TEXT[] type:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'medical_reports' 
AND column_name = 'attachments';
```

## Debug Component
Add this to your app temporarily to see raw data:

```jsx
import ReportAttachmentsDebug from './components/Debug/ReportAttachmentsDebug';

// Add to your app
<ReportAttachmentsDebug />
```

## Expected Flow
1. **Patient uploads files** → Files go to Supabase Storage
2. **Get public URLs** → URLs added to attachmentUrls array
3. **Save to database** → attachmentUrls saved as TEXT[] in attachments column
4. **Doctor fetches reports** → Gets reports with attachments array
5. **ReportDownloader checks** → Shows download buttons if attachments exist

## Quick Test
1. **Patient**: Upload a report with 1 image file
2. **Check console**: Should see successful upload messages
3. **Check database**: Run the SQL query above
4. **Doctor**: View patient reports
5. **Should see**: "Download (1)" button instead of "No Files"

If any step fails, that's where the issue is!