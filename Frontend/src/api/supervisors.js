import { apiFetch } from './client.js';

export async function getStudentsForSupervisor() {
  return apiFetch('/supervisors/students');
}

export async function submitVerification(supervisorUsername, data) {
  return apiFetch('/supervisors/verifications', { method: 'POST', body: JSON.stringify(data) });
}

export async function getVerifications() {
  return apiFetch('/supervisors/verifications');
}
