import React, { useState } from "react";
import { User, Save, Clock, BookOpen, Award, FileText } from "lucide-react";
import Button from "../common/Button";
import toast from "react-hot-toast";
import { doctorApi } from "../../api/doctorApi";

const DoctorProfileEdit = ({ doctor, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: doctor.bio || "",
    experience: doctor.experience || "",
    education: doctor.education || "",
    weekdays: doctor.availability?.weekdays || "9:00 AM - 5:00 PM",
    saturday: doctor.availability?.saturday || "9:00 AM - 1:00 PM",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = {
        bio: formData.bio,
        experience: formData.experience,
        education: formData.education,
        availability: {
          weekdays: formData.weekdays,
          saturday: formData.saturday,
        },
      };

      const updatedDoctor = await doctorApi.update(doctor.id, updateData);
      onUpdate(updatedDoctor); // callback to update parent state
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
        <div className="p-3 bg-brand-red/10 text-brand-red rounded-xl">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Professional Profile</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your public information and availability</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Bio Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-red" />
            About Me
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell patients about yourself, your approach to care, and your specialties..."
              className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">This will be displayed prominently on your public profile page.</p>
          </div>
        </div>

        {/* Qualifications Section */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-red" />
            Experience & Education
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 10"
                className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education / Degrees</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="e.g. MD, Harvard Medical School"
                className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Availability Section */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-red" />
            Working Hours
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monday - Friday</label>
              <input
                type="text"
                name="weekdays"
                value={formData.weekdays}
                onChange={handleChange}
                placeholder="e.g. 9:00 AM - 5:00 PM"
                className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saturday</label>
              <input
                type="text"
                name="saturday"
                value={formData.saturday}
                onChange={handleChange}
                placeholder="e.g. 9:00 AM - 1:00 PM or Closed"
                className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-8 border-t border-gray-100 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex items-center gap-2 px-8"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfileEdit;
