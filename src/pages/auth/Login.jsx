 // src/components/auth/Login.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { setLoading, loginSuccess, loginFailure } from "../../store/authSlice";
import { authApi } from "../../api/authApi";
import AuthHeader from "../../components/ui/AuthHeader";
import InputWithIcon from "../../components/ui/InputWithIcon";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const user = await authApi.login(identifier, password);
      const token = localStorage.getItem("token");
      dispatch(loginSuccess({ user, token }));
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      dispatch(loginFailure(err.message));
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-200 to-indigo-100 flex items-center justify-center px-4 py-8 pt-20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <AuthHeader subtitle="Sign In" />

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email or Username
              </label>
              <InputWithIcon
                Icon={Mail}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <InputWithIcon
                Icon={Lock}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !identifier || !password}
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
