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

// Enhanced disease database with more accurate symptom mapping
export const diseaseDatabase = [
  {
    disease: 'Common Cold',
    symptoms: ['runny nose', 'sneezing', 'sore throat', 'mild cough', 'nasal congestion', 'mild fever'],
    requiredSymptoms: ['runny nose', 'sneezing'], // Must have at least one
    specialization: 'General Physician',
    description: 'A viral infection of the upper respiratory tract.',
    precautions: ['Rest and stay hydrated', 'Use over-the-counter cold medications', 'Avoid close contact with others', 'Wash hands frequently']
  },
  {
    disease: 'Influenza (Flu)',
    symptoms: ['high fever', 'fever', 'body aches', 'extreme fatigue', 'dry cough', 'severe headache', 'chills', 'muscle pain', 'back pain'],
    requiredSymptoms: ['fever', 'body aches', 'extreme fatigue'],
    specialization: 'General Physician',
    description: 'A contagious respiratory illness caused by influenza viruses.',
    precautions: ['Get plenty of rest', 'Stay hydrated', 'Take antiviral medications if prescribed', 'Avoid contact with others']
  },
  {
    disease: 'Viral Fever',
    symptoms: ['fever', 'headache', 'body aches', 'fatigue', 'weakness', 'chills', 'sweating'],
    requiredSymptoms: ['fever'],
    specialization: 'General Physician',
    description: 'A common viral infection causing fever and general discomfort.',
    precautions: ['Rest adequately', 'Stay hydrated', 'Take fever-reducing medication', 'Monitor temperature regularly']
  },
  {
    disease: 'Back Pain / Muscle Strain',
    symptoms: ['back pain', 'muscle pain', 'stiffness', 'limited mobility', 'pain when moving'],
    requiredSymptoms: ['back pain'],
    specialization: 'General Physician',
    description: 'Muscle strain or injury causing back pain.',
    precautions: ['Rest and avoid heavy lifting', 'Apply hot/cold compress', 'Take pain relievers', 'Gentle stretching exercises']
  },
  {
    disease: 'COVID-19',
    symptoms: ['fever', 'dry cough', 'fatigue', 'loss of taste', 'loss of smell', 'difficulty breathing', 'body aches'],
    requiredSymptoms: ['loss of taste', 'loss of smell', 'dry cough'],
    specialization: 'General Physician',
    description: 'A respiratory illness caused by the SARS-CoV-2 virus.',
    precautions: ['Isolate yourself', 'Monitor oxygen levels', 'Seek medical attention if breathing worsens', 'Stay hydrated']
  },
  {
    disease: 'Migraine',
    symptoms: ['severe headache', 'throbbing headache', 'nausea', 'vomiting', 'sensitivity to light', 'sensitivity to sound'],
    requiredSymptoms: ['severe headache', 'throbbing headache'],
    specialization: 'Neurologist',
    description: 'A neurological condition characterized by intense headaches.',
    precautions: ['Rest in a dark, quiet room', 'Apply cold compress', 'Take prescribed medications', 'Avoid triggers']
  },
  {
    disease: 'Tension Headache',
    symptoms: ['mild headache', 'headache', 'pressure around head', 'neck pain', 'fatigue'],
    requiredSymptoms: ['headache'],
    specialization: 'General Physician',
    description: 'The most common type of headache caused by muscle tension.',
    precautions: ['Rest and relax', 'Apply warm compress', 'Take over-the-counter pain relievers', 'Reduce stress']
  },
  {
    disease: 'Hypertension',
    symptoms: ['headache', 'dizziness', 'blurred vision', 'chest pain', 'shortness of breath', 'nosebleeds'],
    requiredSymptoms: ['headache', 'dizziness'],
    specialization: 'Cardiologist',
    description: 'High blood pressure that can lead to serious health complications.',
    precautions: ['Monitor blood pressure regularly', 'Reduce salt intake', 'Exercise regularly', 'Take prescribed medications']
  },
  {
    disease: 'Type 2 Diabetes',
    symptoms: ['increased thirst', 'frequent urination', 'extreme fatigue', 'blurred vision', 'slow healing wounds'],
    requiredSymptoms: ['increased thirst', 'frequent urination'],
    specialization: 'Endocrinologist',
    description: 'A chronic condition affecting how the body processes blood sugar.',
    precautions: ['Monitor blood sugar levels', 'Follow a healthy diet', 'Exercise regularly', 'Take medications as prescribed']
  },
  {
    disease: 'Asthma',
    symptoms: ['wheezing', 'shortness of breath', 'chest tightness', 'persistent cough', 'difficulty breathing'],
    requiredSymptoms: ['wheezing', 'shortness of breath'],
    specialization: 'Pulmonologist',
    description: 'A condition causing airways to narrow and produce extra mucus.',
    precautions: ['Use inhaler as prescribed', 'Avoid triggers', 'Monitor symptoms', 'Keep rescue inhaler handy']
  },
  {
    disease: 'Gastritis',
    symptoms: ['stomach pain', 'burning stomach', 'nausea', 'vomiting', 'bloating', 'loss of appetite'],
    requiredSymptoms: ['stomach pain', 'burning stomach'],
    specialization: 'Gastroenterologist',
    description: 'Inflammation of the stomach lining.',
    precautions: ['Avoid spicy foods', 'Eat smaller meals', 'Avoid alcohol', 'Take antacids if needed']
  },
  {
    disease: 'Food Poisoning',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomach cramps', 'fever', 'weakness'],
    requiredSymptoms: ['nausea', 'vomiting', 'diarrhea'],
    specialization: 'General Physician',
    description: 'Illness caused by eating contaminated food.',
    precautions: ['Stay hydrated', 'Rest', 'Avoid solid foods initially', 'Seek medical help if severe']
  },
  {
    disease: 'Urinary Tract Infection',
    symptoms: ['burning urination', 'frequent urination', 'urgent urination', 'cloudy urine', 'pelvic pain', 'blood in urine'],
    requiredSymptoms: ['burning urination', 'frequent urination'],
    specialization: 'Urologist',
    description: 'An infection in any part of the urinary system.',
    precautions: ['Drink plenty of water', 'Take antibiotics as prescribed', 'Avoid irritants', 'Practice good hygiene']
  },
  {
    disease: 'Arthritis',
    symptoms: ['joint pain', 'joint stiffness', 'swelling', 'reduced range of motion', 'morning stiffness'],
    requiredSymptoms: ['joint pain', 'joint stiffness'],
    specialization: 'Rheumatologist',
    description: 'Inflammation of one or more joints causing pain and stiffness.',
    precautions: ['Stay active with low-impact exercise', 'Maintain healthy weight', 'Use hot/cold therapy', 'Take anti-inflammatory medications']
  },
  {
    disease: 'Depression',
    symptoms: ['persistent sadness', 'loss of interest', 'extreme fatigue', 'sleep problems', 'difficulty concentrating', 'appetite changes'],
    requiredSymptoms: ['persistent sadness', 'loss of interest'],
    specialization: 'Psychiatrist',
    description: 'A mood disorder causing persistent feelings of sadness.',
    precautions: ['Seek professional help', 'Stay connected with others', 'Exercise regularly', 'Follow treatment plan']
  },
  {
    disease: 'Anxiety Disorder',
    symptoms: ['excessive worry', 'restlessness', 'rapid heartbeat', 'sweating', 'difficulty concentrating', 'panic attacks'],
    requiredSymptoms: ['excessive worry', 'restlessness'],
    specialization: 'Psychiatrist',
    description: 'A mental health condition characterized by excessive worry.',
    precautions: ['Practice relaxation techniques', 'Exercise regularly', 'Limit caffeine', 'Seek therapy']
  },
  {
    disease: 'Eczema',
    symptoms: ['itchy skin', 'red patches', 'dry skin', 'skin inflammation', 'skin rash', 'cracked skin'],
    requiredSymptoms: ['itchy skin', 'red patches'],
    specialization: 'Dermatologist',
    description: 'A condition causing skin to become itchy and inflamed.',
    precautions: ['Moisturize regularly', 'Avoid triggers', 'Use prescribed creams', 'Take lukewarm baths']
  },
  {
    disease: 'Acne',
    symptoms: ['pimples', 'blackheads', 'whiteheads', 'oily skin', 'skin inflammation', 'red bumps'],
    requiredSymptoms: ['pimples'],
    specialization: 'Dermatologist',
    description: 'A skin condition causing pimples and blemishes.',
    precautions: ['Cleanse face twice daily', 'Avoid touching face', 'Use non-comedogenic products', 'Consider prescribed treatments']
  },
  {
    disease: 'Anemia',
    symptoms: ['extreme fatigue', 'weakness', 'pale skin', 'shortness of breath', 'dizziness', 'cold hands', 'cold feet'],
    requiredSymptoms: ['extreme fatigue', 'pale skin'],
    specialization: 'General Physician',
    description: 'A condition where blood lacks adequate healthy red blood cells.',
    precautions: ['Eat iron-rich foods', 'Take iron supplements', 'Get adequate rest', 'Follow up with blood tests']
  },
  {
    disease: 'Pneumonia',
    symptoms: ['cough with phlegm', 'fever', 'chest pain', 'difficulty breathing', 'fatigue', 'sweating', 'chills'],
    requiredSymptoms: ['cough with phlegm', 'fever', 'chest pain'],
    specialization: 'Pulmonologist',
    description: 'An infection that inflames air sacs in the lungs.',
    precautions: ['Take antibiotics as prescribed', 'Rest and stay hydrated', 'Use humidifier', 'Seek immediate care if breathing worsens']
  },
  {
    disease: 'Sinusitis',
    symptoms: ['facial pain', 'nasal congestion', 'thick nasal discharge', 'reduced sense of smell', 'headache', 'tooth pain', 'pressure around nose', 'pressure around eyes'],
    requiredSymptoms: ['facial pain', 'nasal congestion', 'thick nasal discharge'],
    specialization: 'ENT Specialist',
    description: 'Inflammation of the sinuses.',
    precautions: ['Use saline nasal spray', 'Apply warm compress', 'Stay hydrated', 'Take decongestants if needed']
  },
  {
    disease: 'Conjunctivitis (Pink Eye)',
    symptoms: ['red eyes', 'itchy eyes', 'watery eyes', 'eye discharge', 'sensitivity to light', 'gritty feeling'],
    requiredSymptoms: ['red eyes', 'eye discharge'],
    specialization: 'Ophthalmologist',
    description: 'Inflammation of the conjunctiva.',
    precautions: ['Avoid touching eyes', 'Use prescribed eye drops', 'Wash hands frequently', 'Avoid sharing towels']
  },
  {
    disease: 'Allergic Rhinitis',
    symptoms: ['sneezing', 'runny nose', 'itchy eyes', 'watery eyes', 'nasal congestion', 'itchy nose'],
    requiredSymptoms: ['sneezing', 'itchy eyes'],
    specialization: 'Allergist',
    description: 'An allergic response causing cold-like symptoms.',
    precautions: ['Avoid allergens', 'Use antihistamines', 'Keep windows closed', 'Use air purifier']
  },
  {
    disease: 'Bronchitis',
    symptoms: ['persistent cough', 'cough with phlegm', 'chest discomfort', 'fatigue', 'shortness of breath', 'mild fever'],
    requiredSymptoms: ['persistent cough', 'cough with phlegm'],
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

// Improved prediction algorithm with stricter matching
export const predictDisease = (userSymptoms) => {
  if (!userSymptoms || userSymptoms.length === 0) {
    return null;
  }

  const normalizedUserSymptoms = userSymptoms.map(s => s.toLowerCase().trim());
  
  const matches = diseaseDatabase.map(disease => {
    let exactMatches = 0;
    let partialMatches = 0;
    let requiredMatches = 0;
    let matchingSymptoms = [];
    let matchedRequiredSymptoms = [];
    
    // Check each user symptom against disease symptoms
    normalizedUserSymptoms.forEach(userSymptom => {
      disease.symptoms.forEach(diseaseSymptom => {
        const diseaseSymptomLower = diseaseSymptom.toLowerCase();
        
        // Exact match
        if (userSymptom === diseaseSymptomLower) {
          exactMatches++;
          if (!matchingSymptoms.includes(diseaseSymptom)) {
            matchingSymptoms.push(diseaseSymptom);
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
          if (!matchingSymptoms.includes(diseaseSymptom)) {
            matchingSymptoms.push(diseaseSymptom);
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
    
    // Calculate match score
    const exactScore = exactMatches * 20;
    const partialScore = partialMatches * 10;
    const totalScore = exactScore + partialScore;
    
    // Calculate base confidence
    const maxPossibleScore = disease.symptoms.length * 20;
    let confidence = (totalScore / maxPossibleScore) * 100;
    
    // CRITICAL: Must have at least one required symptom
    if (disease.requiredSymptoms && requiredMatches === 0) {
      confidence = 0; // No match if required symptoms not present
    } else if (disease.requiredSymptoms && requiredMatches > 0) {
      // Boost confidence significantly if required symptoms are matched
      const requiredBonus = (requiredMatches / disease.requiredSymptoms.length) * 40;
      confidence += requiredBonus;
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
      totalRequiredSymptoms: disease.requiredSymptoms ? disease.requiredSymptoms.length : 0,
      hasRequiredSymptoms: disease.requiredSymptoms ? requiredMatches > 0 : true
    };
  });

  // Filter and sort matches - STRICTER CRITERIA
  const validMatches = matches
    .filter(m => 
      m.confidence >= 30 && // Increased minimum confidence
      m.hasRequiredSymptoms && // Must have required symptoms
      m.matchingSymptoms >= 2 // Must match at least 2 symptoms
    )
    .sort((a, b) => {
      // Prioritize matches with more required symptoms
      if (a.requiredMatches !== b.requiredMatches) {
        return b.requiredMatches - a.requiredMatches;
      }
      // Then by confidence
      if (Math.abs(b.confidence - a.confidence) > 10) {
        return b.confidence - a.confidence;
      }
      // Then by exact matches
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
    top_predictions: validMatches.slice(0, 3).map(m => ({
      disease: m.disease,
      confidence: m.confidence,
      specialization: m.specialization || 'General Physician'
    }))
  };
};
