import React, { useState, useRef } from 'react';
import { Card, Form, Button, Badge, Alert, ListGroup, Modal } from 'react-bootstrap';
import { predictDisease, allSymptoms, getFollowUpSymptoms } from '../../data/diseaseDatabase';
import { supabase } from '../../config/supabase';

function SymptomChecker({ onResult, user }) {
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [followUpSuggestions, setFollowUpSuggestions] = useState([]);
  const [showSeverityModal, setShowSeverityModal] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const addSymptom = (symptom = null, severity = null) => {
    const symptomToAdd = symptom || symptomInput.trim();
    if (symptomToAdd) {
      // Create symptom with severity if provided
      const symptomWithSeverity = severity ? `${symptomToAdd} (${severity})` : symptomToAdd;
      
      // Check if base symptom already exists
      const baseSymptomExists = symptoms.some(s => 
        s.toLowerCase().startsWith(symptomToAdd.toLowerCase())
      );
      
      if (!baseSymptomExists) {
        const newSymptoms = [...symptoms, symptomWithSeverity];
        setSymptoms(newSymptoms);
        setSymptomInput('');
        setShowSuggestions(false);
        setError('');
        setSuccessMessage(`"${symptomWithSeverity}" added to symptoms list`);
        setTimeout(() => setSuccessMessage(''), 2000);
        
        // Get follow-up suggestions for the added symptom
        const followUps = getFollowUpSymptoms(symptomToAdd);
        if (followUps && followUps.length > 0) {
          const newFollowUps = followUps.filter(s => !newSymptoms.some(existing => 
            existing.toLowerCase().startsWith(s.toLowerCase())
          ));
          setFollowUpSuggestions(newFollowUps);
        } else {
          setFollowUpSuggestions([]);
        }
      } else {
        setError('This symptom is already in your list');
        setTimeout(() => setError(''), 2000);
      }
    }
  };

  const removeSymptom = (symptom) => {
    const newSymptoms = symptoms.filter(s => s !== symptom);
    setSymptoms(newSymptoms);
    
    // Update follow-up suggestions
    if (newSymptoms.length > 0) {
      const lastSymptom = newSymptoms[newSymptoms.length - 1].split(' (')[0]; // Remove severity
      const followUps = getFollowUpSymptoms(lastSymptom);
      if (followUps && followUps.length > 0) {
        const newFollowUps = followUps.filter(s => !newSymptoms.some(existing => 
          existing.toLowerCase().startsWith(s.toLowerCase())
        ));
        setFollowUpSuggestions(newFollowUps);
      }
    } else {
      setFollowUpSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSymptomInput(value);
    
    if (value.trim().length > 0) {
      const filtered = allSymptoms
        .filter(symptom => 
          symptom.toLowerCase().includes(value.toLowerCase()) &&
          !symptoms.some(s => s.toLowerCase().startsWith(symptom.toLowerCase()))
        )
        .slice(0, 10);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Check if this symptom has follow-up options
    const followUps = getFollowUpSymptoms(suggestion);
    
    if (followUps && followUps.length > 0) {
      // Show both the base symptom AND follow-up options
      setFollowUpSuggestions([suggestion, ...followUps]);
      setSuccessMessage(`Select "${suggestion}" or choose a specific type`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowSuggestions(false);
    } else {
      // No follow-ups, ask for severity directly
      setSelectedSymptom(suggestion);
      setShowSeverityModal(true);
      setShowSuggestions(false);
    }
  };

  const handleQuickAddClick = (commonSymptom) => {
    // Check if this symptom has follow-up options
    const followUps = getFollowUpSymptoms(commonSymptom);
    
    if (followUps && followUps.length > 0) {
      // Show both the base symptom AND follow-up options
      setFollowUpSuggestions([commonSymptom, ...followUps]);
      setSuccessMessage(`Select "${commonSymptom}" or choose a specific type`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      // No follow-ups, ask for severity
      setSelectedSymptom(commonSymptom);
      setShowSeverityModal(true);
    }
  };

  const handleSeveritySelect = (severity) => {
    addSymptom(selectedSymptom, severity);
    setShowSeverityModal(false);
    setSelectedSymptom('');
    if (inputRef.current) {
      inputRef.current.focus();
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
      if (symptomInput.trim()) {
        setSelectedSymptom(symptomInput.trim());
        setShowSeverityModal(true);
      }
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
      
      // Remove severity indicators for prediction
      const cleanSymptoms = symptoms.map(s => s.split(' (')[0].toLowerCase().trim());
      
      // Predict disease using local algorithm
      const prediction = predictDisease(cleanSymptoms);
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
            symptoms: cleanSymptoms,
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
    <Card className="symptom-checker-card">
      <Card.Body>
        <Card.Title>
          <h4><i className="bi bi-activity me-2"></i>Symptom Checker</h4>
          <p className="text-muted">Enter your symptoms to get AI-powered disease predictions</p>
        </Card.Title>

        {error && <Alert variant="danger"><i className="bi bi-exclamation-triangle me-2"></i>{error}</Alert>}
        {successMessage && <Alert variant="success"><i className="bi bi-check-circle me-2"></i>{successMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label><strong>Add Symptoms</strong></Form.Label>
            <div className="symptom-input-wrapper">
              <div className="symptom-input-group">
                <Form.Control
                  ref={inputRef}
                  type="text"
                  placeholder="Start typing a symptom (e.g., fever, headache)"
                  value={symptomInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => symptomInput.length > 0 && setShowSuggestions(true)}
                  onBlur={handleInputBlur}
                />
                <Button 
                  variant="primary" 
                  onClick={() => {
                    if (symptomInput.trim()) {
                      setSelectedSymptom(symptomInput.trim());
                      setShowSeverityModal(true);
                    }
                  }} 
                  type="button"
                >
                  <i className="bi bi-plus-lg me-1"></i>Add
                </Button>
              </div>
              
              {/* Symptom Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="symptom-suggestions-dropdown"
                >
                  <ListGroup variant="flush">
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
                        className="symptom-suggestion-item"
                        tabIndex={0}
                      >
                        <i className="bi bi-plus-circle text-primary"></i>
                        <span>{suggestion}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
            </div>
          </Form.Group>

          {/* Follow-up Suggestions - Show ABOVE selected symptoms */}
          {followUpSuggestions.length > 0 && (
            <div className="symptom-followup-box">
              <h6>
                <i className="bi bi-lightbulb-fill"></i>
                {followUpSuggestions.length === 1 ? 'Add This Symptom' : 'Choose Symptom Type'}
              </h6>
              <p className="text-muted small mb-3">
                {followUpSuggestions.length === 1 
                  ? 'Click to add this symptom to your list'
                  : 'Select the general symptom or choose a more specific type:'}
              </p>
              <div className="d-flex flex-wrap gap-2">
                {followUpSuggestions.map((suggestion, index) => (
                  <span
                    key={suggestion}
                    className={`symptom-followup-badge ${index === 0 && followUpSuggestions.length > 1 ? 'base-symptom' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSymptom(suggestion);
                      setShowSeverityModal(true);
                    }}
                    title={index === 0 && followUpSuggestions.length > 1 ? 'General symptom' : 'Click to add'}
                  >
                    <i className="bi bi-plus-circle"></i>
                    {suggestion}
                    {index === 0 && followUpSuggestions.length > 1 && (
                      <Badge bg="light" text="dark" className="ms-2" style={{ fontSize: '10px', padding: '2px 6px' }}>General</Badge>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-3">
            <div className="symptom-selected-header">
              <strong>Selected Symptoms ({symptoms.length})</strong>
              {symptoms.length > 0 && (
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>Click to remove
                </small>
              )}
            </div>
            <div className="symptom-selected-box">
              {symptoms.length === 0 ? (
                <div className="symptom-empty-state">
                  <i className="bi bi-clipboard2-pulse"></i>
                  <p>No symptoms selected. Add symptoms above or use quick add below.</p>
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {symptoms.map((symptom, index) => (
                    <span 
                      key={index} 
                      className="symptom-badge symptom-badge-selected"
                      onClick={() => removeSymptom(symptom)}
                      title="Click to remove"
                    >
                      {symptom}
                      <i className="bi bi-x-lg"></i>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || symptoms.length === 0}
            className="symptom-check-btn"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Analyzing...
              </>
            ) : (
              <>
                <i className="bi bi-search me-2"></i>
                Analyze Symptoms
              </>
            )}
          </Button>
        </Form>

        {/* Common Symptoms Quick Add */}
        <div className="symptom-quick-section">
          <h6><i className="bi bi-lightning-fill me-2"></i>Quick Add</h6>
          <p>Click to quickly add common symptoms</p>
          <div className="d-flex flex-wrap gap-2">
            {['fever', 'headache', 'cough', 'fatigue', 'nausea', 'dizziness', 'chest pain', 'shortness of breath', 'sore throat', 'stomach pain'].map((commonSymptom) => {
              const hasFollowUps = getFollowUpSymptoms(commonSymptom).length > 0;
              const isSelected = symptoms.some(s => s.toLowerCase().startsWith(commonSymptom.toLowerCase()));
              return (
                <span
                  key={commonSymptom}
                  className={`symptom-badge symptom-badge-quick ${isSelected ? 'disabled' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isSelected) {
                      handleQuickAddClick(commonSymptom);
                    }
                  }}
                  style={{ cursor: isSelected ? 'not-allowed' : 'pointer' }}
                  title={isSelected ? 'Already added' : (hasFollowUps ? 'Click to see options' : 'Click to add')}
                >
                  <i className={`bi ${isSelected ? 'bi-check-lg' : (hasFollowUps ? 'bi-chevron-down' : 'bi-plus-lg')}`}></i>
                  {commonSymptom}
                </span>
              );
            })}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default SymptomChecker;
