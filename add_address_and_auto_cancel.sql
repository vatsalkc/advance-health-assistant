-- Add address column to doctors table
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add address to appointments table so it's stored when booking
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS doctor_address TEXT;

-- Function to auto-cancel expired appointments
CREATE OR REPLACE FUNCTION auto_cancel_expired_appointments()
RETURNS void AS $$
BEGIN
  UPDATE appointments
  SET status = 'Cancelled'
  WHERE date < CURRENT_DATE
    AND status IN ('Pending', 'Confirmed')
    AND status != 'Completed';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run daily (if using pg_cron extension)
-- If you don't have pg_cron, you can call this function manually or from your backend
-- SELECT cron.schedule('auto-cancel-expired', '0 0 * * *', 'SELECT auto_cancel_expired_appointments()');

-- Run it once now to cancel any existing expired appointments
SELECT auto_cancel_expired_appointments();
