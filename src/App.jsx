import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { loginSuccess, logout } from "./store/authSlice";
import { authApi } from "./api/authApi";
import "./App.css";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import PatientDashboard from "./pages/patient/PatientDashboard.jsx";
import DoctorDashboard from "./pages/doctors/DoctorDashboard.jsx";
import DoctorsPage from "./pages/doctors/DoctorsPage.jsx";
import DoctorDetails from "./pages/doctors/DoctorDetails.jsx";
import Contact from "./pages/Contact.jsx";
import Footer from "./components/layout/Footer.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import About from "./pages/About.jsx";
import ServicesPage from "./components/Services.jsx";



function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);

  useEffect(() => {
    // Attempt to restore user if token exists but user is null
    const restoreUser = async () => {
      if (token && !user) {
        try {
          const userData = await authApi.getMe();
          dispatch(loginSuccess({ user: userData, token }));
        } catch (error) {
          console.error("Failed to restore session:", error);
          dispatch(logout());
        }
      }
    };

    restoreUser();
  }, [dispatch, token, user]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesPage />} />

        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
