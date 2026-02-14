-- Enhanced schema for doctor portal functionality
-- Run this AFTER the main supabase_schema.sql

-- Update doctors table to support authentication
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS qualification TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS license_number TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS consultation_fee DECIMAL(10,2);
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS available_days TEXT[];
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS available_time_start TIME;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS available_time_end TIME;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update appointments table for doctor management
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS prescription TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS diagnosis TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS rejected_reason TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create medical reports table
CREATE TABLE IF NOT EXISTS medical_reports (
  id SERIAL PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
  report_type TEXT NOT NULL,
  report_title TEXT NOT NULL,
  report_content TEXT NOT NULL,
  report_date DATE NOT NULL,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id SERIAL PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
  medicines JSONB NOT NULL,
  instructions TEXT,
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctors table (updated)
DROP POLICY IF EXISTS "Anyone can view doctors" ON doctors;
CREATE POLICY "Anyone can view active verified doctors" ON doctors
  FOR SELECT USING (is_active = true AND is_verified = true);

CREATE POLICY "Doctors can view own profile" ON doctors
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Doctors can update own profile" ON doctors
  FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Doctors can insert own profile" ON doctors
  FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- RLS Policies for appointments (updated for doctors)
CREATE POLICY "Doctors can view their appointments" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = appointments.doctor_id 
      AND doctors.auth_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update their appointments" ON appointments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = appointments.doctor_id 
      AND doctors.auth_id = auth.uid()
    )
  );

-- RLS Policies for medical_reports
CREATE POLICY "Patients can view own reports" ON medical_reports
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their patients reports" ON medical_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = medical_reports.doctor_id 
      AND doctors.auth_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can create reports" ON medical_reports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = medical_reports.doctor_id 
      AND doctors.auth_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update own reports" ON medical_reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = medical_reports.doctor_id 
      AND doctors.auth_id = auth.uid()
    )
  );

-- RLS Policies for prescriptions
CREATE POLICY "Patients can view own prescriptions" ON prescriptions
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their prescriptions" ON prescriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = prescriptions.doctor_id 
      AND doctors.auth_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can create prescriptions" ON prescriptions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = prescriptions.doctor_id 
      AND doctors.auth_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update own prescriptions" ON prescriptions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = prescriptions.doctor_id 
      AND doctors.auth_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doctors_auth_id ON doctors(auth_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_medical_reports_patient_id ON medical_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_doctor_id ON medical_reports(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_doctors_updated_at ON doctors;
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_medical_reports_updated_at ON medical_reports;
CREATE TRIGGER update_medical_reports_updated_at BEFORE UPDATE ON medical_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
