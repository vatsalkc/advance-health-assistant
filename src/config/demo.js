// Demo configuration for preview deployment
export const DEMO_MODE = process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL;

export const DEMO_USER = {
  id: 1,
  name: "Demo User",
  email: "demo@healthassistant.com",
  phone: "555-0123",
  age: 30,
  gender: "male",
  created_at: "2026-01-01T00:00:00Z"
};

export const DEMO_DOCTORS = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    experience: "15 years",
    rating: 4.8,
    available: true
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Neurologist", 
    experience: "12 years",
    rating: 4.7,
    available: true
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialization: "Dermatologist",
    experience: "10 years", 
    rating: 4.9,
    available: true
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialization: "Gastroenterologist",
    experience: "18 years",
    rating: 4.6,
    available: true
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    specialization: "Gynecologist",
    experience: "14 years",
    rating: 4.8,
    available: true
  }
];

export const DEMO_APPOINTMENTS = [
  {
    id: 1,
    doctor_name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    date: "2026-01-15",
    time: "10:00 AM",
    reason: "Regular checkup",
    status: "Confirmed"
  },
  {
    id: 2,
    doctor_name: "Dr. Michael Chen", 
    specialization: "Neurologist",
    date: "2026-01-20",
    time: "2:30 PM",
    reason: "Headache consultation",
    status: "Pending"
  }
];

export const DEMO_MEDICINES = [
  {
    id: 1,
    medicine_name: "Aspirin",
    dosage: "100mg",
    time: "08:00 AM",
    frequency: "Daily",
    active: true
  },
  {
    id: 2,
    medicine_name: "Vitamin D",
    dosage: "1000 IU", 
    time: "12:00 PM",
    frequency: "Daily",
    active: true
  },
  {
    id: 3,
    medicine_name: "Omega-3",
    dosage: "500mg",
    time: "06:00 PM", 
    frequency: "Daily",
    active: false
  }
];

export const DEMO_SYMPTOM_CHECKS = [
  {
    id: 1,
    symptoms: ["fever", "cough", "fatigue"],
    predicted_disease: "Common Cold",
    recommended_specialization: "General Physician",
    confidence: 92.5,
    timestamp: "2026-01-10T10:30:00Z",
    description: "A viral infection affecting the upper respiratory system",
    precautions: "Rest, stay hydrated, avoid contact with others"
  },
  {
    id: 2,
    symptoms: ["headache", "nausea", "dizziness"],
    predicted_disease: "Migraine",
    recommended_specialization: "Neurologist", 
    confidence: 87.3,
    timestamp: "2026-01-08T14:15:00Z",
    description: "A neurological condition causing severe headaches",
    precautions: "Avoid triggers, rest in dark room, stay hydrated"
  }
];

export const DEMO_STATS = {
  totalAppointments: 5,
  activeMedicines: 2,
  symptomsChecked: 8
};

export const DEMO_SYMPTOMS = [
  "fever", "cough", "fatigue", "headache", "nausea", "dizziness",
  "chest pain", "shortness of breath", "abdominal pain", "back pain",
  "joint pain", "muscle pain", "sore throat", "runny nose", "sneezing",
  "vomiting", "diarrhea", "constipation", "loss of appetite", "weight loss",
  "weight gain", "insomnia", "excessive sleepiness", "anxiety", "depression"
];

// Demo API responses
export const mockSymptomCheck = (symptoms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const diseases = [
        { disease: "Common Cold", confidence: 85.2 },
        { disease: "Flu", confidence: 72.8 },
        { disease: "Allergic Rhinitis", confidence: 45.6 }
      ];
      
      resolve({
        disease: diseases[0].disease,
        confidence: diseases[0].confidence,
        specialization: "General Physician",
        description: "A viral infection of the upper respiratory system",
        precautions: ["Rest and stay hydrated", "Avoid contact with others", "Take over-the-counter medications as needed"],
        top_predictions: diseases
      });
    }, 1500);
  });
};