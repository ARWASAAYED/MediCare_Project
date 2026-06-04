import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { X, Calendar, Clock, User, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { appointmentApi } from "../api/appointmentApi";
import { doctorApi } from "../api/doctorApi";

const AppointmentBooking = ({ doctorId, doctorName, onClose, onSuccess }) => {
  const { user } = useSelector((s) => s.auth);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: doctorId || "",
    date: "",
    time: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorApi.getAll();
        setDoctors(data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (formData.doctorId && formData.date) {
        try {
          const appointments = await appointmentApi.checkAvailability(
            formData.doctorId,
            formData.date
          );
          setBookedSlots(appointments.map((apt) => apt.time));
        } catch (err) {
          console.error("Error fetching booked slots:", err);
        }
      } else {
        setBookedSlots([]);
      }
    };
    fetchBookedSlots();
  }, [formData.doctorId, formData.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!user) {
      setError("Please login to book an appointment");
      setLoading(false);
      return;
    }

    if (user.role === 'doctor') {
      const selfDoctor = doctors.find(d => d.userId === user.id);
      if (selfDoctor && formData.doctorId === selfDoctor.id) {
        setError("Doctors cannot book appointments with themselves");
        setLoading(false);
        return;
      }
    }

    if (!formData.doctorId || !formData.date || !formData.time) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (bookedSlots.includes(formData.time)) {
      setError("This time slot is already booked. Please choose another.");
      setLoading(false);
      return;
    }

    try {
      const patientId = user.id;

      const appointmentData = {
        patientId: patientId.toString(),
        doctorId: formData.doctorId.toString(),
        date: formData.date,
        time: formData.time,
        reason: formData.reason || "General Consultation",
        notes: formData.notes || "",
        status: "scheduled",
      };

      await appointmentApi.create(appointmentData);
      setSuccess(true);
      toast.success("Appointment booked successfully!");

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to book appointment. Please try again.");
      toast.error(err.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeSlots.push(time);
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Appointment Booked!
            </h3>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully scheduled.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-brand-red text-white py-3 rounded-xl hover:opacity-90 transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Book Appointment
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-semibold">Login Required</p>
              <p className="text-yellow-700 text-sm">
                Please login to book an appointment.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Select Doctor {doctorId ? "(Pre-selected)" : "*"}
            </label>
            <select
              value={formData.doctorId}
              onChange={(e) =>
                setFormData({ ...formData, doctorId: e.target.value })
              }
              disabled={!!doctorId}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Choose a doctor...</option>
              {doctors
                .filter((doctor) => !(user?.role === 'doctor' && doctor.userId === user?.id))
                .map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              min={today}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Time *
            </label>
            {!formData.date ? (
              <p className="text-sm text-gray-500 italic">
                Please select a date first
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                  const isBooked = bookedSlots.includes(time);
                  const isSelected = formData.time === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setFormData({ ...formData, time })}
                      className={`
                        py-2 text-sm font-medium rounded-lg transition-all
                        ${
                          isBooked
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed decoration-slice"
                            : isSelected
                            ? "bg-[oklch(0.77_0.18_186.55)] text-white shadow-md ring-2 ring-[oklch(0.77_0.18_186.55)]  ring-offset-1"
                            : "bg-white border border-gray-300 text-gray-700 hover:border-[oklch(0.77_0.18_186.55)] hover:text-[oklch(0.77_0.18_186.55)]"
                        }
                      `}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Reason for Visit
            </label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              placeholder="e.g., Regular checkup, Consultation, Follow-up"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[oklch(0.77_0.18_186.55)] focus:border-transparent"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Any additional information..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-[oklch(0.77_0.18_186.55)] rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !user || !formData.time}
              className="flex-1 px-6 py-3 bg-[oklch(0.77_0.18_186.55)] text-white rounded-xl hover:opacity-90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBooking;

