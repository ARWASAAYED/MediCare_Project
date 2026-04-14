import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Heart,
  Mail,
  User,
  Stethoscope,
  LogOut,
  Clock,
  Edit,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  InfoCard,
  QuickStats,
  ProfileHeader,
  ProfileForm,
} from "../components/ui";

import { useNavigate } from "react-router-dom";
import { setUser } from "../store/authSlice";
import PatientAppointments from "../components/PatientAppointments";
import DoctorAppointments from "../components/DoctorAppointments";
import { doctorApi } from "../api/doctorApi";

const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [image, setImage] = useState(user?.image || "");
  const [isEditMode, setIsEditMode] = useState(false);
  const [doctorId, setDoctorId] = useState(null);

  React.useEffect(() => {
    const fetchDoctorId = async () => {
      if (user?.role === "doctor") {
        try {
          const doctors = await doctorApi.getAll();
          const doc = doctors.find((d) => d.userId === user.id);
          if (doc) setDoctorId(doc.id);
        } catch (err) {
          console.error("Failed to fetch doctor ID", err);
        }
      }
    };
    fetchDoctorId();
  }, [user]);


  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result;
        setImage(imageData);
        dispatch(setUser({ ...user, image: imageData }));
        localStorage.setItem("userImage", imageData);
        toast.success("Profile image updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
        <p className="text-gray-600">Please log in first</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4 pt-20">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="h-32 bg-linear-to-r from-brand-red to-[oklch(0.75_0.18_186.55)] font-semibold"></div>

          <div className="px-6 pb-6">
            <ProfileHeader
              user={user}
              image={image}
              onImageUpload={handleImageUpload}
            />

            {isEditMode ? (
              <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                <ProfileForm
                  user={user}
                  onSave={(updatedUser) => {
                    dispatch(setUser(updatedUser));
                    setIsEditMode(false);
                    toast.success("Profile updated successfully!");
                  }}
                  onCancel={() => setIsEditMode(false)}
                />
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <InfoCard Icon={Mail} label="EMAIL" value={user.email} />
                    <InfoCard
                      Icon={User}
                      label="USERNAME"
                      value={user.username}
                    />
                  </div>

                  <div className="space-y-4">
                    <InfoCard
                      Icon={Stethoscope}
                      label="ACCOUNT TYPE"
                      value={user.role}
                    />
                    <InfoCard
                      Icon={Clock}
                      label="MEMBER SINCE"
                      value={new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    />
                    <InfoCard
                      Icon={Heart}
                      label="STATUS"
                      value={
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600  font-semibold"
                  >
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                      toast.success("Logged out successfully");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[oklch(0.77_0.18_186.55)] text-white rounded-lg hover:bg-[oklch(0.75_0.18_186.55)] font-semibold"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>


        {/* Appointments Section */}
        {user?.role === "patient" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
            <div className="px-6 py-6">
              <PatientAppointments />
            </div>
          </div>
        )}

        {/* Doctor Appointments Section */}
        {user?.role === "doctor" && doctorId && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
             <div className="px-6 py-6">
                <DoctorAppointments doctorId={doctorId} />
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
