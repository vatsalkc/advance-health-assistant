import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

// Global toast manager
class ToastManager {
  constructor() {
    this.listeners = [];
    this.toasts = [];
    this.nextId = 1;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(message, variant = 'success', duration = 3000) {
    const toast = {
      id: this.nextId++,
      message,
      variant,
      duration,
      timestamp: Date.now()
    };
    
    this.toasts.push(toast);
    this.listeners.forEach(listener => listener(this.toasts));
    
    // Auto remove after duration
    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  remove(id) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.listeners.forEach(listener => listener(this.toasts));
  }

  success(message, duration) {
    this.notify(message, 'success', duration);
  }

  error(message, duration) {
    this.notify(message, 'danger', duration);
  }

  warning(message, duration) {
    this.notify(message, 'warning', duration);
  }

  info(message, duration) {
    this.notify(message, 'info', duration);
  }
}

export const toastManager = new ToastManager();

function ToastNotification() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  return (
    <ToastContainer 
      position="top-end" 
      className="p-3"
      style={{ 
        position: 'fixed', 
        top: '80px', 
        right: '20px', 
        zIndex: 9999 
      }}
    >
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          bg={toast.variant}
          onClose={() => toastManager.remove(toast.id)}
          autohide
          delay={toast.duration}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toast.variant === 'success' && <i className="bi bi-check-circle me-2"></i>}
              {toast.variant === 'danger' && <i className="bi bi-exclamation-circle me-2"></i>}
              {toast.variant === 'warning' && <i className="bi bi-exclamation-triangle me-2"></i>}
              {toast.variant === 'info' && <i className="bi bi-info-circle me-2"></i>}
              Notification
            </strong>
          </Toast.Header>
          <Toast.Body className={toast.variant === 'success' || toast.variant === 'danger' ? 'text-white' : ''}>
            {toast.message}
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}

export default ToastNotification;
