const VERIFICATIONS_KEY = 'iles_f2_verifications';

const MOCK_STUDENTS = [
  { username: 'student1', name: 'Alice Johnson',  email: 'alice@iles.edu', program: 'Computer Science', university: 'State University' },
  { username: 'student2', name: 'Bob Martinez',   email: 'bob@iles.edu',   program: 'Information Systems', university: 'Tech College' },
];

export async function getStudentsForSupervisor(supervisorUsername) {
  return MOCK_STUDENTS;
}

export async function submitVerification(supervisorUsername, data) {
  const raw = localStorage.getItem(VERIFICATIONS_KEY);
  const all = raw ? JSON.parse(raw) : [];
  const entry = { ...data, id: `ver_${Date.now()}`, supervisorUsername, createdAt: new Date().toISOString() };
  all.push(entry);
  localStorage.setItem(VERIFICATIONS_KEY, JSON.stringify(all));
  return entry;
}

export async function getVerifications(supervisorUsername) {
  const raw = localStorage.getItem(VERIFICATIONS_KEY);
  const all = raw ? JSON.parse(raw) : [];
  return all.filter(v => v.supervisorUsername === supervisorUsername);
}
