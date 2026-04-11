import { getAccounts, signUp, disableAccount } from './auth.js';

export async function getAllUsers() {
  return getAccounts();
}

export async function createUser(data) {
  return signUp(data);
}

export async function toggleDisableUser(username) {
  return disableAccount(username);
}
