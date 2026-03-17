-- Debug script to check report access issues
-- Run this in Supabase SQL Editor while logged in as a doctor

-- 1. Check if medical_reports table exists and has data
SELECT 
  'Total reports in system:' as check_type,
  COUNT(*) as count
FROM medical_reports
UNION ALL

-- 2. Check reports for a specific patient (replace with actual patient ID)
SELECT 
  'Reports for specific patient:' as check_type,
  COUNT(*) as count
FROM medical_reports 
WHERE patient_id = 'REPLACE_WITH_PATIENT_ID'
UNION ALL

-- 3. Check current user's doctor record
SELECT 
  'Current user doctor records:' as check_type,
  COUNT(*) as count
FROM doctors 
WHERE auth_id = auth.uid()
UNION ALL

-- 4. Check appointments between current doctor and patients
SELECT 
  'Appointments with current doctor:' as check_type,
  COUNT(*) as count
FROM appointments a
JOIN doctors d ON d.id = a.doctor_id
WHERE d.auth_id = auth.uid();

-- 5. Show sample report data (first 3 reports)
SELECT 
  id,
  patient_id,
  doctor_id,
  report_title,
  report_type,
  LEFT(report_content, 50) as content_preview,
  report_date
FROM medical_reports 
ORDER BY created_at DESC 
LIMIT 3;

-- 6. Show current user's doctor info
SELECT 
  id,
  name,
  specialization,
  auth_id
FROM doctors 
WHERE auth_id = auth.uid();