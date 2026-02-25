import React, { useState, useRef } from 'react';
import { Card, Form, Button, Badge, Alert, ListGroup } from 'react-bootstrap';
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
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const addSymptom = (symptom = null) => {
    const symptomToAdd = symptom || symptomInput.trim();
    if (symptomToAdd && !symptoms.includes(symptomToAdd)) {
      const newSymptoms = [...symptoms, symptomToAdd];
      setSymptoms(newSymptoms);
      setSymptomInput('');
      setShowSuggestions(false);
      setError('');
      setSuccessMessage(`"${symptomToAdd}" added to symptoms list`);
      setTimeout(() => setSuccessMessage(''), 2000);
      
      // Get follow-up suggestions for the added symptom
      const followUps = getFollowUpSymptoms(symptomToAdd);
      if (followUps && followUps.length > 0) {
        // Filter out already selected symptoms
        const newFollowUps = followUps.filter(s => !newSymptoms.includes(s));
        setFollowUpSuggestions(newFollowUps);
      } else {
        // Clear follow-up suggestions if no follow-ups for this symptom
        setFollowUpSuggestions([]);
      }
    }
  };

  const removeSymptom = (symptom) => {
    const newSymptoms = symptoms.filter(s => s !== symptom);
    setSymptoms(newSymptoms);
    
    // Update follow-up suggestions
    if (newSymptoms.length > 0) {
      const lastSymptom = newSymptoms[newSymptoms.length - 1];
      const followUps = getFollowUpSymptoms(lastSymptom);
      if (followUps && followUps.length > 0) {
        const newFollowUps = followUps.filter(s => !newSymptoms.includes(s));
        setFollowUpSuggestions(newFollowUps);
      }
    } else {
      setFollowUpSuggestions([]);
    }
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
    // Check if this symptom has follow-up options
    const followUps = getFollowUpSymptoms(commonSymptom);
    
    if (followUps && followUps.length > 0) {
      // Don't add the generic symptom, show follow-up options instead
      setFollowUpSuggestions(followUps);
      setSuccessMessage(`Please select a specific type of ${commonSymptom}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      // No follow-ups, add directly
      if (!symptoms.includes(commonSymptom)) {
        addSymptom(commonSymptom);
      }
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
                  placeholder="Type a symptom (e.g., fever, headache, cough)"
                  value={symptomInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => symptomInput.length > 1 && setShowSuggestions(true)}
                  onBlur={handleInputBlur}
                />
                <Button variant="primary" onClick={() => addSymptom()} type="button">
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
                Related Symptoms - Do you also have any of these?
              </h6>
              <p className="text-muted small mb-3">Based on your selected symptoms, you might also experience:</p>
              <div className="d-flex flex-wrap gap-2">
                {followUpSuggestions.slice(0, 8).map((suggestion) => (
                  <span
                    key={suggestion}
                    className="symptom-followup-badge"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addSymptom(suggestion);
                    }}
                    title="Click to add"
                  >
                    <i className="bi bi-plus-circle"></i>
                    {suggestion}
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
              const isSelected = symptoms.includes(commonSymptom);
              return (
                <span
                  key={commonSymptom}
                  className={`symptom-badge symptom-badge-quick ${isSelected ? 'disabled' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isSelected) {
                      handleCommonSymptomClick(commonSymptom);
                    }
                  }}
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
