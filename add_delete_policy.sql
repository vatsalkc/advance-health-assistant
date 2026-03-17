-- Add delete policy for patients to delete their own reports
-- Run this in your Supabase SQL Editor

-- Allow patients to delete their own uploaded reports
DROP POLICY IF EXISTS "Patients can delete own reports" ON medical_reports;
CREATE POLICY "Patients can delete own reports" ON medical_reports
  FOR DELETE USING (
    auth.uid() = patient_id 
    AND (
      -- Only allow deletion of patient-uploaded reports (those with [PATIENT UPLOAD] prefix)
      report_content LIKE '[PATIENT UPLOAD]%'
      OR
      -- Or reports where the doctor_id doesn't match any authenticated doctor
      -- This covers cases where patient uploads use placeholder doctor IDs
      NOT EXISTS (
        SELECT 1 FROM doctors 
        WHERE doctors.id = medical_reports.doctor_id 
        AND doctors.auth_id IS NOT NULL
      )
    )
  );

-- Also add storage delete policy for file cleanup
DROP POLICY IF EXISTS "Patients can delete own files" ON storage.objects;
CREATE POLICY "Patients can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'medical-reports' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'medical_reports' 
AND policyname LIKE '%delete%';