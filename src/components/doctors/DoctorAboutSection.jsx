import React from "react";
import { Award, CheckCircle2, Clock } from "lucide-react";

const DoctorAboutSection = ({ doctor }) => {
  return (
    <div className="space-y-6">
      {/* About Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          About Dr. {doctor.name.split(" ").pop()}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {doctor.bio ||
            `Dr. ${doctor.name} is a highly experienced ${doctor.specialty} specialist with a commitment to providing exceptional patient care. With years of experience in the field, Dr. ${doctor.name} brings expertise and compassion to every consultation.`}
        </p>
      </div>

      {/* Qualifications */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-brand-red" />
          Qualifications & Experience
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">
                {doctor.education ? doctor.education : `Board Certified in ${doctor.specialty}`}
              </p>
              <p className="text-gray-600 text-sm">
                Certified Medical Professional
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">
                {doctor.experience ? `${doctor.experience} Years of Experience` : "Years of Experience"}
              </p>
              <p className="text-gray-600 text-sm">
                Extensive experience in {doctor.specialty}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">
                Patient Care Excellence
              </p>
              <p className="text-gray-600 text-sm">
                Dedicated to providing personalized healthcare
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-brand-red" />
          Availability
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctor.availability && Object.keys(doctor.availability).length > 0 ? (
            Object.entries(doctor.availability).map(([day, time]) => (
              <div key={day} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1 capitalize">
                  {day === "weekdays" ? "Monday - Friday" : day}
                </p>
                <p className="text-gray-600">{time}</p>
              </div>
            ))
          ) : (
            <>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">
                  Monday - Friday
                </p>
                <p className="text-gray-600">9:00 AM - 5:00 PM</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">Saturday</p>
                <p className="text-gray-600">9:00 AM - 1:00 PM</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAboutSection;
