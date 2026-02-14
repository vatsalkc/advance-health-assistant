import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge } from 'react-bootstrap';
import { doctorPatientsAPI } from '../../utils/doctorApi';

function DoctorPatients({ onViewPatient }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await doctorPatientsAPI.getAll();
      setPatients(response.data.patients);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading patients...</p>
      </div>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h4>My Patients</h4>
        <p className="text-muted mb-0">Total: {patients.length} patients</p>
      </Card.Header>
      <Card.Body>
        {patients.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No patients yet</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient.id}>
                    <td>
                      <strong>{patient.name}</strong>
                    </td>
                    <td>
                      {patient.email}
                      <br />
                      <small className="text-muted">{patient.phone}</small>
                    </td>
                    <td>{patient.age || 'N/A'}</td>
                    <td>
                      {patient.gender ? (
                        <Badge bg="info">{patient.gender}</Badge>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onViewPatient(patient.id)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default DoctorPatients;
