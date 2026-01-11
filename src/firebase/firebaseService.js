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
  orderBy
} from 'firebase/firestore';

import { auth, db } from './config';

// ==================== AUTH ====================

export const registerUser = async (userData) => {
  const cred = await createUserWithEmailAndPassword(
    auth,
    userData.email,
    userData.password
  );

  const user = cred.user;

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name: userData.name,
    email: userData.email,
    phone: userData.phone || '',
    age: userData.age || '',
    gender: userData.gender || '',
    createdAt: new Date().toISOString(),
  });

  return { uid: user.uid, email: user.email };
};

export const loginUser = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return { uid: cred.user.uid, email: cred.user.email };
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getCurrentUser = () =>
  new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return resolve(null);

      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        resolve({ uid: user.uid, ...snap.data() });
      } catch {
        resolve({ uid: user.uid });
      }
    });
  });

// ==================== APPOINTMENTS ====================

export const createAppointment = async (userId, data) => {
  const ref = await addDoc(collection(db, 'appointments'), {
    userId,
    ...data,
    createdAt: new Date().toISOString(),
  });

  return { id: ref.id, ...data };
};

export const getUserAppointments = async (userId) => {
  const q = query(
    collection(db, 'appointments'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const subscribeToAppointments = (userId, callback) => {
  let active = true;

  getUserAppointments(userId)
    .then(data => {
      if (active) callback(data);
    })
    .catch(console.error);

  // ✅ ALWAYS return a function
  return () => {
    active = false;
  };
};

export const deleteAppointment = async (id) => {
  await deleteDoc(doc(db, 'appointments', id));
};

// ==================== MEDICINES ====================

export const createMedicine = async (userId, data) => {
  const ref = await addDoc(collection(db, 'medicines'), {
    userId,
    ...data,
    active: true,
    createdAt: new Date().toISOString(),
  });

  return { id: ref.id, ...data };
};

export const getUserMedicines = async (userId) => {
  const q = query(
    collection(db, 'medicines'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const subscribeToMedicines = (userId, callback) => {
  let active = true;

  getUserMedicines(userId)
    .then(data => {
      if (active) callback(data);
    })
    .catch(console.error);

  return () => {
    active = false;
  };
};

export const updateMedicine = async (id, updates) => {
  await updateDoc(doc(db, 'medicines', id), updates);
};

export const deleteMedicine = async (id) => {
  await deleteDoc(doc(db, 'medicines', id));
};

// ==================== SYMPTOMS ====================

export const createSymptomCheck = async (userId, data) => {
  const ref = await addDoc(collection(db, 'symptomChecks'), {
    userId,
    ...data,
    createdAt: new Date().toISOString(),
  });

  return { id: ref.id, ...data };
};

export const getUserSymptomChecks = async (userId) => {
  const q = query(
    collection(db, 'symptomChecks'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ==================== STATS ====================

export const getUserStats = async (userId) => {
  const [a, m, s] = await Promise.all([
    getUserAppointments(userId),
    getUserMedicines(userId),
    getUserSymptomChecks(userId)
  ]);

  return {
    totalAppointments: a.length,
    activeMedicines: m.filter(x => x.active).length,
    symptomsChecked: s.length
  };
};

// ==================== DOCTORS ====================

export const getAllDoctors = async () => {
  const snap = await getDocs(collection(db, 'doctors'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getDoctorsBySpecialization = async (specialization) => {
  const q = query(
    collection(db, 'doctors'),
    where('specialization', '==', specialization)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
