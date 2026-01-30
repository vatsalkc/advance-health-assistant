import React, { useState, useRef } from 'react';
import { Card, Form, Button, Badge, Alert, ListGroup } from 'react-bootstrap';
import { predictDisease, allSymptoms } from '../../data/diseaseDatabase';
import { supabase } from '../../config/supabase';

function SymptomChecker({ onResult, user }) {
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const addSymptom = (symptom = null) => {
    const symptomToAdd = symptom || symptomInput.trim();
    if (symptomToAdd && !symptoms.includes(symptomToAdd)) {
      setSymptoms([...symptoms, symptomToAdd]);
      setSymptomInput('');
      setShowSuggestions(false);
      setError('');
      setSuccessMessage(`"${symptomToAdd}" added to symptoms list`);
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSymptomInput(value);
    
    if (value.trim().length > 1) {
      const filtered = allSymptoms
        .filter(symptom => 
          symptom.toLowerCase().includes(value.toLowerCase()) &&
          !symptoms.includes(symptom)
        )
        .slice(0, 8);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    addSymptom(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommonSymptomClick = (commonSymptom) => {
    if (!symptoms.includes(commonSymptom)) {
      addSymptom(commonSymptom);
    }
  };

  const handleInputBlur = (e) => {
    if (suggestionsRef.current && suggestionsRef.current.contains(e.relatedTarget)) {
      return;
    }
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSymptom();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (symptoms.length === 0) {
      setError('Please add at least one symptom');
      return;
    }

    setLoading(true);

    try {
      console.log('[SymptomChecker] Checking symptoms:', symptoms);
      
      // Predict disease using local algorithm
      const prediction = predictDisease(symptoms);
      console.log('[SymptomChecker] Prediction result:', prediction);
      
      if (!prediction) {
        throw new Error('Unable to predict disease');
      }

      // Try to save to Supabase (but don't fail if it doesn't work)
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('[SymptomChecker] User logged in, saving to database');
          
          const checkData = {
            user_id: session.user.id,
            symptoms: symptoms,
            predicted_disease: prediction.disease,
            recommended_specialization: prediction.specialization,
            confidence: prediction.confidence,
            description: prediction.description,
            precautions: prediction.precautions,
          };

          console.log('[SymptomChecker] Saving data:', checkData);

          const { data, error: dbError } = await supabase
            .from('symptom_checks')
            .insert([checkData])
            .select()
            .single();

          if (dbError) {
            console.error('[SymptomChecker] Database error (non-fatal):', dbError);
          } else {
            console.log('[SymptomChecker] Saved successfully:', data);
          }
        } else {
          console.log('[SymptomChecker] No session - skipping database save');
        }
      } catch (saveError) {
        console.error('[SymptomChecker] Error saving (non-fatal):', saveError);
      }
      
      // Pass result to parent - this should always work
      console.log('[SymptomChecker] Passing result to parent');
      onResult(prediction.disease, prediction.specialization, prediction);
      
      setLoading(false);
      setSymptoms([]);
      setSuccessMessage('Symptoms analyzed successfully!');
    } catch (err) {
      console.error('[SymptomChecker] Error:', err);
      setError('Failed to analyze symptoms: ' + err.message);
      setLoading(false);
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
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Add Symptoms</Form.Label>
            <div className="position-relative">
              <div className="d-flex gap-2">
                <Form.Control
                  ref={inputRef}
                  type="text"
                  placeholder="e.g., fever, headache, cough"
                  value={symptomInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => symptomInput.length > 1 && setShowSuggestions(true)}
                  onBlur={handleInputBlur}
                />
                <Button variant="secondary" onClick={() => addSymptom()} type="button">
                  Add
                </Button>
              </div>
              
              {/* Symptom Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="position-absolute w-100" 
                  style={{ zIndex: 1000, top: '100%' }}
                >
                  <ListGroup>
                    {filteredSuggestions.map((suggestion, index) => (
                      <ListGroup.Item
                        key={index}
                        action
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSuggestionClick(suggestion);
                        }}
                        className="py-2 px-3"
                        style={{ cursor: 'pointer' }}
                        tabIndex={0}
                      >
                        <i className="bi bi-plus-circle me-2 text-primary"></i>
                        {suggestion}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
            </div>
          </Form.Group>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <strong>Selected Symptoms ({symptoms.length}):</strong>
              {symptoms.length > 0 && (
                <small className="text-muted">
                  Click "Check Symptoms" below to analyze
                </small>
              )}
            </div>
            <div className="mt-2">
              {symptoms.length === 0 ? (
                <p className="text-muted">No symptoms added yet. Add symptoms above or click on suggestions.</p>
              ) : (
                symptoms.map((symptom, index) => (
                  <Badge 
                    key={index} 
                    bg="primary" 
                    className="me-2 mb-2 p-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => removeSymptom(symptom)}
                    title="Click to remove"
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

        {/* Common Symptoms Quick Add */}
        <div className="mt-4">
          <h6>Quick Add Common Symptoms:</h6>
          <p className="text-muted small">Click to add to your symptoms list</p>
          <div className="d-flex flex-wrap gap-2">
            {['fever', 'headache', 'cough', 'fatigue', 'nausea', 'dizziness', 'chest pain', 'shortness of breath', 'sore throat', 'muscle aches'].map((commonSymptom) => (
              <Badge
                key={commonSymptom}
                bg={symptoms.includes(commonSymptom) ? "success" : "outline-secondary"}
                className="p-2"
                style={{ 
                  cursor: symptoms.includes(commonSymptom) ? 'default' : 'pointer',
                  border: symptoms.includes(commonSymptom) ? '1px solid #198754' : '1px solid #6c757d',
                  color: symptoms.includes(commonSymptom) ? '#fff' : '#6c757d',
                  opacity: symptoms.includes(commonSymptom) ? 0.7 : 1
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCommonSymptomClick(commonSymptom);
                }}
                title={symptoms.includes(commonSymptom) ? 'Already added' : 'Click to add'}
              >
                <i className={`bi ${symptoms.includes(commonSymptom) ? 'bi-check' : 'bi-plus'} me-1`}></i>
                {commonSymptom}
              </Badge>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default SymptomChecker;
