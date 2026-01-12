import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Badge,
  ListGroup
} from 'react-bootstrap';
import { statsAPI } from '../../utils/api';
import authService from '../../services/authService';

function Profile({ user, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [stats, setStats] = useState({
    totalAppointments: 0,
    activeMedicines: 0,
    symptomsChecked: 0
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age || '',
        gender: user.gender || ''
      });
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await statsAPI.get();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update user profile
      const updatedUser = { ...user, ...formData };
      
      // Call parent component to update user
      if (onUpdateUser) {
        await onUpdateUser(updatedUser);
      }
      
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMessage(err.message || 'Failed to update profile');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      age: user?.age || '',
      gender: user?.gender || ''
    });
    setIsEditing(false);
  };

  return (
    <div>
      {showSuccess && (
        <Alert variant="success" dismissible onClose={() => setShowSuccess(false)}>
          Profile updated successfully!
        </Alert>
      )}

      {showError && (
        <Alert variant="danger" dismissible onClose={() => setShowError(false)}>
          {errorMessage}
        </Alert>
      )}

      <Row>
        {/* Profile Information */}
        <Col lg={8} md={12} className="mb-4">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Profile Information</h4>
                {!isEditing && (
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>

              {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled
                        />
                        <Form.Text className="text-muted">
                          Email cannot be changed
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          min="1"
                          max="150"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <div>
                  <Row className="mb-3">
                    <Col md={6}>
                      <div className="mb-3">
                        <strong className="text-muted">Full Name</strong>
                        <p className="mb-0">{user?.name || 'Not provided'}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong className="text-muted">Email</strong>
                        <p className="mb-0">{user?.email || 'Not provided'}</p>
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <div className="mb-3">
                        <strong className="text-muted">Phone Number</strong>
                        <p className="mb-0">{user?.phone || 'Not provided'}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong className="text-muted">Age</strong>
                        <p className="mb-0">{user?.age || 'Not provided'}</p>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong className="text-muted">Gender</strong>
                        <p className="mb-0">{user?.gender || 'Not provided'}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong className="text-muted">Member Since</strong>
                        <p className="mb-0">
                          {user?.created_at 
                            ? new Date(user.created_at).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Health Statistics */}
        <Col lg={4} md={12}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-4">Health Statistics</h5>
              
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <strong>Total Appointments</strong>
                    <p className="text-muted small mb-0">All time</p>
                  </div>
                  <Badge bg="primary" pill style={{ fontSize: '1.2rem' }}>
                    {stats.totalAppointments}
                  </Badge>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <strong>Active Medicines</strong>
                    <p className="text-muted small mb-0">Current reminders</p>
                  </div>
                  <Badge bg="success" pill style={{ fontSize: '1.2rem' }}>
                    {stats.activeMedicines}
                  </Badge>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <strong>Symptoms Checked</strong>
                    <p className="text-muted small mb-0">AI predictions</p>
                  </div>
                  <Badge bg="info" pill style={{ fontSize: '1.2rem' }}>
                    {stats.symptomsChecked}
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5 className="mb-3">Account Actions</h5>
              
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary"
                  onClick={() => window.location.href = '#/dashboard'}
                >
                  View Dashboard
                </Button>
                
                <Button 
                  variant="outline-danger"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      authService.logout();
                      window.location.href = '/';
                    }
                  }}
                >
                  Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
