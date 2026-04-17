/* eslint-disable no-restricted-globals */

// Service Worker for Medicine Reminders
// This allows notifications to work even when the browser is closed

const CACHE_NAME = 'health-assistant-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(self.clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();
  
  // Open or focus the app
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

// Handle push notifications (for future use with push API)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Medicine Reminder';
  const options = {
    body: data.body || 'Time to take your medicine',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { medicine, delay } = event.data;
    
    // Schedule notification
    setTimeout(() => {
      self.registration.showNotification('💊 Medicine Reminder', {
        body: `Time to take ${medicine.medicine_name} (${medicine.dosage})`,
        icon: '/logo192.png',
        badge: '/logo192.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        tag: `medicine-${medicine.id}`,
        data: medicine
      });
    }, delay);
  }
});
