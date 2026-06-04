// scripts/migrateToFirestore.js
// Run this ONCE with: node scripts/migrateToFirestore.js
// It uploads all data from db.json to your Firebase Firestore.

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { readFileSync } from "fs";

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

async function migrate() {
  console.log("📖 Reading db.json...");
  const raw = readFileSync("./db.json", "utf-8");
  const data = JSON.parse(raw);

  const collections = Object.keys(data);
  console.log(`📦 Found ${collections.length} collections: ${collections.join(", ")}`);

  for (const collectionName of collections) {
    const items = data[collectionName];
    console.log(`\n🔄 Migrating "${collectionName}" (${items.length} documents)...`);

    for (const item of items) {
      const id = String(item.id);
      // Remove "id" from the stored data (Firestore uses document ID)
      const { id: _id, ...docData } = item;

      // Skip documents with very large fields (e.g., base64 images > 1MB)
      const json = JSON.stringify(docData);
      if (json.length > 1_000_000) {
        console.log(`  ⚠️  Skipping "${id}" (data too large: ${(json.length / 1024).toFixed(0)}KB)`);
        continue;
      }

      try {
        await setDoc(doc(db, collectionName, id), docData);
        console.log(`  ✅ ${collectionName}/${id}`);
      } catch (err) {
        console.error(`  ❌ ${collectionName}/${id}: ${err.message}`);
      }
    }
  }

  console.log("\n🎉 Migration complete!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
