-- Ensure medical-reports bucket exists and is properly configured
-- Run this in Supabase SQL Editor

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'medical-reports', 
  'medical-reports', 
  true, 
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/pdf'];

-- Remove any restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own files" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;

-- Create simple public policies
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'medical-reports');

CREATE POLICY "Authenticated upload access" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'medical-reports' 
    AND auth.role() = 'authenticated'
  );

-- Verify the setup
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'medical-reports';