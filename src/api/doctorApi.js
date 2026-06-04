// src/api/doctorApi.js
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

export const doctorApi = {
  getAll: async () => {
    const snapshot = await getDocs(collection(db, "doctors"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getById: async (id) => {
    const docSnap = await getDoc(doc(db, "doctors", id));
    if (!docSnap.exists()) throw new Error("Doctor not found");
    return { id: docSnap.id, ...docSnap.data() };
  },

  create: async (data) => {
    const docRef = await addDoc(collection(db, "doctors"), data);
    return { id: docRef.id, ...data };
  },

  update: async (id, data) => {
    const ref = doc(db, "doctors", id);
    await updateDoc(ref, data);
    const updated = await getDoc(ref);
    return { id: updated.id, ...updated.data() };
  },

  delete: async (id) => {
    await deleteDoc(doc(db, "doctors", id));
  },
};
