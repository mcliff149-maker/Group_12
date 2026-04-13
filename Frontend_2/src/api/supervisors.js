import { isBackendEnabled, apiFetch } from './client.js';

const VERIFICATIONS_KEY = 'iles_f2_verifications';
const ACCOUNTS_KEY = 'iles_f2_accounts';

function loadStudentAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    const accounts = raw ? JSON.parse(raw) : [];
    return accounts
      .filter(a => a.role === 'student')
      .map(a => ({ username: a.username, name: a.name, email: a.email, program: '', university: '' }));
  } catch {
    return [];
  }
}

export async function getStudentsForSupervisor(supervisorUsername) {
  if (isBackendEnabled()) {
    return apiFetch('/supervisors/students');
  }
  return loadStudentAccounts();
}

export async function submitVerification(supervisorUsername, data) {
  if (isBackendEnabled()) {
    return apiFetch('/supervisors/verifications', { method: 'POST', body: JSON.stringify(data) });
  }
  const raw = localStorage.getItem(VERIFICATIONS_KEY);
  const all = raw ? JSON.parse(raw) : [];
  const entry = { ...data, id: `ver_${Date.now()}`, supervisorUsername, createdAt: new Date().toISOString() };
  all.push(entry);
  localStorage.setItem(VERIFICATIONS_KEY, JSON.stringify(all));
  return entry;
}

export async function getVerifications(supervisorUsername) {
  if (isBackendEnabled()) {
    return apiFetch('/supervisors/verifications');
  }
  const raw = localStorage.getItem(VERIFICATIONS_KEY);
  const all = raw ? JSON.parse(raw) : [];
  return all.filter(v => v.supervisorUsername === supervisorUsername);
}
