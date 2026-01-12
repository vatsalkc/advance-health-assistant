import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Alert, ListGroup } from 'react-bootstrap';
import { doctorsAPI } from '../../utils/api';

function DoctorRecommendation({ predictionResult, onBookAppointment }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (predictionResult?.specialization) {
      fetchDoctors();
    }
  }, [predictionResult]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await doctorsAPI.getAll(predictionResult.specialization);
      setDoctors(response.data.doctors);
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
      <Alert variant="info" className="mb-4">
        <h4 className="mb-3">
          <i className="bi bi-clipboard2-pulse-fill me-2"></i>
          Diagnosis Result
        </h4>
        
        <Row>
          <Col md={6}>
            <div className="mb-3">
              <strong>Predicted Disease:</strong>
              <h5 className="text-primary mt-1">{predictionResult.disease}</h5>
            </div>
            
            <div className="mb-3">
              <strong>Confidence Level:</strong>
              <div className="d-flex align-items-center mt-1">
                <div className="progress flex-grow-1 me-2" style={{ height: '25px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar" 
                    style={{ width: `${predictionResult.confidence}%` }}
                  >
                    {predictionResult.confidence.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <strong>Recommended Specialist:</strong>
              <div className="mt-1">
                <Badge bg="primary" className="p-2">
                  <i className="bi bi-person-badge me-1"></i>
                  {predictionResult.specialization}
                </Badge>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="mb-3">
              <strong>Description:</strong>
              <p className="mt-1 mb-0">{predictionResult.description}</p>
            </div>
          </Col>
        </Row>

        {/* Precautions */}
        {predictionResult.precautions && predictionResult.precautions.length > 0 && (
          <div className="mt-3">
            <strong>Recommended Precautions:</strong>
            <ListGroup variant="flush" className="mt-2">
              {predictionResult.precautions.map((precaution, index) => (
                <ListGroup.Item key={index} className="py-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  {precaution.trim()}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {/* Alternative Predictions */}
        {predictionResult.top_predictions && predictionResult.top_predictions.length > 1 && (
          <div className="mt-3">
            <strong>Other Possible Conditions:</strong>
            <div className="mt-2">
              {predictionResult.top_predictions.slice(1, 3).map((pred, index) => (
                <Badge key={index} bg="secondary" className="me-2 p-2">
                  {pred.disease} ({pred.confidence.toFixed(1)}%)
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Symptoms */}
        {predictionResult.suggested_symptoms && predictionResult.suggested_symptoms.length > 0 && (
          <div className="mt-3">
            <strong>Related Symptoms to Watch:</strong>
            <div className="mt-2">
              {predictionResult.suggested_symptoms.map((symptom, index) => (
                <Badge key={index} bg="warning" text="dark" className="me-2 mb-2 p-2">
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Alert variant="warning" className="mt-3 mb-0">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Disclaimer:</strong> This is an AI-based prediction and should not replace professional medical advice. Please consult with a qualified healthcare provider for accurate diagnosis and treatment.
        </Alert>
      </Alert>

      {/* Recommended Doctors */}
      <Card>
        <Card.Body>
          <Card.Title>
            <h4>
              <i className="bi bi-people-fill me-2"></i>
              Recommended {predictionResult.specialization}s
            </h4>
            <p className="text-muted">Select a doctor to book an appointment</p>
          </Card.Title>

          {loading ? (
            <p>Loading doctors...</p>
          ) : doctors.length === 0 ? (
            <Alert variant="info">
              No doctors found for this specialization. Please check the appointments section for all available doctors.
            </Alert>
          ) : (
            <Row>
              {doctors.map((doctor) => (
                <Col md={4} key={doctor.id} className="mb-3">
                  <Card className="doctor-card h-100">
                    <Card.Body>
                      <h5>{doctor.name}</h5>
                      <Badge bg="primary" className="mb-2">{doctor.specialization}</Badge>
                      <p className="mb-1"><strong>Experience:</strong> {doctor.experience}</p>
                      <p className="mb-3">
                        <strong>Rating:</strong> 
                        <span className="text-warning ms-1">
                          <i className="bi bi-star-fill"></i> {doctor.rating}/5
                        </span>
                      </p>
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="w-100"
                        onClick={() => onBookAppointment(doctor)}
                      >
                        <i className="bi bi-calendar-plus me-1"></i>
                        Book Appointment
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default DoctorRecommendation;
