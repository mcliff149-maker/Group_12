import { apiFetch } from './client.js';

export async function getStudents() {
  return apiFetch('/academic/students');
}

export async function getReviews() {
  return apiFetch('/academic/reviews');
}

export async function submitReview(data) {
  return apiFetch('/academic/reviews', { method: 'POST', body: JSON.stringify(data) });
}

export async function getStudentLogs(username) {
  return apiFetch(`/academic/students/${encodeURIComponent(username)}/logs`);
}
