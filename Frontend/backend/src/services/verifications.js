import { store } from './store/index.js';

const COLLECTION = 'verifications';

export async function getVerifications(supervisorUsername) {
  const all = await store.list(COLLECTION);
  return all.filter(v => v.supervisorUsername === supervisorUsername);
}

export async function submitVerification(supervisorUsername, data) {
  const id    = `ver_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const entry = { ...data, id, supervisorUsername, createdAt: new Date().toISOString() };
  return store.set(COLLECTION, id, entry);
}
