/**
 * Thin HTTP client for the ILES Django backend.
 *
 * VITE_API_BASE_URL should be set in .env.local for development.
 * In production it defaults to /api (served from the same host).
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

/** Read the stored JWT from session (set by AuthContext on login). */
function getToken() {
  try {
    const raw = localStorage.getItem('iles_f2_session');
    if (!raw) return null;
    const { token } = JSON.parse(raw);
    return token ?? null;
  } catch {
    return null;
  }
}

/**
 * Wrapper around fetch() that:
 * - prepends BASE_URL
 * - sets Content-Type: application/json
 * - attaches Bearer token if available
 * - throws an Error with the server's message on non-2xx responses
 *
 * @param {string} path  – path relative to BASE_URL, e.g. '/auth/signin'
 * @param {RequestInit} [options]
 * @returns {Promise<any>} – parsed JSON body (or null for 204)
 */
export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) return null;

  let body;
  try {
    body = await res.json();
  } catch {
    body = {};
  }

  if (!res.ok) {
    throw new Error(body.message ?? body.detail ?? `HTTP ${res.status}`);
  }

  return body;
}
