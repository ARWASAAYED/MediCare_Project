import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import toast from "react-hot-toast";
import { doctorApi } from "../../api/doctorApi";
import { appointmentApi } from "../../api/appointmentApi";
import { patientApi } from "../../api/paitentApi";
import { reviewApi } from "../../api/reviewApi";
import AppointmentBooking from "../../components/AppointmentBooking";
import Button from "../../components/common/Button";
import ReviewModal from "../../components/ReviewModal";

// Imported Refactored Components
import DoctorInfoSidebar from "../../components/doctors/DoctorInfoSidebar";
import DoctorAboutSection from "../../components/doctors/DoctorAboutSection";
import DoctorDashboardAppointments from "../../components/doctors/DoctorDashboardAppointments";
import DoctorPatientsList from "../../components/doctors/DoctorPatientsList";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setError(null);
        const [doctorData, appointmentsData, allPatientsData, reviewsData] = await Promise.all([
          doctorApi.getById(id),
          appointmentApi.getByDoctorId(id),
          patientApi.getAll(),
          reviewApi.getByDoctorId(id),
        ]);

        setDoctor(doctorData);
        setAppointments(appointmentsData);
        setReviews(reviewsData);

        // Filter patients who have appointments with this doctor
        const patientIds = new Set(appointmentsData.map((apt) => apt.patientId));
        const doctorPatients = allPatientsData.filter((p) =>
          patientIds.has(p.userId)
        );
        setPatients(doctorPatients);
      } catch (err) {
        console.error("Error fetching doctor:", err);
        if (err.code === "ECONNREFUSED" || err.message.includes("Network Error")) {
          setError(
            "Cannot connect to server. Please make sure JSON Server is running."
          );
        } else {
          setError("Failed to load doctor details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctorData();
    }
  }, [id]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

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

  const handleSubmitReview = async (reviewData) => {
    try {
      await reviewApi.create({
        ...reviewData,
        doctorId: id.toString(),
        patientId: user.id.toString(),
        patientName: user.name || user.username,
        date: new Date().toISOString(),
      });

      // Refresh reviews
      const updatedReviews = await reviewApi.getByDoctorId(id);
      setReviews(updatedReviews);

      toast.success("Review submitted successfully!");
      setShowReviewModal(false);
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const isOwner = Boolean(user?.id && doctor?.userId && String(user.id) === String(doctor.userId));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
          <p className="mt-4 text-gray-600">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <p className="text-red-800 font-semibold mb-2">
            {error || "Doctor not found"}
          </p>
          <Button
            onClick={() => navigate("/doctors")}
            variant="primary"
            size="md"
            className="mt-4"
          >
            Back to Doctors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            onClick={() => navigate("/doctors")}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:border-brand-red hover:text-brand-red hover:bg-brand-red/5"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Doctors
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-1">
            <DoctorInfoSidebar
              doctor={doctor}
              getInitials={getInitials}
              onBookAppointment={() => setShowBookingModal(true)}
              isOwner={isOwner}
            />
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            <DoctorAboutSection doctor={doctor} />

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Patient Reviews
                </h2>
                {!isOwner && user && user.role === "patient" && (
                  <Button
                    onClick={() => setShowReviewModal(true)}
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Write Review
                  </Button>
                )}
              </div>
              {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, idx) => (
                    <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                         <span className="font-semibold text-gray-900">{review.patientName || "Anonymous"}</span>
                         <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <p className="text-gray-600 italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Appointments (Public View - only count) */}
            {!isOwner && appointments.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Recent Activity
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {appointments.length} appointment
                  {appointments.length !== 1 ? "s" : ""} scheduled
                </p>
              </div>
            )}

            {/* Appointments Management (Doctor Owner View) */}
            {isOwner && (
              <DoctorDashboardAppointments
                appointments={appointments}
                patients={patients}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
                onStatusUpdate={handleStatusUpdate}
              />
            )}

            {/* Patients List (Doctor Owner View) */}
            {isOwner && (
              <DoctorPatientsList patients={patients} getInitials={getInitials} />
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <AppointmentBooking
          doctorId={doctor.id}
          doctorName={doctor.name}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => setShowBookingModal(false)}
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
        doctorName={doctor?.name}
      />
    </div>
  );
};

export default DoctorDetails;

