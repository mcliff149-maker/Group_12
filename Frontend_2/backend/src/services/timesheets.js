import { store } from './store/index.js';

function colKey(username) { return `timesheets_${username}`; }

export async function getTimesheets(username) {
  return store.list(colKey(username));
}

export async function createTimesheet(username, data) {
  const id    = `ts_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const entry = { ...data, id, username, createdAt: new Date().toISOString() };
  return store.set(colKey(username), id, entry);
}

export async function updateTimesheet(username, id, data) {
  const existing = await store.get(colKey(username), id);
  if (!existing) throw Object.assign(new Error('Timesheet not found.'), { status: 404 });
  const updated = { ...existing, ...data, id, username };
  return store.set(colKey(username), id, updated);
}

export async function deleteTimesheet(username, id) {
  const existing = await store.get(colKey(username), id);
  if (!existing) throw Object.assign(new Error('Timesheet not found.'), { status: 404 });
  await store.delete(colKey(username), id);
}
