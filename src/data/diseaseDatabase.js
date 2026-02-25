// Symptom follow-up questions - when user selects a symptom, suggest related symptoms
export const symptomFollowUps = {
  'fever': ['high fever', 'mild fever', 'fever with chills', 'fever with sweating', 'persistent fever'],
  'cold': ['runny nose', 'stuffy nose', 'sneezing', 'nasal congestion', 'post-nasal drip'],
  'eye': ['red eyes', 'itchy eyes', 'watery eyes', 'dry eyes', 'burning eyes', 'eye discharge', 'swollen eyes', 'eye pain'],
  'cough': ['dry cough', 'wet cough', 'cough with phlegm', 'persistent cough', 'coughing blood'],
  'headache': ['severe headache', 'mild headache', 'throbbing headache', 'tension headache', 'headache with nausea'],
  'pain': ['chest pain', 'stomach pain', 'back pain', 'joint pain', 'muscle pain', 'abdominal pain'],
  'throat': ['sore throat', 'dry throat', 'scratchy throat', 'throat pain', 'difficulty swallowing'],
  'breathing': ['difficulty breathing', 'shortness of breath', 'rapid breathing', 'wheezing', 'chest tightness'],
  'stomach': ['stomach pain', 'stomach cramps', 'upset stomach', 'bloating', 'nausea'],
  'skin': ['skin rash', 'itchy skin', 'red skin', 'dry skin', 'oily skin', 'skin inflammation', 'skin peeling'],
  'nose': ['runny nose', 'stuffy nose', 'bloody nose', 'nasal congestion', 'loss of smell'],
  'ear': ['ear pain', 'ear discharge', 'ringing in ears', 'hearing loss', 'ear pressure'],
  'fatigue': ['extreme fatigue', 'tiredness', 'weakness', 'lack of energy', 'exhaustion'],
  'dizziness': ['lightheadedness', 'vertigo', 'feeling faint', 'loss of balance'],
  'urination': ['frequent urination', 'painful urination', 'burning urination', 'blood in urine', 'cloudy urine'],
};

// Comprehensive disease database with detailed symptoms
export const diseaseDatabase = [
  {
    disease: 'Common Cold',
    symptoms: ['runny nose', 'stuffy nose', 'sneezing', 'sore throat', 'mild cough', 'mild fever', 'fatigue', 'headache', 'watery eyes', 'post-nasal drip'],
    specialization: 'General Physician',
    description: 'A viral infection of the upper respiratory tract.',
    precautions: ['Rest and stay hydrated', 'Use over-the-counter cold medications', 'Avoid close contact with others', 'Wash hands frequently']
  },
  {
    disease: 'Influenza (Flu)',
    symptoms: ['high fever', 'body aches', 'extreme fatigue', 'dry cough', 'sore throat', 'severe headache', 'chills', 'sweating', 'muscle pain'],
    specialization: 'General Physician',
    description: 'A contagious respiratory illness caused by influenza viruses.',
    precautions: ['Get plenty of rest', 'Stay hydrated', 'Take antiviral medications if prescribed', 'Avoid contact with others']
  },
  {
    disease: 'COVID-19',
    symptoms: ['fever', 'dry cough', 'fatigue', 'loss of taste', 'loss of smell', 'difficulty breathing', 'body aches', 'sore throat', 'headache', 'chest pain'],
    specialization: 'Infectious Disease Specialist',
    description: 'A respiratory illness caused by the SARS-CoV-2 virus.',
    precautions: ['Isolate yourself', 'Monitor oxygen levels', 'Seek medical attention if breathing worsens', 'Stay hydrated']
  },
  {
    disease: 'Migraine',
    symptoms: ['severe headache', 'throbbing headache', 'nausea', 'vomiting', 'sensitivity to light', 'sensitivity to sound', 'visual disturbances', 'dizziness'],
    specialization: 'Neurologist',
    description: 'A neurological condition characterized by intense headaches.',
    precautions: ['Rest in a dark, quiet room', 'Apply cold compress', 'Take prescribed medications', 'Avoid triggers']
  },
  {
    disease: 'Hypertension',
    symptoms: ['headache', 'dizziness', 'blurred vision', 'chest pain', 'shortness of breath', 'nosebleeds', 'fatigue', 'irregular heartbeat'],
    specialization: 'Cardiologist',
    description: 'High blood pressure that can lead to serious health complications.',
    precautions: ['Monitor blood pressure regularly', 'Reduce salt intake', 'Exercise regularly', 'Take prescribed medications']
  },
  {
    disease: 'Type 2 Diabetes',
    symptoms: ['increased thirst', 'frequent urination', 'extreme fatigue', 'blurred vision', 'slow healing wounds', 'tingling in hands', 'tingling in feet', 'weight loss'],
    specialization: 'Endocrinologist',
    description: 'A chronic condition affecting how the body processes blood sugar.',
    precautions: ['Monitor blood sugar levels', 'Follow a healthy diet', 'Exercise regularly', 'Take medications as prescribed']
  },
  {
    disease: 'Asthma',
    symptoms: ['wheezing', 'shortness of breath', 'chest tightness', 'persistent cough', 'difficulty breathing', 'rapid breathing', 'chest pain'],
    specialization: 'Pulmonologist',
    description: 'A condition causing airways to narrow and produce extra mucus.',
    precautions: ['Use inhaler as prescribed', 'Avoid triggers', 'Monitor symptoms', 'Keep rescue inhaler handy']
  },
  {
    disease: 'Gastritis',
    symptoms: ['stomach pain', 'burning stomach', 'nausea', 'vomiting', 'bloating', 'loss of appetite', 'indigestion', 'feeling full quickly'],
    specialization: 'Gastroenterologist',
    description: 'Inflammation of the stomach lining.',
    precautions: ['Avoid spicy foods', 'Eat smaller meals', 'Avoid alcohol', 'Take antacids if needed']
  },
  {
    disease: 'Urinary Tract Infection',
    symptoms: ['burning urination', 'frequent urination', 'urgent urination', 'cloudy urine', 'pelvic pain', 'strong-smelling urine', 'blood in urine', 'lower back pain'],
    specialization: 'Urologist',
    description: 'An infection in any part of the urinary system.',
    precautions: ['Drink plenty of water', 'Take antibiotics as prescribed', 'Avoid irritants', 'Practice good hygiene']
  },
  {
    disease: 'Arthritis',
    symptoms: ['joint pain', 'joint stiffness', 'swelling', 'reduced range of motion', 'joint tenderness', 'morning stiffness', 'joint warmth', 'joint redness'],
    specialization: 'Rheumatologist',
    description: 'Inflammation of one or more joints causing pain and stiffness.',
    precautions: ['Stay active with low-impact exercise', 'Maintain healthy weight', 'Use hot/cold therapy', 'Take anti-inflammatory medications']
  },
  {
    disease: 'Depression',
    symptoms: ['persistent sadness', 'loss of interest', 'extreme fatigue', 'sleep problems', 'difficulty concentrating', 'appetite changes', 'feelings of worthlessness', 'thoughts of death'],
    specialization: 'Psychiatrist',
    description: 'A mood disorder causing persistent feelings of sadness.',
    precautions: ['Seek professional help', 'Stay connected with others', 'Exercise regularly', 'Follow treatment plan']
  },
  {
    disease: 'Anxiety Disorder',
    symptoms: ['excessive worry', 'restlessness', 'rapid heartbeat', 'sweating', 'difficulty concentrating', 'sleep problems', 'trembling', 'feeling nervous', 'panic attacks'],
    specialization: 'Psychiatrist',
    description: 'A mental health condition characterized by excessive worry.',
    precautions: ['Practice relaxation techniques', 'Exercise regularly', 'Limit caffeine', 'Seek therapy']
  },
  {
    disease: 'Eczema',
    symptoms: ['itchy skin', 'red patches', 'dry skin', 'skin inflammation', 'skin rash', 'cracked skin', 'scaly skin', 'skin thickening'],
    specialization: 'Dermatologist',
    description: 'A condition causing skin to become itchy and inflamed.',
    precautions: ['Moisturize regularly', 'Avoid triggers', 'Use prescribed creams', 'Take lukewarm baths']
  },
  {
    disease: 'Acne',
    symptoms: ['pimples', 'blackheads', 'whiteheads', 'oily skin', 'skin inflammation', 'red bumps', 'painful lumps', 'scarring'],
    specialization: 'Dermatologist',
    description: 'A skin condition causing pimples and blemishes.',
    precautions: ['Cleanse face twice daily', 'Avoid touching face', 'Use non-comedogenic products', 'Consider prescribed treatments']
  },
  {
    disease: 'Anemia',
    symptoms: ['extreme fatigue', 'weakness', 'pale skin', 'shortness of breath', 'dizziness', 'cold hands', 'cold feet', 'irregular heartbeat', 'chest pain'],
    specialization: 'Hematologist',
    description: 'A condition where blood lacks adequate healthy red blood cells.',
    precautions: ['Eat iron-rich foods', 'Take iron supplements', 'Get adequate rest', 'Follow up with blood tests']
  },
  {
    disease: 'Thyroid Disorder',
    symptoms: ['fatigue', 'weight changes', 'mood changes', 'temperature sensitivity', 'hair loss', 'dry skin', 'muscle weakness', 'irregular heartbeat'],
    specialization: 'Endocrinologist',
    description: 'Abnormal functioning of the thyroid gland.',
    precautions: ['Take thyroid medication as prescribed', 'Regular blood tests', 'Maintain healthy diet', 'Monitor symptoms']
  },
  {
    disease: 'Pneumonia',
    symptoms: ['cough with phlegm', 'fever', 'chest pain', 'difficulty breathing', 'fatigue', 'sweating', 'chills', 'rapid breathing', 'confusion'],
    specialization: 'Pulmonologist',
    description: 'An infection that inflames air sacs in the lungs.',
    precautions: ['Take antibiotics as prescribed', 'Rest and stay hydrated', 'Use humidifier', 'Seek immediate care if breathing worsens']
  },
  {
    disease: 'Kidney Stones',
    symptoms: ['severe back pain', 'blood in urine', 'nausea', 'vomiting', 'frequent urination', 'painful urination', 'cloudy urine', 'fever', 'chills'],
    specialization: 'Nephrologist',
    description: 'Hard deposits of minerals and salts in the kidneys.',
    precautions: ['Drink plenty of water', 'Take pain medication', 'Strain urine to catch stones', 'Follow dietary recommendations']
  },
  {
    disease: 'Sinusitis',
    symptoms: ['facial pain', 'nasal congestion', 'thick nasal discharge', 'reduced sense of smell', 'headache', 'tooth pain', 'ear pressure', 'fever', 'bad breath'],
    specialization: 'ENT Specialist',
    description: 'Inflammation of the sinuses.',
    precautions: ['Use saline nasal spray', 'Apply warm compress', 'Stay hydrated', 'Take decongestants if needed']
  },
  {
    disease: 'Conjunctivitis (Pink Eye)',
    symptoms: ['red eyes', 'itchy eyes', 'watery eyes', 'eye discharge', 'sensitivity to light', 'gritty feeling', 'swollen eyelids', 'blurred vision'],
    specialization: 'Ophthalmologist',
    description: 'Inflammation of the conjunctiva.',
    precautions: ['Avoid touching eyes', 'Use prescribed eye drops', 'Wash hands frequently', 'Avoid sharing towels']
  },
  {
    disease: 'Allergic Rhinitis',
    symptoms: ['sneezing', 'runny nose', 'itchy eyes', 'watery eyes', 'nasal congestion', 'itchy nose', 'post-nasal drip', 'cough'],
    specialization: 'Allergist',
    description: 'An allergic response causing cold-like symptoms.',
    precautions: ['Avoid allergens', 'Use antihistamines', 'Keep windows closed', 'Use air purifier']
  },
  {
    disease: 'Bronchitis',
    symptoms: ['persistent cough', 'cough with phlegm', 'chest discomfort', 'fatigue', 'shortness of breath', 'mild fever', 'chills', 'wheezing'],
    specialization: 'Pulmonologist',
    description: 'Inflammation of the bronchial tubes.',
    precautions: ['Rest and stay hydrated', 'Use humidifier', 'Avoid smoke', 'Take prescribed medications']
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

// Enhanced symptom matching algorithm with better accuracy
export const predictDisease = (userSymptoms) => {
  if (!userSymptoms || userSymptoms.length === 0) {
    return null;
  }

  const normalizedUserSymptoms = userSymptoms.map(s => s.toLowerCase().trim());
  
  const matches = diseaseDatabase.map(disease => {
    let matchScore = 0;
    let matchingSymptoms = [];
    
    // Check each disease symptom against user symptoms
    disease.symptoms.forEach(diseaseSymptom => {
      const diseaseSymptomLower = diseaseSymptom.toLowerCase();
      
      normalizedUserSymptoms.forEach(userSymptom => {
        // Exact match - highest score
        if (userSymptom === diseaseSymptomLower) {
          matchScore += 10;
          if (!matchingSymptoms.includes(diseaseSymptom)) {
            matchingSymptoms.push(diseaseSymptom);
          }
        }
        // Contains match - medium score
        else if (userSymptom.includes(diseaseSymptomLower) || diseaseSymptomLower.includes(userSymptom)) {
          matchScore += 7;
          if (!matchingSymptoms.includes(diseaseSymptom)) {
            matchingSymptoms.push(diseaseSymptom);
          }
        }
        // Partial word match - lower score
        else {
          const userWords = userSymptom.split(' ');
          const diseaseWords = diseaseSymptomLower.split(' ');
          const commonWords = userWords.filter(word => diseaseWords.includes(word) && word.length > 3);
          if (commonWords.length > 0) {
            matchScore += 3 * commonWords.length;
            if (!matchingSymptoms.includes(diseaseSymptom)) {
              matchingSymptoms.push(diseaseSymptom);
            }
          }
        }
      });
    });
    
    // Calculate confidence based on match score and symptom coverage
    const maxPossibleScore = disease.symptoms.length * 10;
    const scoreConfidence = (matchScore / maxPossibleScore) * 100;
    
    // Bonus for matching more symptoms
    const symptomCoverage = (matchingSymptoms.length / Math.min(disease.symptoms.length, normalizedUserSymptoms.length)) * 100;
    
    // Weighted average: 60% score confidence, 40% symptom coverage
    const confidence = Math.min((scoreConfidence * 0.6 + symptomCoverage * 0.4), 100);
    
    return {
      disease: disease.disease,
      specialization: disease.specialization,
      description: disease.description,
      precautions: disease.precautions,
      confidence: Math.round(confidence * 10) / 10, // Round to 1 decimal
      matchingSymptoms: matchingSymptoms.length,
      totalSymptoms: disease.symptoms.length,
      matchScore: matchScore
    };
  });

  // Sort by confidence and match score
  const sortedMatches = matches
    .filter(m => m.confidence > 15) // Only show matches with at least 15% confidence
    .sort((a, b) => {
      if (Math.abs(b.confidence - a.confidence) < 5) {
        return b.matchScore - a.matchScore; // If confidence is close, use match score
      }
      return b.confidence - a.confidence;
    });

  // If no good matches found, return General Physician recommendation
  if (sortedMatches.length === 0 || sortedMatches[0].confidence < 20) {
    return {
      disease: 'Unspecified Condition',
      specialization: 'General Physician',
      description: 'Based on your symptoms, we recommend consulting a General Physician for proper diagnosis and treatment.',
      precautions: [
        'Schedule an appointment with a General Physician',
        'Keep track of your symptoms and when they occur',
        'Note any factors that make symptoms better or worse',
        'Bring a list of current medications to your appointment'
      ],
      confidence: 0,
      top_predictions: []
    };
  }

  const topMatch = sortedMatches[0];
  
  // If specialization is not available or too specific, default to General Physician
  let specialization = topMatch.specialization;
  if (!specialization || specialization === 'Unknown' || topMatch.confidence < 40) {
    specialization = 'General Physician';
  }
  
  return {
    disease: topMatch.disease,
    specialization: specialization,
    description: topMatch.description,
    precautions: topMatch.precautions,
    confidence: topMatch.confidence,
    top_predictions: sortedMatches.slice(0, 3).map(m => ({
      disease: m.disease,
      confidence: m.confidence,
      specialization: m.specialization || 'General Physician'
    }))
  };
};
