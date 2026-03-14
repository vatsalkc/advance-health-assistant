-- Add patient_name and patient_phone columns to appointments table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_name TEXT,
ADD COLUMN IF NOT EXISTS patient_phone TEXT;

-- Update existing appointments to populate patient_name and patient_phone from users table
UPDATE public.appointments apt
SET 
  patient_name = u.name,
  patient_phone = u.phone
FROM public.users u
WHERE apt.user_id = u.id
AND apt.patient_name IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient_name ON public.appointments(patient_name);

COMMENT ON COLUMN public.appointments.patient_name IS 'Patient name for easy access by doctors';
COMMENT ON COLUMN public.appointments.patient_phone IS 'Patient phone number for contact';
