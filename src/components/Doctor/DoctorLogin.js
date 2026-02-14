import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import doctorAuthService from '../../services/doctorAuthService';

function DoctorLogin({ onLogin, onSwitchToRegister, onSwitchToPatient, darkMode }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const doctor = await doctorAuthService.login(formData.email, formData.password);
      onLogin(doctor);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }} className={darkMode ? 'bg-dark text-light' : ''}>
        <Card.Body>
          <div className="text-center mb-4">
            <i className="bi bi-hospital" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
            <h3 className="mt-3">Doctor Login</h3>
            <p className="text-muted">Access your doctor portal</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
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

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
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
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>

            <div className="text-center">
              <p className="mb-2">
                Don't have an account?{' '}
                <Button variant="link" onClick={onSwitchToRegister} className="p-0">
                  Register as Doctor
                </Button>
              </p>
              <p>
                <Button variant="link" onClick={onSwitchToPatient} className="p-0">
                  Login as Patient
                </Button>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default DoctorLogin;
