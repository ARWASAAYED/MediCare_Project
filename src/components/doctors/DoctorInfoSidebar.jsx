import React from "react";
import { Star, Stethoscope, Phone, Calendar } from "lucide-react";
import Button from "../common/Button";

const DoctorInfoSidebar = ({ doctor, getInitials, onBookAppointment, isOwner }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-6">
      <div className="h-96 bg-gray-100 relative overflow-hidden">
        {doctor.image ? (
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              width="200"
              height="200"
              viewBox="0 0 160 160"
              className="opacity-50"
            >
              <rect
                x="20"
                y="20"
                width="120"
                height="120"
                rx="24"
                fill="currentColor"
              />
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                fill="currentColor"
                fontSize="48"
                fontWeight="700"
                fontFamily="Inter, system-ui"
              >
                {getInitials(doctor.name)}
              </text>
            </svg>
          </div>
        )}
      </div>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {doctor.name.startsWith("Dr.") ? doctor.name : `Dr. ${doctor.name}`}
        </h1>
        <p className="text-brand-red font-semibold text-lg mb-4">
          {doctor.specialty || "General Practice"}
        </p>

        <div className="flex items-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(doctor.rating || 0)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-gray-600 ml-2 font-semibold">
            {doctor.rating ? doctor.rating.toFixed(1) : "N/A"}
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 text-gray-600">
            <Stethoscope className="w-5 h-5 text-brand-red" />
            <span className="font-medium">Specialty</span>
            <span className="ml-auto">{doctor.specialty}</span>
          </div>
          {doctor.phone && (
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-5 h-5 text-brand-red" />
              <span className="font-medium">Phone</span>
              <span className="ml-auto">{doctor.phone}</span>
            </div>
          )}
        </div>

        {isOwner ? (
          <div className="bg-gray-100 text-gray-600 text-center py-3 rounded-lg font-semibold border border-gray-200">
            This is your profile
          </div>
        ) : (
          <Button
            onClick={onBookAppointment}
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Book Appointment
          </Button>
        )}
      </div>
    </div>
  );
};

export default DoctorInfoSidebar;
