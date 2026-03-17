-- Debug script to check attachments in medical_reports table
-- Run this in Supabase SQL Editor to see what's in the database

-- Check the structure of the medical_reports table
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'medical_reports' 
AND column_name = 'attachments';

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
LIMIT 10;

-- Check if any reports have attachments
SELECT 
  COUNT(*) as total_reports,
  COUNT(CASE WHEN attachments IS NOT NULL THEN 1 END) as reports_with_attachments,
  COUNT(CASE WHEN array_length(attachments, 1) > 0 THEN 1 END) as reports_with_files
FROM medical_reports;

-- Show sample attachment data
SELECT 
  id,
  report_title,
  attachments[1] as first_attachment,
  attachments
FROM medical_reports 
WHERE attachments IS NOT NULL 
AND array_length(attachments, 1) > 0
LIMIT 5;