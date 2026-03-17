import React, { useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';

function ReportDownloader({ report, patientName }) {
  const [downloading, setDownloading] = useState(false);

  const downloadFile = async (url, filename) => {
    try {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'report_file';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = async () => {
    console.log('Download clicked. Report attachments:', report.attachments);
    console.log('Attachments type:', typeof report.attachments);
    console.log('Is array:', Array.isArray(report.attachments));
    console.log('Length:', report.attachments?.length);
    
    if (!report.attachments || !Array.isArray(report.attachments) || report.attachments.length === 0) {
      alert('No files attached to this report');
      return;
    }

    setDownloading(true);
    
    try {
      const date = new Date(report.report_date).toISOString().split('T')[0];
      
      for (let i = 0; i < report.attachments.length; i++) {
        const url = report.attachments[i];
        console.log(`Downloading file ${i + 1}:`, url);
        
        // Generate filename
        const extension = url.includes('.pdf') ? '.pdf' : 
                         url.includes('.jpg') || url.includes('.jpeg') ? '.jpg' :
                         url.includes('.png') ? '.png' : 
                         url.includes('.gif') ? '.gif' : '';
        
        const filename = `${patientName}_${report.report_type}_${date}_${i + 1}${extension}`.replace(/[^a-zA-Z0-9._-]/g, '_');
        
        await downloadFile(url, filename);
        
        // Small delay between downloads
        if (i < report.attachments.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download files. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleView = () => {
    console.log('View clicked. Report attachments:', report.attachments);
    
    if (!report.attachments || !Array.isArray(report.attachments) || report.attachments.length === 0) {
      alert('No files attached to this report');
      return;
    }

    // Open each file in a new tab
    report.attachments.forEach((url, index) => {
      console.log(`Opening file ${index + 1}:`, url);
      setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer');
      }, index * 200);
    });
  };

  // Debug logging
  console.log('ReportDownloader - Report:', report.report_title);
  console.log('ReportDownloader - Attachments:', report.attachments);
  console.log('ReportDownloader - Attachments type:', typeof report.attachments);
  console.log('ReportDownloader - Is array:', Array.isArray(report.attachments));

  // If no attachments, don't show download button
  if (!report.attachments || !Array.isArray(report.attachments) || report.attachments.length === 0) {
    return (
      <Button
        variant="outline-secondary"
        size="sm"
        disabled
        title="No files attached"
      >
        <i className="bi bi-file-x me-1"></i>
        No Files
      </Button>
    );
  }

  return (
    <div className="d-flex gap-2">
      <Button
        variant="outline-primary"
        size="sm"
        onClick={handleView}
        title="View uploaded files"
      >
        <i className="bi bi-eye me-1"></i>
        View
      </Button>
      <Button
        variant="outline-success"
        size="sm"
        onClick={handleDownload}
        disabled={downloading}
        title="Download uploaded files"
      >
        {downloading ? (
          <>
            <span className="spinner-border spinner-border-sm me-1" />
            Downloading...
          </>
        ) : (
          <>
            <i className="bi bi-download me-1"></i>
            Download ({report.attachments.length})
          </>
        )}
      </Button>
    </div>
  );
}

export default ReportDownloader;