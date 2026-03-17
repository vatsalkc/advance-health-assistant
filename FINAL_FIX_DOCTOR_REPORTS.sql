-- FINAL FIX: Allow doctors to see patient-uploaded reports
-- This is the definitive solution for the report visibility issue
-- Run this in your Supabase SQL Editor

-- Step 1: Drop all existing policies for medical_reports to start fresh
DROP POLICY IF EXISTS "Patients can view own reports" ON medical_reports;
DROP POLICY IF EXISTS "Doctors can view their patients reports" ON medical_reports;
DROP POLICY IF EXISTS "Doctors can create reports" ON medical_reports;
DROP POLICY IF EXISTS "Doctors can update own reports" ON medical_reports;
DROP POLICY IF EXISTS "Patients can upload own reports" ON medical_reports;
DROP POLICY IF EXISTS "Patients can update own reports" ON medical_reports;

-- Step 2: Create comprehensive policies that work for both patient uploads and doctor access

-- Policy 1: Patients can view their own reports
CREATE POLICY "Patients can view own reports" ON medical_reports
  FOR SELECT USING (auth.uid() = patient_id);

-- Policy 2: Patients can insert their own reports
CREATE POLICY "Patients can insert own reports" ON medical_reports
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Policy 3: Patients can update their own reports
CREATE POLICY "Patients can update own reports" ON medical_reports
  FOR UPDATE USING (auth.uid() = patient_id);

-- Policy 4: Doctors can view ALL reports from their patients (MOST IMPORTANT)
-- This allows doctors to see both their own reports AND patient-uploaded reports
CREATE POLICY "Doctors can view patient reports" ON medical_reports
  FOR SELECT USING (
    -- Check if the current user is a doctor who has appointments with this patient
    EXISTS (
      SELECT 1 
      FROM doctors d
      JOIN appointments a ON a.doctor_id = d.id
      WHERE d.auth_id = auth.uid()
      AND a.user_id = medical_reports.patient_id
    )
  );

-- Policy 5: Doctors can create reports for their patients
CREATE POLICY "Doctors can create reports" ON medical_reports
  FOR INSERT WITH CHECK (
    -- Check if the current user is a doctor and the doctor_id matches
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = medical_reports.doctor_id 
      AND doctors.auth_id = auth.uid()
    )
    AND
    -- Ensure the doctor has appointments with this patient
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.doctor_id = medical_reports.doctor_id
      AND appointments.user_id = medical_reports.patient_id
    )
  );

-- Policy 6: Doctors can update their own reports
CREATE POLICY "Doctors can update own reports" ON medical_reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = medical_reports.doctor_id 
      AND doctors.auth_id = auth.uid()
    )
  );

-- Step 3: Verify the policies work by testing visibility
-- This should show reports visible to the current user
SELECT 
  'Reports visible to current user:' as test_result,
  COUNT(*) as count,
  STRING_AGG(report_title, ', ') as sample_titles
FROM medical_reports;

-- Step 4: Show sample data for verification
SELECT 
  'Sample medical reports:' as info,
  id,
  patient_id,
  doctor_id,
  report_title,
  CASE 
    WHEN report_content LIKE '[PATIENT UPLOAD]%' THEN 'Patient Upload'
    ELSE 'Doctor Created'
  END as report_source,
  report_date
FROM medical_reports 
ORDER BY created_at DESC 
LIMIT 5;