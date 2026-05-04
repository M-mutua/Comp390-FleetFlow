/**
 * ProtectedRoute Component
 * A wrapper for routes that require authentication and specific user roles.
 */
import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken } from "../api/client";
import { getCurrentSessionRole, getDashboardRouteForRole } from "../lib/session";

export default function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  const token = getAuthToken();

  // Redirect to login if no token is found
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const currentRole = getCurrentSessionRole();
  // Redirect to landing if role cannot be determined
  if (!currentRole) {
    return <Navigate to="/" replace />;
  }

  // Allow access if the user's role is in the allowedRoles list
  if (allowedRoles.includes(currentRole)) {
    return children;
  }

  // Redirect to the user's appropriate dashboard if they lack permission for this specific route
  return <Navigate to={getDashboardRouteForRole(currentRole)} replace />;
}
