#!/usr/bin/env python3
"""
Script to train the disease prediction model
Run this before starting the Flask app for the first time
"""

from ml_model import DiseasePredictor

def main():
    print("=" * 60)
    print("Disease Prediction Model Training")
    print("=" * 60)
    
    # Initialize predictor
    predictor = DiseasePredictor()
    
    # Train model
    print("\n1. Loading disease data...")
    predictor.load_data('disease_data.csv')
    print(f"   Loaded {len(predictor.disease_data)} diseases")
    print(f"   Total unique symptoms: {len(predictor.symptom_list)}")
    
    print("\n2. Training model...")
    accuracy = predictor.train_model()
    print(f"   Model trained with {accuracy*100:.2f}% accuracy")
    
    print("\n3. Saving model...")
    predictor.save_model('disease_model.pkl')
    print("   Model saved successfully!")
    
    # Test the model
    print("\n4. Testing model...")
    test_cases = [
        ['fever', 'cough', 'fatigue'],
        ['chest pain', 'shortness of breath', 'rapid heartbeat'],
        ['headache', 'nausea', 'sensitivity to light'],
        ['itchy skin', 'red patches', 'dry skin']
    ]
    
    for symptoms in test_cases:
        prediction, top_diseases = predictor.predict_disease(symptoms)
        print(f"\n   Symptoms: {', '.join(symptoms)}")
        print(f"   Prediction: {prediction} ({top_diseases[0][1]*100:.1f}% confidence)")
    
    print("\n" + "=" * 60)
    print("Training Complete!")
    print("=" * 60)
    print("\nYou can now start the Flask app with: python app.py")

if __name__ == "__main__":
    main()
