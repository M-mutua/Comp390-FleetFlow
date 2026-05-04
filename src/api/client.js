/**
 * API Client Configuration and Utilities
 * Provides a central location for API base URL, storage keys, and error handling.
 */
const configuredBase = (import.meta.env.VITE_API_BASE_URL || "")
  .trim()
  .replace(/\/$/, "");
const API_BASE =
  configuredBase || (import.meta.env.DEV ? "http://localhost:8080" : "");

const TOKEN_STORAGE_KEY = "token";
const ROLE_STORAGE_KEY = "role";

/**
 * Custom Error class for API-related failures.
 */
export class ApiError extends Error {
  constructor(status, message, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function getResponseContentType(response) {
  return response.headers.get("content-type") || "";
}

/**
 * Parses the response body based on its content type.
 */
async function parseResponseBody(response) {
  const contentType = getResponseContentType(response);
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

/**
 * Extracts a human-readable error message from the API payload.
 */
function toErrorMessage(payload, fallback) {
  if (typeof payload === "string" && payload.trim()) return payload;
  if (payload && typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }
  return fallback;
}

// Authentication Helpers
export function getAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function getAuthRole() {
  return localStorage.getItem(ROLE_STORAGE_KEY);
}

export function setAuthRole(role) {
  if (!role) return;
  localStorage.setItem(ROLE_STORAGE_KEY, role);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(ROLE_STORAGE_KEY);
}

/**
 * Core function for making authenticated and unauthenticated API requests.
 * @param {string} path - The endpoint path (e.g., '/auth/login').
 * @param {object} options - Fetch options, including method, body, and auth flag.
 */
export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    auth = false,
    token,
  } = options;

  const requestHeaders = { ...headers };

  if (body !== undefined && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  // Add Authorization header if 'auth' is true
  if (auth) {
    const authToken = token || getAuthToken();
    if (!authToken) {
      throw new ApiError(401, "Missing authentication token", null);
    }
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await parseResponseBody(response);

  // Handle non-2xx status codes
  if (!response.ok) {
    const message = toErrorMessage(payload, `Request failed (${response.status})`);
    throw new ApiError(response.status, message, payload);
  }

  return payload;
}
