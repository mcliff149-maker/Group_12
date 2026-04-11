function logsKey(username) { return `iles_f2_logs_${username}`; }
function timesheetsKey(username) { return `iles_f2_timesheets_${username}`; }

export async function getLogs(username) {
  const raw = localStorage.getItem(logsKey(username));
  return raw ? JSON.parse(raw) : [];
}

export async function saveLog(username, log) {
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
  const logs = await getLogs(username);
  const updated = logs.filter(l => l.id !== logId);
  localStorage.setItem(logsKey(username), JSON.stringify(updated));
}

export async function getTimesheets(username) {
  const raw = localStorage.getItem(timesheetsKey(username));
  return raw ? JSON.parse(raw) : [];
}

export async function saveTimesheet(username, ts) {
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
