import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import doctorAuthService from '../../services/doctorAuthService';

function DoctorRegister({ onRegister, onSwitchToLogin, onSwitchToPatient, darkMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
    qualification: '',
    license_number: '',
    experience: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const specializations = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Orthopedic',
    'Pediatrician',
    'Psychiatrist',
    'ENT Specialist',
    'Ophthalmologist',
    'Gynecologist',
    'Dentist',
    'Pulmonologist',
    'Gastroenterologist',
    'Urologist',
    'Endocrinologist'
  ];

  useEffect(() => {
    // Check if coming from landing page with register data
    const registerData = sessionStorage.getItem('registerData');
    if (registerData) {
      const data = JSON.parse(registerData);
      if (data.role === 'doctor') {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          password: data.password || '',
          confirmPassword: data.password || '',
          phone: data.phone || '',
          specialization: data.specialization || '',
          qualification: data.qualification || '',
          license_number: data.license || '',
          experience: data.experience || ''
        });
        sessionStorage.removeItem('registerData');
        
        // Auto-submit if we have complete data
        if (data.name && data.email && data.password) {
          setTimeout(() => {
            document.getElementById('doctorRegisterForm')?.requestSubmit();
          }, 100);
        }
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Check password strength on password field change
    if (name === 'password') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Strong password validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError('Password must contain at least one special character (!@#$%^&*...)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const doctor = await doctorAuthService.register(formData);
      onRegister(doctor);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-4">
      <Card style={{ maxWidth: '600px', width: '100%' }} className={darkMode ? 'bg-dark text-light' : ''}>
        <Card.Body>
          <div className="text-center mb-4">
            <i className="bi bi-hospital" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
            <h3 className="mt-3">Doctor Registration</h3>
            <p className="text-muted">Join our healthcare platform</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit} id="doctorRegisterForm">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dr. John Doe"
                    required
                    className={darkMode ? 'bg-dark text-light' : ''}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@example.com"
                    required
                    className={darkMode ? 'bg-dark text-light' : ''}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Strong password"
                    required
                    minLength="8"
                    className={darkMode ? 'bg-dark text-light' : ''}
                  />
                  {formData.password && (
                    <div className="mt-2" style={{ fontSize: '0.75rem' }}>
                      <div className={passwordStrength.length ? 'text-success' : 'text-muted'}>
                        <i className={`bi bi-${passwordStrength.length ? 'check-circle-fill' : 'circle'} me-1`}></i>
                        8+ chars
                      </div>
                      <div className={passwordStrength.uppercase ? 'text-success' : 'text-muted'}>
                        <i className={`bi bi-${passwordStrength.uppercase ? 'check-circle-fill' : 'circle'} me-1`}></i>
                        Uppercase
                      </div>
                      <div className={passwordStrength.lowercase ? 'text-success' : 'text-muted'}>
                        <i className={`bi bi-${passwordStrength.lowercase ? 'check-circle-fill' : 'circle'} me-1`}></i>
                        Lowercase
                      </div>
                      <div className={passwordStrength.number ? 'text-success' : 'text-muted'}>
                        <i className={`bi bi-${passwordStrength.number ? 'check-circle-fill' : 'circle'} me-1`}></i>
                        Number
                      </div>
                      <div className={passwordStrength.special ? 'text-success' : 'text-muted'}>
                        <i className={`bi bi-${passwordStrength.special ? 'check-circle-fill' : 'circle'} me-1`}></i>
                        Special char
                      </div>
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                    className={darkMode ? 'bg-dark text-light' : ''}
                  />
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
                    placeholder="+1234567890"
                    className={darkMode ? 'bg-dark text-light' : ''}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specialization *</Form.Label>
                  <Form.Select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    className={darkMode ? 'bg-dark text-light' : ''}
                  >
                    <option value="">Select specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </Form.Select>
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
                    placeholder="MBBS, MD"
                    className={darkMode ? 'bg-dark text-light' : ''}
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
                    placeholder="Medical license #"
                    className={darkMode ? 'bg-dark text-light' : ''}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 10 years"
                className={darkMode ? 'bg-dark text-light' : ''}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </Button>

            <div className="text-center">
              <p className="mb-2">
                Already have an account?{' '}
                <Button variant="link" onClick={onSwitchToLogin} className="p-0">
                  Login
                </Button>
              </p>
              <p>
                <Button variant="link" onClick={onSwitchToPatient} className="p-0">
                  Register as Patient
                </Button>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default DoctorRegister;
