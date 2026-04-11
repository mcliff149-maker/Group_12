import { isBackendEnabled, apiFetch } from './client.js';

const ACCOUNTS_KEY = 'iles_f2_accounts';

/**
 * Simple djb2-based hash for mock credential storage.
 * Passwords are never stored in plaintext; only their hash is persisted.
 */
function hashCredential(value) {
  let h = 5381;
  for (let i = 0; i < value.length; i++) {
    h = Math.imul(h << 5, h) ^ value.charCodeAt(i);
  }
  return (h >>> 0).toString(16);
}

const DEMO_ACCOUNTS = [
  { username: 'student1',    name: 'Alice Johnson',  email: 'alice@iles.edu',    pwHash: hashCredential('pass123'),  role: 'student',    disabled: false },
  { username: 'academic1',   name: 'Dr. Sarah Chen', email: 'schen@iles.edu',    pwHash: hashCredential('pass123'),  role: 'academic',   disabled: false },
  { username: 'supervisor1', name: 'James Wright',   email: 'jwright@corp.com',  pwHash: hashCredential('pass123'),  role: 'supervisor', disabled: false },
  { username: 'admin',       name: 'System Admin',   email: 'admin@iles.edu',    pwHash: hashCredential('admin123'), role: 'admin',      disabled: false },
  { username: 'student2',    name: 'Bob Martinez',   email: 'bob@iles.edu',      pwHash: hashCredential('pass123'),  role: 'student',    disabled: false },
];

function seedAccounts() {
  if (!localStorage.getItem(ACCOUNTS_KEY)) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(DEMO_ACCOUNTS));
  }
}

function loadAccounts() {
  seedAccounts();
  return JSON.parse(localStorage.getItem(ACCOUNTS_KEY));
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function signIn(username, password, role) {
  if (isBackendEnabled()) {
    return apiFetch('/auth/signin', { method: 'POST', body: JSON.stringify({ username, password, role }) });
  }
  const accounts = loadAccounts();
  const hash = hashCredential(password);
  const account = accounts.find(
    a => a.username === username && a.pwHash === hash && a.role === role
  );
  if (!account) throw new Error('Invalid credentials or role.');
  if (account.disabled) throw new Error('This account has been disabled.');
  const user = { username: account.username, name: account.name, email: account.email, role: account.role };
  const token = btoa(`${username}:${Date.now()}`);
  return { user, token };
}

export async function signUp(data) {
  if (isBackendEnabled()) {
    return apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(data) });
  }
  const accounts = loadAccounts();
  if (accounts.find(a => a.username === data.username)) {
    throw new Error('Username already taken.');
  }
  if (accounts.find(a => a.email === data.email)) {
    throw new Error('Email already registered.');
  }
  const newAccount = {
    username: data.username,
    name: data.name,
    email: data.email,
    pwHash: hashCredential(data.password),
    role: data.role,
    disabled: false,
  };
  accounts.push(newAccount);
  saveAccounts(accounts);
  return newAccount;
}

export async function getAccounts() {
  if (isBackendEnabled()) {
    return apiFetch('/admin/users');
  }
  return loadAccounts();
}

export async function disableAccount(username) {
  if (isBackendEnabled()) {
    return apiFetch(`/admin/users/${encodeURIComponent(username)}/toggle-disable`, { method: 'PATCH' });
  }
  const accounts = loadAccounts();
  const idx = accounts.findIndex(a => a.username === username);
  if (idx === -1) throw new Error('User not found.');
  accounts[idx].disabled = !accounts[idx].disabled;
  saveAccounts(accounts);
  return accounts[idx];
}
