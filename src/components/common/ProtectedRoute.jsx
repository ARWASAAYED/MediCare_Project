import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Requires user to be logged in
export const ProtectedRoute = ({ children }) => {
  const { user, token } = useSelector((s) => s.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists but user hasn't loaded yet, show loading
  if (token && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[oklch(0.77_0.18_186.55)]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
};

// Requires user to have specific role(s)
export const RoleRoute = ({ children, roles }) => {
  const { user, token } = useSelector((s) => s.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (token && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[oklch(0.77_0.18_186.55)]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
