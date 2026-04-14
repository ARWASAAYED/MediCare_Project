import React, { useState } from "react";
import { Mail, User, Save, X } from "lucide-react";
import { InputWithIcon } from "./index";

const ProfileForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save profile");
      onSave(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", icon: User },
    { name: "username", label: "Username", icon: User },
    { name: "email", label: "Email", icon: Mail, type: "email" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {fields.map((f) => (
        <div key={f.name}>
          <label className="block text-xs text-gray-600 font-semibold mb-1">
            {f.label}
          </label>
          <InputWithIcon
            Icon={f.icon}
            type={f.type || "text"}
            name={f.name}
            value={formData[f.name]}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
