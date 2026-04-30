import { isBackendEnabled, apiFetch } from './client.js';

function logsKey(username) { return `iles_f2_logs_${username}`; }
function timesheetsKey(username) { return `iles_f2_timesheets_${username}`; }

export async function getLogs(username) {
  if (isBackendEnabled()) {
    return apiFetch(`/students/${encodeURIComponent(username)}/logs`);
  }
  const raw = localStorage.getItem(logsKey(username));
  return raw ? JSON.parse(raw) : [];
}

export async function saveLog(username, log) {
  if (isBackendEnabled()) {
    if (log.id) {
      return apiFetch(`/students/${encodeURIComponent(username)}/logs/${encodeURIComponent(log.id)}`, {
        method: 'PUT',
        body: JSON.stringify(log),
      });
    }
    return apiFetch(`/students/${encodeURIComponent(username)}/logs`, {
      method: 'POST',
      body: JSON.stringify(log),
    });
  }
  const logs = await getLogs(username);
  if (log.id) {
    const idx = logs.findIndex(l => l.id === log.id);
    if (idx !== -1) { logs[idx] = log; }
    else { logs.push(log); }
  } else {
    log.id = `log_${Date.now()}`;
    log.createdAt = new Date().toISOString();
    logs.push(log);
  }
  localStorage.setItem(logsKey(username), JSON.stringify(logs));
  return log;
}

export async function deleteLog(username, logId) {
  if (isBackendEnabled()) {
    return apiFetch(`/students/${encodeURIComponent(username)}/logs/${encodeURIComponent(logId)}`, { method: 'DELETE' });
  }
  const logs = await getLogs(username);
  const updated = logs.filter(l => l.id !== logId);
  localStorage.setItem(logsKey(username), JSON.stringify(updated));
}

export async function getTimesheets(username) {
  if (isBackendEnabled()) {
    return apiFetch(`/students/${encodeURIComponent(username)}/timesheets`);
  }
  const raw = localStorage.getItem(timesheetsKey(username));
  return raw ? JSON.parse(raw) : [];
}

export async function saveTimesheet(username, ts) {
  if (isBackendEnabled()) {
    if (ts.id) {
      return apiFetch(`/students/${encodeURIComponent(username)}/timesheets/${encodeURIComponent(ts.id)}`, {
        method: 'PUT',
        body: JSON.stringify(ts),
      });
    }
    return apiFetch(`/students/${encodeURIComponent(username)}/timesheets`, {
      method: 'POST',
      body: JSON.stringify(ts),
    });
  }
  const sheets = await getTimesheets(username);
  if (ts.id) {
    const idx = sheets.findIndex(s => s.id === ts.id);
    if (idx !== -1) { sheets[idx] = ts; }
    else { sheets.push(ts); }
  } else {
    ts.id = `ts_${Date.now()}`;
    ts.createdAt = new Date().toISOString();
    sheets.push(ts);
  }
  localStorage.setItem(timesheetsKey(username), JSON.stringify(sheets));
  return ts;
}
