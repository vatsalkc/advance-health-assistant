import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { supabase } from '../../config/supabase';

function FileViewer({ url, fileName, index }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileAccess = async (action = 'view') => {
    setLoading(true);
    setError('');
    
    try {
      // Extract the file path from the URL
      const urlParts = url.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'medical-reports');
      
      if (bucketIndex === -1) {
        throw new Error('Invalid file URL format');
      }
      
      // Get the file path (everything after the bucket name)
      const filePath = urlParts.slice(bucketIndex + 1).join('/');
      
      console.log('Accessing file:', filePath);
      
      // Try to get a signed URL for better access control
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('medical-reports')
        .createSignedUrl(filePath, 3600); // 1 hour expiry
      
      if (signedUrlError) {
        console.warn('Signed URL failed, trying public URL:', signedUrlError);
        // Fallback to direct public URL access
        window.open(url, action === 'view' ? '_blank' : '_self');
      } else {
        // Use signed URL
        if (action === 'download') {
          // Create a temporary link for download
          const link = document.createElement('a');
          link.href = signedUrlData.signedUrl;
          link.download = fileName || `attachment_${index + 1}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Open in new tab for viewing
          window.open(signedUrlData.signedUrl, '_blank');
        }
      }
      
    } catch (err) {
      console.error('File access error:', err);
      setError(`Failed to ${action} file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <Alert variant="danger" className="small mb-2">
          {error}
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => setError('')}
            className="p-0 ms-2"
          >
            Dismiss
          </Button>
        </Alert>
      )}
      
      <div className="d-flex gap-2">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleFileAccess('view')}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm me-1" />
          ) : (
            <i className={`bi ${url.includes('.pdf') ? 'bi-file-pdf' : 'bi-image'} me-1`}></i>
          )}
          View
        </Button>
        
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => handleFileAccess('download')}
          disabled={loading}
        >
          <i className="bi bi-download me-1"></i>
          Download
        </Button>
      </div>
    </div>
  );
}

export default FileViewer;