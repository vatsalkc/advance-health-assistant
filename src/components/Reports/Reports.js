import React, { useState } from 'react';
import { Tab, Nav, Card } from 'react-bootstrap';
import ReportUploadFixed from './ReportUploadFixed';
import MyReports from './MyReports';

function Reports() {
  const [activeTab, setActiveTab] = useState('my-reports');
  const [refreshReports, setRefreshReports] = useState(0);

  const handleUploadSuccess = () => {
    // Switch to reports tab and refresh the list
    setActiveTab('my-reports');
    setRefreshReports(prev => prev + 1);
  };

  return (
    <div className="reports-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="bi bi-file-medical-fill me-2 text-primary"></i>
          Medical Reports
        </h3>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Card>
          <Card.Header>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="my-reports">
                  <i className="bi bi-file-medical me-2"></i>
                  My Reports
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="upload">
                  <i className="bi bi-cloud-upload me-2"></i>
                  Upload New Report
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="my-reports">
                <MyReports key={refreshReports} />
              </Tab.Pane>
              <Tab.Pane eventKey="upload">
                <ReportUploadFixed onUploadSuccess={handleUploadSuccess} />
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </div>
  );
}

export default Reports;