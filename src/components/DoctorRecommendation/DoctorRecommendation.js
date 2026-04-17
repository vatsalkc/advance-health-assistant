import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Alert, ListGroup } from 'react-bootstrap';
import { doctorsAPI } from '../../utils/api';

function DoctorRecommendation({ predictionResult, onBookAppointment }) {
  const [doctors, setDoctors] = useState([]);
  const [generalPhysicians, setGeneralPhysicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (predictionResult?.specialization) {
      fetchDoctors();
    }
  }, [predictionResult]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      // Fetch primary specialist doctors
      const response = await doctorsAPI.getAll(predictionResult.specialization);
      setDoctors(response.data.doctors);
      
      // Fetch General Physicians if primary is not General Physician
      if (predictionResult.specialization.toLowerCase() !== 'general physician') {
        const gpResponse = await doctorsAPI.getAll('General Physician');
        setGeneralPhysicians(gpResponse.data.doctors);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };

  if (!predictionResult) {
    return <Alert variant="warning">No prediction data available</Alert>;
  }

  return (
    <div>
      {/* Prediction Results */}
      <div className="diagnosis-results-card">
        <div className="diagnosis-header">
          <h4>
            <i className="bi bi-clipboard2-pulse-fill"></i>
            Diagnosis Result
          </h4>
        </div>
        
        {/* Disease Name */}
        <div className="disease-name-box">
          <h3>{predictionResult.disease}</h3>
        </div>

        <Row>
          <Col md={6}>
            {/* Confidence Level */}
            <div className="confidence-section">
              <div className="confidence-label">Confidence Level</div>
              <div className="confidence-bar-wrapper">
                <div 
                  className="confidence-bar"
                  style={{ width: `${predictionResult.confidence}%` }}
                >
                  {predictionResult.confidence.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Recommended Specialist */}
            <div className="mb-3">
              <div className="confidence-label mb-2">Recommended Specialist</div>
              <div className="specialist-badge-large">
                <i className="bi bi-person-badge"></i>
                {predictionResult.specialization}
              </div>
            </div>
          </Col>

          <Col md={6}>
            {/* Description */}
            <div className="confidence-label mb-2">About This Condition</div>
            <div className="description-box">
              <p>{predictionResult.description}</p>
            </div>
          </Col>
        </Row>

        {/* Precautions */}
        {predictionResult.precautions && predictionResult.precautions.length > 0 && (
          <div className="precautions-section">
            <div className="precautions-title">
              <i className="bi bi-shield-check"></i>
              Recommended Precautions
            </div>
            {predictionResult.precautions.map((precaution, index) => (
              <div key={index} className="precaution-item">
                <i className="bi bi-check-circle-fill"></i>
                <span>{precaution.trim()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Alternative Predictions */}
        {predictionResult.top_predictions && predictionResult.top_predictions.length > 1 && (
          <div className="alternatives-section">
            <div className="alternatives-title">Other Possible Conditions</div>
            <div>
              {predictionResult.top_predictions.slice(1, 3).map((pred, index) => (
                <span key={index} className="alternative-badge">
                  {pred.disease} ({pred.confidence.toFixed(1)}%)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="diagnosis-disclaimer">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <div className="diagnosis-disclaimer-text">
            <strong>Important:</strong> This is an AI-based prediction and should not replace professional medical advice. Please consult with a qualified healthcare provider for accurate diagnosis and treatment.
          </div>
        </div>
      </div>

      {/* Recommended Doctors */}
      <Card>
        <Card.Body>
          <div className="doctors-section-header">
            <h4>
              <i className="bi bi-people-fill"></i>
              Recommended {predictionResult.specialization}s
            </h4>
            <p>Select a doctor to book an appointment</p>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              No doctors found for this specialization. Please check the appointments section for all available doctors.
            </Alert>
          ) : (
            <Row>
              {doctors.map((doctor) => (
                <Col md={4} key={doctor.id} className="mb-3">
                  <div className="doctor-card-result">
                    <h5>{doctor.name}</h5>
                    <div className="doctor-specialization-badge">
                      {doctor.specialization}
                    </div>
                    <div className="doctor-info-item">
                      <strong>Experience:</strong> {doctor.experience}
                    </div>
                    <div className="doctor-info-item">
                      <strong>Rating:</strong> 
                      <span className="doctor-rating ms-1">
                        <i className="bi bi-star-fill"></i> {doctor.rating}/5
                      </span>
                    </div>
                    <button 
                      className="book-appointment-btn"
                      onClick={() => onBookAppointment(doctor)}
                    >
                      <i className="bi bi-calendar-plus me-1"></i>
                      Book Appointment
                    </button>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* General Physicians - Always show if not primary */}
      {generalPhysicians.length > 0 && (
        <Card className="mt-3">
          <Card.Body>
            <div className="doctors-section-header">
              <h4>
                <i className="bi bi-people-fill"></i>
                General Physicians
              </h4>
              <p>Can provide general consultation and referrals</p>
            </div>

            <Row>
              {generalPhysicians.map((doctor) => (
                <Col md={4} key={doctor.id} className="mb-3">
                  <div className="doctor-card-result">
                    <h5>{doctor.name}</h5>
                    <div className="doctor-specialization-badge">
                      {doctor.specialization}
                    </div>
                    <div className="doctor-info-item">
                      <strong>Experience:</strong> {doctor.experience}
                    </div>
                    <div className="doctor-info-item">
                      <strong>Rating:</strong> 
                      <span className="doctor-rating ms-1">
                        <i className="bi bi-star-fill"></i> {doctor.rating}/5
                      </span>
                    </div>
                    <button 
                      className="book-appointment-btn"
                      onClick={() => onBookAppointment(doctor)}
                    >
                      <i className="bi bi-calendar-plus me-1"></i>
                      Book Appointment
                    </button>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default DoctorRecommendation;
