import React from "react";
import { Heart } from "lucide-react";

const AuthHeader = ({ title = "MediCare", subtitle }) => {
  return (
    <div className="bg-linear-to-r rom-brand-red to-[oklch(0.75_0.18_186.55)] font-semibold px-8 py-6">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Heart className="w-8 h-8 text-white fill-white" />
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
      {subtitle ? (
        <p className="text-red-100 text-center text-sm">{subtitle}</p>
      ) : null}
    </div>
  );
};

export default AuthHeader;
