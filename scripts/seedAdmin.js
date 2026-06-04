/**
 * Admin Seed Script
 * Run this ONCE to create the admin user in Firebase Firestore.
 * 
 * Usage: node scripts/seedAdmin.js
 * 
 * Or you can manually create the admin in Firebase Console:
 * 1. Go to https://console.firebase.google.com
 * 2. Select your project "hospital-system-2e57e"
 * 3. Go to Firestore Database
 * 4. Click on the "users" collection
 * 5. Click "Add document" (Auto-ID)
 * 6. Add these fields:
 *    - username (string): "Admin"
 *    - name (string): "Admin"
 *    - email (string): "admin@gmail.com"
 *    - password (string): "Password123!"
 *    - role (string): "admin"
 *    - image (string): ""
 *    - phone (string): ""
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

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
const db = getFirestore(app);

async function seedAdmin() {
  const email = "admin@gmail.com";
  
  // Check if admin already exists
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    console.log("❌ Admin user already exists! Skipping...");
    process.exit(0);
  }

  const adminUser = {
    username: "Admin",
    name: "Admin",
    email: email,
    password: "Password123!",
    role: "admin",
    image: "",
    phone: "",
  };

  const docRef = await addDoc(collection(db, "users"), adminUser);
  console.log("✅ Admin user created successfully!");
  console.log(`   Document ID: ${docRef.id}`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: Password123!`);
  console.log(`   Role: admin`);
  
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("❌ Failed to create admin:", err);
  process.exit(1);
});
