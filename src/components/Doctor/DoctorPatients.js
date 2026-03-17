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
    <Card className="doctor-patients-card">
      <Card.Header className="doctor-patients-header">
        <div>
          <h4 className="mb-1">
            <i className="bi bi-people-fill me-2 text-primary"></i>
            My Patients
          </h4>
          <p className="text-muted mb-0">
            <i className="bi bi-person-badge me-1"></i>
            Total: {patients.length} patients
          </p>
        </div>
      </Card.Header>
      <Card.Body>
        {patients.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-people" style={{ fontSize: '4rem', color: '#94a3b8' }}></i>
            <p className="text-muted mt-3 mb-0">No patients yet</p>
            <small className="text-muted">Patients will appear here after appointments</small>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="patients-table">
              <thead>
                <tr>
                  <th>
                    <i className="bi bi-person me-2"></i>
                    Patient
                  </th>
                  <th>
                    <i className="bi bi-envelope me-2"></i>
                    Contact
                  </th>
                  <th>
                    <i className="bi bi-calendar-event me-2"></i>
                    Age
                  </th>
                  <th>
                    <i className="bi bi-gender-ambiguous me-2"></i>
                    Gender
                  </th>
                  <th className="text-center">
                    <i className="bi bi-gear me-2"></i>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient.id} className="patient-row">
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="patient-avatar-small">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <strong className="patient-name-text">{patient.name}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div className="mb-1">
                          <i className="bi bi-envelope-fill text-primary me-2"></i>
                          {patient.email}
                        </div>
                        <div>
                          <i className="bi bi-telephone-fill text-success me-2"></i>
                          <small className="text-muted">{patient.phone || 'N/A'}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info" className="age-badge">
                        {patient.age || 'N/A'} {patient.age ? 'yrs' : ''}
                      </Badge>
                    </td>
                    <td>
                      {patient.gender ? (
                        <Badge 
                          bg={patient.gender.toLowerCase() === 'male' ? 'primary' : 'danger'}
                          className="gender-badge"
                        >
                          <i className={`bi bi-gender-${patient.gender.toLowerCase() === 'male' ? 'male' : 'female'} me-1`}></i>
                          {patient.gender}
                        </Badge>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="primary"
                        className="view-details-btn"
                        onClick={() => onViewPatient(patient.id)}
                      >
                        <i className="bi bi-eye me-2"></i>
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
