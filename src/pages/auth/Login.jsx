// src/components/auth/Login.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { setLoading, loginSuccess, loginFailure } from "../../store/authSlice";
import { authApi } from "../../api/authApi";
import AuthHeader from "../../components/ui/AuthHeader";
import InputWithIcon from "../../components/ui/InputWithIcon";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const validateField = (name, value) => {
    switch (name) {
      case "identifier": {
        if (!value.trim()) return "Email or username is required";
        // Basic email check if it contains @
        if (value.includes("@")) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return "Please enter a valid email address";
        }
        return "";
      }
      case "password": {
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      }
      default:
        return "";
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const value = name === "identifier" ? identifier : password;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (name, value) => {
    if (name === "identifier") setIdentifier(value);
    else setPassword(value);

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const validateAll = () => {
    const newErrors = {
      identifier: validateField("identifier", identifier),
      password: validateField("password", password),
    };
    setErrors(newErrors);
    setTouched({ identifier: true, password: true });
    return !newErrors.identifier && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    dispatch(setLoading(true));

    try {
      const user = await authApi.login(identifier, password);
      const token = localStorage.getItem("token");
      dispatch(loginSuccess({ user, token }));
      toast.success("Welcome back!");
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      dispatch(loginFailure(err.message));
      toast.error(err.message);
    }
  };

  const hasError = (name) => touched[name] && errors[name];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-200 to-indigo-100 flex items-center justify-center px-4 py-8 pt-20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <AuthHeader subtitle="Sign In" />

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email or Username
              </label>
              <InputWithIcon
                Icon={Mail}
                value={identifier}
                onChange={(e) => handleChange("identifier", e.target.value)}
                onBlur={() => handleBlur("identifier")}
                placeholder="your@email.com"
                autoComplete="username"
                error={hasError("identifier")}
              />
              {hasError("identifier") && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  {errors.identifier}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <InputWithIcon
                  Icon={Lock}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder="••••••"
                  autoComplete="current-password"
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
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[oklch(0.77_0.18_186.55)] text-white py-2.5 rounded-lg hover:bg-[oklch(0.75_0.18_186.55)] font-semibold disabled:opacity-50 transition mt-5"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-4">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-[oklch(0.77_0.18_186.55)] font-semibold hover:text-[oklch(0.75_0.18_186.55)]"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
