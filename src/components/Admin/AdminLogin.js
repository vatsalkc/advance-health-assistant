import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import adminAuthService from '../../services/adminAuthService';

function AdminLogin({ onLogin, onSwitchToPatient, darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const admin = await adminAuthService.login(email, password);
      onLogin(admin);
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <h3>
              <i className="bi bi-shield-lock-fill me-2" style={{ color: 'var(--primary-color)' }}></i>
              Admin Login
            </h3>
          </Card.Title>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login as Admin
                </>
              )}
            </Button>
          </Form>

          <div className="text-center">
            {onSwitchToPatient && (
              <p>
                <Button variant="link" onClick={onSwitchToPatient} className="p-0">
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to Patient Login
                </Button>
              </p>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminLogin;
