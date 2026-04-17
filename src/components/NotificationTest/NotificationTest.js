import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Badge } from 'react-bootstrap';
import notificationService from '../../services/notificationService';

function NotificationTest() {
  const [permission, setPermission] = useState('default');
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    // Check initial permission
    const currentPermission = notificationService.checkPermission();
    setPermission(currentPermission);
  }, []);

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setPermission(granted ? 'granted' : 'denied');
    
    if (granted) {
      addTestResult('Permission granted successfully', 'success');
    } else {
      addTestResult('Permission denied by user', 'danger');
    }
  };

  const sendTestNotification = () => {
    if (permission !== 'granted') {
      addTestResult('Cannot send notification - permission not granted', 'warning');
      return;
    }

    const notification = notificationService.sendNotification(
      '🔔 Test Notification',
      {
        body: 'This is a test notification from Health Assistant',
        icon: '/logo192.png',
        tag: 'test-notification'
      }
    );

    if (notification) {
      addTestResult('Test notification sent successfully', 'success');
    } else {
      addTestResult('Failed to send test notification', 'danger');
    }
  };

  const sendMedicineReminder = () => {
    if (permission !== 'granted') {
      addTestResult('Cannot send medicine reminder - permission not granted', 'warning');
      return;
    }

    const notification = notificationService.sendMedicineReminder(
      'Aspirin',
      '100mg',
      '09:00 AM'
    );

    if (notification) {
      addTestResult('Medicine reminder sent successfully', 'success');
    } else {
      addTestResult('Failed to send medicine reminder', 'danger');
    }
  };

  const addTestResult = (message, type) => {
    const result = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev.slice(0, 4)]); // Keep only last 5 results
  };

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge bg="success">Granted</Badge>;
      case 'denied':
        return <Badge bg="danger">Denied</Badge>;
      default:
        return <Badge bg="warning">Not Requested</Badge>;
    }
  };

  return (
    <div className="notification-test-container">
      <Card>
        <Card.Header>
          <h4>
            <i className="bi bi-bell me-2"></i>
            Notification System Test
          </h4>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <h6>Current Permission Status: {getPermissionBadge()}</h6>
            <p className="text-muted">
              Browser notifications need permission to work properly.
            </p>
          </div>

          <div className="d-flex gap-2 mb-4 flex-wrap">
            <Button 
              variant="primary" 
              onClick={requestPermission}
              disabled={permission === 'granted'}
            >
              <i className="bi bi-shield-check me-2"></i>
              Request Permission
            </Button>
            
            <Button 
              variant="success" 
              onClick={sendTestNotification}
              disabled={permission !== 'granted'}
            >
              <i className="bi bi-bell me-2"></i>
              Send Test Notification
            </Button>
            
            <Button 
              variant="info" 
              onClick={sendMedicineReminder}
              disabled={permission !== 'granted'}
            >
              <i className="bi bi-capsule me-2"></i>
              Test Medicine Reminder
            </Button>
          </div>

          {testResults.length > 0 && (
            <div>
              <h6>Test Results:</h6>
              {testResults.map(result => (
                <Alert key={result.id} variant={result.type} className="py-2">
                  <small className="text-muted">{result.timestamp}</small>
                  <div>{result.message}</div>
                </Alert>
              ))}
            </div>
          )}

          <div className="mt-4">
            <h6>Instructions:</h6>
            <ol className="small text-muted">
              <li>Click "Request Permission" to enable notifications</li>
              <li>Click "Send Test Notification" to test basic notifications</li>
              <li>Click "Test Medicine Reminder" to test medicine-specific notifications</li>
              <li>Check your browser's notification area for the notifications</li>
            </ol>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default NotificationTest;