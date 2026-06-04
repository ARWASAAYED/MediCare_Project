// src/api/appointmentApi.js
import { db } from "./firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

export const appointmentApi = {
  getAll: async () => {
    const snapshot = await getDocs(collection(db, "appointments"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getById: async (id) => {
    const docSnap = await getDoc(doc(db, "appointments", id));
    if (!docSnap.exists()) throw new Error("Appointment not found");
    return { id: docSnap.id, ...docSnap.data() };
  },

  getByPatientId: async (patientId) => {
    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", patientId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getByDoctorId: async (doctorId) => {
    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctorId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  checkAvailability: async (doctorId, date) => {
    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctorId)
    );
    const snapshot = await getDocs(q);
    const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return all.filter((apt) => {
      const aptDate = new Date(apt.date).toDateString();
      const checkDate = new Date(date).toDateString();
      return aptDate === checkDate;
    });
  },

  create: async (data) => {
    const docRef = await addDoc(collection(db, "appointments"), data);
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    const ref = doc(db, "appointments", id);
    await updateDoc(ref, data);
    const updated = await getDoc(ref);
    return { id: updated.id, ...updated.data() };
  },

  delete: async (id) => {
    await deleteDoc(doc(db, "appointments", id));
  },
};
