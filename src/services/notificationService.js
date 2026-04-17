// Notification Service for Medicine Reminders with Service Worker Support

class NotificationService {
  constructor() {
    this.permission = 'default';
    this.serviceWorkerRegistration = null;
    this.checkPermission();
    this.registerServiceWorker();
  }

  // Register service worker for background notifications
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        this.serviceWorkerRegistration = registration;
        console.log('[NotificationService] Service Worker registered:', registration);
        
        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;
        console.log('[NotificationService] Service Worker is ready');
      } catch (error) {
        console.error('[NotificationService] Service Worker registration failed:', error);
      }
    }
  }

  // Check current notification permission
  checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
    return this.permission;
  }

  // Request notification permission from user
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permission = 'granted';
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }

    return false;
  }

  // Send a notification (works even when browser is in background)
  async sendNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    const defaultOptions = {
      icon: '/logo192.png',
      badge: '/logo192.png',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      ...options
    };

    try {
      // Use service worker if available (works in background)
      if (this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.showNotification(title, defaultOptions);
        console.log('[NotificationService] Notification sent via Service Worker');
        return true;
      } else {
        // Fallback to regular notification
        const notification = new Notification(title, defaultOptions);
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        return notification;
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }

  // Send medicine reminder notification
  async sendMedicineReminder(medicineName, dosage, time) {
    return await this.sendNotification('💊 Medicine Reminder', {
      body: `Time to take ${medicineName} (${dosage})`,
      tag: `medicine-${medicineName}`,
      icon: '/logo192.png',
      data: {
        medicineName,
        dosage,
        time,
        url: window.location.origin
      }
    });
  }

  // Schedule medicine reminders
  scheduleMedicineReminders(medicines) {
    console.log('[NotificationService] Scheduling reminders for', medicines.length, 'medicines');
    
    // Clear existing timers
    this.clearAllTimers();
    
    // Store reminders in localStorage for persistence
    localStorage.setItem('medicineReminders', JSON.stringify(medicines));
    
    medicines.forEach(medicine => {
      if (!medicine.active) return;
      
      // Handle multiple times (for twice-daily)
      const times = medicine.time.includes(',') 
        ? medicine.time.split(',').map(t => t.trim())
        : [medicine.time];
      
      times.forEach(time => {
        this.scheduleSingleReminder({ ...medicine, time });
      });
    });
  }

  // Schedule a single medicine reminder
  scheduleSingleReminder(medicine) {
    const now = new Date();
    const [hours, minutes] = medicine.time.split(':');
    
    // Create reminder time for today
    const reminderTime = new Date();
    reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    console.log(`[NotificationService] Scheduling ${medicine.medicine_name} for ${reminderTime.toLocaleString()}`);
    
    // Schedule the notification
    const timerId = setTimeout(async () => {
      await this.sendMedicineReminder(
        medicine.medicine_name,
        medicine.dosage,
        medicine.time
      );
      
      // Reschedule for next occurrence based on frequency
      this.rescheduleReminder(medicine);
    }, timeUntilReminder);
    
    // Store timer ID for cleanup
    if (!this.timers) this.timers = {};
    this.timers[`${medicine.id}-${medicine.time}`] = timerId;
  }

  // Reschedule reminder based on frequency
  rescheduleReminder(medicine) {
    let nextTime = new Date();
    
    switch (medicine.frequency) {
      case 'daily':
        nextTime.setDate(nextTime.getDate() + 1);
        break;
      case 'twice-daily':
        // For twice daily, the times are already split, so just schedule for next day
        nextTime.setDate(nextTime.getDate() + 1);
        break;
      case 'weekly':
        nextTime.setDate(nextTime.getDate() + 7);
        break;
      default:
        nextTime.setDate(nextTime.getDate() + 1);
    }
    
    this.scheduleSingleReminder(medicine);
  }

  // Restore reminders from localStorage (on app start)
  restoreReminders() {
    try {
      const stored = localStorage.getItem('medicineReminders');
      if (stored) {
        const medicines = JSON.parse(stored);
        if (this.permission === 'granted') {
          this.scheduleMedicineReminders(medicines);
        }
      }
    } catch (error) {
      console.error('[NotificationService] Error restoring reminders:', error);
    }
  }

  // Clear all scheduled timers
  clearAllTimers() {
    if (this.timers) {
      Object.values(this.timers).forEach(timerId => {
        clearTimeout(timerId);
      });
      this.timers = {};
    }
  }

  // Clear specific timer
  clearTimer(medicineId) {
    if (this.timers && this.timers[medicineId]) {
      clearTimeout(this.timers[medicineId]);
      delete this.timers[medicineId];
    }
  }

  // Test notification (for debugging)
  async sendTestNotification() {
    return await this.sendNotification('Test Notification', {
      body: 'This is a test notification from Health Assistant. Medicine reminders will work even when the browser is closed!',
      tag: 'test-notification'
    });
  }

  // Check if notifications are supported
  isSupported() {
    return 'Notification' in window;
  }

  // Get permission status
  getPermissionStatus() {
    return this.permission;
  }
}

const notificationService = new NotificationService();

// Restore reminders when service loads
if (document.readyState === 'complete') {
  notificationService.restoreReminders();
} else {
  window.addEventListener('load', () => {
    notificationService.restoreReminders();
  });
}

export default notificationService;
