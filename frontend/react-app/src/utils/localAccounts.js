const ACCOUNTS_KEY = 'iles_react_accounts';

export function hashCredential(value) {
  let h = 5381;
  for (let i = 0; i < value.length; i++) {
    h = Math.imul(h << 5, h) ^ value.charCodeAt(i);
  }
  return (h >>> 0).toString(16);
}

export function listLocalAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}
