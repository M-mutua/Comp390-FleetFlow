/**
 * Session and Role Management
 * Handles JWT decoding, role normalization, and dashboard route mapping.
 */
import { jwtDecode } from "jwt-decode";
import { clearAuthToken, getAuthRole, getAuthToken } from "../api/client";

// Maps system roles to their respective dashboard base routes
const roleToRoute = {
  ADMIN: "/dashboard/admin",
  DEAN: "/dashboard/department_dean",
  STAFF: "/dashboard/operations_staff",
  TRANSPORT_MANAGER: "/dashboard/transport_manager",
  DRIVER: "/dashboard/fleet_driver",
};

/**
 * Normalizes role extraction from various JWT claim structures (e.g., .role, .authority, .roles[]).
 */
function normalizeRoleFromToken(decodedToken) {
  if (!decodedToken || typeof decodedToken !== "object") return null;

  // Handle direct role/authority properties
  const directRole = decodedToken.role || decodedToken.authority;
  if (typeof directRole === "string" && directRole.trim()) {
    return directRole.trim();
  }

  // Handle nested roles/authorities arrays
  const roles = decodedToken.roles || decodedToken.authorities;
  if (Array.isArray(roles) && roles.length > 0) {
    const firstRole = roles[0];
    if (typeof firstRole === "string") return firstRole;
    if (firstRole && typeof firstRole.authority === "string") {
      return firstRole.authority;
    }
  }

  return null;
}

/**
 * Decodes the current JWT and extracts the user's role, stripping any 'ROLE_' prefix.
 */
export function getCurrentTokenRole() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const rawRole = normalizeRoleFromToken(decoded);
    if (!rawRole) return null;
    return rawRole.startsWith("ROLE_") ? rawRole.replace("ROLE_", "") : rawRole;
  } catch {
    return null;
  }
}

/**
 * Retrieves the current user role, prioritizing the stored role over the token-derived one.
 */
export function getCurrentSessionRole() {
  const storedRole = getAuthRole();
  if (storedRole && storedRole.trim()) return storedRole.trim();
  return getCurrentTokenRole();
}

/**
 * Returns the dashboard URL for a given role.
 */
export function getDashboardRouteForRole(role) {
  return roleToRoute[role] || "/";
}

export function clearSession() {
  clearAuthToken();
}
