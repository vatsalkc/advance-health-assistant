import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, ListGroup, Badge, Alert } from 'react-bootstrap';
import { medicinesAPI } from '../../utils/api';
import notificationService from '../../services/notificationService';
import { toastManager } from '../Toast/ToastNotification';

function MedicineReminder({ user }) {
  const [reminders, setReminders] = useState([]);
  const [formData, setFormData] = useState({
    medicine_name: '',
    dosage: '',
    time: '',
    time2: '', // For twice daily
    frequency: 'daily'
  });
  const [loading, setLoading] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    if (user) {
      fetchMedicines();
      checkNotificationPermission();
      
      // Automatically prompt for notification permission on first visit
      const hasPromptedBefore = localStorage.getItem('notificationPrompted');
      if (!hasPromptedBefore && notificationService.getPermissionStatus() === 'default') {
        // Wait a bit for the page to load
        setTimeout(() => {
          localStorage.setItem('notificationPrompted', 'true');
          requestNotificationPermission();
        }, 1000);
      }
    }
  }, [user]);

  useEffect(() => {
    // Schedule notifications when reminders change
    if (reminders.length > 0 && notificationPermission === 'granted') {
      notificationService.scheduleMedicineReminders(reminders);
    }

    // Cleanup timers on unmount
    return () => {
      notificationService.clearAllTimers();
    };
  }, [reminders, notificationPermission]);

  const checkNotificationPermission = () => {
    const permission = notificationService.checkPermission();
    setNotificationPermission(permission);
  };

  const requestNotificationPermission = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationPermission(granted ? 'granted' : 'denied');
    
    if (granted) {
      // Reschedule reminders with notifications enabled
      notificationService.scheduleMedicineReminders(reminders);
      toastManager.success('Notifications enabled! You will receive reminders even when the browser is closed.');
    } else {
      toastManager.error('Notifications denied. You can enable them in your browser settings.');
    }
  };

  const testNotification = async () => {
    if (notificationPermission === 'granted') {
      await notificationService.sendTestNotification();
      toastManager.info('Test notification sent! Check your system notifications.');
    } else {
      toastManager.warning('Please enable notifications first');
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await medicinesAPI.getAll();
      setReminders(response.data.medicines);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // For twice daily, combine times
      let timeValue = formData.time;
      if (formData.frequency === 'twice-daily' && formData.time2) {
        timeValue = `${formData.time}, ${formData.time2}`;
      }
      
      await medicinesAPI.create({
        ...formData,
        time: timeValue
      });
      
      setFormData({ medicine_name: '', dosage: '', time: '', time2: '', frequency: 'daily' });
      toastManager.success('Medicine reminder added successfully!');
      
      // Refresh the list
      await fetchMedicines();
      
      // Show notification permission request if not granted
      if (notificationPermission !== 'granted' && notificationPermission !== 'denied') {
        setTimeout(() => {
          requestNotificationPermission();
        }, 500);
      }
    } catch (err) {
      console.error('Error creating medicine:', err);
      toastManager.error('Failed to add medicine reminder. Please try again.');
    }
  };

  const toggleReminder = async (id, currentStatus) => {
    try {
      await medicinesAPI.update(id, { active: !currentStatus });
      toastManager.success(`Reminder ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchMedicines(); // Refresh the list
    } catch (err) {
      console.error('Error updating medicine:', err);
      toastManager.error('Failed to update medicine. Please try again.');
    }
  };

  const handleDeleteReminder = async (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await medicinesAPI.delete(id);
        toastManager.success('Reminder deleted successfully!');
        fetchMedicines(); // Refresh the list
      } catch (err) {
        console.error('Error deleting medicine:', err);
        toastManager.error('Failed to delete medicine. Please try again.');
      }
    }
  };

  return (
    <div>
      {/* Notification Permission Banner */}
      {notificationPermission !== 'granted' && notificationPermission !== 'denied' && (
        <Alert variant="info" className="mb-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="mb-2 mb-md-0">
              <i className="bi bi-bell me-2"></i>
              <strong>Enable Browser Notifications</strong>
              <p className="mb-0 mt-1" style={{ fontSize: '0.9rem' }}>
                Get medicine reminders even when the browser is closed. Click "Enable Now" and allow notifications in the browser prompt.
              </p>
            </div>
            <Button 
              variant="info" 
              size="sm"
              onClick={requestNotificationPermission}
            >
              <i className="bi bi-bell-fill me-1"></i>
              Enable Now
            </Button>
          </div>
        </Alert>
      )}

      {notificationPermission === 'denied' && (
        <Alert variant="danger" className="mb-3">
          <div>
            <i className="bi bi-bell-slash me-2"></i>
            <strong>Notifications Blocked</strong>
            <p className="mb-0 mt-1" style={{ fontSize: '0.9rem' }}>
              You have blocked notifications. To enable them, click the lock icon in your browser's address bar and allow notifications for this site.
            </p>
          </div>
        </Alert>
      )}

      {notificationPermission === 'granted' && (
        <Alert variant="success" className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className="bi bi-bell-fill me-2"></i>
              Notifications enabled! Reminders will work even when the browser is closed.
            </div>
            <Button 
              variant="outline-success" 
              size="sm"
              onClick={testNotification}
            >
              Test Notification
            </Button>
          </div>
        </Alert>
      )}

      <Row>
      <Col md={6}>
        <Card>
          <Card.Body>
            <Card.Title>
              <h4>Add Medicine Reminder</h4>
            </Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Medicine Name</Form.Label>
                <Form.Control
                  type="text"
                  name="medicine_name"
                  value={formData.medicine_name}
                  onChange={handleChange}
                  placeholder="e.g., Aspirin"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Dosage</Form.Label>
                <Form.Control
                  type="text"
                  name="dosage"
                  placeholder="e.g., 100mg, 2 tablets"
                  value={formData.dosage}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Frequency</Form.Label>
                <Form.Select name="frequency" value={formData.frequency} onChange={handleChange}>
                  <option value="daily">Once Daily</option>
                  <option value="twice-daily">Twice Daily</option>
                  <option value="weekly">Weekly</option>
                </Form.Select>
              </Form.Group>

              {formData.frequency === 'twice-daily' ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>First Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                    <Form.Text className="text-muted">
                      Morning dose time
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Second Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="time2"
                      value={formData.time2}
                      onChange={handleChange}
                      required
                    />
                    <Form.Text className="text-muted">
                      Evening dose time
                    </Form.Text>
                  </Form.Group>
                </>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}

              <Button variant="primary" type="submit" className="w-100">
                <i className="bi bi-plus-circle me-2"></i>
                Add Reminder
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6}>
        <Card>
          <Card.Body>
            <Card.Title>
              <h4>Your Medicine Reminders</h4>
            </Card.Title>
            <ListGroup variant="flush">
              {loading ? (
                <p className="text-muted">Loading...</p>
              ) : reminders.length === 0 ? (
                <p className="text-muted">No reminders set</p>
              ) : (
                reminders.map((reminder) => (
                  <ListGroup.Item key={reminder.id} className="medicine-reminder">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6>{reminder.medicine_name}</h6>
                        <p className="mb-1">Dosage: {reminder.dosage}</p>
                        <p className="mb-1">Time: {reminder.time}</p>
                        <Badge bg="info">{reminder.frequency}</Badge>
                      </div>
                      <Badge bg={reminder.active ? 'success' : 'secondary'}>
                        {reminder.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="d-flex gap-2 mt-2">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => toggleReminder(reminder.id, reminder.active)}
                      >
                        {reminder.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteReminder(reminder.id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    </div>
  );
}

export default MedicineReminder;
