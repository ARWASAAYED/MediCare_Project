import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Calendar, Clock, FileText, X, Star, User, AlertCircle } from "lucide-react";
import { appointmentApi } from "../api/appointmentApi";
import { doctorApi } from "../api/doctorApi";
import { reviewApi } from "../api/reviewApi";
import ReviewModal from "./ReviewModal";
import toast from "react-hot-toast";

const PatientAppointments = () => {
  const { user } = useSelector((s) => s.auth);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Rating State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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

      toast.success("Review submitted successfully!");
      setShowReviewModal(false);
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const [apptsData, doctorsData] = await Promise.all([
          appointmentApi.getByPatientId(user.id),
          doctorApi.getAll(),
        ]);

        // Map appointments with doctor information
        const appointmentsWithDoctors = apptsData.map((apt) => {
          const doctor = doctorsData.find((doc) => doc.id === apt.doctorId);
          return {
            ...apt,
            doctorName: doctor?.name || "Unknown Doctor",
            doctorSpecialty: doctor?.specialty || "N/A",
          };
        });

        // Sort by date and time (newest first)
        appointmentsWithDoctors.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateB - dateA;
        });

        setAppointments(appointmentsWithDoctors);
        setDoctors(doctorsData);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again.");
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

      const updatedApt = await appointmentApi.update(appointmentId, {
        ...appointmentToCancel,
        status: "cancelled",
      });

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? updatedApt : apt))
      );
      toast.success("Appointment cancelled successfully");
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
      toast.error("Failed to cancel appointment.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please login to view your appointments.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
        <p className="mt-4 text-gray-600">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
        <span className="text-sm text-gray-600">
          {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No appointments yet</p>
          <p className="text-gray-500 text-sm">
            Book your first appointment to get started!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-brand-red/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-brand-red" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        {appointment.doctorName}
                      </h3>
                      <p className="text-brand-red text-sm font-medium">
                        {appointment.doctorSpecialty}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  {appointment.reason && (
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">
                        <span className="font-semibold">Reason:</span>{" "}
                        {appointment.reason}
                      </span>
                    </div>
                  )}

                  {appointment.notes && (
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">
                        <span className="font-semibold">Notes:</span>{" "}
                        {appointment.notes}
                      </span>
                    </div>
                  )}
                   </div>
                   {/* Actions */}
                   <div className="flex justify-end pt-4 border-t border-gray-100 gap-2">
                     {appointment.status === "scheduled" && (
                       <button
                         onClick={() => handleCancelAppointment(appointment.id)}
                         className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                       >
                         Cancel Appointment
                       </button>
                     )}
                     {/* Show Review button if status is completed (or confirmed since users might mark it so in DB manually) */}
                     {(appointment.status === "completed" || appointment.status === "confirmed") && (
                        <button
                          onClick={() => handleOpenReview(appointment)}
                          className="px-4 py-2 bg-[oklch(0.73_0.18_186.55)] text-white rounded-lg text-sm font-semibold hover:bg-[oklch(0.77_0.18_186.55)] transition-colors flex items-center gap-1"
                        >
                          <Star className="w-4 h-4 fill-current" />
                          Rate & Review
                        </button>
                     )}
                   </div>
                </div>
            </div>
          ))}
        </div>
      )}

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
        doctorName={
          doctors.find((d) => d.id === selectedAppointment?.doctorId)?.name
        }
      />
    </div>
  );
};

export default PatientAppointments;
