import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, ListGroup, Badge, Alert } from 'react-bootstrap';
import { medicinesAPI } from '../../utils/api';

function MedicineReminder({ user }) {
  const [reminders, setReminders] = useState([]);
  const [formData, setFormData] = useState({
    medicine_name: '',
    dosage: '',
    time: '',
    frequency: 'daily'
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMedicines();
    }
  }, [user]);

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
      await medicinesAPI.create(formData);
      
      setFormData({ medicine_name: '', dosage: '', time: '', frequency: 'daily' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Refresh the list
      fetchMedicines();
    } catch (err) {
      console.error('Error creating medicine:', err);
      alert('Failed to add medicine reminder. Please try again.');
    }
  };

  const toggleReminder = async (id, currentStatus) => {
    try {
      await medicinesAPI.update(id, { active: !currentStatus });
      fetchMedicines(); // Refresh the list
    } catch (err) {
      console.error('Error updating medicine:', err);
      alert('Failed to update medicine. Please try again.');
    }
  };

  const handleDeleteReminder = async (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await medicinesAPI.delete(id);
        fetchMedicines(); // Refresh the list
      } catch (err) {
        console.error('Error deleting medicine:', err);
        alert('Failed to delete medicine. Please try again.');
      }
    }
  };

  return (
    <Row>
      <Col md={6}>
        <Card>
          <Card.Body>
            <Card.Title>
              <h4>Add Medicine Reminder</h4>
            </Card.Title>
            {showSuccess && (
              <Alert variant="success" dismissible onClose={() => setShowSuccess(false)}>
                Medicine reminder added successfully!
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Medicine Name</Form.Label>
                <Form.Control
                  type="text"
                  name="medicine_name"
                  value={formData.medicine_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Dosage</Form.Label>
                <Form.Control
                  type="text"
                  name="dosage"
                  placeholder="e.g., 100mg"
                  value={formData.dosage}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

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

              <Form.Group className="mb-3">
                <Form.Label>Frequency</Form.Label>
                <Form.Select name="frequency" value={formData.frequency} onChange={handleChange}>
                  <option value="daily">Daily</option>
                  <option value="twice-daily">Twice Daily</option>
                  <option value="weekly">Weekly</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
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
  );
}

export default MedicineReminder;
