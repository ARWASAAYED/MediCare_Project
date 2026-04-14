import React from "react";
import { User, Phone } from "lucide-react";

const DoctorPatientsList = ({ patients, getInitials }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <User className="w-6 h-6 text-brand-red" />
        My Patients
      </h2>
      {patients.length === 0 ? (
        <p className="text-gray-500 italic">No patients yet.</p>
      ) : (
        <div className="grid gap-4">
          {patients.map((patient, idx) => (
            <div
              key={patient.id || idx}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red font-bold text-lg">
                {getInitials(patient.name)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{patient.name}</p>
                {patient.phone && (
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {patient.phone}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatientsList;
