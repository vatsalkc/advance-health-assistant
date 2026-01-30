// Comprehensive disease database with symptoms and recommendations
export const diseaseDatabase = [
  {
    disease: 'Common Cold',
    symptoms: ['runny nose', 'sneezing', 'sore throat', 'cough', 'mild fever', 'fatigue', 'headache'],
    specialization: 'General Physician',
    description: 'A viral infection of the upper respiratory tract.',
    precautions: ['Rest and stay hydrated', 'Use over-the-counter cold medications', 'Avoid close contact with others', 'Wash hands frequently']
  },
  {
    disease: 'Influenza (Flu)',
    symptoms: ['high fever', 'body aches', 'fatigue', 'cough', 'sore throat', 'headache', 'chills'],
    specialization: 'General Physician',
    description: 'A contagious respiratory illness caused by influenza viruses.',
    precautions: ['Get plenty of rest', 'Stay hydrated', 'Take antiviral medications if prescribed', 'Avoid contact with others']
  },
  {
    disease: 'COVID-19',
    symptoms: ['fever', 'dry cough', 'fatigue', 'loss of taste', 'loss of smell', 'difficulty breathing', 'body aches'],
    specialization: 'Infectious Disease Specialist',
    description: 'A respiratory illness caused by the SARS-CoV-2 virus.',
    precautions: ['Isolate yourself', 'Monitor oxygen levels', 'Seek medical attention if breathing worsens', 'Stay hydrated']
  },
  {
    disease: 'Migraine',
    symptoms: ['severe headache', 'nausea', 'sensitivity to light', 'sensitivity to sound', 'visual disturbances'],
    specialization: 'Neurologist',
    description: 'A neurological condition characterized by intense headaches.',
    precautions: ['Rest in a dark, quiet room', 'Apply cold compress', 'Take prescribed medications', 'Avoid triggers']
  },
  {
    disease: 'Hypertension',
    symptoms: ['headache', 'dizziness', 'blurred vision', 'chest pain', 'shortness of breath'],
    specialization: 'Cardiologist',
    description: 'High blood pressure that can lead to serious health complications.',
    precautions: ['Monitor blood pressure regularly', 'Reduce salt intake', 'Exercise regularly', 'Take prescribed medications']
  },
  {
    disease: 'Type 2 Diabetes',
    symptoms: ['increased thirst', 'frequent urination', 'fatigue', 'blurred vision', 'slow healing wounds'],
    specialization: 'Endocrinologist',
    description: 'A chronic condition affecting how the body processes blood sugar.',
    precautions: ['Monitor blood sugar levels', 'Follow a healthy diet', 'Exercise regularly', 'Take medications as prescribed']
  },
  {
    disease: 'Asthma',
    symptoms: ['wheezing', 'shortness of breath', 'chest tightness', 'coughing', 'difficulty breathing'],
    specialization: 'Pulmonologist',
    description: 'A condition causing airways to narrow and produce extra mucus.',
    precautions: ['Use inhaler as prescribed', 'Avoid triggers', 'Monitor symptoms', 'Keep rescue inhaler handy']
  },
  {
    disease: 'Gastritis',
    symptoms: ['stomach pain', 'nausea', 'vomiting', 'bloating', 'loss of appetite', 'indigestion'],
    specialization: 'Gastroenterologist',
    description: 'Inflammation of the stomach lining.',
    precautions: ['Avoid spicy foods', 'Eat smaller meals', 'Avoid alcohol', 'Take antacids if needed']
  },
  {
    disease: 'Urinary Tract Infection',
    symptoms: ['burning urination', 'frequent urination', 'cloudy urine', 'pelvic pain', 'strong-smelling urine'],
    specialization: 'Urologist',
    description: 'An infection in any part of the urinary system.',
    precautions: ['Drink plenty of water', 'Take antibiotics as prescribed', 'Avoid irritants', 'Practice good hygiene']
  },
  {
    disease: 'Arthritis',
    symptoms: ['joint pain', 'joint stiffness', 'swelling', 'reduced range of motion', 'joint tenderness'],
    specialization: 'Rheumatologist',
    description: 'Inflammation of one or more joints causing pain and stiffness.',
    precautions: ['Stay active with low-impact exercise', 'Maintain healthy weight', 'Use hot/cold therapy', 'Take anti-inflammatory medications']
  },
  {
    disease: 'Depression',
    symptoms: ['persistent sadness', 'loss of interest', 'fatigue', 'sleep problems', 'difficulty concentrating', 'appetite changes'],
    specialization: 'Psychiatrist',
    description: 'A mood disorder causing persistent feelings of sadness.',
    precautions: ['Seek professional help', 'Stay connected with others', 'Exercise regularly', 'Follow treatment plan']
  },
  {
    disease: 'Anxiety Disorder',
    symptoms: ['excessive worry', 'restlessness', 'rapid heartbeat', 'sweating', 'difficulty concentrating', 'sleep problems'],
    specialization: 'Psychiatrist',
    description: 'A mental health condition characterized by excessive worry.',
    precautions: ['Practice relaxation techniques', 'Exercise regularly', 'Limit caffeine', 'Seek therapy']
  },
  {
    disease: 'Eczema',
    symptoms: ['itchy skin', 'red patches', 'dry skin', 'skin inflammation', 'skin rash'],
    specialization: 'Dermatologist',
    description: 'A condition causing skin to become itchy and inflamed.',
    precautions: ['Moisturize regularly', 'Avoid triggers', 'Use prescribed creams', 'Take lukewarm baths']
  },
  {
    disease: 'Acne',
    symptoms: ['pimples', 'blackheads', 'whiteheads', 'oily skin', 'skin inflammation'],
    specialization: 'Dermatologist',
    description: 'A skin condition causing pimples and blemishes.',
    precautions: ['Cleanse face twice daily', 'Avoid touching face', 'Use non-comedogenic products', 'Consider prescribed treatments']
  },
  {
    disease: 'Anemia',
    symptoms: ['fatigue', 'weakness', 'pale skin', 'shortness of breath', 'dizziness', 'cold hands and feet'],
    specialization: 'Hematologist',
    description: 'A condition where blood lacks adequate healthy red blood cells.',
    precautions: ['Eat iron-rich foods', 'Take iron supplements', 'Get adequate rest', 'Follow up with blood tests']
  },
  {
    disease: 'Thyroid Disorder',
    symptoms: ['fatigue', 'weight changes', 'mood changes', 'temperature sensitivity', 'hair loss'],
    specialization: 'Endocrinologist',
    description: 'Abnormal functioning of the thyroid gland.',
    precautions: ['Take thyroid medication as prescribed', 'Regular blood tests', 'Maintain healthy diet', 'Monitor symptoms']
  },
  {
    disease: 'Pneumonia',
    symptoms: ['cough with phlegm', 'fever', 'chest pain', 'difficulty breathing', 'fatigue', 'sweating'],
    specialization: 'Pulmonologist',
    description: 'An infection that inflames air sacs in the lungs.',
    precautions: ['Take antibiotics as prescribed', 'Rest and stay hydrated', 'Use humidifier', 'Seek immediate care if breathing worsens']
  },
  {
    disease: 'Kidney Stones',
    symptoms: ['severe back pain', 'blood in urine', 'nausea', 'vomiting', 'frequent urination', 'painful urination'],
    specialization: 'Nephrologist',
    description: 'Hard deposits of minerals and salts in the kidneys.',
    precautions: ['Drink plenty of water', 'Take pain medication', 'Strain urine to catch stones', 'Follow dietary recommendations']
  },
  {
    disease: 'Sinusitis',
    symptoms: ['facial pain', 'nasal congestion', 'thick nasal discharge', 'reduced sense of smell', 'headache'],
    specialization: 'ENT Specialist',
    description: 'Inflammation of the sinuses.',
    precautions: ['Use saline nasal spray', 'Apply warm compress', 'Stay hydrated', 'Take decongestants if needed']
  },
  {
    disease: 'Conjunctivitis (Pink Eye)',
    symptoms: ['red eyes', 'itchy eyes', 'watery eyes', 'discharge from eyes', 'sensitivity to light'],
    specialization: 'Ophthalmologist',
    description: 'Inflammation of the conjunctiva.',
    precautions: ['Avoid touching eyes', 'Use prescribed eye drops', 'Wash hands frequently', 'Avoid sharing towels']
  }
];

// All possible symptoms for autocomplete
export const allSymptoms = [
  'fever', 'high fever', 'mild fever', 'cough', 'dry cough', 'cough with phlegm',
  'sore throat', 'runny nose', 'sneezing', 'headache', 'severe headache',
  'body aches', 'fatigue', 'weakness', 'chills', 'sweating',
  'difficulty breathing', 'shortness of breath', 'wheezing', 'chest pain', 'chest tightness',
  'nausea', 'vomiting', 'diarrhea', 'stomach pain', 'bloating', 'indigestion',
  'loss of appetite', 'weight loss', 'weight gain', 'increased thirst', 'frequent urination',
  'burning urination', 'painful urination', 'blood in urine', 'cloudy urine', 'strong-smelling urine',
  'joint pain', 'joint stiffness', 'swelling', 'back pain', 'severe back pain',
  'muscle pain', 'neck pain', 'dizziness', 'blurred vision', 'visual disturbances',
  'sensitivity to light', 'sensitivity to sound', 'loss of taste', 'loss of smell',
  'skin rash', 'itchy skin', 'red patches', 'dry skin', 'oily skin', 'pale skin',
  'pimples', 'blackheads', 'whiteheads', 'skin inflammation',
  'red eyes', 'itchy eyes', 'watery eyes', 'discharge from eyes',
  'nasal congestion', 'thick nasal discharge', 'reduced sense of smell', 'facial pain',
  'persistent sadness', 'loss of interest', 'excessive worry', 'restlessness',
  'rapid heartbeat', 'sleep problems', 'difficulty concentrating', 'mood changes',
  'appetite changes', 'hair loss', 'cold hands and feet', 'pelvic pain',
  'reduced range of motion', 'joint tenderness', 'temperature sensitivity',
  'slow healing wounds', 'reduced sense of smell'
];

// Symptom matching algorithm
export const predictDisease = (userSymptoms) => {
  if (!userSymptoms || userSymptoms.length === 0) {
    return null;
  }

  const normalizedUserSymptoms = userSymptoms.map(s => s.toLowerCase().trim());
  
  const matches = diseaseDatabase.map(disease => {
    const matchingSymptoms = disease.symptoms.filter(symptom =>
      normalizedUserSymptoms.some(userSymptom => 
        userSymptom.includes(symptom) || symptom.includes(userSymptom)
      )
    );
    
    const matchPercentage = (matchingSymptoms.length / disease.symptoms.length) * 100;
    
    return {
      disease: disease.disease,
      specialization: disease.specialization,
      description: disease.description,
      precautions: disease.precautions,
      confidence: matchPercentage,
      matchingSymptoms: matchingSymptoms.length,
      totalSymptoms: disease.symptoms.length
    };
  });

  // Sort by confidence and return top 3
  const sortedMatches = matches
    .filter(m => m.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);

  if (sortedMatches.length === 0) {
    return {
      disease: 'Unknown Condition',
      specialization: 'General Physician',
      description: 'Unable to determine specific condition. Please consult a doctor.',
      precautions: ['Consult a healthcare professional', 'Monitor your symptoms', 'Keep a symptom diary'],
      confidence: 0,
      top_predictions: []
    };
  }

  const topMatch = sortedMatches[0];
  
  return {
    disease: topMatch.disease,
    specialization: topMatch.specialization,
    description: topMatch.description,
    precautions: topMatch.precautions,
    confidence: topMatch.confidence,
    top_predictions: sortedMatches.slice(0, 3).map(m => ({
      disease: m.disease,
      confidence: m.confidence
    }))
  };
};
