// src/api/reviewApi.js
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";

export const reviewApi = {
  create: async (data) => {
    const docRef = await addDoc(collection(db, "reviews"), data);
    return { id: docRef.id, ...data };
  },

  getByDoctorId: async (doctorId) => {
    const q = query(
      collection(db, "reviews"),
      where("doctorId", "==", doctorId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getByPatientId: async (patientId) => {
    const q = query(
      collection(db, "reviews"),
      where("patientId", "==", patientId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getAll: async () => {
    const snapshot = await getDocs(collection(db, "reviews"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
};
