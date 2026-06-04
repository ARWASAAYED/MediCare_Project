// src/api/authApi.js
import { db } from "./firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

export const authApi = {
  // Login: find user in Firestore "users" collection by email + password
  login: async (email, password) => {
    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) throw new Error("Invalid credentials");

      const userDoc = snapshot.docs[0];
      const userData = { id: userDoc.id, ...userDoc.data() };

      if (userData.password !== password) {
        throw new Error("Invalid credentials");
      }

      // Store user id as the "session token"
      localStorage.setItem("token", String(userData.id));
      return userData;
    } catch (error) {
      throw new Error(
        error.message || "Login failed. Please check your credentials."
      );
    }
  },

  // Register: create a new user in Firestore "users" collection
  register: async ({ username, email, password, role = "patient", specialty, userImage, phone, bio, experience, education, availability }) => {
    try {
      // Check if user already exists
      const q = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) throw new Error("User already exists");

      const newUser = {
        username,
        email,
        password,
        name: username, // username stores Full Name in Signup.jsx
        role,
        image: userImage || "",
        phone: phone || "",
      };

      const docRef = await addDoc(collection(db, "users"), newUser);
      const user = { id: docRef.id, ...newUser };

      // Also create a record in doctors or patients collection
      if (role === "doctor") {
        await addDoc(collection(db, "doctors"), {
          userId: user.id,
          name: user.name,
          specialty: specialty || "General",
          image: user.image,
          phone: user.phone,
          bio: bio || "",
          experience: experience || "",
          education: education || "",
          availability: availability || {
            weekdays: "9:00 AM - 5:00 PM",
            saturday: "9:00 AM - 1:00 PM"
          },
          rating: 0,
          ratingCount: 0
        });
      } else {
        await addDoc(collection(db, "patients"), {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image
        });
      }

      // Store user id as the "session token"
      localStorage.setItem("token", String(user.id));
      return user;
    } catch (error) {
      throw new Error(
        error.message || "Registration failed. Please try again."
      );
    }
  },

  updateUser: async (id, data) => {
    const ref = doc(db, "users", id);
    await updateDoc(ref, data);

    // Update corresponding doctor or patient record
    if (data.role === "doctor") {
      const q = query(collection(db, "doctors"), where("userId", "==", id));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        await updateDoc(doc(db, "doctors", docId), {
          name: data.name,
          specialty: data.specialty || "General",
          image: data.image || "",
          phone: data.phone || ""
        });
      }
    } else {
      const q = query(collection(db, "patients"), where("userId", "==", id));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        await updateDoc(doc(db, "patients", docId), {
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          image: data.image || ""
        });
      }
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  // Get current user from Firestore using stored id
  getMe: async () => {
    const userId = localStorage.getItem("token");
    if (!userId) throw new Error("Not authenticated");

    try {
      const docSnap = await getDoc(doc(db, "users", userId));
      if (!docSnap.exists()) throw new Error("User not found");
      return { id: docSnap.id, ...docSnap.data() };
    } catch {
      throw new Error("Failed to get user info");
    }
  },

  getCurrentUser: async () => {
    const userId = localStorage.getItem("token");
    if (!userId) return null;
    try {
      const docSnap = await getDoc(doc(db, "users", userId));
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() };
    } catch {
      return null;
    }
  },
};

export default authApi;
