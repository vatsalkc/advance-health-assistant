import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show alert if offline on mount
    if (!navigator.onLine) {
      setShowOfflineAlert(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineAlert && isOnline) {
    return null;
  }

  return (
    <Alert 
      variant={isOnline ? "success" : "warning"} 
      className="mb-0"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 9999,
        borderRadius: 0
      }}
    >
      <div className="text-center">
        {isOnline ? (
          <>
            <i className="bi bi-wifi me-2"></i>
            Connection restored
          </>
        ) : (
          <>
            <i className="bi bi-wifi-off me-2"></i>
            No internet connection. Please check your network.
          </>
        )}
      </div>
    </Alert>
  );
}

export default NetworkStatus;