-- ============================================
-- Fix Doctor Permissions for Appointments
-- This allows doctors to modify and cancel appointments
-- ============================================

-- Add policies for doctors to manage their appointments
DROP POLICY IF EXISTS "Doctors can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Doctors can update their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Doctors can delete their appointments" ON public.appointments;

-- Policy for doctors to view their appointments
CREATE POLICY "Doctors can view their appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  doctor_id IN (
    SELECT id FROM public.doctors WHERE auth_id = auth.uid()
  )
);

-- Policy for doctors to update their appointments
CREATE POLICY "Doctors can update their appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (
  doctor_id IN (
    SELECT id FROM public.doctors WHERE auth_id = auth.uid()
  )
);

-- Policy for doctors to delete their appointments
CREATE POLICY "Doctors can delete their appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (
  doctor_id IN (
    SELECT id FROM public.doctors WHERE auth_id = auth.uid()
  )
);

-- Verify policies
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'appointments'
ORDER BY policyname;
