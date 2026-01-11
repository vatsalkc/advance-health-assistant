import React, { useState } from 'react';
import { Card, Form, Button, Badge, Alert } from 'react-bootstrap';
import { symptomCheckAPI } from '../../utils/api';

function SymptomChecker({ onResult, user }) {
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addSymptom = () => {
    if (symptomInput.trim() && !symptoms.includes(symptomInput.trim())) {
      setSymptoms([...symptoms, symptomInput.trim()]);
      setSymptomInput('');
    }
  };

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (symptoms.length === 0) {
      setError('Please add at least one symptom');
      return;
    }

    setLoading(true);

    try {
      const response = await symptomCheckAPI.check(symptoms);
      
      onResult(response.data.disease, response.data.specialization);
      setLoading(false);
      setSymptoms([]);
    } catch (err) {
      setError('Failed to analyze symptoms. Please try again.');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <h4>Symptom Checker</h4>
          <p className="text-muted">Enter your symptoms to get disease predictions</p>
        </Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Add Symptoms</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="e.g., fever, headache, cough"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
              />
              <Button variant="secondary" onClick={addSymptom} type="button">
                Add
              </Button>
            </div>
          </Form.Group>

          <div className="mb-3">
            <strong>Selected Symptoms:</strong>
            <div className="mt-2">
              {symptoms.length === 0 ? (
                <p className="text-muted">No symptoms added yet</p>
              ) : (
                symptoms.map((symptom, index) => (
                  <Badge 
                    key={index} 
                    bg="primary" 
                    className="me-2 mb-2 p-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => removeSymptom(symptom)}
                  >
                    {symptom} ×
                  </Badge>
                ))
              )}
            </div>
          </div>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || symptoms.length === 0}
            className="w-100"
          >
            {loading ? 'Analyzing...' : 'Check Symptoms'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default SymptomChecker;
