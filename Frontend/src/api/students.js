import { apiFetch } from './client.js';

export async function getLogs(username) {
  return apiFetch(`/students/${encodeURIComponent(username)}/logs`);
}

export async function saveLog(username, log) {
  if (log.id) {
    return apiFetch(`/students/${encodeURIComponent(username)}/logs/${encodeURIComponent(log.id)}`, {
      method: 'PUT',
      body: JSON.stringify(log),
    });
  }
  return apiFetch(`/students/${encodeURIComponent(username)}/logs`, {
    method: 'POST',
    body: JSON.stringify(log),
  });
}

export async function deleteLog(username, logId) {
  return apiFetch(`/students/${encodeURIComponent(username)}/logs/${encodeURIComponent(logId)}`, { method: 'DELETE' });
}

export async function getTimesheets(username) {
  return apiFetch(`/students/${encodeURIComponent(username)}/timesheets`);
}

export async function saveTimesheet(username, ts) {
  if (ts.id) {
    return apiFetch(`/students/${encodeURIComponent(username)}/timesheets/${encodeURIComponent(ts.id)}`, {
      method: 'PUT',
      body: JSON.stringify(ts),
    });
  }
  return apiFetch(`/students/${encodeURIComponent(username)}/timesheets`, {
    method: 'POST',
    body: JSON.stringify(ts),
  });
}
