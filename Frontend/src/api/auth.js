import { apiFetch } from './client.js';

export async function signIn(username, password, role) {
  return apiFetch('/auth/signin', { method: 'POST', body: JSON.stringify({ username, password, role }) });
}

export async function signUp(data) {
  return apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(data) });
}

export async function getAccounts() {
  return apiFetch('/admin/users');
}

export async function disableAccount(username) {
  return apiFetch(`/admin/users/${encodeURIComponent(username)}/toggle-disable`, { method: 'PATCH' });
}

export async function getProfile() {
  return apiFetch('/auth/me');
}

export async function updateProfile(data) {
  return apiFetch('/auth/me/update', { method: 'PATCH', body: JSON.stringify(data) });
}
