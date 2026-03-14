import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import adminAPI from '../../utils/adminApi';

function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [newRating, setNewRating] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllDoctors();
      setDoctors(response.data.doctors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };

  const handleToggleStatus = async (doctorId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this doctor?`)) {
      return;
    }

    try {
      await adminAPI.updateDoctorStatus(doctorId, !currentStatus);
      setSuccessMessage(`Doctor ${action}d successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchDoctors();
    } catch (error) {
      console.error('Error updating doctor status:', error);
      alert('Failed to update doctor status');
    }
  };

  const handleRatingClick = (doctor) => {
    setSelectedDoctor(doctor);
    setNewRating(doctor.rating.toString());
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async () => {
    const rating = parseFloat(newRating);
    
    if (isNaN(rating) || rating < 0 || rating > 5) {
      alert('Please enter a valid rating between 0 and 5');
      return;
    }

    try {
      await adminAPI.updateDoctorRating(selectedDoctor.id, rating);
      setShowRatingModal(false);
      setSelectedDoctor(null);
      setNewRating('');
      setSuccessMessage('Doctor rating updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchDoctors();
    } catch (error) {
      console.error('Error updating rating:', error);
      alert('Failed to update rating');
    }
  };

  const handleDelete = async (doctorId, doctorName) => {
    if (!window.confirm(`Are you sure you want to delete ${doctorName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminAPI.deleteDoctor(doctorId);
      setSuccessMessage('Doctor deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor');
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading doctors...</p>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>
            <i className="bi bi-person-gear me-2"></i>
            Doctor Management
          </h4>
          <Badge bg="primary">{doctors.length} Total</Badge>
        </Card.Header>
        <Card.Body>
          {successMessage && (
            <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          )}

          {doctors.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-person-x"></i>
              <p>No doctors found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Specialization</th>
                    <th>Rating</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td>
                        <strong>{doctor.name}</strong>
                      </td>
                      <td>{doctor.email}</td>
                      <td>
                        <Badge bg="info">{doctor.specialization}</Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-warning">
                            <i className="bi bi-star-fill"></i> {doctor.rating}
                          </span>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => handleRatingClick(doctor)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                        </div>
                      </td>
                      <td>{doctor.experience || 'N/A'}</td>
                      <td>
                        <Badge bg={doctor.is_active ? 'success' : 'secondary'}>
                          {doctor.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={doctor.is_verified ? 'success' : 'warning'}>
                          {doctor.is_verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant={doctor.is_active ? 'warning' : 'success'}
                            onClick={() => handleToggleStatus(doctor.id, doctor.is_active)}
                          >
                            <i className={`bi bi-${doctor.is_active ? 'pause' : 'play'}-fill me-1`}></i>
                            {doctor.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(doctor.id, doctor.name)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Rating Modal */}
      <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-star me-2 text-warning"></i>
            Update Doctor Rating
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && (
            <>
              <p>
                Update rating for <strong>{selectedDoctor.name}</strong>
              </p>
              <Form.Group className="mb-3">
                <Form.Label>Rating (0-5) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                  placeholder="Enter rating (e.g., 4.5)"
                  required
                />
                <Form.Text className="text-muted">
                  Current rating: {selectedDoctor.rating}
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRatingModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRatingSubmit}>
            <i className="bi bi-check-lg me-2"></i>
            Update Rating
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DoctorManagement;
