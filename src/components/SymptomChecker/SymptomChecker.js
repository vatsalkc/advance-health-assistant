import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, Badge, Alert, ListGroup } from 'react-bootstrap';
import { symptomCheckAPI } from '../../utils/api';
import axios from 'axios';

function SymptomChecker({ onResult, user }) {
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    // Fetch all available symptoms for auto-suggestions
    fetchAllSymptoms();
  }, []);

  useEffect(() => {
    // Filter suggestions based on input
    if (symptomInput.trim().length > 1) {
      const filtered = allSymptoms
        .filter(symptom => 
          symptom.toLowerCase().includes(symptomInput.toLowerCase()) &&
          !symptoms.includes(symptom)
        )
        .slice(0, 8); // Limit to 8 suggestions
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [symptomInput, symptoms, allSymptoms]);

  const fetchAllSymptoms = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/symptoms/all`);
      setAllSymptoms(response.data.symptoms);
    } catch (err) {
      console.error('Error fetching symptoms:', err);
    }
  };

  const addSymptom = (symptom = null) => {
    const symptomToAdd = symptom || symptomInput.trim();
    if (symptomToAdd && !symptoms.includes(symptomToAdd)) {
      setSymptoms([...symptoms, symptomToAdd]);
      setSymptomInput('');
      setShowSuggestions(false);
      setError(''); // Clear any previous errors
      setSuccessMessage(`"${symptomToAdd}" added to symptoms list`);
      setTimeout(() => setSuccessMessage(''), 2000); // Clear success message after 2 seconds
    }
  };

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleInputChange = (e) => {
    setSymptomInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    // Prevent any form submission
    addSymptom(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus(); // Keep focus on input
    }
  };

  const handleCommonSymptomClick = (commonSymptom) => {
    // Prevent any form submission and only add symptom
    if (!symptoms.includes(commonSymptom)) {
      addSymptom(commonSymptom);
    }
  };

  const handleInputBlur = (e) => {
    // Only hide suggestions if not clicking on a suggestion
    if (suggestionsRef.current && suggestionsRef.current.contains(e.relatedTarget)) {
      return;
    }
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Only add symptom, don't submit form
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
      const response = await symptomCheckAPI.check(symptoms);
      
      // Pass the full response data to the result handler
      onResult(response.data.disease, response.data.specialization, response.data);
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
                        onMouseDown={(e) => e.preventDefault()} // Prevent input blur
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
