-- Fix RLS policies to allow doctors to see patient-uploaded reports
-- This allows doctors to view reports from their patients regardless of who created them

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Doctors can view their patients reports" ON medical_reports;

-- Create a new policy that allows doctors to see reports from their patients
-- This includes both doctor-created reports and patient-uploaded reports
CREATE POLICY "Doctors can view their patients reports" ON medical_reports
  FOR SELECT USING (
    -- Doctors can see reports they created
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = medical_reports.doctor_id 
      AND doctors.auth_id = auth.uid()
    )
    OR
    -- Doctors can see reports from patients they have appointments with
    EXISTS (
      SELECT 1 FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      WHERE a.user_id = medical_reports.patient_id
      AND d.auth_id = auth.uid()
    )
  );

-- Also add a policy to allow patients to upload their own reports
-- (This might already exist but let's ensure it's there)
DROP POLICY IF EXISTS "Patients can upload own reports" ON medical_reports;
CREATE POLICY "Patients can upload own reports" ON medical_reports
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Allow patients to update their own uploaded reports (optional)
DROP POLICY IF EXISTS "Patients can update own reports" ON medical_reports;
CREATE POLICY "Patients can update own reports" ON medical_reports
  FOR UPDATE USING (
    auth.uid() = patient_id 
    AND (
      -- Only allow updates to patient-uploaded reports (those with [PATIENT UPLOAD] prefix)
      report_content LIKE '[PATIENT UPLOAD]%'
      OR
      -- Or reports where the doctor_id doesn't match any authenticated doctor
      NOT EXISTS (
        SELECT 1 FROM doctors 
        WHERE doctors.id = medical_reports.doctor_id 
        AND doctors.auth_id IS NOT NULL
      )
    )
  );