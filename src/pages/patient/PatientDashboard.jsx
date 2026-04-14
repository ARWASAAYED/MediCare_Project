import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { appointmentApi } from "../../api/appointmentApi";
import { doctorApi } from "../../api/doctorApi";
import { reviewApi } from "../../api/reviewApi";
import { Calendar, Clock, User, XCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import ReviewModal from "../../components/ReviewModal";

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [userAppointments, allDoctors] = await Promise.all([
          appointmentApi.getByPatientId(user.id),
          doctorApi.getAll(),
        ]);

        // Create a doctor look-up map
        const doctorMap = {};
        allDoctors.forEach((doc) => {
          doctorMap[doc.id] = doc;
        });

        setAppointments(userAppointments);
        setDoctors(doctorMap);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const appointmentToCancel = appointments.find(
        (a) => a.id === appointmentId
      );
      if (!appointmentToCancel) return;

      const updatedAppointment = { ...appointmentToCancel, status: "cancelled" };
      await appointmentApi.update(appointmentId, updatedAppointment);

      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? updatedAppointment : a))
      );
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  const handleOpenReview = (appointment) => {
    setSelectedAppointment(appointment);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      const doctorId = selectedAppointment.doctorId;
      
      await reviewApi.create({
        ...reviewData,
        doctorId: doctorId.toString(),
        patientId: user.id.toString(),
        patientName: user.name,
        appointmentId: selectedAppointment.id,
        date: new Date().toISOString(),
      });

      // Optionally update local state if we want to show it's rated
      // For now, just close and toast
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    return appointments
      .filter((apt) => {
        if (activeTab === "upcoming") {
          return (
            apt.status !== "cancelled" &&
            apt.status !== "completed" &&
            apt.date >= todayStr
          );
        } else {
          // Past or Cancelled
          return (
            apt.status === "cancelled" ||
            apt.status === "completed" ||
            apt.date < todayStr
          );
        }
      })
      .sort((a, b) => {
        // Sort upcoming by date ascending, past by date descending
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return activeTab === "upcoming" ? dateA - dateB : dateB - dateA;
      });
  };

  const filteredAppointments = getFilteredAppointments();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[oklch(0.77_0.18_186.55)]">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your appointments and health history
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 py-4 text-center font-semibold transition-colors ${
                activeTab === "upcoming"
                  ? "text-brand-red border-b-2 border-brand-red bg-red-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Upcoming Appointments
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-4 text-center font-semibold transition-colors ${
                activeTab === "history"
                  ? "text-brand-red border-b-2 border-brand-red bg-red-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Appointment History
            </button>
          </div>

          <div className="p-6">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => {
                  const doctor = doctors[apt.doctorId];
                  return (
                    <div
                      key={apt.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {doctor?.image ? (
                            <img
                              src={doctor.image}
                              alt={doctor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            Dr. {doctor?.name || "Unknown Doctor"}
                          </h3>
                          <p className="text-brand-red text-sm font-medium">
                            {doctor?.specialty || "Specialist"}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(apt.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {apt.time}
                            </span>
                          </div>
                          {apt.status === "cancelled" && (
                            <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                              <XCircle className="w-3 h-3" /> Cancelled
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-full md:w-auto mt-4 md:mt-0 space-y-2">
                        {activeTab === "upcoming" && apt.status !== "cancelled" && (
                          <Button
                            onClick={() => handleCancelAppointment(apt.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 w-full"
                          >
                            Cancel
                          </Button>
                        )}
                         {activeTab === "history" && apt.status !== "cancelled" && (
                          <Button
                            onClick={() => handleOpenReview(apt)}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Rate & Review
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
       <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
        doctorName={doctors[selectedAppointment?.doctorId]?.name}
      />
    </div>
  );
};

export default PatientDashboard;
