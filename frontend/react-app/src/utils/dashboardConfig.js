/**
 * Dashboard Configuration Utility
 * Persists per-user widget layout preferences in localStorage.
 *
 * Storage key: iles_dash_config_<username>
 * Shape: { widgets: [{ id, visible, order, settings }] }
 */

const PREFIX = 'iles_dash_config_';

/** Default widget definitions per role */
export const DEFAULT_CONFIGS = {
  student: {
    widgets: [
      { id: 'tasks',         label: '📋 My Tasks',               visible: true,  order: 0, settings: { showDone: true } },
      { id: 'applications',  label: '📁 Internship Applications', visible: true,  order: 1, settings: {} },
      { id: 'progress',      label: '📊 Progress Tracker',        visible: true,  order: 2, settings: {} },
      { id: 'announcements', label: '📢 Announcements',            visible: false, order: 3, settings: {} },
    ],
  },
  academic: {
    widgets: [
      { id: 'students',      label: '👩‍🎓 Student Overview', visible: true,  order: 0, settings: {} },
      { id: 'pending',       label: '⏳ Pending Reviews',    visible: true,  order: 1, settings: {} },
      { id: 'schedule',      label: '📅 Schedule',           visible: true,  order: 2, settings: {} },
      { id: 'announcements', label: '📢 Announcements',      visible: false, order: 3, settings: {} },
    ],
  },
  supervisor: {
    widgets: [
      { id: 'interns',       label: '👷 Intern Roster',    visible: true,  order: 0, settings: {} },
      { id: 'stats',         label: '📈 Feedback Stats',   visible: true,  order: 1, settings: {} },
      { id: 'schedule',      label: '📅 Schedule',         visible: true,  order: 2, settings: {} },
      { id: 'announcements', label: '📢 Announcements',    visible: false, order: 3, settings: {} },
    ],
  },
};

/** Load config for a user; falls back to the role default. */
export function loadConfig(username, role) {
  try {
    const raw = localStorage.getItem(PREFIX + username);
    if (raw) {
      const stored = JSON.parse(raw);
      const defaults = DEFAULT_CONFIGS[role]?.widgets ?? [];
      const storedIds = new Set(stored.widgets.map(w => w.id));
      const merged = [
        ...stored.widgets,
        ...defaults
          .filter(w => !storedIds.has(w.id))
          .map(w => ({ ...w, order: stored.widgets.length + w.order })),
      ].sort((a, b) => a.order - b.order);
      return { widgets: merged };
    }
  } catch (_) { /* ignore */ }
  return structuredClone(DEFAULT_CONFIGS[role] ?? { widgets: [] });
}

/** Save config for a user. */
export function saveConfig(username, config) {
  localStorage.setItem(PREFIX + username, JSON.stringify(config));
}

/** Reset config for a user back to role default. */
export function resetConfig(username, role) {
  localStorage.removeItem(PREFIX + username);
  return structuredClone(DEFAULT_CONFIGS[role] ?? { widgets: [] });
}

/** List all users that have a stored config (for admin view). */
export function listStoredUsers() {
  const users = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX)) {
      users.push(key.slice(PREFIX.length));
    }
  }
  return users;
}

/** Admin: load a specific user's config (with role default fallback). */
export function adminLoadConfig(username, role) {
  return loadConfig(username, role);
}

/** Admin: reset a specific user's config to default. */
export function adminResetConfig(username, role) {
  return resetConfig(username, role);
}
