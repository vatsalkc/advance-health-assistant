import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import adminAPI from '../../utils/adminApi';

function DoctorApproval() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingDoctors();
      setPendingDoctors(response.data.doctors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending doctors:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (doctorId) => {
    if (!window.confirm('Are you sure you want to approve this doctor?')) {
      return;
    }

    try {
      await adminAPI.approveDoctor(doctorId);
      setSuccessMessage('Doctor approved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchPendingDoctors();
    } catch (error) {
      console.error('Error approving doctor:', error);
      alert('Failed to approve doctor');
    }
  };

  const handleRejectClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await adminAPI.rejectDoctor(selectedDoctor.id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedDoctor(null);
      setSuccessMessage('Doctor rejected successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchPendingDoctors();
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      alert('Failed to reject doctor');
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading pending doctors...</p>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>
            <i className="bi bi-person-check me-2"></i>
            Pending Doctor Approvals
          </h4>
          <Badge bg="warning">{pendingDoctors.length} Pending</Badge>
        </Card.Header>
        <Card.Body>
          {successMessage && (
            <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          )}

          {pendingDoctors.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-check-circle"></i>
              <p>No pending doctor approvals</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Specialization</th>
                    <th>Qualification</th>
                    <th>License Number</th>
                    <th>Experience</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingDoctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td>
                        <strong>{doctor.name}</strong>
                      </td>
                      <td>{doctor.email}</td>
                      <td>
                        <Badge bg="info">{doctor.specialization}</Badge>
                      </td>
                      <td>{doctor.qualification || 'N/A'}</td>
                      <td>{doctor.license_number || 'N/A'}</td>
                      <td>{doctor.experience || 'N/A'}</td>
                      <td>{doctor.phone || 'N/A'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleApprove(doctor.id)}
                          >
                            <i className="bi bi-check-lg me-1"></i>
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRejectClick(doctor)}
                          >
                            <i className="bi bi-x-lg me-1"></i>
                            Reject
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

      {/* Rejection Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-x-circle me-2 text-danger"></i>
            Reject Doctor Application
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && (
            <>
              <p>
                You are about to reject the application of{' '}
                <strong>{selectedDoctor.name}</strong>
              </p>
              <Form.Group className="mb-3">
                <Form.Label>Rejection Reason *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  required
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRejectSubmit}>
            <i className="bi bi-x-lg me-2"></i>
            Confirm Rejection
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DoctorApproval;
