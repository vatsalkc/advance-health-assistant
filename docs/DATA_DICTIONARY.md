# Data Dictionary - Advanced Health Assistant System

## Overview
This document provides a comprehensive data dictionary for all database tables in the Advanced Health Assistant System. The system uses Supabase (PostgreSQL) as the backend database.

---

## Table of Contents
1. [Users Table](#1-users-table)
2. [Doctors Table](#2-doctors-table)
3. [Appointments Table](#3-appointments-table)
4. [Medicines Table](#4-medicines-table)
5. [Symptom Checks Table](#5-symptom-checks-table)
6. [Medical Reports Table](#6-medical-reports-table)
7. [Prescriptions Table](#7-prescriptions-table)
8. [Relationships & Constraints](#8-relationships--constraints)
9. [Indexes](#9-indexes)

---

## 1. Users Table

**Table Name:** `users`

**Description:** Stores patient/user information. Extends Supabase auth.users table.

**Primary Key:** `id` (UUID)

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE | Unique identifier for user, linked to Supabase auth |
| name | TEXT | NOT NULL | Full name of the user |
| email | TEXT | UNIQUE, NOT NULL | Email address (unique across system) |
| phone | TEXT | NULL | Contact phone number |
| age | INTEGER | NULL | User's age in years |
| gender | TEXT | NULL | User's gender (Male/Female/Other) |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Account creation timestamp |

**Row Level Security (RLS):** Enabled
- Users can view their own profile
- Users can update their own profile
- Users can insert their own profile

**Relationships:**
- One-to-Many with appointments (user_id)
- One-to-Many with medicines (user_id)
- One-to-Many with symptom_checks (user_id)
- One-to-Many with medical_reports (patient_id)
- One-to-Many with prescriptions (patient_id)

---

## 2. Doctors Table

**Table Name:** `doctors`

**Description:** Stores doctor/physician information including credentials and availability.

**Primary Key:** `id` (SERIAL)

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| auth_id | UUID | REFERENCES auth.users(id) ON DELETE CASCADE | Link to Supabase auth for doctor login |
| name | TEXT | NOT NULL | Doctor's full name |
| email | TEXT | UNIQUE | Doctor's email address |
| phone | TEXT | NULL | Doctor's contact number |
| specialization | TEXT | NOT NULL | Medical specialization (e.g., Cardiologist) |
| experience | TEXT | NOT NULL | Years of experience (e.g., "10 years") |
| qualification | TEXT | NULL | Educational qualifications (e.g., MBBS, MD) |
| license_number | TEXT | NULL | Medical license/registration number |
| rating | DECIMAL(2,1) | NOT NULL | Doctor rating (0.0 to 5.0) |
| is_verified | BOOLEAN | DEFAULT FALSE | Whether doctor is verified by admin |
| is_active | BOOLEAN | DEFAULT TRUE | Whether doctor account is active |
| consultation_fee | DECIMAL(10,2) | NULL | Consultation fee amount |
| available_days | TEXT[] | NULL | Array of available days (e.g., ['Monday', 'Tuesday']) |
| available_time_start | TIME | NULL | Start time of availability |
| available_time_end | TIME | NULL | End time of availability |
| bio | TEXT | NULL | Doctor's biography/description |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Row Level Security (RLS):** Enabled
- Anyone can view active and verified doctors
- Doctors can view their own profile
- Doctors can update their own profile
- Doctors can insert their own profile

**Relationships:**
- One-to-Many with appointments (doctor_id)
- One-to-Many with medical_reports (doctor_id)
- One-to-Many with prescriptions (doctor_id)

**Indexes:**
- idx_doctors_auth_id (auth_id)
- idx_doctors_specialization (specialization)

---

## 3. Appointments Table

**Table Name:** `appointments`

**Description:** Stores appointment bookings between patients and doctors.

**Primary Key:** `id` (SERIAL)

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| user_id | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Patient who booked the appointment |
| doctor_id | INTEGER | REFERENCES doctors(id) | Doctor assigned to appointment |
| doctor_name | TEXT | NOT NULL | Doctor's name (denormalized for display) |
| specialization | TEXT | NOT NULL | Doctor's specialization |
| date | DATE | NOT NULL | Appointment date |
| time | TIME | NOT NULL | Appointment time |
| reason | TEXT | NOT NULL | Reason for appointment/chief complaint |
| status | TEXT | DEFAULT 'Pending' | Status: Pending/Confirmed/Rejected/Completed |
| notes | TEXT | NULL | Doctor's notes about the appointment |
| prescription | TEXT | NULL | Prescription details |
| diagnosis | TEXT | NULL | Diagnosis made by doctor |
| rejected_reason | TEXT | NULL | Reason if appointment was rejected |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Booking creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Row Level Security (RLS):** Enabled
- Users can view their own appointments
- Users can create their own appointments
- Users can update their own appointments
- Users can delete their own appointments
- Doctors can view their appointments
- Doctors can update their appointments

**Relationships:**
- Many-to-One with users (user_id)
- Many-to-One with doctors (doctor_id)
- One-to-Many with medical_reports (appointment_id)
- One-to-Many with prescriptions (appointment_id)

**Indexes:**
- idx_appointments_doctor_id (doctor_id)
- idx_appointments_user_id (user_id)
- idx_appointments_status (status)

---

## 4. Medicines Table

**Table Name:** `medicines`

**Description:** Stores medicine reminders for patients.

**Primary Key:** `id` (SERIAL)

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| user_id | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Patient who set the reminder |
| medicine_name | TEXT | NOT NULL | Name of the medicine |
| dosage | TEXT | NOT NULL | Dosage information (e.g., "500mg") |
| time | TIME | NOT NULL | Time to take medicine |
| frequency | TEXT | NOT NULL | Frequency (e.g., "Daily", "Twice a day") |
| active | BOOLEAN | DEFAULT TRUE | Whether reminder is active |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Reminder creation timestamp |

**Row Level Security (RLS):** Enabled
- Users can view their own medicines
- Users can create their own medicines
- Users can update their own medicines
- Users can delete their own medicines

**Relationships:**
- Many-to-One with users (user_id)

---

## 5. Symptom Checks Table

**Table Name:** `symptom_checks`

**Description:** Stores symptom checker results and AI predictions.

**Primary Key:** `id` (SERIAL)

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| user_id | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | User who performed the check |
| symptoms | TEXT[] | NOT NULL | Array of symptoms entered |
| predicted_disease | TEXT | NOT NULL | AI-predicted disease name |
| recommended_specialization | TEXT | NOT NULL | Recommended doctor specialization |
| confidence | DECIMAL(5,2) | NULL | Prediction confidence score (0-100) |
| description | TEXT | NULL | Disease description |
| precautions | TEXT[] | NULL | Array of recommended precautions |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Check timestamp |

**Row Level Security (RLS):** Enabled
- Users can view their own symptom checks
- Users can create their own symptom checks

**Relationships:**
- Many-to-One with users (user_id)

---

## 6. Medical Reports Table

**Table Name:** `medical_reports`

**Description:** Stores medical reports created by doctors for patients.

**Primary Key:** `id` (SERIAL)

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| patient_id | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Patient the report is for |
| doctor_id | INTEGER | NOT NULL, REFERENCES doctors(id) ON DELETE CASCADE | Doctor who created the report |
| appointment_id | INTEGER | REFERENCES appointments(id) ON DELETE SET NULL | Related appointment (optional) |
| report_type | TEXT | NOT NULL | Type of report (e.g., "Lab Test", "Diagnosis") |
| report_title | TEXT | NOT NULL | Title of the report |
| report_content | TEXT | NOT NULL | Detailed report content |
| report_date | DATE | NOT NULL | Date of the report |
| attachments | TEXT[] | NULL | Array of attachment URLs |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Report creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Row Level Security (RLS):** Enabled
- Patients can view their own reports
- Doctors can view their patients' reports
- Doctors can create reports
- Doctors can update their own reports

**Relationships:**
- Many-to-One with users (patient_id)
- Many-to-One with doctors (doctor_id)
- Many-to-One with appointments (appointment_id)

**Indexes:**
- idx_medical_reports_patient_id (patient_id)
- idx_medical_reports_doctor_id (doctor_id)

---

## 7. Prescriptions Table

**Table Name:** `prescriptions`

**Description:** Stores digital prescriptions issued by doctors.

**Primary Key:** `id` (SERIAL)

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| patient_id | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Patient receiving prescription |
| doctor_id | INTEGER | NOT NULL, REFERENCES doctors(id) ON DELETE CASCADE | Doctor issuing prescription |
| appointment_id | INTEGER | REFERENCES appointments(id) ON DELETE SET NULL | Related appointment (optional) |
| medicines | JSONB | NOT NULL | JSON array of medicine objects with details |
| instructions | TEXT | NULL | General instructions for patient |
| valid_until | DATE | NULL | Prescription validity date |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Prescription creation timestamp |

**Row Level Security (RLS):** Enabled
- Patients can view their own prescriptions
- Doctors can view their prescriptions
- Doctors can create prescriptions
- Doctors can update their own prescriptions

**Relationships:**
- Many-to-One with users (patient_id)
- Many-to-One with doctors (doctor_id)
- Many-to-One with appointments (appointment_id)

**Indexes:**
- idx_prescriptions_patient_id (patient_id)
- idx_prescriptions_doctor_id (doctor_id)

---

## 8. Relationships & Constraints

### Foreign Key Relationships

```
users (id) ←──── appointments (user_id)
users (id) ←──── medicines (user_id)
users (id) ←──── symptom_checks (user_id)
users (id) ←──── medical_reports (patient_id)
users (id) ←──── prescriptions (patient_id)

doctors (id) ←──── appointments (doctor_id)
doctors (id) ←──── medical_reports (doctor_id)
doctors (id) ←──── prescriptions (doctor_id)

appointments (id) ←──── medical_reports (appointment_id)
appointments (id) ←──── prescriptions (appointment_id)

auth.users (id) ←──── users (id)
auth.users (id) ←──── doctors (auth_id)
```

### Cascade Rules

- **ON DELETE CASCADE**: When a user or doctor is deleted, all related records are automatically deleted
- **ON DELETE SET NULL**: When an appointment is deleted, related reports/prescriptions remain but appointment_id is set to NULL

---

## 9. Indexes

Performance indexes created for frequently queried columns:

| Index Name | Table | Column(s) | Purpose |
|-----------|-------|-----------|---------|
| idx_doctors_auth_id | doctors | auth_id | Fast doctor authentication lookup |
| idx_doctors_specialization | doctors | specialization | Filter doctors by specialization |
| idx_appointments_doctor_id | appointments | doctor_id | Doctor's appointment queries |
| idx_appointments_user_id | appointments | user_id | User's appointment queries |
| idx_appointments_status | appointments | status | Filter by appointment status |
| idx_medical_reports_patient_id | medical_reports | patient_id | Patient's reports lookup |
| idx_medical_reports_doctor_id | medical_reports | doctor_id | Doctor's reports lookup |
| idx_prescriptions_patient_id | prescriptions | patient_id | Patient's prescriptions lookup |
| idx_prescriptions_doctor_id | prescriptions | doctor_id | Doctor's prescriptions lookup |

---

## Database Statistics

- **Total Tables:** 7
- **Total Columns:** 85+
- **Total Indexes:** 9
- **Total RLS Policies:** 30+
- **Sample Doctors:** 36 pre-loaded
- **Supported Specializations:** 16+

---

## Notes

1. All timestamps use `TIMESTAMP WITH TIME ZONE` for proper timezone handling
2. Row Level Security (RLS) is enabled on all tables for data protection
3. UUID is used for user identification (Supabase auth standard)
4. SERIAL is used for auto-incrementing IDs for other entities
5. Arrays (TEXT[]) are used for multi-value fields like symptoms, precautions
6. JSONB is used for complex structured data like medicine details
7. Triggers automatically update `updated_at` columns on record modification

---

**Document Version:** 1.0  
**Last Updated:** February 26, 2026  
**Database System:** Supabase (PostgreSQL)
