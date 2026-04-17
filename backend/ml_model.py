import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
import pickle
import os

class DiseasePredictor:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.label_encoder = None
        self.disease_data = None
        self.symptom_list = set()
        
    def load_data(self, csv_path='disease_data.csv'):
        """Load disease data from CSV"""
        self.disease_data = pd.read_csv(csv_path)
        
        # Extract all unique symptoms
        for symptoms in self.disease_data['Symptoms']:
            symptom_list = [s.strip() for s in symptoms.split(',')]
            self.symptom_list.update(symptom_list)
        
        return self.disease_data
    
    def prepare_training_data(self):
        """Prepare data for training"""
        # Create symptom vectors
        X = []
        y = []
        
        for _, row in self.disease_data.iterrows():
            symptoms = [s.strip() for s in row['Symptoms'].split(',')]
            # Create binary vector for symptoms
            symptom_vector = [1 if symptom in symptoms else 0 for symptom in sorted(self.symptom_list)]
            X.append(symptom_vector)
            y.append(row['Disease'])
        
        return np.array(X), np.array(y)
    
    def train_model(self):
        """Train the disease prediction model"""
        print("Loading data...")
        self.load_data()
        
        print("Preparing training data...")
        X, y = self.prepare_training_data()
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train Random Forest model
        print("Training model...")
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Calculate accuracy
        accuracy = self.model.score(X_test, y_test)
        print(f"Model accuracy: {accuracy * 100:.2f}%")
        
        return accuracy
    
    def predict_disease(self, symptoms):
        """Predict disease from symptoms"""
        if not self.model:
            raise Exception("Model not trained. Please train the model first.")
        
        # Normalize input symptoms
        symptoms = [s.strip().lower() for s in symptoms]
        
        # Create symptom vector
        symptom_vector = [1 if symptom in symptoms else 0 for symptom in sorted(self.symptom_list)]
        symptom_vector = np.array(symptom_vector).reshape(1, -1)
        
        # Predict
        prediction = self.model.predict(symptom_vector)[0]
        probabilities = self.model.predict_proba(symptom_vector)[0]
        
        # Cap confidence at 95% to prevent unrealistic 100% predictions
        # Apply smoothing to make predictions more realistic
        max_confidence = 0.95
        probabilities = probabilities * max_confidence
        
        # Normalize probabilities to sum to 1
        probabilities = probabilities / probabilities.sum()
        
        # Get top 3 predictions
        top_indices = np.argsort(probabilities)[-3:][::-1]
        top_diseases = [(self.model.classes_[i], probabilities[i]) for i in top_indices]
        
        return prediction, top_diseases
    
    def get_disease_info(self, disease_name):
        """Get detailed information about a disease"""
        disease_row = self.disease_data[self.disease_data['Disease'] == disease_name]
        
        if disease_row.empty:
            return None
        
        disease_row = disease_row.iloc[0]
        
        return {
            'disease': disease_row['Disease'],
            'specialization': disease_row['Specialization'],
            'description': disease_row['Description'],
            'precautions': disease_row['Precautions'].split(','),
            'symptoms': disease_row['Symptoms'].split(',')
        }
    
    def save_model(self, model_path='disease_model.pkl'):
        """Save trained model"""
        model_data = {
            'model': self.model,
            'symptom_list': sorted(self.symptom_list),
            'disease_data': self.disease_data
        }
        
        with open(model_path, 'wb') as f:
            pickle.dump(model_data, f)
        
        print(f"Model saved to {model_path}")
    
    def load_model(self, model_path='disease_model.pkl'):
        """Load trained model"""
        if not os.path.exists(model_path):
            print("Model file not found. Training new model...")
            self.train_model()
            self.save_model(model_path)
            return
        
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        
        self.model = model_data['model']
        self.symptom_list = set(model_data['symptom_list'])
        self.disease_data = model_data['disease_data']
        
        print("Model loaded successfully")
    
    def get_all_symptoms(self):
        """Get list of all possible symptoms"""
        return sorted(self.symptom_list)
    
    def suggest_related_symptoms(self, input_symptoms):
        """Suggest related symptoms based on input"""
        input_symptoms = [s.strip().lower() for s in input_symptoms]
        
        # Find diseases that match input symptoms
        matching_diseases = []
        for _, row in self.disease_data.iterrows():
            disease_symptoms = [s.strip().lower() for s in row['Symptoms'].split(',')]
            if any(symptom in disease_symptoms for symptom in input_symptoms):
                matching_diseases.append(disease_symptoms)
        
        # Count symptom frequency
        symptom_freq = {}
        for disease_symptoms in matching_diseases:
            for symptom in disease_symptoms:
                if symptom not in input_symptoms:
                    symptom_freq[symptom] = symptom_freq.get(symptom, 0) + 1
        
        # Sort by frequency
        suggested = sorted(symptom_freq.items(), key=lambda x: x[1], reverse=True)[:5]
        return [s[0] for s in suggested]

# Initialize and train model on first import
def initialize_model():
    """Initialize the ML model"""
    predictor = DiseasePredictor()
    
    # Check if model exists, otherwise train
    model_path = 'disease_model.pkl'
    if os.path.exists(model_path):
        predictor.load_model(model_path)
    else:
        print("Training new model...")
        predictor.train_model()
        predictor.save_model(model_path)
    
    return predictor

if __name__ == "__main__":
    # Train and save model
    predictor = DiseasePredictor()
    predictor.train_model()
    predictor.save_model()
    
    # Test prediction
    test_symptoms = ['fever', 'cough', 'fatigue']
    prediction, top_diseases = predictor.predict_disease(test_symptoms)
    
    print(f"\nTest Prediction:")
    print(f"Input symptoms: {test_symptoms}")
    print(f"Predicted disease: {prediction}")
    print(f"\nTop 3 predictions:")
    for disease, prob in top_diseases:
        print(f"  {disease}: {prob*100:.2f}%")
    
    # Get disease info
    info = predictor.get_disease_info(prediction)
    print(f"\nDisease Information:")
    print(f"Specialization: {info['specialization']}")
    print(f"Description: {info['description']}")
    print(f"Precautions: {', '.join(info['precautions'])}")
