// Local storage utility functions for user-specific data

export const storage = {
  // Get user-specific key
  getUserKey: (userId, key) => `user_${userId}_${key}`,

  // User Management
  getAllUsers: () => {
    const users = localStorage.getItem('users_database');
    return users ? JSON.parse(users) : [];
  },

  saveUser: (userData) => {
    const users = storage.getAllUsers();
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users_database', JSON.stringify(users));
    return newUser;
  },

  findUserByEmail: (email) => {
    const users = storage.getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  },

  authenticateUser: (email, password) => {
    const user = storage.findUserByEmail(email);
    if (user && user.password === password) {
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },

  updateUser: (userId, updates) => {
    const users = storage.getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('users_database', JSON.stringify(users));
      return users[index];
    }
    return null;
  },

  // Appointments
  getAppointments: (userId) => {
    const key = storage.getUserKey(userId, 'appointments');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  saveAppointments: (userId, appointments) => {
    const key = storage.getUserKey(userId, 'appointments');
    localStorage.setItem(key, JSON.stringify(appointments));
  },

  // Medicines
  getMedicines: (userId) => {
    const key = storage.getUserKey(userId, 'medicines');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  saveMedicines: (userId, medicines) => {
    const key = storage.getUserKey(userId, 'medicines');
    localStorage.setItem(key, JSON.stringify(medicines));
  },

  // Symptom checks history
  getSymptomChecks: (userId) => {
    const key = storage.getUserKey(userId, 'symptomChecks');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  saveSymptomCheck: (userId, symptomCheck) => {
    const key = storage.getUserKey(userId, 'symptomChecks');
    const existing = storage.getSymptomChecks(userId);
    const updated = [...existing, { ...symptomCheck, timestamp: new Date().toISOString() }];
    localStorage.setItem(key, JSON.stringify(updated));
  },

  // Get dashboard stats
  getStats: (userId) => {
    const appointments = storage.getAppointments(userId);
    const medicines = storage.getMedicines(userId);
    const symptomChecks = storage.getSymptomChecks(userId);

    return {
      totalAppointments: appointments.length,
      activeMedicines: medicines.filter(m => m.active).length,
      symptomsChecked: symptomChecks.length
    };
  },

  // Clear user data (for logout or account deletion)
  clearUserData: (userId) => {
    const keys = ['appointments', 'medicines', 'symptomChecks'];
    keys.forEach(key => {
      localStorage.removeItem(storage.getUserKey(userId, key));
    });
  },

  // Get all data for export/backup
  exportUserData: (userId) => {
    return {
      appointments: storage.getAppointments(userId),
      medicines: storage.getMedicines(userId),
      symptomChecks: storage.getSymptomChecks(userId),
      stats: storage.getStats(userId)
    };
  }
};

