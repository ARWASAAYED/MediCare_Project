import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000" });

async function run() {
  try {
    const ts = Date.now();
    const username = `testuser_${ts}`;
    const email = `testuser_${ts}@example.com`;
    const password = "testpass";
    const phone = `+1${String(ts).slice(-9)}`;
    const role = process.argv[2] || "doctor"; // pass 'patient' to test patient flow
    const specialty = role === "doctor" ? "Cardiology" : undefined;
    const image = ""; // no image by default; you can set a base64 data URL here

    console.log("Creating user:", { username, email, role, specialty });

    // Create user (JSON Server auto-assigns id)
    const createUserRes = await api.post("/users", {
      username,
      email,
      password,
      phone,
      role,
      name: username,
      image,
    });

    const user = createUserRes.data;
    console.log("User created:", user);

    // Mirror into role collection like the frontend does
    if (role === "doctor") {
      const createDoctorRes = await api.post("/doctors", {
        userId: user.id,
        name: user.name,
        phone: user.phone || phone || "",
        specialty: specialty || "General",
        rating: 0,
        image: user.image || "",
      });
      console.log("Doctor record created:", createDoctorRes.data);
    } else {
      const createPatientRes = await api.post("/patients", {
        userId: user.id,
        name: user.name,
        phone: user.phone || phone || "",
        image: user.image || "",
      });
      console.log("Patient record created:", createPatientRes.data);
    }

    // Verify
    const listRes = await api.get(role === "doctor" ? "/doctors" : "/patients");
    const found = listRes.data.find((r) => r.userId === user.id);
    if (found) {
      console.log(
        `SUCCESS: Found mirrored ${role} record for userId=${user.id}`
      );
      process.exit(0);
    } else {
      console.error(
        `FAIL: No mirrored ${role} record found for userId=${user.id}`
      );
      process.exit(2);
    }
  } catch (err) {
    console.error("Test failed:", err.response?.data || err.message || err);
    process.exit(1);
  }
}

run();
