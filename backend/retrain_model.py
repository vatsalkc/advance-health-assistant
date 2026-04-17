#!/usr/bin/env python3
"""
Script to retrain the disease prediction model with improved accuracy
Run this to update the model with the new confidence capping logic
"""

import os
import sys

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ml_model import DiseasePredictor

def main():
    print("=" * 60)
    print("Retraining Disease Prediction Model")
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
    
    # Test the model with confidence capping
    print("\n4. Testing model with confidence capping...")
    test_cases = [
        ['fever', 'cough', 'fatigue'],
        ['chest pain', 'shortness of breath', 'rapid heartbeat'],
        ['headache', 'nausea', 'sensitivity to light'],
        ['itchy skin', 'red patches', 'dry skin']
    ]
    
    for symptoms in test_cases:
        prediction, top_diseases = predictor.predict_disease(symptoms)
        print(f"\n   Symptoms: {', '.join(symptoms)}")
        print(f"   Prediction: {prediction}")
        print(f"   Confidence: {top_diseases[0][1]*100:.1f}% (capped at 95%)")
        print(f"   Top 3 predictions:")
        for disease, prob in top_diseases:
            print(f"     - {disease}: {prob*100:.1f}%")
    
    print("\n" + "=" * 60)
    print("Retraining Complete!")
    print("=" * 60)
    print("\nChanges applied:")
    print("  ✓ Confidence capped at 95% (no more 100% predictions)")
    print("  ✓ Probabilities normalized for realistic predictions")
    print("  ✓ General Physician always suggested as secondary option")
    print("\nYou can now restart the Flask app to use the updated model.")

if __name__ == "__main__":
    main()
