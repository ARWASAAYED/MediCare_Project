import React from "react";
import { Users, Stethoscope } from "lucide-react";

const RoleToggle = ({ role, setRole }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => setRole("patient")}
        className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition ${
          role === "patient"
            ? "border-brand-red bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <Users className="w-5 h-5 text-brand-red" />
        <span className="text-xs font-semibold">Patient</span>
      </button>
      <button
        type="button"
        onClick={() => setRole("doctor")}
        className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition ${
          role === "doctor"
            ? "border-brand-red bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <Stethoscope className="w-5 h-5 text-brand-red" />
        <span className="text-xs font-semibold">Doctor</span>
      </button>
    </div>
  );
};

export default RoleToggle;
