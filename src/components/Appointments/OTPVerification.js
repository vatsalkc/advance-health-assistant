import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

function OTPVerification({ show, onHide, phoneNumber, onVerify }) {
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (show) {
      // Generate and "send" OTP
      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(newOTP);
      console.log('OTP sent to', phoneNumber, ':', newOTP); // In production, this would be sent via SMS
      alert(`OTP sent to ${phoneNumber}: ${newOTP}\n(In production, this would be sent via SMS)`);
      
      // Start timer
      setTimer(60);
      setCanResend(false);
    }
  }, [show, phoneNumber]);

  useEffect(() => {
    if (timer > 0 && show) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, show]);

  const handleVerify = () => {
    if (otp === generatedOTP) {
      onVerify(true);
      setOtp('');
      setError('');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResend = () => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(newOTP);
    console.log('OTP resent to', phoneNumber, ':', newOTP);
    alert(`OTP resent to ${phoneNumber}: ${newOTP}\n(In production, this would be sent via SMS)`);
    setTimer(60);
    setCanResend(false);
    setError('');
    setOtp('');
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-shield-check me-2"></i>
          Verify Mobile Number
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          An OTP has been sent to <strong>{phoneNumber}</strong>
        </Alert>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Enter OTP</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            autoFocus
          />
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-muted">
            {timer > 0 ? (
              <>Time remaining: {timer}s</>
            ) : (
              <>OTP expired</>
            )}
          </small>
          {canResend && (
            <Button variant="link" size="sm" onClick={handleResend}>
              Resend OTP
            </Button>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleVerify}
          disabled={otp.length !== 6}
        >
          <i className="bi bi-check-lg me-2"></i>
          Verify & Book
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OTPVerification;
