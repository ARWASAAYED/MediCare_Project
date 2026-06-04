// src/api/serviceApi.js
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export const serviceApi = {
  getAll: async () => {
    const snapshot = await getDocs(collection(db, "services"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
};
