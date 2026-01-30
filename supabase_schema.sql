-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  age INTEGER,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id INTEGER REFERENCES doctors(id),
  doctor_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medicines table
CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  time TIME NOT NULL,
  frequency TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Symptom Checks table
CREATE TABLE symptom_checks (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symptoms TEXT[] NOT NULL,
  predicted_disease TEXT NOT NULL,
  recommended_specialization TEXT NOT NULL,
  confidence DECIMAL(5,2),
  description TEXT,
  precautions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for doctors (public read)
CREATE POLICY "Anyone can view doctors" ON doctors
  FOR SELECT USING (true);

-- RLS Policies for appointments
CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments" ON appointments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments" ON appointments
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for medicines
CREATE POLICY "Users can view own medicines" ON medicines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own medicines" ON medicines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medicines" ON medicines
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medicines" ON medicines
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for symptom_checks
CREATE POLICY "Users can view own symptom checks" ON symptom_checks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own symptom checks" ON symptom_checks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample doctors data
INSERT INTO doctors (name, specialization, experience, rating) VALUES
('Dr. John Smith', 'General Physician', '10 years', 4.5),
('Dr. Emily Davis', 'General Physician', '8 years', 4.7),
('Dr. Sarah Johnson', 'Cardiologist', '12 years', 4.8),
('Dr. Michael Brown', 'Cardiologist', '14 years', 4.9),
('Dr. James Taylor', 'Dermatologist', '9 years', 4.6),
('Dr. Patricia Martinez', 'Dermatologist', '11 years', 4.8),
('Dr. Jennifer Lee', 'Neurologist', '13 years', 4.9),
('Dr. Christopher White', 'Neurologist', '16 years', 4.8),
('Dr. Daniel Harris', 'Orthopedic', '11 years', 4.7),
('Dr. Nancy Clark', 'Orthopedic', '9 years', 4.6),
('Dr. Karen Lewis', 'Psychiatrist', '10 years', 4.8),
('Dr. Steven Walker', 'Psychiatrist', '12 years', 4.7),
('Dr. Richard Moore', 'Pulmonologist', '15 years', 4.9),
('Dr. Susan Miller', 'Pulmonologist', '11 years', 4.7),
('Dr. Maria Gonzalez', 'Endocrinologist', '12 years', 4.8),
('Dr. Paul Anderson', 'Endocrinologist', '10 years', 4.6),
('Dr. Mark Davis', 'Gastroenterologist', '11 years', 4.7),
('Dr. Helen Brown', 'Gastroenterologist', '9 years', 4.5),
('Dr. Charles Martinez', 'Urologist', '13 years', 4.8),
('Dr. Barbara Johnson', 'Urologist', '10 years', 4.6),
('Dr. Jennifer Smith', 'Gynecologist', '11 years', 4.8),
('Dr. Mary Rodriguez', 'Gynecologist', '9 years', 4.6),
('Dr. David Lee', 'Ophthalmologist', '12 years', 4.7),
('Dr. Sarah White', 'Ophthalmologist', '8 years', 4.5),
('Dr. Patricia Adams', 'ENT Specialist', '10 years', 4.6),
('Dr. James Wilson', 'ENT Specialist', '13 years', 4.8),
('Dr. Steven Davis', 'Rheumatologist', '11 years', 4.7),
('Dr. Nancy Martinez', 'Rheumatologist', '14 years', 4.8),
('Dr. Michelle Johnson', 'Oncologist', '15 years', 4.9),
('Dr. Robert Garcia', 'Oncologist', '12 years', 4.8),
('Dr. Thomas Lee', 'Nephrologist', '13 years', 4.8),
('Dr. Susan Thompson', 'Nephrologist', '11 years', 4.6),
('Dr. Michael Turner', 'Infectious Disease Specialist', '15 years', 4.9),
('Dr. Emily Foster', 'Infectious Disease Specialist', '11 years', 4.7),
('Dr. Rachel Green', 'Hematologist', '12 years', 4.8),
('Dr. Andrew Mitchell', 'Hematologist', '14 years', 4.7);
