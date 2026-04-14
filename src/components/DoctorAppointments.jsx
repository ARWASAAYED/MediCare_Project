import React, { useState, useEffect } from "react";
import { Calendar, Clock, Check, X, AlertCircle } from "lucide-react";
import { appointmentApi } from "../api/appointmentApi";
import { patientApi } from "../api/paitentApi";

const DoctorAppointments = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!doctorId) return;
      try {
        setLoading(true);
        const [apptsData, patientsData] = await Promise.all([
          appointmentApi.getByDoctorId(doctorId),
          patientApi.getAll(),
        ]);
        setAppointments(apptsData);
        setPatients(patientsData);
      } catch (err) {
        console.error("Error loading doctor data:", err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const appointmentToUpdate = appointments.find((a) => a.id === appointmentId);
      if (!appointmentToUpdate) return;

      const updatedApt = await appointmentApi.update(appointmentId, {
        ...appointmentToUpdate,
        status: newStatus,
      });

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? updatedApt : apt))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update appointment status. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
        <p className="mt-2 text-gray-500">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-brand-red" />
        Managed Appointments ({appointments.length})
      </h2>
      
      {appointments.length === 0 ? (
        <p className="text-gray-500 italic">No appointments scheduled.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => {
            const patient = patients.find((p) => p.userId === apt.patientId);
            return (
              <div
                key={apt.id}
                className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">
                        {patient ? patient.name : "Unknown Patient"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${getStatusColor(
                          apt.status
                        )}`}
                      >
                        {apt.status || "scheduled"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(apt.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {apt.time}
                      </span>
                    </div>
                  </div>
                  {(apt.status === "scheduled" || !apt.status) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(apt.id, "confirmed")}
                        className="px-3 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(apt.id, "cancelled")}
                        className="px-3 py-1.5 bg-red-100 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  )}
                </div>
                {apt.reason && (
                  <div className="text-sm bg-white p-3 rounded-lg border border-gray-200">
                    <span className="font-semibold text-gray-700">Reason:</span>{" "}
                    <span className="text-gray-600">{apt.reason}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
