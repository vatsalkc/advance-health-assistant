// Notification Service for Medicine Reminders

class NotificationService {
  constructor() {
    this.permission = 'default';
    this.checkPermission();
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

  // Send a notification
  sendNotification(title, options = {}) {
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
      const notification = new Notification(title, defaultOptions);
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }

  // Send medicine reminder notification
  sendMedicineReminder(medicineName, dosage, time) {
    return this.sendNotification('💊 Medicine Reminder', {
      body: `Time to take ${medicineName} (${dosage})`,
      tag: `medicine-${medicineName}`,
      icon: '/logo192.png',
      data: {
        medicineName,
        dosage,
        time
      }
    });
  }

  // Schedule medicine reminders
  scheduleMedicineReminders(medicines) {
    console.log('[NotificationService] Scheduling reminders for', medicines.length, 'medicines');
    
    // Clear existing timers
    this.clearAllTimers();
    
    medicines.forEach(medicine => {
      if (!medicine.active) return;
      
      this.scheduleSingleReminder(medicine);
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
    const timerId = setTimeout(() => {
      this.sendMedicineReminder(
        medicine.medicine_name,
        medicine.dosage,
        medicine.time
      );
      
      // Reschedule for next occurrence based on frequency
      this.rescheduleReminder(medicine);
    }, timeUntilReminder);
    
    // Store timer ID for cleanup
    if (!this.timers) this.timers = {};
    this.timers[medicine.id] = timerId;
  }

  // Reschedule reminder based on frequency
  rescheduleReminder(medicine) {
    let nextTime = new Date();
    
    switch (medicine.frequency) {
      case 'daily':
        nextTime.setDate(nextTime.getDate() + 1);
        break;
      case 'twice-daily':
        nextTime.setHours(nextTime.getHours() + 12);
        break;
      case 'weekly':
        nextTime.setDate(nextTime.getDate() + 7);
        break;
      default:
        nextTime.setDate(nextTime.getDate() + 1);
    }
    
    this.scheduleSingleReminder(medicine);
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
  sendTestNotification() {
    return this.sendNotification('Test Notification', {
      body: 'This is a test notification from Health Assistant',
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
export default notificationService;
