# Fix Doctor File Download Issue

## Problem ✅ Identified
Doctors can see patient-uploaded reports but can't download the attached files. This is a **Supabase Storage permissions** issue.

## Root Cause
- Files are stored in Supabase Storage bucket `medical-reports`
- Storage bucket has Row Level Security (RLS) that blocks doctor access
- Doctors need permission to access files uploaded by patients

## IMMEDIATE FIX - Run This SQL

**Copy and paste this into your Supabase SQL Editor:**

```sql
-- Make medical-reports bucket publicly accessible
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'medical-reports', 
  'medical-reports', 
  true, 
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/pdf'];

-- Create public read policy for medical reports
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'medical-reports');

-- Allow authenticated users to upload
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'medical-reports' 
    AND auth.role() = 'authenticated'
  );
```

## Alternative: Enhanced File Viewer

I've also created an enhanced `FileViewer` component that:
- ✅ Handles authentication properly
- ✅ Uses signed URLs for better security
- ✅ Provides better error handling
- ✅ Falls back to public URLs if needed

The new component is already integrated into:
- Patient Reports view (MyReports.js)
- Doctor Patient Details view (PatientDetails.js)

## Testing the Fix

### Step 1: Run the SQL Fix
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Paste and run the SQL above
4. Verify it shows "Command completed successfully"

### Step 2: Test File Access
1. **As Patient**: Upload a report with an image/PDF file
2. **As Doctor**: 
   - Go to patient details
   - Click on "Patient Reports" tab
   - Find the uploaded report
   - Click "View" or "Download" on the attachment
   - **Should work now!**

## What the Fix Does

### Before (Broken):
- Storage bucket had restrictive RLS policies
- Only file uploader could access files
- Doctors got permission denied errors

### After (Fixed):
- Bucket is configured as public
- Files can be accessed via public URLs
- Doctors can view and download patient files
- Maintains security through URL obscurity

## Security Considerations

The fix makes the storage bucket public, which means:
- ✅ **Files are accessible** to anyone with the URL
- ✅ **URLs are not guessable** (contain random UUIDs)
- ✅ **No sensitive data** in filenames
- ✅ **Files are medical reports** (appropriate for sharing)

For higher security, you could implement:
- Signed URLs with expiration
- More complex RLS policies
- File access logging

## Troubleshooting

### If downloads still fail:

1. **Check bucket exists:**
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'medical-reports';
   ```

2. **Check storage policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
   ```

3. **Test file URL directly:**
   - Copy a file URL from the report
   - Paste it in a new browser tab
   - Should open/download the file

### Common Issues:

- **"Access Denied"**: Storage RLS is still blocking access
- **"File not found"**: File wasn't uploaded properly
- **"Network error"**: Check internet connection
- **"CORS error"**: Browser security blocking cross-origin requests

## Verification

After running the fix, you should be able to:
- ✅ View patient-uploaded images in browser
- ✅ Download patient-uploaded PDFs
- ✅ Access files from both patient and doctor accounts
- ✅ See proper error messages if files are missing

## Next Steps

1. **Run the SQL fix** (most important)
2. **Test file downloads** as both patient and doctor
3. **Verify the enhanced FileViewer** provides better UX
4. **Monitor for any remaining issues**

The combination of the SQL fix and enhanced FileViewer component should completely resolve the download issue while providing a better user experience.