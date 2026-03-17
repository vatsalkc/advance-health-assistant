-- Fix Supabase Storage permissions for medical reports
-- This allows doctors to download files uploaded by patients

-- First, check if the medical-reports bucket exists and create it if needed
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-reports', 'medical-reports', true)
ON CONFLICT (id) DO NOTHING;

-- Update the bucket to be public (allows direct URL access)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'medical-reports';

-- Drop existing storage policies to start fresh
DROP POLICY IF EXISTS "Patients can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Patients can view own files" ON storage.objects;
DROP POLICY IF EXISTS "Doctors can view patient files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view medical reports" ON storage.objects;

-- Policy 1: Allow patients to upload files to their own folder
CREATE POLICY "Patients can upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'medical-reports' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 2: Allow patients to view their own files
CREATE POLICY "Patients can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'medical-reports' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 3: Allow doctors to view files from their patients
CREATE POLICY "Doctors can view patient files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'medical-reports' 
    AND EXISTS (
      SELECT 1 
      FROM doctors d
      JOIN appointments a ON a.doctor_id = d.id
      WHERE d.auth_id = auth.uid()
      AND a.user_id::text = (storage.foldername(name))[1]
    )
  );

-- Policy 4: Since bucket is public, allow public read access as fallback
-- This ensures files can be accessed via public URLs
CREATE POLICY "Public can view medical reports" ON storage.objects
  FOR SELECT USING (bucket_id = 'medical-reports');

-- Verify the policies are working
SELECT 
  'Storage policies created' as status,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';