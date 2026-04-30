import { store } from './store/index.js';

function colKey(username) { return `logs_${username}`; }

export async function getLogs(username) {
  return store.list(colKey(username));
}

export async function getLog(username, id) {
  return store.get(colKey(username), id);
}

export async function createLog(username, data) {
  const id  = `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const log = { ...data, id, username, createdAt: new Date().toISOString() };
  return store.set(colKey(username), id, log);
}

export async function updateLog(username, id, data) {
  const existing = await store.get(colKey(username), id);
  if (!existing) throw Object.assign(new Error('Log not found.'), { status: 404 });
  const updated = { ...existing, ...data, id, username };
  return store.set(colKey(username), id, updated);
}

export async function deleteLog(username, id) {
  const existing = await store.get(colKey(username), id);
  if (!existing) throw Object.assign(new Error('Log not found.'), { status: 404 });
  await store.delete(colKey(username), id);
}
