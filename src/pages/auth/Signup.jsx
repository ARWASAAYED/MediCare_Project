import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, AlertCircle, Phone } from "lucide-react";
import toast from "react-hot-toast";
import AuthHeader from "../../components/ui/AuthHeader";
import InputWithIcon from "../../components/ui/InputWithIcon";
import RoleToggle from "../../components/ui/RoleToggle";
import { setLoading, loginSuccess, loginFailure } from "../../store/authSlice";
import { authApi } from "../../api/authApi";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "patient",
    specialty: "",
    userImage: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const valid =
    form.username.trim() &&
    form.email.trim() &&
    form.password.length >= 6 &&
    (form.role !== "doctor" || form.specialty.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    dispatch(setLoading(true));
    try {
      const user = await authApi.register(
        form.username,
        form.email,
        form.password,
        form.role,
        form.specialty,
        form.userImage,
        form.phone
      );
      dispatch(loginSuccess({ user, token: localStorage.getItem("token") }));
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      dispatch(loginFailure(err.message));
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8 pt-20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <AuthHeader subtitle="Create Account" />
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">I am a:</label>
              <RoleToggle
                role={form.role}
                setRole={(r) => setForm((p) => ({ ...p, role: r }))}
              />
            </div>
            {[
              { key: "username", label: "Full Name", Icon: User, placeholder: "Your name", autoComplete: "name" },
              { key: "email", label: "Email", Icon: Mail, type: "email", placeholder: "your@email.com", autoComplete: "email" },
              { key: "phone", label: "Phone", Icon: Phone, placeholder: "+1 555 555 5555", autoComplete: "tel" },
              { key: "password", label: "Password", Icon: Lock, type: "password", placeholder: "••••••", autoComplete: "new-password" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
                <InputWithIcon
                  Icon={f.Icon}
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  required={f.key !== "phone"}
                  autoComplete={f.autoComplete}
                />
              </div>
            ))}
            {form.role === "doctor" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Specialty</label>
                <select
                  value={form.specialty}
                  onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value }))}
                  className="w-full border rounded-md py-2 px-3"
                  required
                >
                  <option value="">Select specialty</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>General Surgery</option>
                  <option>Pediatrics</option>
                  <option>Dermatology</option>
                  <option>Orthopedics</option>
                  <option>Psychiatry</option>
                  <option>Urology</option>
                  <option>ENT (Ear, Nose, and Throat)</option>
                  <option>Opthalmology</option>
                  <option>Obstetrics and Gynecology</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setForm((p) => ({ ...p, userImage: ev.target?.result || "" }));
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !valid}
              className="w-full bg-[oklch(0.77_0.18_186.55)] text-white py-2.5 rounded-lg hover:bg-[oklch(0.75_0.18_186.55)] font-semibold disabled:opacity-50 transition mt-5"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>
          <p className="text-center text-gray-600 text-sm mt-4">
            Already registered?{' '}
            <a href="/login" className="text-[oklch(0.75_0.18_186.55)] font-semibold hover:text-[oklch(0.90_0.18_186.55)]">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
