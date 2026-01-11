// Seed data utility - creates demo users for testing
import { storage } from './storage';

export const seedDemoUsers = () => {
  const users = storage.getAllUsers();
  
  // Only seed if no users exist
  if (users.length === 0) {
    const demoUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '555-0101',
        age: 35,
        gender: 'male'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '555-0102',
        age: 28,
        gender: 'female'
      }
    ];

    demoUsers.forEach(user => {
      storage.saveUser(user);
    });

    console.log('Demo users created:');
    console.log('Email: john@example.com | Password: password123');
    console.log('Email: jane@example.com | Password: password123');
  }
};

// Call this function to reset all data (useful for development)
export const resetAllData = () => {
  if (window.confirm('This will delete all users and data. Are you sure?')) {
    localStorage.clear();
    console.log('All data cleared!');
    window.location.reload();
  }
};
