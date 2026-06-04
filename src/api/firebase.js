// src/api/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBJT0KjCugaecftPfUY00R2_kHZ9tnFr0",
  authDomain: "hospital-system-2e57e.firebaseapp.com",
  projectId: "hospital-system-2e57e",
  storageBucket: "hospital-system-2e57e.firebasestorage.app",
  messagingSenderId: "509229747034",
  appId: "1:509229747034:web:8038ec90c69470d4820163",
  measurementId: "G-FHL0SW3SBJ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
