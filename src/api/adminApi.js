// src/api/adminApi.js
import { db } from "./firebase";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  addDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

export const adminApi = {
  // Get dashboard statistics
  getStats: async () => {
    const [usersSnap, doctorsSnap, patientsSnap, appointmentsSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "doctors")),
      getDocs(collection(db, "patients")),
      getDocs(collection(db, "appointments")),
    ]);

    const appointments = appointmentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const today = new Date().toISOString().split("T")[0];
    const todayAppointments = appointments.filter(a => a.date === today);
    const scheduledCount = appointments.filter(a => a.status === "scheduled").length;
    const confirmedCount = appointments.filter(a => a.status === "confirmed").length;
    const cancelledCount = appointments.filter(a => a.status === "cancelled").length;

    return {
      totalUsers: usersSnap.size,
      totalDoctors: doctorsSnap.size,
      totalPatients: patientsSnap.size,
      totalAppointments: appointmentsSnap.size,
      todayAppointments: todayAppointments.length,
      scheduledCount,
      confirmedCount,
      cancelledCount,
    };
  },

  // Get all users
  getAllUsers: async () => {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  // Delete a user and their associated doctor/patient record
  deleteUser: async (userId, role) => {
    // Delete from users collection
    await deleteDoc(doc(db, "users", userId));

    // Delete associated role-specific record
    if (role === "doctor") {
      const q = query(collection(db, "doctors"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      for (const docSnap of snapshot.docs) {
        await deleteDoc(doc(db, "doctors", docSnap.id));
      }
    } else if (role === "patient") {
      const q = query(collection(db, "patients"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      for (const docSnap of snapshot.docs) {
        await deleteDoc(doc(db, "patients", docSnap.id));
      }
    }
  },

  // Update user role
  updateUserRole: async (userId, newRole) => {
    const ref = doc(db, "users", userId);
    await updateDoc(ref, { role: newRole });
    const updated = await getDoc(ref);
    return { id: updated.id, ...updated.data() };
  },

  // Get all appointments with doctor/patient info
  getAllAppointments: async () => {
    const [appointmentsSnap, doctorsSnap, patientsSnap] = await Promise.all([
      getDocs(collection(db, "appointments")),
      getDocs(collection(db, "doctors")),
      getDocs(collection(db, "patients")),
    ]);

    const doctors = {};
    doctorsSnap.docs.forEach(d => {
      const data = d.data();
      doctors[d.id] = { id: d.id, ...data };
    });

    const patients = {};
    patientsSnap.docs.forEach(d => {
      const data = d.data();
      // Map by userId for lookup
      patients[data.userId] = { id: d.id, ...data };
    });

    return appointmentsSnap.docs.map(d => {
      const data = { id: d.id, ...d.data() };
      data.doctorName = doctors[data.doctorId]?.name || "Unknown";
      data.doctorSpecialty = doctors[data.doctorId]?.specialty || "";
      data.patientName = patients[data.patientId]?.name || "Unknown";
      return data;
    });
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    await deleteDoc(doc(db, "appointments", id));
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status) => {
    const ref = doc(db, "appointments", id);
    await updateDoc(ref, { status });
    const updated = await getDoc(ref);
    return { id: updated.id, ...updated.data() };
  },

  // ===== SPECIALTY (SERVICES) CRUD =====

  // Get all specialties
  getSpecialties: async () => {
    const snapshot = await getDocs(collection(db, "services"));
    return snapshot.docs.map(d => ({ 
      id: d.id, 
      ...d.data(), 
      name: d.data().title || d.data().name 
    }));
  },

  // Add a new specialty
  addSpecialty: async (name) => {
    // Check if it already exists (case-insensitive)
    const snapshot = await getDocs(collection(db, "services"));
    const exists = snapshot.docs.some(
      d => (d.data().title || d.data().name || "").toLowerCase() === name.toLowerCase()
    );
    if (exists) throw new Error("Specialty/Service already exists");

    const docRef = await addDoc(collection(db, "services"), {
      name: name,
      title: name,
      description: `Comprehensive care and expert treatment for ${name}.`,
      icon: "Stethoscope",
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, name, title: name };
  },

  // Update a specialty name
  updateSpecialty: async (id, newName) => {
    // Check for duplicates (exclude current)
    const snapshot = await getDocs(collection(db, "services"));
    const exists = snapshot.docs.some(
      d => d.id !== id && (d.data().title || d.data().name || "").toLowerCase() === newName.toLowerCase()
    );
    if (exists) throw new Error("A specialty/service with this name already exists");

    const ref = doc(db, "services", id);
    await updateDoc(ref, { name: newName, title: newName });
    return { id, name: newName, title: newName };
  },

  // Delete a specialty
  deleteSpecialty: async (id) => {
    await deleteDoc(doc(db, "services", id));
  },
};
