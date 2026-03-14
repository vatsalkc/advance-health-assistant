import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import authService from '../../services/authService';

function Login({ onLogin, onSwitchToRegister, onSwitchToDoctor, onSwitchToAdmin, darkMode }) {
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
      const user = await authService.login(email, password);
      onLogin(user);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <h3>Login</h3>
          </Card.Title>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
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
                'Login'
              )}
            </Button>
          </Form>

          <div className="text-center">
            <p className="mb-2">
              Don't have an account?{' '}
              <Button variant="link" onClick={onSwitchToRegister} className="p-0">
                Register
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
                  Doctor Login
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
                  Admin Login
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
