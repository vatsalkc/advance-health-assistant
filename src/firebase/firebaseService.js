import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from './config';

// ==================== AUTH SERVICES ====================

export const registerUser = async (userData) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const user = userCredential.user;
    
    // Save additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      age: userData.age || '',
      gender: userData.gender || '',
      createdAt: new Date().toISOString()
    });
    
    return {
      uid: user.uid,
      email: user.email,
      name: userData.name
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return {
        uid: user.uid,
        ...userDoc.data()
      };
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          resolve({ uid: user.uid, ...userDoc.data() });
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }, reject);
  });
};

// ==================== APPOINTMENTS SERVICES ====================

export const createAppointment = async (userId, appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, 'appointments'), {
      userId,
      ...appointmentData,
      createdAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...appointmentData
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const getUserAppointments = async (userId) => {
  try {
    const q = query(
      collection(db, 'appointments'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const appointments = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return appointments;
  } catch (error) {
    console.error('Error getting appointments:', error);
    throw error;
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    await deleteDoc(doc(db, 'appointments', appointmentId));
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

// Real-time listener for appointments
export const subscribeToAppointments = (userId, callback) => {
  const q = query(
    collection(db, 'appointments'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const appointments = [];
    snapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(appointments);
  });
};

// ==================== MEDICINES SERVICES ====================

export const createMedicine = async (userId, medicineData) => {
  try {
    const docRef = await addDoc(collection(db, 'medicines'), {
      userId,
      ...medicineData,
      active: true,
      createdAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...medicineData,
      active: true
    };
  } catch (error) {
    console.error('Error creating medicine:', error);
    throw error;
  }
};

export const getUserMedicines = async (userId) => {
  try {
    const q = query(
      collection(db, 'medicines'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const medicines = [];
    
    querySnapshot.forEach((doc) => {
      medicines.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return medicines;
  } catch (error) {
    console.error('Error getting medicines:', error);
    throw error;
  }
};

export const updateMedicine = async (medicineId, updates) => {
  try {
    await updateDoc(doc(db, 'medicines', medicineId), updates);
  } catch (error) {
    console.error('Error updating medicine:', error);
    throw error;
  }
};

export const deleteMedicine = async (medicineId) => {
  try {
    await deleteDoc(doc(db, 'medicines', medicineId));
  } catch (error) {
    console.error('Error deleting medicine:', error);
    throw error;
  }
};

// Real-time listener for medicines
export const subscribeToMedicines = (userId, callback) => {
  const q = query(
    collection(db, 'medicines'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const medicines = [];
    snapshot.forEach((doc) => {
      medicines.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(medicines);
  });
};

// ==================== SYMPTOM CHECKS SERVICES ====================

export const createSymptomCheck = async (userId, symptomData) => {
  try {
    const docRef = await addDoc(collection(db, 'symptomChecks'), {
      userId,
      ...symptomData,
      createdAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...symptomData
    };
  } catch (error) {
    console.error('Error creating symptom check:', error);
    throw error;
  }
};

export const getUserSymptomChecks = async (userId) => {
  try {
    const q = query(
      collection(db, 'symptomChecks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const checks = [];
    
    querySnapshot.forEach((doc) => {
      checks.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return checks;
  } catch (error) {
    console.error('Error getting symptom checks:', error);
    throw error;
  }
};

// ==================== STATS SERVICES ====================

export const getUserStats = async (userId) => {
  try {
    const [appointments, medicines, symptomChecks] = await Promise.all([
      getUserAppointments(userId),
      getUserMedicines(userId),
      getUserSymptomChecks(userId)
    ]);
    
    return {
      totalAppointments: appointments.length,
      activeMedicines: medicines.filter(m => m.active).length,
      symptomsChecked: symptomChecks.length
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
};

// ==================== DOCTORS (Static Data) ====================

export const getAllDoctors = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'doctors'));
    const doctors = [];
    
    querySnapshot.forEach((doc) => {
      doctors.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return doctors;
  } catch (error) {
    console.error('Error getting doctors:', error);
    throw error;
  }
};

export const getDoctorsBySpecialization = async (specialization) => {
  try {
    const q = query(
      collection(db, 'doctors'),
      where('specialization', '==', specialization)
    );
    
    const querySnapshot = await getDocs(q);
    const doctors = [];
    
    querySnapshot.forEach((doc) => {
      doctors.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return doctors;
  } catch (error) {
    console.error('Error getting doctors by specialization:', error);
    throw error;
  }
};
