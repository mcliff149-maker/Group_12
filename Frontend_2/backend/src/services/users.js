import bcrypt from 'bcryptjs';
import { store } from './store/index.js';

const COLLECTION = 'users';
const SALT_ROUNDS = 10;

export async function seedUsers() {
  return;
}

export function publicView(user) {
  const { pwHash: _p, ...rest } = user;
  return rest;
}

export async function findByUsername(username) {
  return store.get(COLLECTION, username);
}

export async function findByEmail(email) {
  const all = await store.list(COLLECTION);
  return all.find(u => u.email === email) ?? null;
}

export async function listUsers() {
  const all = await store.list(COLLECTION);
  return all.map(publicView);
}

export async function createUser({ username, name, email, password, role }) {
  if (await findByUsername(username)) throw Object.assign(new Error('Username already taken.'), { status: 409 });
  if (await findByEmail(email))       throw Object.assign(new Error('Email already registered.'), { status: 409 });
  const pwHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = { username, name, email, pwHash, role, disabled: false };
  await store.set(COLLECTION, username, user);
  return publicView(user);
}

export async function verifyCredentials(username, password, role) {
  const user = await findByUsername(username);
  if (!user) throw Object.assign(new Error('Invalid credentials or role.'), { status: 401 });
  const match = await bcrypt.compare(password, user.pwHash);
  if (!match || user.role !== role) throw Object.assign(new Error('Invalid credentials or role.'), { status: 401 });
  if (user.disabled) throw Object.assign(new Error('This account has been disabled.'), { status: 403 });
  return user;
}

export async function toggleDisable(username) {
  const user = await findByUsername(username);
  if (!user) throw Object.assign(new Error('User not found.'), { status: 404 });
  user.disabled = !user.disabled;
  await store.set(COLLECTION, username, user);
  return publicView(user);
}
