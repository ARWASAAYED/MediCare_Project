// src/api/paitentApi.js
import { db } from "./firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const patientApi = {
  getAll: async () => {
    const snapshot = await getDocs(collection(db, "patients"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getById: async (id) => {
    const docSnap = await getDoc(doc(db, "patients", id));
    if (!docSnap.exists()) throw new Error("Patient not found");
    return { id: docSnap.id, ...docSnap.data() };
  },

  create: async (data) => {
    const docRef = await addDoc(collection(db, "patients"), data);
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    const ref = doc(db, "patients", id);
    await updateDoc(ref, data);
    const updated = await getDoc(ref);
    return { id: updated.id, ...updated.data() };
  },

  delete: async (id) => {
    await deleteDoc(doc(db, "patients", id));
  },
};
