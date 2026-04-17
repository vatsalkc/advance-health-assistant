import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import authService from '../../services/authService';

function Register({ onRegister, onSwitchToLogin, onSwitchToDoctor, onSwitchToAdmin, darkMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    gender: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if coming from landing page with register data
    const registerData = sessionStorage.getItem('registerData');
    if (registerData) {
      const data = JSON.parse(registerData);
      if (data.role === 'patient') {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          password: data.password || '',
          confirmPassword: data.password || '',
          phone: data.phone || '',
          age: data.age || '',
          gender: data.gender || ''
        });
      }
      sessionStorage.removeItem('registerData');
      
      // Auto-submit if we have complete data
      if (data.name && data.email && data.password) {
        setTimeout(() => {
          document.getElementById('registerForm')?.requestSubmit();
        }, 100);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const user = await authService.register(formData);
      onRegister(user);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ width: '450px', maxWidth: '95%' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <h3>Create Account</h3>
            <p className="text-muted small">Join Health Assistant today</p>
          </Card.Title>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit} id="registerForm">
            <Form.Group className="mb-3">
              <Form.Label>Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone (Optional)</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Age (Optional)</Form.Label>
              <Form.Control
                type="number"
                name="age"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                max="120"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender (Optional)</Form.Label>
              <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </Form>

          <div className="text-center">
            <p className="mb-2">
              Already have an account?{' '}
              <Button variant="link" onClick={onSwitchToLogin} className="p-0">
                Login
              </Button>
            </p>
            
            <div className="d-flex gap-2 justify-content-center mt-3">
              {onSwitchToDoctor && (
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={onSwitchToDoctor}
                  className="flex-fill"
                >
                  <i className="bi bi-person-badge me-1"></i>
                  Doctor Portal
                </Button>
              )}
              {onSwitchToAdmin && (
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={onSwitchToAdmin}
                  className="flex-fill"
                >
                  <i className="bi bi-shield-lock me-1"></i>
                  Admin Portal
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Register;
