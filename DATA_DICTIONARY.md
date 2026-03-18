# Health Assistant System - Data Dictionary

## Overview
This document defines all data entities, attributes, and relationships in the Health Assistant System.

---

## 📊 Core Entities

### 1. **USERS** Table
**Purpose**: Stores basic information for all system users

| Field Name | Data Type | Length | Constraints | Description |
|------------|-----------|---------|-------------|-------------|
| `id` | UUID | - | PRIMARY KEY, NOT NULL | Unique identifier for user |
| `email` | VARCHAR | 255 | UNIQUE, NOT NULL | User's email address |
| `password` | VARCHAR | 255 | NOT NULL | Encrypted password |
| `name` | VARCHAR | 100 | NOT NULL | Full name of user |
| `phone` | VARCHAR | 20 | - | Contact phone number |
| `user_type` | ENUM | - | NOT NULL | 'patient', 'doctor', 'admin' |
| `created_at` | TIMESTAMP | - | DEFAULT NOW() | Account creation date |
| `updated_at` | TIMESTAMP | - | DEFAULT NOW() | Last update timestamp |
| `is_active` | BOOLEAN | - | DEFAULT TRUE | Account status |

**Indexes**: 
- Primary: `id`
- Unique: `email`
- Index: `user_type`, `created_at`

---

### 2. **PATIENTS** Table
**Purpose**: Extended information specific to patients

| Field Name | Data Type | Length | Constraints | Description |
|------------|-----------|---------|-------------|-------------|
| `id` | UUID | - | PRIMARY KEY, NOT NULL | Patient unique identifier |
| `user_id` | UUID | - | FOREIGN KEY, NOT NULL | Reference to users.id |
| `date_of_birth` | DATE | - | - | Patient's birth date |
| `gender` | ENUM | - | - | 'male', 'female', 'other' |
| `address` | TEXT | - | - | Home address |
| `emergency_contact` | VARCHAR | 100 | - | Emergency contact person |
| `emergency_phone` | VARCHAR | 20 | - | Emergency contact number |
| `blood_group` | VARCHAR | 5 | - | Blood type (A+, B-, etc.) |
| `allergies` | TEXT | - | - | Known allergies |
| `medical_history` | TEXT | - | - | Previous medical conditions |

**Relationships**:
- `user_id` → `users.id` (ONE-TO-ONE)

---

### 3. **DOCTORS** Table
**Purpose**: Extended information specific to doctors

| Field Name | Data Type | Length | Constraints | Description |
|------------|-----------|---------|-------------|-------------|
| `id` | UUID | - | PRIMARY KEY, NOT NULL | Doctor unique identifier |
| `user_id` | UUID | - | FOREIGN KEY, NOT NULL | Reference to users.id |
| `specialization` | VARCHAR | 100 | NOT NULL | Medical specialization |
| `license_number` | VARCHAR | 50 | UNIQUE, NOT NULL | Medical license number |
| `qualification` | VARCHAR | 200 | - | Educational qualifications |
| `experience_years` | INTEGER | - | DEFAULT 0 | Years of experience |
| `consultation_fee` | DECIMAL | 10,2 | - | Consultation charges |
| `availability` | JSON | - | - | Available time slots |
| `hospital_affiliation` | VARCHAR | 200 | - | Associated hospital/clinic |

**Relationships**:
- `user_id` → `users.id` (ONE-TO-ONE)

---

### 4. **MEDICAL_REPORTS** Table
**Purpose**: Stores patient medical reports and documents

| Field Name | Data Type | Length | Constraints | Description |
|------------|-----------|---------|-------------|-------------|
| `id` | UUID | - | PRIMARY KEY, NOT NULL | Report unique identifier |
| `patient_id` | UUID | - | FOREIGN KEY, NOT NULL | Reference to patients.id |
| `doctor_id` | UUID | - | FOREIGN KEY | Reviewing doctor (nullable) |
| `report_title` | VARCHAR | 200 | NOT NULL | Title of the report |
| `report_type` | ENUM | - | NOT NULL | 'Blood Test', 'X-Ray', 'MRI', etc. |
| `report_content` | TEXT | - | - | Report description/notes |
| `report_date` | DATE | - | NOT NULL | Date of medical test/report |
| `attachments` | JSON | - | - | Array of file URLs |
| `status` | ENUM | - | DEFAULT 'uploaded' | 'uploaded', 'reviewed', 'archived' |
| `created_at` | TIMESTAMP | - | DEFAULT NOW() | Upload timestamp |
| `updated_at` | TIMESTAMP | - | DEFAULT NOW() | Last modification |

**Relationships**:
- `patient_id` → `patients.id` (MANY-TO-ONE)
- `doctor_id` → `doctors.id` (MANY-TO-ONE)

---

### 5. **DIAGNOSES** Table
**Purpose**: Stores doctor diagnoses for patients

| Field Name | Data Type | Length | Constraints | Description |
|------------|-----------|---------|-------------|-------------|
| `id` | UUID | - | PRIMARY KEY, NOT NULL | Diagnosis unique identifier |
| `patient_id` | UUID | - | FOREIGN KEY, NOT NULL | Reference to patients.id |
| `doctor_id` | UUID | - | FOREIGN KEY, NOT NULL | Reference to doctors.id |
| `diagnosis_text` | TEXT | - | NOT NULL | Detailed diagnosis |
| `symptoms` | JSON | - | - | Array of reported symptoms |
| `recommendations` | TEXT | - | - | Doctor's recommendations |
| `prescription` | TEXT | - | - | Prescribed medications |
| `follow_up_date` | DATE | - | - | Next appointment date |
| `severity` | ENUM | - | - | 'low', 'medium', 'high', 'critical' |
| `created_at` | TIMESTAMP | - | DEFAULT NOW() | Diagnosis creation date |

**Relationships**:
- `patient_id` → `patients.id` (MANY-TO-ONE)
- `doctor_id` → `doctors.id` (MANY-TO-ONE)

---

### 6. **APPOINTMENTS** Table
**Purpose**: Manages appointment scheduling between patients and doctors

| Field Name | Data Type | Length | Constraints | Description |
|------------|-----------|---------|-------------|-------------|
| `id` | UUID | - | PRIMARY KEY, NOT NULL | Appointment unique identifier |
| `patient_id` | UUID | - | FOREIGN KEY, NOT NULL | Reference to patients.id |
| `doctor_id` | UUID | - | FOREIGN KEY, NOT NULL | Reference to doctors.id |
| `appointment_date` | TIMESTAMP | - | NOT NULL | Scheduled date and time |
| `duration_minutes` | INTEGER | - | DEFAULT 30 | Appointment duration |
| `status` | ENUM | - | DEFAULT 'requested' | 'requested', 'confirmed', 'completed', 'cancelled' |
| `reason` | VARCHAR | 500 | - | Reason for appointment |
| `notes` | TEXT | - | - | Additional notes |
| `consultation_type` | ENUM | - | DEFAULT 'in-person' | 'in-person', 'video', 'phone' |
| `created_at` | TIMESTAMP | - | DEFAULT NOW() | Booking timestamp |
| `updated_at` | TIMESTAMP | - | DEFAULT NOW() | Last status update |

**Relationships**:
- `patient_id` → `patients.id` (MANY-TO-ONE)
- `doctor_id` → `doctors.id` (MANY-TO-ONE)

---

### 7. **AI_SESSIONS** Table
**Purpose**: Tracks AI chatbot interactions and symptom checks

| Field Name | Data Type | Length | Constraints | Description |
|------------|-----------|---------|-------------|-------------|
| `id` | UUID | - | PRIMARY KEY, NOT NULL | Session unique identifier |
| `user_id` | UUID | - | FOREIGN KEY, NOT NULL | Reference to users.id |
| `session_type` | ENUM | - | NOT NULL | 'chatbot', 'symptom_checker' |
| `input_data` | JSON | - | - | User input (symptoms, questions) |
| `ai_response` | JSON | - | - | AI generated response |
| `confidence_score` | DECIMAL | 3,2 | - | AI confidence level (0.00-1.00) |
| `recommendations` | JSON | - | - | AI recommendations array |
| `created_at` | TIMESTAMP | - | DEFAULT NOW() | Session timestamp |

**Relationships**:
- `user_id` → `users.id` (MANY-TO-ONE)

---

## 🔗 Relationship Summary

### One-to-One Relationships
- `users` ↔ `patients` (via user_id)
- `users` ↔ `doctors` (via user_id)

### One-to-Many Relationships
- `patients` → `medical_reports` (one patient, many reports)
- `doctors` → `medical_reports` (one doctor reviews many reports)
- `patients` → `diagnoses` (one patient, many diagnoses)
- `doctors` → `diagnoses` (one doctor creates many diagnoses)
- `patients` → `appointments` (one patient, many appointments)
- `doctors` → `appointments` (one doctor, many appointments)
- `users` → `ai_sessions` (one user, many AI sessions)

### Many-to-Many Relationships
- `patients` ↔ `doctors` (through appointments and diagnoses)

---

## 📋 Data Types Reference

### Standard Types
- **UUID**: Universally Unique Identifier (36 characters)
- **VARCHAR(n)**: Variable character string, max n characters
- **TEXT**: Large text field, unlimited length
- **INTEGER**: Whole numbers (-2,147,483,648 to 2,147,483,647)
- **DECIMAL(p,s)**: Fixed-point number (p=precision, s=scale)
- **BOOLEAN**: True/false values
- **DATE**: Date only (YYYY-MM-DD)
- **TIMESTAMP**: Date and time with timezone
- **JSON**: JavaScript Object Notation data

### Custom ENUM Values

#### user_type
- `'patient'` - Regular patient user
- `'doctor'` - Medical professional
- `'admin'` - System administrator

#### gender
- `'male'` - Male
- `'female'` - Female
- `'other'` - Other/prefer not to say

#### report_type
- `'Blood Test'` - Laboratory blood analysis
- `'X-Ray'` - X-ray imaging
- `'MRI'` - Magnetic Resonance Imaging
- `'CT Scan'` - Computed Tomography
- `'Ultrasound'` - Ultrasound imaging
- `'ECG'` - Electrocardiogram
- `'Prescription'` - Medication prescription
- `'Discharge Summary'` - Hospital discharge document
- `'Other'` - Other medical documents

#### status (reports)
- `'uploaded'` - Recently uploaded, awaiting review
- `'reviewed'` - Reviewed by doctor
- `'archived'` - Archived for historical reference

#### appointment_status
- `'requested'` - Patient requested appointment
- `'confirmed'` - Doctor confirmed appointment
- `'completed'` - Appointment finished
- `'cancelled'` - Appointment cancelled

#### severity
- `'low'` - Minor condition
- `'medium'` - Moderate condition requiring attention
- `'high'` - Serious condition requiring prompt care
- `'critical'` - Emergency condition

#### session_type
- `'chatbot'` - AI chatbot conversation
- `'symptom_checker'` - Symptom analysis session

---

## 🔒 Security Considerations

### Data Protection
- All passwords are encrypted using bcrypt
- Personal health information (PHI) is encrypted at rest
- File attachments are stored with access controls
- Row Level Security (RLS) ensures data isolation

### Access Control
- Patients can only access their own data
- Doctors can only access assigned patients
- Admins have system-wide read access
- AI sessions are user-specific

### Audit Trail
- All data modifications are timestamped
- User actions are logged for compliance
- File access is tracked and monitored

---

## 📈 Performance Optimization

### Indexes
- Primary keys on all tables
- Foreign key indexes for joins
- Composite indexes on frequently queried columns
- Full-text search indexes on text fields

### Partitioning
- Large tables partitioned by date
- Historical data archived periodically
- File storage optimized for quick retrieval

---

**Last Updated**: Current Date  
**Version**: 1.0  
**Maintained By**: Development Team