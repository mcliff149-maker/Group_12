import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { createUser, findByUsername, findByEmail } from '../services/users.js';

async function ask(rl, question, fallback = '') {
  const value = (await rl.question(question)).trim();
  return value || fallback;
}

async function run() {
  const rl = readline.createInterface({ input, output });
  try {
    const username = (process.env.ADMIN_USERNAME || await ask(rl, 'Admin username: ')).trim().toLowerCase();
    const name = (process.env.ADMIN_NAME || await ask(rl, 'Admin full name: ')).trim();
    const email = (process.env.ADMIN_EMAIL || await ask(rl, 'Admin email: ')).trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || await ask(rl, 'Admin password (min 6 chars): ');

    if (!username || username.length < 3) throw new Error('Username must be at least 3 characters.');
    if (!name) throw new Error('Full name is required.');
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('A valid email is required.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');
    if (await findByUsername(username)) throw new Error(`Username "${username}" already exists.`);
    if (await findByEmail(email)) throw new Error(`Email "${email}" is already registered.`);

    const user = await createUser({ username, name, email, password, role: 'admin' });
    output.write(`Created admin user: ${user.username}\n`);
  } finally {
    rl.close();
  }
}

run().catch(err => {
  console.error(err.message);
  process.exit(1);
});
