import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Table } from 'react-bootstrap';
import { supabase } from '../../config/supabase';

function ReportAttachmentsDebug() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('medical_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setReports(data || []);
      console.log('Debug - Reports data:', data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <Card>
      <Card.Header>
        <h5>Report Attachments Debug</h5>
        <Button size="sm" onClick={fetchReports} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Attachments</th>
              <th>Attachments Count</th>
              <th>Raw Data</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.report_title}</td>
                <td>{report.report_type}</td>
                <td>
                  {report.attachments ? (
                    <div>
                      {Array.isArray(report.attachments) ? (
                        report.attachments.map((url, index) => (
                          <div key={index} className="small">
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              File {index + 1}
                            </a>
                          </div>
                        ))
                      ) : (
                        <span className="text-warning">Not an array</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted">No attachments</span>
                  )}
                </td>
                <td>
                  {report.attachments ? 
                    (Array.isArray(report.attachments) ? report.attachments.length : 'Not array') 
                    : '0'
                  }
                </td>
                <td>
                  <details>
                    <summary>Raw</summary>
                    <pre className="small">
                      {JSON.stringify(report.attachments, null, 2)}
                    </pre>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default ReportAttachmentsDebug;