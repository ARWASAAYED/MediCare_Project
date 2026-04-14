import React from "react";
import { User, Camera, Stethoscope, Users } from "lucide-react";

const ProfileHeader = ({ user, image, onImageUpload }) => {
  return (
    <>
      <div className="flex justify-center -mt-16 mb-6">
        <label className="relative cursor-pointer">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-brand-red text-white p-2 rounded-full shadow-lg hover:bg-red-700">
            <Camera className="w-5 h-5" />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {user.name || user.username}
        </h1>
        <div className="flex items-center justify-center gap-2 text-brand-red font-semibold text-lg">
          {user.role === "doctor" ? (
            <>
              <Stethoscope className="w-5 h-5" />
              <span>Doctor</span>
            </>
          ) : (
            <>
              <Users className="w-5 h-5" />
              <span>Patient</span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
