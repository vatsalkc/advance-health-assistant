import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { doctorProfileAPI } from '../../utils/doctorApi';

function DoctorProfile({ doctor, onUpdateDoctor, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: doctor.name || '',
    phone: doctor.phone || '',
    qualification: doctor.qualification || '',
    license_number: doctor.license_number || '',
    bio: doctor.bio || '',
    consultation_fee: doctor.consultation_fee || '',
    available_days: doctor.available_days || [],
    available_time_start: doctor.available_time_start || '',
    available_time_end: doctor.available_time_end || ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDayToggle = (day) => {
    const days = formData.available_days || [];
    if (days.includes(day)) {
      setFormData({
        ...formData,
        available_days: days.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        available_days: [...days, day]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await doctorProfileAPI.update(formData);
      onUpdateDoctor(response.data.doctor);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: doctor.name || '',
      phone: doctor.phone || '',
      qualification: doctor.qualification || '',
      license_number: doctor.license_number || '',
      bio: doctor.bio || '',
      consultation_fee: doctor.consultation_fee || '',
      available_days: doctor.available_days || [],
      available_time_start: doctor.available_time_start || '',
      available_time_end: doctor.available_time_end || ''
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Doctor Profile</h4>
          {!isEditing && (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <i className="bi bi-pencil me-2"></i>
              Edit Profile
            </Button>
          )}
        </Card.Header>
        <Card.Body>
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
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={doctor.email}
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
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specialization</Form.Label>
                  <Form.Control
                    type="text"
                    value={doctor.specialization}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Contact admin to change specialization
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Qualification</Form.Label>
                  <Form.Control
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="MBBS, MD"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>License Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell patients about yourself..."
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Consultation Fee ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleChange}
                    disabled={!isEditing}
                    step="0.01"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Experience</Form.Label>
                  <Form.Control
                    type="text"
                    value={doctor.experience || 'N/A'}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Available Days</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <Button
                    key={day}
                    variant={formData.available_days?.includes(day) ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleDayToggle(day)}
                    disabled={!isEditing}
                    type="button"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Available Time Start</Form.Label>
                  <Form.Control
                    type="time"
                    name="available_time_start"
                    value={formData.available_time_start}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Available Time End</Form.Label>
                  <Form.Control
                    type="time"
                    name="available_time_end"
                    value={formData.available_time_end}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
            </Row>

            {isEditing && (
              <div className="d-flex gap-2">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5>Account Actions</h5>
        </Card.Header>
        <Card.Body>
          <Button variant="danger" onClick={onLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default DoctorProfile;
