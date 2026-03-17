-- Fix RLS policies so doctors can see patient-uploaded reports
-- Run this in your Supabase SQL Editor

-- Drop the existing restrictive policy for doctors viewing reports
DROP POLICY IF EXISTS "Doctors can view their patients reports" ON medical_reports;

-- Create a new comprehensive policy that allows doctors to see all reports from their patients
CREATE POLICY "Doctors can view their patients reports" ON medical_reports
  FOR SELECT USING (
    -- Doctors can see reports they created themselves
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = medical_reports.doctor_id 
      AND doctors.auth_id = auth.uid()
    )
    OR
    -- Doctors can see ALL reports from patients they have appointments with
    -- This includes patient-uploaded reports
    EXISTS (
      SELECT 1 FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      WHERE a.user_id = medical_reports.patient_id
      AND d.auth_id = auth.uid()
    )
  );

-- Ensure patients can upload their own reports
DROP POLICY IF EXISTS "Patients can upload own reports" ON medical_reports;
CREATE POLICY "Patients can upload own reports" ON medical_reports
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Test the policy by checking if it works
-- This should return the count of reports visible to the current user
SELECT 
  'Policy test - Reports visible to current user:' as message,
  COUNT(*) as report_count
FROM medical_reports;