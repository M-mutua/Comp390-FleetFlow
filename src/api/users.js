/**
 * User API Endpoints
 * Handles user-related operations including role updates and fetching user lists.
 */
import { apiRequest } from "./client";

/**
 * Updates a user's role.
 */
export function updateUserRole(userId, role) {
  return apiRequest(`/api/users/${userId}/role`, {
    method: "PATCH",
    auth: true,
    body: { role },
  });
}

/**
 * Lists users filtered by a specific role.
 */
export function listUsersByRole(role) {
  const query = role ? `?role=${encodeURIComponent(role)}` : "";
  return apiRequest(`/api/users${query}`, {
    method: "GET",
    auth: true,
  });
}

/**
 * Fetches details for a specific user by ID.
 */
export function getUserById(userId) {
  return apiRequest(`/api/users/${userId}`, {
    method: "GET",
    auth: true,
  });
}

/**
 * Fetches a list of drivers, employing multiple fallback endpoints to ensure compatibility
 * with different backend versions or configurations.
 */
export async function listDrivers() {
  const byRole = (user) => {
    const rawRole = String(user?.role || "").toUpperCase();
    return rawRole === "DRIVER" || rawRole === "ROLE_DRIVER";
  };

  const endpoints = [
    // Primary: Specific drivers endpoint
    () =>
      apiRequest("/api/users/drivers", {
        method: "GET",
        auth: true,
      }),
    // Secondary: Role-filtered user list
    () => listUsersByRole("DRIVER"),
    // Tertiary: All users (to be filtered client-side)
    () =>
      apiRequest("/api/users/all", {
        method: "GET",
        auth: true,
      }),
  ];

  let lastError = null;

  for (const load of endpoints) {
    try {
      const users = await load();
      if (!Array.isArray(users)) continue;
      
      const drivers = users.filter(byRole);
      // Return filtered drivers if found, or the raw response if it was already role-specific
      if (drivers.length > 0) return drivers;
      if (load === endpoints[0] || load === endpoints[1]) return users;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) throw lastError;
  return [];
}
