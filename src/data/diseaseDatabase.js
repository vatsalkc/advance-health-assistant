// Symptom weights - Critical symptoms have higher weights
export const symptomWeights = {
  // CRITICAL symptoms (weight: 3.5) - CARDIAC EMERGENCY
  'chest pain': 3.5,
  'severe chest pain': 3.5,
  'chest tightness': 3.5,
  'chest pressure': 3.5,
  
  // CRITICAL symptoms (weight: 3.0) - Life-threatening
  'difficulty breathing': 3.0,
  'shortness of breath': 3.0,
  'coughing blood': 3.0,
  'blood in urine': 3.0,
  'severe headache': 3.0,
  'confusion': 3.0,
  'loss of consciousness': 3.0,
  'severe abdominal pain': 3.0,
  'feeling faint': 3.0,
  'lightheadedness': 3.0,
  
  // HIGH PRIORITY symptoms (weight: 2.5) - Serious conditions
  'high fever': 2.5,
  'persistent fever': 2.5,
  'extreme fatigue': 2.5,
  'severe weakness': 2.5,
  'wheezing': 2.5,
  'rapid heartbeat': 2.5,
  'irregular heartbeat': 2.5,
  'palpitations': 2.5,
  'blurred vision': 2.5,
  'loss of taste': 2.5,
  'loss of smell': 2.5,
  'severe pain': 2.5,
  'swelling in legs': 2.5,
  'swelling in ankles': 2.5,
  'pain in arms': 2.5,
  'pain in jaw': 2.5,
  
  // MODERATE symptoms (weight: 2.0) - Significant discomfort
  'fever': 2.0,
  'body aches': 2.0,
  'persistent cough': 2.0,
  'cough with phlegm': 2.0,
  'burning urination': 2.0,
  'frequent urination': 2.0,
  'joint pain': 2.0,
  'back pain': 2.0,
  'stomach pain': 2.0,
  'nausea': 2.0,
  'vomiting': 2.0,
  'diarrhea': 2.0,
  'dizziness': 2.0,
  'facial pain': 2.0,
  'sweating': 2.0,
  
  // COMMON symptoms (weight: 1.5) - Typical illness indicators
  'fatigue': 1.5,
  'headache': 1.5,
  'sore throat': 1.5,
  'runny nose': 1.5,
  'nasal congestion': 1.5,
  'sneezing': 1.5,
  'dry cough': 1.5,
  'mild cough': 1.5,
  'muscle pain': 1.5,
  'chills': 1.5,
  
  // MILD symptoms (weight: 1.0) - Minor discomfort
  'mild fever': 1.0,
  'mild headache': 1.0,
  'itchy eyes': 1.0,
  'watery eyes': 1.0,
  'dry skin': 1.0,
  'itchy skin': 1.0,
  'tiredness': 1.0,
  'weakness': 1.0,
  'loss of appetite': 1.0,
  'bloating': 1.0
};

// Get weight for a symptom (default 1.0 if not specified)
export const getSymptomWeight = (symptom) => {
  const symptomLower = symptom.toLowerCase().trim();
  
  // Check for exact match first
  if (symptomWeights[symptomLower]) {
    return symptomWeights[symptomLower];
  }
  
  // Check for partial match (e.g., "severe chest pain" contains "chest pain")
  for (const [weightedSymptom, weight] of Object.entries(symptomWeights)) {
    if (symptomLower.includes(weightedSymptom) || weightedSymptom.includes(symptomLower)) {
      return weight;
    }
  }
  
  // Default weight for unspecified symptoms
  return 1.0;
};

// Symptom follow-up questions - when user selects a symptom, suggest related symptoms
export const symptomFollowUps = {
  'fever': ['high fever', 'mild fever', 'fever with chills', 'fever with sweating', 'persistent fever'],
  'cold': ['runny nose', 'stuffy nose', 'sneezing', 'nasal congestion', 'post-nasal drip'],
  'eye': ['red eyes', 'itchy eyes', 'watery eyes', 'dry eyes', 'burning eyes', 'eye discharge', 'swollen eyes', 'eye pain'],
  'cough': ['dry cough', 'wet cough', 'cough with phlegm', 'persistent cough', 'coughing blood'],
  'headache': ['severe headache', 'mild headache', 'throbbing headache', 'tension headache', 'headache with nausea'],
  'pain': ['chest pain', 'stomach pain', 'back pain', 'joint pain', 'muscle pain', 'abdominal pain'],
  'chest': ['chest pain', 'chest tightness', 'chest pressure', 'chest discomfort'],
  'heart': ['rapid heartbeat', 'irregular heartbeat', 'palpitations', 'slow heartbeat'],
  'faint': ['feeling faint', 'lightheadedness', 'dizziness', 'vertigo', 'loss of consciousness'],
  'breathing': ['difficulty breathing', 'shortness of breath', 'rapid breathing', 'wheezing', 'chest tightness'],
  'throat': ['sore throat', 'dry throat', 'scratchy throat', 'throat pain', 'difficulty swallowing'],
  'stomach': ['stomach pain', 'stomach cramps', 'upset stomach', 'bloating', 'nausea'],
  'skin': ['skin rash', 'itchy skin', 'red skin', 'dry skin', 'oily skin', 'skin inflammation', 'skin peeling'],
  'nose': ['runny nose', 'stuffy nose', 'bloody nose', 'nasal congestion', 'loss of smell'],
  'ear': ['ear pain', 'ear discharge', 'ringing in ears', 'hearing loss', 'ear pressure'],
  'fatigue': ['extreme fatigue', 'tiredness', 'weakness', 'lack of energy', 'exhaustion'],
  'dizziness': ['lightheadedness', 'vertigo', 'feeling faint', 'loss of balance'],
  'urination': ['frequent urination', 'painful urination', 'burning urination', 'blood in urine', 'cloudy urine'],
  'swelling': ['swelling in legs', 'swelling in ankles', 'swelling in feet', 'swelling in hands'],
};

// Enhanced disease database with more accurate symptom mapping
export const diseaseDatabase = [
  {
    disease: 'Common Cold',
    symptoms: ['runny nose', 'sneezing', 'sore throat', 'mild cough', 'nasal congestion', 'mild fever', 'watery eyes', 'post-nasal drip', 'mild headache', 'fatigue', 'stuffy nose', 'scratchy throat'],
    requiredSymptoms: ['runny nose', 'sneezing', 'nasal congestion'],
    specialization: 'General Physician',
    description: 'A viral infection of the upper respiratory tract causing cold symptoms.',
    precautions: ['Rest and stay hydrated', 'Use over-the-counter cold medications', 'Avoid close contact with others', 'Wash hands frequently']
  },
  {
    disease: 'Influenza (Flu)',
    symptoms: ['high fever', 'fever', 'body aches', 'extreme fatigue', 'dry cough', 'severe headache', 'chills', 'muscle pain', 'back pain', 'sore throat', 'weakness', 'sweating', 'loss of appetite', 'nausea'],
    requiredSymptoms: ['fever', 'body aches'],
    specialization: 'General Physician',
    description: 'A contagious respiratory illness caused by influenza viruses with sudden onset.',
    precautions: ['Get plenty of rest', 'Stay hydrated', 'Take antiviral medications if prescribed', 'Avoid contact with others', 'Monitor temperature']
  },
  {
    disease: 'Viral Fever',
    symptoms: ['fever', 'headache', 'body aches', 'fatigue', 'weakness', 'chills', 'sweating', 'loss of appetite', 'mild nausea', 'tiredness', 'muscle pain'],
    requiredSymptoms: ['fever'],
    specialization: 'General Physician',
    description: 'A common viral infection causing fever and general discomfort.',
    precautions: ['Rest adequately', 'Stay hydrated', 'Take fever-reducing medication', 'Monitor temperature regularly', 'Eat light meals']
  },
  {
    disease: 'Back Pain / Muscle Strain',
    symptoms: ['back pain', 'muscle pain', 'stiffness', 'limited mobility', 'pain when moving', 'muscle spasms', 'tenderness', 'difficulty standing', 'pain radiating to legs'],
    requiredSymptoms: ['back pain', 'muscle pain'],
    specialization: 'Orthopedist',
    description: 'Muscle strain or injury causing back pain and limited movement.',
    precautions: ['Rest and avoid heavy lifting', 'Apply hot/cold compress', 'Take pain relievers', 'Gentle stretching exercises', 'Maintain good posture']
  },
  {
    disease: 'COVID-19',
    symptoms: ['fever', 'dry cough', 'fatigue', 'loss of taste', 'loss of smell', 'difficulty breathing', 'body aches', 'sore throat', 'headache', 'chills', 'nausea', 'diarrhea', 'shortness of breath'],
    requiredSymptoms: ['loss of taste', 'loss of smell'],
    specialization: 'General Physician',
    description: 'A respiratory illness caused by the SARS-CoV-2 virus with distinctive symptoms.',
    precautions: ['Isolate yourself immediately', 'Monitor oxygen levels', 'Seek medical attention if breathing worsens', 'Stay hydrated', 'Rest completely']
  },
  {
    disease: 'Migraine',
    symptoms: ['severe headache', 'throbbing headache', 'nausea', 'vomiting', 'sensitivity to light', 'sensitivity to sound', 'visual disturbances', 'aura', 'dizziness', 'neck stiffness', 'blurred vision'],
    requiredSymptoms: ['severe headache', 'throbbing headache'],
    specialization: 'Neurologist',
    description: 'A neurological condition characterized by intense, debilitating headaches.',
    precautions: ['Rest in a dark, quiet room', 'Apply cold compress', 'Take prescribed medications', 'Avoid triggers', 'Stay hydrated']
  },
  {
    disease: 'Tension Headache',
    symptoms: ['mild headache', 'headache', 'pressure around head', 'neck pain', 'fatigue', 'muscle tension', 'scalp tenderness', 'tight band feeling'],
    requiredSymptoms: ['headache', 'pressure around head'],
    specialization: 'General Physician',
    description: 'The most common type of headache caused by muscle tension and stress.',
    precautions: ['Rest and relax', 'Apply warm compress', 'Take over-the-counter pain relievers', 'Reduce stress', 'Practice relaxation techniques']
  },
  {
    disease: 'Hypertension (High Blood Pressure)',
    symptoms: ['headache', 'dizziness', 'feeling faint', 'lightheadedness', 'blurred vision', 'chest pain', 'shortness of breath', 'nosebleeds', 'fatigue'],
    requiredSymptoms: ['dizziness', 'headache', 'feeling faint'],
    specialization: 'Cardiologist',
    description: 'High blood pressure that can lead to serious heart complications and stroke.',
    precautions: ['Monitor blood pressure regularly', 'Reduce salt intake', 'Exercise regularly', 'Take prescribed medications', 'Seek immediate care if severe']
  },
  {
    disease: 'Heart Arrhythmia',
    symptoms: ['rapid heartbeat', 'irregular heartbeat', 'palpitations', 'dizziness', 'feeling faint', 'lightheadedness', 'shortness of breath', 'chest discomfort', 'fatigue', 'weakness'],
    requiredSymptoms: ['rapid heartbeat', 'irregular heartbeat', 'palpitations'],
    specialization: 'Cardiologist',
    description: 'Irregular heart rhythm that can cause various symptoms and complications.',
    precautions: ['Seek immediate medical attention', 'Avoid caffeine and stimulants', 'Monitor heart rate', 'Take prescribed medications', 'Reduce stress']
  },
  {
    disease: 'Angina (Chest Pain)',
    symptoms: ['chest pain', 'chest tightness', 'chest pressure', 'shortness of breath', 'pain in arms', 'pain in neck', 'pain in jaw', 'fatigue', 'dizziness', 'sweating'],
    requiredSymptoms: ['chest pain', 'chest tightness', 'chest pressure'],
    specialization: 'Cardiologist',
    description: 'Chest pain caused by reduced blood flow to the heart muscle.',
    precautions: ['Seek immediate medical attention', 'Rest immediately', 'Take prescribed nitroglycerin', 'Call emergency services if pain persists', 'Avoid physical exertion']
  },
  {
    disease: 'Heart Failure',
    symptoms: ['shortness of breath', 'difficulty breathing', 'extreme fatigue', 'weakness', 'swelling in legs', 'swelling in ankles', 'rapid heartbeat', 'persistent cough', 'wheezing', 'chest pain'],
    requiredSymptoms: ['shortness of breath', 'extreme fatigue', 'swelling in legs'],
    specialization: 'Cardiologist',
    description: 'A chronic condition where the heart cannot pump blood efficiently.',
    precautions: ['Seek immediate medical care', 'Monitor weight daily', 'Limit fluid intake', 'Take prescribed medications', 'Reduce salt intake']
  },
  {
    disease: 'Cardiac Syncope (Fainting)',
    symptoms: ['feeling faint', 'lightheadedness', 'dizziness', 'loss of consciousness', 'rapid heartbeat', 'chest pain', 'shortness of breath', 'sweating', 'nausea', 'blurred vision'],
    requiredSymptoms: ['feeling faint', 'dizziness', 'lightheadedness'],
    specialization: 'Cardiologist',
    description: 'Fainting caused by heart-related issues affecting blood flow to the brain.',
    precautions: ['Seek immediate medical attention', 'Lie down with legs elevated', 'Stay hydrated', 'Avoid sudden position changes', 'Get cardiac evaluation']
  },
  {
    disease: 'Type 2 Diabetes',
    symptoms: ['increased thirst', 'frequent urination', 'extreme fatigue', 'blurred vision', 'slow healing wounds', 'tingling in hands', 'tingling in feet', 'unexplained weight loss', 'increased hunger', 'dry skin', 'frequent infections'],
    requiredSymptoms: ['increased thirst', 'frequent urination'],
    specialization: 'Endocrinologist',
    description: 'A chronic condition affecting how the body processes blood sugar (glucose).',
    precautions: ['Monitor blood sugar levels regularly', 'Follow a healthy diet', 'Exercise regularly', 'Take medications as prescribed', 'Regular check-ups']
  },
  {
    disease: 'Asthma',
    symptoms: ['wheezing', 'shortness of breath', 'chest tightness', 'persistent cough', 'difficulty breathing', 'rapid breathing', 'coughing at night', 'fatigue', 'trouble sleeping'],
    requiredSymptoms: ['wheezing', 'shortness of breath', 'chest tightness'],
    specialization: 'Pulmonologist',
    description: 'A chronic condition causing airways to narrow, swell and produce extra mucus.',
    precautions: ['Use inhaler as prescribed', 'Avoid triggers (smoke, pollen, dust)', 'Monitor symptoms daily', 'Keep rescue inhaler handy', 'Get flu vaccine']
  },
  {
    disease: 'Gastritis',
    symptoms: ['stomach pain', 'burning stomach', 'nausea', 'vomiting', 'bloating', 'loss of appetite', 'indigestion', 'feeling full quickly', 'hiccups', 'black stools'],
    requiredSymptoms: ['stomach pain', 'burning stomach', 'nausea'],
    specialization: 'Gastroenterologist',
    description: 'Inflammation, irritation, or erosion of the stomach lining.',
    precautions: ['Avoid spicy and acidic foods', 'Eat smaller, frequent meals', 'Avoid alcohol and NSAIDs', 'Take antacids if needed', 'Reduce stress']
  },
  {
    disease: 'Food Poisoning',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomach cramps', 'fever', 'weakness', 'headache', 'loss of appetite', 'muscle aches', 'chills'],
    requiredSymptoms: ['nausea', 'vomiting', 'diarrhea'],
    specialization: 'General Physician',
    description: 'Illness caused by eating contaminated, spoiled, or toxic food.',
    precautions: ['Stay hydrated with clear fluids', 'Rest completely', 'Avoid solid foods initially', 'Seek medical help if severe or persistent', 'Practice food safety']
  },
  {
    disease: 'Urinary Tract Infection (UTI)',
    symptoms: ['burning urination', 'frequent urination', 'urgent urination', 'cloudy urine', 'pelvic pain', 'blood in urine', 'strong-smelling urine', 'lower abdominal pain', 'fever', 'back pain'],
    requiredSymptoms: ['burning urination', 'frequent urination'],
    specialization: 'Urologist',
    description: 'An infection in any part of the urinary system (kidneys, bladder, urethra).',
    precautions: ['Drink plenty of water', 'Take antibiotics as prescribed', 'Avoid irritants (caffeine, alcohol)', 'Practice good hygiene', 'Urinate frequently']
  },
  {
    disease: 'Arthritis',
    symptoms: ['joint pain', 'joint stiffness', 'swelling', 'reduced range of motion', 'morning stiffness', 'joint warmth', 'joint redness', 'fatigue', 'difficulty walking'],
    requiredSymptoms: ['joint pain', 'joint stiffness', 'swelling'],
    specialization: 'Rheumatologist',
    description: 'Inflammation of one or more joints causing pain, stiffness and reduced mobility.',
    precautions: ['Stay active with low-impact exercise', 'Maintain healthy weight', 'Use hot/cold therapy', 'Take anti-inflammatory medications', 'Physical therapy']
  },
  {
    disease: 'Depression',
    symptoms: ['persistent sadness', 'loss of interest', 'extreme fatigue', 'sleep problems', 'difficulty concentrating', 'appetite changes', 'feelings of worthlessness', 'thoughts of death', 'irritability', 'physical aches'],
    requiredSymptoms: ['persistent sadness', 'loss of interest'],
    specialization: 'Psychiatrist',
    description: 'A mood disorder causing persistent feelings of sadness and loss of interest.',
    precautions: ['Seek professional help immediately', 'Stay connected with others', 'Exercise regularly', 'Follow treatment plan', 'Avoid alcohol and drugs']
  },
  {
    disease: 'Anxiety Disorder',
    symptoms: ['excessive worry', 'restlessness', 'rapid heartbeat', 'sweating', 'difficulty concentrating', 'panic attacks', 'trembling', 'feeling nervous', 'trouble sleeping', 'nausea', 'dizziness'],
    requiredSymptoms: ['excessive worry', 'restlessness', 'rapid heartbeat'],
    specialization: 'Psychiatrist',
    description: 'A mental health condition characterized by excessive, persistent worry and fear.',
    precautions: ['Practice relaxation techniques', 'Exercise regularly', 'Limit caffeine and alcohol', 'Seek therapy', 'Get adequate sleep']
  },
  {
    disease: 'Eczema (Atopic Dermatitis)',
    symptoms: ['itchy skin', 'red patches', 'dry skin', 'skin inflammation', 'skin rash', 'cracked skin', 'scaly skin', 'thickened skin', 'sensitive skin', 'oozing or crusting'],
    requiredSymptoms: ['itchy skin', 'red patches', 'dry skin'],
    specialization: 'Dermatologist',
    description: 'A chronic condition causing skin to become itchy, inflamed and irritated.',
    precautions: ['Moisturize regularly', 'Avoid triggers (soaps, detergents)', 'Use prescribed creams', 'Take lukewarm baths', 'Wear soft fabrics']
  },
  {
    disease: 'Acne',
    symptoms: ['pimples', 'blackheads', 'whiteheads', 'oily skin', 'skin inflammation', 'red bumps', 'painful lumps', 'scarring', 'cysts'],
    requiredSymptoms: ['pimples', 'blackheads', 'whiteheads'],
    specialization: 'Dermatologist',
    description: 'A skin condition causing pimples, blackheads and inflamed lesions.',
    precautions: ['Cleanse face twice daily', 'Avoid touching face', 'Use non-comedogenic products', 'Consider prescribed treatments', 'Avoid squeezing pimples']
  },
  {
    disease: 'Anemia',
    symptoms: ['extreme fatigue', 'weakness', 'pale skin', 'shortness of breath', 'dizziness', 'cold hands', 'cold feet', 'headache', 'irregular heartbeat', 'chest pain'],
    requiredSymptoms: ['extreme fatigue', 'pale skin', 'weakness'],
    specialization: 'Hematologist',
    description: 'A condition where blood lacks adequate healthy red blood cells to carry oxygen.',
    precautions: ['Eat iron-rich foods (spinach, red meat)', 'Take iron supplements', 'Get adequate rest', 'Follow up with blood tests', 'Vitamin B12 supplements']
  },
  {
    disease: 'Pneumonia',
    symptoms: ['cough with phlegm', 'fever', 'chest pain', 'difficulty breathing', 'fatigue', 'sweating', 'chills', 'nausea', 'vomiting', 'confusion', 'rapid breathing'],
    requiredSymptoms: ['cough with phlegm', 'fever', 'chest pain'],
    specialization: 'Pulmonologist',
    description: 'A serious infection that inflames air sacs in one or both lungs.',
    precautions: ['Take antibiotics as prescribed', 'Rest completely', 'Stay hydrated', 'Use humidifier', 'Seek immediate care if breathing worsens']
  },
  {
    disease: 'Sinusitis',
    symptoms: ['facial pain', 'nasal congestion', 'thick nasal discharge', 'reduced sense of smell', 'headache', 'tooth pain', 'pressure around nose', 'pressure around eyes', 'fever', 'bad breath', 'fatigue'],
    requiredSymptoms: ['facial pain', 'nasal congestion', 'thick nasal discharge'],
    specialization: 'ENT Specialist',
    description: 'Inflammation or swelling of the tissue lining the sinuses.',
    precautions: ['Use saline nasal spray', 'Apply warm compress', 'Stay hydrated', 'Take decongestants if needed', 'Steam inhalation']
  },
  {
    disease: 'Conjunctivitis (Pink Eye)',
    symptoms: ['red eyes', 'itchy eyes', 'watery eyes', 'eye discharge', 'sensitivity to light', 'gritty feeling', 'swollen eyelids', 'blurred vision', 'crusting of eyelids'],
    requiredSymptoms: ['red eyes', 'eye discharge'],
    specialization: 'Ophthalmologist',
    description: 'Inflammation or infection of the transparent membrane (conjunctiva).',
    precautions: ['Avoid touching eyes', 'Use prescribed eye drops', 'Wash hands frequently', 'Avoid sharing towels', 'Change pillowcases daily']
  },
  {
    disease: 'Allergic Rhinitis (Hay Fever)',
    symptoms: ['sneezing', 'runny nose', 'itchy eyes', 'watery eyes', 'nasal congestion', 'itchy nose', 'postnasal drip', 'cough', 'fatigue', 'headache'],
    requiredSymptoms: ['sneezing', 'itchy eyes', 'runny nose'],
    specialization: 'Allergist',
    description: 'An allergic response to pollen, dust mites, or other allergens.',
    precautions: ['Avoid allergens', 'Use antihistamines', 'Keep windows closed during high pollen', 'Use air purifier', 'Shower after being outdoors']
  },
  {
    disease: 'Bronchitis',
    symptoms: ['persistent cough', 'cough with phlegm', 'chest discomfort', 'fatigue', 'shortness of breath', 'mild fever', 'wheezing', 'sore throat', 'body aches'],
    requiredSymptoms: ['persistent cough', 'cough with phlegm'],
    specialization: 'Pulmonologist',
    description: 'Inflammation of the lining of bronchial tubes carrying air to lungs.',
    precautions: ['Rest and stay hydrated', 'Use humidifier', 'Avoid smoke and irritants', 'Take prescribed medications', 'Use cough suppressants']
  }
];

// All possible symptoms for autocomplete - expanded list
export const allSymptoms = [
  // Fever related
  'fever', 'high fever', 'mild fever', 'fever with chills', 'fever with sweating', 'persistent fever',
  
  // Cough related
  'cough', 'dry cough', 'wet cough', 'cough with phlegm', 'persistent cough', 'coughing blood', 'mild cough',
  
  // Throat related
  'sore throat', 'dry throat', 'scratchy throat', 'throat pain', 'difficulty swallowing',
  
  // Nose related
  'runny nose', 'stuffy nose', 'bloody nose', 'nasal congestion', 'loss of smell', 'sneezing', 'post-nasal drip', 'thick nasal discharge', 'reduced sense of smell',
  
  // Eye related
  'red eyes', 'itchy eyes', 'watery eyes', 'dry eyes', 'burning eyes', 'eye discharge', 'swollen eyes', 'eye pain', 'blurred vision', 'visual disturbances', 'sensitivity to light', 'gritty feeling',
  
  // Ear related
  'ear pain', 'ear discharge', 'ringing in ears', 'hearing loss', 'ear pressure',
  
  // Head related
  'headache', 'severe headache', 'mild headache', 'throbbing headache', 'tension headache', 'headache with nausea', 'dizziness', 'lightheadedness', 'vertigo', 'feeling faint', 'loss of balance',
  
  // Breathing related
  'difficulty breathing', 'shortness of breath', 'rapid breathing', 'wheezing', 'chest tightness', 'chest pain', 'chest discomfort',
  
  // Body aches
  'body aches', 'muscle pain', 'joint pain', 'back pain', 'severe back pain', 'lower back pain', 'neck pain', 'joint stiffness', 'swelling', 'joint tenderness', 'morning stiffness', 'joint warmth', 'joint redness', 'reduced range of motion',
  
  // Stomach related
  'stomach pain', 'burning stomach', 'stomach cramps', 'upset stomach', 'bloating', 'nausea', 'vomiting', 'indigestion', 'feeling full quickly', 'abdominal pain',
  
  // Urination related
  'frequent urination', 'painful urination', 'burning urination', 'urgent urination', 'blood in urine', 'cloudy urine', 'strong-smelling urine',
  
  // Skin related
  'skin rash', 'itchy skin', 'red skin', 'red patches', 'dry skin', 'oily skin', 'pale skin', 'skin inflammation', 'skin peeling', 'cracked skin', 'scaly skin', 'skin thickening', 'pimples', 'blackheads', 'whiteheads', 'red bumps', 'painful lumps', 'scarring',
  
  // General symptoms
  'fatigue', 'extreme fatigue', 'tiredness', 'weakness', 'lack of energy', 'exhaustion', 'chills', 'sweating', 'loss of appetite', 'weight loss', 'weight gain', 'increased thirst',
  
  // Cardiac symptoms
  'chest pain', 'chest tightness', 'chest pressure', 'chest discomfort', 'palpitations', 'rapid heartbeat', 'irregular heartbeat', 'slow heartbeat', 'feeling faint', 'lightheadedness', 'vertigo', 'loss of consciousness', 'fainting', 'swelling in legs', 'swelling in ankles', 'swelling in feet', 'pain in arms', 'pain in left arm', 'pain in jaw', 'pain in neck', 'pain in back', 'cold sweats',
  
  // Mental health
  'persistent sadness', 'loss of interest', 'excessive worry', 'restlessness', 'difficulty concentrating', 'sleep problems', 'mood changes', 'appetite changes', 'feelings of worthlessness', 'thoughts of death', 'trembling', 'feeling nervous', 'panic attacks',
  
  // Other
  'hair loss', 'cold hands', 'cold feet', 'pelvic pain', 'temperature sensitivity', 'slow healing wounds', 'tingling in hands', 'tingling in feet', 'irregular heartbeat', 'rapid heartbeat', 'nosebleeds', 'bad breath', 'tooth pain', 'confusion', 'loss of taste', 'sensitivity to sound'
];

// Function to get follow-up suggestions based on selected symptom
export const getFollowUpSymptoms = (selectedSymptom) => {
  const symptomLower = selectedSymptom.toLowerCase();
  
  // Check if the symptom matches any key in symptomFollowUps
  for (const [key, followUps] of Object.entries(symptomFollowUps)) {
    if (symptomLower.includes(key) || key.includes(symptomLower)) {
      return followUps;
    }
  }
  
  return [];
};

// Improved prediction algorithm with weighted symptoms
export const predictDisease = (userSymptoms) => {
  if (!userSymptoms || userSymptoms.length === 0) {
    return null;
  }

  const normalizedUserSymptoms = userSymptoms.map(s => s.toLowerCase().trim());
  
  const matches = diseaseDatabase.map(disease => {
    let weightedScore = 0;
    let exactMatches = 0;
    let partialMatches = 0;
    let requiredMatches = 0;
    let matchingSymptoms = [];
    let matchedRequiredSymptoms = [];
    let criticalSymptomMatches = 0;
    
    // Check each user symptom against disease symptoms
    normalizedUserSymptoms.forEach(userSymptom => {
      const userSymptomWeight = getSymptomWeight(userSymptom);
      
      disease.symptoms.forEach(diseaseSymptom => {
        const diseaseSymptomLower = diseaseSymptom.toLowerCase();
        const diseaseSymptomWeight = getSymptomWeight(diseaseSymptom);
        
        // Exact match
        if (userSymptom === diseaseSymptomLower) {
          exactMatches++;
          // Use the higher weight between user symptom and disease symptom
          const matchWeight = Math.max(userSymptomWeight, diseaseSymptomWeight);
          weightedScore += 20 * matchWeight;
          
          if (!matchingSymptoms.includes(diseaseSymptom)) {
            matchingSymptoms.push(diseaseSymptom);
          }
          
          // Track critical symptoms
          if (matchWeight >= 2.5) {
            criticalSymptomMatches++;
          }
          
          // Check if it's a required symptom
          if (disease.requiredSymptoms && disease.requiredSymptoms.some(req => req.toLowerCase() === userSymptom)) {
            requiredMatches++;
            matchedRequiredSymptoms.push(diseaseSymptom);
          }
        }
        // Partial match (one contains the other)
        else if (userSymptom.includes(diseaseSymptomLower) || diseaseSymptomLower.includes(userSymptom)) {
          partialMatches++;
          const matchWeight = Math.max(userSymptomWeight, diseaseSymptomWeight);
          weightedScore += 10 * matchWeight;
          
          if (!matchingSymptoms.includes(diseaseSymptom)) {
            matchingSymptoms.push(diseaseSymptom);
          }
          
          // Track critical symptoms
          if (matchWeight >= 2.5) {
            criticalSymptomMatches++;
          }
          
          // Check if it's a required symptom
          if (disease.requiredSymptoms && disease.requiredSymptoms.some(req => 
            req.toLowerCase().includes(userSymptom) || userSymptom.includes(req.toLowerCase())
          )) {
            requiredMatches++;
            if (!matchedRequiredSymptoms.includes(diseaseSymptom)) {
              matchedRequiredSymptoms.push(diseaseSymptom);
            }
          }
        }
      });
    });
    
    // Calculate max possible score with weights
    let maxPossibleScore = 0;
    disease.symptoms.forEach(symptom => {
      const weight = getSymptomWeight(symptom);
      maxPossibleScore += 20 * weight;
    });
    
    // Calculate base confidence
    let confidence = (weightedScore / maxPossibleScore) * 100;
    
    // CRITICAL: Must have at least one required symptom
    if (disease.requiredSymptoms && requiredMatches === 0) {
      confidence = 0; // No match if required symptoms not present
    } else if (disease.requiredSymptoms && requiredMatches > 0) {
      // Boost confidence significantly if required symptoms are matched
      const requiredBonus = (requiredMatches / disease.requiredSymptoms.length) * 40;
      confidence += requiredBonus;
    }
    
    // Bonus for critical symptom matches
    if (criticalSymptomMatches > 0) {
      confidence += criticalSymptomMatches * 15; // +15% per critical symptom
    }
    
    // Penalty for too few matching symptoms
    if (matchingSymptoms.length < 2) {
      confidence *= 0.5; // Reduce confidence by 50% if less than 2 symptoms match
    }
    
    // Cap confidence at 100%
    confidence = Math.min(confidence, 100);
    
    return {
      disease: disease.disease,
      specialization: disease.specialization,
      description: disease.description,
      precautions: disease.precautions,
      confidence: Math.round(confidence * 10) / 10,
      matchingSymptoms: matchingSymptoms.length,
      exactMatches: exactMatches,
      requiredMatches: requiredMatches,
      criticalSymptomMatches: criticalSymptomMatches,
      weightedScore: Math.round(weightedScore * 10) / 10,
      totalRequiredSymptoms: disease.requiredSymptoms ? disease.requiredSymptoms.length : 0,
      hasRequiredSymptoms: disease.requiredSymptoms ? requiredMatches > 0 : true
    };
  });

  // Filter and sort matches - STRICTER CRITERIA with weight consideration
  const validMatches = matches
    .filter(m => 
      m.confidence >= 30 && // Minimum confidence
      m.hasRequiredSymptoms && // Must have required symptoms
      m.matchingSymptoms >= 2 // Must match at least 2 symptoms
    )
    .sort((a, b) => {
      // Prioritize matches with critical symptoms
      if (a.criticalSymptomMatches !== b.criticalSymptomMatches) {
        return b.criticalSymptomMatches - a.criticalSymptomMatches;
      }
      // Then prioritize matches with more required symptoms
      if (a.requiredMatches !== b.requiredMatches) {
        return b.requiredMatches - a.requiredMatches;
      }
      // Then by confidence
      if (Math.abs(b.confidence - a.confidence) > 10) {
        return b.confidence - a.confidence;
      }
      // Then by weighted score
      if (Math.abs(b.weightedScore - a.weightedScore) > 20) {
        return b.weightedScore - a.weightedScore;
      }
      // Finally by exact matches
      return b.exactMatches - a.exactMatches;
    });

  // If no good matches, return General Physician
  if (validMatches.length === 0) {
    return {
      disease: 'General Health Concern',
      specialization: 'General Physician',
      description: 'Based on your symptoms, we recommend consulting a General Physician for proper evaluation and diagnosis.',
      precautions: [
        'Schedule an appointment with a General Physician',
        'Keep a detailed record of your symptoms',
        'Note when symptoms started and their severity',
        'List any medications you are currently taking'
      ],
      confidence: 0,
      top_predictions: []
    };
  }

  const topMatch = validMatches[0];
  
  return {
    disease: topMatch.disease,
    specialization: topMatch.specialization || 'General Physician',
    description: topMatch.description,
    precautions: topMatch.precautions,
    confidence: topMatch.confidence,
    criticalSymptoms: topMatch.criticalSymptomMatches > 0,
    top_predictions: validMatches.slice(0, 3).map(m => ({
      disease: m.disease,
      confidence: m.confidence,
      specialization: m.specialization || 'General Physician',
      hasCriticalSymptoms: m.criticalSymptomMatches > 0
    }))
  };
};
