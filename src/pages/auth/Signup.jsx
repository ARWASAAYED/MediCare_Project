import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, AlertCircle, Phone, Eye, EyeOff, Clock } from "lucide-react";
import toast from "react-hot-toast";
import AuthHeader from "../../components/ui/AuthHeader";
import InputWithIcon from "../../components/ui/InputWithIcon";
import RoleToggle from "../../components/ui/RoleToggle";
import { setLoading, loginSuccess, loginFailure } from "../../store/authSlice";
import { authApi } from "../../api/authApi";
import { adminApi } from "../../api/adminApi";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM",
];

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "patient",
    specialty: "",
    userImage: "",
    bio: "",
    experience: "",
    education: "",
    availability: {
      Monday: { enabled: true, from: "09:00 AM", to: "05:00 PM" },
      Tuesday: { enabled: true, from: "09:00 AM", to: "05:00 PM" },
      Wednesday: { enabled: true, from: "09:00 AM", to: "05:00 PM" },
      Thursday: { enabled: true, from: "09:00 AM", to: "05:00 PM" },
      Friday: { enabled: true, from: "09:00 AM", to: "05:00 PM" },
      Saturday: { enabled: false, from: "09:00 AM", to: "01:00 PM" },
      Sunday: { enabled: false, from: "", to: "" },
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [specialties, setSpecialties] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);

  // Fetch specialties from Firestore
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const list = await adminApi.getSpecialties();
        setSpecialties(list);
      } catch {
        // Fallback specialties
        setSpecialties([
          { id: "1", name: "Cardiology" },
          { id: "2", name: "Neurology" },
          { id: "3", name: "General Surgery" },
          { id: "4", name: "Pediatrics" },
          { id: "5", name: "Dermatology" },
        ]);
      }
    };
    fetchSpecialties();
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "username": {
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 3) return "Name must be at least 3 characters";
        return "";
      }
      case "email": {
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        return "";
      }
      case "phone": {
        if (value && !/^[\d+\-\s()]{7,15}$/.test(value)) return "Please enter a valid phone number";
        return "";
      }
      case "password": {
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      }
      case "specialty": {
        if (form.role === "doctor" && !value.trim()) return "Please select a specialty";
        return "";
      }
      default:
        return "";
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, form[name]) }));
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const validateAll = () => {
    const fields = ["username", "email", "password"];
    if (form.role === "doctor") fields.push("specialty");

    const newErrors = {};
    fields.forEach((f) => {
      newErrors[f] = validateField(f, form[f]);
    });

    if (form.phone) {
      newErrors.phone = validateField("phone", form.phone);
    }

    setErrors(newErrors);
    setTouched(
      fields.reduce((acc, f) => {
        acc[f] = true;
        return acc;
      }, {})
    );
    return !Object.values(newErrors).some(Boolean);
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          enabled: !prev.availability[day].enabled,
        },
      },
    }));
  };

  const setDayTime = (day, field, value) => {
    setForm((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: { ...prev.availability[day], [field]: value },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }
    dispatch(setLoading(true));
    try {
      // Build availability object (only enabled days)
      const availability = {};
      if (form.role === "doctor") {
        DAYS.forEach((day) => {
          if (form.availability[day].enabled) {
            availability[day] = `${form.availability[day].from} - ${form.availability[day].to}`;
          }
        });
      }

      const user = await authApi.register({
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        specialty: form.specialty,
        userImage: form.userImage,
        phone: form.phone,
        bio: form.bio,
        experience: form.experience,
        education: form.education,
        availability: form.role === "doctor" ? availability : undefined,
      });
      dispatch(loginSuccess({ user, token: localStorage.getItem("token") }));
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      dispatch(loginFailure(err.message));
      toast.error(err.message);
    }
  };

  const hasError = (name) => touched[name] && errors[name];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8 pt-20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <AuthHeader subtitle="Create Account" />
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Role Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">I am a:</label>
              <RoleToggle
                role={form.role}
                setRole={(r) => {
                  setForm((p) => ({ ...p, role: r }));
                  // Clear specialty error when switching away from doctor
                  if (r !== "doctor") {
                    setErrors((prev) => ({ ...prev, specialty: "" }));
                  }
                }}
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
              <InputWithIcon
                Icon={User}
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                onBlur={() => handleBlur("username")}
                placeholder="Your name"
                autoComplete="name"
                error={hasError("username")}
              />
              {hasError("username") && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
              <InputWithIcon
                Icon={Mail}
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="your@email.com"
                autoComplete="email"
                error={hasError("email")}
              />
              {hasError("email") && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <InputWithIcon
                Icon={Phone}
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="+1 555 555 5555"
                autoComplete="tel"
                error={hasError("phone")}
              />
              {hasError("phone") && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <InputWithIcon
                  Icon={Lock}
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder="••••••"
                  autoComplete="new-password"
                  error={hasError("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {hasError("password") && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>



            {/* Doctor-specific fields */}
            {form.role === "doctor" && (
              <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
                <h3 className="font-semibold text-gray-800">Professional Details</h3>

                {/* Specialty */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Specialty *
                  </label>
                  <select
                    value={form.specialty}
                    onChange={(e) => handleChange("specialty", e.target.value)}
                    onBlur={() => handleBlur("specialty")}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red"
                    required
                  >
                    <option value="">Select specialty</option>
                    {specialties.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {hasError("specialty") && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.specialty}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Short Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                    className="w-full border rounded-md py-2 px-3 resize-none border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red"
                    rows="2"
                    placeholder="Brief description about yourself"
                  />
                </div>

                {/* Experience & Education */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Years of Exp.
                    </label>
                    <input
                      type="number"
                      value={form.experience}
                      onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
                      className="w-full border rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red"
                      placeholder="e.g. 10"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Education/Degree
                    </label>
                    <input
                      type="text"
                      value={form.education}
                      onChange={(e) => setForm((p) => ({ ...p, education: e.target.value }))}
                      className="w-full border rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red"
                      placeholder="e.g. MD, Harvard"
                    />
                  </div>
                </div>

                {/* Availability Section */}
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-[oklch(0.77_0.18_186.55)]" />
                    <h3 className="font-semibold text-gray-800">Set Your Availability</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Choose which days and hours you are available for appointments.
                  </p>
                  <div className="space-y-2">
                    {DAYS.map((day) => (
                      <div
                        key={day}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                          form.availability[day].enabled
                            ? "border-[oklch(0.77_0.18_186.55)]/30 bg-[oklch(0.77_0.18_186.55)]/5"
                            : "border-gray-200 bg-gray-50 opacity-60"
                        }`}
                      >
                        <label className="flex items-center gap-2 cursor-pointer min-w-[110px]">
                          <input
                            type="checkbox"
                            checked={form.availability[day].enabled}
                            onChange={() => toggleDay(day)}
                            className="w-4 h-4 rounded accent-[oklch(0.77_0.18_186.55)]"
                          />
                          <span className="text-sm font-medium text-gray-700">{day}</span>
                        </label>
                        {form.availability[day].enabled && (
                          <div className="flex items-center gap-2 flex-1">
                            <select
                              value={form.availability[day].from}
                              onChange={(e) => setDayTime(day, "from", e.target.value)}
                              className="text-xs border border-gray-300 rounded-md py-1 px-2 flex-1 bg-white focus:outline-none focus:ring-1 focus:ring-[oklch(0.77_0.18_186.55)]"
                            >
                              {TIME_SLOTS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                            <span className="text-xs text-gray-400">to</span>
                            <select
                              value={form.availability[day].to}
                              onChange={(e) => setDayTime(day, "to", e.target.value)}
                              className="text-xs border border-gray-300 rounded-md py-1 px-2 flex-1 bg-white focus:outline-none focus:ring-1 focus:ring-[oklch(0.77_0.18_186.55)]"
                            >
                              {TIME_SLOTS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) =>
                      setForm((p) => ({ ...p, userImage: ev.target?.result || "" }));
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[oklch(0.77_0.18_186.55)]/10 file:text-[oklch(0.60_0.18_186.55)] hover:file:bg-[oklch(0.77_0.18_186.55)]/20 file:cursor-pointer file:transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[oklch(0.77_0.18_186.55)] text-white py-2.5 rounded-lg hover:bg-[oklch(0.75_0.18_186.55)] font-semibold disabled:opacity-50 transition mt-5"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>
          <p className="text-center text-gray-600 text-sm mt-4">
            Already registered?{" "}
            <a
              href="/login"
              className="text-[oklch(0.75_0.18_186.55)] font-semibold hover:text-[oklch(0.90_0.18_186.55)]"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
