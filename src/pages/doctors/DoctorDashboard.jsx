import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doctorApi } from "../../api/doctorApi";
import { appointmentApi } from "../../api/appointmentApi";
import { patientApi } from "../../api/paitentApi";
import toast from "react-hot-toast";

// Reuse components
import DoctorDashboardAppointments from "../../components/doctors/DoctorDashboardAppointments";
import DoctorPatientsList from "../../components/doctors/DoctorPatientsList";

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        if (!user) return;
        
        // 1. Find Doctor profile for this User
        const allDoctors = await doctorApi.getAll();
        const currentDoctor = allDoctors.find(d => d.userId === user.id); // Assuming userId links them

        if (!currentDoctor) {
          toast.error("Doctor profile not found.");
          setLoading(false);
          return;
        }

        setDoctor(currentDoctor);

        // 2. Fetch Appointments & Patients
        const [appointmentsData, allPatientsData] = await Promise.all([
          appointmentApi.getByDoctorId(currentDoctor.id),
          patientApi.getAll(),
        ]);

        setAppointments(appointmentsData);

        // Filter patients
        const patientIds = new Set(appointmentsData.map((apt) => apt.patientId));
        const doctorPatients = allPatientsData.filter((p) =>
          patientIds.has(p.userId)
        );
        setPatients(doctorPatients);

      } catch (err) {
        console.error("Error loading dashboard:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [user]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const updatedApt = await appointmentApi.update(appointmentId, {
        ...appointments.find((a) => a.id === appointmentId),
        status: newStatus,
      });

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? updatedApt : apt))
      );
      toast.success(`Appointment ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update appointment status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  };

  if (loading) {
     return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
     return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="text-center">
             <p className="text-xl text-gray-700">Access Denied. You do not appear to be a registered doctor.</p>
         </div>
      </div>
     )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[oklch(0.77_0.18_186.55)]">
            Welcome, Dr. {doctor.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your appointments and patients
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
            <button
                onClick={() => setActiveTab("appointments")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "appointments"
                    ? "bg-brand-red text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
            >
                Appointments
            </button>
            <button
                onClick={() => setActiveTab("patients")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "patients"
                    ? "bg-brand-red text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
            >
                My Patients
            </button>
        </div>

        <div className="grid gap-6">
            {activeTab === "appointments" && (
                <DoctorDashboardAppointments
                    appointments={appointments}
                    patients={patients}
                    getStatusColor={getStatusColor}
                    formatDate={formatDate}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
            
            {activeTab === "patients" && (
                <DoctorPatientsList 
                    patients={patients} 
                    getInitials={getInitials} 
                />
            )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
