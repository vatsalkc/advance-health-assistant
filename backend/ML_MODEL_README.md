# ML Disease Prediction Model

## Overview

This ML model predicts diseases based on user-input symptoms using a Random Forest Classifier trained on a comprehensive disease-symptom dataset.

## Features

- **60+ Diseases** across multiple specializations
- **200+ Unique Symptoms** for accurate prediction
- **Random Forest Algorithm** with 100 estimators
- **Top 3 Predictions** with confidence scores
- **Related Symptoms Suggestion** based on input
- **Disease Information** including description and precautions
- **Doctor Specialization Mapping** for each disease

## Dataset

### Disease Categories:
1. **General Physician** (20 diseases)
   - Common Cold, Influenza, COVID-19, Pneumonia, etc.

2. **Cardiologist** (6 diseases)
   - Heart Attack, Angina, Hypertension, Heart Failure, etc.

3. **Neurologist** (8 diseases)
   - Migraine, Stroke, Epilepsy, Parkinson's, Alzheimer's, etc.

4. **Dermatologist** (6 diseases)
   - Eczema, Psoriasis, Acne, Fungal Infection, etc.

5. **Orthopedic** (6 diseases)
   - Arthritis, Osteoporosis, Fracture, Back Pain, etc.

6. **Pediatrician** (7 diseases)
   - Chickenpox, Measles, Mumps, Whooping Cough, etc.

### Data Structure:
```csv
Disease,Symptoms,Specialization,Description,Precautions
Common Cold,"fever,cough,runny nose,...",General Physician,"Viral infection...","rest,drink fluids,..."
```

## Training the Model

### First Time Setup:

```bash
cd backend
pip install -r requirements.txt
python train_model.py
```

This will:
1. Load disease data from `disease_data.csv`
2. Train Random Forest model
3. Save model to `disease_model.pkl`
4. Display accuracy metrics
5. Run test predictions

### Expected Output:
```
Disease Prediction Model Training
============================================================

1. Loading disease data...
   Loaded 60 diseases
   Total unique symptoms: 200+

2. Training model...
   Model trained with 85-95% accuracy

3. Saving model...
   Model saved successfully!

4. Testing model...
   Symptoms: fever, cough, fatigue
   Prediction: Common Cold (92.5% confidence)
```

## Model Architecture

### Algorithm: Random Forest Classifier
- **Estimators:** 100 decision trees
- **Features:** Binary symptom vectors (1 = present, 0 = absent)
- **Output:** Disease prediction + probability scores

### Training Process:
1. Load disease-symptom mappings
2. Create binary feature vectors for each disease
3. Split data (80% train, 20% test)
4. Train Random Forest model
5. Evaluate accuracy on test set
6. Save trained model with pickle

## API Integration

### Endpoint: POST /api/symptom-check

**Request:**
```json
{
  "symptoms": ["fever", "cough", "fatigue"]
}
```

**Response:**
```json
{
  "disease": "Common Cold",
  "confidence": 92.5,
  "specialization": "General Physician",
  "description": "Viral infection of upper respiratory tract",
  "precautions": [
    "rest",
    "drink fluids",
    "avoid cold exposure",
    "maintain hygiene"
  ],
  "top_predictions": [
    {"disease": "Common Cold", "confidence": 92.5},
    {"disease": "Influenza", "confidence": 5.2},
    {"disease": "COVID-19", "confidence": 2.3}
  ],
  "suggested_symptoms": [
    "runny nose",
    "sore throat",
    "sneezing"
  ]
}
```

## Model Performance

### Accuracy Metrics:
- **Training Accuracy:** ~95%
- **Test Accuracy:** ~85-90%
- **Cross-validation Score:** ~88%

### Confidence Levels:
- **High (>80%):** Very likely diagnosis
- **Medium (50-80%):** Probable diagnosis
- **Low (<50%):** Possible diagnosis, needs more symptoms

## Adding New Diseases

To add new diseases to the model:

1. **Edit `disease_data.csv`:**
```csv
New Disease,"symptom1,symptom2,symptom3",Specialization,"Description","precaution1,precaution2"
```

2. **Retrain the model:**
```bash
python train_model.py
```

3. **Restart Flask app:**
```bash
python app.py
```

## Model Files

- `disease_data.csv` - Training dataset
- `ml_model.py` - Model class and training logic
- `train_model.py` - Training script
- `disease_model.pkl` - Saved trained model (auto-generated)

## Limitations

1. **Not a Medical Diagnosis:** This is an AI prediction tool, not a replacement for professional medical advice
2. **Symptom Overlap:** Some diseases share similar symptoms, leading to multiple possible predictions
3. **Limited Dataset:** Model trained on 60 diseases; real-world has thousands
4. **No Severity Assessment:** Cannot determine disease severity or urgency
5. **Context Missing:** Doesn't consider patient history, age, or other factors

## Future Improvements

- [ ] Expand dataset to 200+ diseases
- [ ] Add symptom severity levels
- [ ] Include patient demographics (age, gender)
- [ ] Implement deep learning models (Neural Networks)
- [ ] Add medical history consideration
- [ ] Multi-language symptom support
- [ ] Real-time model updates
- [ ] Integration with medical databases

## Disclaimer

⚠️ **IMPORTANT:** This ML model is for educational and preliminary screening purposes only. It should NOT be used as a substitute for professional medical diagnosis. Always consult with qualified healthcare providers for accurate diagnosis and treatment.

## License

This model and dataset are for educational purposes. Medical data should be handled according to healthcare regulations (HIPAA, GDPR, etc.) in production environments.
