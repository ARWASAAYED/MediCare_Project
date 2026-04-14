import React from "react";
import { Calendar, Clock } from "lucide-react";

const DoctorDashboardAppointments = ({
  appointments,
  patients,
  getStatusColor,
  formatDate,
  onStatusUpdate,
}) => {
  // Separate appointments by status
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "scheduled" || !apt.status
  );
  const confirmedAppointments = appointments.filter(
    (apt) => apt.status === "confirmed"
  );
  const cancelledAppointments = appointments.filter(
    (apt) => apt.status === "cancelled"
  );

  const renderAppointment = (apt, showActions = false) => {
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
          {showActions && (
            <div className="flex gap-2">
              <button
                onClick={() => onStatusUpdate(apt.id, "confirmed")}
                className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm"
              >
                Confirm
              </button>
              <button
                onClick={() => onStatusUpdate(apt.id, "cancelled")}
                className="px-4 py-2 bg-red-100 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-200 transition-colors"
              >
                Cancel
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
  };

  return (
    <div className="space-y-6">
      {/* Pending Appointments Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-yellow-600" />
          Pending Appointments ({pendingAppointments.length})
        </h2>
        {pendingAppointments.length === 0 ? (
          <p className="text-gray-500 italic">No pending appointments.</p>
        ) : (
          <div className="space-y-4">
            {pendingAppointments.map((apt) => renderAppointment(apt, true))}
          </div>
        )}
      </div>

      {/* Confirmed Appointments Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-600" />
          Confirmed Appointments ({confirmedAppointments.length})
        </h2>
        {confirmedAppointments.length === 0 ? (
          <p className="text-gray-500 italic">No confirmed appointments.</p>
        ) : (
          <div className="space-y-4">
            {confirmedAppointments.map((apt) => renderAppointment(apt, false))}
          </div>
        )}
      </div>

      {/* Cancelled Appointments Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-red-600" />
          Cancelled Appointments ({cancelledAppointments.length})
        </h2>
        {cancelledAppointments.length === 0 ? (
          <p className="text-gray-500 italic">No cancelled appointments.</p>
        ) : (
          <div className="space-y-4">
            {cancelledAppointments.map((apt) => renderAppointment(apt, false))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboardAppointments;
